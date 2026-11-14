'use client';

import React from 'react';
import { Percent, Edit3, Tag, AlertTriangle, Plus, RefreshCw, Package, Trash2 } from 'lucide-react';
import { formatDate } from '@/lib/date';

export default function PromotionModals({
  showAddPromotionModal,
  setShowAddPromotionModal,
  handleCreatePromotion,
  newPromotion,
  setNewPromotion,
  editPromotionModal,
  setEditPromotionModal,
  handleUpdatePromotion,
  assignProductsModal,
  setAssignProductsModal,
  handleAddProductToPromotion,
  products,
  handleRemoveProductFromPromotion
}) {
  return (
    <>
      {showAddPromotionModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-heading font-black text-lg text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
              <Percent className="w-5 h-5 text-emerald-600" />
              <span>Thêm Chương Trình Khuyến Mãi</span>
            </h3>
            <form onSubmit={handleCreatePromotion} noValidate className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tên chương trình khuyến mãi *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Siêu Sale Trái Cây Mùa Hè"
                  value={newPromotion.title}
                  onChange={(e) => setNewPromotion({ ...newPromotion, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mức giảm giá (%) * (từ 1% đến 100%)</label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    min="1"
                    max="100"
                    placeholder="10"
                    value={newPromotion.discount_percent}
                    onChange={(e) => setNewPromotion({ ...newPromotion, discount_percent: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold text-rose-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 font-black text-slate-400">%</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Ngày bắt đầu *</label>
                  <input
                    type="date"
                    required
                    value={newPromotion.start_date}
                    onChange={(e) => setNewPromotion({ ...newPromotion, start_date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Ngày kết thúc *</label>
                  <input
                    type="date"
                    required
                    value={newPromotion.end_date}
                    onChange={(e) => setNewPromotion({ ...newPromotion, end_date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mô tả chương trình</label>
                <textarea
                  rows={2}
                  placeholder="Mô tả tóm tắt nội dung ưu đãi..."
                  value={newPromotion.description}
                  onChange={(e) => setNewPromotion({ ...newPromotion, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddPromotionModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-600 cursor-pointer transition"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold cursor-pointer transition shadow-md shadow-brand-600/20"
                >
                  Tạo Khuyến Mãi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3B: EDIT PROMOTION */}
      {editPromotionModal.isOpen && editPromotionModal.promotion && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-heading font-black text-lg text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-emerald-600" />
              <span>Chỉnh Sửa Chương Trình Khuyến Mãi</span>
            </h3>
            <form onSubmit={handleUpdatePromotion} noValidate className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tên chương trình *</label>
                <input
                  type="text"
                  required
                  value={editPromotionModal.title}
                  onChange={(e) => setEditPromotionModal({ ...editPromotionModal, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mức giảm (%) *</label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min="1"
                      max="100"
                      value={editPromotionModal.discount_percent}
                      onChange={(e) => setEditPromotionModal({ ...editPromotionModal, discount_percent: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold text-rose-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 font-black text-slate-400">%</span>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Trạng thái</label>
                  <select
                    value={editPromotionModal.status}
                    onChange={(e) => setEditPromotionModal({ ...editPromotionModal, status: parseInt(e.target.value, 10) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value={1}>Đang áp dụng</option>
                    <option value={0}>Tạm dừng</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Ngày bắt đầu *</label>
                  <input
                    type="date"
                    required
                    value={editPromotionModal.start_date}
                    onChange={(e) => setEditPromotionModal({ ...editPromotionModal, start_date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Ngày kết thúc *</label>
                  <input
                    type="date"
                    required
                    value={editPromotionModal.end_date}
                    onChange={(e) => setEditPromotionModal({ ...editPromotionModal, end_date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mô tả</label>
                <textarea
                  rows={2}
                  value={editPromotionModal.description}
                  onChange={(e) => setEditPromotionModal({ ...editPromotionModal, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <p className="text-[11px] text-slate-400 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                Lưu ý: Thay đổi mức giảm % hoặc trạng thái sẽ tự động đồng bộ lại giá khuyến mãi cho tất cả sản phẩm đang liên kết.
              </p>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditPromotionModal({ isOpen: false, promotion: null, title: '', description: '', discount_percent: 10, start_date: '', end_date: '', status: 1 })}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-600 cursor-pointer transition"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold cursor-pointer transition shadow-md shadow-brand-600/20"
                >
                  Lưu Thay Đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3C: ASSIGN PRODUCTS TO PROMOTION */}
      {assignProductsModal.isOpen && assignProductsModal.promotion && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
              <div>
                <h3 className="font-heading font-black text-lg text-slate-900 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-emerald-600" />
                  <span>Sản Phẩm Áp Dụng: {assignProductsModal.promotion.title}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Mức giảm: <strong className="text-rose-600 font-black">-{parseFloat(assignProductsModal.promotion.discount_percent)}%</strong> | Thời gian: {formatDate(assignProductsModal.promotion.start_date)} → {formatDate(assignProductsModal.promotion.end_date)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAssignProductsModal({ isOpen: false, promotion: null, assignedProducts: [], selectedProductId: '', loading: false, conflictError: '' })}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Conflict Alert Banner */}
            {assignProductsModal.conflictError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-rose-700 text-xs shrink-0 animate-in fade-in">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="font-medium">{assignProductsModal.conflictError}</div>
              </div>
            )}

            {/* Add Product Form */}
            <form onSubmit={handleAddProductToPromotion} className="flex items-center gap-2 shrink-0">
              <select
                value={assignProductsModal.selectedProductId}
                onChange={(e) => setAssignProductsModal({ ...assignProductsModal, selectedProductId: e.target.value, conflictError: '' })}
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="">-- Chọn sản phẩm muốn áp dụng khuyến mãi --</option>
                {products
                  .filter((p) => !assignProductsModal.assignedProducts.some((ap) => ap.id === p.id))
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      #{p.id} - {p.name} ({new Intl.NumberFormat('vi-VN').format(p.price)}đ / {p.unit})
                    </option>
                  ))}
              </select>
              <button
                type="submit"
                className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 shadow-md shadow-brand-600/20 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm vào KM</span>
              </button>
            </form>

            {/* List / Table of Assigned Products */}
            <div className="flex-1 overflow-y-auto border border-slate-100 rounded-2xl min-h-[180px]">
              {assignProductsModal.loading ? (
                <div className="text-center py-12 text-slate-400 text-xs font-medium flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
                  <span>Đang tải danh sách sản phẩm...</span>
                </div>
              ) : assignProductsModal.assignedProducts.length === 0 ? (
                <div className="text-center py-12 space-y-2">
                  <Package className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs font-bold text-slate-500">Chưa có sản phẩm nào được gán vào khuyến mãi này</p>
                  <p className="text-[11px] text-slate-400">Chọn sản phẩm ở ô bên trên và bấm "Thêm vào KM" để áp dụng mức giảm giá.</p>
                </div>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead className="sticky top-0 bg-slate-50 border-b border-slate-200">
                    <tr className="text-slate-500 font-extrabold uppercase tracking-wider text-[11px]">
                      <th className="py-2.5 px-3">Sản phẩm</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">Giá gốc</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">Giá sau giảm (-{parseFloat(assignProductsModal.promotion.discount_percent)}%)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">Tồn kho</th>
                      <th className="py-2.5 px-3 text-right whitespace-nowrap">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {assignProductsModal.assignedProducts.map((p) => {
                      const calculatedDiscount = Math.round((p.price * (1 - parseFloat(assignProductsModal.promotion.discount_percent) / 100)) / 1000) * 1000;
                      return (
                        <tr key={p.id} className="hover:bg-slate-50/70 transition">
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-2.5">
                              {p.thumbnail ? (
                                <img src={p.thumbnail} alt={p.name} className="w-8 h-8 rounded-lg object-cover border border-slate-200" />
                              ) : (
                                <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center">
                                  <Package className="w-4 h-4 text-slate-400" />
                                </div>
                              )}
                              <div>
                                <div className="font-bold text-slate-900 leading-tight">{p.name}</div>
                                <div className="text-[10px] text-slate-400 font-mono">#{p.id} - {p.category_name || 'Nông sản'}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-slate-400 line-through whitespace-nowrap">
                            {new Intl.NumberFormat('vi-VN').format(p.price)}đ
                          </td>
                          <td className="py-2.5 px-3 font-black text-rose-600 whitespace-nowrap">
                            {new Intl.NumberFormat('vi-VN').format(p.discount_price || calculatedDiscount)}đ
                          </td>
                          <td className="py-2.5 px-3 whitespace-nowrap font-medium text-slate-600">
                            {p.stock} {p.unit}
                          </td>
                          <td className="py-2.5 px-3 text-right whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => handleRemoveProductFromPromotion(p.id, p.name)}
                              className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold transition text-xs cursor-pointer flex items-center gap-1 ml-auto"
                              title="Gỡ khỏi khuyến mãi"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Gỡ bỏ</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-2 flex justify-end shrink-0 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setAssignProductsModal({ isOpen: false, promotion: null, assignedProducts: [], selectedProductId: '', loading: false, conflictError: '' })}
                className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs cursor-pointer transition"
              >
                Đóng lại
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}
