'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, XCircle } from 'lucide-react';

import OrderHistorySearchBar from '@/components/order/OrderHistorySearchBar';
import OrderHistoryCard from '@/components/order/OrderHistoryCard';
import CancelOrderModal from '@/components/order/CancelOrderModal';
import { getAuthSession } from '@/lib/auth-session';

function OrderHistoryContent() {
  const searchParams = useSearchParams();
  const [phone, setPhone] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [cancelModalOrder, setCancelModalOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState('Đổi ý không mua nữa');
  const [cancelling, setCancelling] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
  };

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3800);
    return () => clearTimeout(timer);
  }, [toast]);

  // Auto-fill phone from logged-in user
  useEffect(() => {
    try {
      const u = getAuthSession();
      if (u && u.phone) {
        setPhone(u.phone);
        fetchOrders(u.phone);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const fetchOrders = async (lookupPhone) => {
    if (!lookupPhone) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/orders?phone=${encodeURIComponent(lookupPhone.trim())}`);
      const data = await res.json();
      if (data.success) {
        setOrders(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchOrders(phone);
  };

  const handleCancelOrder = async () => {
    if (!cancelModalOrder) return;
    setCancelling(true);
    try {
      const res = await fetch(`/api/orders/${cancelModalOrder.order_code}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'CANCEL', reason: cancelReason }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Hủy đơn hàng thành công!');
        setCancelModalOrder(null);
        fetchOrders(phone);
      } else {
        showToast(data.message || 'Lỗi hủy đơn', 'error');
      }
    } catch (e) {
      showToast('Lỗi kết nối máy chủ', 'error');
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
          <span>📦</span> Lịch Sử Đơn Hàng Của Bạn
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Tra cứu toàn bộ đơn hàng đã đặt theo Số điện thoại và theo dõi vận chuyển GreenSM
        </p>
      </div>

      {/* Search Bar */}
      <OrderHistorySearchBar
        phone={phone}
        setPhone={setPhone}
        loading={loading}
        onSearch={handleSearch}
      />

      {/* Results */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-32 bg-gray-100 rounded-3xl" />
          <div className="h-32 bg-gray-100 rounded-3xl" />
        </div>
      ) : searched && orders.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center space-y-3">
          <div className="text-5xl">🍉</div>
          <h3 className="font-bold text-gray-800 text-base">Không tìm thấy đơn hàng nào</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Số điện thoại <strong>{phone}</strong> chưa có đơn hàng nào trong hệ thống. Hãy dạo quanh cửa hàng và chọn trái cây bạn thích nhé!
          </p>
          <Link
            href="/"
            className="inline-block mt-2 px-5 py-2.5 bg-brand-600 text-white rounded-xl text-xs font-bold hover:bg-brand-700 transition"
          >
            Mua sắm ngay
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((ord) => (
            <OrderHistoryCard
              key={ord.id}
              order={ord}
              onOpenCancelModal={(orderToCancel) => setCancelModalOrder(orderToCancel)}
            />
          ))}
        </div>
      )}

      {/* Cancel Order Confirmation Modal */}
      <CancelOrderModal
        show={Boolean(cancelModalOrder)}
        onClose={() => setCancelModalOrder(null)}
        cancelReason={cancelReason}
        setCancelReason={setCancelReason}
        cancelling={cancelling}
        onConfirmCancel={handleCancelOrder}
      />

      {/* Toast Notification (Độ tương phản cao, nổi bật) */}
      {toast && typeof document !== 'undefined' && createPortal(
        <div className="fixed top-4 right-4 z-[9999] w-[calc(100vw-2rem)] max-w-md pointer-events-none">
          <div
            role={toast.type === 'error' ? 'alert' : 'status'}
            aria-live={toast.type === 'error' ? 'assertive' : 'polite'}
            className={`pointer-events-auto w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl shadow-2xl border transition-all animate-in slide-in-from-top-4 fade-in duration-200 ${
              toast.type === 'error'
                ? 'bg-rose-600 border-rose-400 text-white shadow-rose-950/40 ring-4 ring-rose-500/20'
                : 'bg-emerald-600 border-emerald-400 text-white shadow-emerald-950/40 ring-4 ring-emerald-500/20'
            }`}
          >
            <div className="shrink-0">
              {toast.type === 'error' ? (
                <div className="w-9 h-9 rounded-xl bg-white/20 text-white border border-white/30 flex items-center justify-center shadow-xs">
                  <XCircle className="w-5 h-5 stroke-[2.5]" />
                </div>
              ) : (
                <div className="w-9 h-9 rounded-xl bg-white/20 text-white border border-white/30 flex items-center justify-center shadow-xs">
                  <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                </div>
              )}
            </div>
            <div className="flex-1 pr-1">
              <span className="text-xs font-black font-sans text-white leading-relaxed drop-shadow-xs">
                {toast.message}
              </span>
            </div>
            <button
              onClick={() => setToast(null)}
              className="ml-auto p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/20 transition cursor-pointer text-xs font-bold"
              aria-label="Đóng thông báo"
            >
              ✕
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

export default function OrderHistoryPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-xs text-gray-400">Đang tải...</div>}>
      <OrderHistoryContent />
    </Suspense>
  );
}
