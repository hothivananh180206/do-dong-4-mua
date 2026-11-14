'use client';

import React from 'react';
import { ShoppingBag, Truck, ShieldCheck } from 'lucide-react';

export default function OrderSummaryCard({
  items = [],
  subtotal = 0,
  shippingFee = 0,
  totalAmount = 0
}) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-5 sticky top-24">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <h3 className="font-extrabold text-base text-gray-900 flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-brand-600" /> Tóm Tắt Đơn Hàng
        </h3>
        <span className="text-xs bg-gray-100 text-gray-600 font-bold px-2 py-0.5 rounded-full">
          {items.length} món
        </span>
      </div>

      {/* List of items */}
      <div className="divide-y divide-gray-100 max-h-72 overflow-y-auto pr-1">
        {items.map((item) => (
          <div key={item.id} className="py-3 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={item.thumbnail}
                alt={item.name}
                className="w-12 h-12 rounded-xl object-cover border border-gray-100 shrink-0"
              />
              <div className="truncate">
                <h4 className="font-bold text-gray-800 truncate">{item.name}</h4>
                <span className="text-gray-400 text-[11px]">
                  {item.price.toLocaleString('vi-VN')} đ x {item.quantity} {item.unit}
                </span>
              </div>
            </div>
            <span className="font-extrabold text-gray-900 shrink-0">
              {(item.price * item.quantity).toLocaleString('vi-VN')} đ
            </span>
          </div>
        ))}
      </div>

      {/* Subtotal & Shipping breakdown */}
      <div className="border-t border-gray-100 pt-3 space-y-2 text-xs">
        <div className="flex items-center justify-between text-gray-600">
          <span>Tổng tiền hàng:</span>
          <span className="font-semibold">{subtotal.toLocaleString('vi-VN')} đ</span>
        </div>
        <div className="flex items-center justify-between text-gray-600">
          <span className="flex items-center gap-1">
            <Truck className="w-3.5 h-3.5 text-brand-600" /> Phí vận chuyển GreenSM:
          </span>
          <span>
            {shippingFee === 0 ? (
              <span className="text-brand-600 font-bold">MIỄN PHÍ</span>
            ) : (
              `${shippingFee.toLocaleString('vi-VN')} đ`
            )}
          </span>
        </div>
        {shippingFee === 0 && (
          <p className="text-[10px] text-emerald-600 font-medium">
            ✨ Miễn phí vận chuyển giao hàng hỏa tốc GreenSM!
          </p>
        )}
        <div className="border-t border-gray-200 pt-3 flex items-baseline justify-between text-sm">
          <span className="font-bold text-gray-900">Tổng thanh toán:</span>
          <span className="text-xl font-black text-brand-700">
            {totalAmount.toLocaleString('vi-VN')} đ
          </span>
        </div>
      </div>

      <div className="bg-gray-50 p-3.5 rounded-2xl text-[11px] text-gray-500 space-y-1.5 border border-gray-100">
        <div className="flex items-center gap-1.5 text-brand-800 font-bold">
          <ShieldCheck className="w-4 h-4 text-brand-600" /> Cam kết chất lượng Đổ Đống 4 Mùa:
        </div>
        <p>• Trái cây tuyển chọn tươi ngon đúng mùa vụ, an toàn tuyệt đối.</p>
        <p>• Bao ăn 1 đổi 1 trong vòng 24 giờ nếu có quả sượng hoặc hỏng.</p>
      </div>
    </div>
  );
}

