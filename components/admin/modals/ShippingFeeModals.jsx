'use client';

import React from 'react';
import { Truck, Edit3, Trash2, X } from 'lucide-react';

export default function ShippingFeeModals({
  showAddShippingFeeModal,
  setShowAddShippingFeeModal,
  handleCreateShippingFee,
  newShippingFee,
  setNewShippingFee,
  editingShippingFee,
  setEditingShippingFee,
  handleUpdateShippingFee,
  deletingShippingFee,
  setDeletingShippingFee,
  handleConfirmDeleteShippingFee
}) {
  return (
    <>
      {showAddShippingFeeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-heading font-black text-lg text-slate-900 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-emerald-600" />
                  <span>Thêm Nấc Phí Vận Chuyển</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Thiết lập cước giao hàng GreenSM theo khoảng cách</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddShippingFeeModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center transition cursor-pointer text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateShippingFee} noValidate className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tên gói / nấc cước *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nội thành gần, Ngoại thành xa..."
                  value={newShippingFee.name}
                  onChange={(e) => setNewShippingFee({ ...newShippingFee, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Khoảng cách từ (km) *</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    required
                    placeholder="0"
                    value={newShippingFee.min_km}
                    onChange={(e) => setNewShippingFee({ ...newShippingFee, min_km: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Khoảng cách đến (km) *</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    placeholder="5"
                    value={newShippingFee.max_km}
                    onChange={(e) => setNewShippingFee({ ...newShippingFee, max_km: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mức phí giao hàng (VNĐ) *</label>
                <input
                  type="number"
                  step="1000"
                  min="0"
                  required
                  placeholder="Ví dụ: 15000"
                  value={newShippingFee.fee}
                  onChange={(e) => setNewShippingFee({ ...newShippingFee, fee: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-black text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-sm"
                />
                <p className="text-[10px] text-slate-400 mt-1">Cước phí giao hàng GreenSM áp dụng khi bán kính giao nằm trong khoảng này</p>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddShippingFeeModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-600 transition cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition shadow-md shadow-emerald-600/20 cursor-pointer"
                >
                  Thêm Nấc Phí
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL SỬA NẤC PHÍ VẬN CHUYỂN */}
      {editingShippingFee && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-heading font-black text-lg text-slate-900 flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-blue-600" />
                  <span>Chỉnh Sửa Nấc Phí Vận Chuyển</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Cập nhật cước giao hàng #{editingShippingFee.id}</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingShippingFee(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center transition cursor-pointer text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateShippingFee} noValidate className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tên gói / nấc cước *</label>
                <input
                  type="text"
                  required
                  value={editingShippingFee.name || ''}
                  onChange={(e) => setEditingShippingFee({ ...editingShippingFee, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Khoảng cách từ (km) *</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    required
                    value={editingShippingFee.min_km}
                    onChange={(e) => setEditingShippingFee({ ...editingShippingFee, min_km: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Khoảng cách đến (km) *</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    value={editingShippingFee.max_km}
                    onChange={(e) => setEditingShippingFee({ ...editingShippingFee, max_km: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mức phí giao hàng (VNĐ) *</label>
                  <input
                    type="number"
                    step="1000"
                    min="0"
                    required
                    value={editingShippingFee.fee}
                    onChange={(e) => setEditingShippingFee({ ...editingShippingFee, fee: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-black text-emerald-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Trạng thái áp dụng *</label>
                  <select
                    value={editingShippingFee.status}
                    onChange={(e) => setEditingShippingFee({ ...editingShippingFee, status: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={1}>Đang áp dụng</option>
                    <option value={0}>Tạm dừng áp dụng</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingShippingFee(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-600 transition cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition shadow-md shadow-blue-600/20 cursor-pointer"
                >
                  Lưu Thay Đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL XÓA NẤC PHÍ VẬN CHUYỂN */}
      {deletingShippingFee && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading font-black text-base text-slate-900">Xóa Nấc Phí Vận Chuyển</h3>
                <p className="text-xs text-slate-500">Mã #{deletingShippingFee.id}</p>
              </div>
            </div>

            <div className="bg-rose-50/70 border border-rose-200/80 rounded-2xl p-3.5 text-xs text-rose-950 space-y-1">
              <div className="font-bold">{deletingShippingFee.name}</div>
              <div className="text-slate-600">
                Khoảng cách: <span className="font-mono font-bold text-slate-800">{parseFloat(deletingShippingFee.min_km)} km - {parseFloat(deletingShippingFee.max_km)} km</span>
              </div>
              <div className="text-slate-600">
                Cước phí: <span className="font-bold text-emerald-700">{parseFloat(deletingShippingFee.fee).toLocaleString('vi-VN')} đ</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Bạn có chắc chắn muốn xóa nấc cước vận chuyển này? Hành động này sẽ gỡ bỏ nấc cước khỏi hệ thống tính phí tự động.
            </p>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeletingShippingFee(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-600 transition cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteShippingFee}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold transition shadow-md shadow-rose-600/20 cursor-pointer"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
