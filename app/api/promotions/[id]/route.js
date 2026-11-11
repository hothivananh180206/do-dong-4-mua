import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const promos = await query('SELECT * FROM promotions WHERE id = ?', [id]);
    if (!promos || promos.length === 0) {
      return NextResponse.json({ success: false, message: 'Chương trình khuyến mãi không tồn tại' }, { status: 404 });
    }

    const promotion = promos[0];

    // Lấy danh sách sản phẩm đang được áp dụng chương trình này
    const products = await query(`
      SELECT p.id, p.name, p.price, p.discount_price, p.thumbnail, p.unit, p.stock, c.name as category_name
      FROM promotion_products pp
      JOIN products p ON pp.product_id = p.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE pp.promotion_id = ?
      ORDER BY p.name ASC
    `, [id]);

    promotion.products = products;
    return NextResponse.json({ success: true, data: promotion });
  } catch (error) {
    console.error('Error fetching promotion detail:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const title = (body.title || body.name || '').trim();
    const discount_percent = parseFloat(body.discount_percent);
    const description = (body.description || '').trim();
    const start_date = body.start_date ? new Date(body.start_date) : null;
    const end_date = body.end_date ? new Date(body.end_date) : null;
    const status = body.status !== undefined ? (body.status ? 1 : 0) : null;

    if (!title) {
      return NextResponse.json({ success: false, message: 'Vui lòng nhập tên chương trình khuyến mãi!' }, { status: 400 });
    }

    if (isNaN(discount_percent) || discount_percent <= 0 || discount_percent > 100) {
      return NextResponse.json({ success: false, message: 'Phần trăm giảm giá phải từ 1% đến 100%!' }, { status: 400 });
    }

    if (start_date && end_date && end_date < start_date) {
      return NextResponse.json({ success: false, message: 'Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu!' }, { status: 400 });
    }

    const formatMysqlDate = (d) => {
      const pad = (n) => String(n).padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    };

    await query(`
      UPDATE promotions 
      SET title = ?,
          description = ?,
          discount_percent = ?,
          start_date = COALESCE(?, start_date),
          end_date = COALESCE(?, end_date),
          status = COALESCE(?, status)
      WHERE id = ?
    `, [
      title,
      description,
      discount_percent,
      start_date ? formatMysqlDate(start_date) : null,
      end_date ? formatMysqlDate(end_date) : null,
      status,
      id
    ]);

    // Nếu % giảm giá thay đổi và khuyến mãi đang bật, đồng bộ lại giá giảm cho tất cả sản phẩm đang gán
    const currentStatus = status !== null ? status : 1;
    if (currentStatus === 1) {
      await query(`
        UPDATE products p
        JOIN promotion_products pp ON p.id = pp.product_id
        SET p.discount_price = ROUND(p.price * (1 - ? / 100), -3)
        WHERE pp.promotion_id = ?
      `, [discount_percent, id]);
    } else {
      // Nếu tắt khuyến mãi, hủy giá giảm của các sản phẩm thuộc chương trình này
      await query(`
        UPDATE products p
        JOIN promotion_products pp ON p.id = pp.product_id
        SET p.discount_price = NULL
        WHERE pp.promotion_id = ?
      `, [id]);
    }

    await query(
      'INSERT INTO system_logs (user_id, action, module, description) VALUES (1, ?, ?, ?)',
      ['UPDATE_PROMOTION', 'PROMOTION', `Cập nhật chương trình khuyến mãi ID #${id}: "${title}" (Giảm ${discount_percent}%)`]
    );

    return NextResponse.json({ success: true, message: 'Cập nhật chương trình khuyến mãi thành công!' });
  } catch (error) {
    console.error('Error updating promotion:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const promos = await query('SELECT * FROM promotions WHERE id = ?', [id]);
    if (!promos || promos.length === 0) {
      return NextResponse.json({ success: false, message: 'Khuyến mãi không tồn tại' }, { status: 404 });
    }
    const promo = promos[0];

    let newStatus = promo.status === 1 ? 0 : 1;
    if (body.status !== undefined) {
      newStatus = body.status === 1 || body.status === true ? 1 : 0;
    }

    await query('UPDATE promotions SET status = ? WHERE id = ?', [newStatus, id]);

    if (newStatus === 1) {
      // Bật lại: cập nhật lại discount_price cho sản phẩm
      await query(`
        UPDATE products p
        JOIN promotion_products pp ON p.id = pp.product_id
        SET p.discount_price = ROUND(p.price * (1 - ? / 100), -3)
        WHERE pp.promotion_id = ?
      `, [promo.discount_percent, id]);
    } else {
      // Dừng: hủy giá giảm
      await query(`
        UPDATE products p
        JOIN promotion_products pp ON p.id = pp.product_id
        SET p.discount_price = NULL
        WHERE pp.promotion_id = ?
      `, [id]);
    }

    await query(
      'INSERT INTO system_logs (user_id, action, module, description) VALUES (1, ?, ?, ?)',
      ['TOGGLE_PROMOTION', 'PROMOTION', `Chuyển trạng thái khuyến mãi #${id} ("${promo.title}") sang: ${newStatus === 1 ? 'Đang áp dụng' : 'Đã dừng'}`]
    );

    return NextResponse.json({
      success: true,
      message: newStatus === 1 ? 'Đã kích hoạt chương trình khuyến mãi!' : 'Đã tạm dừng chương trình khuyến mãi!',
      status: newStatus
    });
  } catch (error) {
    console.error('Error patching promotion:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    const promos = await query('SELECT title FROM promotions WHERE id = ?', [id]);
    if (!promos || promos.length === 0) {
      return NextResponse.json({ success: false, message: 'Khuyến mãi không tồn tại' }, { status: 404 });
    }
    const title = promos[0].title;

    // 1. Hủy giá giảm trên các sản phẩm đang áp dụng
    await query(`
      UPDATE products p
      JOIN promotion_products pp ON p.id = pp.product_id
      SET p.discount_price = NULL
      WHERE pp.promotion_id = ?
    `, [id]);

    // 2. Xóa liên kết sản phẩm - khuyến mãi
    await query('DELETE FROM promotion_products WHERE promotion_id = ?', [id]);

    // 3. Xóa chương trình khuyến mãi
    await query('DELETE FROM promotions WHERE id = ?', [id]);

    await query(
      'INSERT INTO system_logs (user_id, action, module, description) VALUES (1, ?, ?, ?)',
      ['DELETE_PROMOTION', 'PROMOTION', `Xóa chương trình khuyến mãi: "${title}" (ID #${id})`]
    );

    return NextResponse.json({ success: true, message: `Đã xóa chương trình khuyến mãi "${title}" thành công!` });
  } catch (error) {
    console.error('Error deleting promotion:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
