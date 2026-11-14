import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const customers = await query(`
      SELECT u.id, u.full_name, u.phone, u.address, u.created_at, u.status,
             COUNT(o.id) as total_orders,
             COALESCE(SUM(o.total_amount), 0) as total_spent
      FROM users u
      LEFT JOIN orders o ON o.user_id = u.id AND o.order_status != 'DA_HUY'
      WHERE u.role_id = 3
      GROUP BY u.id
      ORDER BY u.id DESC
    `);

    return NextResponse.json({ success: true, count: customers.length, data: customers });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

