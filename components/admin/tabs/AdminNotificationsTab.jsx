'use client';

import React from 'react';
import { Bell, Plus, Users, User, ShieldCheck, UserPlus, Search, Eye, Trash2 } from 'lucide-react';
import Pagination from '@/components/Pagination';
import { formatDateTime } from '@/lib/date';

export default function AdminNotificationsTab({
  notifications,
  filteredNotifications,
  paginatedNotifications,
  notificationSearch,
  setNotificationSearch,
  notificationRecipientFilter,
  setNotificationRecipientFilter,
  notificationPage,
  setNotificationPage,
  notificationPageSize,
  setNotificationPageSize,
  onOpenCreateNotificationModal,
  onSelectNotificationDetail,
  onDeleteNotification,
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden p-6 space-y-6 animate-in fade-in duration-200">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h2 className="font-heading font-black text-lg text-slate-900 flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-600" />
            <span>Quản Lý Thông Báo Hệ Thống</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Gửi thông báo đến khách hàng hoặc quản trị viên chi nhánh & theo dõi lịch sử gửi tin
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenCreateNotificationModal}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-emerald-600/20 transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Soạn Thông Báo Mới</span>
        </button>
      </div>

      {/* Thống kê nhanh thông báo */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-slate-50 border border-slate-200/70 rounded-xl p-3.5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-black">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Tổng tin gửi</div>
            <div className="text-lg font-black text-slate-900">{notifications.length}</div>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200/70 rounded-xl p-3.5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Toàn hệ thống</div>
            <div className="text-lg font-black text-emerald-700">
              {notifications.filter((n) => n.recipient_type === 'ALL').length}
            </div>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200/70 rounded-xl p-3.5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-black">
            <User className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Khách hàng</div>
            <div className="text-lg font-black text-amber-700">
              {notifications.filter((n) => n.recipient_type === 'CUSTOMERS').length}
            </div>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200/70 rounded-xl p-3.5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-black">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Quản trị viên</div>
            <div className="text-lg font-black text-purple-700">
              {notifications.filter((n) => n.recipient_type === 'ADMINS').length}
            </div>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200/70 rounded-xl p-3.5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Đích danh</div>
            <div className="text-lg font-black text-indigo-700">
              {notifications.filter((n) => n.recipient_type === 'SPECIFIC').length}
            </div>
          </div>
        </div>
      </div>

      {/* Thanh tìm kiếm & Bộ lọc đối tượng */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between pt-1">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm tiêu đề, nội dung, người gửi..."
            value={notificationSearch}
            onChange={(e) => {
              setNotificationSearch(e.target.value);
              setNotificationPage(1);
            }}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-emerald-500 bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Đối tượng:</span>
          <select
            value={notificationRecipientFilter}
            onChange={(e) => {
              setNotificationRecipientFilter(e.target.value);
              setNotificationPage(1);
            }}
            className="w-full sm:w-auto px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:border-emerald-500 bg-white"
          >
            <option value="ALL_FILTER">Tất cả đối tượng nhận</option>
            <option value="ALL">Toàn hệ thống (ALL)</option>
            <option value="CUSTOMERS">Chỉ Khách hàng (CUSTOMERS)</option>
            <option value="ADMINS">Chỉ Quản trị viên (ADMINS)</option>
            <option value="SPECIFIC">Đích danh 1 hoặc nhiều người (SPECIFIC)</option>
          </select>
        </div>
      </div>

      {/* Bảng danh sách lịch sử thông báo đã gửi */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-50/90 text-slate-500 font-extrabold uppercase tracking-wider border-b border-slate-200 text-[11px]">
              <th className="py-3 px-4">Tiêu đề thông báo</th>
              <th className="py-3 px-4">Đối tượng nhận</th>
              <th className="py-3 px-4">Nội dung tóm tắt</th>
              <th className="py-3 px-4">Người gửi</th>
              <th className="py-3 px-4 whitespace-nowrap">Thời gian gửi</th>
              <th className="py-3 px-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedNotifications.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-10 text-center text-slate-400 text-xs">
                  <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <div>Không tìm thấy thông báo nào phù hợp.</div>
                </td>
              </tr>
            ) : (
              paginatedNotifications.map((n) => (
                <tr key={n.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3.5 px-4 font-bold text-slate-900 max-w-xs">
                    <div
                      className="truncate cursor-pointer hover:text-emerald-700"
                      onClick={() => onSelectNotificationDetail(n)}
                    >
                      {n.title}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {n.recipient_type === 'CUSTOMERS' ? (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        Khách hàng
                      </span>
                    ) : n.recipient_type === 'ADMINS' ? (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-50 text-purple-800 border border-purple-200">
                        Quản trị viên
                      </span>
                    ) : n.recipient_type === 'SPECIFIC' ? (
                      <div>
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-800 border border-indigo-200 inline-flex items-center gap-1">
                          <UserPlus className="w-3 h-3" />
                          <span>
                            Đích danh (
                            {(() => {
                              try {
                                return JSON.parse(n.recipient_ids || '[]').length;
                              } catch {
                                return '1+';
                              }
                            })()}{' '}
                            người)
                          </span>
                        </span>
                        {n.recipient_names && (
                          <div
                            className="text-[10px] text-slate-500 font-medium max-w-[180px] truncate mt-0.5"
                            title={n.recipient_names}
                          >
                            {n.recipient_names}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        Toàn hệ thống
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 max-w-sm">
                    <div className="line-clamp-2 leading-relaxed">{n.content}</div>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="font-bold text-slate-800">{n.sender_name || 'Admin Tổng'}</div>
                    {n.sender_phone && (
                      <div className="text-[11px] text-slate-400 font-mono">{n.sender_phone}</div>
                    )}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap text-slate-600 font-mono text-[11px]">
                    {formatDateTime(n.created_at, true)}
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onSelectNotificationDetail(n)}
                        title="Xem chi tiết"
                        className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteNotification(n)}
                        title="Xóa thông báo"
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

      {/* Phân trang thông báo */}
      {filteredNotifications.length > 0 && (
        <Pagination
          currentPage={notificationPage}
          totalItems={filteredNotifications.length}
          pageSize={notificationPageSize}
          onPageChange={setNotificationPage}
          onPageSizeChange={setNotificationPageSize}
          pageSizeOptions={[10, 15, 30, 50]}
          itemName="thông báo"
        />
      )}
    </div>
  );
}

