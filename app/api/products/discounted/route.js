import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// API 19: Danh sách sản phẩm đang giảm giá
export async function GET() {
  try {
    const products = await query(`
      SELECT p.*, c.name as category_name
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE p.status = 1 AND p.discount_price IS NOT NULL AND p.discount_price < p.price
      ORDER BY (p.price - p.discount_price) DESC
    `);

    return NextResponse.json({ success: true, count: products.length, data: products });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

