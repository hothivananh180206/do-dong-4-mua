'use client';

import React from 'react';
import { CheckCircle2, Clock, Play, AlertTriangle, User, Truck, X, Phone, MapPin, CreditCard, DollarSign } from 'lucide-react';
import { formatDateTime } from '@/lib/date';

export default function OrderDetailModals({
  confirmModal,
  setConfirmModal,
  orderActionModal,
  setOrderActionModal,
  executeOrderActionModal,
  handleUpdateOrderStatus,
  selectedOrder,
  setSelectedOrder,
  loadingOrderDetail,
  requestConfirm,
  promptChangeOrderStatus,
  promptPauseOrder,
  promptResumeOrder,
  promptCancelOrder
}) {
  return (
    <>
      {confirmModal?.isOpen && (
        <div className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center shadow-2xl border border-slate-100">
            <div className="mb-3.5 flex justify-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shadow-sm">
                <DollarSign className="w-7 h-7" />
              </div>
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-1.5">{confirmModal.title}</h3>
            <p className="text-xs text-slate-500 mb-5 leading-relaxed">{confirmModal.message}</p>
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 font-bold text-xs text-slate-600 hover:bg-slate-50 transition cursor-pointer"
              >
                {confirmModal.cancelText}
              </button>
              <button
                type="button"
                onClick={async () => {
                  const onConfirm = confirmModal.onConfirm;
                  setConfirmModal((prev) => ({ ...prev, isOpen: false }));
                  if (onConfirm) await onConfirm();
                }}
                className="flex-1 py-2.5 px-4 rounded-xl font-black text-xs text-white bg-emerald-600 hover:bg-emerald-700 transition cursor-pointer shadow-sm"
              >
                {confirmModal.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}

      {orderActionModal.isOpen && orderActionModal.order && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200 relative">
            <button
              type="button"
              onClick={() => setOrderActionModal((prev) => ({ ...prev, isOpen: false }))}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center transition cursor-pointer text-sm font-bold"
            >
              ✕
            </button>

            {/* Top Icon with Brand Tint */}
            <div className="mb-3.5 flex justify-center">
              {orderActionModal.iconType === 'status' ? (
                <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center shadow-sm">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
              ) : orderActionModal.iconType === 'pause' ? (
                <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 border border-amber-100 flex items-center justify-center shadow-sm">
                  <Clock className="w-7 h-7" />
                </div>
              ) : orderActionModal.iconType === 'resume' ? (
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shadow-sm">
                  <Play className="w-7 h-7" />
                </div>
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 border border-red-100 flex items-center justify-center shadow-sm">
                  <AlertTriangle className="w-7 h-7" />
                </div>
              )}
            </div>

            <h3 className="text-lg font-black text-slate-900 mb-1.5">{orderActionModal.title}</h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed px-2">{orderActionModal.message}</p>

            {/* Thông tin vắn tắt đơn hàng */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 mb-4 text-left flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Mã đơn hàng</div>
                <div className="font-mono font-bold text-slate-800 text-xs mt-0.5">#{orderActionModal.order.order_code}</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] uppercase font-bold text-slate-400">Khách nhận</div>
                <div className="font-bold text-slate-800 text-xs mt-0.5">{orderActionModal.order.receiver_name}</div>
              </div>
            </div>

            {/* Ô nhập lý do nếu là Tạm dừng hoặc Hủy đơn */}
            {orderActionModal.requireReason && (
              <div className="mb-4 text-left">
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 mb-1.5">
                  Lý do {orderActionModal.actionType === 'PAUSE' ? 'tạm dừng' : 'hủy đơn'} <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={orderActionModal.reason}
                  onChange={(e) => setOrderActionModal((prev) => ({ ...prev, reason: e.target.value }))}
                  rows={2}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none font-sans"
                  placeholder={orderActionModal.actionType === 'PAUSE' ? 'Nhập lý do tạm dừng đơn hàng...' : 'Nhập lý do hủy đơn hàng...'}
                  autoFocus
                />
              </div>
            )}

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setOrderActionModal((prev) => ({ ...prev, isOpen: false }))}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 font-bold text-xs text-slate-600 hover:bg-slate-50 transition cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={executeOrderActionModal}
                className={`flex-1 py-2.5 px-4 rounded-xl font-black text-xs text-white transition cursor-pointer shadow-sm ${orderActionModal.confirmColor}`}
              >
                {orderActionModal.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center text-lg font-bold">
                  📦
                </div>
                <div>
                  <h3 className="font-heading font-black text-slate-900 text-base flex items-center gap-2">
                    <span>Chi Tiết Đơn Hàng</span>
                    <span className="font-mono text-brand-700 bg-brand-50 px-2 py-0.5 rounded-lg border border-brand-200/60">{selectedOrder.order_code}</span>
                  </h3>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Thời gian đặt: {formatDateTime(selectedOrder.created_at) || '—'} • Xử lý: <strong className="text-slate-700">
                      {['CHO_XAC_NHAN', 'CHO_THANH_TOAN'].includes(selectedOrder.order_status) && !selectedOrder.processor_name ? (
                        <span className="text-slate-400 italic font-normal">Chưa tiếp nhận</span>
                      ) : selectedOrder.order_status === 'DA_HUY' && (!selectedOrder.processor_name || selectedOrder.processor_name === selectedOrder.receiver_name) ? (
                        <span className="text-red-600 font-medium">Khách hàng hủy</span>
                      ) : (
                        selectedOrder.processor_name || 'Admin Tổng'
                      )}
                    </strong>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 rounded-xl bg-slate-200/60 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition cursor-pointer font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
              {/* 2 Cột thông tin */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Thông tin khách hàng & nhận hàng */}
                <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/60 space-y-2">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5 text-xs pb-1.5 border-b border-slate-200/60">
                    <User className="w-4 h-4 text-brand-600" /> Thông Tin Khách Hàng
                  </div>
                  <div className="space-y-1.5 text-slate-700">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Người nhận:</span>
                      <strong className="text-slate-900 font-bold">{selectedOrder.receiver_name}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Số điện thoại:</span>
                      <strong className="text-slate-900 font-mono">{selectedOrder.phone}</strong>
                    </div>
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-slate-500 shrink-0">Địa chỉ nhận:</span>
                      <span className="text-slate-900 text-right font-medium">{selectedOrder.address}</span>
                    </div>
                    <div className="flex justify-between items-start gap-2 pt-1 border-t border-slate-200/50">
                      <span className="text-slate-500 shrink-0">Ghi chú:</span>
                      <span className="text-slate-900 text-right font-medium italic">
                        {selectedOrder.note && selectedOrder.note.trim() ? selectedOrder.note : 'Không có ghi chú'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Thông tin vận chuyển & thanh toán */}
                <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/60 space-y-2">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5 text-xs pb-1.5 border-b border-slate-200/60">
                    <Truck className="w-4 h-4 text-emerald-600" /> Thanh Toán & Vận Chuyển
                  </div>
                  <div className="space-y-1.5 text-slate-700">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Hình thức:</span>
                      <strong className="text-slate-900">{selectedOrder.payment_method || 'COD'}</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Thanh toán:</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        selectedOrder.payment_status === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {selectedOrder.payment_status === 'PAID' ? 'ĐÃ THU TIỀN' : 'CHƯA THU'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-1 border-t border-slate-200/40">
                      <span className="text-slate-500">Đơn vị vận chuyển:</span>
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                        {selectedOrder.shipping_company || 'GreenSM'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Mã vận đơn:</span>
                      <strong className="font-mono text-slate-800">{selectedOrder.tracking_code && ['DANG_GIAO', 'DA_GIAO'].includes(selectedOrder.order_status) ? selectedOrder.tracking_code : 'Chưa tạo (chờ giao hàng)'}</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Trạng thái đơn:</span>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        selectedOrder.order_status === 'DA_GIAO' ? 'bg-emerald-100 text-emerald-800' :
                        selectedOrder.order_status === 'DANG_GIAO' ? 'bg-teal-100 text-teal-800' :
                        selectedOrder.order_status === 'DANG_CHUAN_BI' ? 'bg-blue-100 text-blue-800' :
                        selectedOrder.order_status === 'TAM_DUNG' ? 'bg-yellow-100 text-yellow-800' :
                        selectedOrder.order_status === 'DA_XAC_NHAN' ? 'bg-purple-100 text-purple-800' :
                        selectedOrder.order_status === 'CHO_THANH_TOAN' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                        selectedOrder.order_status === 'DA_HUY' ? 'bg-red-100 text-red-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {selectedOrder.order_status === 'CHO_THANH_TOAN' ? 'Chờ thanh toán (VietQR)' :
                         selectedOrder.order_status === 'CHO_XAC_NHAN' ? 'Chờ xác nhận (COD)' :
                         selectedOrder.order_status === 'DA_XAC_NHAN' ? 'Đã duyệt (Tiếp nhận)' :
                         selectedOrder.order_status === 'DANG_CHUAN_BI' ? 'Đang chuẩn bị hàng' :
                         selectedOrder.order_status === 'TAM_DUNG' ? 'Tạm dừng xử lý' :
                         selectedOrder.order_status === 'DANG_GIAO' ? 'Đang giao GreenSM' :
                         selectedOrder.order_status === 'DA_GIAO' ? 'Giao thành công' :
                         selectedOrder.order_status === 'DA_HUY' ? 'Đã hủy đơn' : selectedOrder.order_status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bảng danh sách sản phẩm trong đơn */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <div className="bg-slate-50 px-4 py-2 font-bold text-slate-800 text-xs border-b border-slate-200 flex items-center justify-between">
                  <span>Danh Sách Sản Phẩm Mua</span>
                  <span className="text-slate-500 font-normal">{selectedOrder.items?.length || 0} sản phẩm</span>
                </div>
                {loadingOrderDetail ? (
                  <div className="p-6 text-center text-slate-400">Đang tải chi tiết các món...</div>
                ) : (
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50/60 text-slate-500 text-[11px] border-b border-slate-100">
                      <tr>
                        <th className="py-2 px-3">Tên trái cây</th>
                        <th className="py-2 px-3 text-center">ĐVT</th>
                        <th className="py-2 px-3 text-right">Đơn giá</th>
                        <th className="py-2 px-3 text-center">Số lượng</th>
                        <th className="py-2 px-3 text-right">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedOrder.items?.map((item, idx) => (
                        <tr key={item.id || idx}>
                          <td className="py-2 px-3">
                            <div className="flex items-center gap-2">
                              {item.thumbnail ? (
                                <img src={item.thumbnail} alt={item.product_name} className="w-8 h-8 rounded-lg object-cover border" />
                              ) : (
                                <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-xs">🍇</div>
                              )}
                              <span className="font-bold text-slate-800">{item.product_name}</span>
                            </div>
                          </td>
                          <td className="py-2 px-3 text-center text-slate-500">{item.unit || 'kg'}</td>
                          <td className="py-2 px-3 text-right text-slate-700">
                            {parseFloat(item.unit_price || 0).toLocaleString('vi-VN')} đ
                          </td>
                          <td className="py-2 px-3 text-center font-bold text-slate-900">
                            x{item.quantity}
                          </td>
                          <td className="py-2 px-3 text-right font-bold text-slate-900">
                            {parseFloat(item.subtotal || item.total_price || (item.unit_price * item.quantity) || 0).toLocaleString('vi-VN')} đ
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Tóm tắt tổng tiền */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Tiền hàng (Tạm tính):</span>
                  <span className="font-medium">{parseFloat(selectedOrder.subtotal || (parseFloat(selectedOrder.total_amount || 0) - parseFloat(selectedOrder.shipping_fee || 0)) || 0).toLocaleString('vi-VN')} đ</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Phí vận chuyển (GreenSM):</span>
                  <span className="font-medium">{parseFloat(selectedOrder.shipping_fee || 0).toLocaleString('vi-VN')} đ</span>
                </div>
                <div className="flex justify-between text-sm font-black text-brand-700 pt-2 border-t border-slate-200">
                  <span>Tổng tiền thanh toán:</span>
                  <span className="text-base">{parseFloat(selectedOrder.total_amount || 0).toLocaleString('vi-VN')} đ</span>
                </div>
              </div>

              {/* Lịch Sử Xử Lý Đơn Hàng (SRS FR-030) */}
              <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/60 space-y-3">
                <div className="font-bold text-slate-900 flex items-center justify-between text-xs pb-2 border-b border-slate-200/60">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-brand-600" />
                    <span>Lịch Sử Xử Lý Đơn Hàng</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-normal">
                    {selectedOrder.logs?.length || 1} mốc xử lý
                  </span>
                </div>

                <div className="relative pl-6 space-y-3.5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {selectedOrder.logs && selectedOrder.logs.length > 0 ? (
                    selectedOrder.logs.map((log, idx) => (
                      <div key={log.id || idx} className="relative text-xs">
                        <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-brand-600 border-2 border-white ring-2 ring-brand-100" />
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <strong className="text-slate-900 font-bold">
                            {log.title || (log.action === 'UPDATE_STATUS' ? 'Đổi trạng thái đơn' : log.action === 'AUTO_REGISTER' ? 'Tự động tạo tài khoản' : log.action) || 'Cập nhật đơn hàng'}
                          </strong>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {formatDateTime(log.created_at)}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5">{log.description}</p>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Người xử lý: <span className="font-medium text-slate-700">{log.user_name || 'Admin'}</span>
                          {log.role_name && <span className="text-slate-400"> ({log.role_name})</span>}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="relative text-xs">
                      <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-brand-600 border-2 border-white ring-2 ring-brand-100" />
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <strong className="text-slate-900 font-bold">Khách hàng đặt hàng</strong>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {formatDateTime(selectedOrder.created_at) || '—'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        Khách hàng {selectedOrder.receiver_name} đặt đơn qua {selectedOrder.payment_method || 'COD'}
                      </p>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Người xử lý: <span className="font-medium text-slate-700">{selectedOrder.receiver_name}</span> (Khách hàng)
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer: Nút xử lý & Nút Đóng */}
            <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-1.5">
                {selectedOrder.payment_status !== 'PAID' && selectedOrder.order_status !== 'DA_HUY' && (
                  <button
                    onClick={() => {
                      requestConfirm({
                        title: 'Xác Nhận Đã Thu Tiền',
                        message: `Xác nhận đã thu đủ ${parseFloat(selectedOrder.total_amount || 0).toLocaleString('vi-VN')} đ cho đơn ${selectedOrder.order_code}?`,
                        confirmText: 'Xác nhận thu tiền',
                        type: 'success',
                        onConfirm: () => handleUpdateOrderStatus(
                          selectedOrder.order_code,
                          ['CHO_XAC_NHAN', 'CHO_THANH_TOAN'].includes(selectedOrder.order_status) ? 'DA_XAC_NHAN' : null,
                          ['CHO_XAC_NHAN', 'CHO_THANH_TOAN'].includes(selectedOrder.order_status) ? 'DA_TAO_VAN_DON' : null,
                          'PAID'
                        ),
                      });
                    }}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer transition shadow-sm"
                  >
                    ✓ Đã thu tiền
                  </button>
                )}

                {['CHO_XAC_NHAN', 'CHO_THANH_TOAN'].includes(selectedOrder.order_status) && (
                  <button
                    onClick={() => promptChangeOrderStatus(selectedOrder, 'DA_XAC_NHAN', 'DA_TAO_VAN_DON', 'Duyệt đơn')}
                    className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold cursor-pointer transition shadow-sm"
                  >
                    Duyệt đơn
                  </button>
                )}

                {selectedOrder.order_status === 'DA_XAC_NHAN' && (
                  <button
                    onClick={() => promptChangeOrderStatus(selectedOrder, 'DANG_CHUAN_BI', null, 'Đóng gói')}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer transition shadow-sm"
                  >
                    Đóng gói
                  </button>
                )}

                {selectedOrder.order_status === 'DANG_CHUAN_BI' && (
                  <button
                    onClick={() => promptChangeOrderStatus(selectedOrder, 'DANG_GIAO', 'DANG_GIAO', 'Bàn giao GreenSM')}
                    className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold cursor-pointer transition shadow-sm"
                  >
                    Bàn giao GreenSM
                  </button>
                )}

                {selectedOrder.order_status === 'DANG_GIAO' && (
                  <button
                    onClick={() => promptChangeOrderStatus(selectedOrder, 'DA_GIAO', 'GIAO_THANH_CONG', 'Hoàn tất giao hàng')}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer transition shadow-sm"
                  >
                    Hoàn tất giao hàng
                  </button>
                )}

                {/* Tạm dừng / Tiếp tục trong modal */}
                {['CHO_XAC_NHAN', 'CHO_THANH_TOAN', 'DA_XAC_NHAN', 'DANG_CHUAN_BI'].includes(selectedOrder.order_status) && (
                  <button
                    onClick={() => promptPauseOrder(selectedOrder)}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold cursor-pointer transition shadow-sm"
                  >
                    Tạm dừng
                  </button>
                )}
                {selectedOrder.order_status === 'TAM_DUNG' && (
                  <button
                    onClick={() => promptResumeOrder(selectedOrder)}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer transition shadow-sm"
                  >
                    Tiếp tục xử lý
                  </button>
                )}

                {/* Hủy đơn trong modal */}
                {!['DANG_GIAO', 'DA_GIAO', 'DA_HUY'].includes(selectedOrder.order_status) && (
                  <button
                    onClick={() => promptCancelOrder(selectedOrder)}
                    className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-xs font-bold cursor-pointer transition"
                  >
                    Hủy đơn
                  </button>
                )}
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Đóng cửa sổ
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
