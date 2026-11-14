import ExcelJS from 'exceljs';
import { formatDate, formatDateTime } from './date.js';

/**
 * Trình kết xuất Báo Cáo Excel (.xlsx) chuẩn Doanh Nghiệp cho Đổ Đống 4 Mùa
 * Hỗ trợ tạo file XLSX chuyên nghiệp, chuẩn phong cách Office 365:
 * - Tiêu đề nhận diện thương hiệu màu xanh ngọc lục bảo (Emerald Green)
 * - Khối tóm tắt KPI định lượng
 * - Bảng dữ liệu có kẻ ô (gridlines), viền mỏng (borders), xen kẽ màu (zebra striping)
 * - Tự động định dạng số tiền (#,##0 đ), số lượng, số điện thoại không mất số 0 đầu
 * - Tự động căn chỉnh độ rộng cột (Auto-fit width)
 */

// Định nghĩa màu sắc thương hiệu chuẩn
const COLORS = {
  primary: 'FF047857',      // Emerald 700 (Tiêu đề bảng)
  primaryDark: 'FF065F46',  // Emerald 800 (Header chính)
  primaryLight: 'FFECFDF5', // Emerald 50 (Nền tóm tắt KPI)
  accent: 'FF0D9488',       // Teal 600
  zebraLight: 'FFF8FAFC',   // Slate 50 (Dòng chẵn)
  white: 'FFFFFFFF',
  textDark: 'FF0F172A',     // Slate 900
  textMuted: 'FF64748B',    // Slate 500
  border: 'FFCBD5E1',       // Slate 300
  borderLight: 'FFE2E8F0',  // Slate 200
  dangerLight: 'FFFFF1F2',  // Rose 50
  dangerText: 'FFE11D48',   // Rose 600
  successLight: 'FFECFDF5', // Emerald 50
  successText: 'FF059669',  // Emerald 600
  warningLight: 'FFFFFBEB', // Amber 50
  warningText: 'FFD97706',  // Amber 600
};

// Font chuẩn đồng bộ toàn tài liệu
const FONT_FAMILY = 'Calibri';

const BORDER_THIN = {
  top: { style: 'thin', color: { argb: COLORS.borderLight } },
  left: { style: 'thin', color: { argb: COLORS.borderLight } },
  bottom: { style: 'thin', color: { argb: COLORS.borderLight } },
  right: { style: 'thin', color: { argb: COLORS.borderLight } },
};

const BORDER_HEADER = {
  top: { style: 'medium', color: { argb: COLORS.primaryDark } },
  left: { style: 'thin', color: { argb: 'FF10B981' } },
  bottom: { style: 'medium', color: { argb: COLORS.primaryDark } },
  right: { style: 'thin', color: { argb: 'FF10B981' } },
};

const BORDER_TOTAL = {
  top: { style: 'double', color: { argb: COLORS.primaryDark } },
  bottom: { style: 'medium', color: { argb: COLORS.primaryDark } },
  left: { style: 'thin', color: { argb: COLORS.borderLight } },
  right: { style: 'thin', color: { argb: COLORS.borderLight } },
};

/**
 * Thêm khối Header thương hiệu và Thông tin xuất báo cáo
 */
function applyReportHeader(worksheet, { title, subTitle, startDate, endDate, colSpan = 8 }) {
  // 1. Tên thương hiệu
  const brandRow = worksheet.addRow(['ĐỔ ĐỐNG 4 MÙA - HỆ THỐNG PHÂN PHỐI NÔNG SẢN & TRÁI CÂY CAO CẤP']);
  worksheet.mergeCells(1, 1, 1, colSpan);
  brandRow.height = 32;
  brandRow.getCell(1).font = { name: FONT_FAMILY, size: 14, bold: true, color: { argb: COLORS.white } };
  brandRow.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.primaryDark } };
  brandRow.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };

  // 2. Tiêu đề báo cáo
  const titleRow = worksheet.addRow([title.toUpperCase()]);
  worksheet.mergeCells(2, 1, 2, colSpan);
  titleRow.height = 28;
  titleRow.getCell(1).font = { name: FONT_FAMILY, size: 13, bold: true, color: { argb: COLORS.primaryDark } };
  titleRow.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.primaryLight } };
  titleRow.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };

  // 3. Thông tin meta xuất báo cáo
  const now = new Date();
  const timeFilter = (startDate && endDate)
    ? `Từ ngày ${formatDate(startDate)} đến ngày ${formatDate(endDate)}`
    : (startDate ? `Từ ngày ${formatDate(startDate)}` : (endDate ? `Đến ngày ${formatDate(endDate)}` : 'Toàn bộ thời gian tích lũy'));

  worksheet.addRow([]); // Dòng trống cách biệt

  const meta1 = worksheet.addRow([
    `Thời gian xuất: ${formatDateTime(now, true)}`,
    '', '', '',
    `Khoảng thời gian: ${timeFilter}`
  ]);
  meta1.font = { name: FONT_FAMILY, size: 9.5, italic: true, color: { argb: COLORS.textMuted } };
  worksheet.mergeCells(meta1.number, 1, meta1.number, 3);
  worksheet.mergeCells(meta1.number, 5, meta1.number, colSpan);

  const meta2 = worksheet.addRow([
    'Đơn vị: Đổ Đống 4 Mùa (dodongbonmua.duckdns.org)',
    '', '', '',
    'Quy chuẩn ngày tháng: dd/mm/yyyy (Tiêu chuẩn Việt Nam)'
  ]);
  meta2.font = { name: FONT_FAMILY, size: 9.5, italic: true, color: { argb: COLORS.textMuted } };
  worksheet.mergeCells(meta2.number, 1, meta2.number, 3);
  worksheet.mergeCells(meta2.number, 5, meta2.number, colSpan);

  worksheet.addRow([]); // Dòng trống cách biệt
}

/**
 * Thêm khối tóm tắt KPI chỉ số chính
 */
function applyKpiSummaryBlock(worksheet, kpis, colSpan = 8) {
  const labelRow = worksheet.addRow(['TỔNG HỢP CHỈ SỐ HOẠT ĐỘNG TRỌNG YẾU (KPI)']);
  worksheet.mergeCells(labelRow.number, 1, labelRow.number, colSpan);
  labelRow.getCell(1).font = { name: FONT_FAMILY, size: 10.5, bold: true, color: { argb: COLORS.primaryDark } };
  labelRow.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } };
  labelRow.height = 22;

  // Render các dòng KPI theo dạng bảng 2 cột
  kpis.forEach(([label, value, isMoney = false]) => {
    const r = worksheet.addRow([label, '', '', '', typeof value === 'number' && isMoney ? value : String(value)]);
    worksheet.mergeCells(r.number, 1, r.number, 4);
    worksheet.mergeCells(r.number, 5, r.number, 6);
    r.getCell(1).font = { name: FONT_FAMILY, size: 10, color: { argb: COLORS.textDark } };
    r.getCell(5).font = { name: FONT_FAMILY, size: 10.5, bold: true, color: { argb: COLORS.primaryDark } };
    r.getCell(5).alignment = { horizontal: isMoney ? 'right' : 'left' };
    if (isMoney && typeof value === 'number') {
      r.getCell(5).numFmt = '#,##0 "đ"';
    }
  });

  worksheet.addRow([]); // Dòng trống
}

/**
 * Tự động căn chỉnh độ rộng cột dựa trên nội dung
 */
function autoFitColumns(worksheet, minWidths = {}) {
  worksheet.columns.forEach((column, colIdx) => {
    let maxLen = 0;
    column.eachCell({ includeEmpty: false }, (cell, rowIdx) => {
      // Bỏ qua các dòng tiêu đề đã merge (dòng 1, 2)
      if (rowIdx <= 4) return;
      const cellVal = cell.value ? String(cell.value) : '';
      if (cellVal.length > maxLen) {
        maxLen = cellVal.length;
      }
    });
    const colNumber = colIdx + 1;
    const minW = minWidths[colNumber] || 12;
    column.width = Math.max(maxLen + 4, minW);
  });
}

/**
 * 1. XUẤT BÁO CÁO DOANH THU (FR-047)
 */
export async function generateRevenueExcelReport({ orders = [], summary = {}, startDate, endDate }) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Đổ Đống 4 Mùa';
  workbook.created = new Date();

  const ws = workbook.addWorksheet('Báo Cáo Doanh Thu', {
    views: [{ showGridLines: true }]
  });

  // Header & KPI
  applyReportHeader(ws, {
    title: 'BÁO CÁO DOANH THU & ĐỐI SOÁT ĐƠN HÀNG (FR-047)',
    startDate,
    endDate,
    colSpan: 8
  });

  applyKpiSummaryBlock(ws, [
    ['Tổng doanh thu thực tế (Đơn đã giao thành công):', summary.total_revenue || 0, true],
    ['Tổng số lượng đơn hàng phát sinh:', summary.total_orders || 0, false],
    ['Số đơn giao thành công:', summary.successful_orders || 0, false],
    ['Số đơn đã bị hủy:', summary.cancelled_orders || 0, false],
    ['Giá trị đơn hàng trung bình (AOV):', summary.average_order_value || 0, true],
  ], 8);

  // Table Columns
  const headerRow = ws.addRow([
    'STT',
    'Mã Đơn Hàng',
    'Thời Gian Đặt',
    'Khách Hàng',
    'Số Điện Thoại',
    'Thanh Toán',
    'Trạng Thái Đơn',
    'Tổng Tiền (VNĐ)'
  ]);
  headerRow.height = 28;

  headerRow.eachCell((cell) => {
    cell.font = { name: FONT_FAMILY, size: 10.5, bold: true, color: { argb: COLORS.white } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.primary } };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = BORDER_HEADER;
  });

  // Data rows
  let totalSum = 0;
  orders.forEach((ord, idx) => {
    const isEven = idx % 2 === 1;
    const amount = parseFloat(ord.total_amount) || 0;
    if (ord.order_status === 'DA_GIAO') totalSum += amount;

    const row = ws.addRow([
      idx + 1,
      ord.order_code,
      formatDateTime(ord.created_at),
      ord.receiver_name || 'Khách vãng lai',
      String(ord.phone || ''),
      ord.payment_method === 'COD' ? 'Tiền mặt (COD)' : 'VietQR / Chuyển khoản',
      ord.order_status === 'DA_GIAO' ? 'Đã giao thành công' :
        ord.order_status === 'DANG_GIAO' ? 'Đang giao hàng' :
        ord.order_status === 'DANG_CHUAN_BI' ? 'Đang đóng gói' :
        ord.order_status === 'DA_XAC_NHAN' ? 'Đã duyệt' :
        ord.order_status === 'TAM_DUNG' ? 'Tạm dừng' :
        ord.order_status === 'DA_HUY' ? 'Đã hủy' : ord.order_status,
      amount
    ]);

    row.height = 22;
    row.eachCell((cell, colNum) => {
      cell.font = { name: FONT_FAMILY, size: 10, color: { argb: COLORS.textDark } };
      cell.border = BORDER_THIN;
      if (isEven) {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.zebraLight } };
      }

      if (colNum === 1) cell.alignment = { vertical: 'middle', horizontal: 'center' };
      if (colNum === 2) {
        cell.font = { name: FONT_FAMILY, size: 10, bold: true, color: { argb: COLORS.primaryDark } };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      }
      if (colNum === 3) cell.alignment = { vertical: 'middle', horizontal: 'center' };
      if (colNum === 4) cell.alignment = { vertical: 'middle', horizontal: 'left' };
      if (colNum === 5) {
        cell.numFmt = '@'; // Định dạng text để giữ nguyên số 0 đầu
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      }
      if (colNum === 6 || colNum === 7) cell.alignment = { vertical: 'middle', horizontal: 'center' };
      if (colNum === 8) {
        cell.numFmt = '#,##0 "đ"';
        cell.font = { name: FONT_FAMILY, size: 10.5, bold: true, color: { argb: COLORS.primaryDark } };
        cell.alignment = { vertical: 'middle', horizontal: 'right' };
      }
    });
  });

  // Total Row
  const totalRow = ws.addRow([
    'TỔNG CỘNG DOANH THU ĐƠN THÀNH CÔNG',
    '', '', '', '', '', '',
    totalSum
  ]);
  ws.mergeCells(totalRow.number, 1, totalRow.number, 7);
  totalRow.height = 26;
  totalRow.eachCell((cell, colNum) => {
    cell.font = { name: FONT_FAMILY, size: 11, bold: true, color: { argb: COLORS.primaryDark } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.primaryLight } };
    cell.border = BORDER_TOTAL;
    if (colNum === 1) cell.alignment = { vertical: 'middle', horizontal: 'right' };
    if (colNum === 8) {
      cell.numFmt = '#,##0 "đ"';
      cell.alignment = { vertical: 'middle', horizontal: 'right' };
    }
  });

  autoFitColumns(ws, { 1: 8, 2: 18, 3: 20, 4: 24, 5: 16, 6: 22, 7: 20, 8: 20 });
  return await workbook.xlsx.writeBuffer();
}

/**
 * 2. XUẤT BÁO CÁO KHÁCH HÀNG (FR-048)
 */
export async function generateCustomersExcelReport({ customers = [], summary = {}, startDate, endDate }) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Đổ Đống 4 Mùa';
  workbook.created = new Date();

  const ws = workbook.addWorksheet('Báo Cáo Khách Hàng', {
    views: [{ showGridLines: true }]
  });

  applyReportHeader(ws, {
    title: 'BÁO CÁO TỔNG HỢP KHÁCH HÀNG & CHI TIÊU (FR-048)',
    startDate,
    endDate,
    colSpan: 11
  });

  applyKpiSummaryBlock(ws, [
    ['Tổng số khách hàng trong hệ thống:', summary.totalCustomers || customers.length, false],
    ['Khách hàng mới đăng ký trong kỳ:', summary.newCustomers || 0, false],
    ['Khách hàng phát sinh đơn mua hàng:', summary.activeCustomers || 0, false],
    ['Khách hàng chưa có đơn hàng:', summary.inactiveCustomers || 0, false],
    ['Tổng doanh số tích lũy toàn bộ khách hàng:', summary.totalSpentAll || 0, true],
  ], 11);

  const headerRow = ws.addRow([
    'STT',
    'Mã KH',
    'Họ Và Tên',
    'Số Điện Thoại',
    'Địa Chỉ Giao Hàng',
    'Tổng Đơn Đặt',
    'Đơn Thành Công',
    'Đơn Đã Hủy',
    'Tổng Chi Tiêu (VNĐ)',
    'Mua Lần Cuối',
    'Ngày Đăng Ký'
  ]);
  headerRow.height = 28;

  headerRow.eachCell((cell) => {
    cell.font = { name: FONT_FAMILY, size: 10.5, bold: true, color: { argb: COLORS.white } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.primary } };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = BORDER_HEADER;
  });

  customers.forEach((c, idx) => {
    const isEven = idx % 2 === 1;
    const spent = parseFloat(c.total_spent) || 0;

    const row = ws.addRow([
      idx + 1,
      `KH${String(c.id).padStart(4, '0')}`,
      c.full_name,
      String(c.phone || ''),
      c.address || 'Chưa cập nhật',
      parseInt(c.order_count, 10) || 0,
      parseInt(c.successful_orders, 10) || 0,
      parseInt(c.cancelled_orders, 10) || 0,
      spent,
      c.last_order_date ? formatDate(c.last_order_date) : 'Chưa có',
      formatDate(c.created_at)
    ]);

    row.height = 22;
    row.eachCell((cell, colNum) => {
      cell.font = { name: FONT_FAMILY, size: 10, color: { argb: COLORS.textDark } };
      cell.border = BORDER_THIN;
      if (isEven) cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.zebraLight } };

      if (colNum === 1 || colNum === 2) {
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        if (colNum === 2) cell.font = { name: FONT_FAMILY, size: 10, bold: true, color: { argb: COLORS.primaryDark } };
      }
      if (colNum === 3 || colNum === 5) cell.alignment = { vertical: 'middle', horizontal: 'left' };
      if (colNum === 4) {
        cell.numFmt = '@';
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      }
      if ([6, 7, 8].includes(colNum)) {
        cell.numFmt = '#,##0';
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      }
      if (colNum === 9) {
        cell.numFmt = '#,##0 "đ"';
        cell.font = { name: FONT_FAMILY, size: 10.5, bold: true, color: { argb: COLORS.primaryDark } };
        cell.alignment = { vertical: 'middle', horizontal: 'right' };
      }
      if (colNum === 10 || colNum === 11) cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });
  });

  autoFitColumns(ws, { 1: 8, 2: 12, 3: 24, 4: 16, 5: 32, 6: 14, 7: 15, 8: 14, 9: 20, 10: 16, 11: 16 });
  return await workbook.xlsx.writeBuffer();
}

/**
 * 3. XUẤT BÁO CÁO HÀNG TỒN KHO (FR-049)
 */
export async function generateInventoryExcelReport({ products = [], categoryStats = [], overall = {}, startDate, endDate }) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Đổ Đống 4 Mùa';
  workbook.created = new Date();

  // Sheet 1: Chi tiết sản phẩm tồn kho
  const ws = workbook.addWorksheet('Danh Sách Tồn Kho', {
    views: [{ showGridLines: true }]
  });

  applyReportHeader(ws, {
    title: 'BÁO CÁO HÀNG TỒN KHO & GIÁ TRỊ VỐN TỒN (FR-049)',
    startDate,
    endDate,
    colSpan: 10
  });

  applyKpiSummaryBlock(ws, [
    ['Tổng số lượng mặt hàng nông sản:', overall.total_products || products.length, false],
    ['Tổng số lượng quả / kg tồn kho:', overall.total_stock_quantity || 0, false],
    ['Tổng giá trị vốn hàng tồn kho:', overall.total_inventory_value || 0, true],
    ['Số mặt hàng đã hết hàng (Tồn = 0):', overall.out_of_stock_count || 0, false],
    ['Số mặt hàng sắp hết hàng (Tồn <= 10):', overall.low_stock_count || 0, false],
    ['Số mặt hàng tồn dồi dào (Tồn > 10):', overall.in_stock_count || 0, false],
  ], 10);

  const headerRow = ws.addRow([
    'STT',
    'Mã SP',
    'Tên Sản Phẩm',
    'Danh Mục',
    'Đơn Vị Tính',
    'Đơn Giá (VNĐ)',
    'Tồn Kho',
    'Trạng Thái',
    'Giá Trị Tồn Kho (VNĐ)',
    'Cập Nhật Gần Nhất'
  ]);
  headerRow.height = 28;

  headerRow.eachCell((cell) => {
    cell.font = { name: FONT_FAMILY, size: 10.5, bold: true, color: { argb: COLORS.white } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.primary } };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = BORDER_HEADER;
  });

  let totalInvVal = 0;
  let totalStockCount = 0;

  products.forEach((p, idx) => {
    const isEven = idx % 2 === 1;
    const price = parseFloat(p.price) || 0;
    const stock = parseInt(p.stock, 10) || 0;
    const invVal = Math.round(p.inventory_value || (price * stock));
    totalInvVal += invVal;
    totalStockCount += stock;

    const row = ws.addRow([
      idx + 1,
      p.product_code || `SP${String(p.id).padStart(4, '0')}`,
      p.product_name || p.name,
      p.category_name || 'Trái cây',
      p.unit || 'kg',
      price,
      stock,
      p.stock_status_label || (stock === 0 ? 'Hết hàng' : stock <= 10 ? 'Sắp hết hàng' : 'Còn hàng'),
      invVal,
      p.updated_at ? formatDate(p.updated_at) : 'Mới'
    ]);

    row.height = 22;
    row.eachCell((cell, colNum) => {
      cell.font = { name: FONT_FAMILY, size: 10, color: { argb: COLORS.textDark } };
      cell.border = BORDER_THIN;
      if (isEven) cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.zebraLight } };

      if (colNum === 1 || colNum === 2 || colNum === 5) cell.alignment = { vertical: 'middle', horizontal: 'center' };
      if (colNum === 2) cell.font = { name: FONT_FAMILY, size: 10, bold: true, color: { argb: COLORS.primaryDark } };
      if (colNum === 3 || colNum === 4) cell.alignment = { vertical: 'middle', horizontal: 'left' };
      if (colNum === 6) {
        cell.numFmt = '#,##0 "đ"';
        cell.alignment = { vertical: 'middle', horizontal: 'right' };
      }
      if (colNum === 7) {
        cell.numFmt = '#,##0';
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        if (stock === 0) cell.font = { name: FONT_FAMILY, size: 10, bold: true, color: { argb: COLORS.dangerText } };
      }
      if (colNum === 8) {
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        if (stock === 0) {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.dangerLight } };
          cell.font = { name: FONT_FAMILY, size: 9.5, bold: true, color: { argb: COLORS.dangerText } };
        } else if (stock <= 10) {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.warningLight } };
          cell.font = { name: FONT_FAMILY, size: 9.5, bold: true, color: { argb: COLORS.warningText } };
        }
      }
      if (colNum === 9) {
        cell.numFmt = '#,##0 "đ"';
        cell.font = { name: FONT_FAMILY, size: 10.5, bold: true, color: { argb: COLORS.primaryDark } };
        cell.alignment = { vertical: 'middle', horizontal: 'right' };
      }
      if (colNum === 10) cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });
  });

  // Total row
  const totalRow = ws.addRow([
    'TỔNG CỘNG TOÀN BỘ KHO',
    '', '', '', '', '',
    totalStockCount,
    '',
    totalInvVal,
    ''
  ]);
  ws.mergeCells(totalRow.number, 1, totalRow.number, 6);
  totalRow.height = 26;
  totalRow.eachCell((cell, colNum) => {
    cell.font = { name: FONT_FAMILY, size: 11, bold: true, color: { argb: COLORS.primaryDark } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.primaryLight } };
    cell.border = BORDER_TOTAL;
    if (colNum === 1) cell.alignment = { vertical: 'middle', horizontal: 'right' };
    if (colNum === 7) {
      cell.numFmt = '#,##0';
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    }
    if (colNum === 9) {
      cell.numFmt = '#,##0 "đ"';
      cell.alignment = { vertical: 'middle', horizontal: 'right' };
    }
  });

  autoFitColumns(ws, { 1: 8, 2: 14, 3: 28, 4: 18, 5: 12, 6: 16, 7: 14, 8: 16, 9: 22, 10: 18 });
  return await workbook.xlsx.writeBuffer();
}

/**
 * 4. XUẤT BÁO CÁO DANH SÁCH ĐƠN HÀNG (FR-050)
 */
export async function generateOrdersExcelReport({ orders = [], summary = {}, startDate, endDate }) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Đổ Đống 4 Mùa';
  workbook.created = new Date();

  const ws = workbook.addWorksheet('Danh Sách Đơn Hàng', {
    views: [{ showGridLines: true }]
  });

  applyReportHeader(ws, {
    title: 'BÁO CÁO TỔNG HỢP DANH SÁCH ĐƠN HÀNG (FR-050)',
    startDate,
    endDate,
    colSpan: 10
  });

  applyKpiSummaryBlock(ws, [
    ['Tổng số lượng đơn hàng phát sinh:', summary.total_orders || orders.length, false],
    ['Đơn hàng chờ xử lý (Chờ xác nhận / Đóng gói):', summary.pending_orders || 0, false],
    ['Đơn hàng đang giao (Bàn giao GreenSM):', summary.shipping_orders || 0, false],
    ['Đơn hàng đã giao thành công:', summary.delivered_orders || 0, false],
    ['Đơn hàng tạm dừng xử lý:', summary.on_hold_orders || 0, false],
    ['Đơn hàng đã bị hủy:', summary.cancelled_orders || 0, false],
    ['Tổng doanh thu đơn giao thành công:', summary.total_revenue || 0, true],
  ], 10);

  const headerRow = ws.addRow([
    'STT',
    'Mã Đơn Hàng',
    'Thời Gian Đặt',
    'Người Nhận',
    'Số Điện Thoại',
    'Địa Chỉ Nhận Hàng',
    'Số Món',
    'Phương Thức',
    'Trạng Thái Đơn',
    'Tổng Tiền (VNĐ)'
  ]);
  headerRow.height = 28;

  headerRow.eachCell((cell) => {
    cell.font = { name: FONT_FAMILY, size: 10.5, bold: true, color: { argb: COLORS.white } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.primary } };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = BORDER_HEADER;
  });

  let totalMoney = 0;
  orders.forEach((ord, idx) => {
    const isEven = idx % 2 === 1;
    const amount = parseFloat(ord.total_amount) || 0;
    totalMoney += amount;

    const row = ws.addRow([
      idx + 1,
      ord.order_code,
      formatDateTime(ord.created_at),
      ord.receiver_name || 'Khách vãng lai',
      String(ord.phone || ''),
      ord.address || 'Tại cửa hàng',
      ord.item_count || 1,
      ord.payment_method === 'COD' ? 'Tiền mặt (COD)' : 'VietQR / Chuyển khoản',
      ord.order_status === 'DA_GIAO' ? 'Đã giao thành công' :
        ord.order_status === 'DANG_GIAO' ? 'Đang giao (GreenSM)' :
        ord.order_status === 'DANG_CHUAN_BI' ? 'Đang chuẩn bị hàng' :
        ord.order_status === 'DA_XAC_NHAN' ? 'Đã xác nhận' :
        ord.order_status === 'TAM_DUNG' ? 'Tạm dừng xử lý' :
        ord.order_status === 'DA_HUY' ? 'Đã hủy đơn' : ord.order_status,
      amount
    ]);

    row.height = 22;
    row.eachCell((cell, colNum) => {
      cell.font = { name: FONT_FAMILY, size: 10, color: { argb: COLORS.textDark } };
      cell.border = BORDER_THIN;
      if (isEven) cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.zebraLight } };

      if (colNum === 1 || colNum === 2) {
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        if (colNum === 2) cell.font = { name: FONT_FAMILY, size: 10, bold: true, color: { argb: COLORS.primaryDark } };
      }
      if (colNum === 3) cell.alignment = { vertical: 'middle', horizontal: 'center' };
      if (colNum === 4 || colNum === 6) cell.alignment = { vertical: 'middle', horizontal: 'left' };
      if (colNum === 5) {
        cell.numFmt = '@';
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      }
      if (colNum === 7) {
        cell.numFmt = '#,##0';
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      }
      if (colNum === 8 || colNum === 9) cell.alignment = { vertical: 'middle', horizontal: 'center' };
      if (colNum === 10) {
        cell.numFmt = '#,##0 "đ"';
        cell.font = { name: FONT_FAMILY, size: 10.5, bold: true, color: { argb: COLORS.primaryDark } };
        cell.alignment = { vertical: 'middle', horizontal: 'right' };
      }
    });
  });

  const totalRow = ws.addRow([
    'TỔNG GIÁ TRỊ TOÀN BỘ ĐƠN HÀNG',
    '', '', '', '', '', '', '', '',
    totalMoney
  ]);
  ws.mergeCells(totalRow.number, 1, totalRow.number, 9);
  totalRow.height = 26;
  totalRow.eachCell((cell, colNum) => {
    cell.font = { name: FONT_FAMILY, size: 11, bold: true, color: { argb: COLORS.primaryDark } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.primaryLight } };
    cell.border = BORDER_TOTAL;
    if (colNum === 1) cell.alignment = { vertical: 'middle', horizontal: 'right' };
    if (colNum === 10) {
      cell.numFmt = '#,##0 "đ"';
      cell.alignment = { vertical: 'middle', horizontal: 'right' };
    }
  });

  autoFitColumns(ws, { 1: 8, 2: 18, 3: 20, 4: 22, 5: 16, 6: 32, 7: 12, 8: 20, 9: 20, 10: 20 });
  return await workbook.xlsx.writeBuffer();
}
