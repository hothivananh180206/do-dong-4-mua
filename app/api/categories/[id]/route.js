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

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const cats = await query('SELECT * FROM categories WHERE id = ?', [id]);
    if (cats.length === 0) {
      return NextResponse.json({ success: false, message: 'Danh mục không tồn tại.' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: cats[0] });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const { name, description, status } = await request.json();
    const cleanName = (name || '').trim();

    if (!cleanName) {
      return NextResponse.json({ success: false, message: 'Tên danh mục không được để trống.' }, { status: 400 });
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
       SET name = ?,
           slug = ?,
           description = ?,
           status = COALESCE(?, status)
       WHERE id = ?`,
      [cleanName, autoSlug, (description || '').trim(), status !== undefined ? status : null, id]
    );

    try {
      await query(
        `INSERT INTO system_logs (user_id, action, module, description)
         VALUES (1, 'UPDATE_CATEGORY', 'CATEGORY', ?)`,
        [`Cập nhật danh mục ID ${id}: ${cleanName}`]
      );
    } catch (e) {}

    return NextResponse.json({ success: true, message: 'Cập nhật danh mục thành công!' });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// Chuyển đổi trạng thái Ẩn / Hiển thị danh mục
export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const { status } = await request.json();

    const catRows = await query('SELECT id, name, status FROM categories WHERE id = ?', [id]);
    if (catRows.length === 0) {
      return NextResponse.json({ success: false, message: 'Không tìm thấy danh mục.' }, { status: 404 });
    }
    const cat = catRows[0];
    const newStatus = status !== undefined ? status : (cat.status === 1 ? 0 : 1);

    await query('UPDATE categories SET status = ? WHERE id = ?', [newStatus, id]);

    try {
      await query(
        `INSERT INTO system_logs (user_id, action, module, description)
         VALUES (1, 'TOGGLE_CATEGORY_STATUS', 'CATEGORY', ?)`,
        [`${newStatus === 1 ? 'Hiển thị' : 'Ẩn'} danh mục ID ${id} (${cat.name})`]
      );
    } catch (e) {}

    return NextResponse.json({
      success: true,
      message: newStatus === 1 ? `Đã hiển thị danh mục "${cat.name}"` : `Đã ẩn danh mục "${cat.name}"`,
      status: newStatus
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
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
