import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import fs from 'fs';
import path from 'path';

function deletePhysicalFile(imageUrl) {
  if (!imageUrl || typeof imageUrl !== 'string') return;
  if (imageUrl.startsWith('/uploads/')) {
    const filename = path.basename(imageUrl);
    const filePath = path.join(process.cwd(), 'public', 'uploads', filename);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        console.log(`[Dọn rác bộ nhớ] Đã xóa tệp ảnh: ${filePath}`);
      } catch (err) {
        console.error(`[Dọn rác bộ nhớ] Lỗi khi xóa tệp ${filePath}:`, err);
      }
    }
  }
}

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const all = searchParams.get('all') === '1' || searchParams.get('all') === 'true';
    const isNum = !isNaN(id);

    const sql = `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE ${isNum ? 'p.id = ?' : 'p.slug = ?'} ${all ? '' : 'AND p.status = 1'}
      LIMIT 1
    `;
    const products = await query(sql, [id]);

    if (!products || products.length === 0) {
      return NextResponse.json({ success: false, message: 'Sản phẩm không tồn tại hoặc đã bị ẩn' }, { status: 404 });
    }

    const product = products[0];

    // Fetch additional images if any
    const images = await query('SELECT id, image_url, display_order FROM product_images WHERE product_id = ? ORDER BY display_order ASC', [product.id]);
    const extraUrls = images.map(i => i.image_url).filter(Boolean);
    const combinedImages = [product.thumbnail, ...extraUrls.filter(u => u !== product.thumbnail)].filter(Boolean);
    product.images = combinedImages.length > 0 ? combinedImages : [product.thumbnail || '/images/placeholder.png'];

    // Fetch related products in same category
    const related = await query(
      `SELECT id, name, slug, price, discount_price, unit, stock, thumbnail 
       FROM products 
       WHERE category_id = ? AND id != ? AND status = 1 
       LIMIT 4`,
      [product.category_id, product.id]
    );
    product.related = related;

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error('Error fetching product detail:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { category_id, name, description, price, discount_price, unit, stock, thumbnail, is_featured, status } = body;

    if (name !== undefined && !name.trim()) {
      return NextResponse.json({ success: false, message: 'Tên trái cây không được để trống' }, { status: 400 });
    }

    if (price !== undefined) {
      const numericPrice = parseFloat(price);
      if (isNaN(numericPrice) || numericPrice <= 0) {
        return NextResponse.json({ success: false, message: 'Giá bán của sản phẩm phải lớn hơn 0đ' }, { status: 400 });
      }
    }

    if (stock !== undefined) {
      const numericStock = parseInt(stock, 10);
      if (isNaN(numericStock) || numericStock < 0) {
        return NextResponse.json({ success: false, message: 'Số lượng tồn kho không được âm' }, { status: 400 });
      }
    }

    // Dọn dẹp tệp ảnh cũ trên ổ cứng nếu người dùng cập nhật ảnh đại diện mới
    if (thumbnail !== undefined && thumbnail !== null && thumbnail !== '') {
      const currentRows = await query('SELECT thumbnail FROM products WHERE id = ?', [id]);
      const oldThumbnail = currentRows?.[0]?.thumbnail;
      if (oldThumbnail && oldThumbnail !== thumbnail) {
        deletePhysicalFile(oldThumbnail);
      }
    }

    await query(
      `UPDATE products 
       SET category_id = COALESCE(?, category_id),
           name = COALESCE(?, name),
           description = COALESCE(?, description),
           price = COALESCE(?, price),
           discount_price = ?,
           unit = COALESCE(?, unit),
           stock = COALESCE(?, stock),
           thumbnail = COALESCE(?, thumbnail),
           is_featured = COALESCE(?, is_featured),
           status = COALESCE(?, status)
       WHERE id = ?`,
      [
        category_id !== undefined ? category_id : null,
        name !== undefined ? name.trim() : null,
        description !== undefined ? description.trim() : null,
        price !== undefined ? parseFloat(price) : null,
        discount_price !== undefined && discount_price !== '' && discount_price !== null ? parseFloat(discount_price) : null,
        unit !== undefined ? unit : null,
        stock !== undefined ? parseInt(stock, 10) : null,
        thumbnail !== undefined ? thumbnail : null,
        is_featured !== undefined ? (is_featured ? 1 : 0) : null,
        status !== undefined ? (status ? 1 : 0) : null,
        id
      ]
    );

    await query(
      'INSERT INTO system_logs (user_id, action, module, description) VALUES (1, ?, ?, ?)',
      ['UPDATE_PRODUCT', 'PRODUCT', `Cập nhật thông tin sản phẩm ID #${id}: ${name || ''}`]
    );

    return NextResponse.json({ success: true, message: 'Cập nhật thông tin sản phẩm thành công!' });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updates = [];
    const values = [];
    let logDesc = `Điều chỉnh sản phẩm ID #${id}: `;

    if (body.status !== undefined) {
      const newStatus = body.status === 1 || body.status === true ? 1 : 0;
      updates.push('status = ?');
      values.push(newStatus);
      logDesc += `Trạng thái -> ${newStatus === 1 ? 'Hiển thị' : 'Ẩn'}; `;
    }

    if (body.stock !== undefined) {
      const s = parseInt(body.stock, 10);
      if (isNaN(s) || s < 0) {
        return NextResponse.json({ success: false, message: 'Số lượng tồn kho không được âm' }, { status: 400 });
      }
      updates.push('stock = ?');
      values.push(s);
      logDesc += `Tồn kho -> ${s}; `;
    }

    if (body.price !== undefined) {
      const p = parseFloat(body.price);
      if (isNaN(p) || p <= 0) {
        return NextResponse.json({ success: false, message: 'Giá bán phải lớn hơn 0đ' }, { status: 400 });
      }
      updates.push('price = ?');
      values.push(p);
      logDesc += `Giá bán -> ${p.toLocaleString('vi-VN')}đ; `;
    }

    if (body.is_featured !== undefined) {
      const f = body.is_featured === 1 || body.is_featured === true ? 1 : 0;
      updates.push('is_featured = ?');
      values.push(f);
      logDesc += `Nổi bật -> ${f === 1 ? 'Có' : 'Không'}; `;
    }

    if (body.thumbnail !== undefined) {
      const currentRows = await query('SELECT thumbnail FROM products WHERE id = ?', [id]);
      const oldThumbnail = currentRows?.[0]?.thumbnail;
      if (oldThumbnail && oldThumbnail !== body.thumbnail) {
        deletePhysicalFile(oldThumbnail);
      }
      updates.push('thumbnail = ?');
      values.push(body.thumbnail);
      logDesc += `Đổi ảnh đại diện; `;
    }

    if (updates.length === 0) {
      return NextResponse.json({ success: false, message: 'Không có dữ liệu thay đổi' }, { status: 400 });
    }

    values.push(id);
    await query(`UPDATE products SET ${updates.join(', ')} WHERE id = ?`, values);

    await query(
      'INSERT INTO system_logs (user_id, action, module, description) VALUES (1, ?, ?, ?)',
      ['PATCH_PRODUCT', 'PRODUCT', logDesc]
    );

    return NextResponse.json({ success: true, message: 'Cập nhật sản phẩm thành công!' });
  } catch (error) {
    console.error('Error patching product:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    
    // Kiểm tra ràng buộc toàn vẹn: đơn hàng
    const orders = await query('SELECT COUNT(*) as count FROM order_details WHERE product_id = ?', [id]);
    const productRows = await query('SELECT name, thumbnail FROM products WHERE id = ?', [id]);
    
    if (!productRows || productRows.length === 0) {
      return NextResponse.json({ success: false, message: 'Sản phẩm không tồn tại.' }, { status: 404 });
    }

    const product = productRows[0];
    const productName = product.name;

    if (orders.length > 0 && orders[0].count > 0) {
      return NextResponse.json({
        success: false,
        message: `Sản phẩm "${productName}" đã có ${orders[0].count} đơn hàng liên kết trong lịch sử. Theo quy định toàn vẹn dữ liệu, không thể xóa vĩnh viễn mà chỉ được phép ẩn sản phẩm!`
      }, { status: 400 });
    }

    // 1. Dọn dẹp tệp ảnh vật lý trên ổ cứng (ảnh chính + ảnh phụ) để tránh dữ liệu rác
    const extraImages = await query('SELECT image_url FROM product_images WHERE product_id = ?', [id]);
    for (const img of extraImages) {
      deletePhysicalFile(img.image_url);
    }
    if (product.thumbnail) {
      deletePhysicalFile(product.thumbnail);
    }

    // 2. Xóa bản ghi trong CSDL
    await query('DELETE FROM product_images WHERE product_id = ?', [id]);
    await query('DELETE FROM products WHERE id = ?', [id]);

    await query(
      'INSERT INTO system_logs (user_id, action, module, description) VALUES (1, ?, ?, ?)',
      ['DELETE_PRODUCT', 'PRODUCT', `Đã xóa vĩnh viễn sản phẩm: "${productName}" (ID: ${id})`]
    );

    return NextResponse.json({ success: true, message: `Đã xóa vĩnh viễn sản phẩm "${productName}" thành công!` });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

