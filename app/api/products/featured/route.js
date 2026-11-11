import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// API 20: Danh sách sản phẩm nổi bật
export async function GET() {
  try {
    const products = await query(`
      SELECT p.*, c.name as category_name
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE p.status = 1 AND p.is_featured = 1
      ORDER BY p.id DESC
      LIMIT 12
    `);

    return NextResponse.json({ success: true, count: products.length, data: products });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

