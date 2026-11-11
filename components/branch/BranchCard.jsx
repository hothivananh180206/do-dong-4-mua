'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Clock, Truck } from 'lucide-react';

export default function BranchCard({ branch }) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-xl transition-all duration-300">
      <div className="relative aspect-video bg-gray-100 overflow-hidden">
        <img
          src={
            branch.id === 1
              ? 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800&auto=format&fit=crop&q=80'
              : 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80'
          }
          alt={branch.branch_name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4 bg-brand-600 text-white text-xs font-black px-3 py-1 rounded-full shadow-md">
          {branch.id === 1 ? '🌟 Trụ Sở Chính' : '📍 Chi Nhánh Trung Tâm'}
        </div>
      </div>

      <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          <h3 className="font-extrabold text-lg text-gray-900">{branch.branch_name}</h3>
          <div className="space-y-2 text-xs text-gray-600">
            <p className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
              <span>
                <strong>Địa chỉ:</strong> {branch.address}
              </span>
            </p>
            <p className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-brand-600 shrink-0" />
              <span>
                <strong>Điện thoại:</strong>{' '}
                <a href={`tel:${branch.phone}`} className="text-brand-700 font-bold hover:underline">
                  {branch.phone}
                </a>
              </span>
            </p>
            <p className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-brand-600 shrink-0" />
              <span>
                <strong>Giờ mở cửa:</strong> 07:00 – 21:30 (Tất cả các ngày trong tuần)
              </span>
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
          <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <Truck className="w-3.5 h-3.5" /> Điểm xuất hàng hỏa tốc GreenSM
          </span>
          <Link
            href="/"
            className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl transition"
          >
            Mua hàng tại đây
          </Link>
        </div>
      </div>
    </div>
  );
}

