import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { hashPassword, validatePasswordBR010 } from '@/lib/auth-passwords';

export async function POST(request) {
  try {
    const body = await request.json();
    const { full_name, phone, password, address } = body;

    if (!full_name || !phone || !password) {
      return NextResponse.json({
        success: false,
        message: 'Vui lòng điền đầy đủ họ tên, số điện thoại và mật khẩu'
      }, { status: 400 });
    }

    const cleanPhone = phone.trim().replace(/[\s\.\-]+/g, '');
    const phoneRegex = /^(0|\+84)[0-9]{9}$/;
    if (!phoneRegex.test(cleanPhone)) {
      return NextResponse.json({
        success: false,
        message: 'Số điện thoại không đúng định dạng (yêu cầu 10 chữ số, ví dụ: 0912345678)'
      }, { status: 400 });
    }

    const pwValidation = validatePasswordBR010(password);
    if (!pwValidation.isValid) {
      return NextResponse.json({
        success: false,
        message: pwValidation.message
      }, { status: 400 });
    }

    // Kiểm tra xem số điện thoại đã tồn tại chưa
    const existing = await query('SELECT id FROM users WHERE phone = ?', [cleanPhone]);
    if (existing.length > 0) {
      return NextResponse.json({
        success: false,
        message: 'Số điện thoại này đã được đăng ký. Vui lòng đăng nhập!'
      }, { status: 400 });
    }

    // Tạo tài khoản khách hàng mới (role_id = 3) theo chuẩn Bcrypt (SRS NFR-004)
    const hashedPassword = await hashPassword(password);
    const result = await query(
      `INSERT INTO users (role_id, full_name, phone, password, address, status)
       VALUES (3, ?, ?, ?, ?, 1)`,
      [full_name.trim(), cleanPhone, hashedPassword, address ? address.trim() : '']
    );

    const userId = result.insertId;

    // Ghi nhật ký hệ thống
    await query(
      `INSERT INTO system_logs (user_id, action, module, description)
       VALUES (?, 'REGISTER', 'USER', ?)`,
      [userId, `Khách hàng đăng ký tài khoản thành công qua xác thực OTP: ${cleanPhone}`]
    );

    return NextResponse.json({
      success: true,
      message: 'Đăng ký tài khoản thành công!',
      data: {
        id: userId,
        full_name: full_name.trim(),
        phone: cleanPhone,
        role_id: 3
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

