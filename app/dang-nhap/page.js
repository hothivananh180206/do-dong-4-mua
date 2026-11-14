'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { auth, formatPhoneForE164, initRecaptchaVerifier, resetRecaptchaVerifier, signInWithPhoneNumber } from '@/lib/firebase';
import { saveAuthSession } from '@/lib/auth-session';

import AuthBrandHeader from '@/components/auth/AuthBrandHeader';

import LoginForm from '@/components/auth/LoginForm';
import ForgotPasswordWizard from '@/components/auth/ForgotPasswordWizard';

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get('tab') === 'forgot' ? 'forgot' : 'login';

  const [activeTab, setActiveTab] = useState(defaultTab);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Tự động chuyển sang trang /dang-ky nếu truy cập tab=register
  useEffect(() => {
    if (searchParams.get('tab') === 'register') {
      router.replace('/dang-ky');
    }
  }, [searchParams, router]);

  // Login form
  const [loginPhone, setLoginPhone] = useState(searchParams.get('phone') || '');
  const [loginPassword, setLoginPassword] = useState('');

  // FR-003: Quên mật khẩu form states (Firebase SMS OTP thực tế)
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotPhone, setForgotPhone] = useState(searchParams.get('phone') || '');
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [forgotConfirmationResult, setForgotConfirmationResult] = useState(null);
  const [forgotCountdown, setForgotCountdown] = useState(0);

  // Đếm ngược thời gian gửi lại mã SMS
  useEffect(() => {
    let timer;
    if (forgotCountdown > 0) {
      timer = setTimeout(() => setForgotCountdown(forgotCountdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [forgotCountdown]);


  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!loginPhone || !loginPhone.trim()) {
      setErrorMsg('Vui lòng nhập số điện thoại.');
      return;
    }

    if (!loginPassword || !loginPassword.trim()) {
      setErrorMsg('Vui lòng nhập mật khẩu.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: loginPhone, password: loginPassword }),
      });

      const data = await res.json();
      if (data.success) {
        saveAuthSession(data.user);
        if (data.user.isAdmin) {
          router.push('/admin');
        } else {
          router.push('/');
        }
      } else {
        setErrorMsg(data.message || 'Đăng nhập thất bại');
      }
    } catch (err) {
      setErrorMsg('Không thể kết nối máy chủ');
    } finally {
      setLoading(false);
    }
  };

  // FR-003: Luồng xử lý Quên mật khẩu qua Firebase Phone Auth SMS OTP
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanPhone = (forgotPhone || '').trim().replace(/[\s\.\-]+/g, '');
    const phoneRegex = /^(0|\+84)[0-9]{9}$/;
    if (!phoneRegex.test(cleanPhone)) {
      setErrorMsg('Vui lòng nhập số điện thoại Việt Nam hợp lệ (yêu cầu 10 chữ số, ví dụ: 0912345678).');
      return;
    }

    setLoading(true);
    try {
      const checkRes = await fetch(`/api/auth/check-phone?phone=${encodeURIComponent(cleanPhone)}`);
      const checkData = await checkRes.json();
      if (!checkData.exists) {
        setErrorMsg('Số điện thoại này chưa được đăng ký tài khoản trong hệ thống.');
        setLoading(false);
        return;
      }

      const verifier = initRecaptchaVerifier('recaptcha-container');
      const e164Phone = formatPhoneForE164(cleanPhone);
      const confirmation = await signInWithPhoneNumber(auth, e164Phone, verifier);

      setForgotConfirmationResult(confirmation);
      setForgotCountdown(60);
      setForgotStep(2);
      setSuccessMsg(`Đã gửi mã SMS xác thực đến ${cleanPhone}. Quý khách vui lòng kiểm tra tin nhắn.`);
    } catch (err) {
      console.error('Firebase send OTP forgot password error:', err);
      resetRecaptchaVerifier('recaptcha-container');
      if (err.code === 'auth/billing-not-enabled') {
        setErrorMsg('Dịch vụ gửi mã OTP qua SMS tạm thời không khả dụng. Vui lòng liên hệ hotline hỗ trợ hoặc thử lại sau ít phút.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setErrorMsg('Dịch vụ xác thực SMS tạm thời bị gián đoạn. Vui lòng thử lại sau ít phút.');
      } else if (err.code === 'auth/invalid-phone-number') {
        setErrorMsg('Số điện thoại không hợp lệ đối với mạng viễn thông.');
      } else if (err.code === 'auth/too-many-requests') {
        setErrorMsg('Bạn đã yêu cầu gửi mã quá nhiều lần trong thời gian ngắn. Vui lòng thử lại sau ít phút.');
      } else if (err.code === 'auth/quota-exceeded') {
        setErrorMsg('Hệ thống gửi tin nhắn SMS tạm thời quá tải trong ngày. Vui lòng liên hệ hotline hỗ trợ.');
      } else {
        setErrorMsg(err.message || 'Không thể gửi mã SMS xác thực. Vui lòng thử lại!');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!forgotOtp || forgotOtp.trim().length < 6) {
      setErrorMsg('Vui lòng nhập đủ 6 chữ số mã OTP.');
      return;
    }

    if (!forgotConfirmationResult) {
      setErrorMsg('Phiên xác thực đã hết hạn hoặc chưa được gửi. Vui lòng bấm nhận lại mã.');
      return;
    }

    setLoading(true);
    try {
      await forgotConfirmationResult.confirm(forgotOtp.trim());
      setSuccessMsg('Xác thực số điện thoại thành công! Quý khách vui lòng thiết lập mật khẩu mới.');
      setForgotStep(3);
    } catch (err) {
      console.error('Verify OTP error:', err);
      setErrorMsg('Mã OTP không chính xác hoặc đã hết hạn. Vui lòng kiểm tra lại tin nhắn SMS!');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!forgotNewPassword) {
      setErrorMsg('Vui lòng nhập mật khẩu mới.');
      return;
    }
    if (forgotNewPassword.length < 8) {
      setErrorMsg('Mật khẩu mới phải có tối thiểu 8 ký tự.');
      return;
    }
    if (!/[A-Z]/.test(forgotNewPassword) || !/[a-z]/.test(forgotNewPassword) || !/[0-9]/.test(forgotNewPassword)) {
      setErrorMsg('Mật khẩu mới phải gồm ít nhất 1 chữ in hoa, 1 chữ in thường và 1 chữ số.');
      return;
    }
    if (forgotNewPassword !== forgotConfirmPassword) {
      setErrorMsg('Hai mật khẩu không trùng khớp.');
      return;
    }

    setLoading(true);
    try {
      const cleanPhone = (forgotPhone || '').trim().replace(/\s+/g, '');
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: cleanPhone,
          new_password: forgotNewPassword,
          confirm_password: forgotConfirmPassword
        })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg('Đặt lại mật khẩu thành công! Quý khách có thể đăng nhập ngay với mật khẩu mới.');
        setActiveTab('login');
        setLoginPhone(cleanPhone);
        setLoginPassword(forgotNewPassword);
        setForgotStep(1);
        setForgotOtp('');
        setForgotNewPassword('');
        setForgotConfirmPassword('');
      } else {
        setErrorMsg(data.message || 'Đặt lại mật khẩu thất bại.');
      }
    } catch (err) {
      setErrorMsg('Không thể kết nối máy chủ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      {/* Brand Header */}
      <AuthBrandHeader />

      
      {/* Messages */}
      {errorMsg && (
        <div className="bg-red-50 text-red-700 p-3.5 rounded-2xl border border-red-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
      {successMsg && (
        <div className="bg-emerald-50 text-emerald-800 p-3.5 rounded-2xl border border-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Login Form */}
      {activeTab === 'login' && (
        <LoginForm
          loginPhone={loginPhone}
          setLoginPhone={setLoginPhone}
          loginPassword={loginPassword}
          setLoginPassword={setLoginPassword}
          loading={loading}
          onSubmit={handleLogin}
          onForgotPassword={() => {
            setActiveTab('forgot');
            setForgotStep(1);
            setErrorMsg('');
            setSuccessMsg('');
          }}
        />
      )}

      {/* Forgot Password Form */}
      {activeTab === 'forgot' && (
        <ForgotPasswordWizard
          forgotStep={forgotStep}
          setForgotStep={setForgotStep}
          forgotPhone={forgotPhone}
          setForgotPhone={setForgotPhone}
          forgotOtp={forgotOtp}
          setForgotOtp={setForgotOtp}
          forgotNewPassword={forgotNewPassword}
          setForgotNewPassword={setForgotNewPassword}
          forgotConfirmPassword={forgotConfirmPassword}
          setForgotConfirmPassword={setForgotConfirmPassword}
          forgotCountdown={forgotCountdown}
          loading={loading}
          onSendOtp={handleSendOtp}
          onVerifyOtp={handleVerifyOtp}
          onResetPassword={handleResetPassword}
          onBackToLogin={() => {
            setActiveTab('login');
            setErrorMsg('');
            setSuccessMsg('');
          }}
        />
      )}

      {/* Hidden reCAPTCHA container for Firebase */}
      <div id="recaptcha-container"></div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-xs text-gray-400">Đang tải...</div>}>
      <AuthContent />
    </Suspense>
  );
}
