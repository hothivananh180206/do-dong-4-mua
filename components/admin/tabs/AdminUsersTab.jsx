'use client';

import React from 'react';
import { ShieldCheck, Plus, Lock, CheckCircle2, Edit3, KeyRound, Unlock, Trash2 } from 'lucide-react';

export default function AdminUsersTab({
  adminUsers,
  onOpenAddAdminModal,
  onOpenEditAdminModal,
  onOpenResetPasswordModal,
  onOpenAssignPermissionsModal,
  onLockUser,
  onUnlockUser,
  onDeleteUser,
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden space-y-5 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h2 className="font-heading font-black text-lg text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>Quản Lý Tài Khoản Quản Trị</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Chỉ Admin Tổng có quyền tạo tài khoản Admin Chi nhánh, phân quyền chi nhánh và khóa/mở khóa tài khoản.
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenAddAdminModal}
          className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-brand-600/20 cursor-pointer shrink-0 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Admin Chi nhánh</span>
        </button>
      </div>

      {/* Quick Info Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div className="text-[11px] font-bold text-slate-500 uppercase">Tổng Tài Khoản</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{adminUsers.length}</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
          <div className="text-[11px] font-bold text-purple-700 uppercase">Admin Tổng</div>
          <div className="text-2xl font-black text-purple-900 mt-1">
            {adminUsers.filter((u) => u.role_id === 1).length}
          </div>
        </div>
        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
          <div className="text-[11px] font-bold text-emerald-700 uppercase">Admin Chi nhánh</div>
          <div className="text-2xl font-black text-emerald-900 mt-1">
            {adminUsers.filter((u) => u.role_id === 2).length}
          </div>
        </div>
        <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
          <div className="text-[11px] font-bold text-amber-700 uppercase">Đang Hoạt Động</div>
          <div className="text-2xl font-black text-amber-900 mt-1">
            {adminUsers.filter((u) => u.status === 1).length} / {adminUsers.length}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-500 font-extrabold uppercase tracking-wider border-b border-slate-200">
              <th className="py-3 px-4">Mã</th>
              <th className="py-3 px-4">Họ và tên</th>
              <th className="py-3 px-4">Số điện thoại</th>
              <th className="py-3 px-4">Vai trò</th>
              <th className="py-3 px-4">Chi nhánh</th>
              <th className="py-3 px-4">Trạng thái</th>
              <th className="py-3 px-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {adminUsers.map((u) => {
              const isSuperAdmin = u.role_id === 1 || u.id === 1;
              const isLocked = u.status === 0;

              return (
                <tr key={u.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-4 font-mono font-bold text-slate-400">#{u.id}</td>
                  <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                    <span>{u.full_name}</span>
                    {isSuperAdmin && (
                      <span className="bg-purple-100 text-purple-700 text-[10px] font-black px-2 py-0.5 rounded-full">
                        Gốc
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-brand-700">{u.phone}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-black inline-flex items-center gap-1 ${
                        isSuperAdmin
                          ? 'bg-purple-100 text-purple-800 border border-purple-200'
                          : 'bg-blue-100 text-blue-800 border border-blue-200'
                      }`}
                    >
                      {u.role_name || (isSuperAdmin ? 'Admin Tổng' : 'Admin Chi nhánh')}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-medium">
                    {u.branch_name || (isSuperAdmin ? 'Toàn hệ thống' : 'Chưa phân công')}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-black inline-flex items-center gap-1 ${
                        isLocked
                          ? 'bg-red-100 text-red-700 border border-red-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {isLocked ? (
                        <>
                          <Lock className="w-3 h-3" />
                          <span>Đã khóa</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Hoạt động</span>
                        </>
                      )}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Chỉnh sửa thông tin Admin */}
                      <button
                        type="button"
                        onClick={() => onOpenEditAdminModal(u)}
                        title="Chỉnh sửa thông tin quản trị viên"
                        className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition cursor-pointer flex items-center gap-1.5"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-bold">Chỉnh sửa</span>
                      </button>

                      {/* Đặt lại mật khẩu Admin */}
                      <button
                        type="button"
                        onClick={() => onOpenResetPasswordModal(u)}
                        title="Đặt lại mật khẩu quản trị viên"
                        className="px-2.5 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-600 transition cursor-pointer flex items-center gap-1.5"
                      >
                        <KeyRound className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-bold">Đặt lại mật khẩu</span>
                      </button>

                      {u.id === 1 ? (
                        <span className="text-[10px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-1 rounded-lg">
                          Tài khoản gốc
                        </span>
                      ) : (
                        <>
                          {/* Phân quyền chức năng cho Admin Chi nhánh */}
                          <button
                            type="button"
                            onClick={() => onOpenAssignPermissionsModal(u)}
                            title="Phân quyền chức năng cho Admin Chi nhánh"
                            className="px-2.5 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-700 transition cursor-pointer flex items-center gap-1.5"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span className="text-[11px] font-bold">Phân quyền</span>
                          </button>

                          {/* Khóa / Mở khóa tài khoản */}
                          <button
                            type="button"
                            onClick={() => (isLocked ? onUnlockUser(u) : onLockUser(u))}
                            title={isLocked ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                              isLocked
                                ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
                                : 'bg-amber-100 hover:bg-amber-200 text-amber-800'
                            }`}
                          >
                            {isLocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                            <span className="text-[11px] font-bold">
                              {isLocked ? 'Mở khóa' : 'Khóa tài khoản'}
                            </span>
                          </button>

                          {/* Xóa tài khoản */}
                          <button
                            type="button"
                            onClick={() => onDeleteUser(u)}
                            title="Xóa tài khoản vĩnh viễn"
                            className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

