import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const branches = await query(`
      SELECT b.*, (SELECT COUNT(*) FROM users u WHERE u.branch_id = b.id) AS staff_count 
      FROM branches b 
      WHERE b.id = ?
    `, [id]);

    if (branches.length === 0) {
      return NextResponse.json({ success: false, message: 'Chi nhánh không tồn tại.' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: branches[0] });
  } catch (error) {
    console.error('Error fetching branch:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const { branch_name, phone, address, status } = await request.json();

    if (!branch_name || !phone || !address) {
      return NextResponse.json({ success: false, message: 'Vui lòng cung cấp đầy đủ thông tin chi nhánh (Tên, SĐT, Địa chỉ).' }, { status: 400 });
    }

    const trimmedName = branch_name.trim();
    const trimmedPhone = phone.trim();
    const trimmedAddress = address.trim();

    // Kiểm tra trùng tên chi nhánh với các chi nhánh khác
    const duplicate = await query('SELECT id FROM branches WHERE LOWER(branch_name) = LOWER(?) AND id != ?', [trimmedName, id]);
    if (duplicate.length > 0) {
      return NextResponse.json({ success: false, message: 'Tên chi nhánh này đã được sử dụng bởi chi nhánh khác!' }, { status: 400 });
    }

    await query(
      `UPDATE branches 
       SET branch_name = ?,
           phone = ?,
           address = ?,
           status = ?
       WHERE id = ?`,
      [trimmedName, trimmedPhone, trimmedAddress, status !== undefined ? Number(status) : 1, id]
    );

    return NextResponse.json({ success: true, message: 'Cập nhật thông tin chi nhánh thành công!' });
  } catch (error) {
    console.error('Error updating branch:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    // BR-025: Ràng buộc toàn vẹn dữ liệu - Không được xóa nếu còn nhân viên/quản trị viên thuộc chi nhánh
    const users = await query('SELECT COUNT(*) as count FROM users WHERE branch_id = ?', [id]);
    if (users[0]?.count > 0) {
      return NextResponse.json({
        success: false,
        message: `Không thể xóa chi nhánh này vì hiện còn ${users[0].count} tài khoản quản trị viên/nhân viên trực thuộc. Vui lòng chuyển sang trạng thái "Ngừng hoạt động" để đảm bảo an toàn dữ liệu.`
      }, { status: 400 });
    }

    await query('DELETE FROM branches WHERE id = ?', [id]);
    return NextResponse.json({ success: true, message: 'Đã xóa chi nhánh thành công!' });
  } catch (error) {
    console.error('Error deleting branch:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
