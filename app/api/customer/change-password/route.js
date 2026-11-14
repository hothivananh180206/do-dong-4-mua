import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyPassword, hashPassword, validatePasswordBR010 } from '@/lib/auth-passwords';

export async function POST(request) {
  try {
    const body = await request.json();
    const user_id = body.user_id || 1;
    const old_password = body.old_password || body.current_password;
    const new_password = body.new_password;

    if (!old_password || !new_password) {
      return NextResponse.json({ success: false, message: 'Vui lòng nhập đầy đủ mật khẩu cũ và mật khẩu mới.' }, { status: 400 });
    }

    const pwValidation = validatePasswordBR010(new_password);
    if (!pwValidation.isValid) {
      return NextResponse.json({ success: false, message: pwValidation.message }, { status: 400 });
    }

    const users = await query('SELECT id, password FROM users WHERE id = ?', [user_id]);
    if (!users || users.length === 0) {
      return NextResponse.json({ success: false, message: 'Tài khoản không tồn tại.' }, { status: 404 });
    }

    const user = users[0];
    const { isValid } = await verifyPassword(old_password, user.password);
    if (!isValid) {
      return NextResponse.json({ success: false, message: 'Mật khẩu hiện tại không chính xác.' }, { status: 400 });
    }

    const hashedPassword = await hashPassword(new_password);
    await query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, user_id]);

    await query(
      `INSERT INTO system_logs (user_id, action, module, description)
       VALUES (?, 'CHANGE_PASSWORD', 'CUSTOMER', 'Thay đổi mật khẩu thành công')`,
      [user_id]
    );

    return NextResponse.json({ success: true, message: 'Đổi mật khẩu thành công!' });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

