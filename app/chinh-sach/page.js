'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  RotateCcw, Truck, ShieldCheck, FileText, 
  ChevronRight, ArrowLeft
} from 'lucide-react';

import PolicySidebar from '@/components/policy/PolicySidebar';
import PolicyDetailContent from '@/components/policy/PolicyDetailContent';

function PolicyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get('tab') || 'doi-tra';

  const [activeTab, setActiveTab] = useState(tabParam);
  const [siteSettings, setSiteSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tabParam && ['doi-tra', 'giao-hang', 'bao-mat', 'dieu-khoan'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const loadSettings = async () => {
    try {
      const res = await fetch('/api/system/settings');
      const data = await res.json();
      if (data.success && data.data) {
        setSiteSettings(data.data);
      }
    } catch (e) {
      console.warn('Lỗi tải cấu hình chính sách:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
    window.addEventListener('settings-change', loadSettings);
    return () => window.removeEventListener('settings-change', loadSettings);
  }, []);

  const handleTabChange = (key) => {
    setActiveTab(key);
    router.push(`/chinh-sach?tab=${key}`, { scroll: false });
  };

  const policies = [
    {
      key: 'doi-tra',
      title: 'Chính sách đổi trả',
      icon: RotateCcw,
      content: siteSettings?.exchange_policy || '',
    },
    {
      key: 'giao-hang',
      title: 'Chính sách giao hàng',
      icon: Truck,
      content: siteSettings?.shipping_policy || '',
    },
    {
      key: 'bao-mat',
      title: 'Chính sách bảo mật',
      icon: ShieldCheck,
      content: siteSettings?.privacy_policy || '',
    },
    {
      key: 'dieu-khoan',
      title: 'Điều khoản sử dụng dịch vụ',
      icon: FileText,
      content: siteSettings?.terms_of_service || '',
    }
  ];

  const currentPolicy = policies.find((p) => p.key === activeTab) || policies[0];

  return (
    <div className="min-h-screen bg-slate-50/70 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6 sm:space-y-8">
        {/* Breadcrumb & Navigation Back */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-500 font-medium">
            <Link href="/" className="hover:text-brand-600 transition flex items-center gap-1 cursor-pointer">
              <span>Trang chủ</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-800 font-bold">Chính Sách & Quy Định</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-brand-700 font-extrabold">{currentPolicy.title}</span>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-brand-700 hover:border-brand-300 font-bold transition shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Quay lại trang chủ</span>
          </Link>
        </div>

        {/* Page Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-700 shadow-xs shrink-0">
              <ShieldCheck className="w-8 h-8 text-brand-600" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-slate-900 leading-tight">
                Chính Sách & Điều Khoản
              </h1>
              {siteSettings?.site_name && (
                <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-1">
                  {siteSettings.site_name}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-100">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Văn bản chính thức</span>
            </span>
          </div>
        </div>

        {/* Main Content Layout: Sidebar + Policy Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <PolicySidebar
            policies={policies}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            siteSettings={siteSettings}
          />
          <PolicyDetailContent
            currentPolicy={currentPolicy}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}

export default function PolicyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50 text-xs text-slate-400">
          Đang tải...
        </div>
      }
    >
      <PolicyContent />
    </Suspense>
  );
}
