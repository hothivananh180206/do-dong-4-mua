'use client';

import React from 'react';

export default function OrderItemsTable({ items }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
      <h3 className="font-bold text-sm text-gray-900">Chi Tiết Sản Phẩm Trong Đơn</h3>
      <div className="divide-y divide-gray-100">
        {items.map((item) => {
          const unitPrice = parseFloat(item.unit_price) || 0;
          const qty = item.quantity || 1;
          const totalPrice = parseFloat(item.subtotal || item.total_price || (unitPrice * qty) || 0);

          return (
            <div key={item.id} className="py-3 flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <img
                  src={item.thumbnail}
                  alt={item.product_name}
                  className="w-12 h-12 rounded-xl object-cover border border-gray-100"
                />
                <div>
                  <h4 className="font-bold text-gray-800">{item.product_name}</h4>
                  <p className="text-gray-400 text-[11px]">
                    {unitPrice.toLocaleString('vi-VN')} đ x {qty} {item.unit}
                  </p>
                </div>
              </div>
              <span className="font-extrabold text-gray-900">
                {totalPrice.toLocaleString('vi-VN')} đ
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

