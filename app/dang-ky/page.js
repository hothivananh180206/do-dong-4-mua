'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';
import { auth, formatPhoneForE164, initRecaptchaVerifier, resetRecaptchaVerifier, signInWithPhoneNumber } from '@/lib/firebase';

import RegisterForm from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress] = useState('');

  // OTP Verification States (Chạy thực tế 100% qua Google Firebase Phone Auth)
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Countdown timer for resend OTP
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Gửi mã OTP thật qua Firebase SMS
  const handleSendOtp = async () => {
    setErrorMsg('');
    setSuccessMsg('');

    const cleanPhone = phone.trim().replace(/[\s\.\-]+/g, '');
    const phoneRegex = /^(0|\+84)[0-9]{9}$/;
    if (!phoneRegex.test(cleanPhone)) {
      setErrorMsg('Vui lòng nhập số điện thoại Việt Nam hợp lệ (yêu cầu 10 chữ số, ví dụ: 0912345678)');
      return;
    }

    setSendingOtp(true);
    try {
      const checkRes = await fetch(`/api/auth/check-phone?phone=${encodeURIComponent(cleanPhone)}`);
      const checkData = await checkRes.json();
      if (checkData.exists) {
        setErrorMsg('Số điện thoại này đã có tài khoản trên hệ thống. Vui lòng đăng nhập!');
        setSendingOtp(false);
        return;
      }

      const verifier = initRecaptchaVerifier('recaptcha-container');
      const e164Phone = formatPhoneForE164(cleanPhone);

      const confirmation = await signInWithPhoneNumber(auth, e164Phone, verifier);
      setConfirmationResult(confirmation);
      setOtpSent(true);
      setCountdown(60);
      setSuccessMsg(`Đã gửi mã xác thực SMS đến số ${cleanPhone}. Quý khách vui lòng kiểm tra hộp thư tin nhắn.`);
    } catch (err) {
      console.error('Firebase send OTP error:', err);
      resetRecaptchaVerifier('recaptcha-container');
      if (err.code === 'auth/billing-not-enabled') {
        setErrorMsg('Dịch vụ gửi mã OTP qua SMS tạm thời không khả dụng. Vui lòng liên hệ hotline hỗ trợ hoặc thử lại sau ít phút.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setErrorMsg('Dịch vụ xác thực SMS tạm thời bị gián đoạn. Vui lòng thử lại sau ít phút.');
      } else if (err.code === 'auth/invalid-phone-number') {
        setErrorMsg('Số điện thoại không hợp lệ với dịch vụ viễn thông. Vui lòng kiểm tra lại số điện thoại.');
      } else if (err.code === 'auth/too-many-requests') {
        setErrorMsg('Bạn đã yêu cầu gửi mã quá nhiều lần trong thời gian ngắn. Vui lòng thử lại sau ít phút.');
      } else if (err.code === 'auth/quota-exceeded') {
        setErrorMsg('Hệ thống gửi tin nhắn SMS tạm thời quá tải trong ngày. Vui lòng liên hệ hotline hỗ trợ.');
      } else {
        setErrorMsg(err.message || 'Không thể gửi mã SMS xác thực. Vui lòng thử lại!');
      }
    } finally {
      setSendingOtp(false);
    }
  };

  // Xác thực mã OTP người dùng nhập
  const handleVerifyOtp = async () => {
    setErrorMsg('');
    setSuccessMsg('');

    if (!otpCode || otpCode.trim().length < 6) {
      setErrorMsg('Vui lòng nhập đủ 6 chữ số mã OTP.');
      return;
    }

    if (!confirmationResult) {
      setErrorMsg('Phiên xác thực đã hết hạn hoặc chưa được gửi. Vui lòng bấm nhận lại mã.');
      return;
    }

    setVerifyingOtp(true);
    try {
      await confirmationResult.confirm(otpCode.trim());
      setOtpVerified(true);
      setSuccessMsg('Xác thực số điện thoại thành công! Quý khách vui lòng hoàn tất thông tin đăng ký.');
    } catch (err) {
      console.error('Verify OTP error:', err);
      setErrorMsg('Mã OTP không chính xác hoặc đã hết hạn. Vui lòng kiểm tra lại tin nhắn SMS!');
    } finally {
      setVerifyingOtp(false);
    }
  };

  // Hoàn tất Đăng ký tài khoản
  const handleSubmitRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!fullName.trim()) {
      setErrorMsg('Vui lòng nhập họ và tên của bạn.');
      return;
    }

    if (!otpVerified) {
      setErrorMsg('Vui lòng xác thực số điện thoại bằng mã OTP trước khi đăng ký.');
      return;
    }

    if (!password || password.length < 8) {
      setErrorMsg('Mật khẩu phải có tối thiểu 8 ký tự.');
      return;
    }
    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
      setErrorMsg('Mật khẩu phải gồm ít nhất 1 chữ in hoa, 1 chữ in thường và 1 chữ số.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Mật khẩu nhập lại không trùng khớp.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName.trim(),
          phone: phone.trim().replace(/\s+/g, ''),
          password: password,
          address: address.trim()
        })
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg('Đăng ký tài khoản thành công! Đang chuyển hướng đến trang đăng nhập...');
        setTimeout(() => {
          router.push(`/dang-nhap?phone=${encodeURIComponent(phone.trim())}`);
        }, 1500);
      } else {
        setErrorMsg(data.message || 'Đăng ký thất bại');
      }
    } catch (err) {
      console.error('Register submit error:', err);
      setErrorMsg('Không thể kết nối máy chủ. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Hidden container for Firebase reCAPTCHA */}
      <div id="recaptcha-container"></div>

      <div className="max-w-md w-full space-y-6 bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-gray-100">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto text-brand-600 shadow-sm border border-emerald-100">
            <Sparkles className="w-7 h-7" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 font-heading">
            Đăng Ký Tài Khoản
          </h2>
          <p className="text-xs text-gray-500 font-medium">
            Tạo tài khoản thành viên để theo dõi đơn hàng & tích điểm ưu đãi 4 mùa
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs font-bold flex items-start gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span>{errorMsg}</span>
              {errorMsg.includes('đã có tài khoản') && (
                <div className="mt-1">
                  <Link href={`/dang-nhap?phone=${encodeURIComponent(phone.trim())}`} className="underline text-brand-700 hover:text-brand-900">
                    Bấm vào đây để Đăng nhập ngay &rarr;
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        <RegisterForm
          fullName={fullName}
          setFullName={setFullName}
          phone={phone}
          setPhone={setPhone}
          password={password}
          setPassword={setPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          address={address}
          setAddress={setAddress}
          otpCode={otpCode}
          setOtpCode={setOtpCode}
          otpSent={otpSent}
          otpVerified={otpVerified}
          sendingOtp={sendingOtp}
          verifyingOtp={verifyingOtp}
          countdown={countdown}
          loading={loading}
          onSendOtp={handleSendOtp}
          onVerifyOtp={handleVerifyOtp}
          onSubmit={handleSubmitRegister}
        />
      </div>
    </div>
  );
}
