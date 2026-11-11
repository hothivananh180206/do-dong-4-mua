import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { logSystemAction } from '@/lib/logger';

export async function GET(request, { params }) {
  try {
    const { code } = await params;

    const orders = await query(
      `SELECT o.*, 
              p.payment_method, p.payment_status as payment_detail_status, p.transaction_code, p.payment_time,
              s.shipping_company, s.tracking_code, s.shipping_status, s.ship_date, s.delivery_date,
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
       WHERE o.order_code = ? OR o.id = ?
       LIMIT 1`,
      [code, code]
    );

    if (!orders || orders.length === 0) {
      return NextResponse.json({ success: false, message: 'Không tìm thấy đơn hàng' }, { status: 404 });
    }

    const order = orders[0];

    const items = await query(
      `SELECT od.*, p.name as product_name, p.slug as product_slug, p.thumbnail, p.unit
       FROM order_details od
       JOIN products p ON od.product_id = p.id
       WHERE od.order_id = ?`,
      [order.id]
    );

    order.items = items;

    // Lịch sử xử lý đơn hàng theo SRS FR-030
    const rawLogs = await query(
      `SELECT sl.id, sl.action, sl.description, sl.created_at, 
              u.full_name as user_name, r.role_name as role_name
       FROM system_logs sl
       LEFT JOIN users u ON sl.user_id = u.id
       LEFT JOIN roles r ON u.role_id = r.id
       WHERE sl.description LIKE ?
       ORDER BY sl.id ASC`,
      [`%${order.order_code}%`]
    );

    const logs = [];

    // Mốc 1: Khách hàng tạo đơn
    logs.push({
      action: 'CREATE',
      title: 'Khách hàng đặt hàng',
      description: `Khách hàng ${order.receiver_name} đặt đơn thành công (Phương thức: ${order.payment_method || 'COD'}, Tổng: ${parseFloat(order.total_amount).toLocaleString('vi-VN')} đ)`,
      user_name: order.receiver_name,
      role_name: 'Khách hàng',
      created_at: order.created_at
    });

    // Mốc từ system_logs (các thao tác duyệt, cập nhật, hủy...)
    if (rawLogs && rawLogs.length > 0) {
      for (const l of rawLogs) {
        if (l.action !== 'CREATE') {
          let title = 'Cập nhật trạng thái';
          if (l.action === 'CANCEL') title = 'Hủy đơn hàng';
          else if (l.description.includes('PAID')) title = 'Xác nhận thanh toán';
          else if (l.description.includes('DANG_GIAO')) title = 'Bàn giao GreenSM';
          else if (l.description.includes('DA_GIAO')) title = 'Giao hàng thành công';
          else if (l.description.includes('DA_XAC_NHAN')) title = 'Duyệt đơn hàng';
          else if (l.description.includes('DANG_CHUAN_BI')) title = 'Chuẩn bị đóng gói';

          logs.push({
            action: l.action,
            title,
            description: l.description,
            user_name: l.user_name || 'Trần Vũ (Admin Tổng)',
            role_name: l.role_name || 'Admin Tổng',
            created_at: l.created_at
          });
        }
      }
    }

    // Mốc thanh toán nếu đã thu mà chưa có log riêng
    if (order.payment_status === 'PAID' && order.payment_time) {
      const hasPaid = logs.some(l => l.description && l.description.includes('PAID'));
      if (!hasPaid) {
        logs.push({
          action: 'PAYMENT',
          title: 'Đã xác nhận thu tiền',
          description: `Đã thu đủ ${parseFloat(order.total_amount).toLocaleString('vi-VN')} đ qua ${order.payment_method}`,
          user_name: 'Admin Tổng',
          role_name: 'Quản trị viên',
          created_at: order.payment_time
        });
      }
    }

    // Sắp xếp theo thời gian tăng dần
    logs.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    order.logs = logs;

    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    console.error('Error fetching order detail:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const { code } = await params;
    const body = await request.json();
    const { order_status, shipping_status, payment_status, reason, action } = body;

    // Get order ID and current status
    const orders = await query('SELECT * FROM orders WHERE order_code = ? OR id = ?', [code, code]);
    if (!orders.length) {
      return NextResponse.json({ success: false, message: 'Đơn hàng không tồn tại' }, { status: 404 });
    }
    const currentOrder = orders[0];
    const orderId = currentOrder.id;

    // Xử lý HỦY ĐƠN HÀNG (FR-028 & BR-020)
    if (action === 'CANCEL' || order_status === 'DA_HUY') {
      if (['DANG_GIAO', 'DA_GIAO', 'DA_HUY'].includes(currentOrder.order_status)) {
        const hotlineRow = await query('SELECT setting_value FROM system_settings WHERE setting_key = "hotline"');
        const hotline = hotlineRow[0]?.setting_value || 'CSKH';
        return NextResponse.json({
          success: false,
          message: `Không thể hủy đơn hàng vì đơn đã chuyển sang trạng thái "${currentOrder.order_status}". Vui lòng liên hệ Hotline ${hotline} để được hỗ trợ!`
        }, { status: 400 });
      }

      // Hoàn lại số lượng tồn kho sản phẩm (BR-020)
      const details = await query('SELECT product_id, quantity FROM order_details WHERE order_id = ?', [orderId]);
      for (const d of details) {
        await query('UPDATE products SET stock = stock + ? WHERE id = ?', [d.quantity, d.product_id]);
      }

      // Cập nhật trạng thái hủy
      await query('UPDATE orders SET order_status = "DA_HUY" WHERE id = ?', [orderId]);
      await query('UPDATE shipments SET shipping_status = "GIAO_THAT_BAI" WHERE order_id = ?', [orderId]);

      // Ghi audit log
      await query(
        `INSERT INTO system_logs (user_id, action, module, description)
         VALUES (?, 'CANCEL', 'ORDER', ?)`,
        [currentOrder.user_id, `Hủy đơn hàng mã ${currentOrder.order_code}. Lý do: ${reason || 'Khách hàng yêu cầu hủy'}`]
      );

      return NextResponse.json({ success: true, message: 'Hủy đơn hàng thành công, tồn kho sản phẩm đã được hoàn lại!' });
    }

    // Cập nhật trạng thái thông thường (Admin)
    if (order_status) {
      await query('UPDATE orders SET order_status = ? WHERE id = ?', [order_status, orderId]);
    }

    if (payment_status) {
      await query('UPDATE orders SET payment_status = ? WHERE id = ?', [payment_status, orderId]);
      await query('UPDATE payments SET payment_status = ? WHERE order_id = ?', [payment_status === 'PAID' ? 'PAID' : 'PENDING', orderId]);
    }

    if (shipping_status || order_status === 'DANG_GIAO' || order_status === 'DA_GIAO') {
      const activeShippingStatus = shipping_status || (order_status === 'DANG_GIAO' ? 'DANG_GIAO' : order_status === 'DA_GIAO' ? 'GIAO_THANH_CONG' : null);
      let shipDate = null;
      let deliveryDate = null;
      let newTrackingCode = null;

      if (activeShippingStatus === 'DA_BAN_GIAO_GREENSM' || activeShippingStatus === 'DANG_GIAO' || order_status === 'DANG_GIAO') {
        shipDate = new Date();
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const codeSuffix = currentOrder.order_code.replace(/\D/g, '').slice(-4) || Math.floor(1000 + Math.random() * 9000);
        newTrackingCode = `GSM-VN-${dateStr}-${codeSuffix}`;
      }
      if (activeShippingStatus === 'GIAO_THANH_CONG' || order_status === 'DA_GIAO') {
        deliveryDate = new Date();
      }

      await query(
        `UPDATE shipments 
         SET shipping_status = COALESCE(?, shipping_status),
             tracking_code = COALESCE(tracking_code, ?),
             ship_date = COALESCE(?, ship_date),
             delivery_date = COALESCE(?, delivery_date)
         WHERE order_id = ?`,
        [activeShippingStatus, newTrackingCode, shipDate, deliveryDate, orderId]
      );
    }

    // Ghi audit log thay đổi trạng thái bằng ngôn ngữ tự nhiên tiếng Việt (FR-045)
    const ORDER_STATUS_LABELS = {
      'CHO_XAC_NHAN': 'Chờ xác nhận (COD)',
      'CHO_THANH_TOAN': 'Chờ thanh toán (VietQR)',
      'DA_XAC_NHAN': 'Đã xác nhận đơn hàng',
      'DANG_CHUAN_BI': 'Đang chuẩn bị hàng',
      'TAM_DUNG': 'Tạm dừng xử lý',
      'DANG_GIAO': 'Đang giao hàng (GreenSM)',
      'DA_GIAO': 'Giao hàng thành công',
      'DA_HUY': 'Đã hủy đơn hàng'
    };
    const targetStatus = order_status || currentOrder.order_status;
    const readableStatus = ORDER_STATUS_LABELS[targetStatus] || targetStatus;

    await logSystemAction({
      request,
      userId: 1,
      action: 'UPDATE_STATUS',
      module: 'ORDER',
      description: `Cập nhật đơn hàng ${currentOrder.order_code} sang trạng thái: ${readableStatus}${reason ? ' (Lý do: ' + reason + ')' : ''}`
    });

    return NextResponse.json({ success: true, message: 'Cập nhật trạng thái đơn hàng thành công' });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export { PATCH as PUT };

