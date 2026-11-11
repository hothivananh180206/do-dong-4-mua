import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { generatePdfReport } from '@/lib/pdf-report-generator';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'revenue';
    const startDate = searchParams.get('startDate') || '';
    const endDate = searchParams.get('endDate') || '';
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const categoryId = searchParams.get('categoryId') || '';
    const stockStatus = searchParams.get('stockStatus') || '';

    // Lấy thông tin cấu hình cửa hàng
    const settingsRows = await query('SELECT setting_key, setting_value FROM system_settings');
    const settings = {};
    if (Array.isArray(settingsRows)) {
      settingsRows.forEach(r => {
        settings[r.setting_key] = r.setting_value;
      });
    }

    let pdfBytes;
    let filename;

    // 1. BÁO CÁO KHÁCH HÀNG (FR-048)
    if (type === 'customers') {
      const [totalCustRow] = await query('SELECT COUNT(*) as total FROM users WHERE role_id = 3');
      const totalCustomers = totalCustRow?.total || 0;

      let newCustSql = 'SELECT COUNT(*) as new_count FROM users WHERE role_id = 3';
      const newCustParams = [];
      if (startDate) {
        newCustSql += ' AND DATE(created_at) >= ?';
        newCustParams.push(startDate);
      }
      if (endDate) {
        newCustSql += ' AND DATE(created_at) <= ?';
        newCustParams.push(endDate);
      }
      const [newCustRow] = await query(newCustSql, newCustParams);
      const newCustomers = newCustRow?.new_count || 0;

      let orderDateCondition = '';
      const orderDateParams = [];
      if (startDate) {
        orderDateCondition += ' AND DATE(o.created_at) >= ?';
        orderDateParams.push(startDate);
      }
      if (endDate) {
        orderDateCondition += ' AND DATE(o.created_at) <= ?';
        orderDateParams.push(endDate);
      }

      let custSql = `
        SELECT 
          u.id, u.full_name, u.phone, u.address, u.created_at, u.status,
          COUNT(DISTINCT CASE WHEN 1=1 ${orderDateCondition} THEN o.id END) as order_count,
          COUNT(DISTINCT CASE WHEN o.order_status IN ('COMPLETED', 'DELIVERED', 'DA_GIAO') ${orderDateCondition} THEN o.id END) as successful_orders,
          COALESCE(SUM(CASE WHEN o.order_status IN ('COMPLETED', 'DELIVERED', 'DA_GIAO') ${orderDateCondition} THEN o.total_amount ELSE 0 END), 0) as total_spent
        FROM users u
        LEFT JOIN orders o ON (o.user_id = u.id OR o.phone = u.phone)
        WHERE u.role_id = 3
      `;
      const queryParams = [...orderDateParams, ...orderDateParams, ...orderDateParams];

      if (search && search.trim() !== '') {
        custSql += ' AND (u.full_name LIKE ? OR u.phone LIKE ? OR u.address LIKE ?)';
        const term = `%${search.trim()}%`;
        queryParams.push(term, term, term);
      }

      custSql += `
        GROUP BY u.id, u.full_name, u.phone, u.address, u.created_at, u.status
        ORDER BY total_spent DESC, order_count DESC, u.id DESC
        LIMIT 200
      `;

      const customers = await query(custSql, queryParams);
      const activeCustomers = customers.filter(c => Number(c.order_count) > 0).length;
      const totalSpentAll = customers.reduce((acc, c) => acc + (Number(c.total_spent) || 0), 0);

      pdfBytes = await generatePdfReport({
        title: 'BÁO CÁO TỔNG HỢP DANH SÁCH KHÁCH HÀNG & CHI TIÊU',
        reportType: 'customers',
        startDate,
        endDate,
        summary: {
          totalCustomers,
          newCustomers,
          activeCustomers,
          totalSpentAll
        },
        customers,
        settings
      });

      filename = `Bao_Cao_Khach_Hang_${new Date().toISOString().slice(0, 10)}.pdf`;
    }

    // 2. BÁO CÁO HÀNG TỒN KHO (FR-049)
    else if (type === 'inventory') {
      let conditions = ['1=1'];
      let params = [];

      if (search) {
        conditions.push('(p.name LIKE ? OR p.id = ?)');
        params.push(`%${search}%`, isNaN(Number(search)) ? -1 : Number(search));
      }

      if (categoryId && categoryId !== 'all') {
        conditions.push('p.category_id = ?');
        params.push(categoryId);
      }

      if (stockStatus && stockStatus !== 'all') {
        if (stockStatus === 'out_of_stock') {
          conditions.push('p.stock = 0');
        } else if (stockStatus === 'low_stock') {
          conditions.push('p.stock > 0 AND p.stock <= 10');
        } else if (stockStatus === 'in_stock') {
          conditions.push('p.stock > 10');
        }
      }

      const invSql = `
        SELECT p.id, p.name, p.price, p.stock, c.name as category_name
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE ${conditions.join(' AND ')}
        ORDER BY p.stock ASC, p.id ASC
        LIMIT 300
      `;

      const products = await query(invSql, params);

      let totalStock = 0;
      let outOfStock = 0;
      let totalInventoryValue = 0;

      products.forEach(p => {
        const stk = Number(p.stock) || 0;
        const prc = Number(p.price) || 0;
        totalStock += stk;
        totalInventoryValue += stk * prc;
        if (stk === 0) outOfStock++;
      });

      pdfBytes = await generatePdfReport({
        title: 'BÁO CÁO HÀNG TỒN KHO & GIÁ TRỊ LƯU KHO',
        reportType: 'inventory',
        startDate,
        endDate,
        summary: {
          totalProducts: products.length,
          totalStock,
          outOfStock,
          totalInventoryValue
        },
        inventory: products,
        settings
      });

      filename = `Bao_Cao_Ton_Kho_${new Date().toISOString().slice(0, 10)}.pdf`;
    }

    // 3. BÁO CÁO DOANH THU HOẶC ĐƠN HÀNG (FR-047, FR-050)
    else {
      let sql = 'SELECT id, order_code, receiver_name, phone, address, total_amount, order_status, created_at FROM orders WHERE 1=1';
      const params = [];

      if (startDate) {
        sql += ' AND created_at >= ?';
        params.push(`${startDate} 00:00:00`);
      }
      if (endDate) {
        sql += ' AND created_at <= ?';
        params.push(`${endDate} 23:59:59`);
      }
      if (status && status !== 'ALL' && status !== 'all') {
        sql += ' AND order_status = ?';
        params.push(status);
      }

      sql += ' ORDER BY id DESC LIMIT 200';

      const orders = await query(sql, params);

      const totalOrders = orders.length;
      let completedOrders = 0;
      let pendingOrders = 0;
      let totalRevenue = 0;

      orders.forEach(o => {
        const amt = Number(o.total_amount) || 0;
        if (['COMPLETED', 'DELIVERED', 'DA_GIAO'].includes(o.order_status)) {
          completedOrders += 1;
          totalRevenue += amt;
        } else if (['SHIPPING', 'PROCESSING', 'DANG_GIAO', 'DANG_XU_LY'].includes(o.order_status)) {
          pendingOrders += 1;
        }
      });

      const averageOrderValue = completedOrders > 0 ? Math.round(totalRevenue / completedOrders) : 0;

      const reportTitle = type === 'orders'
        ? 'BÁO CÁO TỔNG HỢP DANH SÁCH ĐƠN HÀNG'
        : 'BÁO CÁO DOANH THU & ĐỐI SOÁT ĐƠN HÀNG';

      pdfBytes = await generatePdfReport({
        title: reportTitle,
        reportType: type,
        startDate,
        endDate,
        summary: {
          totalRevenue,
          totalOrders,
          completedOrders,
          pendingOrders,
          averageOrderValue
        },
        orders,
        settings
      });

      filename = type === 'orders'
        ? `Bao_Cao_Don_Hang_${new Date().toISOString().slice(0, 10)}.pdf`
        : `Bao_Cao_Doanh_Thu_${new Date().toISOString().slice(0, 10)}.pdf`;
    }

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store, max-age=0'
      }
    });
  } catch (err) {
    console.error('Error generating PDF report:', err);
    return NextResponse.json({ success: false, message: 'Lỗi khi tạo báo cáo PDF: ' + err.message }, { status: 500 });
  }
}
