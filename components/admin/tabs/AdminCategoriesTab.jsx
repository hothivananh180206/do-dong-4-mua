'use client';

import React from 'react';
import { Tag, Plus, CheckCircle2, Lock, Edit3, EyeOff, Eye, Trash2 } from 'lucide-react';

export default function AdminCategoriesTab({
  categories,
  onOpenAddCategoryModal,
  onOpenEditCategoryModal,
  onToggleCategoryStatus,
  onDeleteCategory,
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden space-y-5 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h2 className="font-heading font-black text-lg text-slate-900 flex items-center gap-2">
            <Tag className="w-5 h-5 text-emerald-600" />
            <span>Quản Lý Danh Mục Sản Phẩm</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Phân loại trái cây theo mùa vụ, nhập khẩu, giỏ quà và combo gia đình
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenAddCategoryModal}
          className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-brand-600/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Danh Mục</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs min-w-[750px]">
          <thead>
            <tr className="bg-slate-50 text-slate-500 font-extrabold uppercase tracking-wider border-b border-slate-200">
              <th className="py-3 px-4 whitespace-nowrap">Mã</th>
              <th className="py-3 px-4 whitespace-nowrap">Tên danh mục</th>
              <th className="py-3 px-4">Mô tả</th>
              <th className="py-3 px-4 whitespace-nowrap">Số mặt hàng</th>
              <th className="py-3 px-4 whitespace-nowrap">Trạng thái</th>
              <th className="py-3 px-4 text-right whitespace-nowrap">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {categories.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50/80 transition">
                <td className="py-3 px-4 font-mono font-bold text-slate-400 whitespace-nowrap">#{c.id}</td>
                <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">{c.name}</td>
                <td className="py-3 px-4 text-slate-600 max-w-xs truncate">{c.description || '-'}</td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <span className="font-bold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-lg border border-brand-100">
                    {c.product_count || 0} sản phẩm
                  </span>
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-black inline-flex items-center gap-1 ${
                      c.status === 1
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {c.status === 1 ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Đang hiển thị</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3 h-3" />
                        <span>Đã ẩn</span>
                      </>
                    )}
                  </span>
                </td>
                <td className="py-3 px-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1.5">
                    {/* Chỉnh sửa danh mục */}
                    <button
                      type="button"
                      onClick={() => onOpenEditCategoryModal(c)}
                      title="Chỉnh sửa thông tin danh mục"
                      className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition cursor-pointer flex items-center gap-1.5"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span className="text-[11px] font-bold">Chỉnh sửa</span>
                    </button>

                    {/* Ẩn / Hiển thị danh mục */}
                    <button
                      type="button"
                      onClick={() => onToggleCategoryStatus(c)}
                      title={c.status === 1 ? 'Ẩn danh mục khỏi cửa hàng' : 'Hiển thị lại danh mục'}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                        c.status === 1
                          ? 'bg-amber-50 hover:bg-amber-100 text-amber-700'
                          : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {c.status === 1 ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span className="text-[11px] font-bold">{c.status === 1 ? 'Ẩn' : 'Hiển thị'}</span>
                    </button>

                    {/* Xóa danh mục */}
                    <button
                      type="button"
                      onClick={() => onDeleteCategory(c)}
                      title={c.product_count > 0 ? 'Danh mục có sản phẩm chỉ được phép ẩn' : 'Xóa danh mục trống'}
                      className={`p-1.5 rounded-lg transition cursor-pointer ${
                        c.product_count > 0
                          ? 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                          : 'bg-red-50 hover:bg-red-100 text-red-600'
                      }`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

