'use client';

import React from 'react';
import Link from 'next/link';

export default function OrderCostSummary({ order }) {
  const subtotal = parseFloat(order.subtotal) || 0;
  const shippingFee = parseFloat(order.shipping_fee) || 0;
  const totalAmount = parseFloat(order.total_amount) || 0;

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4 text-xs">
      <h3 className="font-bold text-sm text-gray-900 border-b border-gray-100 pb-2">
        Tổng Kết Chi Phí
      </h3>
      <div className="space-y-2">
        <div className="flex justify-between text-gray-600">
          <span>Tiền hàng:</span>
          <span className="font-semibold">{subtotal.toLocaleString('vi-VN')} đ</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Phí vận chuyển GreenSM:</span>
          <span>
            {shippingFee === 0 ? (
              <strong className="text-brand-600">MIỄN PHÍ</strong>
            ) : (
              `${shippingFee.toLocaleString('vi-VN')} đ`
            )}
          </span>
        </div>
        <div className="border-t border-gray-100 pt-3 flex justify-between items-baseline text-sm">
          <span className="font-bold text-gray-900">Tổng thanh toán:</span>
          <span className="text-lg font-black text-brand-700">
            {totalAmount.toLocaleString('vi-VN')} đ
          </span>
        </div>
      </div>
      <div className="pt-2 flex gap-2">
        <Link
          href="/lich-su-don-hang"
          className="flex-1 py-2.5 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-center block transition cursor-pointer"
        >
          Xem tất cả đơn
        </Link>
        <Link
          href="/"
          className="flex-1 py-2.5 px-3 bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold rounded-xl text-center block transition border border-brand-200 cursor-pointer"
        >
          Tiếp tục mua sắm
        </Link>
      </div>
    </div>
  );
}

