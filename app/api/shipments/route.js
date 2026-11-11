import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// API 53: Danh sách vận đơn GreenSM
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let sql = `
      SELECT s.*, o.order_code, o.receiver_name, o.phone, o.address, o.total_amount
      FROM shipments s
      JOIN orders o ON s.order_id = o.id
      WHERE 1=1
    `;
    const params = [];
    if (status) {
      sql += ' AND s.shipping_status = ?';
      params.push(status);
    }
    sql += ' ORDER BY s.id DESC';

    const shipments = await query(sql, params);
    return NextResponse.json({ success: true, count: shipments.length, data: shipments });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// API 50: Tạo vận đơn giao hàng GreenSM
export async function POST(request) {
  try {
    const { order_id, shipping_fee = 25000, note } = await request.json();

    if (!order_id) {
      return NextResponse.json({ success: false, message: 'Thiếu order_id.' }, { status: 400 });
    }

    const orders = await query('SELECT id, order_code FROM orders WHERE id = ?', [order_id]);
    if (orders.length === 0) {
      return NextResponse.json({ success: false, message: 'Đơn hàng không tồn tại.' }, { status: 404 });
    }

    // Sinh mã vận đơn GreenSM: GSM-xxxxxx
    const trackingCode = `GSM-${Math.floor(100000 + Math.random() * 900000)}`;

    // Tạo vận đơn
    const result = await query(
      `INSERT INTO shipments (order_id, shipping_company, tracking_code, shipping_fee, shipping_status, ship_date)
       VALUES (?, 'GreenSM', ?, ?, 'DA_TAO_VAN_DON', NOW())
       ON DUPLICATE KEY UPDATE tracking_code = VALUES(tracking_code), shipping_status = 'DA_TAO_VAN_DON'`,
      [order_id, trackingCode, shipping_fee]
    );

    // Cập nhật trạng thái đơn hàng sang DANG_GIAO
    await query('UPDATE orders SET order_status = "DANG_GIAO" WHERE id = ?', [order_id]);

    // Ghi nhật ký
    await query(
      `INSERT INTO system_logs (user_id, action, module, description)
       VALUES (1, 'CREATE_SHIPMENT', 'SHIPMENT', ?)`,
      [`Đã kết nối tạo vận đơn GreenSM mã ${trackingCode} cho đơn ${orders[0].order_code}`]
    );

    return NextResponse.json({
      success: true,
      message: 'Tạo vận đơn GreenSM thành công!',
      data: {
        tracking_code: trackingCode,
        shipping_company: 'GreenSM',
        shipping_status: 'DA_TAO_VAN_DON'
      }
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

