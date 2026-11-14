import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// API 45: Lịch sử xử lý đơn hàng theo BR-018
export async function GET(request, { params }) {
  try {
    const { code } = await params;

    const orders = await query('SELECT id, order_code, order_status, created_at, updated_at FROM orders WHERE order_code = ?', [code]);
    if (orders.length === 0) {
      return NextResponse.json({ success: false, message: 'Đơn hàng không tồn tại.' }, { status: 404 });
    }

    const order = orders[0];

    // Lấy log liên quan đến đơn hàng
    const logs = await query(
      `SELECT id, action, module, description, created_at
       FROM system_logs
       WHERE description LIKE ?
       ORDER BY id ASC`,
      [`%${code}%`]
    );

    // Xây dựng các mốc quy trình theo BR-018
    const milestones = [
      { step: 1, name: 'Đặt hàng thành công', status: 'COMPLETED', time: order.created_at },
      { step: 2, name: 'Tiếp nhận đơn hàng', status: ['CHO_XAC_NHAN'].includes(order.order_status) ? 'CURRENT' : 'COMPLETED' },
      { step: 3, name: 'Đang chuẩn bị nông sản', status: order.order_status === 'DANG_CHUAN_BI' ? 'CURRENT' : (['DANG_GIAO', 'HOAN_TAT'].includes(order.order_status) ? 'COMPLETED' : 'PENDING') },
      { step: 4, name: 'Giao cho đối tác GreenSM', status: order.order_status === 'DANG_GIAO' ? 'CURRENT' : (order.order_status === 'HOAN_TAT' ? 'COMPLETED' : 'PENDING') },
      { step: 5, name: 'Hoàn tất giao hàng', status: order.order_status === 'HOAN_TAT' ? 'COMPLETED' : 'PENDING', time: order.order_status === 'HOAN_TAT' ? order.updated_at : null },
    ];

    return NextResponse.json({
      success: true,
      data: {
        order_code: order.order_code,
        current_status: order.order_status,
        milestones,
        audit_logs: logs
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

