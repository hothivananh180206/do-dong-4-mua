import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// API 35: Cập nhật số lượng món hàng trong giỏ
export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const { quantity } = await request.json();

    if (!quantity || quantity <= 0) {
      await query('DELETE FROM cart_items WHERE id = ?', [id]);
      return NextResponse.json({ success: true, message: 'Đã xóa món hàng khỏi giỏ.' });
    }

    await query('UPDATE cart_items SET quantity = ? WHERE id = ?', [quantity, id]);
    return NextResponse.json({ success: true, message: 'Đã cập nhật số lượng thành công.' });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// API 36: Xóa món hàng khỏi giỏ
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await query('DELETE FROM cart_items WHERE id = ?', [id]);
    return NextResponse.json({ success: true, message: 'Đã xóa sản phẩm khỏi giỏ hàng.' });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export { PATCH as PUT };


