'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, Lock, ArrowRight } from 'lucide-react';

export default function LoginForm({
  loginPhone,
  setLoginPhone,
  loginPassword,
  setLoginPassword,
  loading,
  onSubmit,
  onForgotPassword,
}) {
  return (
    <form onSubmit={onSubmit} noValidate className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
      <div>
        <label className="block text-xs font-bold text-gray-700 mb-1">Số điện thoại</label>
        <div className="relative">
          <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="tel"
            required
            placeholder="0988888888"
            value={loginPhone}
            onChange={(e) => setLoginPhone(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-brand-600 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-bold text-gray-700">Mật khẩu</label>
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-[11px] text-brand-600 hover:text-brand-700 font-medium hover:underline cursor-pointer"
          >
            Quên mật khẩu?
          </button>
        </div>
        <div className="relative">
          <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="password"
            required
            placeholder="••••••••"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-brand-600 focus:outline-none"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs shadow-lg shadow-brand-600/30 transition flex items-center justify-center gap-2 cursor-pointer disabled:bg-gray-400"
      >
        {loading ? (
          <span>Đang xác thực...</span>
        ) : (
          <>
            <span>Đăng Nhập</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

      <div className="text-center pt-2 text-xs text-gray-500">
        Chưa có tài khoản?{' '}
        <Link href="/dang-ky" className="font-bold text-brand-600 hover:text-brand-700 hover:underline">
          Đăng ký tài khoản mới &rarr;
        </Link>
      </div>
    </form>
  );
}

