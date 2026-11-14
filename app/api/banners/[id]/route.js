import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const rows = await query('SELECT * FROM banners WHERE id = ?', [id]);
    if (rows.length === 0) {
      return NextResponse.json({ success: false, message: 'Banner không tồn tại.' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error fetching banner:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const { title, image_url, link_url, display_order, status } = await request.json();

    if (!title || !image_url) {
      return NextResponse.json({ success: false, message: 'Vui lòng cung cấp đầy đủ tiêu đề và hình ảnh banner.' }, { status: 400 });
    }

    const trimmedTitle = title.trim();
    const trimmedImage = image_url.trim();
    const trimmedLink = link_url ? link_url.trim() : '/';
    const orderNum = display_order !== undefined && display_order !== '' ? parseInt(display_order, 10) : 0;
    const statusNum = status !== undefined ? Number(status) : 1;

    await query(
      `UPDATE banners 
       SET title = ?,
           image_url = ?,
           link_url = ?,
           display_order = ?,
           status = ?
       WHERE id = ?`,
      [trimmedTitle, trimmedImage, trimmedLink, isNaN(orderNum) ? 0 : orderNum, statusNum, id]
    );

    return NextResponse.json({ success: true, message: 'Cập nhật Banner thành công!' });
  } catch (error) {
    console.error('Error updating banner:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await query('DELETE FROM banners WHERE id = ?', [id]);
    return NextResponse.json({ success: true, message: 'Xóa Banner thành công!' });
  } catch (error) {
    console.error('Error deleting banner:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
