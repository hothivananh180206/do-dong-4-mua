import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// API 33: Lấy giỏ hàng của người dùng (từ CSDL)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');

    if (!userId) {
      return NextResponse.json({ success: false, message: 'Thiếu mã người dùng (user_id).' }, { status: 400 });
    }

    // 1. Tìm hoặc tạo giỏ hàng
    let carts = await query('SELECT id FROM carts WHERE user_id = ? LIMIT 1', [userId]);
    let cartId;
    if (carts.length === 0) {
      const res = await query('INSERT INTO carts (user_id) VALUES (?)', [userId]);
      cartId = res.insertId;
    } else {
      cartId = carts[0].id;
    }

    // 2. Lấy danh sách sản phẩm trong giỏ
    const items = await query(
      `SELECT ci.id as cart_item_id, ci.cart_id, ci.product_id, ci.quantity,
              p.name as product_name, p.slug, p.price, p.discount_price, p.unit, p.thumbnail, p.stock
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.cart_id = ?
       ORDER BY ci.id DESC`,
      [cartId]
    );

    const subtotal = items.reduce((sum, it) => {
      const price = it.discount_price ? parseFloat(it.discount_price) : parseFloat(it.price);
      return sum + price * it.quantity;
    }, 0);

    return NextResponse.json({
      success: true,
      data: {
        cart_id: cartId,
        user_id: parseInt(userId, 10),
        items,
        total_items: items.reduce((s, it) => s + it.quantity, 0),
        subtotal
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// API 34: Thêm sản phẩm vào giỏ hàng
export async function POST(request) {
  try {
    const { user_id, product_id, quantity = 1 } = await request.json();

    if (!user_id || !product_id) {
      return NextResponse.json({ success: false, message: 'Thiếu thông tin user_id hoặc product_id.' }, { status: 400 });
    }

    // Tìm hoặc tạo giỏ hàng
    let carts = await query('SELECT id FROM carts WHERE user_id = ? LIMIT 1', [user_id]);
    let cartId;
    if (carts.length === 0) {
      const res = await query('INSERT INTO carts (user_id) VALUES (?)', [user_id]);
      cartId = res.insertId;
    } else {
      cartId = carts[0].id;
    }

    // Kiểm tra sản phẩm đã có trong giỏ chưa
    const existing = await query(
      'SELECT id, quantity FROM cart_items WHERE cart_id = ? AND product_id = ?',
      [cartId, product_id]
    );

    if (existing.length > 0) {
      const newQty = existing[0].quantity + parseInt(quantity, 10);
      await query('UPDATE cart_items SET quantity = ? WHERE id = ?', [newQty, existing[0].id]);
    } else {
      await query(
        'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)',
        [cartId, product_id, parseInt(quantity, 10)]
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Đã thêm sản phẩm vào giỏ hàng thành công!'
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// API 37: Xóa toàn bộ giỏ hàng
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');

    if (!userId) {
      return NextResponse.json({ success: false, message: 'Thiếu user_id.' }, { status: 400 });
    }

    const carts = await query('SELECT id FROM carts WHERE user_id = ?', [userId]);
    if (carts.length > 0) {
      await query('DELETE FROM cart_items WHERE cart_id = ?', [carts[0].id]);
    }

    return NextResponse.json({ success: true, message: 'Đã làm trống giỏ hàng.' });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

