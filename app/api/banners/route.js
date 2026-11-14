import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get('all') === 'true';

    const sql = all
      ? `SELECT * FROM banners ORDER BY display_order ASC, id ASC`
      : `SELECT * FROM banners WHERE status = 1 ORDER BY display_order ASC, id ASC`;

    const banners = await query(sql);

    return NextResponse.json({ success: true, data: banners });
  } catch (error) {
    console.error('Error fetching banners:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { title, image_url, link_url, display_order } = await request.json();
    if (!title || !image_url) {
      return NextResponse.json({ success: false, message: 'Vui lòng nhập tiêu đề và tải lên hình ảnh cho banner.' }, { status: 400 });
    }

    const trimmedTitle = title.trim();
    const trimmedImage = image_url.trim();
    const trimmedLink = link_url ? link_url.trim() : '/';
    const orderNum = display_order !== undefined && display_order !== '' ? parseInt(display_order, 10) : 0;

    const result = await query(
      `INSERT INTO banners (title, image_url, link_url, display_order, status)
       VALUES (?, ?, ?, ?, 1)`,
      [trimmedTitle, trimmedImage, trimmedLink, isNaN(orderNum) ? 0 : orderNum]
    );

    return NextResponse.json({ success: true, message: 'Thêm banner mới thành công!', id: result.insertId }, { status: 201 });
  } catch (error) {
    console.error('Error adding banner:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { id, title, image_url, link_url, display_order, status } = await request.json();
    if (!id) {
      return NextResponse.json({ success: false, message: 'Thiếu mã banner cần cập nhật.' }, { status: 400 });
    }

    await query(
      `UPDATE banners 
       SET title = COALESCE(?, title),
           image_url = COALESCE(?, image_url),
           link_url = COALESCE(?, link_url),
           display_order = COALESCE(?, display_order),
           status = COALESCE(?, status)
       WHERE id = ?`,
      [
        title ? title.trim() : null,
        image_url ? image_url.trim() : null,
        link_url !== undefined ? link_url.trim() : null,
        display_order !== undefined ? parseInt(display_order, 10) : null,
        status !== undefined ? Number(status) : null,
        id
      ]
    );
    return NextResponse.json({ success: true, message: 'Cập nhật banner thành công!' });
  } catch (error) {
    console.error('Error updating banner:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, message: 'Thiếu mã banner cần xóa.' }, { status: 400 });
    }
    await query('DELETE FROM banners WHERE id = ?', [id]);
    return NextResponse.json({ success: true, message: 'Đã xóa banner thành công!' });
  } catch (error) {
    console.error('Error deleting banner:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
