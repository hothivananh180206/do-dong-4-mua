import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// API 17: Xóa ảnh sản phẩm
// DELETE /admin/products/image/{id} hoặc /api/admin/products/image/{id}
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    const existing = await query('SELECT id, product_id FROM product_images WHERE id = ?', [id]);
    if (existing.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Không tìm thấy ảnh sản phẩm để xóa.'
      }, { status: 404 });
    }

    await query('DELETE FROM product_images WHERE id = ?', [id]);

    return NextResponse.json({
      success: true,
      message: 'Xóa ảnh sản phẩm thành công!'
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

