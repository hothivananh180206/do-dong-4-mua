'use client';

import React from 'react';
import { Percent, Plus, Search, Calendar, Package, Tag, Edit3, EyeOff, Eye, Trash2 } from 'lucide-react';
import Pagination from '@/components/Pagination';
import { formatDate } from '@/lib/date';

export default function AdminPromotionsTab({
  promotions,
  filteredPromotions,
  paginatedPromotions,
  promotionSearch,
  setPromotionSearch,
  promotionStatusFilter,
  setPromotionStatusFilter,
  promotionPage,
  setPromotionPage,
  promotionPageSize,
  setPromotionPageSize,
  onOpenAddPromotionModal,
  onOpenEditPromotionModal,
  onOpenAssignProductsModal,
  onTogglePromotionStatus,
  onDeletePromotion,
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden space-y-5 p-6">
      {/* Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h2 className="font-heading font-black text-lg text-slate-900 flex items-center gap-2">
            <Percent className="w-5 h-5 text-emerald-600" />
            <span>Quản Lý Chương Trình Khuyến Mãi</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Giảm giá % theo từng thời điểm mùa vụ hoặc sự kiện lễ tết
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenAddPromotionModal}
          className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-brand-600/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Khuyến Mãi</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50/70 p-3 rounded-2xl border border-slate-100">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên chương trình..."
            value={promotionSearch}
            onChange={(e) => setPromotionSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={promotionStatusFilter}
            onChange={(e) => setPromotionStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="1">Đang áp dụng</option>
            <option value="0">Đã dừng</option>
          </select>
        </div>
      </div>

      {/* Table & Empty States */}
      {filteredPromotions.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-accent-500 flex items-center justify-center mx-auto border border-amber-100">
            <Percent className="w-8 h-8" />
          </div>
          <h4 className="font-heading font-black text-slate-900 text-lg">
            {promotionSearch || promotionStatusFilter !== ''
              ? 'Không tìm thấy chương trình khuyến mãi phù hợp'
              : 'Chưa có chương trình khuyến mãi nào'}
          </h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {promotionSearch || promotionStatusFilter !== ''
              ? 'Hãy thử thay đổi từ khóa tìm kiếm hoặc bỏ bộ lọc trạng thái để xem đầy đủ.'
              : 'Tạo chương trình giảm giá đầu tiên để kích cầu mua sắm trái cây mùa vụ!'}
          </p>
          <button
            type="button"
            onClick={onOpenAddPromotionModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold hover:bg-brand-700 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo khuyến mãi mới</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[980px]">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-extrabold uppercase tracking-wider border-b border-slate-200">
                  <th className="py-3 px-4 whitespace-nowrap w-16">#Mã KM</th>
                  <th className="py-3 px-4 min-w-[220px]">Tên chương trình</th>
                  <th className="py-3 px-4 whitespace-nowrap">Mức giảm</th>
                  <th className="py-3 px-4 whitespace-nowrap">Thời gian áp dụng</th>
                  <th className="py-3 px-4 whitespace-nowrap">Sản phẩm áp dụng</th>
                  <th className="py-3 px-4 whitespace-nowrap">Trạng thái</th>
                  <th className="py-3 px-4 text-right whitespace-nowrap">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedPromotions.map((pr) => {
                  const isExpired = pr.end_date && new Date(pr.end_date) < new Date();
                  return (
                    <tr key={pr.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4 font-mono font-bold text-slate-400 whitespace-nowrap">
                        #{pr.id}
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{pr.title}</div>
                        {pr.description && (
                          <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                            {pr.description}
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-full text-xs font-black bg-rose-50 text-rose-600 border border-rose-200">
                          -{parseFloat(pr.discount_percent)}%
                        </span>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{formatDate(pr.start_date)}</span>
                          <span className="text-slate-400">→</span>
                          <span>{formatDate(pr.end_date)}</span>
                        </div>
                        <div className="mt-1">
                          {isExpired ? (
                            <span className="inline-block text-[10px] text-rose-600 font-bold bg-rose-50 border border-rose-100 px-1.5 py-0.5 rounded">
                              Hết hạn
                            </span>
                          ) : (
                            <span className="inline-block text-[10px] text-emerald-600 font-bold bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded">
                              Còn hiệu lực
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => onOpenAssignProductsModal(pr)}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold transition text-xs cursor-pointer border border-blue-200/60"
                          title="Nhấn để xem hoặc gán sản phẩm vào chương trình này"
                        >
                          <Package className="w-3.5 h-3.5 text-blue-600" />
                          <span>{pr.product_count || 0} sản phẩm</span>
                        </button>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            pr.status === 1 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {pr.status === 1 ? 'Đang áp dụng' : 'Đã dừng'}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Gán SP */}
                          <button
                            type="button"
                            onClick={() => onOpenAssignProductsModal(pr)}
                            title="Gán sản phẩm áp dụng"
                            className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition cursor-pointer"
                          >
                            <Tag className="w-3.5 h-3.5" />
                          </button>

                          {/* Chỉnh sửa */}
                          <button
                            type="button"
                            onClick={() => onOpenEditPromotionModal(pr)}
                            title="Chỉnh sửa chương trình"
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* Dừng / Kích hoạt */}
                          <button
                            type="button"
                            onClick={() => onTogglePromotionStatus(pr)}
                            title={pr.status === 1 ? 'Tạm dừng áp dụng khuyến mãi' : 'Kích hoạt lại khuyến mãi'}
                            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                              pr.status === 1
                                ? 'bg-amber-50 hover:bg-amber-100 text-amber-700'
                                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                            }`}
                          >
                            {pr.status === 1 ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            <span className="text-[11px]">{pr.status === 1 ? 'Dừng' : 'Bật'}</span>
                          </button>

                          {/* Xóa */}
                          <button
                            type="button"
                            onClick={() => onDeletePromotion(pr)}
                            title="Xóa vĩnh viễn chương trình"
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Phân trang KhoHang_JAVA */}
          {filteredPromotions.length > 0 && (
            <Pagination
              currentPage={promotionPage}
              totalItems={filteredPromotions.length}
              pageSize={promotionPageSize}
              onPageChange={setPromotionPage}
              onPageSizeChange={(size) => {
                setPromotionPageSize(size);
                setPromotionPage(1);
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}

