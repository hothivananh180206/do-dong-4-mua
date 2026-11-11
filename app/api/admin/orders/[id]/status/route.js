import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, order_status } = body;
    const newStatus = status || order_status || 'DANG_CHUAN_BI';

    const orders = await query('SELECT id, order_code FROM orders WHERE id = ? OR order_code = ?', [id, id]);
    if (orders.length === 0) {
      return NextResponse.json({ success: false, message: 'Đơn hàng không tồn tại' }, { status: 404 });
    }

    await query('UPDATE orders SET order_status = ? WHERE id = ?', [newStatus, orders[0].id]);
    return NextResponse.json({ success: true, message: 'Cập nhật trạng thái đơn hàng thành công' });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export { PUT as PATCH };
