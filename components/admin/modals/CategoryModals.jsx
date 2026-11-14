'use client';

import React from 'react';
import { Tag } from 'lucide-react';

export default function CategoryModals({
  showAddCategoryModal,
  setShowAddCategoryModal,
  handleCreateCategory,
  newCategory,
  setNewCategory,
  editCategoryModal,
  setEditCategoryModal,
  handleUpdateCategory
}) {
  return (
    <>
      {showAddCategoryModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-heading font-black text-lg text-slate-900 border-b border-slate-100 pb-2">Thêm Danh Mục Mới</h3>
            <form onSubmit={handleCreateCategory} noValidate className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tên danh mục *</label>
                <input
                  type="text" required placeholder="Ví dụ: Trái cây sấy dẻo"
                  value={newCategory.name} onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Mô tả</label>
                <textarea
                  rows={2} placeholder="Mô tả danh mục..."
                  value={newCategory.description} onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setShowAddCategoryModal(false)} className="px-3 py-2 bg-slate-100 rounded-xl font-bold text-slate-600 cursor-pointer">Hủy bỏ</button>
                <button type="submit" className="px-4 py-2 bg-brand-600 text-white rounded-xl font-bold cursor-pointer">Thêm Danh Mục</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CHỈNH SỬA DANH MỤC */}
      {editCategoryModal.isOpen && editCategoryModal.category && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-heading font-black text-lg text-slate-900 flex items-center gap-2">
                <Tag className="w-5 h-5 text-emerald-600" />
                <span>Chỉnh sửa danh mục</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditCategoryModal({ isOpen: false, category: null, name: '', description: '' })}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center transition cursor-pointer text-sm font-bold"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleUpdateCategory} noValidate className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tên danh mục *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Trái cây tươi"
                  value={editCategoryModal.name}
                  onChange={(e) => setEditCategoryModal({ ...editCategoryModal, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Mô tả</label>
                <textarea
                  rows={3}
                  placeholder="Mô tả danh mục..."
                  value={editCategoryModal.description}
                  onChange={(e) => setEditCategoryModal({ ...editCategoryModal, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditCategoryModal({ isOpen: false, category: null, name: '', description: '' })}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-600 cursor-pointer transition"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold cursor-pointer transition shadow-md shadow-emerald-600/20"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </>
  );
}
