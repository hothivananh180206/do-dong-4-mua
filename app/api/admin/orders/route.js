import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const orders = await query(`
      SELECT o.*, p.payment_method, p.payment_status as payment_status_detail,
             s.tracking_code, s.shipping_status
      FROM orders o
      LEFT JOIN payments p ON p.order_id = o.id
      LEFT JOIN shipments s ON s.order_id = o.id
      ORDER BY o.id DESC
      LIMIT 100
    `);
    return NextResponse.json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
