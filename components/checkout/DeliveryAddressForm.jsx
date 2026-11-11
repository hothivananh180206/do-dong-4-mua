'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, CheckCircle2, AlertCircle, LogIn, Lock, Loader2 } from 'lucide-react';

export default function DeliveryAddressForm({
  formData,
  setFormData,
  branches = [],
  currentUser,
  phoneExists,
  phoneCheckLoading,
  checkPhoneStatus,
  otpSent,
  otpCode,
  setOtpCode,
  otpVerified,
  sendingOtp,
  verifyingOtp,
  countdown,
  handleSendOtp,
  handleVerifyOtp,
  otpError,
  successMsg,
  customerPassword,
  setCustomerPassword,
  showPassword,
  setShowPassword
}) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
      <h3 className="font-extrabold text-base text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
        <span className="w-6 h-6 rounded-full bg-brand-600 text-white text-xs flex items-center justify-center font-bold">1</span>
        Thông Tin Nhận Hàng
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">
            Họ và tên người nhận <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="Ví dụ: Nguyễn Văn A"
            value={formData.receiver_name}
            onChange={(e) => setFormData({ ...formData, receiver_name: e.target.value })}
            className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-brand-600 bg-gray-50/50"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-bold text-gray-700">
              Số điện thoại nhận hàng <span className="text-red-500">*</span>
            </label>
            {phoneCheckLoading && (
              <span className="text-[10px] text-gray-400 animate-pulse font-medium">Đang kiểm tra...</span>
            )}
          </div>
          <input
            type="tel"
            required
            disabled={Boolean(currentUser) || otpVerified}
            placeholder="Ví dụ: 0912345678"
            value={formData.phone}
            onChange={(e) => {
              setFormData({ ...formData, phone: e.target.value });
            }}
            onBlur={(e) => checkPhoneStatus(e.target.value)}
            className={`w-full text-xs px-3.5 py-2.5 rounded-xl border ${
              phoneExists 
                ? 'border-amber-400 bg-amber-50 text-amber-950 font-bold' 
                : otpVerified 
                  ? 'border-emerald-400 bg-emerald-50 text-emerald-950 font-bold' 
                  : 'border-gray-200 bg-gray-50/50'
            } focus:outline-none focus:ring-2 focus:ring-brand-600`}
          />
        </div>
      </div>

      {/* TH1: Số điện thoại ĐÃ CÓ tài khoản -> Yêu cầu đăng nhập */}
      {phoneExists && (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl space-y-2.5 animate-fadeIn">
          <div className="flex items-start gap-2.5 text-xs text-amber-900 font-bold">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span>Số điện thoại <strong>{formData.phone}</strong> đã có tài khoản trên hệ thống.</span>
              <p className="text-[11px] text-amber-800 font-normal mt-0.5">
                Để bảo vệ quyền lợi thành viên và theo dõi đơn hàng, quý khách vui lòng đăng nhập trước khi mua.
              </p>
            </div>
          </div>
          <Link
            href={`/dang-nhap?redirect=/dat-hang&phone=${encodeURIComponent(formData.phone.trim())}`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-extrabold shadow-sm transition"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Đăng nhập ngay để tiếp tục mua hàng</span>
          </Link>
        </div>
      )}

      {/* TH2: Khách hàng mới (chưa có tài khoản) -> Bắt buộc xác thực OTP */}
      {!currentUser && !phoneExists && formData.phone.trim().length >= 10 && (
        <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-brand-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-brand-600" /> Xác thực số điện thoại khách hàng mới
            </span>
            {otpVerified && (
              <span className="text-xs font-black text-emerald-700 flex items-center gap-1 bg-white px-2 py-0.5 rounded-lg border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Đã xác thực
              </span>
            )}
          </div>

          {!otpVerified ? (
            <div className="space-y-3">
              <p className="text-[11px] text-gray-600 font-medium">
                Hệ thống sẽ gửi mã xác thực SMS 6 số về điện thoại của bạn để tránh đơn hàng ảo & kích hoạt tài khoản.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={sendingOtp || countdown > 0}
                  className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:bg-gray-300 text-white rounded-xl text-xs font-black transition cursor-pointer shrink-0 shadow-sm flex items-center justify-center gap-1.5 min-w-[130px]"
                >
                  {sendingOtp ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Đang gửi SMS...</span>
                    </>
                  ) : countdown > 0 ? (
                    `Gửi lại (${countdown}s)`
                  ) : (otpSent ? 'Gửi lại mã' : 'Nhận mã OTP')}
                </button>

                <div className="flex gap-2 flex-1">
                  <input
                    type="text"
                    maxLength={6}
                    disabled={!otpSent}
                    placeholder={otpSent ? "Nhập 6 số từ SMS" : "Chờ bấm nhận mã..."}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    className={`flex-1 text-center tracking-widest font-black text-sm px-3.5 py-2 rounded-xl border ${
                      !otpSent 
                        ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' 
                        : 'border-emerald-400 bg-white ring-2 ring-emerald-100'
                    } focus:outline-none focus:ring-2 focus:ring-brand-600`}
                  />
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={!otpSent || verifyingOtp || otpCode.length < 6}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-xl text-xs font-black transition cursor-pointer whitespace-nowrap shadow-sm flex items-center justify-center gap-1.5"
                  >
                    {verifyingOtp && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>{verifyingOtp ? 'Đang kiểm tra...' : 'Xác nhận OTP'}</span>
                  </button>
                </div>
              </div>

              {otpError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium flex items-start gap-2 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold">{otpError}</p>
                  </div>
                </div>
              )}

              {successMsg && (
                <div className="p-2.5 bg-emerald-100/70 border border-emerald-300 rounded-xl text-xs text-emerald-800 font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-emerald-800 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Số điện thoại đã được xác thực an toàn!
              </p>
              
              <div className="bg-white p-3.5 rounded-xl border border-emerald-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-brand-600" />
                    Mật khẩu tài khoản mới <span className="text-[11px] font-normal text-gray-500">(Tùy chọn)</span>
                  </label>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-md border border-emerald-200">
                    Mặc định: 123456
                  </span>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu (tối thiểu 6 ký tự) hoặc để trống"
                    value={customerPassword}
                    onChange={(e) => setCustomerPassword(e.target.value)}
                    className="w-full text-xs px-3.5 py-2 pr-16 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-600 bg-gray-50/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] font-bold text-gray-500 hover:text-gray-800 px-1.5 py-0.5 cursor-pointer"
                  >
                    {showPassword ? 'Ẩn' : 'Hiện'}
                  </button>
                </div>
                <p className="text-[10px] text-gray-500">
                  Hệ thống sẽ tự động tạo tài khoản và đăng nhập cho bạn sau khi đặt hàng. Bạn có thể tự đặt mật khẩu hoặc dùng mặc định <strong>123456</strong>.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      <div>
        <label className="block text-xs font-bold text-gray-700 mb-1">
          Địa chỉ giao hàng chi tiết <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          required
          placeholder="Số nhà, tên đường, phường/xã, quận/huyện..."
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-brand-600 bg-gray-50/50"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-700 mb-1">
          Chọn chi nhánh phục vụ gần nhất
        </label>
        <select
          value={formData.branch_id}
          onChange={(e) => setFormData({ ...formData, branch_id: parseInt(e.target.value, 10) })}
          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-600 bg-gray-50/50"
        >
          {branches.map((b) => (
            <option key={b.id} value={b.id}>
              {b.branch_name} - {b.address}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-700 mb-1">
          Ghi chú cho tài xế GreenSM (tùy chọn)
        </label>
        <textarea
          rows={2}
          placeholder="Ví dụ: Giao trước 11h trưa, gọi chuông cửa..."
          value={formData.note}
          onChange={(e) => setFormData({ ...formData, note: e.target.value })}
          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-600 bg-gray-50/50"
        />
      </div>
    </div>
  );
}

