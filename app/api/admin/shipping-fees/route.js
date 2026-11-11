import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const onlyActive = searchParams.get('active') === 'true';

    const sql = onlyActive
      ? `SELECT * FROM shipping_fees WHERE status = 1 ORDER BY min_km ASC, id ASC`
      : `SELECT * FROM shipping_fees ORDER BY min_km ASC, id ASC`;

    const fees = await query(sql);
    return NextResponse.json({ success: true, data: fees });
  } catch (error) {
    console.error('Error fetching shipping fees:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
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

    const result = await query(
      `INSERT INTO shipping_fees (name, min_km, max_km, fee, status) VALUES (?, ?, ?, ?, ?)`,
      [name.trim(), minKmNum, maxKmNum, feeNum, status !== undefined ? Number(status) : 1]
    );

    await query(
      `INSERT INTO system_logs (user_id, action, module, description)
       VALUES (1, 'CREATE_SHIPPING_FEE', 'SYSTEM', ?)`,
      [`Admin Tổng thêm nấc cước vận chuyển: ${name.trim()} (${minKmNum}km - ${maxKmNum}km: ${feeNum.toLocaleString('vi-VN')} đ)`]
    );

    return NextResponse.json({
      success: true,
      message: 'Thêm nấc phí vận chuyển thành công!',
      id: result.insertId
    }, { status: 201 });
  } catch (error) {
    console.error('Error adding shipping fee:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

