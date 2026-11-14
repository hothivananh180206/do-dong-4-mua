import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const { status } = await request.json();
    const newStatus = status !== undefined ? status : 1;

    await query('UPDATE users SET status = ? WHERE id = ?', [newStatus, id]);
    return NextResponse.json({ success: true, message: 'Cập nhật trạng thái tài khoản thành công!' });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export { PUT as PATCH };
