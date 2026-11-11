import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// API 41: Hủy đơn hàng (khách hàng hoặc quản trị viên)
export async function POST(request, { params }) {
  try {
    const { code } = await params;
    const { reason, user_id } = await request.json().catch(() => ({}));

    const orders = await query('SELECT id, order_status FROM orders WHERE order_code = ?', [code]);
    if (orders.length === 0) {
      return NextResponse.json({ success: false, message: 'Đơn hàng không tồn tại.' }, { status: 404 });
    }

    const order = orders[0];
    if (['DANG_GIAO', 'DA_GIAO', 'HOAN_TAT'].includes(order.order_status)) {
      return NextResponse.json({
        success: false,
        message: 'Đơn hàng đang giao hoặc đã hoàn tất, không thể hủy.'
      }, { status: 400 });
    }

    if (order.order_status === 'DA_HUY') {
      return NextResponse.json({ success: false, message: 'Đơn hàng này đã bị hủy trước đó.' }, { status: 400 });
    }

    await query('UPDATE orders SET order_status = "DA_HUY" WHERE id = ?', [order.id]);

    // Ghi nhật ký
    await query(
      `INSERT INTO system_logs (user_id, action, module, description)
       VALUES (?, 'CANCEL_ORDER', 'ORDER', ?)`,
      [user_id || 1, `Hủy đơn hàng ${code}. Lý do: ${reason || 'Khách hàng yêu cầu'}`]
    );

    return NextResponse.json({ success: true, message: 'Đã hủy đơn hàng thành công.' });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export { POST as PUT };


