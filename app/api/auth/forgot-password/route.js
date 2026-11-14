import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Bộ nhớ lưu tạm OTP trong 5 phút (In-memory OTP cache)
if (!global.__otpCache) {
  global.__otpCache = new Map();
}
const otpCache = global.__otpCache;

export async function POST(request) {
  try {
    const { phone } = await request.json();
    const cleanPhone = (phone || '').trim();

    if (!cleanPhone) {
      return NextResponse.json({ success: false, message: 'Vui lòng nhập số điện thoại.' }, { status: 400 });
    }

    const users = await query('SELECT id, full_name FROM users WHERE phone = ? LIMIT 1', [cleanPhone]);
    if (!users || users.length === 0) {
      return NextResponse.json({ success: false, message: 'Số điện thoại chưa được đăng ký trong hệ thống.' }, { status: 404 });
    }

    // Tạo mã OTP 6 số (mặc định demo: 123456 hoặc random)
    const otpCode = '123456'; 
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 phút

    otpCache.set(cleanPhone, { code: otpCode, expiresAt });

    // Ghi nhật ký yêu cầu OTP
    await query(
      `INSERT INTO system_logs (user_id, action, module, description)
       VALUES (?, 'FORGOT_PASSWORD', 'AUTH', ?)`,
      [users[0].id, `Yêu cầu gửi OTP khôi phục mật khẩu đến SĐT: ${cleanPhone}`]
    );

    return NextResponse.json({
      success: true,
      message: 'Mã xác thực OTP đã được gửi đến số điện thoại của bạn.',
      expiresIn: 300
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

