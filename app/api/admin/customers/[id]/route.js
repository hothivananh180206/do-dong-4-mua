import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// API: Chi tiết khách hàng kèm lịch sử đơn hàng (FR-040 & UC-18)
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const users = await query(
      `SELECT id, full_name, phone, address, created_at, status
       FROM users
       WHERE id = ? AND role_id = 3
       LIMIT 1`,
      [id]
    );

    if (!users || users.length === 0) {
      return NextResponse.json({ success: false, message: 'Khách hàng không tồn tại' }, { status: 404 });
    }

    const customer = users[0];

    // Lấy toàn bộ lịch sử đơn hàng của khách hàng này
    const orders = await query(
      `SELECT o.id, o.order_code, o.total_amount, o.order_status, o.created_at,
              p.payment_method, p.payment_status
       FROM orders o
       LEFT JOIN payments p ON p.order_id = o.id
       WHERE o.user_id = ?
       ORDER BY o.id DESC`,
      [id]
    );

    customer.orders = orders || [];
    customer.total_orders = orders.length;
    customer.total_spent = orders
      .filter(o => o.order_status !== 'DA_HUY')
      .reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0);

    return NextResponse.json({ success: true, data: customer });
  } catch (error) {
    console.error('Error fetching customer detail:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

