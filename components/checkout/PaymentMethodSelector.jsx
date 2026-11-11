'use client';

import React from 'react';

export default function PaymentMethodSelector({
  paymentMethod = 'COD',
  onChange
}) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
      <h3 className="font-extrabold text-base text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
        <span className="w-6 h-6 rounded-full bg-brand-600 text-white text-xs flex items-center justify-center font-bold">2</span>
        Phương Thức Thanh Toán
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* COD */}
        <label
          className={`p-4 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
            paymentMethod === 'COD'
              ? 'border-brand-600 bg-brand-50/70 text-brand-900 ring-2 ring-brand-600'
              : 'border-gray-200 hover:bg-gray-50 text-gray-700'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">💵</span>
            <input
              type="radio"
              name="payment_method"
              value="COD"
              checked={paymentMethod === 'COD'}
              onChange={() => onChange('COD')}
              className="text-brand-600"
            />
          </div>
          <div>
            <div className="font-bold text-sm">Thanh toán COD</div>
            <div className="text-xs text-gray-500">Trả tiền mặt khi nhận hàng</div>
          </div>
        </label>

        {/* VietQR */}
        <label
          className={`p-4 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
            paymentMethod === 'VIETQR'
              ? 'border-brand-600 bg-brand-50/70 text-brand-900 ring-2 ring-brand-600'
              : 'border-gray-200 hover:bg-gray-50 text-gray-700'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">📲</span>
            <input
              type="radio"
              name="payment_method"
              value="VIETQR"
              checked={paymentMethod === 'VIETQR'}
              onChange={() => onChange('VIETQR')}
              className="text-brand-600"
            />
          </div>
          <div>
            <div className="font-bold text-sm">Mã VietQR 24/7</div>
            <div className="text-xs text-gray-500">Quét mã chuyển khoản tức thì</div>
          </div>
        </label>
      </div>
    </div>
  );
}

