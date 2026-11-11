import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// API 49: Lịch sử thanh toán
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('order_id');

    let sql = `
      SELECT p.*, o.order_code, o.receiver_name, o.phone, o.total_amount as order_total
      FROM payments p
      JOIN orders o ON p.order_id = o.id
      WHERE 1=1
    `;
    const params = [];
    if (orderId) {
      sql += ' AND p.order_id = ?';
      params.push(orderId);
    }
    sql += ' ORDER BY p.id DESC';

    const payments = await query(sql, params);
    return NextResponse.json({ success: true, count: payments.length, data: payments });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// API 46: Tạo thanh toán đơn hàng
export async function POST(request) {
  try {
    const { order_id, payment_method = 'COD', amount } = await request.json();

    if (!order_id) {
      return NextResponse.json({ success: false, message: 'Thiếu order_id.' }, { status: 400 });
    }

    const orders = await query('SELECT id, total_amount, order_code FROM orders WHERE id = ?', [order_id]);
    if (orders.length === 0) {
      return NextResponse.json({ success: false, message: 'Đơn hàng không tồn tại.' }, { status: 404 });
    }

    const order = orders[0];
    const payAmount = amount || order.total_amount;
    const transCode = `PAY-${Date.now()}`;
    const initialStatus = 'PENDING';

    const result = await query(
      `INSERT INTO payments (order_id, payment_method, transaction_code, payment_amount, payment_status)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
         payment_method = VALUES(payment_method),
         transaction_code = VALUES(transaction_code),
         payment_amount = VALUES(payment_amount),
         payment_status = VALUES(payment_status)`,
      [order_id, payment_method, transCode, payAmount, initialStatus]
    );

    let paymentId = result.insertId;
    if (!paymentId || paymentId === 0) {
      const existing = await query('SELECT id FROM payments WHERE order_id = ?', [order_id]);
      paymentId = existing[0]?.id;
    }

    return NextResponse.json({
      success: true,
      message: 'Khởi tạo thanh toán thành công!',
      data: {
        payment_id: paymentId,
        order_code: order.order_code,
        transaction_code: transCode,
        payment_amount: payAmount,
        amount: payAmount,
        payment_method,
        payment_status: initialStatus,
        status: initialStatus,
        qr_url: payment_method === 'BANKING' || payment_method === 'VIETQR' ? `https://img.vietqr.io/image/MB-0929894248-compact.png?amount=${payAmount}&addInfo=${order.order_code}` : null
      }
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

