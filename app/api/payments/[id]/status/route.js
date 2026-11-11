import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// API 47: Kiểm tra trạng thái thanh toán
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const rows = await query(
      `SELECT p.*, o.order_code, o.order_status
       FROM payments p
       JOIN orders o ON p.order_id = o.id
       WHERE p.id = ? OR p.transaction_code = ?
       LIMIT 1`,
      [id, id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ success: false, message: 'Không tìm thấy thông tin thanh toán.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: rows[0] });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// Cập nhật trạng thái thanh toán
export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const { status } = await request.json();

    if (!status) {
      return NextResponse.json({ success: false, message: 'Thiếu status.' }, { status: 400 });
    }

    const rows = await query('SELECT id, order_id FROM payments WHERE id = ?', [id]);
    if (rows.length === 0) {
      return NextResponse.json({ success: false, message: 'Thanh toán không tồn tại.' }, { status: 404 });
    }

    const isPaid = status === 'PAID' || status === 'DA_THANH_TOAN';
    const payStatus = isPaid ? 'PAID' : (status === 'FAILED' ? 'FAILED' : 'PENDING');
    await query(
      `UPDATE payments 
       SET payment_status = ?, payment_time = ${isPaid ? 'NOW()' : 'payment_time'}
       WHERE id = ?`,
      [payStatus, id]
    );

    if (isPaid) {
      await query('UPDATE orders SET payment_status = "PAID" WHERE id = ?', [rows[0].order_id]);
    }

    return NextResponse.json({ success: true, message: 'Cập nhật trạng thái thanh toán thành công!' });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

