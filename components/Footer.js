'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MapPin, Phone, Mail, FileText, ChevronRight, Store, ArrowRight, Package } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();
  const [siteSettings, setSiteSettings] = useState(null);
  const [branches, setBranches] = useState([]);

  const loadData = async () => {
    try {
      const [settingsRes, branchesRes] = await Promise.all([
        fetch('/api/system/settings'),
        fetch('/api/branches?all=true')
      ]);
      const [settingsData, branchesData] = await Promise.all([
        settingsRes.json(),
        branchesRes.json()
      ]);
      if (settingsData.success && settingsData.data) {
        setSiteSettings(settingsData.data);
        try { localStorage.setItem('dodong4mua_site_settings', JSON.stringify(settingsData.data)); } catch (e) {}
      }
      if (branchesData.success && Array.isArray(branchesData.data)) {
        setBranches(branchesData.data);
        try { localStorage.setItem('dodong4mua_branches', JSON.stringify(branchesData.data)); } catch (e) {}
      }
    } catch (e) {
      console.warn('Lỗi tải footer data:', e);
    }
  };

  useEffect(() => {
    try {
      const cachedSettings = localStorage.getItem('dodong4mua_site_settings');
      if (cachedSettings) setSiteSettings(JSON.parse(cachedSettings));
      const cachedBranches = localStorage.getItem('dodong4mua_branches');
      if (cachedBranches) setBranches(JSON.parse(cachedBranches));
    } catch (e) {}
    loadData();
    window.addEventListener('settings-change', loadData);
    window.addEventListener('branches-change', loadData);
    return () => {
      window.removeEventListener('settings-change', loadData);
      window.removeEventListener('branches-change', loadData);
    };
  }, []);

  if (pathname?.startsWith('/admin')) return null;

  const activeBranches = branches.filter((b) => b.status === 1);

  return (
    <footer className="bg-brand-950 text-emerald-100 border-t-4 border-accent-500 pt-12 pb-10">
      {/* Thông tin chân trang hệ thống */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12 pb-10 border-b border-brand-900">
        {/* Cột 1 - Thương hiệu & Liên hệ */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            {siteSettings?.logo_url && (
              <div className="w-12 h-12 rounded-full overflow-hidden shadow-md border border-emerald-500/30 shrink-0 flex items-center justify-center">
                <img
                  src={siteSettings.logo_url}
                  alt={siteSettings?.site_name || "Logo"}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            {siteSettings?.site_name && (
              <div className="text-2xl font-black text-white font-heading tracking-tight leading-none">
                {siteSettings.site_name}
              </div>
            )}
          </div>

          <div className="text-emerald-300 space-y-2.5 text-xs sm:text-sm font-medium">
            {siteSettings?.company_address && (
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-accent-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">Trụ sở: {siteSettings.company_address}</span>
              </div>
            )}
            {siteSettings?.hotline && (
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-accent-400 shrink-0" />
                <span>Hotline CSKH: <strong className="text-yellow-300 font-black">{siteSettings.hotline}</strong></span>
              </div>
            )}
            {siteSettings?.contact_email && (
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-accent-400 shrink-0" />
                <span>Email hỗ trợ: {siteSettings.contact_email}</span>
              </div>
            )}
          </div>
        </div>

        {/* Cột 2 - Chính Sách & Khách Hàng (Mới) */}
        <div>
          <h3 className="text-white font-black text-lg mb-4 border-l-4 border-accent-500 pl-3 font-heading flex items-center gap-2">
            <FileText className="w-5 h-5 text-accent-400" />
            <span>Chính Sách & Khách Hàng</span>
          </h3>
          <ul className="text-emerald-200 space-y-3 text-xs sm:text-sm font-medium">
            <li>
              <Link
                href="/chinh-sach?tab=doi-tra"
                className="hover:text-yellow-300 transition flex items-center gap-2 group cursor-pointer"
              >
                <ChevronRight className="w-4 h-4 text-accent-400 group-hover:translate-x-1 transition-transform" />
                <span>Chính sách đổi trả</span>
              </Link>
            </li>
            <li>
              <Link
                href="/chinh-sach?tab=giao-hang"
                className="hover:text-yellow-300 transition flex items-center gap-2 group cursor-pointer"
              >
                <ChevronRight className="w-4 h-4 text-accent-400 group-hover:translate-x-1 transition-transform" />
                <span>Chính sách giao hàng</span>
              </Link>
            </li>
            <li>
              <Link
                href="/chinh-sach?tab=bao-mat"
                className="hover:text-yellow-300 transition flex items-center gap-2 group cursor-pointer"
              >
                <ChevronRight className="w-4 h-4 text-accent-400 group-hover:translate-x-1 transition-transform" />
                <span>Chính sách bảo mật</span>
              </Link>
            </li>
            <li>
              <Link
                href="/chinh-sach?tab=dieu-khoan"
                className="hover:text-yellow-300 transition flex items-center gap-2 group cursor-pointer"
              >
                <ChevronRight className="w-4 h-4 text-accent-400 group-hover:translate-x-1 transition-transform" />
                <span>Điều khoản sử dụng dịch vụ</span>
              </Link>
            </li>
            <li className="pt-2 border-t border-brand-900/80">
              <Link
                href="/lich-su-don-hang"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-brand-900 text-yellow-300 hover:bg-brand-800 transition font-bold text-xs cursor-pointer"
              >
                <Package className="w-4 h-4 text-yellow-300" />
                <span>Hướng dẫn tra cứu đơn hàng</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Cột 3 - Hệ Thống Chi Nhánh */}
        <div>
          <h3 className="text-white font-black text-lg mb-4 border-l-4 border-accent-500 pl-3 font-heading flex items-center gap-2">
            <Store className="w-5 h-5 text-accent-400" />
            <span>Hệ Thống Chi Nhánh</span>
          </h3>

          <ul className="text-emerald-200 space-y-3.5 text-xs sm:text-sm font-medium">
            {activeBranches.slice(0, 4).map((b) => (
              <li key={b.id} className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-accent-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-bold text-xs">{b.branch_name}</strong>
                  {b.address && <span className="text-emerald-300/90 text-xs block leading-relaxed">{b.address}</span>}
                  {b.phone && (
                    <span className="text-emerald-400 font-mono text-[11px] font-bold">Hotline: {b.phone}</span>
                  )}
                </div>
              </li>
            ))}
          </ul>

          <div className="pt-4">
            <Link
              href="/chi-nhanh"
              className="inline-flex items-center gap-1.5 text-xs text-yellow-300 hover:text-white font-extrabold hover:underline cursor-pointer"
            >
              <span>Xem tất cả {activeBranches.length > 0 ? activeBranches.length : ''} chi nhánh</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright, Admin Portal, Academic Note */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 text-center text-emerald-400/90 text-xs font-medium">
        <div>
          {siteSettings?.site_name ? `© 2026 ${siteSettings.site_name}. Tất cả các quyền được bảo lưu.` : '© 2026. Tất cả các quyền được bảo lưu.'}
        </div>

      </div>
    </footer>
  );
}
