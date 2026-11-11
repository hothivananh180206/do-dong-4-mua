'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, ArrowLeft } from 'lucide-react';

import BranchCard from '@/components/branch/BranchCard';

export default function BranchesPage() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/branches')
      .then(r => r.json())
      .then(d => {
        if (d.success) setBranches(d.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-brand-100 text-brand-800 text-xs font-bold uppercase tracking-wider">
          <MapPin className="w-3.5 h-3.5" /> Hệ Thống Cửa Hàng
        </div>
        <h1 className="text-3xl font-black text-gray-900">
          Chi Nhánh Trái Cây Đổ Đống 4 Mùa
        </h1>
        <p className="text-xs text-gray-500 leading-relaxed">
          Đón tiếp quý khách đến trực tiếp trải nghiệm lựa chọn từng quả tươi ngon hoặc giao hỏa tốc 2 giờ qua xe điện GreenSM từ chi nhánh gần nhất.
        </p>
      </div>

      {/* Branch Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {branches.map((b) => (
          <BranchCard key={b.id} branch={b} />
        ))}
      </div>

      {/* Back button */}
      <div className="text-center pt-6">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-brand-700 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Quay lại trang chủ
        </Link>
      </div>
    </div>
  );
}
