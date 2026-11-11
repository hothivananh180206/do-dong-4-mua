'use client';

import React from 'react';
import { Truck, RotateCcw, ShieldCheck } from 'lucide-react';

export default function ProductTrustBadges() {
  return (
    <div className="grid grid-cols-3 gap-4 pt-5 border-t border-gray-100 text-center">
      <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1.5">
        <Truck className="w-6 h-6 text-brand-600 mx-auto" />
        <div className="font-black text-gray-900">GreenSM 2H</div>
        <div className="text-gray-500 font-medium">Giao tươi tận cửa</div>
      </div>
      <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1.5">
        <RotateCcw className="w-6 h-6 text-brand-600 mx-auto" />
        <div className="font-black text-gray-900">Bao ăn 1 đổi 1</div>
        <div className="text-gray-500 font-medium">Trong vòng 24 giờ</div>
      </div>
      <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1.5">
        <ShieldCheck className="w-6 h-6 text-brand-600 mx-auto" />
        <div className="font-black text-gray-900">Chuẩn Tươi Ngon</div>
        <div className="text-gray-500 font-medium">An toàn tuyệt đối</div>
      </div>
    </div>
  );
}

