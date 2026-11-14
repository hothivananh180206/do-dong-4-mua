import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { hashPassword, validatePasswordBR010 } from '@/lib/auth-passwords';

// API 56 & 57: Xem, Cập nhật thông tin hoặc Khóa/Mở khóa tài khoản
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const users = await query(
      `SELECT u.id, u.role_id, u.branch_id, u.full_name, u.phone, u.address, u.status, u.created_at,
              r.role_name, b.branch_name
       FROM users u
       JOIN roles r ON u.role_id = r.id
       LEFT JOIN branches b ON u.branch_id = b.id
       WHERE u.id = ? LIMIT 1`,
      [id]
    );

    if (users.length === 0) {
      return NextResponse.json({ success: false, message: 'Tài khoản không tồn tại.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: users[0] });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, full_name, phone, branch_id, password } = body;

    const existing = await query('SELECT id, phone, role_id, full_name FROM users WHERE id = ?', [id]);
    if (existing.length === 0) {
      return NextResponse.json({ success: false, message: 'Tài khoản không tồn tại.' }, { status: 404 });
    }

    // Không cho phép tự khóa hoặc xóa Admin Tổng gốc (id: 1)
    if (id === '1' && status === 0) {
      return NextResponse.json({ success: false, message: 'Không thể vô hiệu hóa tài khoản Admin Tổng mặc định.' }, { status: 400 });
    }

    // Kiểm tra số điện thoại trùng lặp nếu có thay đổi
    if (phone) {
      const cleanPhone = phone.trim();
      const duplicate = await query('SELECT id FROM users WHERE phone = ? AND id != ?', [cleanPhone, id]);
      if (duplicate.length > 0) {
        return NextResponse.json({ success: false, message: 'Số điện thoại này đã được sử dụng bởi tài khoản khác.' }, { status: 409 });
      }
    }

    // Kiểm tra độ dài mật khẩu nếu đặt lại mật khẩu
    let hashedPassword = null;
    if (password) {
      const pwValidation = validatePasswordBR010(password);
      if (!pwValidation.isValid) {
        return NextResponse.json({ success: false, message: pwValidation.message }, { status: 400 });
      }
      hashedPassword = await hashPassword(password);
    }

    let validBranchId = null;
    let branchUpdateNeeded = false;
    if (branch_id !== undefined) {
      branchUpdateNeeded = true;
      if (branch_id) {
        const branchCheck = await query('SELECT id FROM branches WHERE id = ?', [branch_id]);
        if (branchCheck.length > 0) {
          validBranchId = branchCheck[0].id;
        }
      }
    }

    await query(
      `UPDATE users 
       SET status = COALESCE(?, status),
           full_name = COALESCE(?, full_name),
           phone = COALESCE(?, phone),
           branch_id = ${branchUpdateNeeded ? '?' : 'branch_id'},
           password = COALESCE(?, password)
       WHERE id = ?`,
      branchUpdateNeeded
        ? [
            status !== undefined ? status : null,
            full_name ? full_name.trim() : null,
            phone ? phone.trim() : null,
            validBranchId,
            hashedPassword || null,
            id
          ]
        : [
            status !== undefined ? status : null,
            full_name ? full_name.trim() : null,
            phone ? phone.trim() : null,
            hashedPassword || null,
            id
          ]
    );

    // Ghi log chi tiết hành động
    let logDesc = `Cập nhật tài khoản quản trị ID ${id}`;
    if (password) {
      logDesc = `Đặt lại mật khẩu cho quản trị viên ID ${id} (${existing[0].full_name})`;
    } else if (status !== undefined) {
      logDesc = `${status === 1 ? 'Mở khóa' : 'Khóa'} tài khoản quản trị ID ${id} (${existing[0].full_name})`;
    } else if (full_name || phone || branch_id) {
      logDesc = `Chỉnh sửa thông tin quản trị viên ID ${id} (${full_name || existing[0].full_name})`;
    }

    await query(
      `INSERT INTO system_logs (user_id, action, module, description)
       VALUES (1, 'UPDATE_ADMIN', 'ADMIN', ?)`,
      [logDesc]
    );

    return NextResponse.json({
      success: true,
      message: password
        ? 'Đặt lại mật khẩu cho quản trị viên thành công!'
        : 'Cập nhật thông tin quản trị viên thành công!'
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// API 58: Xóa tài khoản quản trị
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    if (id === '1') {
      return NextResponse.json({ success: false, message: 'Không thể xóa tài khoản Admin Tổng mặc định.' }, { status: 400 });
    }

    await query('DELETE FROM users WHERE id = ?', [id]);

    await query(
      `INSERT INTO system_logs (user_id, action, module, description)
       VALUES (1, 'DELETE_ADMIN', 'ADMIN', ?)`,
      [`Xóa tài khoản quản trị ID ${id}`]
    );

    return NextResponse.json({ success: true, message: 'Đã xóa tài khoản quản trị thành công.' });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export { PATCH as PUT };


