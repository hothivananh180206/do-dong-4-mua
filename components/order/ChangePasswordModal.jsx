'use client';

import React from 'react';
import { KeyRound, Eye, EyeOff } from 'lucide-react';

export default function ChangePasswordModal({
  show,
  onClose,
  oldPwdInput,
  setOldPwdInput,
  newPwdInput,
  setNewPwdInput,
  confirmPwdInput,
  setConfirmPwdInput,
  showNewPwd,
  setShowNewPwd,
  changingPwd,
  changePwdError,
  onSubmit,
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <KeyRound className="w-4 h-4" />
            </div>
            <h3 className="font-extrabold text-sm text-gray-900">Thiết Lập Mật Khẩu Mới</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg text-sm"
          >
            ✕
          </button>
        </div>

        {changePwdError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-[11px] text-red-700 font-bold">
            {changePwdError}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="block text-[11px] font-bold text-gray-700 mb-1">Mật khẩu hiện tại</label>
            <input
              type="text"
              required
              value={oldPwdInput}
              onChange={(e) => setOldPwdInput(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-600 font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-700 mb-1">Mật khẩu mới (tối thiểu 8 ký tự, gồm hoa, thường & số)</label>
            <div className="relative">
              <input
                type={showNewPwd ? 'text' : 'password'}
                required
                minLength={6}
                placeholder="Nhập mật khẩu mới..."
                value={newPwdInput}
                onChange={(e) => setNewPwdInput(e.target.value)}
                className="w-full text-xs px-3 py-2 pr-10 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-600"
              />
              <button
                type="button"
                onClick={() => setShowNewPwd(!showNewPwd)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
              >
                {showNewPwd ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-700 mb-1">Xác nhận mật khẩu mới</label>
            <input
              type="password"
              required
              minLength={6}
              placeholder="Nhập lại mật khẩu mới..."
              value={confirmPwdInput}
              onChange={(e) => setConfirmPwdInput(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={changingPwd}
              className="py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-black rounded-xl text-xs transition shadow-md shadow-brand-600/30 cursor-pointer disabled:bg-gray-400"
            >
              {changingPwd ? 'Đang lưu...' : 'Lưu mật khẩu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

