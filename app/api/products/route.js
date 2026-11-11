import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const season = searchParams.get('season') || '';
    const featured = searchParams.get('featured');
    const sort = searchParams.get('sort') || 'newest';
    const all = searchParams.get('all') === '1' || searchParams.get('all') === 'true';
    const limit = searchParams.get('limit');
    const min_price = searchParams.get('min_price');
    const max_price = searchParams.get('max_price');
    const in_stock = searchParams.get('in_stock');
    const discounted = searchParams.get('discounted');

    let sql = `
      SELECT p.*, c.name as category_name, c.slug as category_slug,
             (SELECT COUNT(*) FROM order_details od WHERE od.product_id = p.id) as order_count
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (!all) {
      sql += ` AND p.status = 1`;
    }

    if (search) {
      // Tìm kiếm gần đúng theo tên sản phẩm
      sql += ` AND p.name LIKE ?`;
      params.push(`%${search}%`);
    }

    if (category) {
      if (isNaN(category)) {
        sql += ` AND c.slug = ?`;
        params.push(category);
      } else {
        sql += ` AND p.category_id = ?`;
        params.push(category);
      }
    }

    if (season) {
      const seasonMap = {
        xuan: 'MÙA XUÂN',
        ha: 'MÙA HẠ',
        thu: 'MÙA THU',
        dong: 'MÙA ĐÔNG'
      };
      const keyword = seasonMap[season.toLowerCase()] || season;
      sql += ` AND (p.description LIKE ? OR p.name LIKE ?)`;
      params.push(`%${keyword}%`, `%${keyword}%`);
    }

    if (featured === '1' || featured === 'true') {
      sql += ` AND p.is_featured = 1`;
    }

    if (min_price && !isNaN(parseFloat(min_price))) {
      sql += ` AND COALESCE(p.discount_price, p.price) >= ?`;
      params.push(parseFloat(min_price));
    }

    if (max_price && !isNaN(parseFloat(max_price))) {
      sql += ` AND COALESCE(p.discount_price, p.price) <= ?`;
      params.push(parseFloat(max_price));
    }

    if (in_stock === '1' || in_stock === 'true') {
      sql += ` AND p.stock > 0`;
    }

    if (discounted === '1' || discounted === 'true') {
      sql += ` AND p.discount_price IS NOT NULL AND p.discount_price < p.price`;
    }

    if (sort === 'price_asc') {
      sql += ` ORDER BY COALESCE(p.discount_price, p.price) ASC`;
    } else if (sort === 'price_desc') {
      sql += ` ORDER BY COALESCE(p.discount_price, p.price) DESC`;
    } else if (sort === 'name_asc') {
      sql += ` ORDER BY p.name ASC`;
    } else if (sort === 'name_desc') {
      sql += ` ORDER BY p.name DESC`;
    } else {
      sql += ` ORDER BY p.id DESC`;
    }

    if (limit && !isNaN(parseInt(limit, 10))) {
      sql += ` LIMIT ?`;
      params.push(parseInt(limit, 10));
    }

    const products = await query(sql, params);
    return NextResponse.json({ success: true, count: products.length, data: products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { category_id, name, slug, description, price, discount_price, unit, stock, thumbnail, is_featured } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, message: 'Tên trái cây không được để trống' }, { status: 400 });
    }

    const numericPrice = parseFloat(price);
    if (!price || isNaN(numericPrice) || numericPrice <= 0) {
      return NextResponse.json({ success: false, message: 'Giá bán của sản phẩm phải lớn hơn 0đ' }, { status: 400 });
    }

    const numericDiscount = discount_price ? parseFloat(discount_price) : null;
    if (numericDiscount !== null && (isNaN(numericDiscount) || numericDiscount < 0 || numericDiscount >= numericPrice)) {
      return NextResponse.json({ success: false, message: 'Giá khuyến mãi phải nhỏ hơn giá bán gốc và không được âm' }, { status: 400 });
    }

    const numericStock = stock !== undefined && stock !== '' ? parseInt(stock, 10) : 0;
    if (isNaN(numericStock) || numericStock < 0) {
      return NextResponse.json({ success: false, message: 'Số lượng tồn kho không được âm' }, { status: 400 });
    }

    const autoSlug = slug || name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const result = await query(
      `INSERT INTO products (category_id, name, slug, description, price, discount_price, unit, stock, thumbnail, is_featured, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [
        category_id || 1,
        name.trim(),
        autoSlug + '-' + Date.now().toString().slice(-4),
        description ? description.trim() : '',
        numericPrice,
        numericDiscount,
        unit || 'kg',
        numericStock,
        thumbnail || 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&auto=format&fit=crop&q=80',
        is_featured ? 1 : 0
      ]
    );

    await query(
      'INSERT INTO system_logs (user_id, action, module, description) VALUES (1, ?, ?, ?)',
      ['CREATE_PRODUCT', 'PRODUCT', `Thêm sản phẩm mới: ${name.trim()} (Giá: ${numericPrice.toLocaleString('vi-VN')}đ, Tồn kho: ${numericStock})`]
    );

    return NextResponse.json({ success: true, message: 'Thêm sản phẩm mới thành công', id: result.insertId }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

