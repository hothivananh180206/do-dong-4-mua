import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get('all') === 'true';

    const sql = all
      ? `SELECT b.*, (SELECT COUNT(*) FROM users u WHERE u.branch_id = b.id) AS staff_count 
         FROM branches b 
         ORDER BY b.id ASC`
      : `SELECT b.*, (SELECT COUNT(*) FROM users u WHERE u.branch_id = b.id) AS staff_count 
         FROM branches b 
         WHERE b.status = 1 
         ORDER BY b.id ASC`;

    const branches = await query(sql);

    return NextResponse.json({ success: true, data: branches });
  } catch (error) {
    console.error('Error fetching branches:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { branch_name, phone, address } = await request.json();
    if (!branch_name || !phone || !address) {
      return NextResponse.json({ success: false, message: 'Vui lòng nhập đủ tên, SĐT và địa chỉ chi nhánh' }, { status: 400 });
    }

    const trimmedName = branch_name.trim();
    const trimmedPhone = phone.trim();
    const trimmedAddress = address.trim();

    // Kiểm tra trùng tên chi nhánh
    const existing = await query('SELECT id FROM branches WHERE LOWER(branch_name) = LOWER(?)', [trimmedName]);
    if (existing.length > 0) {
      return NextResponse.json({ success: false, message: 'Tên chi nhánh này đã tồn tại trong hệ thống!' }, { status: 400 });
    }

    const result = await query(
      `INSERT INTO branches (branch_name, phone, address, status) VALUES (?, ?, ?, 1)`,
      [trimmedName, trimmedPhone, trimmedAddress]
    );

    return NextResponse.json({ success: true, message: 'Thêm chi nhánh thành công', id: result.insertId }, { status: 201 });
  } catch (error) {
    console.error('Error adding branch:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
