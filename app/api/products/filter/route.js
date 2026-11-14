import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category_id = searchParams.get('category_id');
    const min_price = searchParams.get('min_price');
    const max_price = searchParams.get('max_price');

    let sql = 'SELECT * FROM products WHERE status = 1';
    const params = [];
    if (category_id) {
      sql += ' AND category_id = ?';
      params.push(category_id);
    }
    if (min_price) {
      sql += ' AND price >= ?';
      params.push(min_price);
    }
    if (max_price) {
      sql += ' AND price <= ?';
      params.push(max_price);
    }
    const products = await query(sql, params);
    return NextResponse.json({ success: true, count: products.length, data: products });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
