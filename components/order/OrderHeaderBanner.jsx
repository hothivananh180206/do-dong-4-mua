'use client';

import React from 'react';
import { CheckCircle2, Clock, XCircle, RefreshCw } from 'lucide-react';

export default function OrderHeaderBanner({
  order,
  isCancelled,
  isPaused,
  isUnpaidVietQr,
  isWaitingPayment,
  isWaitingConfirm,
  onOpenCancelModal,
  onRefresh,
}) {
  return (
    <div
      className={`text-white p-6 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 ${
        isCancelled
          ? 'bg-red-600'
          : isPaused
          ? 'bg-amber-600'
          : isUnpaidVietQr
          ? 'bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700'
          : 'bg-emerald-600'
      }`}
    >
      <div className="flex items-center gap-4 text-center sm:text-left">
        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white shrink-0">
          {isCancelled ? (
            <XCircle className="w-7 h-7" />
          ) : isUnpaidVietQr ? (
            <Clock className="w-7 h-7 animate-pulse" />
          ) : (
            <CheckCircle2 className="w-7 h-7" />
          )}
        </div>
        <div>
          <h1 className="text-lg sm:text-xl font-black">
            {isCancelled
              ? 'Đơn Hàng Đã Bị Hủy'
              : isPaused
              ? 'Đơn Hàng Đang Tạm Dừng Xử Lý'
              : isWaitingPayment || isUnpaidVietQr
              ? 'Đơn Hàng Chờ Thanh Toán VietQR'
              : isWaitingConfirm
              ? 'Đơn Hàng Chờ Xác Nhận (COD)'
              : 'Đơn Hàng Đang Được Xử Lý!'}
          </h1>
          <p className="text-xs text-white/90 mt-0.5">
            {isWaitingPayment || isUnpaidVietQr ? (
              <>
                Mã đơn hàng: <strong className="text-white font-mono">{order.order_code}</strong> • Vui lòng quét mã QR bên dưới để hoàn tất thanh toán
              </>
            ) : isWaitingConfirm ? (
              <>
                Mã đơn hàng: <strong className="text-white font-mono">{order.order_code}</strong> • Cửa hàng đã ghi nhận đơn COD, nhân viên sẽ sớm xác nhận
              </>
            ) : (
              <>
                Mã đơn hàng: <strong className="text-white font-mono">{order.order_code}</strong>
              </>
            )}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {['CHO_THANH_TOAN', 'CHO_XAC_NHAN'].includes(order.order_status) && (
          <button
            onClick={onOpenCancelModal}
            className="px-3.5 py-2 bg-red-700/80 hover:bg-red-800 text-white rounded-xl text-xs font-bold transition border border-red-500 shadow-md cursor-pointer"
          >
            Hủy đơn này
          </button>
        )}
        <button
          onClick={onRefresh}
          className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition border border-white/20 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Làm mới
        </button>
      </div>
    </div>
  );
}

