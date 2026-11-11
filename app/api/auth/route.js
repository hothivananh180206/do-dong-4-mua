import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getRealClientIp, getUserAgent } from '@/lib/logger';
import { verifyPassword, hashPassword } from '@/lib/auth-passwords';

// Bộ nhớ theo dõi số lần đăng nhập sai theo BR-010 (5 lần sai -> khóa 15 phút)
if (!global.__failedLogins) {
  global.__failedLogins = new Map();
}
const failedLogins = global.__failedLogins;

export async function POST(request) {
  try {
    const { phone, password } = await request.json();
    const cleanPhone = (phone || '').trim();

    // TH1: Bỏ trống số điện thoại
    if (!cleanPhone) {
      return NextResponse.json({ success: false, message: 'Vui lòng nhập số điện thoại.' }, { status: 400 });
    }

    // TH2: Bỏ trống mật khẩu
    if (!password || !password.trim()) {
      return NextResponse.json({ success: false, message: 'Vui lòng nhập mật khẩu.' }, { status: 400 });
    }

    // BR-010: Kiểm tra nếu tài khoản đang trong thời gian tạm khóa 15 phút
    const failRecord = failedLogins.get(cleanPhone);
    if (failRecord && failRecord.lockedUntil && Date.now() < failRecord.lockedUntil) {
      const remainingMinutes = Math.ceil((failRecord.lockedUntil - Date.now()) / (60 * 1000));
      return NextResponse.json({
        success: false,
        message: `Tài khoản tạm thời bị khóa trong ${remainingMinutes} phút do nhập sai 5 lần.`
      }, { status: 429 });
    }

    const users = await query(
      `SELECT u.id, u.role_id, u.branch_id, u.full_name, u.phone, u.password, u.address, u.status, r.role_name
       FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE u.phone = ?
       LIMIT 1`,
      [cleanPhone]
    );

    // TH3: Số điện thoại không tồn tại (trả về thông báo chuẩn SRS: "Số điện thoại hoặc mật khẩu không chính xác.")
    if (!users || users.length === 0) {
      return recordFailedAttempt(cleanPhone);
    }

    const user = users[0];

    // TH4: Tài khoản bị khóa (status = 0)
    if (user.status === 0) {
      return NextResponse.json({
        success: false,
        message: 'Tài khoản đã bị khóa. Vui lòng liên hệ quản trị viên.'
      }, { status: 403 });
    }

    // Xác thực mật khẩu theo chuẩn Bcrypt (SRS NFR-004) kèm hỗ trợ tương thích ngược
    const { isValid, needsRehash } = await verifyPassword(password, user.password);

    // TH3: Sai mật khẩu
    if (!isValid) {
      return recordFailedAttempt(cleanPhone);
    }

    // Tự động nâng cấp mật khẩu cũ dạng Plain Text lên chuẩn Bcrypt khi đăng nhập thành công
    if (needsRehash) {
      try {
        const newHash = await hashPassword(password);
        await query('UPDATE users SET password = ? WHERE id = ?', [newHash, user.id]);
      } catch (hashErr) {
        console.error('Lỗi tự động rehash mật khẩu:', hashErr);
      }
    }

    // Đăng nhập thành công -> Xóa bộ đếm sai
    failedLogins.delete(cleanPhone);

    // FR-001: Ghi nhật ký đăng nhập vào system_logs
    try {
      const ip = await getRealClientIp(request);
      const userAgent = request.headers.get('user-agent') || 'NextJS Client';
      await query(
        `INSERT INTO system_logs (user_id, action, module, description, ip_address, user_agent, created_at)
         VALUES (?, 'LOGIN', 'AUTH', ?, ?, ?, NOW())`,
        [user.id, `Đăng nhập thành công vai trò: ${user.role_name}`, ip, userAgent]
      );
    } catch (logErr) {
      console.error('Lỗi ghi system_logs:', logErr);
    }

    // Lấy danh sách quyền của tài khoản quản trị theo SRS FR-039 & BR-026
    let permissions = [];
    if (user.role_id === 1) {
      permissions = ['*'];
    } else if (user.role_id === 2) {
      const userPerms = await query(
        `SELECT p.permission_name FROM user_permissions up
         JOIN permissions p ON up.permission_id = p.id
         WHERE up.user_id = ?`,
        [user.id]
      );
      if (userPerms && userPerms.length > 0) {
        permissions = userPerms.map((p) => p.permission_name);
      } else {
        const rolePerms = await query(
          `SELECT p.permission_name FROM role_permissions rp
           JOIN permissions p ON rp.permission_id = p.id
           WHERE rp.role_id = ?`,
          [user.role_id]
        );
        permissions = rolePerms.map((p) => p.permission_name);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Đăng nhập thành công',
      user: {
        id: user.id,
        full_name: user.full_name,
        phone: user.phone,
        address: user.address,
        role_id: user.role_id,
        role_name: user.role_name,
        branch_id: user.branch_id,
        isAdmin: user.role_id === 1 || user.role_id === 2,
        permissions
      }
    });
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// Hàm ghi nhận số lần sai và kích hoạt khóa 15 phút theo BR-010
function recordFailedAttempt(phone) {
  const current = failedLogins.get(phone) || { count: 0, lockedUntil: null };
  const newCount = current.count + 1;

  if (newCount >= 5) {
    failedLogins.set(phone, {
      count: newCount,
      lockedUntil: Date.now() + 15 * 60 * 1000 // Khóa 15 phút
    });
    return NextResponse.json({
      success: false,
      message: 'Tài khoản tạm thời bị khóa trong 15 phút do nhập sai 5 lần.'
    }, { status: 429 });
  }

  failedLogins.set(phone, { count: newCount, lockedUntil: null });
  return NextResponse.json({
    success: false,
    message: 'Số điện thoại hoặc mật khẩu không chính xác.'
  }, { status: 401 });
}

