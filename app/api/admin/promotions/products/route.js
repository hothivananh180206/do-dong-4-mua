import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request) {
  try {
    const { promotion_id, product_id } = await request.json();
    if (!promotion_id || !product_id) {
      return NextResponse.json({ success: false, message: 'Thiếu promotion_id hoặc product_id' }, { status: 400 });
    }
    await query(
      `INSERT INTO promotion_products (promotion_id, product_id)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE product_id = VALUES(product_id)`,
      [promotion_id, product_id]
    );
    return NextResponse.json({ success: true, message: 'Gán sản phẩm vào chương trình thành công' });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
