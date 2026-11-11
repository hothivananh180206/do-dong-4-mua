import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { hashPassword, validatePasswordBR010 } from '@/lib/auth-passwords';

// API 54: Danh sách tài khoản quản trị
export async function GET() {
  try {
    const users = await query(
      `SELECT u.id, u.role_id, u.branch_id, u.full_name, u.phone, u.address, u.status, u.created_at,
              r.role_name, b.branch_name
       FROM users u
       JOIN roles r ON u.role_id = r.id
       LEFT JOIN branches b ON u.branch_id = b.id
       WHERE u.role_id IN (1, 2)
       ORDER BY u.role_id ASC, u.id DESC`
    );

    return NextResponse.json({ success: true, count: users.length, data: users });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// API 55: Thêm tài khoản Admin Chi nhánh mới
export async function POST(request) {
  try {
    const { full_name, phone, password, branch_id, role_id = 2 } = await request.json();

    if (!full_name || !phone || !password) {
      return NextResponse.json({ success: false, message: 'Vui lòng nhập họ tên, số điện thoại và mật khẩu.' }, { status: 400 });
    }

    const pwValidation = validatePasswordBR010(password);
    if (!pwValidation.isValid) {
      return NextResponse.json({ success: false, message: pwValidation.message }, { status: 400 });
    }

    const cleanPhone = phone.trim();
    const existing = await query('SELECT id FROM users WHERE phone = ?', [cleanPhone]);
    if (existing.length > 0) {
      return NextResponse.json({ success: false, message: 'Số điện thoại này đã được sử dụng.' }, { status: 409 });
    }

    const hashedPassword = await hashPassword(password);
    const result = await query(
      `INSERT INTO users (role_id, branch_id, full_name, phone, password, address, status)
       VALUES (?, ?, ?, ?, ?, 'Trụ sở chi nhánh', 1)`,
      [role_id, branch_id || 1, full_name.trim(), cleanPhone, hashedPassword]
    );

    // Ghi nhật ký
    await query(
      `INSERT INTO system_logs (user_id, action, module, description)
       VALUES (1, 'CREATE_ADMIN', 'ADMIN', ?)`,
      [`Tạo mới tài khoản quản trị: ${full_name} (${cleanPhone}) - Chi nhánh ${branch_id || 1}`]
    );

    return NextResponse.json({
      success: true,
      message: 'Tạo tài khoản quản trị thành công!',
      data: { id: result.insertId, full_name, phone: cleanPhone, role_id, branch_id }
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

