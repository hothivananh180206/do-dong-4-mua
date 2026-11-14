'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function GlobalErrorBoundary({ error, reset }) {
  useEffect(() => {
    // Chỉ báo lỗi ở màn hình dòng lệnh Terminal máy chủ, không hiển thị ra ngoài giao diện
    console.error('[Terminal Error Log]:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto shadow-sm">
          <AlertTriangle className="w-8 h-8 stroke-[2.2]" />
        </div>

        <div>
          <h2 className="text-xl font-heading font-black text-slate-900 tracking-tight">
            Có lỗi xảy ra khi tải trang
          </h2>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            Hệ thống đang gặp gián đoạn tạm thời. Vui lòng bấm thử lại hoặc quay về trang chủ.
          </p>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition cursor-pointer shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Thử lại</span>
          </button>
          <Link
            href="/"
            className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Trang chủ</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
