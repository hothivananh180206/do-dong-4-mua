import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

function slugify(text) {
  return (text || '')
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

// FR-007: Lấy danh sách danh mục (kèm số lượng sản phẩm liên kết)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeHidden = searchParams.get('all') === '1' || searchParams.get('admin') === '1';

    let sql = `
      SELECT c.*, COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id AND p.status = 1
    `;

    if (!includeHidden) {
      sql += ` WHERE c.status = 1 `;
    }

    sql += ` GROUP BY c.id ORDER BY c.id ASC `;

    const categories = await query(sql);

    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error('Lỗi lấy danh mục:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// FR-007: Thêm danh mục mới (Kiểm tra bắt buộc và chống trùng lặp theo SRS)
export async function POST(request) {
  try {
    const { name, description } = await request.json();
    const cleanName = (name || '').trim();

    // 1. Luồng ngoại lệ: Tên danh mục để trống
    if (!cleanName) {
      return NextResponse.json({ success: false, message: 'Tên danh mục không được để trống.' }, { status: 400 });
    }

    // 2. Luồng ngoại lệ & Quy tắc nghiệp vụ: Không cho phép trùng tên danh mục
    const existing = await query(
      'SELECT id, name FROM categories WHERE LOWER(TRIM(name)) = LOWER(TRIM(?)) LIMIT 1',
      [cleanName]
    );

    if (existing.length > 0) {
      return NextResponse.json({
        success: false,
        message: 'Tên danh mục đã tồn tại trong hệ thống. Vui lòng chọn tên khác.'
      }, { status: 400 });
    }

    let autoSlug = slugify(cleanName);
    const slugCheck = await query('SELECT id FROM categories WHERE slug = ?', [autoSlug]);
    if (slugCheck.length > 0) {
      autoSlug = `${autoSlug}-${Date.now().toString().slice(-4)}`;
    }

    const result = await query(
      `INSERT INTO categories (name, slug, description, status) VALUES (?, ?, ?, 1)`,
      [cleanName, autoSlug, (description || '').trim()]
    );

    // Ghi nhật ký hệ thống
    try {
      await query(
        `INSERT INTO system_logs (user_id, action, module, description)
         VALUES (1, 'CREATE_CATEGORY', 'CATEGORY', ?)`,
        [`Tạo danh mục sản phẩm mới: ${cleanName} (ID: ${result.insertId})`]
      );
    } catch (e) {}

    return NextResponse.json({
      success: true,
      message: 'Thêm danh mục mới thành công!',
      id: result.insertId
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// FR-007: Chỉnh sửa danh mục
export async function PUT(request) {
  try {
    const { id, name, description, status } = await request.json();
    const cleanName = (name || '').trim();

    if (!id || !cleanName) {
      return NextResponse.json({ success: false, message: 'Vui lòng cung cấp mã và tên danh mục.' }, { status: 400 });
    }

    // Kiểm tra trùng tên với danh mục khác
    const duplicate = await query(
      'SELECT id FROM categories WHERE LOWER(TRIM(name)) = LOWER(TRIM(?)) AND id != ? LIMIT 1',
      [cleanName, id]
    );

    if (duplicate.length > 0) {
      return NextResponse.json({
        success: false,
        message: 'Tên danh mục đã tồn tại trên hệ thống. Vui lòng đặt tên khác.'
      }, { status: 400 });
    }

    const autoSlug = slugify(cleanName);

    await query(
      `UPDATE categories 
       SET name = ?, slug = ?, description = ?, status = COALESCE(?, status) 
       WHERE id = ?`,
      [cleanName, autoSlug, (description || '').trim(), status !== undefined ? status : null, id]
    );

    try {
      await query(
        `INSERT INTO system_logs (user_id, action, module, description)
         VALUES (1, 'UPDATE_CATEGORY', 'CATEGORY', ?)`,
        [`Cập nhật thông tin danh mục ID ${id}: ${cleanName}`]
      );
    } catch (e) {}

    return NextResponse.json({ success: true, message: 'Cập nhật danh mục thành công!' });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// FR-007: Xóa hoặc Ẩn danh mục (Theo quy tắc nghiệp vụ: Danh mục đã có sản phẩm chỉ được ẩn, không được xóa)
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Thiếu mã danh mục.' }, { status: 400 });
    }

    const catRows = await query('SELECT id, name FROM categories WHERE id = ?', [id]);
    if (catRows.length === 0) {
      return NextResponse.json({ success: false, message: 'Không tìm thấy danh mục.' }, { status: 404 });
    }
    const cat = catRows[0];

    // Kiểm tra ràng buộc sản phẩm (Quy tắc BR-001 & FR-007)
    const prods = await query('SELECT id FROM products WHERE category_id = ?', [id]);
    if (prods.length > 0) {
      return NextResponse.json({
        success: false,
        message: `Danh mục "${cat.name}" đang có ${prods.length} sản phẩm liên kết. Theo quy định hệ thống, danh mục này không thể xóa mà chỉ được phép ẩn!`
      }, { status: 400 });
    }

    await query('DELETE FROM categories WHERE id = ?', [id]);

    try {
      await query(
        `INSERT INTO system_logs (user_id, action, module, description)
         VALUES (1, 'DELETE_CATEGORY', 'CATEGORY', ?)`,
        [`Xóa vĩnh viễn danh mục trống ID ${id}: ${cat.name}`]
      );
    } catch (e) {}

    return NextResponse.json({ success: true, message: `Đã xóa danh mục "${cat.name}" thành công!` });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
