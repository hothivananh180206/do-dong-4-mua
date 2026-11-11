'use client';

import React from 'react';
import { Edit3, X, Lock, Unlock, Trash2 } from 'lucide-react';

export default function BranchModals({
  showAddBranchModal,
  setShowAddBranchModal,
  handleCreateBranch,
  newBranch,
  setNewBranch,
  editingBranch,
  setEditingBranch,
  handleUpdateBranch,
  toggleStatusBranch,
  setToggleStatusBranch,
  handleConfirmToggleBranchStatus,
  deletingBranch,
  setDeletingBranch,
  handleConfirmDeleteBranch
}) {
  return (
    <>
      {showAddBranchModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-heading font-black text-lg text-slate-900 border-b border-slate-100 pb-2">Thêm Chi Nhánh Mới</h3>
            <form onSubmit={handleCreateBranch} noValidate className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tên chi nhánh *</label>
                <input
                  type="text" required placeholder="Chi nhánh Bình Thạnh"
                  value={newBranch.branch_name} onChange={(e) => setNewBranch({ ...newBranch, branch_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Số điện thoại *</label>
                <input
                  type="tel" required placeholder="0901234567"
                  value={newBranch.phone} onChange={(e) => setNewBranch({ ...newBranch, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Địa chỉ *</label>
                <input
                  type="text" required placeholder="Số đường, phường, quận..."
                  value={newBranch.address} onChange={(e) => setNewBranch({ ...newBranch, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setShowAddBranchModal(false)} className="px-3 py-2 bg-slate-100 rounded-xl font-bold text-slate-600 cursor-pointer">Hủy bỏ</button>
                <button type="submit" className="px-4 py-2 bg-brand-600 text-white rounded-xl font-bold cursor-pointer">Thêm Chi Nhánh</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDIT BRANCH */}
      {editingBranch && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-heading font-black text-lg text-slate-900 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-blue-600" />
                <span>Chỉnh Sửa Chi Nhánh</span>
              </h3>
              <button
                onClick={() => setEditingBranch(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateBranch} noValidate className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tên chi nhánh *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Chi nhánh Bình Thạnh"
                  value={editingBranch.branch_name}
                  onChange={(e) => setEditingBranch({ ...editingBranch, branch_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Số điện thoại *</label>
                <input
                  type="tel"
                  required
                  placeholder="0901234567"
                  value={editingBranch.phone}
                  onChange={(e) => setEditingBranch({ ...editingBranch, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Địa chỉ *</label>
                <input
                  type="text"
                  required
                  placeholder="Số nhà, đường, phường, quận..."
                  value={editingBranch.address}
                  onChange={(e) => setEditingBranch({ ...editingBranch, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Trạng thái hoạt động</label>
                <select
                  value={editingBranch.status}
                  onChange={(e) => setEditingBranch({ ...editingBranch, status: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium bg-white focus:outline-none focus:border-brand-500"
                >
                  <option value={1}>Đang hoạt động</option>
                  <option value={0}>Ngừng hoạt động</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingBranch(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-600 transition cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold transition shadow-md shadow-brand-600/20 cursor-pointer"
                >
                  Lưu Thay Đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL TOGGLE STATUS BRANCH */}
      {toggleStatusBranch && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                toggleStatusBranch.status === 1 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
              }`}>
                {toggleStatusBranch.status === 1 ? <Lock className="w-6 h-6" /> : <Unlock className="w-6 h-6" />}
              </div>
              <div>
                <h3 className="font-heading font-black text-base text-slate-900">
                  {toggleStatusBranch.status === 1 ? 'Tạm Ngưng Hoạt Động' : 'Mở Lại Hoạt Động'}
                </h3>
                <p className="text-xs text-slate-500">{toggleStatusBranch.branch_name}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {toggleStatusBranch.status === 1 ? (
                <>
                  Bạn có chắc chắn muốn chuyển chi nhánh <strong className="text-slate-900 font-bold">{toggleStatusBranch.branch_name}</strong> sang trạng thái <strong className="text-amber-700">Ngừng hoạt động</strong>? Khi tạm ngưng, khách hàng sẽ không thấy chi nhánh này trên giao diện đặt hàng.
                </>
              ) : (
                <>
                  Bạn có muốn kích hoạt lại chi nhánh <strong className="text-slate-900 font-bold">{toggleStatusBranch.branch_name}</strong> hoạt động bình thường?
                </>
              )}
            </p>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setToggleStatusBranch(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-600 transition cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmToggleBranchStatus}
                className={`px-5 py-2 text-white rounded-xl font-bold transition shadow-md cursor-pointer ${
                  toggleStatusBranch.status === 1
                    ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/20'
                    : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                }`}
              >
                {toggleStatusBranch.status === 1 ? 'Xác nhận ngưng' : 'Kích hoạt lại'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DELETE BRANCH */}
      {deletingBranch && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading font-black text-base text-slate-900">Xóa Chi Nhánh Cửa Hàng</h3>
                <p className="text-xs text-slate-500">{deletingBranch.branch_name}</p>
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800 leading-relaxed">
              <strong>Lưu ý nghiệp vụ:</strong> Hệ thống sẽ từ chối xóa nếu chi nhánh vẫn còn tài khoản nhân viên hoặc quản trị viên trực thuộc. Trong trường hợp đó, vui lòng chuyển chi nhánh sang trạng thái <strong>Ngừng hoạt động</strong>.
            </div>

            <p className="text-xs text-slate-600">
              Bạn có chắc chắn muốn xóa vĩnh viễn chi nhánh <strong className="text-slate-900 font-bold">{deletingBranch.branch_name}</strong> (Mã #{deletingBranch.id})? Hành động này không thể hoàn tác nếu không vi phạm ràng buộc dữ liệu.
            </p>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeletingBranch(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-600 transition cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteBranch}
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
