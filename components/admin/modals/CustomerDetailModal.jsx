'use client';

import React from 'react';
import { User, X, Phone, Mail, MapPin, Calendar, ShoppingBag, Clock, Lock, Unlock } from 'lucide-react';
import { formatDateTime } from '@/lib/date';

export default function CustomerDetailModal({
  selectedCustomerDetail,
  setSelectedCustomerDetail,
  loadingCustomerDetail,
  openLockModal,
  openUnlockModal
}) {
  return (
    <>
      {selectedCustomerDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200 relative max-h-[90vh] flex flex-col">
            <button
              type="button"
              onClick={() => setSelectedCustomerDetail(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center transition cursor-pointer text-sm font-bold"
            >
              ✕
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100 shrink-0">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-700 border border-brand-100 flex items-center justify-center font-bold text-lg">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <span>{selectedCustomerDetail.full_name}</span>
                  <span className="font-mono text-xs font-bold text-slate-400">#{selectedCustomerDetail.id}</span>
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                  <span className="font-mono">{selectedCustomerDetail.phone}</span>
                  <span>•</span>
                  <span>{selectedCustomerDetail.address || 'Chưa cập nhật địa chỉ'}</span>
                  <span>•</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    selectedCustomerDetail.status === 1 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedCustomerDetail.status === 1 ? 'Hoạt động' : 'Đã khóa'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3 py-4 shrink-0">
              <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/70">
                <div className="text-[10px] uppercase font-bold text-slate-400">Tổng số đơn hàng</div>
                <div className="text-xl font-black text-slate-900 mt-0.5">{selectedCustomerDetail.total_orders || 0} đơn</div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/70">
                <div className="text-[10px] uppercase font-bold text-slate-400">Tổng chi tiêu tích lũy</div>
                <div className="text-xl font-black text-brand-700 mt-0.5">
                  {parseFloat(selectedCustomerDetail.total_spent || 0).toLocaleString('vi-VN')} đ
                </div>
              </div>
            </div>

            {/* Order History */}
            <div className="flex-1 overflow-y-auto space-y-3 min-h-0">
              <div className="text-xs font-black text-slate-800 uppercase tracking-wider">
                Lịch sử đơn hàng ({selectedCustomerDetail.orders ? selectedCustomerDetail.orders.length : 0})
              </div>

              {loadingCustomerDetail ? (
                <div className="text-center py-10 text-xs text-slate-400">Đang tải lịch sử mua hàng...</div>
              ) : !selectedCustomerDetail.orders || selectedCustomerDetail.orders.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  Khách hàng chưa có đơn hàng nào
                </div>
              ) : (
                <div className="border border-slate-200/80 rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 font-extrabold uppercase tracking-wider border-b border-slate-200">
                        <th className="py-2.5 px-3">Mã đơn</th>
                        <th className="py-2.5 px-3">Thời gian</th>
                        <th className="py-2.5 px-3">Thanh toán</th>
                        <th className="py-2.5 px-3">Trạng thái</th>
                        <th className="py-2.5 px-3 text-right">Tổng tiền</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedCustomerDetail.orders.map((o) => (
                        <tr key={o.id} className="hover:bg-slate-50/70 transition">
                          <td className="py-2.5 px-3 font-mono font-bold text-brand-700">#{o.order_code}</td>
                          <td className="py-2.5 px-3 text-slate-600 font-mono text-[11px]">
                            {formatDateTime(o.created_at)}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="text-[11px] font-bold text-slate-700">{o.payment_method || 'COD'}</span>
                          </td>
                          <td className="py-2.5 px-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              o.order_status === 'DA_GIAO' ? 'bg-emerald-100 text-emerald-800' :
                              o.order_status === 'DANG_GIAO' ? 'bg-teal-100 text-teal-800' :
                              o.order_status === 'DANG_CHUAN_BI' ? 'bg-blue-100 text-blue-800' :
                              o.order_status === 'TAM_DUNG' ? 'bg-yellow-100 text-yellow-800' :
                              o.order_status === 'DA_XAC_NHAN' ? 'bg-purple-100 text-purple-800' :
                              o.order_status === 'CHO_THANH_TOAN' ? 'bg-amber-100 text-amber-900' :
                              o.order_status === 'DA_HUY' ? 'bg-red-100 text-red-800' :
                              'bg-slate-100 text-slate-700'
                            }`}>
                              {
                                o.order_status === 'CHO_THANH_TOAN' ? 'Chờ thanh toán' :
                                o.order_status === 'CHO_XAC_NHAN' ? 'Chờ xác nhận' :
                                o.order_status === 'DA_XAC_NHAN' ? 'Đã xác nhận' :
                                o.order_status === 'DANG_CHUAN_BI' ? 'Đang chuẩn bị' :
                                o.order_status === 'TAM_DUNG' ? 'Tạm dừng' :
                                o.order_status === 'DANG_GIAO' ? 'Đang giao' :
                                o.order_status === 'DA_GIAO' ? 'Đã giao' :
                                o.order_status === 'DA_HUY' ? 'Đã hủy' : o.order_status
                              }
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-bold text-slate-900 text-right">
                            {parseFloat(o.total_amount).toLocaleString('vi-VN')} đ
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-between items-center pt-4 border-t border-slate-100 shrink-0 mt-3">
              <div>
                {selectedCustomerDetail.status === 1 ? (
                  <button
                    type="button"
                    onClick={() => {
                      const cu = selectedCustomerDetail;
                      setSelectedCustomerDetail(null);
                      openLockModal(cu);
                    }}
                    className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Lock className="w-3.5 h-3.5" /> Khóa tài khoản này
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      const cu = selectedCustomerDetail;
                      setSelectedCustomerDetail(null);
                      openUnlockModal(cu);
                    }}
                    className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Unlock className="w-3.5 h-3.5" /> Mở khóa tài khoản
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={() => setSelectedCustomerDetail(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
