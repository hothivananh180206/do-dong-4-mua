import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    const phone = searchParams.get('phone');

    if (!userId && !phone) {
      return NextResponse.json({ success: false, message: 'Thiếu thông tin người dùng.' }, { status: 400 });
    }

    let sql = `
      SELECT u.id, u.role_id, u.branch_id, u.full_name, u.phone, u.address, u.status, u.created_at,
             r.role_name, b.branch_name
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.id
      LEFT JOIN branches b ON u.branch_id = b.id
      WHERE 1=1
    `;
    const params = [];
    if (userId) {
      sql += ' AND u.id = ?';
      params.push(userId);
    } else if (phone) {
      sql += ' AND u.phone = ?';
      params.push(phone);
    }

    const users = await query(sql, params);
    if (!users || users.length === 0) {
      return NextResponse.json({ success: false, message: 'Không tìm thấy người dùng.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: users[0] });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { user_id, full_name, address } = await request.json();

    if (!user_id) {
      return NextResponse.json({ success: false, message: 'Thiếu mã người dùng (user_id).' }, { status: 400 });
    }

    await query(
      `UPDATE users SET full_name = COALESCE(?, full_name), address = COALESCE(?, address) WHERE id = ?`,
      [full_name, address, user_id]
    );

    await query(
      `INSERT INTO system_logs (user_id, action, module, description)
       VALUES (?, 'UPDATE_PROFILE', 'CUSTOMER', 'Cập nhật thông tin hồ sơ cá nhân')`,
      [user_id]
    );

    return NextResponse.json({ success: true, message: 'Cập nhật thông tin thành công!' });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

