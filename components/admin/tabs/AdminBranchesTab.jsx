'use client';

import React from 'react';
import { MapPin, Plus, Search, X, RotateCcw, Users, Edit3, Lock, Unlock, Trash2 } from 'lucide-react';

export default function AdminBranchesTab({
  branches,
  filteredBranches,
  branchSearch,
  setBranchSearch,
  branchStatusFilter,
  setBranchStatusFilter,
  onOpenAddBranchModal,
  onEditBranch,
  onToggleStatusBranch,
  onDeleteBranch,
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden space-y-5 p-6">
      {/* Header & Thêm mới */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h2 className="font-heading font-black text-lg text-slate-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-600" />
            <span>Quản Lý Chi Nhánh Cửa Hàng</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Mạng lưới điểm bán, điểm lấy hàng và tiếp nhận xử lý đơn hàng
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenAddBranchModal}
          className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-brand-600/20 cursor-pointer transition"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Chi Nhánh</span>
        </button>
      </div>

      {/* Thống kê nhanh Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 bg-slate-50 border border-slate-200/70 rounded-xl">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Tổng số chi nhánh</div>
          <div className="text-xl font-black text-slate-900 mt-0.5">{branches.length} điểm bán</div>
        </div>
        <div className="p-3.5 bg-emerald-50/60 border border-emerald-200/60 rounded-xl">
          <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Đang hoạt động</div>
          <div className="text-xl font-black text-emerald-800 mt-0.5">
            {branches.filter((b) => b.status === 1).length} điểm bán
          </div>
        </div>
        <div className="p-3.5 bg-amber-50/60 border border-amber-200/60 rounded-xl">
          <div className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">Ngừng hoạt động</div>
          <div className="text-xl font-black text-amber-800 mt-0.5">
            {branches.filter((b) => b.status === 0).length} điểm bán
          </div>
        </div>
      </div>

      {/* Toolbar tìm kiếm & lọc */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm chi nhánh theo tên, số điện thoại, địa chỉ..."
            value={branchSearch}
            onChange={(e) => setBranchSearch(e.target.value)}
            className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          />
          {branchSearch && (
            <button
              type="button"
              onClick={() => setBranchSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <div className="w-full sm:w-52">
          <select
            value={branchStatusFilter}
            onChange={(e) => setBranchStatusFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white focus:outline-none focus:border-brand-500"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="ACTIVE">Đang hoạt động</option>
            <option value="INACTIVE">Ngừng hoạt động</option>
          </select>
        </div>
        {(branchSearch || branchStatusFilter !== '') && (
          <button
            type="button"
            onClick={() => {
              setBranchSearch('');
              setBranchStatusFilter('');
            }}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Đặt lại</span>
          </button>
        )}
      </div>

      {/* Bảng danh sách chi nhánh */}
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-500 font-extrabold uppercase tracking-wider border-b border-slate-200">
              <th className="py-3 px-4">Mã</th>
              <th className="py-3 px-4">Tên chi nhánh</th>
              <th className="py-3 px-4">Điện thoại</th>
              <th className="py-3 px-4">Địa chỉ</th>
              <th className="py-3 px-4">Nhân sự</th>
              <th className="py-3 px-4">Trạng thái</th>
              <th className="py-3 px-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredBranches.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-12 text-center text-slate-400">
                  Không tìm thấy chi nhánh phù hợp với điều kiện tìm kiếm.
                </td>
              </tr>
            ) : (
              filteredBranches.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-4 font-mono font-bold text-slate-400">#{b.id}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">
                    <div className="flex items-center gap-1.5">
                      <span>{b.branch_name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-bold text-brand-700 font-mono">{b.phone}</td>
                  <td className="py-3 px-4 text-slate-600 max-w-xs truncate" title={b.address}>
                    {b.address}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700">
                      <Users className="w-3 h-3 text-slate-500" />
                      <span>{b.staff_count || 0} tài khoản</span>
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        b.status === 1
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-rose-100 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {b.status === 1 ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Sửa chi nhánh */}
                      <button
                        type="button"
                        onClick={() => onEditBranch(b)}
                        title="Chỉnh sửa chi nhánh"
                        className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      {/* Khóa / Mở chi nhánh */}
                      <button
                        type="button"
                        onClick={() => onToggleStatusBranch(b)}
                        title={b.status === 1 ? 'Tạm ngưng chi nhánh' : 'Mở lại chi nhánh'}
                        className={`p-1.5 rounded-lg transition cursor-pointer ${
                          b.status === 1
                            ? 'bg-amber-50 hover:bg-amber-100 text-amber-700'
                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {b.status === 1 ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                      </button>

                      {/* Xóa chi nhánh */}
                      <button
                        type="button"
                        onClick={() => onDeleteBranch(b)}
                        title="Xóa chi nhánh"
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

