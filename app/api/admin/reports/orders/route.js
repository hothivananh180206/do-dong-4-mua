import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { formatDate, formatDateTime } from '@/lib/date';
import { generateOrdersExcelReport } from '@/lib/excel-report-generator';

/**
 * FR-050: Báo cáo đơn hàng (Order Report)
 * Đặc tả SRS:
 * - Mục đích: Thống kê đơn hàng theo khoảng thời gian.
 * - Điều kiện tìm kiếm: Từ ngày (startDate), Đến ngày (endDate).
 * - Kết quả bắt buộc:
 *   + Tổng số đơn hàng (total_orders).
 *   + Đơn chờ xử lý (pending_orders).
 *   + Đơn đang giao (shipping_orders).
 *   + Đơn đã giao (delivered_orders).
 *   + Đơn tạm dừng (on_hold_orders).
 *   + Đơn hủy (cancelled_orders).
 * - Quy tắc nghiệp vụ:
 *   + Hỗ trợ xuất dữ liệu sang Excel / PDF (TC_REPORT_003).
 *   + Doanh thu đơn hàng tính theo BR-028 (chỉ tính đơn DA_GIAO).
 * - Tiêu chuẩn kiểm thử:
 *   + TC_REPORT_001: Khoảng thời gian hợp lệ -> hiển thị báo cáo.
 *   + TC_REPORT_002: Ngày bắt đầu > ngày kết thúc -> trả về lỗi 400.
 *   + TC_REPORT_003: Xuất file Excel/CSV thành công (UTF-8 BOM).
 *   + TC_REPORT_005: Xử lý hiển thị khi không có dữ liệu phù hợp.
 */

const ORDER_STATUS_LABELS = {
  'CHO_XAC_NHAN': 'Chờ xác nhận (COD)',
  'CHO_THANH_TOAN': 'Chờ thanh toán (VietQR)',
  'DA_XAC_NHAN': 'Đã xác nhận đơn hàng',
  'DANG_CHUAN_BI': 'Đang chuẩn bị hàng',
  'TAM_DUNG': 'Tạm dừng xử lý',
  'DANG_GIAO': 'Đang giao hàng (GreenSM)',
  'DA_GIAO': 'Giao hàng thành công',
  'DA_HUY': 'Đã hủy đơn hàng'
};

const PAYMENT_METHOD_LABELS = {
  'COD': 'Thanh toán tiền mặt khi nhận hàng (COD)',
  'VIETQR': 'Thanh toán trực tuyến quét mã VietQR',
  'BANK_TRANSFER': 'Chuyển khoản ngân hàng',
  'VNPAY': 'Cổng thanh toán VNPay'
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const search = searchParams.get('search')?.trim();
    const orderStatus = searchParams.get('orderStatus'); // 'all' hoặc từng trạng thái cụ thể
    const paymentStatus = searchParams.get('paymentStatus'); // 'all' | 'PAID' | 'UNPAID'
    const format = searchParams.get('format'); // 'excel' | 'csv' | null

    // 1. Kiểm tra tính hợp lệ của khoảng thời gian (TC_REPORT_002)
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (start > end) {
        return NextResponse.json(
          {
            success: false,
            message: 'Ngày bắt đầu không được lớn hơn ngày kết thúc!'
          },
          { status: 400 }
        );
      }
    }

    // 2. Xây dựng điều kiện lọc
    let conditions = ['1=1'];
    let params = [];

    if (search) {
      conditions.push('(o.order_code LIKE ? OR o.receiver_name LIKE ? OR o.phone LIKE ?)');
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (orderStatus && orderStatus !== 'all') {
      if (orderStatus === 'PENDING_GROUP') {
        conditions.push("o.order_status IN ('CHO_XAC_NHAN', 'CHO_THANH_TOAN', 'DA_XAC_NHAN', 'DANG_CHUAN_BI')");
      } else {
        conditions.push('o.order_status = ?');
        params.push(orderStatus);
      }
    }

    if (paymentStatus && paymentStatus !== 'all') {
      conditions.push('o.payment_status = ?');
      params.push(paymentStatus);
    }

    if (startDate) {
      conditions.push('DATE(o.created_at) >= ?');
      params.push(startDate);
    }
    if (endDate) {
      conditions.push('DATE(o.created_at) <= ?');
      params.push(endDate);
    }

    const whereClause = conditions.join(' AND ');

    // 3. Truy vấn tổng hợp chỉ số đơn hàng theo đúng kết quả bắt buộc của SRS FR-050
    const summaryQuery = `
      SELECT
        COUNT(*) as total_orders,
        COALESCE(SUM(CASE WHEN o.order_status IN ('CHO_XAC_NHAN', 'CHO_THANH_TOAN', 'DA_XAC_NHAN', 'DANG_CHUAN_BI') THEN 1 ELSE 0 END), 0) as pending_orders,
        COALESCE(SUM(CASE WHEN o.order_status = 'DANG_GIAO' THEN 1 ELSE 0 END), 0) as shipping_orders,
        COALESCE(SUM(CASE WHEN o.order_status = 'DA_GIAO' THEN 1 ELSE 0 END), 0) as delivered_orders,
        COALESCE(SUM(CASE WHEN o.order_status = 'TAM_DUNG' THEN 1 ELSE 0 END), 0) as on_hold_orders,
        COALESCE(SUM(CASE WHEN o.order_status = 'DA_HUY' THEN 1 ELSE 0 END), 0) as cancelled_orders,
        COALESCE(SUM(CASE WHEN o.order_status = 'DA_GIAO' THEN o.total_amount ELSE 0 END), 0) as total_revenue,
        COALESCE(SUM(o.total_amount), 0) as gross_order_value,
        COALESCE(SUM(CASE WHEN o.payment_status = 'PAID' THEN 1 ELSE 0 END), 0) as paid_orders_count
      FROM orders o
      WHERE ${whereClause}
    `;
    const summaryRes = await query(summaryQuery, params);
    const summary = summaryRes[0] || {
      total_orders: 0,
      pending_orders: 0,
      shipping_orders: 0,
      delivered_orders: 0,
      on_hold_orders: 0,
      cancelled_orders: 0,
      total_revenue: 0,
      gross_order_value: 0,
      paid_orders_count: 0
    };

    const totalOrdersCount = Number(summary.total_orders);
    const deliveredCount = Number(summary.delivered_orders);
    const completionRate = totalOrdersCount > 0
      ? Math.round((deliveredCount / totalOrdersCount) * 100 * 10) / 10
      : 0;

    // 4. Phân bổ đơn hàng theo từng trạng thái cụ thể
    const statusBreakdownQuery = `
      SELECT
        o.order_status,
        COUNT(o.id) as count,
        COALESCE(SUM(o.total_amount), 0) as total_value
      FROM orders o
      WHERE ${whereClause}
      GROUP BY o.order_status
      ORDER BY count DESC
    `;
    const statusBreakdown = await query(statusBreakdownQuery, params);

    // 5. Phân bổ theo phương thức thanh toán
    const paymentBreakdownQuery = `
      SELECT
        COALESCE(p.payment_method, 'COD') as payment_method,
        COUNT(DISTINCT o.id) as order_count,
        COALESCE(SUM(o.total_amount), 0) as total_amount
      FROM orders o
      LEFT JOIN payments p ON p.order_id = o.id
      WHERE ${whereClause}
      GROUP BY COALESCE(p.payment_method, 'COD')
    `;
    const paymentBreakdown = await query(paymentBreakdownQuery, params);

    // 6. Truy vấn danh sách chi tiết đơn hàng
    const ordersListQuery = `
      SELECT
        o.id,
        o.order_code,
        o.receiver_name,
        o.phone,
        o.address,
        o.subtotal,
        o.shipping_fee,
        o.total_amount,
        o.payment_status,
        o.order_status,
        o.created_at,
        o.note,
        COALESCE(p.payment_method, 'COD') as payment_method,
        (SELECT COUNT(*) FROM order_details od WHERE od.order_id = o.id) as item_count,
        (SELECT COALESCE(SUM(quantity), 0) FROM order_details od WHERE od.order_id = o.id) as total_quantity
      FROM orders o
      LEFT JOIN payments p ON p.order_id = o.id
      WHERE ${whereClause}
      ORDER BY o.created_at DESC, o.id DESC
    `;
    const ordersList = await query(ordersListQuery, params);

    // 7. Xử lý xuất file Excel (.xlsx) chuẩn Office 365 (TC_REPORT_003)
    if (format === 'excel' || format === 'xlsx' || format === 'csv') {
      const xlsxBuffer = await generateOrdersExcelReport({
        orders: ordersList,
        summary: {
          total_orders: totalOrdersCount,
          pending_orders: summary.pending_orders,
          shipping_orders: summary.shipping_orders,
          delivered_orders: summary.delivered_orders,
          on_hold_orders: summary.on_hold_orders,
          cancelled_orders: summary.cancelled_orders,
          total_revenue: summary.total_revenue,
          gross_order_value: summary.gross_order_value,
          paid_orders_count: summary.paid_orders_count,
        },
        startDate,
        endDate
      });

      return new Response(xlsxBuffer, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="Bao-cao-don-hang-${startDate || 'all'}-${endDate || 'now'}.xlsx"`
        }
      });
    }

    // 8. Trả về kết quả JSON cho Dashboard Admin
    return NextResponse.json({
      success: true,
      filter: {
        startDate: startDate || null,
        endDate: endDate || null,
        search: search || null,
        orderStatus: orderStatus || 'all',
        paymentStatus: paymentStatus || 'all'
      },
      data: {
        summary: {
          total_orders: totalOrdersCount,
          pending_orders: Number(summary.pending_orders),
          shipping_orders: Number(summary.shipping_orders),
          delivered_orders: Number(summary.delivered_orders),
          on_hold_orders: Number(summary.on_hold_orders),
          cancelled_orders: Number(summary.cancelled_orders),
          total_revenue: Number(summary.total_revenue),
          gross_order_value: Number(summary.gross_order_value),
          paid_orders_count: Number(summary.paid_orders_count),
          completion_rate: completionRate
        },
        status_breakdown: statusBreakdown.map(s => ({
          status: s.order_status,
          label: ORDER_STATUS_LABELS[s.order_status] || s.order_status,
          count: Number(s.count),
          total_value: Number(s.total_value)
        })),
        payment_breakdown: paymentBreakdown.map(p => ({
          method: p.payment_method,
          label: PAYMENT_METHOD_LABELS[p.payment_method] || p.payment_method,
          order_count: Number(p.order_count),
          total_amount: Number(p.total_amount)
        })),
        orders: ordersList.map(o => ({
          id: o.id,
          order_code: o.order_code,
          receiver_name: o.receiver_name,
          phone: o.phone,
          address: o.address,
          subtotal: Number(o.subtotal),
          shipping_fee: Number(o.shipping_fee),
          total_amount: Number(o.total_amount),
          payment_status: o.payment_status,
          payment_method: o.payment_method,
          order_status: o.order_status,
          order_status_label: ORDER_STATUS_LABELS[o.order_status] || o.order_status,
          created_at: o.created_at,
          item_count: Number(o.item_count || 1),
          total_quantity: Number(o.total_quantity || 1)
        }))
      }
    });
  } catch (error) {
    console.error('Lỗi API Báo cáo đơn hàng:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Lỗi máy chủ khi lấy dữ liệu báo cáo đơn hàng: ' + error.message
      },
      { status: 500 }
    );
  }
}
