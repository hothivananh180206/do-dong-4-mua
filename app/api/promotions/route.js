import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get('all') === '1' || searchParams.get('all') === 'true';

    let sql = `
      SELECT p.*,
             (SELECT COUNT(*) FROM promotion_products pp WHERE pp.promotion_id = p.id) as product_count
      FROM promotions p
    `;
    if (!all) {
      sql += ` WHERE p.status = 1 AND (NOW() BETWEEN p.start_date AND p.end_date)`;
    }
    sql += ` ORDER BY p.id DESC`;

    const promotions = await query(sql);
    return NextResponse.json({ success: true, count: promotions.length, data: promotions });
  } catch (error) {
    console.error('Error fetching promotions:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const title = (body.title || body.name || '').trim();
    const discount_percent = parseFloat(body.discount_percent || body.discount_rate);
    const description = (body.description || '').trim();
    const start_date = body.start_date ? new Date(body.start_date) : new Date();
    const end_date = body.end_date ? new Date(body.end_date) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    if (!title) {
      return NextResponse.json({ success: false, message: 'Vui lòng nhập tên chương trình khuyến mãi!' }, { status: 400 });
    }

    if (isNaN(discount_percent) || discount_percent <= 0 || discount_percent > 100) {
      return NextResponse.json({ success: false, message: 'Phần trăm giảm giá phải từ 1% đến 100%!' }, { status: 400 });
    }

    if (isNaN(start_date.getTime()) || isNaN(end_date.getTime())) {
      return NextResponse.json({ success: false, message: 'Định dạng ngày bắt đầu hoặc ngày kết thúc không hợp lệ!' }, { status: 400 });
    }

    if (end_date < start_date) {
      return NextResponse.json({ success: false, message: 'Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu!' }, { status: 400 });
    }

    const formatMysqlDate = (d) => {
      const pad = (n) => String(n).padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    };

    const result = await query(
      `INSERT INTO promotions (title, description, discount_percent, start_date, end_date, status)
       VALUES (?, ?, ?, ?, ?, 1)`,
      [
        title,
        description,
        discount_percent,
        formatMysqlDate(start_date),
        formatMysqlDate(end_date),
      ]
    );

    // Ghi nhật ký hệ thống
    await query(
      'INSERT INTO system_logs (user_id, action, module, description) VALUES (1, ?, ?, ?)',
      ['CREATE_PROMOTION', 'PROMOTION', `Tạo chương trình khuyến mãi mới: "${title}" (Giảm ${discount_percent}%)`]
    );

    return NextResponse.json({
      success: true,
      message: 'Tạo chương trình khuyến mãi thành công!',
      id: result.insertId,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating promotion:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
