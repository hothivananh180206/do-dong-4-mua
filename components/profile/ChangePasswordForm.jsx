'use client';

import React from 'react';
import { KeyRound, Lock } from 'lucide-react';

export default function ChangePasswordForm({
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  saving,
  onSubmit,
}) {
  return (
    <form onSubmit={onSubmit} noValidate className="bg-white p-7 rounded-3xl border border-gray-100 shadow-sm space-y-5">
      <div className="border-b border-gray-100 pb-3">
        <h3 className="font-extrabold text-base text-gray-900 flex items-center gap-2">
          <KeyRound className="w-5 h-5 text-brand-600" />
          <span>Đổi Mật Khẩu Tài Khoản</span>
        </h3>
        <p className="text-xs text-gray-400 mt-0.5">Mật khẩu mới phải có tối thiểu 8 ký tự, bao gồm ít nhất 1 chữ hoa, 1 chữ thường và 1 chữ số</p>
      </div>

      {/* Mật khẩu hiện tại */}
      <div>
        <label className="block text-xs font-bold text-gray-700 mb-1">Mật khẩu hiện tại *</label>
        <div className="relative">
          <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="password"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-brand-600 focus:outline-none"
          />
        </div>
      </div>

      {/* Mật khẩu mới */}
      <div>
        <label className="block text-xs font-bold text-gray-700 mb-1">Mật khẩu mới (tối thiểu 8 ký tự, gồm hoa, thường & số) *</label>
        <div className="relative">
          <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-brand-600 focus:outline-none"
          />
        </div>
      </div>

      {/* Xác nhận mật khẩu mới */}
      <div>
        <label className="block text-xs font-bold text-gray-700 mb-1">Nhập lại mật khẩu mới *</label>
        <div className="relative">
          <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-brand-600 focus:outline-none"
          />
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={saving}
          className="w-full sm:w-auto px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs shadow-md shadow-brand-600/30 transition flex items-center justify-center gap-2 cursor-pointer disabled:bg-gray-400"
        >
          <Lock className="w-4 h-4" />
          <span>{saving ? 'Đang cập nhật...' : 'Cập Nhật Mật Khẩu Mới'}</span>
        </button>
      </div>
    </form>
  );
}

