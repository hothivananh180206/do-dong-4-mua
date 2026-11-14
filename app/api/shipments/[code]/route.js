import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// API 51: Tra cứu vận đơn GreenSM theo mã tracking_code hoặc order_code
export async function GET(request, { params }) {
  try {
    const { code } = await params;

    const rows = await query(
      `SELECT s.*, o.order_code, o.receiver_name, o.phone, o.address, o.total_amount, o.order_status
       FROM shipments s
       JOIN orders o ON s.order_id = o.id
       WHERE s.tracking_code = ? OR o.order_code = ?
       LIMIT 1`,
      [code, code]
    );

    if (rows.length === 0) {
      return NextResponse.json({ success: false, message: 'Không tìm thấy thông tin vận đơn GreenSM.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: rows[0] });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// API 52: Cập nhật trạng thái vận đơn GreenSM
export async function PATCH(request, { params }) {
  try {
    const { code } = await params;
    const { shipping_status } = await request.json();

    if (!shipping_status) {
      return NextResponse.json({ success: false, message: 'Thiếu shipping_status.' }, { status: 400 });
    }

    const rows = await query('SELECT id, order_id FROM shipments WHERE tracking_code = ?', [code]);
    if (rows.length === 0) {
      return NextResponse.json({ success: false, message: 'Vận đơn không tồn tại.' }, { status: 404 });
    }

    const shipment = rows[0];
    const isDelivered = shipping_status === 'DA_GIAO';

    await query(
      `UPDATE shipments 
       SET shipping_status = ?, delivery_date = ${isDelivered ? 'NOW()' : 'delivery_date'}
       WHERE id = ?`,
      [shipping_status, shipment.id]
    );

    if (isDelivered) {
      await query('UPDATE orders SET order_status = "HOAN_TAT", payment_status = "DA_THANH_TOAN" WHERE id = ?', [shipment.order_id]);
    }

    return NextResponse.json({ success: true, message: 'Cập nhật trạng thái vận đơn thành công!' });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export { PATCH as PUT };


