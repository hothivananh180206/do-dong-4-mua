import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { hashPassword, validatePasswordBR010 } from '@/lib/auth-passwords';

export async function POST(request) {
  try {
    const { full_name, phone, password, address } = await request.json();

    if (!full_name || !phone || !password) {
      return NextResponse.json({ success: false, message: 'Vui lòng điền đầy đủ họ tên, số điện thoại và mật khẩu' }, { status: 400 });
    }

    const pwValidation = validatePasswordBR010(password);
    if (!pwValidation.isValid) {
      return NextResponse.json({ success: false, message: pwValidation.message }, { status: 400 });
    }

    // Validate phone: 10 digits
    const cleanPhone = phone.trim().replace(/\s+/g, '');
    if (!/^[0-9]{10}$/.test(cleanPhone)) {
      return NextResponse.json({ success: false, message: 'Số điện thoại không hợp lệ (cần 10 chữ số)' }, { status: 400 });
    }

    // Check if phone exists
    const existing = await query('SELECT id FROM users WHERE phone = ?', [cleanPhone]);
    if (existing.length > 0) {
      return NextResponse.json({ success: false, message: 'Số điện thoại này đã được đăng ký tài khoản' }, { status: 409 });
    }

    // Create user (role_id = 3: Khách hàng) with Bcrypt hash (SRS NFR-004)
    const hashedPassword = await hashPassword(password);
    const result = await query(
      `INSERT INTO users (role_id, full_name, phone, password, address, status)
       VALUES (3, ?, ?, ?, ?, 1)`,
      [full_name.trim(), cleanPhone, hashedPassword, address || '']
    );

    // Audit log
    await query(
      `INSERT INTO system_logs (user_id, action, module, description)
       VALUES (?, 'REGISTER', 'AUTH', ?)`,
      [result.insertId, `Khách hàng mới đăng ký tài khoản SĐT: ${cleanPhone}`]
    );

    return NextResponse.json({
      success: true,
      message: 'Đăng ký tài khoản thành công! Vui lòng đăng nhập.',
      user: {
        id: result.insertId,
        full_name,
        phone: cleanPhone,
        address,
        role_id: 3,
        role_name: 'Khách hàng',
        isAdmin: false
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error during registration:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

