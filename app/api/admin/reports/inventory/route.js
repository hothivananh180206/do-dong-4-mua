import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { formatDate, formatDateTime } from '@/lib/date';
import { generateInventoryExcelReport } from '@/lib/excel-report-generator';

/**
 * FR-049: Báo cáo hàng tồn kho (Inventory Report)
 * Đặc tả SRS:
 * - Mục đích: Theo dõi số lượng tồn kho của từng sản phẩm.
 * - Thông tin hiển thị bắt buộc: Mã sản phẩm, Tên sản phẩm, Danh mục, Tồn kho hiện tại, Trạng thái.
 * - Quy tắc nghiệp vụ (BR-029):
 *   + Sản phẩm có tồn kho bằng 0 được đánh dấu "Hết hàng".
 *   + Tồn kho cập nhật tức thì khi nhập kho, điều chỉnh kho hoặc hoàn tất đơn hàng.
 * - Tiêu chuẩn kiểm thử:
 *   + TC_REPORT_001: Khoảng thời gian/bộ lọc hợp lệ -> hiển thị báo cáo.
 *   + TC_REPORT_002: Ngày bắt đầu > ngày kết thúc -> trả về lỗi 400.
 *   + TC_REPORT_003: Xuất file Excel/CSV thành công.
 *   + TC_REPORT_005: Xử lý hiển thị khi không có dữ liệu phù hợp.
 */

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const search = searchParams.get('search')?.trim();
    const categoryId = searchParams.get('categoryId');
    const stockStatus = searchParams.get('stockStatus'); // 'all' | 'out_of_stock' | 'low_stock' | 'in_stock'
    const format = searchParams.get('format'); // 'excel' | 'csv' | null

    // 1. Kiểm tra tính hợp lệ của khoảng thời gian (TC_REPORT_002)
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (start > end) {
        return NextResponse.json(
          {
            success: false,
            message: 'Ngày bắt đầu không được lớn hơn ngày kết thúc!'
          },
          { status: 400 }
        );
      }
    }

    // 2. Xây dựng điều kiện lọc cho danh sách sản phẩm
    let conditions = ['1=1'];
    let params = [];

    if (search) {
      conditions.push('(p.name LIKE ? OR p.id = ? OR CONCAT("SP", LPAD(p.id, 4, "0")) LIKE ?)');
      params.push(`%${search}%`, isNaN(Number(search)) ? -1 : Number(search), `%${search}%`);
    }

    if (categoryId && categoryId !== 'all') {
      conditions.push('p.category_id = ?');
      params.push(categoryId);
    }

    if (stockStatus && stockStatus !== 'all') {
      if (stockStatus === 'out_of_stock') {
        conditions.push('p.stock = 0');
      } else if (stockStatus === 'low_stock') {
        conditions.push('p.stock > 0 AND p.stock <= 10');
      } else if (stockStatus === 'in_stock') {
        conditions.push('p.stock > 10');
      }
    }

    if (startDate) {
      conditions.push('DATE(p.updated_at) >= ?');
      params.push(startDate);
    }
    if (endDate) {
      conditions.push('DATE(p.updated_at) <= ?');
      params.push(endDate);
    }

    const whereClause = conditions.join(' AND ');

    // 3. Truy vấn tổng hợp toàn bộ kho hàng (Tổng quan)
    const overallStatsQuery = `
      SELECT
        COUNT(*) as total_products,
        COALESCE(SUM(stock), 0) as total_stock_quantity,
        COALESCE(SUM(stock * price), 0) as total_inventory_value,
        COALESCE(SUM(CASE WHEN stock = 0 THEN 1 ELSE 0 END), 0) as out_of_stock_count,
        COALESCE(SUM(CASE WHEN stock > 0 AND stock <= 10 THEN 1 ELSE 0 END), 0) as low_stock_count,
        COALESCE(SUM(CASE WHEN stock > 10 THEN 1 ELSE 0 END), 0) as in_stock_count
      FROM products
    `;
    const overallStatsRes = await query(overallStatsQuery);
    const overall = overallStatsRes[0] || {
      total_products: 0,
      total_stock_quantity: 0,
      total_inventory_value: 0,
      out_of_stock_count: 0,
      low_stock_count: 0,
      in_stock_count: 0
    };

    // 4. Truy vấn phân bổ theo danh mục
    const categoryStatsQuery = `
      SELECT
        c.id as category_id,
        c.name as category_name,
        COUNT(p.id) as product_count,
        COALESCE(SUM(p.stock), 0) as total_stock,
        COALESCE(SUM(p.stock * p.price), 0) as category_value,
        COALESCE(SUM(CASE WHEN p.stock = 0 THEN 1 ELSE 0 END), 0) as out_of_stock_count,
        COALESCE(SUM(CASE WHEN p.stock > 0 AND p.stock <= 10 THEN 1 ELSE 0 END), 0) as low_stock_count
      FROM categories c
      LEFT JOIN products p ON p.category_id = c.id
      GROUP BY c.id, c.name
      ORDER BY category_value DESC, total_stock DESC
    `;
    const categoryStats = await query(categoryStatsQuery);

    // 5. Truy vấn danh sách chi tiết sản phẩm theo bộ lọc
    const productsQuery = `
      SELECT
        p.id,
        CONCAT('SP', LPAD(p.id, 4, '0')) as product_code,
        p.name as product_name,
        p.unit,
        p.price,
        p.discount_price,
        p.stock,
        (p.stock * p.price) as inventory_value,
        p.category_id,
        COALESCE(c.name, 'Chưa phân loại') as category_name,
        p.thumbnail,
        p.status,
        p.updated_at,
        CASE
          WHEN p.stock = 0 THEN 'HET_HANG'
          WHEN p.stock <= 10 THEN 'SAP_HET_HANG'
          ELSE 'CON_HANG'
        END as stock_status,
        CASE
          WHEN p.stock = 0 THEN 'Hết hàng'
          WHEN p.stock <= 10 THEN 'Sắp hết hàng'
          ELSE 'Còn hàng'
        END as stock_status_label
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE ${whereClause}
      ORDER BY p.stock ASC, p.id DESC
    `;
    const products = await query(productsQuery, params);

    // 6. Xử lý xuất file Excel (.xlsx) chuẩn Office 365 (TC_REPORT_003)
    if (format === 'excel' || format === 'xlsx' || format === 'csv') {
      const xlsxBuffer = await generateInventoryExcelReport({
        products,
        categoryStats,
        overall: {
          total_products: Number(overall.total_products),
          total_stock_quantity: Number(overall.total_stock_quantity),
          total_inventory_value: Number(overall.total_inventory_value),
          out_of_stock_count: Number(overall.out_of_stock_count),
          low_stock_count: Number(overall.low_stock_count),
          in_stock_count: Number(overall.in_stock_count)
        },
        startDate,
        endDate
      });

      return new Response(xlsxBuffer, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="Bao-cao-ton-kho-${startDate || 'all'}-${endDate || 'now'}.xlsx"`
        }
      });
    }

    // 7. Trả về kết quả JSON cho giao diện Dashboard
    return NextResponse.json({
      success: true,
      filter: {
        startDate: startDate || null,
        endDate: endDate || null,
        search: search || null,
        categoryId: categoryId || 'all',
        stockStatus: stockStatus || 'all'
      },
      data: {
        overall: {
          total_products: Number(overall.total_products),
          total_stock_quantity: Number(overall.total_stock_quantity),
          total_inventory_value: Number(overall.total_inventory_value),
          out_of_stock_count: Number(overall.out_of_stock_count),
          low_stock_count: Number(overall.low_stock_count),
          in_stock_count: Number(overall.in_stock_count)
        },
        category_distribution: categoryStats.map(c => ({
          category_id: c.category_id,
          category_name: c.category_name,
          product_count: Number(c.product_count),
          total_stock: Number(c.total_stock),
          category_value: Number(c.category_value),
          out_of_stock_count: Number(c.out_of_stock_count),
          low_stock_count: Number(c.low_stock_count)
        })),
        products: products.map(p => ({
          id: p.id,
          product_code: p.product_code,
          product_name: p.product_name,
          category_name: p.category_name,
          category_id: p.category_id,
          unit: p.unit,
          price: Number(p.price),
          discount_price: p.discount_price ? Number(p.discount_price) : null,
          stock: Number(p.stock),
          inventory_value: Number(p.inventory_value),
          thumbnail: p.thumbnail,
          status: p.status,
          stock_status: p.stock_status,
          stock_status_label: p.stock_status_label,
          updated_at: p.updated_at
        }))
      }
    });
  } catch (error) {
    console.error('Lỗi API Báo cáo tồn kho:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Lỗi máy chủ khi lấy dữ liệu báo cáo tồn kho: ' + error.message
      },
      { status: 500 }
    );
  }
}
