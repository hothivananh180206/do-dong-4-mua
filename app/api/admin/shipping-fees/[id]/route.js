import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const rows = await query('SELECT * FROM shipping_fees WHERE id = ?', [id]);
    if (rows.length === 0) {
      return NextResponse.json({ success: false, message: 'Nấc phí không tồn tại.' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error fetching shipping fee:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const { name, min_km, max_km, fee, status } = await request.json();

    if (!name || name.trim() === '') {
      return NextResponse.json({ success: false, message: 'Vui lòng nhập tên gói cước vận chuyển!' }, { status: 400 });
    }

    const minKmNum = parseFloat(min_km);
    const maxKmNum = parseFloat(max_km);
    const feeNum = parseFloat(fee);

    if (isNaN(minKmNum) || isNaN(maxKmNum) || minKmNum < 0 || maxKmNum <= minKmNum) {
      return NextResponse.json({ success: false, message: 'Khoảng cách không hợp lệ! Khoảng cách đến phải lớn hơn khoảng cách từ (km >= 0).' }, { status: 400 });
    }

    if (isNaN(feeNum) || feeNum < 0) {
      return NextResponse.json({ success: false, message: 'Mức phí vận chuyển phải lớn hơn hoặc bằng 0 đ!' }, { status: 400 });
    }

    await query(
      `UPDATE shipping_fees
       SET name = ?, min_km = ?, max_km = ?, fee = ?, status = ?
       WHERE id = ?`,
      [name.trim(), minKmNum, maxKmNum, feeNum, status !== undefined ? Number(status) : 1, id]
    );

    await query(
      `INSERT INTO system_logs (user_id, action, module, description)
       VALUES (1, 'UPDATE_SHIPPING_FEE', 'SYSTEM', ?)`,
      [`Admin Tổng cập nhật nấc cước ID #${id}: ${name.trim()} (${minKmNum}km - ${maxKmNum}km: ${feeNum.toLocaleString('vi-VN')} đ)`]
    );

    return NextResponse.json({
      success: true,
      message: 'Cập nhật nấc phí vận chuyển thành công!'
    });
  } catch (error) {
    console.error('Error updating shipping fee:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const existing = await query('SELECT name FROM shipping_fees WHERE id = ?', [id]);
    const feeName = existing[0]?.name || `#${id}`;

    await query('DELETE FROM shipping_fees WHERE id = ?', [id]);

    await query(
      `INSERT INTO system_logs (user_id, action, module, description)
       VALUES (1, 'DELETE_SHIPPING_FEE', 'SYSTEM', ?)`,
      [`Admin Tổng xóa nấc cước vận chuyển ID #${id} (${feeName})`]
    );

    return NextResponse.json({
      success: true,
      message: 'Xóa nấc phí vận chuyển thành công!'
    });
  } catch (error) {
    console.error('Error deleting shipping fee:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

