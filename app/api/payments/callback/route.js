import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// API 48: Callback / Webhook nhận thông báo tự động từ cổng thanh toán
export async function POST(request) {
  try {
    const { order_code, transaction_code, amount, status = 'SUCCESS' } = await request.json();

    if (!order_code) {
      return NextResponse.json({ success: false, message: 'Thiếu order_code.' }, { status: 400 });
    }

    const orders = await query('SELECT id FROM orders WHERE order_code = ?', [order_code]);
    if (orders.length === 0) {
      return NextResponse.json({ success: false, message: 'Đơn hàng không tồn tại.' }, { status: 404 });
    }

    const orderId = orders[0].id;
    const isSuccess = status === 'SUCCESS';

    // Cập nhật trạng thái thanh toán
    await query(
      `UPDATE payments 
       SET payment_status = ?, transaction_code = COALESCE(?, transaction_code), payment_time = NOW()
       WHERE order_id = ?`,
      [isSuccess ? 'PAID' : 'FAILED', transaction_code, orderId]
    );

    if (isSuccess) {
      await query('UPDATE orders SET payment_status = "PAID" WHERE id = ?', [orderId]);
    }

    await query(
      `INSERT INTO system_logs (user_id, action, module, description)
       VALUES (1, 'PAYMENT_WEBHOOK', 'PAYMENT', ?)`,
      [`Nhận webhook thanh toán đơn ${order_code}: ${isSuccess ? 'Thành công' : 'Thất bại'}`]
    );

    return NextResponse.json({
      success: true,
      message: 'Xử lý webhook thanh toán thành công!'
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

