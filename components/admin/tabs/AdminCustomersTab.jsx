'use client';

import React from 'react';
import { Users, Search, Eye, Lock, Unlock } from 'lucide-react';
import Pagination from '@/components/Pagination';

export default function AdminCustomersTab({
  customers,
  filteredCustomers,
  paginatedCustomers,
  customerSearch,
  setCustomerSearch,
  customerStatusFilter,
  setCustomerStatusFilter,
  customerPage,
  setCustomerPage,
  customerPageSize,
  setCustomerPageSize,
  onViewCustomerDetail,
  onLockCustomer,
  onUnlockCustomer,
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden space-y-5 p-6">
      {/* Header & Quick Stats */}
      <div className="border-b border-slate-100 pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-heading font-black text-lg text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-600" />
            <span>Quản Lý Danh Sách Khách Hàng</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Hồ sơ người mua hàng, lịch sử mua sắm và trạng thái tài khoản
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-bold border border-slate-200/60">
            Tổng: <b className="text-slate-900">{customers.length}</b>
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 font-bold border border-emerald-200/60 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Hoạt động: <b>{customers.filter((c) => c.status === 1).length}</b>
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-red-50 text-red-700 font-bold border border-red-200/60 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            Đã khóa: <b>{customers.filter((c) => c.status === 0).length}</b>
          </span>
        </div>
      </div>

      {/* Thanh tìm kiếm & lọc trạng thái */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm kiếm khách hàng theo họ tên, số điện thoại, địa chỉ..."
            value={customerSearch}
            onChange={(e) => {
              setCustomerSearch(e.target.value);
              setCustomerPage(1);
            }}
            className="w-full text-xs pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent font-sans"
          />
          {customerSearch && (
            <button
              type="button"
              onClick={() => {
                setCustomerSearch('');
                setCustomerPage(1);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={customerStatusFilter}
            onChange={(e) => {
              setCustomerStatusFilter(e.target.value);
              setCustomerPage(1);
            }}
            className="text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 font-sans cursor-pointer bg-white"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="1">Đang hoạt động</option>
            <option value="0">Đã bị khóa</option>
          </select>

          {(customerSearch || customerStatusFilter !== '') && (
            <button
              type="button"
              onClick={() => {
                setCustomerSearch('');
                setCustomerStatusFilter('');
                setCustomerPage(1);
              }}
              className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              Xóa lọc
            </button>
          )}
        </div>
      </div>

      {/* Bảng danh sách khách hàng */}
      {filteredCustomers.length === 0 ? (
        <div className="text-center py-14 space-y-2 border border-dashed border-slate-200 rounded-2xl">
          <Users className="w-10 h-10 text-slate-300 mx-auto" />
          <div className="font-bold text-slate-700 text-sm">Không tìm thấy khách hàng nào phù hợp</div>
          <p className="text-xs text-slate-400">Hãy thử nhập từ khóa tìm kiếm hoặc chọn bộ lọc trạng thái khác</p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-slate-200/80 rounded-2xl">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-extrabold uppercase tracking-wider border-b border-slate-200">
                <th className="py-3 px-3">Mã</th>
                <th className="py-3 px-3">Họ và tên</th>
                <th className="py-3 px-3">Số điện thoại</th>
                <th className="py-3 px-3">Địa chỉ</th>
                <th className="py-3 px-3">Số đơn</th>
                <th className="py-3 px-3">Tổng chi tiêu</th>
                <th className="py-3 px-3">Trạng thái</th>
                <th className="py-3 px-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedCustomers.map((cu) => (
                <tr key={cu.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-3 font-mono font-bold text-slate-400">#{cu.id}</td>
                  <td className="py-3 px-3 font-bold text-slate-900">{cu.full_name}</td>
                  <td className="py-3 px-3 font-mono font-bold text-brand-700">{cu.phone}</td>
                  <td className="py-3 px-3 text-slate-600 max-w-[200px] truncate" title={cu.address || '-'}>
                    {cu.address || '-'}
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-800">{cu.total_orders} đơn</td>
                  <td className="py-3 px-3 font-black text-brand-700">
                    {parseFloat(cu.total_spent).toLocaleString('vi-VN')} đ
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    {cu.status === 1 ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200/60 inline-flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Hoạt động
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-100 text-red-800 border border-red-200/60 inline-flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                        Đã khóa
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right space-x-1.5 whitespace-nowrap">
                    {/* Xem chi tiết khách hàng */}
                    <button
                      type="button"
                      onClick={() => onViewCustomerDetail(cu)}
                      className="px-2.5 py-1 bg-brand-50 hover:bg-brand-100 text-brand-700 rounded-lg text-[10px] font-bold transition inline-flex items-center gap-1 cursor-pointer border border-brand-200/60"
                      title="Xem chi tiết hồ sơ & lịch sử đơn hàng"
                    >
                      <Eye className="w-3 h-3" /> Chi tiết
                    </button>

                    {/* Khóa / Mở khóa tài khoản */}
                    {cu.status === 1 ? (
                      <button
                        type="button"
                        onClick={() => onLockCustomer(cu)}
                        className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg text-[10px] font-bold transition inline-flex items-center gap-1 cursor-pointer border border-amber-200"
                        title="Khóa tài khoản khách hàng này"
                      >
                        <Lock className="w-3 h-3" /> Khóa
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onUnlockCustomer(cu)}
                        className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-[10px] font-bold transition inline-flex items-center gap-1 cursor-pointer border border-emerald-200"
                        title="Mở khóa tài khoản cho khách hàng"
                      >
                        <Unlock className="w-3 h-3" /> Mở khóa
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Phân trang khách hàng */}
      {filteredCustomers.length > 0 && (
        <Pagination
          currentPage={customerPage}
          totalItems={filteredCustomers.length}
          pageSize={customerPageSize}
          onPageChange={setCustomerPage}
          onPageSizeChange={setCustomerPageSize}
          pageSizeOptions={[5, 10, 20, 50]}
          itemName="khách hàng"
        />
      )}
    </div>
  );
}

