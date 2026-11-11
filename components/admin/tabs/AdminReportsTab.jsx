'use client';

import React from 'react';
import {
  TrendingUp, Users, Box, ShoppingCart, BarChart3, Download, RefreshCw,
  Search, RotateCcw, Percent, CheckCircle2, XCircle, Package, UserPlus,
  User, Sparkles, FileText, AlertTriangle, Clock, Layers, Truck, Pause, Tag
} from 'lucide-react';
import Pagination from '@/components/Pagination';
import { formatDate, formatDateTime } from '@/lib/date';

export default function AdminReportsTab({
  reportSubTab,
  setReportSubTab,
  revenueData,
  revenueLoading,
  revenueStartDate,
  setRevenueStartDate,
  revenueEndDate,
  setRevenueEndDate,
  handleExportRevenueExcel,
  handleExportRevenuePdf,
  loadRevenueReport,
  handleQuickDateFilter,
  customerReportData,
  customerReportLoading,
  customerReportStartDate,
  setCustomerReportStartDate,
  customerReportEndDate,
  setCustomerReportEndDate,
  customerReportSearch,
  setCustomerReportSearch,
  handleExportCustomerExcel,
  handleExportCustomerPdf,
  handleQuickCustomerDateFilter,
  loadCustomerReport,
  customerReportPage,
  setCustomerReportPage,
  customerReportPageSize,
  setCustomerReportPageSize,
  inventoryReportData,
  inventoryReportLoading,
  inventoryReportSearch,
  setInventoryReportSearch,
  inventoryReportPage,
  setInventoryReportPage,
  inventoryReportCategory,
  setInventoryReportCategory,
  inventoryReportStockStatus,
  setInventoryReportStockStatus,
  inventoryReportStartDate,
  setInventoryReportStartDate,
  inventoryReportEndDate,
  setInventoryReportEndDate,
  inventoryReportPageSize,
  setInventoryReportPageSize,
  exportInventoryReportCsv,
  exportInventoryReportPdf,
  loadInventoryReport,
  orderReportData,
  orderReportLoading,
  orderReportSearch,
  setOrderReportSearch,
  orderReportPage,
  setOrderReportPage,
  orderReportStatus,
  setOrderReportStatus,
  orderReportPaymentStatus,
  setOrderReportPaymentStatus,
  orderReportStartDate,
  setOrderReportStartDate,
  orderReportEndDate,
  setOrderReportEndDate,
  orderReportPageSize,
  setOrderReportPageSize,
  exportOrderReportCsv,
  exportOrderReportPdf,
  loadOrderReport,
  handleQuickInventoryDateFilter,
  handleQuickOrderDateFilter,
  categories
}) {
  // Chuẩn hóa tính toán ngày địa phương (YYYY-MM-DD)
  const formatYMD = (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayDateStr = formatYMD(new Date());
  const past7Date = new Date();
  past7Date.setDate(past7Date.getDate() - 7);
  const past7DateStr = formatYMD(past7Date);

  const past30Date = new Date();
  past30Date.setDate(past30Date.getDate() - 30);
  const past30DateStr = formatYMD(past30Date);

  // Trạng thái nút chọn nhanh Doanh thu
  const isRevToday = revenueStartDate === todayDateStr && revenueEndDate === todayDateStr;
  const isRev7Days = revenueStartDate === past7DateStr && revenueEndDate === todayDateStr;
  const isRev30Days = revenueStartDate === past30DateStr && revenueEndDate === todayDateStr;
  const isRevAll = !revenueStartDate && !revenueEndDate;

  // Trạng thái nút chọn nhanh Khách hàng
  const isCustToday = customerReportStartDate === todayDateStr && customerReportEndDate === todayDateStr;
  const isCust7Days = customerReportStartDate === past7DateStr && customerReportEndDate === todayDateStr;
  const isCust30Days = customerReportStartDate === past30DateStr && customerReportEndDate === todayDateStr;
  const isCustAll = !customerReportStartDate && !customerReportEndDate;

  // Trạng thái nút chọn nhanh Tồn kho
  const isInvToday = inventoryReportStartDate === todayDateStr && inventoryReportEndDate === todayDateStr;
  const isInv7Days = inventoryReportStartDate === past7DateStr && inventoryReportEndDate === todayDateStr;
  const isInv30Days = inventoryReportStartDate === past30DateStr && inventoryReportEndDate === todayDateStr;
  const isInvAll = !inventoryReportStartDate && !inventoryReportEndDate;

  // Trạng thái nút chọn nhanh Đơn hàng
  const isOrdToday = orderReportStartDate === todayDateStr && orderReportEndDate === todayDateStr;
  const isOrd7Days = orderReportStartDate === past7DateStr && orderReportEndDate === todayDateStr;
  const isOrd30Days = orderReportStartDate === past30DateStr && orderReportEndDate === todayDateStr;
  const isOrdAll = !orderReportStartDate && !orderReportEndDate;

  // Phân trang danh sách khách hàng trong báo cáo
  const custReportList = customerReportData?.customers || [];
  const paginatedCustReport = custReportList.slice(
    ((customerReportPage || 1) - 1) * (customerReportPageSize || 10),
    (customerReportPage || 1) * (customerReportPageSize || 10)
  );

  return (
                <div className="space-y-6 animate-in fade-in duration-200">
                  {/* THANH CHUYỂN ĐỔI BÁO CÁO (REPORTING MODULE - SRS 7.6 & FR-047, FR-048) */}
                  <div className="flex items-center gap-2 p-1.5 bg-slate-200/70 rounded-2xl w-fit shadow-2xs">
                    <button
                      type="button"
                      onClick={() => setReportSubTab('revenue')}
                      className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition cursor-pointer ${
                        reportSubTab === 'revenue'
                          ? 'bg-white text-emerald-950 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                      <span>Báo Cáo Doanh Thu</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setReportSubTab('customers');
                        if (!customerReportData) loadCustomerReport();
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition cursor-pointer ${
                        reportSubTab === 'customers'
                          ? 'bg-white text-indigo-950 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Users className="w-4 h-4 text-indigo-600" />
                      <span>Báo Cáo Khách Hàng</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setReportSubTab('inventory');
                        if (!inventoryReportData) loadInventoryReport();
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition cursor-pointer ${
                        reportSubTab === 'inventory'
                          ? 'bg-white text-amber-950 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Box className="w-4 h-4 text-amber-600" />
                      <span>Báo Cáo Hàng Tồn Kho</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setReportSubTab('orders');
                        if (!orderReportData) loadOrderReport();
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition cursor-pointer ${
                        reportSubTab === 'orders'
                          ? 'bg-white text-blue-950 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <ShoppingCart className="w-4 h-4 text-blue-600" />
                      <span>Báo Cáo Đơn Hàng</span>
                    </button>
                  </div>

                  {reportSubTab === 'revenue' && (
                    <div className="space-y-6 animate-in fade-in duration-200">
                      {/* Header & Quick Action Buttons */}
                      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                      <div>
                        <h2 className="font-heading font-black text-lg text-slate-900 flex items-center gap-2">
                          <BarChart3 className="w-5 h-5 text-emerald-600" />
                          <span>Báo Cáo Doanh Thu Hệ Thống</span>
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">
                          Thống kê doanh thu theo khoảng thời gian dựa trên các đơn hàng đã giao thành công
                        </p>
                      </div>

                      <div className="flex items-center gap-2.5 self-start sm:self-auto">
                        <button
                          type="button"
                          onClick={handleExportRevenueExcel}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition cursor-pointer"
                        >
                          <Download className="w-4 h-4" />
                          <span>Xuất File Excel (.xlsx)</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleExportRevenuePdf}
                          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-rose-600/20 transition cursor-pointer"
                        >
                          <FileText className="w-4 h-4" />
                          <span>Xuất PDF</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => loadRevenueReport()}
                          disabled={revenueLoading}
                          className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${revenueLoading ? 'animate-spin text-emerald-600' : ''}`} />
                          <span>Làm mới</span>
                        </button>
                      </div>
                    </div>

                    {/* Bộ lọc khoảng thời gian tìm kiếm (Điều kiện bắt buộc theo SRS FR-047) */}
                    <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 space-y-3">
                      <div className="flex flex-col lg:flex-row gap-3 items-center justify-between">
                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                          <div className="flex items-center gap-2 w-full sm:w-auto">
                            <span className="text-xs font-bold text-slate-600 whitespace-nowrap">Từ ngày:</span>
                            <input
                              type="date"
                              value={revenueStartDate}
                              onChange={(e) => setRevenueStartDate(e.target.value)}
                              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium bg-white focus:outline-none focus:border-emerald-500 w-full sm:w-auto"
                            />
                          </div>

                          <div className="flex items-center gap-2 w-full sm:w-auto">
                            <span className="text-xs font-bold text-slate-600 whitespace-nowrap">Đến ngày:</span>
                            <input
                              type="date"
                              value={revenueEndDate}
                              onChange={(e) => setRevenueEndDate(e.target.value)}
                              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium bg-white focus:outline-none focus:border-emerald-500 w-full sm:w-auto"
                            />
                          </div>

                          <div className="flex items-center gap-2 w-full sm:w-auto">
                            <button
                              type="button"
                              onClick={() => loadRevenueReport()}
                              disabled={revenueLoading}
                              className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                            >
                              <Search className="w-3.5 h-3.5" />
                              <span>Lọc dữ liệu</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleQuickDateFilter(-1)}
                              className="p-1.5 bg-white hover:bg-slate-100 text-slate-500 rounded-xl border border-slate-200 text-xs font-bold transition cursor-pointer"
                              title="Đặt lại bộ lọc"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Phím tắt chọn nhanh khoảng thời gian */}
                        <div className="flex items-center gap-1.5 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0">
                          <button
                            type="button"
                            onClick={() => handleQuickDateFilter(0)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition cursor-pointer whitespace-nowrap ${
                              isRevToday
                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                                : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-500 hover:text-emerald-700'
                            }`}
                          >
                            Hôm nay
                          </button>
                          <button
                            type="button"
                            onClick={() => handleQuickDateFilter(7)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition cursor-pointer whitespace-nowrap ${
                              isRev7Days
                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                                : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-500 hover:text-emerald-700'
                            }`}
                          >
                            7 ngày qua
                          </button>
                          <button
                            type="button"
                            onClick={() => handleQuickDateFilter(30)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition cursor-pointer whitespace-nowrap ${
                              isRev30Days
                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                                : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-500 hover:text-emerald-700'
                            }`}
                          >
                            30 ngày qua
                          </button>
                          <button
                            type="button"
                            onClick={() => handleQuickDateFilter(-1)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition cursor-pointer whitespace-nowrap ${
                              isRevAll
                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                                : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-500 hover:text-emerald-700'
                            }`}
                          >
                            Toàn thời gian
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* 5 CHỈ SỐ KẾT QUẢ BẮT BUỘC THEO SRS FR-047 & BR-028 */}
                    {revenueLoading && !revenueData ? (
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-1 animate-pulse">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div key={i} className="bg-slate-50 border border-slate-200/70 rounded-2xl p-4 space-y-3">
                            <div className="h-3 w-20 bg-slate-200 rounded" />
                            <div className="h-6 w-28 bg-slate-300 rounded" />
                            <div className="h-2 w-24 bg-slate-200 rounded" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-1">
                      {/* 1. Tổng doanh thu (BR-028: Chỉ tính đơn Đã giao) */}
                      <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 flex flex-col justify-between col-span-2 md:col-span-1 shadow-2xs">
                        <div className="flex items-center justify-between text-emerald-800 text-[11px] font-extrabold uppercase tracking-wider mb-2">
                          <span>Tổng Doanh Thu</span>
                          <TrendingUp className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div className="text-xl font-black text-emerald-950">
                          {((revenueData?.total_revenue ?? 0)).toLocaleString('vi-VN')} đ
                        </div>
                        <div className="text-[10px] text-emerald-700 font-semibold mt-1">
                          Chỉ tính đơn Đã giao
                        </div>
                      </div>

                      {/* 2. Tổng số đơn hàng */}
                      <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-4 flex flex-col justify-between shadow-2xs">
                        <div className="flex items-center justify-between text-slate-500 text-[11px] font-extrabold uppercase tracking-wider mb-2">
                          <span>Tổng Số Đơn</span>
                          <ShoppingCart className="w-4 h-4 text-slate-400" />
                        </div>
                        <div className="text-xl font-black text-slate-900">
                          {revenueData?.total_orders ?? 0} đơn
                        </div>
                        <div className="text-[10px] text-slate-400 font-semibold mt-1">
                          Tổng số đơn phát sinh
                        </div>
                      </div>

                      {/* 3. Giá trị trung bình mỗi đơn (AOV) */}
                      <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-4 flex flex-col justify-between shadow-2xs">
                        <div className="flex items-center justify-between text-slate-500 text-[11px] font-extrabold uppercase tracking-wider mb-2">
                          <span>Giá Trị TB / Đơn</span>
                          <Percent className="w-4 h-4 text-blue-500" />
                        </div>
                        <div className="text-xl font-black text-slate-900">
                          {((revenueData?.average_order_value ?? 0)).toLocaleString('vi-VN')} đ
                        </div>
                        <div className="text-[10px] text-slate-400 font-semibold mt-1">
                          Doanh thu / Đơn thành công
                        </div>
                      </div>

                      {/* 4. Số đơn thành công (Đã giao) */}
                      <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-4 flex flex-col justify-between shadow-2xs">
                        <div className="flex items-center justify-between text-emerald-700 text-[11px] font-extrabold uppercase tracking-wider mb-2">
                          <span>Đơn Thành Công</span>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div className="text-xl font-black text-emerald-700">
                          {revenueData?.successful_orders ?? 0} đơn
                        </div>
                        <div className="text-[10px] text-emerald-600 font-semibold mt-1">
                          Trạng thái: Đã giao hàng
                        </div>
                      </div>

                      {/* 5. Số đơn hủy */}
                      <div className="bg-rose-50/60 border border-rose-200/70 rounded-2xl p-4 flex flex-col justify-between shadow-2xs">
                        <div className="flex items-center justify-between text-rose-700 text-[11px] font-extrabold uppercase tracking-wider mb-2">
                          <span>Đơn Bị Hủy</span>
                          <XCircle className="w-4 h-4 text-rose-500" />
                        </div>
                        <div className="text-xl font-black text-rose-700">
                          {revenueData?.cancelled_orders ?? 0} đơn
                        </div>
                        <div className="text-[10px] text-rose-600 font-semibold mt-1">
                          Không tính vào doanh thu
                        </div>
                      </div>
                    </div>
                  )}
                  </div>

                  {/* BẢNG DIỄN BIẾN DOANH THU THEO THỜI GIAN (TIMELINE) */}
                  <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <h3 className="font-heading font-black text-base text-slate-900 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-emerald-600" />
                        <span>Diễn Biến Doanh Thu Theo Từng Ngày</span>
                      </h3>
                      <span className="text-xs text-slate-400 font-medium">
                        {revenueData?.timeline?.length || 0} mốc thời gian ghi nhận
                      </span>
                    </div>

                    {(!revenueData?.timeline || revenueData.timeline.length === 0) ? (
                      <div className="py-10 text-center text-slate-400 text-xs">
                        Không có dữ liệu doanh thu trong khoảng thời gian đã chọn.
                      </div>
                    ) : (
                      <div className="overflow-x-auto rounded-xl border border-slate-200">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="bg-slate-50 text-slate-500 font-extrabold uppercase tracking-wider border-b border-slate-200 text-[11px]">
                              <th className="py-2.5 px-4">Ngày</th>
                              <th className="py-2.5 px-4 text-center">Tổng đơn</th>
                              <th className="py-2.5 px-4 text-center text-emerald-700">Đơn thành công</th>
                              <th className="py-2.5 px-4 text-center text-rose-600">Đơn hủy</th>
                              <th className="py-2.5 px-4 text-right">Doanh thu thực tế</th>
                              <th className="py-2.5 px-4 text-right">Tỷ lệ thành công</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-medium">
                            {revenueData.timeline.map((item) => {
                              const rev = parseFloat(item.revenue) || 0;
                              const tot = parseInt(item.total_orders, 10) || 0;
                              const succ = parseInt(item.successful_orders, 10) || 0;
                              const rate = tot > 0 ? Math.round((succ / tot) * 100) : 0;
                              return (
                                <tr key={item.date} className="hover:bg-slate-50/80 transition">
                                  <td className="py-3 px-4 font-mono font-bold text-slate-900">
                                    {item.date}
                                  </td>
                                  <td className="py-3 px-4 text-center">
                                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-mono font-bold text-[11px]">
                                      {tot}
                                    </span>
                                  </td>
                                  <td className="py-3 px-4 text-center">
                                    <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md font-mono font-bold text-[11px]">
                                      {succ}
                                    </span>
                                  </td>
                                  <td className="py-3 px-4 text-center">
                                    <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-md font-mono font-bold text-[11px]">
                                      {item.cancelled_orders}
                                    </span>
                                  </td>
                                  <td className="py-3 px-4 text-right font-bold text-emerald-700 text-sm">
                                    {rev.toLocaleString('vi-VN')} đ
                                  </td>
                                  <td className="py-3 px-4 text-right">
                                    <div className="inline-flex items-center gap-1.5">
                                      <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                        <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${rate}%` }}></div>
                                      </div>
                                      <span className="text-[11px] font-bold text-slate-600 font-mono w-8 text-right">{rate}%</span>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* 2 KHỐI CHI TIẾT: PHƯƠNG THỨC THANH TOÁN & TOP SẢN PHẨM */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Phân bổ theo phương thức thanh toán */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <h3 className="font-heading font-black text-base text-slate-900 flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          <span>Doanh Thu Theo Phương Thức Thanh Toán</span>
                        </h3>
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Đơn Đã Giao</span>
                      </div>

                      {(!revenueData?.paymentBreakdown || revenueData.paymentBreakdown.length === 0) ? (
                        <p className="text-xs text-slate-400 py-6 text-center">Chưa có giao dịch phát sinh</p>
                      ) : (
                        <div className="space-y-3">
                          {revenueData.paymentBreakdown.map((pb) => {
                            const methodLabel = pb.payment_method === 'VIETQR' ? 'Chuyển khoản VietQR' : pb.payment_method === 'COD' ? 'Tiền mặt khi nhận hàng (COD)' : pb.payment_method;
                            const amount = parseFloat(pb.total_amount) || 0;
                            return (
                              <div key={pb.payment_method} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                                <div>
                                  <div className="font-bold text-slate-900">{methodLabel}</div>
                                  <div className="text-[11px] text-slate-400 mt-0.5">{pb.order_count} đơn hàng hoàn tất</div>
                                </div>
                                <div className="text-right">
                                  <div className="font-black text-emerald-700 text-sm">{amount.toLocaleString('vi-VN')} đ</div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Top sản phẩm bán chạy nhất theo doanh thu thực tế */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <h3 className="font-heading font-black text-base text-slate-900 flex items-center gap-2">
                          <Package className="w-5 h-5 text-emerald-600" />
                          <span>Top Sản Phẩm Mang Lại Doanh Thu Cao</span>
                        </h3>
                        <span className="text-[10px] text-slate-400 font-bold uppercase">ĐÃ GIAO</span>
                      </div>

                      {(!revenueData?.topProducts || revenueData.topProducts.length === 0) ? (
                        <p className="text-xs text-slate-400 py-6 text-center">Chưa có sản phẩm nào hoàn tất giao hàng</p>
                      ) : (
                        <div className="divide-y divide-slate-100">
                          {revenueData.topProducts.map((tp) => (
                            <div key={tp.id} className="py-3 flex items-center justify-between text-xs">
                              <div className="flex items-center gap-3 min-w-0">
                                <img
                                  src={tp.thumbnail}
                                  alt={tp.name}
                                  className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                                />
                                <div className="min-w-0">
                                  <div className="font-bold text-slate-800 truncate">{tp.name}</div>
                                  <div className="text-[11px] text-slate-400">Đã bán: <span className="font-bold text-slate-700">{tp.total_sold}</span></div>
                                </div>
                              </div>
                              <div className="text-right shrink-0 pl-3">
                                <div className="font-black text-emerald-700 text-sm">
                                  {parseFloat(tp.total_revenue).toLocaleString('vi-VN')} đ
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                    </div>
                  )}

                  {/* NỘI DUNG 2: BÁO CÁO KHÁCH HÀNG */}
                  {reportSubTab === 'customers' && (
                    <div className="space-y-6 animate-in fade-in duration-200">
                      {/* Header & Action Buttons */}
                      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                          <div>
                            <h2 className="font-heading font-black text-lg text-slate-900 flex items-center gap-2">
                              <Users className="w-5 h-5 text-indigo-600" />
                              <span>Báo Cáo Khách Hàng Hệ Thống</span>
                            </h2>
                            <p className="text-xs text-slate-500 mt-1">
                              Thống kê số lượng, khách mới và hoạt động mua hàng theo từng khách (Định danh duy nhất bằng SĐT)
                            </p>
                          </div>

                          <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
                            <button
                              type="button"
                              onClick={handleExportCustomerExcel}
                              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition cursor-pointer"
                            >
                              <Download className="w-4 h-4" />
                              <span>Xuất File Excel (.xlsx)</span>
                            </button>
                            <button
                              type="button"
                              onClick={handleExportCustomerPdf}
                              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-rose-600/20 transition cursor-pointer"
                            >
                              <FileText className="w-4 h-4" />
                              <span>Xuất PDF</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => loadCustomerReport()}
                              disabled={customerReportLoading}
                              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                            >
                              <RefreshCw className={`w-3.5 h-3.5 ${customerReportLoading ? 'animate-spin text-indigo-600' : ''}`} />
                              <span>Làm mới</span>
                            </button>
                          </div>
                        </div>

                        {/* Bộ lọc khoảng thời gian & Tìm kiếm khách hàng */}
                        <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 space-y-3">
                          <div className="flex flex-col lg:flex-row gap-3 items-center justify-between">
                            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                              <div className="flex items-center gap-2 w-full sm:w-auto">
                                <span className="text-xs font-bold text-slate-600 whitespace-nowrap">Từ ngày:</span>
                                <input
                                  type="date"
                                  value={customerReportStartDate}
                                  onChange={(e) => setCustomerReportStartDate(e.target.value)}
                                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium bg-white focus:outline-none focus:border-indigo-500 w-full sm:w-auto"
                                />
                              </div>

                              <div className="flex items-center gap-2 w-full sm:w-auto">
                                <span className="text-xs font-bold text-slate-600 whitespace-nowrap">Đến ngày:</span>
                                <input
                                  type="date"
                                  value={customerReportEndDate}
                                  onChange={(e) => setCustomerReportEndDate(e.target.value)}
                                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium bg-white focus:outline-none focus:border-indigo-500 w-full sm:w-auto"
                                />
                              </div>

                              <div className="relative w-full sm:w-56">
                                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                                <input
                                  type="text"
                                  placeholder="Tìm tên, SĐT khách..."
                                  value={customerReportSearch}
                                  onChange={(e) => setCustomerReportSearch(e.target.value)}
                                  className="w-full pl-8 pr-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-medium bg-white focus:outline-none focus:border-indigo-500"
                                />
                              </div>

                              <div className="flex items-center gap-2 w-full sm:w-auto">
                                <button
                                  type="button"
                                  onClick={() => loadCustomerReport()}
                                  disabled={customerReportLoading}
                                  className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                                >
                                  <Search className="w-3.5 h-3.5" />
                                  <span>Lọc</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setCustomerReportSearch('');
                                    handleQuickCustomerDateFilter(-1);
                                  }}
                                  className="p-1.5 bg-white hover:bg-slate-100 text-slate-500 rounded-xl border border-slate-200 text-xs font-bold transition cursor-pointer"
                                  title="Đặt lại bộ lọc"
                                >
                                  <RotateCcw className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Phím tắt chọn nhanh ngày */}
                            <div className="flex items-center gap-1.5 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0">
                              <button
                                type="button"
                                onClick={() => handleQuickCustomerDateFilter(0)}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition cursor-pointer whitespace-nowrap ${
                                  isCustToday
                                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                    : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-500 hover:text-indigo-700'
                                }`}
                              >
                                Hôm nay
                              </button>
                              <button
                                type="button"
                                onClick={() => handleQuickCustomerDateFilter(7)}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition cursor-pointer whitespace-nowrap ${
                                  isCust7Days
                                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                    : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-500 hover:text-indigo-700'
                                }`}
                              >
                                7 ngày qua
                              </button>
                              <button
                                type="button"
                                onClick={() => handleQuickCustomerDateFilter(30)}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition cursor-pointer whitespace-nowrap ${
                                  isCust30Days
                                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                    : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-500 hover:text-indigo-700'
                                }`}
                              >
                                30 ngày qua
                              </button>
                              <button
                                type="button"
                                onClick={() => handleQuickCustomerDateFilter(-1)}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition cursor-pointer whitespace-nowrap ${
                                  isCustAll
                                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                    : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-500 hover:text-indigo-700'
                                }`}
                              >
                                Toàn thời gian
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* 4 CHỈ SỐ KẾT QUẢ BẮT BUỘC THEO SRS FR-048 */}
                        {customerReportLoading && !customerReportData ? (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-1 animate-pulse">
                            {[1, 2, 3, 4].map((i) => (
                              <div key={i} className="bg-slate-50 border border-slate-200/70 rounded-2xl p-4 space-y-3">
                                <div className="h-3 w-24 bg-slate-200 rounded" />
                                <div className="h-6 w-20 bg-slate-300 rounded" />
                                <div className="h-2 w-28 bg-slate-200 rounded" />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-1">
                          {/* 1. Tổng số khách hàng */}
                          <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-2xl p-4 flex flex-col justify-between shadow-2xs">
                            <div className="flex items-center justify-between text-indigo-800 text-[11px] font-extrabold uppercase tracking-wider mb-2">
                              <span>Tổng Khách Hàng</span>
                              <Users className="w-4 h-4 text-indigo-600" />
                            </div>
                            <div className="text-xl font-black text-indigo-950">
                              {customerReportData?.total_customers ?? 0} khách
                            </div>
                            <div className="text-[10px] text-indigo-700 font-semibold mt-1">
                              Tài khoản người dùng
                            </div>
                          </div>

                          {/* 2. Số khách hàng mới */}
                          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 flex flex-col justify-between shadow-2xs">
                            <div className="flex items-center justify-between text-emerald-800 text-[11px] font-extrabold uppercase tracking-wider mb-2">
                              <span>Khách Hàng Mới</span>
                              <UserPlus className="w-4 h-4 text-emerald-600" />
                            </div>
                            <div className="text-xl font-black text-emerald-950">
                              {customerReportData?.new_customers ?? 0} khách
                            </div>
                            <div className="text-[10px] text-emerald-700 font-semibold mt-1">
                              Đăng ký trong khoảng thời gian lọc
                            </div>
                          </div>

                          {/* 3. Số khách hàng phát sinh đơn hàng */}
                          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 flex flex-col justify-between shadow-2xs">
                            <div className="flex items-center justify-between text-amber-800 text-[11px] font-extrabold uppercase tracking-wider mb-2">
                              <span>Khách Có Đơn Hàng</span>
                              <ShoppingCart className="w-4 h-4 text-amber-600" />
                            </div>
                            <div className="text-xl font-black text-amber-950">
                              {customerReportData?.active_customers ?? 0} khách
                            </div>
                            <div className="text-[10px] text-amber-700 font-semibold mt-1">
                              Phát sinh ít nhất 1 đơn hàng
                            </div>
                          </div>

                          {/* 4. Khách hàng chưa từng mua hàng */}
                          <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-4 flex flex-col justify-between shadow-2xs">
                            <div className="flex items-center justify-between text-slate-500 text-[11px] font-extrabold uppercase tracking-wider mb-2">
                              <span>Khách Chưa Có Đơn</span>
                              <User className="w-4 h-4 text-slate-400" />
                            </div>
                            <div className="text-xl font-black text-slate-800">
                              {customerReportData?.inactive_customers ?? 0} khách
                            </div>
                            <div className="text-[10px] text-slate-400 font-semibold mt-1">
                              Chưa phát sinh đơn mua hàng
                            </div>
                          </div>
                        </div>
                      )}
                      </div>

                      {/* TOP 5 KHÁCH HÀNG TIÊU BIỂU */}
                      {customerReportData?.top_customers && customerReportData.top_customers.length > 0 && (
                        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
                          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h3 className="font-heading font-black text-base text-slate-900 flex items-center gap-2">
                              <Sparkles className="w-5 h-5 text-amber-500" />
                              <span>Top Khách Hàng Tiêu Biểu (Mua Nhiều Nhất)</span>
                            </h3>
                            <span className="text-xs text-slate-400 font-medium">Xếp hạng theo chi tiêu thực tế</span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
                            {customerReportData.top_customers.map((tc, idx) => (
                              <div
                                key={tc.id}
                                className={`rounded-2xl p-3.5 border flex flex-col justify-between ${
                                  idx === 0
                                    ? 'bg-amber-50/70 border-amber-200 text-amber-950 shadow-xs'
                                    : 'bg-slate-50/80 border-slate-200/70 text-slate-800'
                                }`}
                              >
                                <div>
                                  <div className="flex items-center justify-between mb-1.5">
                                    <span className="w-6 h-6 rounded-full bg-white border border-slate-200 font-black text-[11px] flex items-center justify-center">
                                      #{idx + 1}
                                    </span>
                                    <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded-full border border-slate-200">
                                      {tc.order_count} đơn
                                    </span>
                                  </div>
                                  <div className="font-bold text-xs truncate" title={tc.full_name}>
                                    {tc.full_name}
                                  </div>
                                  <div className="font-mono text-[11px] opacity-75 mt-0.5">
                                    {tc.phone}
                                  </div>
                                </div>
                                <div className="mt-3 pt-2 border-t border-slate-200/60 font-black text-emerald-700 text-xs">
                                  {parseFloat(tc.total_spent).toLocaleString('vi-VN')} đ
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* BẢNG CHI TIẾT SỐ ĐƠN HÀNG CỦA TỪNG KHÁCH (NỘI DUNG SRS FR-048) */}
                      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                          <h3 className="font-heading font-black text-base text-slate-900 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-indigo-600" />
                            <span>Danh Sách Khách Hàng & Hoạt Động Mua Hàng</span>
                          </h3>
                          <span className="text-xs text-slate-400 font-medium">
                            Tổng {custReportList.length} khách hàng tìm thấy
                          </span>
                        </div>

                        {custReportList.length === 0 ? (
                          <div className="py-12 text-center text-slate-400 text-xs">
                            <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                            <div>Không tìm thấy khách hàng nào phù hợp với bộ lọc.</div>
                          </div>
                        ) : (
                          <div className="overflow-x-auto rounded-xl border border-slate-200">
                            <table className="w-full text-left text-xs">
                              <thead>
                                <tr className="bg-slate-50 text-slate-500 font-extrabold uppercase tracking-wider border-b border-slate-200 text-[11px]">
                                  <th className="py-3 px-4">Khách hàng</th>
                                  <th className="py-3 px-4">Số điện thoại</th>
                                  <th className="py-3 px-4">Địa chỉ</th>
                                  <th className="py-3 px-4 text-center">Tổng số đơn</th>
                                  <th className="py-3 px-4 text-center text-emerald-700">Đơn thành công</th>
                                  <th className="py-3 px-4 text-center text-rose-600">Đơn hủy</th>
                                  <th className="py-3 px-4 text-right">Tổng chi tiêu (VNĐ)</th>
                                  <th className="py-3 px-4 text-right">Lần mua gần nhất</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 font-medium">
                                {paginatedCustReport.map((c) => (
                                  <tr key={c.id} className="hover:bg-slate-50/80 transition">
                                    <td className="py-3 px-4 font-bold text-slate-900">
                                      <div>{c.full_name}</div>
                                      <div className="text-[10px] text-slate-400 font-normal">
                                        Đăng ký: {formatDate(c.created_at)}
                                      </div>
                                    </td>
                                    <td className="py-3 px-4 font-mono font-bold text-slate-700">
                                      {c.phone}
                                    </td>
                                    <td className="py-3 px-4 text-slate-500 max-w-xs truncate" title={c.address}>
                                      {c.address || '—'}
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                      <span className="px-2 py-0.5 rounded-md font-mono font-bold text-[11px] bg-slate-100 text-slate-800">
                                        {c.order_count} đơn
                                      </span>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                      <span className="px-2 py-0.5 rounded-md font-mono font-bold text-[11px] bg-emerald-50 text-emerald-800 border border-emerald-200">
                                        {c.successful_orders}
                                      </span>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                      <span className="px-2 py-0.5 rounded-md font-mono font-bold text-[11px] bg-rose-50 text-rose-700 border border-rose-200">
                                        {c.cancelled_orders}
                                      </span>
                                    </td>
                                    <td className="py-3 px-4 text-right font-black text-emerald-700 text-sm">
                                      {parseFloat(c.total_spent).toLocaleString('vi-VN')} đ
                                    </td>
                                    <td className="py-3 px-4 text-right text-slate-500 font-mono text-[11px]">
                                      {c.last_order_date
                                        ? formatDate(c.last_order_date)
                                        : 'Chưa có'}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}

                        {/* Phân trang danh sách khách hàng */}
                        {custReportList.length > 0 && (
                          <Pagination
                            currentPage={customerReportPage}
                            totalItems={custReportList.length}
                            pageSize={customerReportPageSize}
                            onPageChange={setCustomerReportPage}
                            onPageSizeChange={setCustomerReportPageSize}
                            pageSizeOptions={[10, 15, 30, 50]}
                            itemName="khách hàng"
                          />
                        )}
                      </div>
                    </div>
                  )}

                  {/* BÁO CÁO HÀNG TỒN KHO (FR-049 & BR-029) */}
                  {reportSubTab === 'inventory' && (
                    <div className="space-y-6 animate-in fade-in duration-200">
                      {/* Tiêu đề & Bộ lọc kho hàng */}
                      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                          <div>
                            <h2 className="font-heading font-black text-lg text-slate-900 flex items-center gap-2">
                              <Box className="w-5 h-5 text-amber-600" />
                              <span>Báo Cáo Hàng Tồn Kho</span>
                            </h2>
                            <p className="text-xs text-slate-500 mt-1">
                              Theo dõi số lượng tồn kho từng sản phẩm, cảnh báo sắp hết hàng và tổng giá trị vốn lưu kho
                            </p>
                          </div>
                          <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
                            <button
                              type="button"
                              onClick={exportInventoryReportCsv}
                              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-600/20 transition cursor-pointer"
                            >
                              <Download className="w-4 h-4" />
                              <span>Xuất File Excel (.xlsx)</span>
                            </button>
                            <button
                              type="button"
                              onClick={exportInventoryReportPdf}
                              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-rose-600/20 transition cursor-pointer"
                            >
                              <FileText className="w-4 h-4" />
                              <span>Xuất PDF</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => loadInventoryReport()}
                              disabled={inventoryReportLoading}
                              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                            >
                              <RotateCcw className={`w-3.5 h-3.5 ${inventoryReportLoading ? 'animate-spin text-amber-600' : ''}`} />
                              <span>Làm mới</span>
                            </button>
                          </div>
                        </div>

                        {/* Thanh lọc nâng cao */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
                          <div className="relative">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              placeholder="Tìm mã SP, tên trái cây..."
                              value={inventoryReportSearch}
                              onChange={(e) => {
                                setInventoryReportSearch(e.target.value);
                                setInventoryReportPage(1);
                              }}
                              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                            />
                          </div>

                          <div>
                            <select
                              value={inventoryReportCategory}
                              onChange={(e) => {
                                setInventoryReportCategory(e.target.value);
                                setInventoryReportPage(1);
                                loadInventoryReport(e.target.value, inventoryReportStockStatus, inventoryReportSearch);
                              }}
                              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition bg-white"
                            >
                              <option value="all">Tất cả danh mục ({categories.length})</option>
                              {categories.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <select
                              value={inventoryReportStockStatus}
                              onChange={(e) => {
                                setInventoryReportStockStatus(e.target.value);
                                setInventoryReportPage(1);
                                loadInventoryReport(inventoryReportCategory, e.target.value, inventoryReportSearch);
                              }}
                              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition bg-white font-medium"
                            >
                              <option value="all">Tất cả tình trạng tồn</option>
                              <option value="out_of_stock">🔴 Hết hàng (Tồn = 0)</option>
                              <option value="low_stock">⚠️ Sắp hết hàng (Tồn ≤ 10)</option>
                              <option value="in_stock">🟢 Còn hàng (Tồn trên 10)</option>
                            </select>
                          </div>

                          <div>
                            <input
                              type="date"
                              value={inventoryReportStartDate}
                              onChange={(e) => setInventoryReportStartDate(e.target.value)}
                              placeholder="Từ ngày"
                              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                            />
                          </div>

                          <div className="flex items-center gap-2">
                            <input
                              type="date"
                              value={inventoryReportEndDate}
                              onChange={(e) => setInventoryReportEndDate(e.target.value)}
                              placeholder="Đến ngày"
                              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setInventoryReportPage(1);
                                loadInventoryReport();
                              }}
                              className="px-3 py-2 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 transition cursor-pointer shrink-0"
                            >
                              Lọc
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setInventoryReportSearch('');
                                setInventoryReportCategory('all');
                                setInventoryReportStockStatus('all');
                                setInventoryReportStartDate('');
                                setInventoryReportEndDate('');
                                setInventoryReportPage(1);
                                loadInventoryReport('all', 'all', '', '', '');
                              }}
                              title="Đặt lại bộ lọc"
                              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 transition cursor-pointer shrink-0"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Phím tắt chọn nhanh ngày cho kho hàng */}
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1">
                          <button
                            type="button"
                            onClick={() => handleQuickInventoryDateFilter && handleQuickInventoryDateFilter(0)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition cursor-pointer whitespace-nowrap ${
                              isInvToday
                                ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                                : 'bg-white border-slate-200 text-slate-700 hover:border-amber-500 hover:text-amber-700'
                            }`}
                          >
                            Hôm nay
                          </button>
                          <button
                            type="button"
                            onClick={() => handleQuickInventoryDateFilter && handleQuickInventoryDateFilter(7)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition cursor-pointer whitespace-nowrap ${
                              isInv7Days
                                ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                                : 'bg-white border-slate-200 text-slate-700 hover:border-amber-500 hover:text-amber-700'
                            }`}
                          >
                            7 ngày qua
                          </button>
                          <button
                            type="button"
                            onClick={() => handleQuickInventoryDateFilter && handleQuickInventoryDateFilter(30)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition cursor-pointer whitespace-nowrap ${
                              isInv30Days
                                ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                                : 'bg-white border-slate-200 text-slate-700 hover:border-amber-500 hover:text-amber-700'
                            }`}
                          >
                            30 ngày qua
                          </button>
                          <button
                            type="button"
                            onClick={() => handleQuickInventoryDateFilter && handleQuickInventoryDateFilter(-1)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition cursor-pointer whitespace-nowrap ${
                              isInvAll
                                ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                                : 'bg-white border-slate-200 text-slate-700 hover:border-amber-500 hover:text-amber-700'
                            }`}
                          >
                            Toàn thời gian
                          </button>
                        </div>
                      </div>

                      {/* 4 Thẻ chỉ số tổng hợp kho hàng */}
                      {inventoryReportData && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          {/* Tổng sản phẩm & Tổng lượng tồn */}
                          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tổng mặt hàng</span>
                              <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                                <Box className="w-5 h-5" />
                              </div>
                            </div>
                            <div>
                              <div className="text-2xl font-black text-slate-900 tracking-tight">
                                {inventoryReportData.overall?.total_products || 0}
                                <span className="text-xs font-semibold text-slate-500 ml-1.5">mặt hàng</span>
                              </div>
                              <p className="text-xs text-slate-500 mt-1">
                                Tổng lưu kho: <strong className="text-slate-800">{(inventoryReportData.overall?.total_stock_quantity || 0).toLocaleString('vi-VN')}</strong> sản phẩm
                              </p>
                            </div>
                          </div>

                          {/* Tổng giá trị vốn kho */}
                          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tổng vốn tồn kho</span>
                              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                                <TrendingUp className="w-5 h-5" />
                              </div>
                            </div>
                            <div>
                              <div className="text-2xl font-black text-blue-700 tracking-tight">
                                {(inventoryReportData.overall?.total_inventory_value || 0).toLocaleString('vi-VN')}
                                <span className="text-xs font-bold text-blue-600 ml-1">đ</span>
                              </div>
                              <p className="text-xs text-slate-500 mt-1">
                                Tính theo đơn giá niêm yết hiện hành
                              </p>
                            </div>
                          </div>

                          {/* Báo động hết hàng */}
                          <div className="bg-white p-5 rounded-2xl border border-rose-200 shadow-2xs space-y-3 bg-gradient-to-br from-white to-rose-50/30">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">Hết hàng (Tồn = 0)</span>
                              <div className="w-9 h-9 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600">
                                <AlertTriangle className="w-5 h-5" />
                              </div>
                            </div>
                            <div>
                              <div className="text-2xl font-black text-rose-700 tracking-tight">
                                {inventoryReportData.overall?.out_of_stock_count || 0}
                                <span className="text-xs font-semibold text-rose-600 ml-1.5">mặt hàng</span>
                              </div>
                              <p className="text-xs text-rose-600 mt-1 font-medium">
                                Cần nhập kho hoặc chuyển hàng ngay
                              </p>
                            </div>
                          </div>

                          {/* Cảnh báo sắp hết hàng */}
                          <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-2xs space-y-3 bg-gradient-to-br from-white to-amber-50/30">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Sắp hết hàng (Tồn ≤ 10)</span>
                              <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                                <Clock className="w-5 h-5" />
                              </div>
                            </div>
                            <div>
                              <div className="text-2xl font-black text-amber-700 tracking-tight">
                                {inventoryReportData.overall?.low_stock_count || 0}
                                <span className="text-xs font-semibold text-amber-600 ml-1.5">mặt hàng</span>
                              </div>
                              <p className="text-xs text-amber-700 mt-1 font-medium">
                                Đang chạm ngưỡng an toàn tối thiểu
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Phân bổ tồn kho theo Danh mục */}
                      {inventoryReportData && inventoryReportData.category_distribution?.length > 0 && (
                        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
                          <h3 className="font-heading font-black text-sm text-slate-900 flex items-center gap-2">
                            <Layers className="w-4 h-4 text-amber-600" />
                            <span>Phân Bổ Tồn Kho Theo Danh Mục Trái Cây</span>
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {inventoryReportData.category_distribution.map((cat) => (
                              <div
                                key={cat.category_id}
                                onClick={() => {
                                  setInventoryReportCategory(cat.category_id);
                                  setInventoryReportPage(1);
                                  loadInventoryReport(cat.category_id, inventoryReportStockStatus, inventoryReportSearch);
                                }}
                                className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/50 hover:bg-amber-50/40 hover:border-amber-300 transition cursor-pointer space-y-2 group"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-xs text-slate-900 group-hover:text-amber-800 transition">
                                    {cat.category_name}
                                  </span>
                                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-200/70 text-slate-700 font-semibold">
                                    {cat.product_count} sản phẩm
                                  </span>
                                </div>
                                <div className="flex items-baseline justify-between pt-1">
                                  <span className="text-xs text-slate-500">Tồn kho:</span>
                                  <span className="text-sm font-black text-slate-900">
                                    {cat.total_stock.toLocaleString('vi-VN')}
                                  </span>
                                </div>
                                <div className="flex items-baseline justify-between">
                                  <span className="text-xs text-slate-500">Giá trị vốn:</span>
                                  <span className="text-xs font-bold text-emerald-700">
                                    {Math.round(cat.category_value).toLocaleString('vi-VN')} đ
                                  </span>
                                </div>
                                {(cat.out_of_stock_count > 0 || cat.low_stock_count > 0) && (
                                  <div className="pt-2 border-t border-slate-200/60 flex items-center gap-2 text-[11px]">
                                    {cat.out_of_stock_count > 0 && (
                                      <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 font-bold">
                                        {cat.out_of_stock_count} hết hàng
                                      </span>
                                    )}
                                    {cat.low_stock_count > 0 && (
                                      <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">
                                        {cat.low_stock_count} sắp hết
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Bảng chi tiết toàn bộ sản phẩm tồn kho (Bảng cốt lõi FR-049) */}
                      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden p-6 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                          <div>
                            <h3 className="font-heading font-black text-base text-slate-900 flex items-center gap-2">
                              <Box className="w-4 h-4 text-amber-600" />
                              <span>Danh Sách Chi Tiết Hàng Tồn Kho</span>
                            </h3>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Đầy đủ thông tin: Mã sản phẩm, Tên sản phẩm, Danh mục, Tồn kho hiện tại và Trạng thái
                            </p>
                          </div>
                          <span className="text-xs px-3 py-1 rounded-xl bg-slate-100 text-slate-600 font-bold self-start sm:self-auto">
                            Tổng cộng: {inventoryReportData?.products?.length || 0} sản phẩm
                          </span>
                        </div>

                        {inventoryReportLoading ? (
                          <div className="py-6 space-y-3 animate-pulse">
                            <div className="h-10 bg-slate-100 rounded-xl w-full" />
                            {[...Array(6)].map((_, i) => (
                              <div key={i} className="h-12 bg-slate-50 border border-slate-100 rounded-xl w-full flex items-center px-4 gap-4">
                                <div className="h-4 w-16 bg-slate-200 rounded" />
                                <div className="h-4 w-40 bg-slate-200 rounded" />
                                <div className="h-4 w-24 bg-slate-200 rounded" />
                                <div className="h-4 w-20 bg-slate-200 rounded ml-auto" />
                              </div>
                            ))}
                          </div>
                        ) : !inventoryReportData || inventoryReportData.products?.length === 0 ? (
                          <div className="py-12 text-center text-slate-400 space-y-2">
                            <Box className="w-10 h-10 mx-auto text-slate-300" />
                            <p className="text-sm font-semibold text-slate-600">Không có dữ liệu phù hợp với bộ lọc</p>
                            <p className="text-xs text-slate-400">Vui lòng thử chọn danh mục hoặc từ khóa tìm kiếm khác.</p>
                          </div>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs text-slate-600 border-collapse">
                              <thead>
                                <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                  <th className="py-3 px-3">Mã SP</th>
                                  <th className="py-3 px-3">Sản phẩm</th>
                                  <th className="py-3 px-3">Danh mục</th>
                                  <th className="py-3 px-3 text-right">Đơn giá</th>
                                  <th className="py-3 px-3 text-center">Tồn kho hiện tại</th>
                                  <th className="py-3 px-3 text-center">Trạng thái</th>
                                  <th className="py-3 px-3 text-right">Giá trị tồn kho</th>
                                  <th className="py-3 px-3 text-center">Cập nhật</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {(() => {
                                  const invList = inventoryReportData.products || [];
                                  const startIdx = (inventoryReportPage - 1) * inventoryReportPageSize;
                                  const pageItems = invList.slice(startIdx, startIdx + inventoryReportPageSize);

                                  return pageItems.map((prod) => {
                                    const isOutOfStock = prod.stock === 0;
                                    const isLowStock = prod.stock > 0 && prod.stock <= 10;

                                    return (
                                      <tr key={prod.id} className="hover:bg-slate-50/60 transition">
                                        <td className="py-3 px-3 font-mono font-bold text-slate-900">
                                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px]">
                                            {prod.product_code}
                                          </span>
                                        </td>
                                        <td className="py-3 px-3">
                                          <div className="flex items-center gap-2.5">
                                            {prod.thumbnail ? (
                                              <img
                                                src={prod.thumbnail}
                                                alt={prod.product_name}
                                                className="w-9 h-9 rounded-lg object-cover border border-slate-200 shrink-0"
                                              />
                                            ) : (
                                              <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                                                <Box className="w-4 h-4" />
                                              </div>
                                            )}
                                            <div>
                                              <p className="font-bold text-slate-900">{prod.product_name}</p>
                                              <span className="text-[11px] text-slate-400">Đơn vị: {prod.unit || 'Sản phẩm'}</span>
                                            </div>
                                          </div>
                                        </td>
                                        <td className="py-3 px-3">
                                          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold">
                                            {prod.category_name}
                                          </span>
                                        </td>
                                        <td className="py-3 px-3 text-right font-medium text-slate-800">
                                          {prod.price.toLocaleString('vi-VN')} đ
                                        </td>
                                        <td className="py-3 px-3 text-center">
                                          <span className={`text-base font-black ${
                                            isOutOfStock ? 'text-rose-600' : isLowStock ? 'text-amber-600' : 'text-slate-900'
                                          }`}>
                                            {prod.stock.toLocaleString('vi-VN')}
                                          </span>
                                          <span className="text-[10px] text-slate-400 block font-normal">{prod.unit || 'sp'}</span>
                                        </td>
                                        <td className="py-3 px-3 text-center">
                                          {isOutOfStock ? (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-rose-100 text-rose-700 border border-rose-200">
                                              <XCircle className="w-3 h-3 text-rose-600" />
                                              <span>Hết hàng</span>
                                            </span>
                                          ) : isLowStock ? (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-amber-100 text-amber-800 border border-amber-200">
                                              <AlertTriangle className="w-3 h-3 text-amber-600" />
                                              <span>Sắp hết hàng</span>
                                            </span>
                                          ) : (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                              <span>Còn hàng</span>
                                            </span>
                                          )}
                                        </td>
                                        <td className="py-3 px-3 text-right font-bold text-slate-900">
                                          {Math.round(prod.inventory_value).toLocaleString('vi-VN')} đ
                                        </td>
                                        <td className="py-3 px-3 text-center text-slate-400 text-[11px]">
                                          {prod.updated_at ? formatDate(prod.updated_at) : '—'}
                                        </td>
                                      </tr>
                                    );
                                  });
                                })()}
                              </tbody>
                            </table>
                          </div>
                        )}

                        {/* Phân trang danh sách tồn kho */}
                        {inventoryReportData && inventoryReportData.products?.length > 0 && (
                          <Pagination
                            currentPage={inventoryReportPage}
                            totalItems={inventoryReportData.products.length}
                            pageSize={inventoryReportPageSize}
                            onPageChange={setInventoryReportPage}
                            onPageSizeChange={setInventoryReportPageSize}
                            pageSizeOptions={[10, 15, 30, 50]}
                            itemName="sản phẩm tồn kho"
                          />
                        )}
                      </div>
                    </div>
                  )}

                  {/* BÁO CÁO ĐƠN HÀNG */}
                  {reportSubTab === 'orders' && (
                    <div className="space-y-6 animate-in fade-in duration-200">
                      {/* Tiêu đề & Bộ lọc đơn hàng */}
                      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                          <div>
                            <h2 className="font-heading font-black text-lg text-slate-900 flex items-center gap-2">
                              <ShoppingCart className="w-5 h-5 text-blue-600" />
                              <span>Báo Cáo Thống Kê Đơn Hàng</span>
                            </h2>
                            <p className="text-xs text-slate-500 mt-1">
                              Thống kê số lượng, tiến độ xử lý và diễn biến đơn hàng theo khoảng thời gian
                            </p>
                          </div>
                          <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
                            <button
                              type="button"
                              onClick={exportOrderReportCsv}
                              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/20 transition cursor-pointer"
                            >
                              <Download className="w-4 h-4" />
                              <span>Xuất File Excel (.xlsx)</span>
                            </button>
                            <button
                              type="button"
                              onClick={exportOrderReportPdf}
                              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-rose-600/20 transition cursor-pointer"
                            >
                              <FileText className="w-4 h-4" />
                              <span>Xuất PDF</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => loadOrderReport()}
                              disabled={orderReportLoading}
                              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                            >
                              <RotateCcw className={`w-3.5 h-3.5 ${orderReportLoading ? 'animate-spin text-blue-600' : ''}`} />
                              <span>Làm mới</span>
                            </button>
                          </div>
                        </div>

                        {/* Thanh lọc nâng cao */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
                          <div className="relative">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              placeholder="Tìm mã đơn, tên, SĐT..."
                              value={orderReportSearch}
                              onChange={(e) => {
                                setOrderReportSearch(e.target.value);
                                setOrderReportPage(1);
                              }}
                              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                            />
                          </div>

                          <div>
                            <select
                              value={orderReportStatus}
                              onChange={(e) => {
                                setOrderReportStatus(e.target.value);
                                setOrderReportPage(1);
                                loadOrderReport(e.target.value, orderReportPaymentStatus, orderReportSearch);
                              }}
                              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition bg-white font-medium"
                            >
                              <option value="all">Tất cả trạng thái đơn</option>
                              <option value="PENDING_GROUP">⏳ Đơn chờ xử lý (Nhóm)</option>
                              <option value="CHO_XAC_NHAN">Chờ xác nhận (COD)</option>
                              <option value="CHO_THANH_TOAN">Chờ thanh toán (VietQR)</option>
                              <option value="DA_XAC_NHAN">Đã xác nhận</option>
                              <option value="DANG_CHUAN_BI">Đang chuẩn bị hàng</option>
                              <option value="DANG_GIAO">🚚 Đang giao hàng</option>
                              <option value="DA_GIAO">✅ Đã giao thành công</option>
                              <option value="TAM_DUNG">⏸️ Tạm dừng xử lý</option>
                              <option value="DA_HUY">❌ Đã hủy</option>
                            </select>
                          </div>

                          <div>
                            <select
                              value={orderReportPaymentStatus}
                              onChange={(e) => {
                                setOrderReportPaymentStatus(e.target.value);
                                setOrderReportPage(1);
                                loadOrderReport(orderReportStatus, e.target.value, orderReportSearch);
                              }}
                              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition bg-white"
                            >
                              <option value="all">Tất cả thanh toán</option>
                              <option value="PAID">Đã thanh toán</option>
                              <option value="UNPAID">Chưa thanh toán</option>
                            </select>
                          </div>

                          <div>
                            <input
                              type="date"
                              value={orderReportStartDate}
                              onChange={(e) => setOrderReportStartDate(e.target.value)}
                              placeholder="Từ ngày"
                              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                            />
                          </div>

                          <div className="flex items-center gap-2">
                            <input
                              type="date"
                              value={orderReportEndDate}
                              onChange={(e) => setOrderReportEndDate(e.target.value)}
                              placeholder="Đến ngày"
                              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setOrderReportPage(1);
                                loadOrderReport();
                              }}
                              className="px-3 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition cursor-pointer shrink-0"
                            >
                              Lọc
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setOrderReportSearch('');
                                setOrderReportStatus('all');
                                setOrderReportPaymentStatus('all');
                                setOrderReportStartDate('');
                                setOrderReportEndDate('');
                                setOrderReportPage(1);
                                loadOrderReport('all', 'all', '', '', '');
                              }}
                              title="Đặt lại bộ lọc"
                              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 transition cursor-pointer shrink-0"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Phím tắt chọn nhanh ngày cho đơn hàng */}
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1">
                          <button
                            type="button"
                            onClick={() => handleQuickOrderDateFilter && handleQuickOrderDateFilter(0)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition cursor-pointer whitespace-nowrap ${
                              isOrdToday
                                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                : 'bg-white border-slate-200 text-slate-700 hover:border-blue-500 hover:text-blue-700'
                            }`}
                          >
                            Hôm nay
                          </button>
                          <button
                            type="button"
                            onClick={() => handleQuickOrderDateFilter && handleQuickOrderDateFilter(7)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition cursor-pointer whitespace-nowrap ${
                              isOrd7Days
                                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                : 'bg-white border-slate-200 text-slate-700 hover:border-blue-500 hover:text-blue-700'
                            }`}
                          >
                            7 ngày qua
                          </button>
                          <button
                            type="button"
                            onClick={() => handleQuickOrderDateFilter && handleQuickOrderDateFilter(30)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition cursor-pointer whitespace-nowrap ${
                              isOrd30Days
                                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                : 'bg-white border-slate-200 text-slate-700 hover:border-blue-500 hover:text-blue-700'
                            }`}
                          >
                            30 ngày qua
                          </button>
                          <button
                            type="button"
                            onClick={() => handleQuickOrderDateFilter && handleQuickOrderDateFilter(-1)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition cursor-pointer whitespace-nowrap ${
                              isOrdAll
                                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                : 'bg-white border-slate-200 text-slate-700 hover:border-blue-500 hover:text-blue-700'
                            }`}
                          >
                            Toàn thời gian
                          </button>
                        </div>
                      </div>

                      {/* 6 Thẻ chỉ số tổng hợp đơn hàng theo kết quả SRS FR-050 */}
                      {orderReportData && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                          {/* 1. Tổng đơn hàng */}
                          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-slate-500 uppercase">Tổng số đơn</span>
                              <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                                <ShoppingCart className="w-4 h-4" />
                              </div>
                            </div>
                            <div>
                              <div className="text-xl font-black text-slate-900 tracking-tight">
                                {orderReportData.summary?.total_orders || 0}
                              </div>
                              <p className="text-[11px] text-slate-500">
                                Hoàn tất: <strong className="text-emerald-700">{orderReportData.summary?.completion_rate || 0}%</strong>
                              </p>
                            </div>
                          </div>

                          {/* 2. Đơn chờ xử lý */}
                          <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-2xs space-y-2 bg-gradient-to-br from-white to-amber-50/20">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-amber-700 uppercase">Chờ xử lý</span>
                              <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
                                <Clock className="w-4 h-4" />
                              </div>
                            </div>
                            <div>
                              <div className="text-xl font-black text-amber-700 tracking-tight">
                                {orderReportData.summary?.pending_orders || 0}
                              </div>
                              <p className="text-[11px] text-amber-600 font-medium">Chờ xác nhận & chuẩn bị</p>
                            </div>
                          </div>

                          {/* 3. Đơn đang giao */}
                          <div className="bg-white p-4 rounded-2xl border border-sky-200 shadow-2xs space-y-2 bg-gradient-to-br from-white to-sky-50/20">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-sky-700 uppercase">Đang giao</span>
                              <div className="w-7 h-7 rounded-lg bg-sky-100 flex items-center justify-center text-sky-600">
                                <Truck className="w-4 h-4" />
                              </div>
                            </div>
                            <div>
                              <div className="text-xl font-black text-sky-700 tracking-tight">
                                {orderReportData.summary?.shipping_orders || 0}
                              </div>
                              <p className="text-[11px] text-sky-600 font-medium">Đang trên đường vận chuyển</p>
                            </div>
                          </div>

                          {/* 4. Đơn đã giao */}
                          <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-2xs space-y-2 bg-gradient-to-br from-white to-emerald-50/20">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-emerald-700 uppercase">Đã giao</span>
                              <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                                <CheckCircle2 className="w-4 h-4" />
                              </div>
                            </div>
                            <div>
                              <div className="text-xl font-black text-emerald-700 tracking-tight">
                                {orderReportData.summary?.delivered_orders || 0}
                              </div>
                              <p className="text-[11px] text-emerald-700 font-bold truncate">
                                +{(orderReportData.summary?.total_revenue || 0).toLocaleString('vi-VN')} đ
                              </p>
                            </div>
                          </div>

                          {/* 5. Đơn tạm dừng */}
                          <div className="bg-white p-4 rounded-2xl border border-purple-200 shadow-2xs space-y-2 bg-gradient-to-br from-white to-purple-50/20">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-purple-700 uppercase">Tạm dừng</span>
                              <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
                                <Pause className="w-4 h-4" />
                              </div>
                            </div>
                            <div>
                              <div className="text-xl font-black text-purple-700 tracking-tight">
                                {orderReportData.summary?.on_hold_orders || 0}
                              </div>
                              <p className="text-[11px] text-purple-600 font-medium">Chờ đối soát / thông tin</p>
                            </div>
                          </div>

                          {/* 6. Đơn hủy */}
                          <div className="bg-white p-4 rounded-2xl border border-rose-200 shadow-2xs space-y-2 bg-gradient-to-br from-white to-rose-50/20">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-rose-700 uppercase">Đơn hủy</span>
                              <div className="w-7 h-7 rounded-lg bg-rose-100 flex items-center justify-center text-rose-600">
                                <XCircle className="w-4 h-4" />
                              </div>
                            </div>
                            <div>
                              <div className="text-xl font-black text-rose-700 tracking-tight">
                                {orderReportData.summary?.cancelled_orders || 0}
                              </div>
                              <p className="text-[11px] text-rose-600 font-medium">Khách hủy / không liên lạc</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Phân bổ theo trạng thái và Phương thức thanh toán */}
                      {orderReportData && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          {/* Phân bổ theo trạng thái */}
                          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-3">
                            <h3 className="font-heading font-black text-sm text-slate-900 flex items-center gap-2">
                              <BarChart3 className="w-4 h-4 text-blue-600" />
                              <span>Cơ Cấu Trạng Thái Đơn Hàng</span>
                            </h3>
                            <div className="space-y-2.5 pt-1">
                              {orderReportData.status_breakdown?.map((st) => {
                                const total = orderReportData.summary?.total_orders || 1;
                                const pct = Math.round((st.count / total) * 100);
                                return (
                                  <div key={st.status} className="space-y-1">
                                    <div className="flex items-center justify-between text-xs">
                                      <span className="font-bold text-slate-800">{st.label}</span>
                                      <div className="flex items-center gap-2">
                                        <span className="font-black text-slate-900">{st.count} đơn</span>
                                        <span className="text-slate-400 text-[11px]">({pct}%)</span>
                                      </div>
                                    </div>
                                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                      <div
                                        className="h-full bg-blue-600 rounded-full transition-all duration-300"
                                        style={{ width: `${pct}%` }}
                                      />
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Phân bổ theo phương thức thanh toán */}
                          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-3">
                            <h3 className="font-heading font-black text-sm text-slate-900 flex items-center gap-2">
                              <Tag className="w-4 h-4 text-emerald-600" />
                              <span>Phương Thức Thanh Toán Sử Dụng</span>
                            </h3>
                            <div className="space-y-3 pt-1">
                              {orderReportData.payment_breakdown?.map((pm) => (
                                <div key={pm.method} className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/40 flex items-center justify-between">
                                  <div>
                                    <p className="font-bold text-xs text-slate-900">{pm.label}</p>
                                    <span className="text-[11px] text-slate-500 font-medium">
                                      {pm.order_count} đơn hàng sử dụng
                                    </span>
                                  </div>
                                  <span className="font-black text-xs text-emerald-700">
                                    {Math.round(pm.total_amount).toLocaleString('vi-VN')} đ
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Bảng chi tiết toàn bộ đơn hàng */}
                      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden p-6 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                          <div>
                            <h3 className="font-heading font-black text-base text-slate-900 flex items-center gap-2">
                              <ShoppingCart className="w-4 h-4 text-blue-600" />
                              <span>Danh Sách Chi Tiết Đơn Hàng</span>
                            </h3>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Thống kê đầy đủ thông tin: Mã đơn, Thời gian đặt, Khách hàng, Địa chỉ giao, Số món, Tổng tiền và Trạng thái
                            </p>
                          </div>
                          <span className="text-xs px-3 py-1 rounded-xl bg-slate-100 text-slate-600 font-bold self-start sm:self-auto">
                            Tổng cộng: {orderReportData?.orders?.length || 0} đơn hàng
                          </span>
                        </div>

                        {orderReportLoading ? (
                          <div className="py-6 space-y-3 animate-pulse">
                            <div className="h-10 bg-slate-100 rounded-xl w-full" />
                            {[...Array(6)].map((_, i) => (
                              <div key={i} className="h-12 bg-slate-50 border border-slate-100 rounded-xl w-full flex items-center px-4 gap-4">
                                <div className="h-4 w-20 bg-slate-200 rounded" />
                                <div className="h-4 w-32 bg-slate-200 rounded" />
                                <div className="h-4 w-24 bg-slate-200 rounded" />
                                <div className="h-4 w-20 bg-slate-200 rounded ml-auto" />
                              </div>
                            ))}
                          </div>
                        ) : !orderReportData || orderReportData.orders?.length === 0 ? (
                          <div className="py-12 text-center text-slate-400 space-y-2">
                            <ShoppingCart className="w-10 h-10 mx-auto text-slate-300" />
                            <p className="text-sm font-semibold text-slate-600">Không có đơn hàng nào phù hợp với bộ lọc</p>
                            <p className="text-xs text-slate-400">Vui lòng thử chọn khoảng thời gian hoặc trạng thái đơn hàng khác.</p>
                          </div>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs text-slate-600 border-collapse">
                              <thead>
                                <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                  <th className="py-3 px-3">Mã đơn</th>
                                  <th className="py-3 px-3">Thời gian đặt</th>
                                  <th className="py-3 px-3">Khách hàng / SĐT</th>
                                  <th className="py-3 px-3">Địa chỉ giao hàng</th>
                                  <th className="py-3 px-3 text-center">Số món</th>
                                  <th className="py-3 px-3 text-right">Tổng tiền</th>
                                  <th className="py-3 px-3 text-center">Thanh toán</th>
                                  <th className="py-3 px-3 text-center">Trạng thái đơn hàng</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {(() => {
                                  const ordList = orderReportData.orders || [];
                                  const startIdx = (orderReportPage - 1) * orderReportPageSize;
                                  const pageItems = ordList.slice(startIdx, startIdx + orderReportPageSize);

                                  return pageItems.map((ord) => {
                                    const isDelivered = ord.order_status === 'DA_GIAO';
                                    const isCancelled = ord.order_status === 'DA_HUY';
                                    const isShipping = ord.order_status === 'DANG_GIAO';
                                    const isOnHold = ord.order_status === 'TAM_DUNG';

                                    return (
                                      <tr key={ord.id} className="hover:bg-slate-50/60 transition">
                                        <td className="py-3 px-3 font-mono font-bold text-slate-900">
                                          <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[11px]">
                                            {ord.order_code}
                                          </span>
                                        </td>
                                        <td className="py-3 px-3 text-slate-500 text-[11px]">
                                          {ord.created_at ? formatDateTime(ord.created_at) : '—'}
                                        </td>
                                        <td className="py-3 px-3">
                                          <p className="font-bold text-slate-900">{ord.receiver_name || 'Khách vãng lai'}</p>
                                          <span className="text-[11px] text-slate-500">{ord.phone}</span>
                                        </td>
                                        <td className="py-3 px-3 max-w-[200px] truncate text-slate-600" title={ord.address}>
                                          {ord.address}
                                        </td>
                                        <td className="py-3 px-3 text-center font-bold text-slate-800">
                                          {ord.item_count} món
                                        </td>
                                        <td className="py-3 px-3 text-right font-black text-slate-900">
                                          {ord.total_amount.toLocaleString('vi-VN')} đ
                                        </td>
                                        <td className="py-3 px-3 text-center">
                                          <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                            ord.payment_status === 'PAID'
                                              ? 'bg-emerald-100 text-emerald-800'
                                              : 'bg-amber-100 text-amber-800'
                                          }`}>
                                            {ord.payment_status === 'PAID' ? 'Đã trả' : 'Chưa trả'}
                                          </span>
                                          <span className="text-[10px] text-slate-400 block mt-0.5">{ord.payment_method}</span>
                                        </td>
                                        <td className="py-3 px-3 text-center">
                                          {isDelivered ? (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                              <span>Đã giao thành công</span>
                                            </span>
                                          ) : isCancelled ? (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-rose-100 text-rose-700 border border-rose-200">
                                              <XCircle className="w-3 h-3 text-rose-600" />
                                              <span>Đã hủy</span>
                                            </span>
                                          ) : isShipping ? (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-sky-100 text-sky-800 border border-sky-200">
                                              <Truck className="w-3 h-3 text-sky-600" />
                                              <span>Đang giao</span>
                                            </span>
                                          ) : isOnHold ? (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-purple-100 text-purple-800 border border-purple-200">
                                              <Pause className="w-3 h-3 text-purple-600" />
                                              <span>Tạm dừng</span>
                                            </span>
                                          ) : (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-amber-100 text-amber-800 border border-amber-200">
                                              <Clock className="w-3 h-3 text-amber-600" />
                                              <span>{ord.order_status_label}</span>
                                            </span>
                                          )}
                                        </td>
                                      </tr>
                                    );
                                  });
                                })()}
                              </tbody>
                            </table>
                          </div>
                        )}

                        {/* Phân trang danh sách đơn hàng */}
                        {orderReportData && orderReportData.orders?.length > 0 && (
                          <Pagination
                            currentPage={orderReportPage}
                            totalItems={orderReportData.orders.length}
                            pageSize={orderReportPageSize}
                            onPageChange={setOrderReportPage}
                            onPageSizeChange={setOrderReportPageSize}
                            pageSizeOptions={[10, 15, 30, 50]}
                            itemName="đơn hàng"
                          />
                        )}
                      </div>
                    </div>
                  )}
</div>
  );
}
