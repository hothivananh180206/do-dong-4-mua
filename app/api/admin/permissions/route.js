import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// API 69: Danh sách quyền trong hệ thống & quyền theo tài khoản
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');

    const permissions = await query('SELECT id, permission_name, description FROM permissions ORDER BY id ASC');

    if (userId) {
      const uId = parseInt(userId, 10);
      const users = await query('SELECT id, full_name, role_id FROM users WHERE id = ? LIMIT 1', [uId]);
      if (!users || users.length === 0) {
        return NextResponse.json({ success: false, message: 'Không tìm thấy tài khoản quản trị.' }, { status: 404 });
      }

      const targetUser = users[0];

      // Admin Tổng luôn có toàn bộ quyền
      if (targetUser.role_id === 1) {
        return NextResponse.json({
          success: true,
          data: {
            permissions,
            user_permission_ids: permissions.map((p) => p.id),
            is_super_admin: true,
            user: targetUser
          }
        });
      }

      // Kiểm tra bảng user_permissions riêng biệt
      const userPerms = await query(
        'SELECT permission_id FROM user_permissions WHERE user_id = ?',
        [uId]
      );

      let assignedIds = [];
      if (userPerms && userPerms.length > 0) {
        assignedIds = userPerms.map((row) => row.permission_id);
      } else {
        // Dự phòng fallback theo role_permissions
        const rolePerms = await query(
          'SELECT permission_id FROM role_permissions WHERE role_id = ?',
          [targetUser.role_id]
        );
        assignedIds = rolePerms.map((row) => row.permission_id);
      }

      return NextResponse.json({
        success: true,
        data: {
          permissions,
          user_permission_ids: assignedIds,
          is_super_admin: false,
          user: targetUser
        }
      });
    }

    const rolePermissions = await query(
      `SELECT rp.role_id, rp.permission_id, p.permission_name, r.role_name
       FROM role_permissions rp
       JOIN permissions p ON rp.permission_id = p.id
       JOIN roles r ON rp.role_id = r.id`
    );

    return NextResponse.json({
      success: true,
      data: {
        permissions,
        role_permissions: rolePermissions
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// API 70 & FR-039: Phân quyền tài khoản quản trị viên chi nhánh / vai trò
export async function POST(request) {
  try {
    const body = await request.json();
    const { user_id, role_id, permission_ids = [] } = body;

    // Trường hợp 1: Phân quyền trực tiếp cho từng Quản trị viên Chi nhánh (FR-039 / Activity Diagram 6.7.10)
    if (user_id) {
      const uId = parseInt(user_id, 10);

      // Không cho phép tước quyền của Admin Tổng
      if (uId === 1) {
        return NextResponse.json(
          { success: false, message: 'Tài khoản Admin Tổng luôn có toàn quyền quản trị hệ thống.' },
          { status: 400 }
        );
      }

      const users = await query('SELECT id, full_name, role_id FROM users WHERE id = ? LIMIT 1', [uId]);
      if (!users || users.length === 0) {
        return NextResponse.json({ success: false, message: 'Không tìm thấy tài khoản quản trị.' }, { status: 404 });
      }
      const targetUser = users[0];

      // Xóa quyền tùy chỉnh cũ của user này
      await query('DELETE FROM user_permissions WHERE user_id = ?', [uId]);

      // Gán danh sách quyền chức năng mới
      if (Array.isArray(permission_ids) && permission_ids.length > 0) {
        for (const pId of permission_ids) {
          await query(
            'INSERT INTO user_permissions (user_id, permission_id) VALUES (?, ?)',
            [uId, pId]
          );
        }
      }

      // Ghi nhật ký hệ thống
      await query(
        `INSERT INTO system_logs (user_id, action, module, description)
         VALUES (1, 'ASSIGN_PERMISSIONS', 'ADMIN', ?)`,
        [`Phân quyền chức năng cho Admin Chi nhánh: ${targetUser.full_name} (${permission_ids.length} quyền)`]
      );

      return NextResponse.json({
        success: true,
        message: `Đã phân quyền chức năng thành công cho ${targetUser.full_name}!`,
        assigned_count: permission_ids.length
      });
    }

    // Trường hợp 2: Cập nhật quyền theo vai trò (Role-based)
    if (role_id) {
      const rId = parseInt(role_id, 10);
      if (rId === 1) {
        return NextResponse.json(
          { success: false, message: 'Admin Tổng luôn giữ toàn bộ quyền hạn hệ thống.' },
          { status: 400 }
        );
      }

      await query('DELETE FROM role_permissions WHERE role_id = ?', [rId]);

      if (Array.isArray(permission_ids) && permission_ids.length > 0) {
        for (const pId of permission_ids) {
          await query(
            'INSERT INTO role_permissions (role_id, permission_id) VALUES (?, ?)',
            [rId, pId]
          );
        }
      }

      await query(
        `INSERT INTO system_logs (user_id, action, module, description)
         VALUES (1, 'UPDATE_ROLE_PERMISSIONS', 'PERMISSION', ?)`,
        [`Cập nhật phân quyền cho Nhóm vai trò ID ${rId} (${permission_ids.length} quyền)`]
      );

      return NextResponse.json({
        success: true,
        message: 'Cập nhật phân quyền vai trò thành công!'
      });
    }

    return NextResponse.json({ success: false, message: 'Thiếu user_id hoặc role_id để phân quyền.' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
