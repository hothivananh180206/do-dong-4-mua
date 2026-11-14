'use client';

import React from 'react';
import Link from 'next/link';
import { User, ShoppingBag, LogOut } from 'lucide-react';

export default function ProfileBreadcrumbHeader({ onLogout }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-5">
      <div>
        <div className="flex items-center gap-2 text-xs text-gray-400 font-medium mb-1">
          <Link href="/" className="hover:text-brand-600">Trang chủ</Link>
          <span>/</span>
          <span className="text-gray-700 font-bold">Thông tin cá nhân</span>
        </div>
        <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2.5 font-heading">
          <User className="w-7 h-7 text-brand-600" />
          <span>Quản Lý Thông Tin Cá Nhân</span>
        </h1>
        <p className="text-xs text-gray-500 mt-1">Cập nhật hồ sơ nhận hàng và bảo mật tài khoản</p>
      </div>

      {/* Quick Nav Links */}
      <div className="flex items-center gap-2">
        <Link
          href="/lich-su-don-hang"
          className="px-4 py-2 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold text-xs rounded-xl border border-emerald-200 transition flex items-center gap-1.5"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Lịch Sử Đơn Hàng</span>
        </Link>
        <button
          onClick={onLogout}
          className="px-3.5 py-2 bg-red-50 text-red-600 hover:bg-red-100 font-bold text-xs rounded-xl border border-red-200 transition flex items-center gap-1.5 cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Đăng Xuất</span>
        </button>
      </div>
    </div>
  );
}

