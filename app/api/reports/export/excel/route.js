import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { generateOrdersExcelReport } from '@/lib/excel-report-generator';

export async function GET() {
  try {
    const orders = await query(`
      SELECT order_code, receiver_name, phone, address, total_amount, order_status, created_at
      FROM orders
      ORDER BY id DESC
      LIMIT 100
    `);

    const summary = {
      total_orders: orders.length,
      total_revenue: orders.filter(o => o.order_status === 'DA_GIAO').reduce((sum, o) => sum + (parseFloat(o.total_amount) || 0), 0)
    };

    const xlsxBuffer = await generateOrdersExcelReport({
      orders,
      summary,
      startDate: null,
      endDate: null
    });

    return new Response(xlsxBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="Bao-cao-don-hang.xlsx"'
      }
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
