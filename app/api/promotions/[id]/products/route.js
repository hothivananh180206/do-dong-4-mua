import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// API 31: Lấy danh sách sản phẩm đã gán vào chương trình
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const products = await query(`
      SELECT p.id, p.name, p.price, p.discount_price, p.thumbnail, p.unit, p.stock, c.name as category_name
      FROM promotion_products pp
      JOIN products p ON pp.product_id = p.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE pp.promotion_id = ?
      ORDER BY p.name ASC
    `, [id]);

    return NextResponse.json({ success: true, count: products.length, data: products });
  } catch (error) {
    console.error('Error fetching promotion products:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// API 31: Gán sản phẩm vào chương trình khuyến mãi (Kèm kiểm tra quy tắc BR-014)
export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    let productIds = body.product_ids || (body.product_id ? [body.product_id] : []);

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json({ success: false, message: 'Vui lòng chọn ít nhất một sản phẩm để gán vào chương trình!' }, { status: 400 });
    }

    productIds = productIds.map(pid => parseInt(pid, 10)).filter(pid => !isNaN(pid) && pid > 0);
    if (productIds.length === 0) {
      return NextResponse.json({ success: false, message: 'Danh sách mã sản phẩm không hợp lệ!' }, { status: 400 });
    }

    // 1. Lấy thông tin chương trình hiện tại
    const promos = await query('SELECT * FROM promotions WHERE id = ?', [id]);
    if (!promos || promos.length === 0) {
      return NextResponse.json({ success: false, message: 'Chương trình khuyến mãi không tồn tại' }, { status: 404 });
    }
    const currentPromo = promos[0];

    // 2. Kiểm tra quy tắc BR-014:
    // "Không áp dụng nhiều chương trình giảm giá đồng thời trên cùng một sản phẩm."
    // Tìm xem các sản phẩm được chọn có đang nằm trong chương trình khuyến mãi nào khác đang hoạt động hay không
    const formatMysqlDate = (d) => {
      const dateObj = new Date(d);
      const pad = (n) => String(n).padStart(2, '0');
      return `${dateObj.getFullYear()}-${pad(dateObj.getMonth() + 1)}-${pad(dateObj.getDate())} ${pad(dateObj.getHours())}:${pad(dateObj.getMinutes())}:${pad(dateObj.getSeconds())}`;
    };

    const promoStartStr = formatMysqlDate(currentPromo.start_date);
    const promoEndStr = formatMysqlDate(currentPromo.end_date);

    const placeholders = productIds.map(() => '?').join(',');
    const conflicts = await query(`
      SELECT p.id, p.name, pr.id as conflicting_promo_id, pr.title as conflicting_promo_title
      FROM products p
      JOIN promotion_products pp ON p.id = pp.product_id
      JOIN promotions pr ON pp.promotion_id = pr.id
      WHERE p.id IN (${placeholders})
        AND pr.id != ?
        AND pr.status = 1
        AND (pr.start_date <= ? AND pr.end_date >= ?)
      LIMIT 1
    `, [...productIds, id, promoEndStr, promoStartStr]);

    if (conflicts && conflicts.length > 0) {
      const conflict = conflicts[0];
      return NextResponse.json({
        success: false,
        message: `Sản phẩm "${conflict.name}" (Mã #${conflict.id}) hiện đang áp dụng chương trình "${conflict.conflicting_promo_title}". Một sản phẩm không thể áp dụng đồng thời hai chương trình giảm giá!`,
      }, { status: 400 });
    }

    // 3. Gán sản phẩm vào promotion_products
    let addedCount = 0;
    for (const pid of productIds) {
      const existing = await query('SELECT id FROM promotion_products WHERE promotion_id = ? AND product_id = ?', [id, pid]);
      if (existing.length === 0) {
        await query('INSERT INTO promotion_products (promotion_id, product_id) VALUES (?, ?)', [id, pid]);
        addedCount++;
      }
    }

    // 4. Nếu chương trình đang hoạt động (status = 1), cập nhật ngay discount_price cho các sản phẩm
    if (currentPromo.status === 1) {
      await query(`
        UPDATE products
        SET discount_price = ROUND(price * (1 - ? / 100), -3)
        WHERE id IN (${placeholders})
      `, [currentPromo.discount_percent, ...productIds]);
    }

    // Ghi nhật ký hệ thống
    await query(
      'INSERT INTO system_logs (user_id, action, module, description) VALUES (1, ?, ?, ?)',
      ['ASSIGN_PROMOTION_PRODUCTS', 'PROMOTION', `Gán ${addedCount} sản phẩm vào chương trình khuyến mãi "${currentPromo.title}" (ID #${id})`]
    );

    return NextResponse.json({
      success: true,
      message: `Đã gán thành công ${addedCount} sản phẩm vào chương trình khuyến mãi "${currentPromo.title}"!`,
      added_count: addedCount
    });
  } catch (error) {
    console.error('Error assigning products to promotion:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// API 32: Xóa sản phẩm khỏi chương trình khuyến mãi
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('product_id');

    if (!productId) {
      return NextResponse.json({ success: false, message: 'Thiếu mã sản phẩm cần gỡ bỏ!' }, { status: 400 });
    }

    // 1. Xóa khỏi bảng liên kết promotion_products
    await query('DELETE FROM promotion_products WHERE promotion_id = ? AND product_id = ?', [id, productId]);

    // 2. Hủy discount_price của sản phẩm đó
    await query('UPDATE products SET discount_price = NULL WHERE id = ?', [productId]);

    // Ghi log hệ thống
    await query(
      'INSERT INTO system_logs (user_id, action, module, description) VALUES (1, ?, ?, ?)',
      ['REMOVE_PROMOTION_PRODUCT', 'PROMOTION', `Gỡ sản phẩm #${productId} khỏi chương trình khuyến mãi #${id}`]
    );

    return NextResponse.json({ success: true, message: 'Đã gỡ sản phẩm khỏi chương trình khuyến mãi thành công!' });
  } catch (error) {
    console.error('Error removing product from promotion:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
