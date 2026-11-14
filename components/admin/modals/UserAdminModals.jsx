'use client';

import React from 'react';
import { ShieldCheck, Edit3, KeyRound, RefreshCw, X, Check } from 'lucide-react';

export default function UserAdminModals({
  showAddAdminModal,
  setShowAddAdminModal,
  handleCreateAdmin,
  newAdmin,
  setNewAdmin,
  branches,
  editAdminModal,
  setEditAdminModal,
  handleUpdateAdminSubmit,
  resetPasswordModal,
  setResetPasswordModal,
  handleResetPasswordSubmit,
  permissionModal,
  setPermissionModal,
  handleSelectAllPermissions,
  handleDeselectAllPermissions,
  SRS_FUNCTIONAL_MODULES,
  handleSavePermissionsSubmit,
  toggleModulePermissions
}) {
  return (
    <>
      {showAddAdminModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-heading font-black text-lg text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span>Thêm Admin Chi Nhánh</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Chỉ Admin Tổng có quyền tạo tài khoản quản trị</p>
              </div>
              <button onClick={() => setShowAddAdminModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleCreateAdmin} noValidate className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Họ và tên *</label>
                <input
                  type="text" required placeholder="Nguyễn Văn A"
                  value={newAdmin.full_name} onChange={(e) => setNewAdmin({ ...newAdmin, full_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Số điện thoại đăng nhập *</label>
                <input
                  type="tel" required placeholder="09xxxxxxxx (duy nhất)"
                  value={newAdmin.phone} onChange={(e) => setNewAdmin({ ...newAdmin, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <p className="text-[10px] text-slate-400 mt-1">Số điện thoại đăng nhập phải là duy nhất</p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mật khẩu khởi tạo *</label>
                <input
                  type="password" required placeholder="Tối thiểu 8 ký tự, gồm hoa, thường và số"
                  value={newAdmin.password} onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Chi nhánh phân công phụ trách *</label>
                <select
                  value={newAdmin.branch_id || ''}
                  onChange={(e) => setNewAdmin({ ...newAdmin, branch_id: e.target.value ? parseInt(e.target.value, 10) : '' })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">-- Không phân công / Chưa có chi nhánh --</option>
                  {branches.map(b => (
                    <option key={b.id} value={b.id}>{b.branch_name} - {b.phone}</option>
                  ))}
                </select>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="text-[10px] font-bold text-slate-500 uppercase">Cấp bậc vai trò</div>
                <div className="text-xs font-black text-slate-800 flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>Admin Chi nhánh</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1 leading-tight">
                  * Hệ thống chỉ có 1 Admin Tổng duy nhất. Admin Tổng tạo và phân quyền cho Quản trị viên Chi nhánh.
                </p>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddAdminModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-600 cursor-pointer transition"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold cursor-pointer transition shadow-md shadow-brand-600/20"
                >
                  Lưu Admin Chi Nhánh
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CHỈNH SỬA THÔNG TIN ADMIN */}
      {editAdminModal.isOpen && editAdminModal.admin && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-heading font-black text-lg text-slate-900 flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-blue-600" />
                  <span>Chỉnh Sửa Thông Tin Admin</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Cập nhật tài khoản #{editAdminModal.admin.id} ({editAdminModal.admin.full_name})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditAdminModal({ isOpen: false, admin: null, full_name: '', phone: '', branch_id: 1 })}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center transition cursor-pointer text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateAdminSubmit} noValidate className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Họ và tên *</label>
                <input
                  type="text"
                  required
                  placeholder="Họ và tên quản trị viên"
                  value={editAdminModal.full_name}
                  onChange={(e) => setEditAdminModal({ ...editAdminModal, full_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Số điện thoại đăng nhập *</label>
                <input
                  type="tel"
                  required
                  placeholder="09xxxxxxxx"
                  value={editAdminModal.phone}
                  onChange={(e) => setEditAdminModal({ ...editAdminModal, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-[10px] text-slate-400 mt-1">Đảm bảo số điện thoại duy nhất trong hệ thống</p>
              </div>

              {editAdminModal.admin.id !== 1 && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Chi nhánh phân công phụ trách *</label>
                  <select
                    value={editAdminModal.branch_id || ''}
                    onChange={(e) => setEditAdminModal({ ...editAdminModal, branch_id: e.target.value ? parseInt(e.target.value, 10) : '' })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Không phân công / Chưa có chi nhánh --</option>
                    {branches.map(b => (
                      <option key={b.id} value={b.id}>{b.branch_name} - {b.phone}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="text-[10px] font-bold text-slate-500 uppercase">Cấp bậc vai trò</div>
                <div className="text-xs font-black text-slate-800 flex items-center gap-1.5 mt-0.5">
                  <span className={`w-2 h-2 rounded-full ${editAdminModal.admin.role_id === 1 ? 'bg-purple-600' : 'bg-blue-600'}`}></span>
                  <span>{editAdminModal.admin.role_name || (editAdminModal.admin.role_id === 1 ? 'Admin Tổng' : 'Admin Chi nhánh')}</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditAdminModal({ isOpen: false, admin: null, full_name: '', phone: '', branch_id: 1 })}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-600 cursor-pointer transition"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold cursor-pointer transition shadow-md shadow-blue-600/20"
                >
                  Lưu thông tin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL ĐẶT LẠI MẬT KHẨU ADMIN */}
      {resetPasswordModal.isOpen && resetPasswordModal.admin && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-heading font-black text-lg text-slate-900 flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-purple-600" />
                  <span>Đặt Lại Mật Khẩu Admin</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Admin Tổng cấp phát mật khẩu mới cho tài khoản #{resetPasswordModal.admin.id}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setResetPasswordModal({ isOpen: false, admin: null, password: '', confirm_password: '' })}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center transition cursor-pointer text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Target Admin Card */}
            <div className="bg-purple-50/70 border border-purple-200/80 rounded-2xl p-3.5 flex items-center justify-between">
              <div>
                <div className="font-heading font-black text-sm text-purple-950">
                  {resetPasswordModal.admin.full_name}
                </div>
                <div className="text-[11px] text-purple-800 font-medium mt-0.5">
                  Số điện thoại: {resetPasswordModal.admin.phone}
                </div>
              </div>
              <span className="text-[10px] font-black uppercase px-2.5 py-1 bg-purple-200 text-purple-900 rounded-full">
                {resetPasswordModal.admin.role_name || 'Admin Chi nhánh'}
              </span>
            </div>

            <form onSubmit={handleResetPasswordSubmit} noValidate className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Mật khẩu mới *</label>
                <input
                  type="text"
                  required
                  placeholder="Tối thiểu 8 ký tự, gồm hoa, thường và số"
                  value={resetPasswordModal.password}
                  onChange={(e) => setResetPasswordModal({ ...resetPasswordModal, password: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Xác nhận mật khẩu mới *</label>
                <input
                  type="text"
                  required
                  placeholder="Nhập lại mật khẩu mới"
                  value={resetPasswordModal.confirm_password}
                  onChange={(e) => setResetPasswordModal({ ...resetPasswordModal, confirm_password: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                {resetPasswordModal.password && resetPasswordModal.confirm_password && resetPasswordModal.password !== resetPasswordModal.confirm_password && (
                  <p className="text-[11px] text-rose-500 font-bold mt-1">Mật khẩu xác nhận không khớp!</p>
                )}
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setResetPasswordModal({ isOpen: false, admin: null, password: '', confirm_password: '' })}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-600 cursor-pointer transition"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold cursor-pointer transition shadow-md shadow-purple-600/20"
                >
                  Lưu mật khẩu mới
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL PHÂN QUYỀN CHỨC NĂNG CHO ADMIN CHI NHÁNH */}
      {permissionModal.isOpen && permissionModal.admin && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 border border-teal-100 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-black text-lg text-slate-900 leading-tight">
                    Phân quyền chức năng
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Chỉ định các quyền hạn và tính năng được phép truy cập cho tài khoản chi nhánh
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPermissionModal({ isOpen: false, admin: null, selectedIds: [], loading: false, saving: false })}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center transition cursor-pointer text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Admin Info Banner */}
            <div className="bg-teal-50/70 border border-teal-200/80 rounded-2xl p-3.5 flex items-center justify-between shrink-0">
              <div>
                <div className="font-heading font-black text-sm text-teal-950">
                  {permissionModal.admin.full_name}
                </div>
                <div className="text-[11px] text-teal-800 font-medium mt-0.5">
                  Số điện thoại: {permissionModal.admin.phone} • {permissionModal.admin.branch_name || 'Chi nhánh'}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSelectAllPermissions}
                  className="text-[11px] font-bold text-teal-700 hover:text-teal-800 bg-teal-100 hover:bg-teal-200 px-3 py-1.5 rounded-xl transition cursor-pointer"
                >
                  Chọn tất cả
                </button>
                <button
                  type="button"
                  onClick={handleDeselectAllPermissions}
                  className="text-[11px] font-bold text-slate-600 hover:text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl transition cursor-pointer"
                >
                  Bỏ chọn tất cả
                </button>
              </div>
            </div>

            {/* Permissions List (10 modules from SRS) */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 scrollbar-thin scrollbar-thumb-slate-200">
              {permissionModal.loading ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-teal-600" />
                  Đang tải dữ liệu phân quyền...
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {SRS_FUNCTIONAL_MODULES.map((mod, idx) => {
                    const isChecked = mod.permissionIds.every((id) => permissionModal.selectedIds.includes(id));
                    const isPartiallyChecked = !isChecked && mod.permissionIds.some((id) => permissionModal.selectedIds.includes(id));
                    return (
                      <div
                        key={mod.id}
                        onClick={() => toggleModulePermissions(mod)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 select-none ${isChecked
                            ? 'bg-teal-50/60 border-teal-300 shadow-sm shadow-teal-500/5'
                            : isPartiallyChecked
                              ? 'bg-amber-50/40 border-amber-200'
                              : 'bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/50'
                          }`}
                      >
                        <div className="pt-0.5 shrink-0">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => { }}
                            className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300 cursor-pointer"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-extrabold text-teal-700 bg-teal-100/80 px-1.5 py-0.5 rounded-md">
                              {idx + 1}
                            </span>
                            <h4 className="font-heading font-black text-xs text-slate-900 leading-tight">
                              {mod.title}
                            </h4>
                          </div>
                          <p className="text-[11px] text-slate-500 leading-snug mt-1">
                            {mod.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="pt-3 flex items-center justify-between border-t border-slate-100 shrink-0">
              <div className="text-xs font-bold text-slate-500">
                Đã chọn: <span className="text-teal-700 font-black">{SRS_FUNCTIONAL_MODULES.filter(m => m.permissionIds.every(id => permissionModal.selectedIds.includes(id))).length} / {SRS_FUNCTIONAL_MODULES.length}</span> nhóm chức năng
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPermissionModal({ isOpen: false, admin: null, selectedIds: [], loading: false, saving: false })}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-xs text-slate-600 cursor-pointer transition"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  disabled={permissionModal.saving}
                  onClick={handleSavePermissionsSubmit}
                  className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl font-black text-xs cursor-pointer transition shadow-md shadow-teal-600/20 flex items-center gap-2"
                >
                  {permissionModal.saving && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>Lưu phân quyền</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </>
  );
}
