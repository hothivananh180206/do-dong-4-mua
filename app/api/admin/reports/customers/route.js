import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { formatDate, formatDateTime } from '@/lib/date';
import { generateCustomersExcelReport } from '@/lib/excel-report-generator';

/**
 * FR-048 – Báo cáo khách hàng (Module Reporting, API 74)
 * Điều kiện lọc: startDate, endDate, search
 * Nội dung: Tổng số khách hàng, Số khách hàng mới, Số khách hàng phát sinh đơn hàng, Số đơn hàng của từng khách
 * Quy tắc nghiệp vụ: Một khách hàng được xác định duy nhất bằng số điện thoại.
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const search = searchParams.get('search');
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

    // 1. Tổng số khách hàng trong toàn hệ thống (role_id = 3)
    const [totalCustRow] = await query(
      `SELECT COUNT(*) as total FROM users WHERE role_id = 3`
    );
    const totalCustomers = totalCustRow?.total || 0;

    // 2. Số khách hàng mới đăng ký trong khoảng thời gian
    let newCustSql = `SELECT COUNT(*) as new_count FROM users WHERE role_id = 3`;
    const newCustParams = [];
    if (startDate) {
      newCustSql += ` AND DATE(created_at) >= ?`;
      newCustParams.push(startDate);
    }
    if (endDate) {
      newCustSql += ` AND DATE(created_at) <= ?`;
      newCustParams.push(endDate);
    }
    const [newCustRow] = await query(newCustSql, newCustParams);
    const newCustomers = newCustRow?.new_count || 0;

    // 3. Xây dựng điều kiện lọc đơn hàng theo ngày
    let orderDateCondition = '';
    const orderDateParams = [];
    if (startDate) {
      orderDateCondition += ` AND DATE(o.created_at) >= ?`;
      orderDateParams.push(startDate);
    }
    if (endDate) {
      orderDateCondition += ` AND DATE(o.created_at) <= ?`;
      orderDateParams.push(endDate);
    }

    // 4. Danh sách thống kê chi tiết từng khách hàng (Số đơn, Doanh số, Lần mua gần nhất)
    let custSql = `
      SELECT 
        u.id, u.full_name, u.phone, u.address, u.created_at, u.status,
        COUNT(DISTINCT CASE WHEN 1=1 ${orderDateCondition} THEN o.id END) as order_count,
        COUNT(DISTINCT CASE WHEN o.order_status = 'DA_GIAO' ${orderDateCondition} THEN o.id END) as successful_orders,
        COUNT(DISTINCT CASE WHEN o.order_status = 'DA_HUY' ${orderDateCondition} THEN o.id END) as cancelled_orders,
        COALESCE(SUM(CASE WHEN o.order_status = 'DA_GIAO' ${orderDateCondition} THEN o.total_amount ELSE 0 END), 0) as total_spent,
        MAX(CASE WHEN 1=1 ${orderDateCondition} THEN o.created_at END) as last_order_date
      FROM users u
      LEFT JOIN orders o ON (o.user_id = u.id OR o.phone = u.phone)
      WHERE u.role_id = 3
    `;

    const queryParams = [...orderDateParams, ...orderDateParams, ...orderDateParams, ...orderDateParams, ...orderDateParams];

    if (search && search.trim() !== '') {
      custSql += ` AND (u.full_name LIKE ? OR u.phone LIKE ? OR u.address LIKE ?)`;
      const term = `%${search.trim()}%`;
      queryParams.push(term, term, term);
    }

    custSql += `
      GROUP BY u.id, u.full_name, u.phone, u.address, u.created_at, u.status
      ORDER BY total_spent DESC, order_count DESC, u.id DESC
    `;

    const customers = await query(custSql, queryParams);

    // Tính toán các chỉ số phái sinh
    const activeCustomers = customers.filter((c) => parseInt(c.order_count, 10) > 0).length;
    const inactiveCustomers = totalCustomers - activeCustomers;
    const totalSpentAll = customers.reduce((acc, c) => acc + (parseFloat(c.total_spent) || 0), 0);
    const totalOrdersAll = customers.reduce((acc, c) => acc + (parseInt(c.order_count, 10) || 0), 0);

    // Xuất file Excel (.xlsx) chuẩn doanh nghiệp Office 365 (TC_REPORT_003)
    if (format === 'excel' || format === 'xlsx' || format === 'csv') {
      const xlsxBuffer = await generateCustomersExcelReport({
        customers,
        summary: {
          totalCustomers,
          newCustomers,
          activeCustomers,
          inactiveCustomers,
          totalSpentAll,
          totalOrdersAll,
        },
        startDate,
        endDate
      });

      return new Response(xlsxBuffer, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="Bao-cao-khach-hang-${startDate || 'all'}-${endDate || 'now'}.xlsx"`
        }
      });
    }

    return NextResponse.json({
      success: true,
      filter: {
        startDate: startDate || null,
        endDate: endDate || null,
        search: search || null
      },
      data: {
        total_customers: totalCustomers,
        new_customers: newCustomers,
        active_customers: activeCustomers,
        inactive_customers: inactiveCustomers,
        total_spent_all: totalSpentAll,
        total_orders_all: totalOrdersAll,
        top_customers: customers.slice(0, 5),
        customers
      }
    });
  } catch (error) {
    console.error('Error fetching customer report:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

