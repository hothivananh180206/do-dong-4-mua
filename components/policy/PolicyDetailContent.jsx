'use client';

import React from 'react';

export default function PolicyDetailContent({ currentPolicy, loading }) {
  const IconComp = currentPolicy.icon;

  return (
    <main className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm space-y-6">
      <div className="border-b border-slate-100 pb-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center shrink-0">
          <IconComp className="w-5 h-5" />
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
          {currentPolicy.title}
        </h2>
      </div>

      <div>
        {loading ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            Đang tải...
          </div>
        ) : currentPolicy.content ? (
          <div className="p-6 bg-slate-50/70 rounded-2xl border border-slate-200/70 text-slate-800 text-sm leading-relaxed font-medium whitespace-pre-line">
            {currentPolicy.content}
          </div>
        ) : (
          <div className="py-16 text-center text-slate-400 text-xs italic">
            (Chưa có nội dung cấu hình cho mục này)
          </div>
        )}
      </div>
    </main>
  );
}

