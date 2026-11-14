'use client';

import React from 'react';
import { Sparkles, KeyRound, Copy, Check } from 'lucide-react';

export default function OrderAutoAccountBanner({
  phone,
  currentPassword,
  copiedPwd,
  onCopyPassword,
  onOpenChangePwdModal,
}) {
  return (
    <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-brand-700 text-white p-6 rounded-3xl shadow-xl space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-yellow-300" />
          </div>
          <div>
            <h2 className="text-base font-black flex items-center gap-2">
              <span>Tài Khoản Thành Viên Đã Được Tự Động Khởi Tạo!</span>
              <span className="text-[10px] bg-yellow-400 text-gray-900 font-extrabold px-2 py-0.5 rounded-full">
                Đã đăng nhập
              </span>
            </h2>
            <p className="text-xs text-white/90 mt-1">
              Hệ thống đã tự động kích hoạt tài khoản và đăng nhập cho bạn để dễ dàng theo dõi hành trình đơn hàng.
            </p>
          </div>
        </div>
        <button
          onClick={onOpenChangePwdModal}
          className="px-4 py-2.5 bg-white text-emerald-800 hover:bg-emerald-50 rounded-xl text-xs font-black transition shadow-sm shrink-0 flex items-center gap-1.5 cursor-pointer"
        >
          <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
          Đổi mật khẩu ngay
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
        <div className="bg-white/10 backdrop-blur-sm px-4 py-3 rounded-2xl flex items-center justify-between border border-white/20">
          <span className="text-white/80">Tên đăng nhập (SĐT):</span>
          <strong className="font-mono text-sm tracking-wide text-white">{phone}</strong>
        </div>
        <div className="bg-white/10 backdrop-blur-sm px-4 py-3 rounded-2xl flex items-center justify-between border border-white/20">
          <span className="text-white/80">Mật khẩu tra cứu:</span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-black bg-white/20 px-2.5 py-1 rounded-lg border border-white/20 text-yellow-200">
              {currentPassword}
            </span>
            <button
              onClick={onCopyPassword}
              title="Sao chép mật khẩu"
              className="p-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-white transition cursor-pointer"
            >
              {copiedPwd ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

