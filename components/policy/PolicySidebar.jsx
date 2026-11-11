'use client';

import React from 'react';
import { ChevronRight, Phone, Mail } from 'lucide-react';

export default function PolicySidebar({
  policies,
  activeTab,
  onTabChange,
  siteSettings,
}) {
  return (
    <aside className="lg:col-span-4 space-y-4">
      <div className="bg-white rounded-3xl p-3 sm:p-4 border border-slate-200/80 shadow-sm space-y-1">
        {policies.map((p) => {
          const ItemIcon = p.icon;
          const isActive = activeTab === p.key;
          return (
            <button
              key={p.key}
              type="button"
              onClick={() => onTabChange(p.key)}
              className={`w-full text-left p-3.5 rounded-2xl flex items-center justify-between gap-3 transition cursor-pointer ${
                isActive
                  ? 'bg-brand-600 text-white font-extrabold shadow-md shadow-brand-600/20'
                  : 'hover:bg-slate-50 text-slate-700 font-bold'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-brand-700'
                  }`}
                >
                  <ItemIcon className="w-4 h-4" />
                </div>
                <div className="truncate text-xs sm:text-sm">{p.title}</div>
              </div>
              <ChevronRight
                className={`w-4 h-4 shrink-0 transition-transform ${
                  isActive ? 'text-white translate-x-0.5' : 'text-slate-400'
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* Contact Box */}
      {(siteSettings?.hotline || siteSettings?.contact_email) && (
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-2.5">
          <div className="flex items-center gap-2 text-brand-900 font-black text-xs uppercase tracking-wider">
            <Phone className="w-4 h-4 text-brand-600" />
            <span>Hỗ Trợ Khách Hàng</span>
          </div>
          <div className="space-y-2 text-xs">
            {siteSettings?.hotline && (
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <Phone className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                <span>
                  Hotline: <strong className="text-brand-700 font-black">{siteSettings.hotline}</strong>
                </span>
              </div>
            )}
            {siteSettings?.contact_email && (
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <Mail className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                <span className="truncate">{siteSettings.contact_email}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}

