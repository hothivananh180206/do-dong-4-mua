'use client';

import React from 'react';
import { KeyRound, Phone, ShieldCheck, Lock, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

export default function ForgotPasswordWizard({
  forgotStep,
  setForgotStep,
  forgotPhone,
  setForgotPhone,
  forgotOtp,
  setForgotOtp,
  forgotNewPassword,
  setForgotNewPassword,
  forgotConfirmPassword,
  setForgotConfirmPassword,
  forgotCountdown,
  loading,
  onSendOtp,
  onVerifyOtp,
  onResetPassword,
  onBackToLogin,
}) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div>
          <h3 className="font-extrabold text-sm text-gray-900 flex items-center gap-1.5">
            <KeyRound className="w-4 h-4 text-brand-600" />
            <span>Khôi Phục Mật Khẩu</span>
          </h3>
          <p className="text-[11px] text-gray-400 mt-0.5">Xác thực an toàn qua mã OTP gửi về tin nhắn SMS</p>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-bold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-full border border-brand-200">
          <span>Bước {forgotStep}/3</span>
        </div>
      </div>

      {/* Step 1: Nhập Số điện thoại */}
      {forgotStep === 1 && (
        <form onSubmit={onSendOtp} noValidate className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Số điện thoại tài khoản của bạn</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="tel"
                required
                placeholder="Ví dụ: 0912345678"
                value={forgotPhone}
                onChange={(e) => setForgotPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-brand-600 focus:outline-none"
              />
            </div>
            {forgotPhone.trim().length > 0 && forgotPhone.trim().length < 10 && (
              <p className="text-[11px] text-amber-600 font-medium mt-1">
                ⚠️ Số điện thoại phải gồm 10 chữ số (Ví dụ: 0912345678)
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || forgotPhone.trim().length < 10}
            className="w-full py-3 bg-brand-600 hover:bg-brand-700 disabled:bg-gray-300 text-white font-bold rounded-xl text-xs shadow-md shadow-brand-600/30 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <span>Đang gửi mã SMS...</span>
            ) : (
              <>
                <span>Bước 1: Gửi Mã OTP Qua SMS</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}

      {/* Step 2: Nhập mã OTP từ SMS Firebase */}
      {forgotStep === 2 && (
        <form onSubmit={onVerifyOtp} noValidate className="space-y-4">
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 space-y-1.5">
            <div className="font-bold flex items-center gap-1.5 text-emerald-800">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Mã OTP đã gửi đến SĐT: {forgotPhone}</span>
            </div>
            <p className="text-[11px] text-emerald-700">
              Quý khách vui lòng kiểm tra tin nhắn SMS trên điện thoại và nhập 6 chữ số vào ô bên dưới.
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-gray-700">Mã xác thực OTP (6 chữ số)</label>
              {forgotCountdown > 0 && (
                <span className="text-[11px] text-amber-600 font-bold animate-pulse">
                  Gửi lại sau ({forgotCountdown}s)
                </span>
              )}
            </div>
            <div className="relative">
              <ShieldCheck className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                maxLength={6}
                placeholder="Nhập 6 số từ SMS"
                value={forgotOtp}
                onChange={(e) => setForgotOtp(e.target.value.replace(/\D/g, ''))}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm font-mono tracking-widest text-center focus:ring-2 focus:ring-emerald-500 focus:outline-none font-black text-gray-900"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setForgotStep(1)}
              className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition cursor-pointer"
            >
              Quay lại
            </button>
            <button
              type="submit"
              disabled={loading || forgotOtp.length < 6}
              className="flex-1 py-3 bg-brand-600 hover:bg-brand-700 disabled:bg-gray-300 text-white font-bold rounded-xl text-xs shadow-md shadow-brand-600/30 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <span>Đang xác minh...</span>
              ) : (
                <>
                  <span>Bước 2: Xác Nhận Mã OTP</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          <div className="text-center pt-1">
            <button
              type="button"
              disabled={loading || forgotCountdown > 0}
              onClick={onSendOtp}
              className="text-xs font-bold text-brand-700 hover:underline disabled:text-gray-400 disabled:no-underline cursor-pointer"
            >
              {forgotCountdown > 0 ? `Chưa nhận được SMS? Gửi lại sau (${forgotCountdown}s)` : 'Chưa nhận được mã? Bấm gửi lại SMS'}
            </button>
          </div>
        </form>
      )}

      {/* Step 3: Nhập Mật khẩu mới */}
      {forgotStep === 3 && (
        <form onSubmit={onResetPassword} noValidate className="space-y-4">
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Đã xác thực OTP thành công! Vui lòng thiết lập mật khẩu mới.</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Mật khẩu mới (tối thiểu 8 ký tự, gồm hoa, thường & số)</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                placeholder="Nhập mật khẩu mới..."
                value={forgotNewPassword}
                onChange={(e) => setForgotNewPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Xác nhận mật khẩu mới</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                placeholder="Nhập lại mật khẩu mới..."
                value={forgotConfirmPassword}
                onChange={(e) => setForgotConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-600/30 transition flex items-center justify-center gap-2 cursor-pointer disabled:bg-gray-400"
          >
            {loading ? (
              <span>Đang cập nhật...</span>
            ) : (
              <>
                <span>Bước 3: Lưu Mật Khẩu Mới</span>
                <CheckCircle2 className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}

      <div className="text-center pt-2">
        <button
          type="button"
          onClick={onBackToLogin}
          className="text-xs text-gray-500 hover:text-gray-800 hover:underline cursor-pointer"
        >
          ← Quay lại Đăng Nhập
        </button>
      </div>
    </div>
  );
}

