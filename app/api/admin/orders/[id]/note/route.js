import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const { note } = await request.json();
    await query(
      `INSERT INTO system_logs (user_id, action, module, description)
       VALUES (1, 'ORDER_NOTE', 'ORDER', ?)`,
      [`Ghi chú đơn hàng mã/id #${id}: ${note || ''}`]
    );
    return NextResponse.json({ success: true, message: 'Đã lưu ghi chú đơn hàng' });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
