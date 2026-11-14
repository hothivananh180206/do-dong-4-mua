'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { auth, formatPhoneForE164, initRecaptchaVerifier, resetRecaptchaVerifier, signInWithPhoneNumber } from '@/lib/firebase';
import { useCart } from '@/components/CartContext';
import { getAuthSession, saveAuthSession } from '@/lib/auth-session';
import DeliveryAddressForm from '@/components/checkout/DeliveryAddressForm';
import PaymentMethodSelector from '@/components/checkout/PaymentMethodSelector';
import OrderSummaryCard from '@/components/checkout/OrderSummaryCard';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart, isLoaded } = useCart();

  const [branches, setBranches] = useState([]);
  const [formData, setFormData] = useState({
    receiver_name: '',
    phone: '',
    address: '',
    note: '',
    branch_id: 1,
    payment_method: 'COD',
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [otpError, setOtpError] = useState('');

  // Password for new guest auto-created account (FR-024 / BR-008)
  const [customerPassword, setCustomerPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Current logged in user
  const [currentUser, setCurrentUser] = useState(null);

  // Phone existence & OTP verification states
  const [phoneCheckLoading, setPhoneCheckLoading] = useState(false);
  const [phoneExists, setPhoneExists] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const [orderSuccess, setOrderSuccess] = useState(false);

  // Countdown for resending OTP
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Load user from localStorage if logged in
  useEffect(() => {
    try {
      const u = getAuthSession();
      if (u) {
        setCurrentUser(u);
        setFormData((prev) => ({
          ...prev,
          receiver_name: u.full_name || '',
          phone: u.phone || '',
          address: u.address || ''
        }));
      } else {
        const draft = sessionStorage.getItem('dodong4mua_checkout_draft');
        if (draft) {
          const d = JSON.parse(draft);
          setFormData((prev) => ({
            ...prev,
            receiver_name: d.receiver_name || '',
            phone: d.phone || '',
            address: d.address || '',
            note: d.note || '',
            branch_id: d.branch_id || 1,
            payment_method: d.payment_method || 'COD',
          }));
        }
      }
    } catch (e) {
      console.error('Failed to parse user or draft', e);
    }
  }, []);

  // Lưu bản nháp
  useEffect(() => {
    try {
      if (formData.receiver_name || formData.phone || formData.address) {
        sessionStorage.setItem('dodong4mua_checkout_draft', JSON.stringify(formData));
      }
    } catch (e) {
      console.warn('Failed to save checkout draft', e);
    }
  }, [formData]);

  // Check phone existence
  const checkPhoneStatus = async (inputPhone) => {
    const raw = inputPhone !== undefined ? inputPhone : formData.phone;
    const cleanPhone = (raw || '').trim().replace(/[\s\.\-]+/g, '');
    const phoneRegex = /^(0|\+84)[0-9]{9}$/;
    if (!phoneRegex.test(cleanPhone)) return;

    if (currentUser && currentUser.phone === cleanPhone) {
      setPhoneExists(false);
      return;
    }

    setPhoneCheckLoading(true);
    try {
      const res = await fetch(`/api/auth/check-phone?phone=${encodeURIComponent(cleanPhone)}`);
      const data = await res.json();
      if (data.exists) {
        setPhoneExists(true);
        setOtpVerified(false);
        setOtpError('Số điện thoại này đã có tài khoản trên hệ thống. Vui lòng đăng nhập để tiếp tục đặt hàng!');
        setErrorMsg('Số điện thoại này đã có tài khoản trên hệ thống. Vui lòng đăng nhập để tiếp tục đặt hàng!');
      } else {
        setPhoneExists(false);
        setOtpError('');
        setErrorMsg('');
      }
    } catch (err) {
      console.error('Check phone error', err);
    } finally {
      setPhoneCheckLoading(false);
    }
  };

  // Send OTP
  const handleSendOtp = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setOtpError('');

    const cleanPhone = formData.phone.trim().replace(/[\s\.\-]+/g, '');
    const phoneRegex = /^(0|\+84)[0-9]{9}$/;
    if (!phoneRegex.test(cleanPhone)) {
      setOtpError('Số điện thoại không đúng định dạng (yêu cầu 10 chữ số).');
      return;
    }

    setSendingOtp(true);
    try {
      const checkRes = await fetch(`/api/auth/check-phone?phone=${encodeURIComponent(cleanPhone)}`);
      const checkData = await checkRes.json();
      if (checkData.exists) {
        setPhoneExists(true);
        setOtpError('Số điện thoại này đã có tài khoản trên hệ thống. Vui lòng đăng nhập để tiếp tục đặt hàng!');
        setErrorMsg('Số điện thoại này đã có tài khoản trên hệ thống. Vui lòng đăng nhập để tiếp tục đặt hàng!');
        setSendingOtp(false);
        return;
      }

      const verifier = initRecaptchaVerifier('recaptcha-container');
      const e164Phone = formatPhoneForE164(cleanPhone);

      const confirmation = await signInWithPhoneNumber(auth, e164Phone, verifier);
      setConfirmationResult(confirmation);
      setOtpSent(true);
      setCountdown(60);
      setSuccessMsg(`Đã gửi mã SMS xác thực đến ${cleanPhone}. Quý khách vui lòng kiểm tra tin nhắn.`);
    } catch (err) {
      console.error('Send OTP error:', err);
      resetRecaptchaVerifier('recaptcha-container');
      setOtpError(err.message || 'Không thể gửi mã SMS. Vui lòng thử lại!');
      setErrorMsg(err.message || 'Không thể gửi mã SMS. Vui lòng thử lại!');
    } finally {
      setSendingOtp(false);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setOtpError('');

    if (!otpCode || otpCode.trim().length < 6) {
      setOtpError('Vui lòng nhập đủ 6 chữ số mã OTP từ tin nhắn SMS.');
      return;
    }

    if (!confirmationResult) {
      setOtpError('Phiên xác thực đã hết hạn hoặc chưa được gửi. Vui lòng bấm nhận lại mã.');
      return;
    }

    setVerifyingOtp(true);
    try {
      await confirmationResult.confirm(otpCode.trim());
      setOtpVerified(true);
      setSuccessMsg('Số điện thoại đã được xác thực thành công!');
    } catch (err) {
      console.error('Verify OTP error:', err);
      setOtpError('Mã OTP không chính xác hoặc đã hết hạn.');
    } finally {
      setVerifyingOtp(false);
    }
  };

  // Mặc định 0đ theo chính sách hỗ trợ giao hàng toàn bộ đơn hàng (Sẵn sàng tích hợp API đo khoảng cách)
  const shippingFee = 0;
  const totalAmount = subtotal + shippingFee;

  useEffect(() => {
    fetch('/api/branches')
      .then((res) => res.json())
      .then((d) => {
        if (d.success) setBranches(d.data);
      })
      .catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!items.length) {
      setErrorMsg('Giỏ hàng đang trống!');
      return;
    }

    if (!formData.receiver_name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      setErrorMsg('Vui lòng điền họ tên, số điện thoại và địa chỉ nhận hàng.');
      return;
    }

    if (phoneExists) {
      setErrorMsg('Số điện thoại này đã có tài khoản trên hệ thống. Vui lòng đăng nhập để đặt hàng!');
      return;
    }

    if (!currentUser && !otpVerified) {
      setErrorMsg('Quý khách là khách hàng mới. Vui lòng xác thực số điện thoại bằng mã OTP qua SMS trước khi đặt hàng!');
      return;
    }

    const cleanPhone = formData.phone.trim().replace(/[\s\.\-]+/g, '');
    const phoneRegex = /^(0|\+84)[0-9]{9}$/;
    if (!phoneRegex.test(cleanPhone)) {
      setErrorMsg('Số điện thoại không đúng định dạng (yêu cầu 10 chữ số).');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          password: customerPassword.trim() || '123456',
          user_id: currentUser ? currentUser.id : null,
          note: formData.note.trim(),
          items: items.map((i) => ({ id: i.id, quantity: i.quantity })),
        }),
      });

      const data = await res.json();
      if (data.success) {
        if (data.data?.is_new_account && data.data?.user) {
          try {
            saveAuthSession(data.data.user);
          } catch (storageErr) {
            console.error('Failed to save user session', storageErr);
          }
        }

        setOrderSuccess(true);
        clearCart();
        try {
          sessionStorage.removeItem('dodong4mua_checkout_draft');
        } catch (e) {}
        const pwdParam = encodeURIComponent(data.data?.initial_password || customerPassword.trim() || '123456');
        const querySuffix = data.data?.is_new_account ? `?new_account=1&pwd=${pwdParam}` : '';
        const targetUrl = `/don-hang/${data.data.order_code}${querySuffix}`;
        router.push(targetUrl);
      } else {
        setErrorMsg(data.message || 'Có lỗi xảy ra khi tạo đơn hàng');
      }
    } catch (err) {
      console.error('Order submission error:', err);
      setErrorMsg('Không thể kết nối đến máy chủ. Vui lòng thử lại!');
    } finally {
      setSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="max-w-lg mx-auto px-4 py-32 text-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin mx-auto text-brand-600" />
        <h2 className="text-base font-bold text-gray-800">Đặt hàng thành công!</h2>
        <p className="text-xs text-gray-400">Đang chuyển đến trang chi tiết và thanh toán đơn hàng...</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="max-w-lg mx-auto px-4 py-32 text-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin mx-auto text-brand-600" />
        <h2 className="text-base font-bold text-gray-800">Đang tải thông tin đơn hàng...</h2>
        <p className="text-xs text-gray-400">Vui lòng chờ trong giây lát</p>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center space-y-4">
        <div className="text-5xl">🧺</div>
        <h2 className="text-xl font-bold text-gray-800">Giỏ hàng của bạn đang trống</h2>
        <p className="text-xs text-gray-500">Hãy thêm một vài loại trái cây tươi ngon trước khi đặt hàng nhé.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white rounded-xl text-xs font-bold hover:bg-brand-700 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Khám phá trái cây
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Link href="/" className="hover:text-brand-600">Trang chủ</Link>
        <span>/</span>
        <span className="text-gray-900 font-bold">Đặt hàng & Thanh toán</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Delivery & Payment Details */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            <DeliveryAddressForm
              formData={formData}
              setFormData={setFormData}
              branches={branches}
              currentUser={currentUser}
              phoneExists={phoneExists}
              phoneCheckLoading={phoneCheckLoading}
              checkPhoneStatus={checkPhoneStatus}
              otpSent={otpSent}
              otpCode={otpCode}
              setOtpCode={setOtpCode}
              otpVerified={otpVerified}
              sendingOtp={sendingOtp}
              verifyingOtp={verifyingOtp}
              countdown={countdown}
              handleSendOtp={handleSendOtp}
              handleVerifyOtp={handleVerifyOtp}
              otpError={otpError}
              successMsg={successMsg}
              customerPassword={customerPassword}
              setCustomerPassword={setCustomerPassword}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
            />

            <PaymentMethodSelector
              paymentMethod={formData.payment_method}
              onChange={(method) => setFormData({ ...formData, payment_method: method })}
            />

            {errorMsg && (
              <div className="bg-red-50 text-red-700 p-4 rounded-2xl border border-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-black text-sm shadow-xl shadow-brand-600/30 transition transform active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
            >
              {submitting ? (
                <span>Đang xử lý đơn hàng...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Xác Nhận Đặt Hàng ({totalAmount.toLocaleString('vi-VN')} đ)</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Summary */}
        <div className="lg:col-span-5">
          <OrderSummaryCard
            items={items}
            subtotal={subtotal}
            shippingFee={shippingFee}
            totalAmount={totalAmount}
          />
        </div>
      </div>

      <div id="recaptcha-container"></div>
    </div>
  );
}
