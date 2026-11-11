import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getRealClientIp, logSystemAction } from '@/lib/logger';

// FR-045: Quản lý nhật ký hệ thống (Audit Logs)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '200', 10);
    const search = searchParams.get('search') ? searchParams.get('search').trim() : '';
    const moduleFilter = searchParams.get('module') ? searchParams.get('module').trim() : '';

    // Điều kiện lọc động
    const conditions = [];
    const params = [];

    if (moduleFilter && moduleFilter !== 'ALL') {
      conditions.push('l.module = ?');
      params.push(moduleFilter);
    }

    if (search) {
      conditions.push('(l.description LIKE ? OR l.action LIKE ? OR l.ip_address LIKE ? OR u.full_name LIKE ? OR u.phone LIKE ?)');
      const term = `%${search}%`;
      params.push(term, term, term, term, term);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Lấy danh sách nhật ký kèm thông tin người thực hiện và vai trò
    const logs = await query(`
      SELECT l.*, 
             COALESCE(u.full_name, 'Khách vãng lai / Hệ thống') as user_name, 
             u.phone,
             r.role_name
      FROM system_logs l
      LEFT JOIN users u ON l.user_id = u.id
      LEFT JOIN roles r ON u.role_id = r.id
      ${whereClause}
      ORDER BY l.id DESC
      LIMIT ?
    `, [...params, limit]);

    // Thống kê nhanh cho Dashboard Audit Logs
    const [statsRow] = await query(`
      SELECT 
        COUNT(*) as total_count,
        SUM(CASE WHEN DATE(created_at) = CURDATE() THEN 1 ELSE 0 END) as today_count,
        COUNT(DISTINCT ip_address) as unique_ips
      FROM system_logs
    `);

    // Danh sách phân hệ có trong dữ liệu
    const modulesRows = await query(`
      SELECT DISTINCT module 
      FROM system_logs 
      WHERE module IS NOT NULL AND module != ''
      ORDER BY module ASC
    `);

    return NextResponse.json({
      success: true,
      count: logs.length,
      data: logs,
      stats: {
        total: statsRow?.total_count || 0,
        today: statsRow?.today_count || 0,
        uniqueIps: statsRow?.unique_ips || 0
      },
      availableModules: modulesRows.map((r) => r.module)
    });
  } catch (error) {
    console.error('Error fetching system logs:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// Quy tắc hệ thống: Không cho phép chỉnh sửa nhật ký
export async function PUT() {
  return NextResponse.json({
    success: false,
    message: 'Quy tắc hệ thống: Nhật ký hệ thống là bất biến, không cho phép chỉnh sửa!'
  }, { status: 403 });
}

// Quy tắc hệ thống: Không cho phép xóa nhật ký
export async function DELETE() {
  return NextResponse.json({
    success: false,
    message: 'Quy tắc hệ thống: Nhật ký hệ thống là bất biến, không cho phép xóa!'
  }, { status: 403 });
}

// Ghi nhận nhật ký sự cố hoặc hành động từ giao diện người dùng
export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { action = 'CLIENT_ERROR', module = 'SYSTEM', description = '', userId = null } = body;
    await logSystemAction({
      request,
      userId: userId ? parseInt(userId, 10) : 1,
      action: String(action).slice(0, 50),
      module: String(module).slice(0, 50),
      description: String(description || 'Lỗi không xác định trên giao diện').slice(0, 500),
    });
    return NextResponse.json({ success: true, message: 'Đã ghi nhận nhật ký thành công' });
  } catch (error) {
    console.error('Lỗi khi ghi nhật ký từ client (POST):', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
