'use client';

import React from 'react';
import { X } from 'lucide-react';

export default function FullQrModal({
  show,
  onClose,
  orderCode,
  totalAmount,
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200 border border-gray-100 text-center">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="text-left">
            <h3 className="font-black text-base text-gray-900">Mã QR Thanh Toán Khổ Cực Đại</h3>
            <p className="text-xs text-gray-500 font-mono">Đơn hàng: {orderCode} • MB: 0929894248</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="w-80 h-80 sm:w-[440px] sm:h-[440px] mx-auto bg-white p-3 rounded-2xl shadow-inner border-2 border-emerald-300 flex items-center justify-center">
          <img
            src={`https://img.vietqr.io/image/MB-0929894248-compact2.png?amount=${totalAmount}&addInfo=DODONG4MUA%20${orderCode}&accountName=TRAN%20VU`}
            alt="VietQR MB Bank Full"
            className="w-full h-full object-contain"
          />
        </div>

        <p className="text-xs text-gray-600 font-medium">
          Bạn có thể đưa camera điện thoại lại gần màn hình để quét mã siêu nhanh!
        </p>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold text-xs transition cursor-pointer"
        >
          Đóng lại
        </button>
      </div>
    </div>
  );
}

