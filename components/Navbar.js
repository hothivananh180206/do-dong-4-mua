'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { 
  ShoppingBag, Search, Phone, ShieldCheck, MapPin, 
  Sparkles, Menu, X, User, LogOut, Package,
  Leaf, Bell
} from 'lucide-react';
import { useCart } from './CartContext';
import { getAuthSession, clearAuthSession } from '@/lib/auth-session';
import { formatDate, formatDateTime } from '@/lib/date';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { totalItems, setIsCartOpen } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [siteSettings, setSiteSettings] = useState(null);
  const [branches, setBranches] = useState([]);
  const [activeBranchCount, setActiveBranchCount] = useState(null);
  const [topCategories, setTopCategories] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [selectedNotif, setSelectedNotif] = useState(null);
  const [readNotifIds, setReadNotifIds] = useState([]);

  const loadSettingsAndBranches = async () => {
    try {
      const [settingsRes, branchesRes, categoriesRes] = await Promise.all([
        fetch('/api/system/settings'),
        fetch('/api/branches?all=true'),
        fetch('/api/categories')
      ]);
      const [settingsData, branchesData, categoriesData] = await Promise.all([
        settingsRes.json(),
        branchesRes.json(),
        categoriesRes.json()
      ]);
      if (settingsData.success && settingsData.data) {
        setSiteSettings(settingsData.data);
        try { localStorage.setItem('dodong4mua_site_settings', JSON.stringify(settingsData.data)); } catch (e) {}
      }
      if (branchesData.success && Array.isArray(branchesData.data)) {
        setBranches(branchesData.data);
        const activeCount = branchesData.data.filter(b => b.status === 1).length;
        setActiveBranchCount(activeCount);
        try {
          localStorage.setItem('dodong4mua_active_branch_count', String(activeCount));
          localStorage.setItem('dodong4mua_branches', JSON.stringify(branchesData.data));
        } catch (e) {}
      }
      if (categoriesData.success && Array.isArray(categoriesData.data)) {
        const top4 = [...categoriesData.data]
          .filter(c => c.status === 1)
          .sort((a, b) => (b.product_count || 0) - (a.product_count || 0))
          .slice(0, 4);
        setTopCategories(top4);
        try {
          localStorage.setItem('dodong4mua_top_categories', JSON.stringify(top4));
        } catch (e) {}
      }
    } catch (e) {
      console.warn('Lỗi tải cấu hình động navbar:', e);
    }
  };

  const loadNotifications = async () => {
    try {
      const u = getAuthSession();
      let url = '/api/notifications?role=customer';
      if (u?.id) {
        url += `&userId=${u.id}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setNotifications(data.data);
        const storedRead = JSON.parse(localStorage.getItem('dodong4mua_read_notifs') || '[]');
        setReadNotifIds(storedRead);
        const unread = data.data.filter(n => !storedRead.includes(n.id)).length;
        setUnreadCount(unread);
      }
    } catch (e) {
      console.warn('Lỗi tải thông báo navbar:', e);
    }
  };

  const handleOpenNotification = (notif) => {
    setSelectedNotif(notif);
    setIsNotifOpen(false);
    if (!readNotifIds.includes(notif.id)) {
      const updated = [...readNotifIds, notif.id];
      setReadNotifIds(updated);
      localStorage.setItem('dodong4mua_read_notifs', JSON.stringify(updated));
      const unread = notifications.filter(n => !updated.includes(n.id)).length;
      setUnreadCount(unread);
    }
  };

  const handleMarkAllRead = () => {
    const allIds = notifications.map(n => n.id);
    setReadNotifIds(allIds);
    localStorage.setItem('dodong4mua_read_notifs', JSON.stringify(allIds));
    setUnreadCount(0);
  };

  const loadUser = () => {
    try {
      const session = getAuthSession();
      setCurrentUser(session);
    } catch (e) {
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    try {
      const cachedSettings = localStorage.getItem('dodong4mua_site_settings');
      if (cachedSettings) setSiteSettings(JSON.parse(cachedSettings));
      const cachedCount = localStorage.getItem('dodong4mua_active_branch_count');
      if (cachedCount !== null) setActiveBranchCount(parseInt(cachedCount, 10));
      const cachedTopCats = localStorage.getItem('dodong4mua_top_categories');
      if (cachedTopCats) setTopCategories(JSON.parse(cachedTopCats));
    } catch (e) {}
    loadUser();
    loadNotifications();
    loadSettingsAndBranches();
    window.addEventListener('auth-change', loadUser);
    window.addEventListener('auth-change', loadNotifications);
    window.addEventListener('settings-change', loadSettingsAndBranches);
    window.addEventListener('branches-change', loadSettingsAndBranches);

    const handleClickOutside = (e) => {
      if (!e.target.closest('#notif-dropdown-container')) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('auth-change', loadUser);
      window.removeEventListener('auth-change', loadNotifications);
      window.removeEventListener('settings-change', loadSettingsAndBranches);
      window.removeEventListener('branches-change', loadSettingsAndBranches);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      if (currentUser?.id) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: currentUser.id, phone: currentUser.phone })
        });
      }
    } catch (e) {
      console.warn('Lỗi gọi API đăng xuất:', e);
    }
    clearAuthSession();
    setCurrentUser(null);
    router.push('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/?search=${encodeURIComponent(searchTerm.trim())}`);
      setMobileMenuOpen(false);
    }
  };



  if (pathname?.startsWith('/admin')) return null;

  return (
    <>
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all">
      {/* Top announcement bar */}
      <div className="bg-brand-900 text-white py-1.5 px-4 border-b border-brand-800 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-3">
            {activeBranchCount === null ? (
              <div className="flex items-center gap-1.5 py-0.5">
                <MapPin className="w-3.5 h-3.5 text-accent-400 shrink-0 opacity-60" />
                <div className="h-3 w-32 bg-white/20 rounded-md animate-pulse"></div>
              </div>
            ) : (
              <Link href="/chi-nhanh" className="flex items-center gap-1 font-semibold hover:text-brand-200 transition cursor-pointer">
                <MapPin className="w-3.5 h-3.5 text-accent-400 shrink-0" />
                <span>Hệ thống {activeBranchCount} Chi nhánh</span>
              </Link>
            )}
          </div>

          <div className="flex items-center gap-4">
            <Link href="/lich-su-don-hang" className="flex items-center gap-1 text-emerald-100 hover:text-white transition font-semibold cursor-pointer">
              <Package className="w-3.5 h-3.5 text-accent-400 shrink-0" />
              <span>Tra cứu đơn hàng</span>
            </Link>
            {currentUser?.isAdmin && (
              <Link href="/admin" className="flex items-center gap-1 text-yellow-300 hover:text-yellow-200 transition font-black bg-white/10 px-2 py-0.5 rounded-full cursor-pointer">
                <ShieldCheck className="w-3.5 h-3.5 text-yellow-300 shrink-0" />
                <span>Cổng Quản Trị</span>
              </Link>
            )}
            {siteSettings === null ? (
              <div className="flex items-center gap-1.5 py-0.5">
                <Phone className="w-3.5 h-3.5 text-yellow-300 shrink-0 opacity-60" />
                <div className="h-3 w-24 bg-white/20 rounded-md animate-pulse"></div>
              </div>
            ) : siteSettings?.hotline ? (() => {
              const hotlineRaw = siteSettings.hotline;
              const cleanPhone = hotlineRaw.replace(/\D/g, '');
              const formattedPhone = cleanPhone.length === 10
                ? `${cleanPhone.slice(0, 4)}.${cleanPhone.slice(4, 7)}.${cleanPhone.slice(7)}`
                : cleanPhone.length === 11
                ? `${cleanPhone.slice(0, 4)}.${cleanPhone.slice(4, 7)}.${cleanPhone.slice(7)}`
                : hotlineRaw;
              return (
                <a href={`tel:${cleanPhone}`} className="flex items-center gap-1 font-bold text-yellow-300 hover:text-yellow-200 cursor-pointer">
                  <Phone className="w-3.5 h-3.5 shrink-0" />
                  <span>Hotline: {formattedPhone}</span>
                </a>
              );
            })() : null}
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          {/* Logo & Thuong hieu dong 100% (FR-043) */}
          {siteSettings === null ? (
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gray-200 animate-pulse shrink-0"></div>
              <div className="space-y-1.5">
                <div className="h-4 w-28 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-2.5 w-36 bg-gray-100 rounded animate-pulse"></div>
              </div>
            </div>
          ) : (
            <Link href="/" className="flex items-center gap-2.5 group shrink-0 cursor-pointer">
              {siteSettings?.logo_url ? (
                <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-md border border-emerald-500/30">
                  <img
                    src={siteSettings.logo_url}
                    alt={siteSettings?.site_name || "Logo"}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-brand-600 to-brand-800 rounded-full flex items-center justify-center text-white shadow-md shadow-brand-600/20 group-hover:scale-105 transition-transform shrink-0">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
              )}
              <div>
                <div className="text-xl font-black tracking-tight text-brand-900 flex items-center gap-1">
                  {siteSettings?.site_name?.trim() ? (
                    <span>{siteSettings.site_name.trim()}</span>
                  ) : (
                    <>
                      <span>ĐỔ ĐỐNG</span>
                      <span className="text-accent-500 font-extrabold">4 MÙA</span>
                    </>
                  )}
                </div>
                {siteSettings?.site_slogan?.trim() ? (
                  <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">
                    {siteSettings.site_slogan.trim()}
                  </p>
                ) : null}
              </div>
            </Link>
          )}

          {/* Search bar */}
          <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-lg relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm xoài cát, táo Envy, sầu riêng, bưởi..."
              className="w-full pl-4 pr-12 py-2 text-sm bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-600 focus:bg-white transition"
            />
            <button
              type="submit"
              className="absolute right-1 top-1 bottom-1 px-3.5 bg-brand-600 text-white rounded-full hover:bg-brand-700 transition flex items-center justify-center cursor-pointer shadow-sm"
              aria-label="Tìm kiếm"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Action buttons & User status */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/thong-tin-ca-nhan"
                  title="Xem và chỉnh sửa thông tin cá nhân"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 hover:bg-brand-50 text-gray-800 hover:text-brand-700 text-xs font-bold border border-gray-200 transition cursor-pointer"
                >
                  <User className="w-4 h-4 text-brand-600" />
                  <span className="truncate max-w-[120px]">{currentUser.full_name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  title="Đăng xuất"
                  className="p-2 text-gray-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition cursor-pointer"
                  aria-label="Đăng xuất"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-1.5">
                <Link
                  href="/dang-nhap"
                  className="px-3 py-1.5 rounded-xl hover:bg-gray-100 text-gray-700 hover:text-brand-700 text-xs font-bold transition cursor-pointer"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/dang-ky"
                  className="px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-extrabold shadow-sm transition cursor-pointer flex items-center gap-1"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Đăng ký</span>
                </Link>
              </div>
            )}

            {/* Notification Bell Dropdown (FR-046 - Trung tâm thông báo) */}
            <div id="notif-dropdown-container" className="relative">
              <button
                type="button"
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative w-10 h-10 rounded-xl bg-gray-50 hover:bg-brand-50 text-gray-700 hover:text-brand-700 transition flex items-center justify-center border border-gray-200 cursor-pointer shadow-xs"
                title="Thông báo hệ thống"
                aria-label="Xem thông báo"
              >
                <Bell className="w-5 h-5 text-gray-700" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-black text-white shadow-sm ring-2 ring-white">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Bảng thả xuống thông báo (Dropdown) */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 pb-3 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-brand-600" />
                      <span className="font-extrabold text-sm text-gray-900">Thông Báo Hệ Thống</span>
                      {unreadCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-bold text-[10px]">
                          {unreadCount} mới
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={handleMarkAllRead}
                        className="text-[11px] text-brand-700 hover:text-brand-900 font-bold cursor-pointer"
                      >
                        Đã đọc tất cả
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-gray-400 space-y-1">
                        <Bell className="w-7 h-7 mx-auto text-gray-300 mb-1" />
                        <p className="text-xs font-semibold text-gray-500">Chưa có thông báo nào</p>
                        <p className="text-[11px] text-gray-400">Các thông báo mới sẽ xuất hiện tại đây</p>
                      </div>
                    ) : (
                      notifications.map((n) => {
                        const isRead = readNotifIds.includes(n.id);
                        return (
                          <div
                            key={n.id}
                            onClick={() => handleOpenNotification(n)}
                            className={`p-3.5 hover:bg-gray-50 transition cursor-pointer flex items-start gap-3 ${
                              !isRead ? 'bg-brand-50/40' : ''
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                              !isRead ? 'bg-brand-100 text-brand-700 font-bold' : 'bg-gray-100 text-gray-500'
                            }`}>
                              <Bell className="w-4 h-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <p className={`text-xs truncate ${!isRead ? 'font-black text-gray-900' : 'font-semibold text-gray-700'}`}>
                                  {n.title}
                                </p>
                                {!isRead && (
                                  <span className="w-2 h-2 rounded-full bg-brand-600 shrink-0"></span>
                                )}
                              </div>
                              <p className="text-[11px] text-gray-500 line-clamp-2 mt-0.5 leading-relaxed">
                                {n.content}
                              </p>
                              <div className="flex items-center justify-between text-[10px] text-gray-400 mt-1.5">
                                <span>{n.sender_name || 'Hệ thống Đổ Đống 4 Mùa'}</span>
                                <span>{formatDate(n.created_at)}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  <div className="pt-2 px-4 border-t border-gray-100 text-center">
                    <span className="text-[10px] text-gray-400 font-medium">
                      Đổ Đống 4 Mùa luôn đồng hành và hỗ trợ bạn 24/7
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-xl bg-brand-50 text-brand-700 hover:bg-brand-100 transition flex items-center gap-2 border border-brand-200 cursor-pointer shadow-sm hover:shadow"
              aria-label="Mở giỏ hàng"
            >
              <ShoppingBag className="w-5 h-5 text-brand-700" />
              <span className="hidden sm:inline-block font-extrabold text-sm text-brand-800">Giỏ hàng</span>
              {totalItems > 0 && (
                <span className="bg-accent-500 text-white font-black text-xs px-2 py-0.5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-brand-700 lg:hidden rounded-xl hover:bg-gray-100 cursor-pointer"
              aria-label="Mở danh mục"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Danh mục sản phẩm nổi bật */}
        <div className="mt-2.5 pt-2 border-t border-gray-100 hidden sm:flex items-center justify-between gap-3 overflow-x-auto text-xs pb-0.5">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="font-extrabold text-brand-900 uppercase tracking-wider mr-1 text-[11px]">Danh Mục:</span>
            <button
              onClick={() => router.push('/', { scroll: false })}
              className="px-3 py-1 rounded-full bg-gray-100 hover:bg-brand-100 hover:text-brand-700 transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer active:scale-95 font-semibold text-gray-700"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              <span>Tất cả</span>
            </button>
            {topCategories.map((c) => (
              <button
                key={c.id}
                onClick={() => router.push(`/?category=${c.slug}`, { scroll: false })}
                className="px-3 py-1 rounded-full bg-gray-100 hover:bg-brand-100 hover:text-brand-700 transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer active:scale-95 font-semibold text-gray-700"
              >
                <span>{c.name}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 shrink-0 text-gray-600 font-semibold text-xs">
            <Link href="/chi-nhanh" className="hover:text-brand-600 transition font-black text-brand-700 cursor-pointer">Chi Nhánh</Link>
            <Link href="/chinh-sach" className="hover:text-brand-600 transition cursor-pointer">Chính Sách</Link>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-gray-200 space-y-3 pb-3 text-sm">
            <form onSubmit={handleSearch} className="flex relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm trái cây..."
                className="w-full pl-3 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
              />
              <button type="submit" className="absolute right-1 top-1 bottom-1 px-3 bg-brand-600 text-white rounded-lg cursor-pointer">
                <Search className="w-4 h-4" />
              </button>
            </form>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  router.push('/', { scroll: false });
                  setMobileMenuOpen(false);
                }}
                className="p-2.5 rounded-xl bg-brand-50 text-brand-900 font-bold flex items-center gap-2 cursor-pointer text-xs"
              >
                <Sparkles className="w-4 h-4 text-brand-600 shrink-0" />
                <span>Tất cả</span>
              </button>
              {topCategories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    router.push(`/?category=${c.slug}`, { scroll: false });
                    setMobileMenuOpen(false);
                  }}
                  className="p-2.5 rounded-xl bg-brand-50 text-brand-900 font-bold flex items-center gap-2 cursor-pointer text-xs"
                >
                  <span className="truncate">{c.name}</span>
                </button>
              ))}
            </div>
            <div className="pt-2 border-t border-gray-100 flex flex-col gap-2 text-xs">
              {currentUser && (
                <Link href="/thong-tin-ca-nhan" onClick={() => setMobileMenuOpen(false)} className="p-2.5 bg-brand-50 rounded-xl text-brand-900 font-bold flex items-center gap-2 cursor-pointer">
                  <User className="w-4 h-4 text-brand-600" />
                  <span>Hồ sơ cá nhân ({currentUser.full_name})</span>
                </Link>
              )}
              <Link href="/lich-su-don-hang" onClick={() => setMobileMenuOpen(false)} className="p-2.5 bg-gray-50 rounded-xl text-gray-800 font-bold flex items-center gap-2 cursor-pointer">
                <Package className="w-4 h-4 text-brand-600" />
                <span>Tra cứu lịch sử đơn hàng</span>
              </Link>
              <Link href="/chi-nhanh" onClick={() => setMobileMenuOpen(false)} className="p-2.5 bg-gray-50 rounded-xl text-gray-800 font-bold flex items-center gap-2 cursor-pointer">
                <MapPin className="w-4 h-4 text-accent-500" />
                {activeBranchCount === null ? (
                  <div className="h-3 w-32 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  <span>Hệ thống {activeBranchCount} chi nhánh</span>
                )}
              </Link>
              {currentUser ? (
                <button onClick={handleLogout} className="p-2.5 text-red-600 font-bold text-left flex items-center gap-2 cursor-pointer">
                  <LogOut className="w-4 h-4" />
                  <span>Đăng xuất</span>
                </button>
              ) : (
                <Link href="/dang-nhap" onClick={() => setMobileMenuOpen(false)} className="p-2.5 bg-brand-600 text-white text-center rounded-xl font-bold cursor-pointer">
                  Đăng nhập / Đăng ký
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>

    {/* Modal xem chi tiết thông báo cho khách hàng */}
    {selectedNotif && (
      <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200 my-auto">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-heading font-black text-base text-gray-900">Chi Tiết Thông Báo</h3>
                <p className="text-[11px] text-gray-400">
                  Gửi lúc {formatDateTime(selectedNotif.created_at)}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSelectedNotif(null)}
              className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-brand-50/50 rounded-xl border border-brand-100">
              <span className="text-[10px] uppercase font-extrabold text-brand-700 tracking-wider block mb-1">Tiêu đề thông báo</span>
              <p className="font-black text-sm text-gray-900">{selectedNotif.title}</p>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block mb-1">Nội dung chi tiết</span>
              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200/80 text-gray-700 leading-relaxed font-medium whitespace-pre-wrap">
                {selectedNotif.content}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 text-[11px] text-gray-500 border-t border-gray-100">
              <span>Người gửi: <strong className="text-gray-800">{selectedNotif.sender_name || 'Admin Tổng'}</strong></span>
              <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 font-semibold">
                Hệ thống 4 Mùa
              </span>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => setSelectedNotif(null)}
              className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-black text-xs transition cursor-pointer shadow-sm"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
