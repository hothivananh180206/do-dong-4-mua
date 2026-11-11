import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    // 1. Total revenue
    const revenueRows = await query(`
      SELECT SUM(total_amount) as total_revenue 
      FROM orders 
      WHERE order_status != 'DA_HUY'
    `);
    const totalRevenue = revenueRows[0]?.total_revenue || 0;

    // 2. Order counts by status
    const orderCounts = await query(`
      SELECT order_status, COUNT(*) as count 
      FROM orders 
      GROUP BY order_status
    `);

    // 3. Total products and low stock count
    const productStats = await query(`
      SELECT 
        COUNT(*) as total_products,
        SUM(CASE WHEN stock <= 10 THEN 1 ELSE 0 END) as low_stock_count
      FROM products 
      WHERE status = 1
    `);

    // 4. Total users
    const userStats = await query(`
      SELECT COUNT(*) as total_users FROM users WHERE role_id = 3
    `);

    // 5. Recent 5 orders
    const recentOrders = await query(`
      SELECT o.id, o.order_code, o.receiver_name, o.total_amount, o.order_status, o.created_at,
             s.tracking_code, s.shipping_status
      FROM orders o
      LEFT JOIN shipments s ON s.order_id = o.id
      ORDER BY o.id DESC
      LIMIT 6
    `);

    // 6. Top 5 best selling products
    const topProducts = await query(`
      SELECT p.id, p.name, p.thumbnail, p.price, SUM(od.quantity) as sold_count
      FROM order_details od
      JOIN products p ON od.product_id = p.id
      GROUP BY p.id
      ORDER BY sold_count DESC
      LIMIT 5
    `);

    // 7. Today metrics as specified in SRS 8.24 API 80
    const todayOrders = await query(`
      SELECT COUNT(*) as count, COALESCE(SUM(total_amount), 0) as revenue
      FROM orders
      WHERE DATE(created_at) = CURDATE() AND order_status != 'DA_HUY'
    `);
    const waitingOrders = await query(`SELECT COUNT(*) as count FROM orders WHERE order_status = 'CHO_XAC_NHAN'`);
    const shippingOrders = await query(`SELECT COUNT(*) as count FROM orders WHERE order_status = 'DANG_GIAO'`);

    return NextResponse.json({
      success: true,
      data: {
        today_orders: todayOrders[0]?.count || 0,
        today_revenue: todayOrders[0]?.revenue || 0,
        waiting_orders: waitingOrders[0]?.count || 0,
        shipping_orders: shippingOrders[0]?.count || 0,
        total_products: productStats[0]?.total_products || 0,
        low_stock: productStats[0]?.low_stock_count || 0,
        totalRevenue,
        orderCounts,
        totalProducts: productStats[0]?.total_products || 0,
        lowStockCount: productStats[0]?.low_stock_count || 0,
        totalCustomers: userStats[0]?.total_users || 0,
        recentOrders,
        topProducts
      }
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

