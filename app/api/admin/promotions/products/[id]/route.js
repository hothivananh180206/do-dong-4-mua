import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await query('DELETE FROM promotion_products WHERE id = ? OR product_id = ?', [id, id]);
    return NextResponse.json({ success: true, message: 'Đã xóa sản phẩm khỏi chương trình' });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
