import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// API 11 (FR-016): Tìm kiếm sản phẩm theo tên (không phân biệt chữ hoa/thường, tìm gần đúng)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get('q') || searchParams.get('search') || '').trim();

    const sql = `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.name LIKE ? AND p.status = 1
      ORDER BY p.id DESC
      LIMIT 50
    `;

    const products = await query(sql, [`%${q}%`]);
    return NextResponse.json({ success: true, count: products.length, data: products });
  } catch (err) {
    console.error('Lỗi tìm kiếm sản phẩm:', err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
