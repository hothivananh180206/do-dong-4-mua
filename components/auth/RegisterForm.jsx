'use client';

import React from 'react';
import Link from 'next/link';
import { User, Phone, Lock, MapPin, ArrowRight, Loader2, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function RegisterForm({
  fullName,
  setFullName,
  phone,
  setPhone,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  address,
  setAddress,
  otpCode,
  setOtpCode,
  otpSent,
  otpVerified,
  sendingOtp,
  verifyingOtp,
  countdown,
  loading,
  onSendOtp,
  onVerifyOtp,
  onSubmit,
}) {
  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      {/* Họ và tên */}
      <div>
        <label className="block text-xs font-bold text-gray-700 mb-1">
          Họ và tên của bạn <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            required
            placeholder="Ví dụ: Nguyễn Văn An"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-brand-600 bg-gray-50/50"
          />
        </div>
      </div>

      {/* Số điện thoại + Nhận mã OTP */}
      <div>
        <label className="block text-xs font-bold text-gray-700 mb-1">
          Số điện thoại nhận mã OTP <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="tel"
              required
              disabled={otpVerified}
              placeholder="Ví dụ: 0912345678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={`w-full text-xs pl-10 pr-3.5 py-2.5 rounded-xl border ${
                otpVerified ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold' : 'border-gray-200 bg-gray-50/50'
              } focus:outline-none focus:ring-2 focus:ring-brand-600`}
            />
          </div>

          {!otpVerified && (
            <button
              type="button"
              onClick={onSendOtp}
              disabled={sendingOtp || countdown > 0 || phone.trim().length < 10}
              className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:bg-gray-300 text-white rounded-xl text-xs font-black whitespace-nowrap transition cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
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
          )}
        </div>
        {phone.trim().length > 0 && phone.trim().length < 10 && (
          <p className="text-[11px] text-amber-600 font-medium mt-1">
            ⚠️ Số điện thoại phải gồm 10 chữ số (Ví dụ: 0912345678)
          </p>
        )}
      </div>

      {/* Ô nhập mã OTP */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-xs font-bold text-gray-700">
            Mã xác thực OTP (6 chữ số) <span className="text-red-500">*</span>
          </label>
          {otpSent && countdown > 0 && !otpVerified && (
            <span className="text-[11px] text-amber-600 font-bold animate-pulse">
              Hiệu lực trong {countdown}s
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <ShieldCheck className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              maxLength={6}
              disabled={otpVerified || !otpSent}
              placeholder={otpSent ? 'Nhập 6 số từ tin nhắn SMS' : 'Bấm "Nhận mã OTP" trước'}
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
              className={`w-full text-xs pl-10 pr-3.5 py-2.5 rounded-xl border ${
                otpVerified
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold'
                  : 'border-gray-200 bg-gray-50/50'
              } font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-brand-600`}
            />
          </div>

          {!otpVerified && otpSent && (
            <button
              type="button"
              onClick={onVerifyOtp}
              disabled={verifyingOtp || otpCode.trim().length < 6}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white rounded-xl text-xs font-black whitespace-nowrap transition cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
            >
              {verifyingOtp ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Xác thực...</span>
                </>
              ) : (
                'Xác nhận OTP'
              )}
            </button>
          )}

          {otpVerified && (
            <div className="px-3.5 py-2.5 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-black flex items-center gap-1 shrink-0">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Đã xác thực</span>
            </div>
          )}
        </div>
      </div>

      {/* Mật khẩu */}
      <div>
        <label className="block text-xs font-bold text-gray-700 mb-1">
          Mật khẩu tài khoản (tối thiểu 8 ký tự, gồm hoa, thường & số) <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="password"
            required
            minLength={8}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-600 bg-gray-50/50"
          />
        </div>
      </div>

      {/* Xác nhận mật khẩu */}
      <div>
        <label className="block text-xs font-bold text-gray-700 mb-1">
          Nhập lại mật khẩu <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="password"
            required
            minLength={8}
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-600 bg-gray-50/50"
          />
        </div>
      </div>

      {/* Địa chỉ giao hàng mặc định */}
      <div>
        <label className="block text-xs font-bold text-gray-700 mb-1">
          Địa chỉ nhận hàng mặc định <span className="text-gray-400 font-normal">(không bắt buộc)</span>
        </label>
        <div className="relative">
          <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Ví dụ: 123 Đường Nguyễn Trãi, Quận 1, TP.HCM"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-600 bg-gray-50/50"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !otpVerified}
        className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 disabled:bg-gray-300 text-white rounded-xl text-xs font-black transition cursor-pointer shadow-lg shadow-brand-600/30 flex items-center justify-center gap-2 mt-4"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Đang tạo tài khoản...</span>
          </>
        ) : (
          <>
            <span>Hoàn Tất Đăng Ký</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

      <div className="text-center pt-2 text-xs text-gray-500">
        Đã có tài khoản?{' '}
        <Link href="/dang-nhap" className="font-bold text-brand-600 hover:text-brand-700 hover:underline">
          Đăng nhập ngay &rarr;
        </Link>
      </div>
    </form>
  );
}

