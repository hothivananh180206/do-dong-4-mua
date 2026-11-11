'use client';

import React from 'react';
import {
  Send, Users, User, ShieldCheck, UserPlus, Search,
  RefreshCw, Bell, Trash2, X
} from 'lucide-react';
import { formatDateTime } from '@/lib/date';

export default function NotificationModals({
  showCreateNotificationModal,
  setShowCreateNotificationModal,
  handleCreateNotification,
  newNotification,
  setNewNotification,
  sendingNotification = false,
  branches,
  userPickerSearch,
  setUserPickerSearch,
  userPickerRoleFilter,
  setUserPickerRoleFilter,
  filteredPickerUsers,
  selectedRecipientIds,
  setSelectedRecipientIds,
  selectedNotificationDetail,
  setSelectedNotificationDetail,
  deletingNotification,
  setDeletingNotification,
  handleConfirmDeleteNotification
}) {
  return (
    <>
      {showCreateNotificationModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-heading font-black text-base text-slate-900">Soạn Thông Báo Mới</h3>
                  <p className="text-[11px] text-slate-500">Phát thông báo đến khách hàng hoặc quản trị viên</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateNotificationModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNotification} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Tiêu đề thông báo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Thông báo khuyến mãi Black Friday 2026..."
                  value={newNotification.title}
                  onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Đối tượng nhận thông báo <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewNotification({ ...newNotification, recipient_type: 'ALL' })}
                    className={`p-2.5 rounded-xl border text-center transition cursor-pointer flex flex-col items-center gap-1 ${
                      newNotification.recipient_type === 'ALL'
                        ? 'border-emerald-500 bg-emerald-50/80 text-emerald-950 font-black shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600 font-medium'
                    }`}
                  >
                    <Users className="w-4 h-4 text-emerald-600" />
                    <span className="text-[11px]">Toàn hệ thống</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewNotification({ ...newNotification, recipient_type: 'CUSTOMERS' })}
                    className={`p-2.5 rounded-xl border text-center transition cursor-pointer flex flex-col items-center gap-1 ${
                      newNotification.recipient_type === 'CUSTOMERS'
                        ? 'border-amber-500 bg-amber-50/80 text-amber-950 font-black shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600 font-medium'
                    }`}
                  >
                    <User className="w-4 h-4 text-amber-600" />
                    <span className="text-[11px]">Khách hàng</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewNotification({ ...newNotification, recipient_type: 'ADMINS' })}
                    className={`p-2.5 rounded-xl border text-center transition cursor-pointer flex flex-col items-center gap-1 ${
                      newNotification.recipient_type === 'ADMINS'
                        ? 'border-purple-500 bg-purple-50/80 text-purple-950 font-black shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600 font-medium'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-purple-600" />
                    <span className="text-[11px]">Quản trị viên</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewNotification({ ...newNotification, recipient_type: 'SPECIFIC' })}
                    className={`p-2.5 rounded-xl border text-center transition cursor-pointer flex flex-col items-center gap-1 ${
                      newNotification.recipient_type === 'SPECIFIC'
                        ? 'border-indigo-500 bg-indigo-50/80 text-indigo-950 font-black shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600 font-medium'
                    }`}
                  >
                    <UserPlus className="w-4 h-4 text-indigo-600" />
                    <span className="text-[11px]">Người nhận cụ thể</span>
                  </button>
                </div>

                {/* BỘ CHỌN NGƯỜI NHẬN ĐÍCH DANH (FR-046: 1 HOẶC NHIỀU NGƯỜI) */}
                {newNotification.recipient_type === 'SPECIFIC' && (
                  <div className="mt-3 p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2.5 animate-in fade-in duration-200">
                    <div className="flex flex-col sm:flex-row gap-2 items-center justify-between">
                      <div className="relative w-full sm:w-56">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Tìm tên, SĐT..."
                          value={userPickerSearch}
                          onChange={(e) => setUserPickerSearch(e.target.value)}
                          className="w-full pl-8 pr-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-medium bg-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                        <select
                          value={userPickerRoleFilter}
                          onChange={(e) => setUserPickerRoleFilter(e.target.value)}
                          className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold bg-white focus:outline-none"
                        >
                          <option value="ALL">Tất cả vai trò</option>
                          <option value="CUSTOMER">Khách hàng</option>
                          <option value="ADMIN">Quản trị viên</option>
                        </select>

                        <div className="flex items-center gap-1.5 text-[11px]">
                          <button
                            type="button"
                            onClick={() => {
                              const idsToSelect = filteredPickerUsers.map(u => u.id);
                              setSelectedRecipientIds(Array.from(new Set([...selectedRecipientIds, ...idsToSelect])));
                            }}
                            className="text-indigo-600 hover:underline font-bold cursor-pointer"
                          >
                            Chọn tất cả
                          </button>
                          <span className="text-slate-300">|</span>
                          <button
                            type="button"
                            onClick={() => setSelectedRecipientIds([])}
                            className="text-slate-500 hover:underline font-bold cursor-pointer"
                          >
                            Bỏ chọn
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 px-1">
                      <span>Danh sách tài khoản ({filteredPickerUsers.length})</span>
                      <span className="text-indigo-600">Đã chọn: {selectedRecipientIds.length} người nhận</span>
                    </div>

                    {/* Danh sách người dùng để tích chọn */}
                    <div className="max-h-48 overflow-y-auto rounded-xl border border-slate-200 bg-white divide-y divide-slate-100">
                      {filteredPickerUsers.length === 0 ? (
                        <div className="p-4 text-center text-slate-400 text-xs">
                          Không tìm thấy tài khoản người dùng phù hợp.
                        </div>
                      ) : (
                        filteredPickerUsers.map(user => {
                          const isSelected = selectedRecipientIds.includes(user.id);
                          return (
                            <div
                              key={user.id}
                              onClick={() => {
                                if (isSelected) {
                                  setSelectedRecipientIds(selectedRecipientIds.filter(id => id !== user.id));
                                } else {
                                  setSelectedRecipientIds([...selectedRecipientIds, user.id]);
                                }
                              }}
                              className={`p-2.5 flex items-center justify-between gap-3 cursor-pointer transition ${
                                isSelected ? 'bg-indigo-50/70' : 'hover:bg-slate-50'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => {}} // Handle by parent div
                                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                />
                                <div className="min-w-0">
                                  <div className="font-bold text-slate-900 truncate text-xs">
                                    {user.full_name}
                                  </div>
                                  <div className="text-[11px] text-slate-400 font-mono">
                                    {user.phone}
                                  </div>
                                </div>
                              </div>

                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap ${
                                user.type === 'ADMIN'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}>
                                {user.role_name}
                              </span>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nội dung chi tiết thông báo <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Nhập nội dung đầy đủ của thông báo..."
                  value={newNotification.content}
                  onChange={(e) => setNewNotification({ ...newNotification, content: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium leading-relaxed"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateNotificationModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 font-bold text-slate-600 transition cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={sendingNotification}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition cursor-pointer"
                >
                  {sendingNotification ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  <span>{sendingNotification ? 'Đang gửi...' : 'Gửi Thông Báo'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: XEM CHI TIẾT THÔNG BÁO */}
      {selectedNotificationDetail && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-heading font-black text-base text-slate-900">Chi Tiết Thông Báo</h3>
                  <p className="text-[11px] text-slate-500">Mã thông báo #{selectedNotificationDetail.id}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedNotificationDetail(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Tiêu đề:</span>
                <div className="text-sm font-black text-slate-900 leading-snug">
                  {selectedNotificationDetail.title}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200/60">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Đối tượng nhận:</span>
                  {selectedNotificationDetail.recipient_type === 'CUSTOMERS' ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                      Khách hàng
                    </span>
                  ) : selectedNotificationDetail.recipient_type === 'ADMINS' ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                      Quản trị viên
                    </span>
                  ) : selectedNotificationDetail.recipient_type === 'SPECIFIC' ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800">
                      Đích danh ({(() => {
                        try {
                          return JSON.parse(selectedNotificationDetail.recipient_ids || '[]').length;
                        } catch {
                          return 'Nhiều';
                        }
                      })()} người)
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Toàn hệ thống
                    </span>
                  )}
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Thời gian gửi:</span>
                  <div className="font-mono font-bold text-slate-700 text-[11px]">
                    {formatDateTime(selectedNotificationDetail.created_at)}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Người gửi:</span>
                  <div className="font-bold text-slate-800">
                    {selectedNotificationDetail.sender_name || 'Admin Tổng'}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Số điện thoại:</span>
                  <div className="font-mono text-slate-600">
                    {selectedNotificationDetail.sender_phone || '0929894248'}
                  </div>
                </div>
              </div>

              {selectedNotificationDetail.recipient_type === 'SPECIFIC' && selectedNotificationDetail.recipient_names && (
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Danh sách người nhận cụ thể:</span>
                  <div className="p-3 rounded-xl bg-indigo-50/50 border border-indigo-100 text-indigo-950 font-medium text-xs leading-relaxed">
                    {selectedNotificationDetail.recipient_names}
                  </div>
                </div>
              )}

              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Nội dung thông báo:</span>
                <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 text-slate-800 leading-relaxed font-medium whitespace-pre-wrap">
                  {selectedNotificationDetail.content}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedNotificationDetail(null)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition cursor-pointer text-xs"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: XÓA THÔNG BÁO */}
      {deletingNotification && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading font-black text-base text-slate-900">Xóa Thông Báo</h3>
                <p className="text-xs text-slate-500">Mã #{deletingNotification.id}</p>
              </div>
            </div>

            <div className="bg-rose-50/70 border border-rose-200/80 rounded-2xl p-3.5 text-xs text-rose-950 space-y-1">
              <div className="font-bold">{deletingNotification.title}</div>
              <div className="text-slate-600">
                Đối tượng: <span className="font-bold text-slate-800">{deletingNotification.recipient_type}</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Bạn có chắc chắn muốn xóa thông báo này khỏi lịch sử hệ thống? Thao tác này không thể hoàn tác.
            </p>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeletingNotification(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-600 transition cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteNotification}
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
