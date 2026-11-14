import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { formatDate, formatDateTime } from '@/lib/date';
import { generateRevenueExcelReport } from '@/lib/excel-report-generator';

/**
 * FR-047 – Quản lý báo cáo doanh thu & BR-028
 * Điều kiện lọc: startDate, endDate
 * Kết quả: total_revenue, total_orders, average_order_value, successful_orders, cancelled_orders
 * Quy tắc nghiệp vụ Chỉ tính doanh thu từ các đơn hàng có trạng thái Đã giao (DA_GIAO).
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const format = searchParams.get('format'); // 'excel' | 'csv' | 'json'

    // TC_REPORT_002: Kiểm tra ngày bắt đầu không được lớn hơn ngày kết thúc
    if (startDate && endDate && startDate > endDate) {
      return NextResponse.json(
        {
          success: false,
          message: 'Ngày bắt đầu không được lớn hơn ngày kết thúc!'
        },
        { status: 400 }
      );
    }

    let dateCondition = '';
    const dateParams = [];

    if (startDate) {
      dateCondition += ` AND DATE(o.created_at) >= ?`;
      dateParams.push(startDate);
    }
    if (endDate) {
      dateCondition += ` AND DATE(o.created_at) <= ?`;
      dateParams.push(endDate);
    }

    // 1. Chỉ số tổng hợp cốt lõi FR-047 (Áp dụng Chỉ tính đơn DA_GIAO vào doanh thu)
    const summarySql = `
      SELECT 
        COUNT(o.id) as total_orders,
        COALESCE(SUM(CASE WHEN o.order_status = 'DA_GIAO' THEN o.total_amount ELSE 0 END), 0) as total_revenue,
        COALESCE(SUM(CASE WHEN o.order_status = 'DA_GIAO' THEN 1 ELSE 0 END), 0) as successful_orders,
        COALESCE(SUM(CASE WHEN o.order_status = 'DA_HUY' THEN 1 ELSE 0 END), 0) as cancelled_orders,
        COALESCE(SUM(CASE WHEN o.order_status = 'CHO_XAC_NHAN' THEN 1 ELSE 0 END), 0) as pending_orders,
        COALESCE(SUM(CASE WHEN o.order_status = 'DANG_GIAO' THEN 1 ELSE 0 END), 0) as shipping_orders
      FROM orders o
      WHERE 1=1 ${dateCondition}
    `;
    const summaryRows = await query(summarySql, dateParams);
    const summary = summaryRows[0] || {
      total_orders: 0,
      total_revenue: 0,
      successful_orders: 0,
      cancelled_orders: 0,
      pending_orders: 0,
      shipping_orders: 0
    };

    const totalRevenue = parseFloat(summary.total_revenue) || 0;
    const totalOrders = parseInt(summary.total_orders, 10) || 0;
    const successfulOrders = parseInt(summary.successful_orders, 10) || 0;
    const cancelledOrders = parseInt(summary.cancelled_orders, 10) || 0;
    const averageOrderValue = successfulOrders > 0 ? Math.round(totalRevenue / successfulOrders) : 0;

    // 2. Doanh thu theo từng ngày trong khoảng thời gian
    const timelineSql = `
      SELECT 
        DATE_FORMAT(o.created_at, '%Y-%m-%d') as date,
        COUNT(o.id) as total_orders,
        COALESCE(SUM(CASE WHEN o.order_status = 'DA_GIAO' THEN o.total_amount ELSE 0 END), 0) as revenue,
        COALESCE(SUM(CASE WHEN o.order_status = 'DA_GIAO' THEN 1 ELSE 0 END), 0) as successful_orders,
        COALESCE(SUM(CASE WHEN o.order_status = 'DA_HUY' THEN 1 ELSE 0 END), 0) as cancelled_orders
      FROM orders o
      WHERE 1=1 ${dateCondition}
      GROUP BY DATE_FORMAT(o.created_at, '%Y-%m-%d')
      ORDER BY date ASC
    `;
    const timeline = await query(timelineSql, dateParams);

    // 3. Phân bổ doanh thu theo phương thức thanh toán (chỉ tính đơn DA_GIAO theo BR-028)
    const paymentSql = `
      SELECT 
        COALESCE(p.payment_method, 'COD') as payment_method,
        COUNT(o.id) as order_count,
        COALESCE(SUM(o.total_amount), 0) as total_amount
      FROM orders o
      LEFT JOIN payments p ON p.order_id = o.id
      WHERE o.order_status = 'DA_GIAO' ${dateCondition}
      GROUP BY p.payment_method
    `;
    const paymentBreakdown = await query(paymentSql, dateParams);

    // 4. Top sản phẩm bán chạy nhất mang lại doanh thu thực tế (chỉ tính đơn DA_GIAO theo BR-028)
    const topProductsSql = `
      SELECT 
        p.id, p.name, p.thumbnail, p.price,
        SUM(od.quantity) as total_sold,
        SUM(od.subtotal) as total_revenue
      FROM order_details od
      JOIN products p ON od.product_id = p.id
      JOIN orders o ON od.order_id = o.id
      WHERE o.order_status = 'DA_GIAO' ${dateCondition}
      GROUP BY p.id, p.name, p.thumbnail, p.price
      ORDER BY total_sold DESC
      LIMIT 6
    `;
    const topProducts = await query(topProductsSql, dateParams);

    // 5. Danh sách đơn hàng chi tiết trong khoảng thời gian
    const ordersSql = `
      SELECT 
        o.id, o.order_code, o.receiver_name, o.phone, o.total_amount,
        o.order_status, o.payment_status, o.created_at
      FROM orders o
      WHERE 1=1 ${dateCondition}
      ORDER BY o.created_at DESC
      LIMIT 100
    `;
    const orders = await query(ordersSql, dateParams);

    // Xuất file Excel (.xlsx) chuẩn doanh nghiệp Office (TC_REPORT_003)
    if (format === 'excel' || format === 'xlsx') {
      const xlsxBuffer = await generateRevenueExcelReport({
        orders,
        summary: {
          total_revenue: totalRevenue,
          total_orders: totalOrders,
          successful_orders: successfulOrders,
          cancelled_orders: cancelledOrders,
          average_order_value: averageOrderValue,
        },
        startDate,
        endDate
      });

      return new Response(xlsxBuffer, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="Bao-cao-doanh-thu-${startDate || 'all'}-${endDate || 'now'}.xlsx"`
        }
      });
    }

    return NextResponse.json({
      success: true,
      filter: {
        startDate: startDate || null,
        endDate: endDate || null
      },
      data: {
        total_revenue: totalRevenue,
        total_orders: totalOrders,
        successful_orders: successfulOrders,
        cancelled_orders: cancelledOrders,
        average_order_value: averageOrderValue,
        pending_orders: parseInt(summary.pending_orders, 10) || 0,
        shipping_orders: parseInt(summary.shipping_orders, 10) || 0,
        timeline,
        paymentBreakdown,
        topProducts,
        orders
      }
    });
  } catch (error) {
    console.error('Error fetching revenue report:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
