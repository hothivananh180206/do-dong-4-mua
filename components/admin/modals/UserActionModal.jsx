'use client';

import React from 'react';
import { Lock, Unlock, Trash2, X } from 'lucide-react';

export default function UserActionModal({
  actionModal,
  setActionModal,
  executeActionModal
}) {
  return (
    <>
      {actionModal.isOpen && actionModal.targetUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200 relative">
            <button
              type="button"
              onClick={() => setActionModal({ isOpen: false, actionType: 'lock', targetUser: null })}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center transition cursor-pointer text-sm font-bold"
            >
              ✕
            </button>

            {/* Top Icon with Brand Tint */}
            <div className="mb-3.5 flex justify-center">
              {actionModal.actionType === 'lock' ? (
                <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-500 border border-amber-100 flex items-center justify-center shadow-sm">
                  <Lock className="w-8 h-8" />
                </div>
              ) : actionModal.actionType === 'unlock' ? (
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shadow-sm">
                  <Unlock className="w-8 h-8" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 border border-rose-100 flex items-center justify-center shadow-sm">
                  <Trash2 className="w-8 h-8" />
                </div>
              )}
            </div>

            {/* Title & Subtitle */}
            <h4 className="font-heading font-black text-xl text-slate-900 mb-1">
              {actionModal.actionType === 'lock'
                ? 'Khóa tài khoản?'
                : actionModal.actionType === 'unlock'
                  ? 'Mở khóa tài khoản?'
                  : 'Xóa vĩnh viễn?'}
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto mb-4">
              {actionModal.actionType === 'lock'
                ? 'Tài khoản quản trị này sẽ bị tạm dừng đăng nhập vào hệ thống.'
                : actionModal.actionType === 'unlock'
                  ? 'Khôi phục toàn bộ quyền truy cập và quản lý cho quản trị viên này.'
                  : 'Dữ liệu quản trị này sẽ bị xóa hoàn toàn khỏi cơ sở dữ liệu.'}
            </p>

            {/* User Info Card */}
            <div
              className={`rounded-2xl p-4 mb-5 border text-center ${actionModal.actionType === 'lock'
                  ? 'bg-amber-50/70 border-amber-200/80 text-amber-950'
                  : actionModal.actionType === 'unlock'
                    ? 'bg-emerald-50/70 border-emerald-200/80 text-emerald-950'
                    : 'bg-rose-50/70 border-rose-200/80 text-rose-950'
                }`}
            >
              <div className="font-heading font-black text-base tracking-tight">
                {actionModal.targetUser.full_name}
              </div>
              <div className="text-xs font-semibold mt-1 opacity-85 flex items-center justify-center gap-1.5">
                <span>Số điện thoại: {actionModal.targetUser.phone}</span>
                <span>•</span>
                <span>{actionModal.targetUser.role_name || (actionModal.targetUser.role_id === 3 ? 'Khách hàng' : 'Admin Chi nhánh')}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setActionModal({ isOpen: false, actionType: 'lock', targetUser: null })}
                className="py-2.5 px-4 rounded-xl font-bold text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={executeActionModal}
                className={`py-2.5 px-4 rounded-xl font-black text-xs text-white transition cursor-pointer shadow-md ${actionModal.actionType === 'lock'
                    ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/25'
                    : actionModal.actionType === 'unlock'
                      ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/25'
                      : 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/25'
                  }`}
              >
                {actionModal.actionType === 'lock'
                  ? 'Khóa tài khoản'
                  : actionModal.actionType === 'unlock'
                    ? 'Mở khóa tài khoản'
                    : 'Xóa tài khoản'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
