'use client';

import React from 'react';
import { User, ShieldCheck, CheckCircle2, ChevronRight, KeyRound } from 'lucide-react';
import { formatDate } from '@/lib/date';

export default function ProfileSidebarCard({
  currentUser,
  fullName,
  phone,
  createdAt,
  activeTab,
  onSelectTab,
}) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-5">
      <div className="text-center space-y-3">
        <div className="w-20 h-20 bg-gradient-to-br from-brand-600 to-brand-800 text-white rounded-3xl flex items-center justify-center text-3xl font-black mx-auto shadow-lg shadow-brand-600/20">
          {fullName ? fullName.charAt(0).toUpperCase() : 'U'}
        </div>
        <div>
          <h3 className="font-extrabold text-base text-gray-900">{fullName || 'Khách Hàng'}</h3>
          <p className="text-xs text-gray-500 font-mono mt-0.5">{phone}</p>
        </div>
        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-[11px] font-bold border border-brand-200">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
          <span>{currentUser.role_name || (currentUser.isAdmin ? 'Quản Trị Viên' : 'Khách Hàng Thành Viên')}</span>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-4 space-y-2.5 text-xs text-gray-600">
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Trạng thái:</span>
          <span className="font-bold text-emerald-600 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Hoạt động
          </span>
        </div>
        {createdAt && (
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Tham gia:</span>
            <span className="font-medium text-gray-700">{formatDate(createdAt)}</span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Mã khách hàng:</span>
          <span className="font-mono font-bold text-gray-700">#{currentUser.id}</span>
        </div>
      </div>

      {/* Navigation Tab Buttons */}
      <div className="space-y-1.5 pt-2 border-t border-gray-100">
        <button
          onClick={() => onSelectTab('profile')}
          className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-between cursor-pointer ${
            activeTab === 'profile'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>Hồ Sơ Cá Nhân</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 opacity-60" />
        </button>

        <button
          onClick={() => onSelectTab('password')}
          className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-between cursor-pointer ${
            activeTab === 'password'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4" />
            <span>Đổi Mật Khẩu</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 opacity-60" />
        </button>
      </div>
    </div>
  );
}

