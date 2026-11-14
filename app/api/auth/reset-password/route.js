import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyPassword, hashPassword, validatePasswordBR010 } from '@/lib/auth-passwords';

if (!global.__otpCache) {
  global.__otpCache = new Map();
}
const otpCache = global.__otpCache;

export async function POST(request) {
  try {
    const { phone, new_password, confirm_password } = await request.json();
    const cleanPhone = (phone || '').trim();

    if (!cleanPhone || !new_password) {
      return NextResponse.json({ success: false, message: 'Vui lòng cung cấp số điện thoại và mật khẩu mới.' }, { status: 400 });
    }

    if (confirm_password && new_password !== confirm_password) {
      return NextResponse.json({ success: false, message: 'Hai mật khẩu không trùng nhau.' }, { status: 400 });
    }

    const pwValidation = validatePasswordBR010(new_password);
    if (!pwValidation.isValid) {
      return NextResponse.json({ success: false, message: pwValidation.message }, { status: 400 });
    }

    const users = await query('SELECT id, password FROM users WHERE phone = ?', [cleanPhone]);
    if (!users || users.length === 0) {
      return NextResponse.json({ success: false, message: 'Số điện thoại chưa tồn tại trong hệ thống.' }, { status: 404 });
    }

    // Quy tắc nghiệp vụ FR-003: Mật khẩu mới không được trùng với mật khẩu hiện tại
    const { isValid: isOldPasswordSame } = await verifyPassword(new_password, users[0].password);
    if (isOldPasswordSame) {
      return NextResponse.json({ success: false, message: 'Mật khẩu mới không được trùng với mật khẩu hiện tại.' }, { status: 400 });
    }

    // Cập nhật mật khẩu trong DB theo chuẩn Bcrypt (SRS NFR-004)
    const hashedPassword = await hashPassword(new_password);
    await query('UPDATE users SET password = ? WHERE phone = ?', [hashedPassword, cleanPhone]);

    // Xóa OTP khỏi bộ nhớ
    otpCache.delete(cleanPhone);

    // Ghi nhật ký hệ thống
    await query(
      `INSERT INTO system_logs (user_id, action, module, description)
       VALUES (?, 'RESET_PASSWORD', 'AUTH', ?)`,
      [users[0].id, `Đặt lại mật khẩu thành công qua xác thực OTP cho SĐT: ${cleanPhone}`]
    );

    return NextResponse.json({
      success: true,
      message: 'Đặt lại mật khẩu thành công! Bạn có thể đăng nhập bằng mật khẩu mới.'
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

