'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingCart, Search, PackageOpen, ExternalLink, Eye } from 'lucide-react';
import Pagination from '@/components/Pagination';
import { formatDateTime } from '@/lib/date';

export default function AdminOrdersTab({
  orders,
  paginatedOrders,
  orderSearch,
  setOrderSearch,
  orderStatusFilter,
  setOrderStatusFilter,
  orderStartDate,
  setOrderStartDate,
  orderEndDate,
  setOrderEndDate,
  orderPage,
  setOrderPage,
  orderPageSize,
  setOrderPageSize,
  onViewOrderDetail,
  onPromptChangeOrderStatus,
  onPromptPauseOrder,
  onPromptResumeOrder,
  onPromptCancelOrder,
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden space-y-5 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h2 className="font-heading font-black text-lg text-slate-900 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-emerald-600" />
            <span>Quản Lý Đơn Hàng & Vận Đơn GreenSM</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Quy trình xử lý đơn hàng: Tiếp nhận ➔ Chuẩn bị hàng ➔ Đang giao ➔ Hoàn tất
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Tìm mã đơn, tên, số điện thoại..."
              value={orderSearch}
              onChange={(e) => setOrderSearch(e.target.value)}
              className="pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
            />
          </div>
          <select
            value={orderStatusFilter}
            onChange={(e) => setOrderStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="CHO_THANH_TOAN">Chờ thanh toán (QR)</option>
            <option value="CHO_XAC_NHAN">Chờ xác nhận (COD)</option>
            <option value="DA_XAC_NHAN">Đã duyệt</option>
            <option value="DANG_CHUAN_BI">Đang chuẩn bị</option>
            <option value="TAM_DUNG">Tạm dừng</option>
            <option value="DANG_GIAO">Đang giao</option>
            <option value="DA_GIAO">Đã giao</option>
            <option value="DA_HUY">Đã hủy</option>
          </select>
          <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50/80 px-2.5 py-1.5 rounded-xl border border-slate-200">
            <span className="text-[11px] font-bold text-slate-500">Từ:</span>
            <input
              type="date"
              value={orderStartDate}
              onChange={(e) => setOrderStartDate(e.target.value)}
              className="bg-transparent text-xs focus:outline-none"
            />
            <span className="text-[11px] font-bold text-slate-500 ml-1">Đến:</span>
            <input
              type="date"
              value={orderEndDate}
              onChange={(e) => setOrderEndDate(e.target.value)}
              className="bg-transparent text-xs focus:outline-none"
            />
            {(orderStartDate || orderEndDate) && (
              <button
                type="button"
                onClick={() => {
                  setOrderStartDate('');
                  setOrderEndDate('');
                }}
                className="text-xs text-rose-500 hover:text-rose-700 font-bold ml-1 cursor-pointer"
                title="Xóa lọc ngày"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100">
            <PackageOpen className="w-8 h-8" />
          </div>
          <h4 className="font-heading font-black text-slate-900 text-lg">Chưa có đơn hàng nào</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Chưa có đơn hàng nào trong hệ thống. Đơn hàng mới của khách sẽ tự động hiển thị tại đây khi được đặt mua.
          </p>
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold hover:bg-brand-700 transition cursor-pointer"
          >
            <span>Xem cửa hàng</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[900px]">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-extrabold uppercase tracking-wider border-b border-slate-200">
                <th className="py-3 px-3 whitespace-nowrap">Mã đơn</th>
                <th className="py-3 px-3 whitespace-nowrap">Thời gian</th>
                <th className="py-3 px-3 whitespace-nowrap">Khách hàng</th>
                <th className="py-3 px-3 whitespace-nowrap">Số điện thoại</th>
                <th className="py-3 px-3 whitespace-nowrap">Thanh toán</th>
                <th className="py-3 px-3 whitespace-nowrap">Trạng thái</th>
                <th className="py-3 px-3 whitespace-nowrap">Tổng tiền</th>
                <th className="py-3 px-3 whitespace-nowrap">Người xử lý</th>
                <th className="py-3 px-3 text-right whitespace-nowrap">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedOrders.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50/80 transition">
                  {/* Mã đơn */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => onViewOrderDetail(o)}
                      className="font-mono font-bold text-brand-700 hover:text-brand-800 hover:underline cursor-pointer"
                      title="Xem chi tiết đơn này"
                    >
                      {o.order_code}
                    </button>
                  </td>

                  {/* Thời gian */}
                  <td className="py-3 px-3 whitespace-nowrap text-slate-600 font-mono text-[11px]">
                    {formatDateTime(o.created_at)}
                  </td>

                  {/* Tên khách hàng */}
                  <td className="py-3 px-3 whitespace-nowrap font-bold text-slate-900">
                    {o.receiver_name}
                  </td>

                  {/* Số điện thoại */}
                  <td className="py-3 px-3 whitespace-nowrap text-slate-600 font-mono text-[11px]">
                    {o.phone}
                  </td>

                  {/* Thanh toán */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        o.payment_status === 'PAID'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {o.payment_method} ({o.payment_status === 'PAID' ? 'Đã thu' : 'Chưa thu'})
                    </span>
                  </td>

                  {/* Trạng thái */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        o.order_status === 'DA_GIAO'
                          ? 'bg-emerald-100 text-emerald-800'
                          : o.order_status === 'DANG_GIAO'
                          ? 'bg-teal-100 text-teal-800'
                          : o.order_status === 'DANG_CHUAN_BI'
                          ? 'bg-blue-100 text-blue-800'
                          : o.order_status === 'TAM_DUNG'
                          ? 'bg-yellow-100 text-yellow-800'
                          : o.order_status === 'DA_XAC_NHAN'
                          ? 'bg-purple-100 text-purple-800'
                          : o.order_status === 'CHO_THANH_TOAN'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : o.order_status === 'DA_HUY'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {o.order_status === 'CHO_THANH_TOAN'
                        ? 'Chờ thanh toán'
                        : o.order_status === 'CHO_XAC_NHAN'
                        ? 'Chờ xác nhận'
                        : o.order_status === 'DA_XAC_NHAN'
                        ? 'Đã xác nhận'
                        : o.order_status === 'DANG_CHUAN_BI'
                        ? 'Đang chuẩn bị'
                        : o.order_status === 'TAM_DUNG'
                        ? 'Tạm dừng'
                        : o.order_status === 'DANG_GIAO'
                        ? 'Đang giao'
                        : o.order_status === 'DA_GIAO'
                        ? 'Đã giao'
                        : o.order_status === 'DA_HUY'
                        ? 'Đã hủy'
                        : o.order_status}
                    </span>
                  </td>

                  {/* Tổng tiền */}
                  <td className="py-3 px-3 font-bold text-slate-900 whitespace-nowrap">
                    {parseFloat(o.total_amount).toLocaleString('vi-VN')} đ
                  </td>

                  {/* Người xử lý */}
                  <td className="py-3 px-3 whitespace-nowrap text-slate-600 font-medium text-[11px]">
                    {['CHO_XAC_NHAN', 'CHO_THANH_TOAN'].includes(o.order_status) && !o.processor_name ? (
                      <span className="text-slate-400 italic">Chưa tiếp nhận</span>
                    ) : o.order_status === 'DA_HUY' &&
                      (!o.processor_name || o.processor_name === o.receiver_name) ? (
                      <span className="text-red-500 font-medium">Khách tự hủy</span>
                    ) : (
                      <span className="text-slate-800 font-medium">
                        {o.processor_name || 'Admin Tổng'}
                      </span>
                    )}
                  </td>

                  {/* Thao tác */}
                  <td className="py-3 px-3 text-right space-x-1 whitespace-nowrap">
                    {/* 1. Xem chi tiết */}
                    <button
                      type="button"
                      onClick={() => onViewOrderDetail(o)}
                      className="px-2 py-1 bg-brand-50 hover:bg-brand-100 text-brand-700 rounded-lg text-[10px] font-bold transition inline-flex items-center gap-1 cursor-pointer border border-brand-200/60"
                      title="Xem chi tiết đơn hàng"
                    >
                      <Eye className="w-3 h-3" /> Chi tiết
                    </button>

                    {/* 2. Đổi trạng thái */}
                    {(() => {
                      if (['CHO_XAC_NHAN', 'CHO_THANH_TOAN'].includes(o.order_status)) {
                        const isVietQrPending = o.payment_method === 'VIETQR' && o.payment_status !== 'PAID';
                        if (isVietQrPending) {
                          return (
                            <button
                              type="button"
                              onClick={() => onViewOrderDetail(o)}
                              className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold cursor-pointer transition shadow-sm"
                              title="Kiểm tra tiền chuyển khoản và duyệt đơn"
                            >
                              Thu tiền & Duyệt
                            </button>
                          );
                        }
                        return (
                          <button
                            type="button"
                            onClick={() =>
                              onPromptChangeOrderStatus(o, 'DA_XAC_NHAN', 'DA_TAO_VAN_DON', 'Duyệt đơn')
                            }
                            className="px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-[10px] font-bold cursor-pointer transition shadow-sm"
                            title="Duyệt đơn hàng"
                          >
                            Duyệt đơn
                          </button>
                        );
                      }
                      if (o.order_status === 'DA_XAC_NHAN') {
                        return (
                          <button
                            type="button"
                            onClick={() =>
                              onPromptChangeOrderStatus(o, 'DANG_CHUAN_BI', null, 'Đóng gói')
                            }
                            className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold cursor-pointer transition shadow-sm"
                            title="Chuyển sang đóng gói"
                          >
                            Đóng gói
                          </button>
                        );
                      }
                      if (o.order_status === 'DANG_CHUAN_BI') {
                        return (
                          <button
                            type="button"
                            onClick={() =>
                              onPromptChangeOrderStatus(o, 'DANG_GIAO', 'DANG_GIAO', 'Bàn giao GreenSM')
                            }
                            className="px-2 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-[10px] font-bold cursor-pointer transition shadow-sm"
                            title="Bàn giao GreenSM"
                          >
                            Giao hàng
                          </button>
                        );
                      }
                      if (o.order_status === 'DANG_GIAO') {
                        return (
                          <button
                            type="button"
                            onClick={() =>
                              onPromptChangeOrderStatus(o, 'DA_GIAO', 'GIAO_THANH_CONG', 'Hoàn tất đơn')
                            }
                            className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold cursor-pointer transition shadow-sm"
                            title="Hoàn tất đơn hàng"
                          >
                            Hoàn tất
                          </button>
                        );
                      }
                      return (
                        <button
                          type="button"
                          disabled
                          className="px-2 py-1 bg-slate-100 text-slate-400 rounded-lg text-[10px] font-bold cursor-not-allowed border border-slate-200"
                          title="Không có bước kế tiếp"
                        >
                          Đổi trạng thái
                        </button>
                      );
                    })()}

                    {/* 3. Tạm dừng / Tiếp tục */}
                    {['CHO_XAC_NHAN', 'CHO_THANH_TOAN', 'DA_XAC_NHAN', 'DANG_CHUAN_BI'].includes(
                      o.order_status
                    ) ? (
                      <button
                        type="button"
                        onClick={() => onPromptPauseOrder(o)}
                        className="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-[10px] font-bold cursor-pointer transition shadow-sm"
                        title="Tạm dừng xử lý đơn hàng"
                      >
                        Tạm dừng
                      </button>
                    ) : o.order_status === 'TAM_DUNG' ? (
                      <button
                        type="button"
                        onClick={() => onPromptResumeOrder(o)}
                        className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold cursor-pointer transition shadow-sm"
                        title="Tiếp tục xử lý đơn hàng"
                      >
                        Tiếp tục
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="px-2 py-1 bg-slate-100 text-slate-400 rounded-lg text-[10px] font-bold cursor-not-allowed border border-slate-200"
                        title="Không thể tạm dừng khi đơn đã bàn giao vận chuyển hoặc đã kết thúc"
                      >
                        Tạm dừng
                      </button>
                    )}

                    {/* 4. Hủy */}
                    {!['DANG_GIAO', 'DA_GIAO', 'DA_HUY'].includes(o.order_status) ? (
                      <button
                        type="button"
                        onClick={() => onPromptCancelOrder(o)}
                        className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-[10px] font-bold cursor-pointer transition border border-red-200 hover:border-red-300"
                        title="Hủy đơn hàng và hoàn trả tồn kho"
                      >
                        Hủy
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="px-2 py-1 bg-slate-100 text-slate-400 rounded-lg text-[10px] font-bold cursor-not-allowed border border-slate-200"
                        title="Không thể hủy khi đơn đã bàn giao GreenSM hoặc đã kết thúc"
                      >
                        Hủy
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Phân trang đơn hàng */}
      {orders.length > 0 && (
        <Pagination
          currentPage={orderPage}
          totalItems={orders.length}
          pageSize={orderPageSize}
          onPageChange={setOrderPage}
          onPageSizeChange={setOrderPageSize}
          pageSizeOptions={[5, 10, 20, 50]}
          itemName="đơn hàng"
        />
      )}
    </div>
  );
}

