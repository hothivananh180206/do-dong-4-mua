import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request) {
  try {
    const { user_id, phone } = await request.json().catch(() => ({}));

    if (user_id) {
      await query(
        `INSERT INTO system_logs (user_id, action, module, description)
         VALUES (?, 'LOGOUT', 'AUTH', ?)`,
        [user_id, `Người dùng đăng xuất khỏi hệ thống (${phone || ''})`]
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Đăng xuất thành công'
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

