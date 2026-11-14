'use client';

import React from 'react';
import { User, Phone, MapPin, Save } from 'lucide-react';

export default function ProfileInfoForm({
  fullName,
  setFullName,
  phone,
  address,
  setAddress,
  saving,
  onSubmit,
}) {
  return (
    <form onSubmit={onSubmit} noValidate className="bg-white p-7 rounded-3xl border border-gray-100 shadow-sm space-y-5">
      <div className="border-b border-gray-100 pb-3">
        <h3 className="font-extrabold text-base text-gray-900 flex items-center gap-2">
          <User className="w-5 h-5 text-brand-600" />
          <span>Cập Nhật Thông Tin Cá Nhân</span>
        </h3>
        <p className="text-xs text-gray-400 mt-0.5">
          Thông tin này sẽ được dùng mặc định khi bạn thực hiện các đơn đặt hàng
        </p>
      </div>

      {/* Họ và tên */}
      <div>
        <label className="block text-xs font-bold text-gray-700 mb-1">
          Họ và tên <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Nguyễn Văn A"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-brand-600 focus:outline-none"
          />
        </div>
        <p className="text-[11px] text-gray-400 mt-1">Quy tắc nghiệp vụ: Không được để trống họ tên.</p>
      </div>

      {/* Số điện thoại */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-bold text-gray-700">Số điện thoại đăng nhập</label>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
            Đã định danh
          </span>
        </div>
        <div className="relative">
          <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="tel"
            disabled
            value={phone}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-100 bg-gray-50 text-gray-500 text-xs font-mono cursor-not-allowed"
          />
        </div>
        <p className="text-[11px] text-gray-400 mt-1">Số điện thoại là mã định danh chính của tài khoản (DUY NHẤT).</p>
      </div>

      {/* Địa chỉ nhận hàng mặc định */}
      <div>
        <label className="block text-xs font-bold text-gray-700 mb-1">
          Địa chỉ nhận hàng mặc định <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Số nhà, tên đường, phường/xã, quận/huyện..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-brand-600 focus:outline-none"
          />
        </div>
        <p className="text-[11px] text-gray-400 mt-1">Quy tắc nghiệp vụ: Địa chỉ nhận hàng không được để trống.</p>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={saving}
          className="w-full sm:w-auto px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs shadow-md shadow-brand-600/30 transition flex items-center justify-center gap-2 cursor-pointer disabled:bg-gray-400"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Đang lưu...' : 'Lưu Thay Đổi'}</span>
        </button>
      </div>
    </form>
  );
}

