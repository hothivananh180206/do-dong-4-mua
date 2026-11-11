import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// API 18: Cập nhật số lượng tồn kho sản phẩm
export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const { stock } = await request.json();

    if (stock === undefined || parseInt(stock, 10) < 0) {
      return NextResponse.json({ success: false, message: 'Số lượng tồn kho không hợp lệ.' }, { status: 400 });
    }

    await query('UPDATE products SET stock = ? WHERE id = ?', [parseInt(stock, 10), id]);

    return NextResponse.json({ success: true, message: 'Cập nhật số lượng tồn kho thành công!' });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export { PATCH as PUT };


