'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, RefreshCw, LayoutDashboard } from 'lucide-react';

export default function AdminErrorBoundary({ error, reset }) {
  useEffect(() => {
    // Chỉ báo lỗi ở màn hình dòng lệnh Terminal máy chủ, không hiển thị ra ngoài giao diện
    console.error('[Terminal Admin Error Log]:', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6 bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto shadow-sm">
          <AlertTriangle className="w-8 h-8 stroke-[2.2]" />
        </div>

        <div>
          <h2 className="text-xl font-heading font-black text-slate-900 tracking-tight">
            Hệ thống tạm thời bị gián đoạn
          </h2>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            Phân hệ quản trị gặp sự cố khi xử lý dữ liệu. Vui lòng bấm thử lại hoặc quay lại trang tổng quan.
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
          <button
            type="button"
            onClick={() => {
              window.location.href = '/admin?tab=orders';
            }}
            className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Về Tab Đơn Hàng</span>
          </button>
        </div>
      </div>
    </div>
  );
}
