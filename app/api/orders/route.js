import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { calculateShippingFee } from '@/lib/shipping';
import { hashPassword } from '@/lib/auth-passwords';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const phone = searchParams.get('phone');
    const startDate = searchParams.get('startDate') || searchParams.get('from');
    const endDate = searchParams.get('endDate') || searchParams.get('to');
    const limit = parseInt(searchParams.get('limit') || '100', 10);

    let sql = `
      SELECT o.*, 
             p.payment_method, p.payment_status as payment_detail_status,
             s.shipping_company, s.tracking_code, s.shipping_status,
             (SELECT u.full_name 
              FROM system_logs sl 
              JOIN users u ON sl.user_id = u.id 
              WHERE sl.module = 'ORDER' 
                AND sl.action != 'CREATE' 
                AND sl.description LIKE CONCAT('%', o.order_code, '%') 
              ORDER BY sl.id DESC 
              LIMIT 1) as processor_name
      FROM orders o
      LEFT JOIN payments p ON p.order_id = o.id
      LEFT JOIN shipments s ON s.order_id = o.id
      WHERE 1=1
    `;
    const params = [];

    if (phone) {
      sql += ` AND o.phone = ?`;
      params.push(phone.trim());
    }

    if (status) {
      sql += ` AND o.order_status = ?`;
      params.push(status);
    }

    if (search) {
      sql += ` AND (o.order_code LIKE ? OR o.receiver_name LIKE ? OR o.phone LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (startDate) {
      sql += ` AND o.created_at >= ?`;
      params.push(`${startDate} 00:00:00`);
    }

    if (endDate) {
      sql += ` AND o.created_at <= ?`;
      params.push(`${endDate} 23:59:59`);
    }

    sql += ` ORDER BY o.id DESC LIMIT ?`;
    params.push(limit);

    const orders = await query(sql, params);

    // If querying by phone, attach item summaries
    if (phone && orders.length > 0) {
      for (const ord of orders) {
        const items = await query(
          `SELECT od.*, p.name as product_name, p.thumbnail
           FROM order_details od
           JOIN products p ON od.product_id = p.id
           WHERE od.order_id = ?`,
          [ord.id]
        );
        ord.items = items;
      }
    }

    return NextResponse.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { receiver_name, phone, address, note, payment_method, items, branch_id, user_id, password } = body;

    if (!receiver_name || !phone || !address || !items || !items.length) {
      return NextResponse.json({ success: false, message: 'Vui lòng cung cấp đầy đủ thông tin giao hàng và sản phẩm' }, { status: 400 });
    }

    const cleanPhone = phone.trim().replace(/[\s\.\-]+/g, '');
    const phoneRegex = /^(0|\+84)[0-9]{9}$/;
    if (!phoneRegex.test(cleanPhone)) {
      return NextResponse.json({ success: false, message: 'Số điện thoại không đúng định dạng (yêu cầu 10 chữ số, ví dụ: 0912345678)' }, { status: 400 });
    }

    // BR-008 & FR-024: Tự động tạo tài khoản khách hàng nếu chưa tồn tại số điện thoại này
    let finalUserId = user_id;
    let isNewAccount = false;
    let initialPassword = (password && password.trim().length >= 6) ? password.trim() : '123456';
    let userRecord = null;

    if (!finalUserId) {
      const existingUser = await query('SELECT id, role_id, full_name, phone, address FROM users WHERE phone = ?', [cleanPhone]);
      if (existingUser.length > 0) {
        finalUserId = existingUser[0].id;
        userRecord = existingUser[0];
      } else {
        // Tự động tạo tài khoản khách hàng mới với Bcrypt hash (SRS NFR-004)
        const hashedInitialPassword = await hashPassword(initialPassword);
        const newUser = await query(
          `INSERT INTO users (role_id, full_name, phone, password, address, status)
           VALUES (3, ?, ?, ?, ?, 1)`,
          [receiver_name.trim(), cleanPhone, hashedInitialPassword, address.trim()]
        );
        finalUserId = newUser.insertId;
        isNewAccount = true;
        userRecord = {
          id: finalUserId,
          role_id: 3,
          role_name: 'Khách hàng',
          full_name: receiver_name.trim(),
          phone: cleanPhone,
          address: address.trim(),
          isAdmin: false,
          permissions: []
        };

        // Log audit trail
        await query(
          `INSERT INTO system_logs (user_id, action, module, description)
           VALUES (?, 'AUTO_REGISTER', 'USER', ?)`,
          [finalUserId, `Tự động tạo tài khoản khách hàng khi đặt hàng lần đầu: ${cleanPhone}`]
        );
      }
    }

    // Verify and calculate item prices from DB to avoid client-side tampering
    const productIds = items.map(item => item.id || item.product_id);
    const dbProducts = await query(
      `SELECT id, name, price, discount_price, stock FROM products WHERE id IN (${productIds.map(() => '?').join(',')})`,
      productIds
    );

    const productMap = {};
    dbProducts.forEach(p => {
      productMap[p.id] = p;
    });

    let subtotal = 0;
    const verifiedDetails = [];

    for (const item of items) {
      const pId = item.id || item.product_id;
      const prod = productMap[pId];
      if (!prod) {
        return NextResponse.json({ success: false, message: `Sản phẩm mã #${pId} không tồn tại` }, { status: 400 });
      }
      if (prod.stock < item.quantity) {
        return NextResponse.json({
          success: false,
          message: `Sản phẩm "${prod.name}" chỉ còn ${prod.stock} trong kho, không đủ số lượng ${item.quantity} bạn yêu cầu`
        }, { status: 400 });
      }

      const unitPrice = prod.discount_price !== null ? prod.discount_price : prod.price;
      const qty = Math.max(1, parseInt(item.quantity || 1, 10));
      const lineSubtotal = unitPrice * qty;
      subtotal += lineSubtotal;

      verifiedDetails.push({
        product_id: prod.id,
        quantity: qty,
        unit_price: unitPrice,
        subtotal: lineSubtotal
      });
    }
    // Tính phí vận chuyển qua Shipping Service (Mặc định 0đ, cấu trúc module hóa sẵn sàng tích hợp API đo khoảng cách)
    const shippingCalc = await calculateShippingFee({
      address,
      branchId: 1,
      subtotal,
      items
    });
    const shipping_fee = shippingCalc.fee;
    const total_amount = subtotal + shipping_fee;

    // Generate Order Code: OD + YYYYMMDD + 4 digits (BR-017)
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randSuffix = Math.floor(1000 + Math.random() * 9000);
    const order_code = `OD${dateStr}${randSuffix}`;

    // Create Order with status 'CHO_XAC_NHAN' (BR-018)
        // FR-026 & FR-027: Trạng thái ban đầu theo phương thức thanh toán
    // - Thanh toán VietQR: 'CHO_THANH_TOAN'
    // - Thanh toán COD: 'CHO_XAC_NHAN'
    const isVietQr = (payment_method || '').toUpperCase() === 'VIETQR' || (payment_method || '').toUpperCase() === 'QR';
    const initialOrderStatus = isVietQr ? 'CHO_THANH_TOAN' : 'CHO_XAC_NHAN';

    const orderResult = await query(
      `INSERT INTO orders (order_code, user_id, receiver_name, phone, address, note, subtotal, shipping_fee, total_amount, payment_status, order_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        order_code,
        finalUserId,
        receiver_name,
        cleanPhone,
        address,
        note || '',
        subtotal,
        shipping_fee,
        total_amount,
        'UNPAID',
        initialOrderStatus
      ]
    );

    const order_id = orderResult.insertId;

    // Insert Order Details and decrement product stock (BR-004, BR-011)
    for (const detail of verifiedDetails) {
      await query(
        `INSERT INTO order_details (order_id, product_id, quantity, unit_price, subtotal)
         VALUES (?, ?, ?, ?, ?)`,
        [order_id, detail.product_id, detail.quantity, detail.unit_price, detail.subtotal]
      );

      await query(
        `UPDATE products SET stock = GREATEST(0, stock - ?) WHERE id = ?`,
        [detail.quantity, detail.product_id]
      );
    }

    // Insert Payment Record (BR-014, BR-015)
    const txCode = payment_method === 'COD' 
      ? null 
      : `${payment_method.toUpperCase()}${dateStr}${Math.floor(100000 + Math.random() * 900000)}`;

    await query(
      `INSERT INTO payments (order_id, payment_method, transaction_code, payment_amount, payment_status, payment_time, note)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        order_id,
        payment_method || 'COD',
        txCode,
        total_amount,
        'PENDING',
        null,
        note || null
      ]
    );

    // Insert Shipment Record (GreenSM) (BR-022, BR-024)
    // Đơn mới tạo ở trạng thái Chờ tạo vận đơn theo đúng chuẩn SRS Mục 9.29
    await query(
      `INSERT INTO shipments (order_id, shipping_company, tracking_code, shipping_fee, shipping_status)
       VALUES (?, 'GreenSM', NULL, ?, 'CHO_TAO_VAN_DON')`,
      [order_id, shipping_fee]
    );

    // Record system log (BR-030)
    await query(
      `INSERT INTO system_logs (user_id, action, module, description)
       VALUES (?, 'CREATE', 'ORDER', ?)`,
      [finalUserId, `Tạo đơn hàng mới mã ${order_code} tổng tiền ${total_amount.toLocaleString('vi-VN')} đ`]
    );

    return NextResponse.json({
      success: true,
      message: 'Đặt hàng thành công!',
      data: {
        order_id,
        order_code,
        tracking_code: null,
        total_amount,
        subtotal,
        shipping_fee,
        user_id: finalUserId,
        is_new_account: isNewAccount,
        user: userRecord,
        initial_password: isNewAccount ? initialPassword : null
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
