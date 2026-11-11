'use client';

import React, { useState, useEffect, use, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';

import OrderAutoAccountBanner from '@/components/order/OrderAutoAccountBanner';
import OrderHeaderBanner from '@/components/order/OrderHeaderBanner';
import OrderVietQrBox from '@/components/order/OrderVietQrBox';
import OrderTrackingStepper from '@/components/order/OrderTrackingStepper';
import OrderDeliveryAndPaymentInfo from '@/components/order/OrderDeliveryAndPaymentInfo';
import OrderCostSummary from '@/components/order/OrderCostSummary';
import OrderItemsTable from '@/components/order/OrderItemsTable';
import ChangePasswordModal from '@/components/order/ChangePasswordModal';
import CancelOrderModal from '@/components/order/CancelOrderModal';
import FullQrModal from '@/components/order/FullQrModal';

function OrderDetailContent({ code }) {
  const searchParams = useSearchParams();
  const isNewAccount = searchParams.get('new_account') === '1';
  const initialPwd = searchParams.get('pwd') || '123456';

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('Đổi ý không mua nữa');
  const [cancelling, setCancelling] = useState(false);
  const [toast, setToast] = useState(null);

  // Auto-created account password state & modal
  const [currentPassword, setCurrentPassword] = useState(initialPwd);
  const [copiedPwd, setCopiedPwd] = useState(false);
  const [showChangePwdModal, setShowChangePwdModal] = useState(false);
  const [oldPwdInput, setOldPwdInput] = useState(initialPwd);
  const [newPwdInput, setNewPwdInput] = useState('');
  const [confirmPwdInput, setConfirmPwdInput] = useState('');
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [changingPwd, setChangingPwd] = useState(false);
  const [changePwdError, setChangePwdError] = useState('');

  const [copiedField, setCopiedField] = useState(null);
  const [showFullQrModal, setShowFullQrModal] = useState(false);

  const handleCopyText = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    showToast(`Đã sao chép ${fieldName}!`, 'success');
    setTimeout(() => setCopiedField(null), 2000);
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3800);
  };

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${code}`);
      const data = await res.json();
      if (data.success) {
        setOrder(data.data);
      }
    } catch (e) {
      console.error('Failed to load order', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [code]);

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(currentPassword);
    setCopiedPwd(true);
    showToast('Đã sao chép mật khẩu vào bộ nhớ tạm!', 'success');
    setTimeout(() => setCopiedPwd(false), 2500);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setChangePwdError('');

    if (!newPwdInput || newPwdInput.length < 8) {
      setChangePwdError('Mật khẩu mới phải có tối thiểu 8 ký tự.');
      return;
    }
    if (!/[A-Z]/.test(newPwdInput) || !/[a-z]/.test(newPwdInput) || !/[0-9]/.test(newPwdInput)) {
      setChangePwdError('Mật khẩu mới phải chứa ít nhất 1 chữ in hoa, 1 chữ in thường và 1 chữ số.');
      return;
    }

    if (newPwdInput !== confirmPwdInput) {
      setChangePwdError('Xác nhận mật khẩu mới không khớp.');
      return;
    }

    setChangingPwd(true);
    try {
      const res = await fetch('/api/customer/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: order?.user_id,
          old_password: oldPwdInput,
          new_password: newPwdInput,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setCurrentPassword(newPwdInput);
        setShowChangePwdModal(false);
        setNewPwdInput('');
        setConfirmPwdInput('');
        showToast('Đổi mật khẩu thành công! Quý khách vui lòng ghi nhớ mật khẩu mới nhé.', 'success');
      } else {
        setChangePwdError(data.message || 'Đổi mật khẩu thất bại.');
      }
    } catch (err) {
      setChangePwdError('Không thể kết nối máy chủ.');
    } finally {
      setChangingPwd(false);
    }
  };

  const handleCancelOrder = async () => {
    setCancelling(true);
    try {
      const res = await fetch(`/api/orders/${code}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'CANCEL', reason: cancelReason }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Hủy đơn hàng thành công! Tồn kho đã được hoàn lại.', 'success');
        setShowCancelModal(false);
        fetchOrder();
      } else {
        showToast(data.message || 'Hủy đơn thất bại', 'error');
      }
    } catch (e) {
      showToast('Không thể kết nối máy chủ', 'error');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/3" />
        <div className="h-48 bg-gray-200 rounded-3xl" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="text-5xl">🔍</div>
        <h2 className="text-xl font-bold text-gray-800">Không tìm thấy đơn hàng</h2>
        <p className="text-xs text-gray-500">Mã đơn &quot;{code}&quot; không có trong cơ sở dữ liệu.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white rounded-xl text-xs font-bold hover:bg-brand-700"
        >
          <ArrowLeft className="w-4 h-4" /> Về trang chủ
        </Link>
      </div>
    );
  }

  // Progress Steps - FR-026 & FR-027
  const isQrOrder = order.order_status === 'CHO_THANH_TOAN' || order.payment_method === 'VIETQR';
  const steps = [
    { 
      key: isQrOrder ? 'CHO_THANH_TOAN' : 'CHO_XAC_NHAN', 
      label: isQrOrder ? 'Chờ thanh toán' : 'Chờ xác nhận', 
      desc: isQrOrder ? 'Quét mã VietQR' : 'Chờ tiếp nhận' 
    },
    { key: 'DA_XAC_NHAN', label: 'Đã duyệt', desc: 'Cửa hàng xác nhận' },
    { key: 'DANG_CHUAN_BI', label: 'Đang đóng gói', desc: 'Chọn trái cây tươi' },
    { key: 'DANG_GIAO', label: 'Đang giao GreenSM', desc: 'Tài xế di chuyển' },
    { key: 'DA_GIAO', label: 'Hoàn tất', desc: 'Đã nhận trái cây' },
  ];

  const statusHierarchy = {
    CHO_THANH_TOAN: 1,
    CHO_XAC_NHAN: 1,
    DA_XAC_NHAN: 2,
    DANG_CHUAN_BI: 3,
    TAM_DUNG: 3,
    DANG_GIAO: 4,
    DA_GIAO: 5,
    DA_HUY: -1,
  };

  const currentLevel = statusHierarchy[order.order_status] ?? 1;
  const isWaitingPayment = order.order_status === 'CHO_THANH_TOAN';
  const isWaitingConfirm = order.order_status === 'CHO_XAC_NHAN';
  const isCancelled = order.order_status === 'DA_HUY';
  const isPaused = order.order_status === 'TAM_DUNG';
  const isUnpaidVietQr = !isCancelled && (order.payment_method === 'VIETQR' || isWaitingPayment) && order.payment_status !== 'PAID';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Auto-created account banner */}
      {isNewAccount && (
        <OrderAutoAccountBanner
          phone={order.phone}
          currentPassword={currentPassword}
          copiedPwd={copiedPwd}
          onCopyPassword={handleCopyPassword}
          onOpenChangePwdModal={() => {
            setOldPwdInput(currentPassword);
            setShowChangePwdModal(true);
          }}
        />
      )}

      {/* Top Banner */}
      <OrderHeaderBanner
        order={order}
        isCancelled={isCancelled}
        isPaused={isPaused}
        isUnpaidVietQr={isUnpaidVietQr}
        isWaitingPayment={isWaitingPayment}
        isWaitingConfirm={isWaitingConfirm}
        onOpenCancelModal={() => setShowCancelModal(true)}
        onRefresh={fetchOrder}
      />

      {/* VietQR Box */}
      {!isCancelled && order.payment_method === 'VIETQR' && (
        <OrderVietQrBox
          order={order}
          copiedField={copiedField}
          onCopyText={handleCopyText}
          onOpenFullQr={() => setShowFullQrModal(true)}
          onRefresh={() => {
            fetchOrder();
            showToast('Đang làm mới trạng thái đơn hàng...', 'info');
          }}
        />
      )}

      {/* Visual Tracking Stepper */}
      <OrderTrackingStepper
        order={order}
        isCancelled={isCancelled}
        steps={steps}
        currentLevel={currentLevel}
      />

      {/* Delivery Info & Cost Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <OrderDeliveryAndPaymentInfo order={order} />
        <OrderCostSummary order={order} />
      </div>

      {/* Item List */}
      <OrderItemsTable items={order.items} />

      {/* Modals */}
      <ChangePasswordModal
        show={showChangePwdModal}
        onClose={() => setShowChangePwdModal(false)}
        oldPwdInput={oldPwdInput}
        setOldPwdInput={setOldPwdInput}
        newPwdInput={newPwdInput}
        setNewPwdInput={setNewPwdInput}
        confirmPwdInput={confirmPwdInput}
        setConfirmPwdInput={setConfirmPwdInput}
        showNewPwd={showNewPwd}
        setShowNewPwd={setShowNewPwd}
        changingPwd={changingPwd}
        changePwdError={changePwdError}
        onSubmit={handleChangePassword}
      />

      <CancelOrderModal
        show={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        cancelReason={cancelReason}
        setCancelReason={setCancelReason}
        cancelling={cancelling}
        onConfirmCancel={handleCancelOrder}
      />

      <FullQrModal
        show={showFullQrModal}
        onClose={() => setShowFullQrModal(false)}
        orderCode={order.order_code}
        totalAmount={parseFloat(order.total_amount) || 0}
      />

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-[9999] animate-in slide-in-from-top-4 fade-in duration-300 max-w-sm">
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/95 backdrop-blur-md text-slate-800 shadow-2xl border border-slate-100/90 shadow-slate-900/10">
            <div className="shrink-0">
              {toast.type === 'error' ? (
                <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-500 border border-rose-100 flex items-center justify-center">
                  <XCircle className="w-4 h-4" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              )}
            </div>
            <span className="text-xs font-bold font-sans text-slate-800">
              {toast.message}
            </span>
            <button
              onClick={() => setToast(null)}
              className="ml-auto p-1 rounded-lg text-slate-400 hover:text-slate-600 transition cursor-pointer text-xs"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrderDetailPage({ params }) {
  const resolvedParams = use(params);

  return (
    <Suspense
      fallback={
        <div className="max-w-4xl mx-auto px-4 py-20 animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-48 bg-gray-200 rounded-3xl" />
        </div>
      }
    >
      <OrderDetailContent code={resolvedParams.code} />
    </Suspense>
  );
}
