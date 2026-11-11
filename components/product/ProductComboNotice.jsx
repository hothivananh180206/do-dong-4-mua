'use client';

import React from 'react';
import { Package } from 'lucide-react';

export default function ProductComboNotice({ product }) {
  const isComboOrGift =
    product.category_id === 2 ||
    product.category_id === 3 ||
    product.name?.toLowerCase().includes('combo') ||
    product.name?.toLowerCase().includes('giỏ');

  if (!isComboOrGift) return null;

  return (
    <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 flex items-start gap-3 text-amber-900 text-xs shadow-sm">
      <Package className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
      <div>
        <span className="font-bold">Quy chuẩn đóng gói cố định:</span> Thành phần trái cây trong{' '}
        {product.category_id === 3 || product.name?.toLowerCase().includes('giỏ') ? 'giỏ quà' : 'combo'}{' '}
        đã được tuyển chọn và định lượng sẵn theo tiêu chuẩn chất lượng của cửa hàng, không hỗ trợ thay đổi thành phần riêng lẻ.
      </div>
    </div>
  );
}

