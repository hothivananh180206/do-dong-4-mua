'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

export default function HomeHeroBanner({
  banners = [],
  bannersLoaded = false,
  activeIdx = 0,
  onSelectIdx,
  onScrollToProducts
}) {
  const [internalIdx, setInternalIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const total = banners.length;
  const currentIndex = onSelectIdx ? activeIdx : internalIdx;

  const setIndex = (val) => {
    if (typeof val === 'function') {
      const next = val(currentIndex);
      if (onSelectIdx) onSelectIdx(next);
      setInternalIdx(next);
    } else {
      if (onSelectIdx) onSelectIdx(val);
      setInternalIdx(val);
    }
  };

  const handlePrev = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (total <= 1) return;
    setIndex((prev) => (prev - 1 + total) % total);
  };

  const handleNext = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (total <= 1) return;
    setIndex((prev) => (prev + 1) % total);
  };

  // Tự động trượt sau 4 giây, tự dừng khi rê chuột (pause on hover)
  useEffect(() => {
    if (total <= 1 || isPaused) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % total);
    }, 4000);
    return () => clearInterval(timer);
  }, [total, isPaused]);

  // Hỗ trợ lướt vuốt tay trên điện thoại / tablet
  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };
  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };
  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) handleNext();
    else if (diff < -50) handlePrev();
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  // 1. Trạng thái đang tải (Skeleton)
  if (!bannersLoaded && total === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-3 sm:pt-5">
        <div className="w-full aspect-[2.4/1] sm:aspect-[3/1] md:aspect-[3.5/1] lg:aspect-[4/1] rounded-2xl sm:rounded-3xl bg-slate-200/80 animate-pulse border border-slate-200" />
      </div>
    );
  }

  // 2. Trạng thái khi chưa có banner trong CSDL (Fallback giao diện giới thiệu Đổ Đống 4 Mùa)
  if (bannersLoaded && total === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-3 sm:pt-5">
        <div
          onClick={onScrollToProducts}
          className="relative w-full aspect-[2.4/1] sm:aspect-[3/1] md:aspect-[3.5/1] lg:aspect-[4/1] rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-gradient-to-r from-emerald-800 via-teal-700 to-emerald-900 text-white flex items-center px-6 sm:px-12 lg:px-16"
        >
          <div className="max-w-xl space-y-2.5 sm:space-y-3 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-emerald-200 text-xs font-bold backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Đổ Đống 4 Mùa • Tươi Ngon Tận Vườn</span>
            </div>
            <h1 className="text-xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
              Trái Cây Đặc Sản 4 Mùa <br className="hidden sm:inline" />Giao Siêu Tốc Trong Ngày
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 font-medium line-clamp-2 max-w-lg">
              Cam sành Tiền Giang, sầu riêng Ri6, xoài cát Hòa Lộc thu hái tận vườn. Bao ăn từng quả, đổi trả miễn phí!
            </p>
            <div className="pt-1.5">
              <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-emerald-900 rounded-xl font-bold text-xs shadow-md hover:bg-emerald-50 transition">
                <span>Khám Phá Menu Hôm Nay</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
          <div className="absolute right-6 sm:right-16 top-1/2 -translate-y-1/2 text-6xl sm:text-8xl select-none opacity-20 sm:opacity-30 pointer-events-none">
            🍉🍊🥑
          </div>
        </div>
      </div>
    );
  }

  // 3. Banner Carousel chuẩn sàn TMĐT (Shopee / Lazada)
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-3 sm:pt-5">
      <div
        className="relative w-full aspect-[2.4/1] sm:aspect-[3/1] md:aspect-[3.5/1] lg:aspect-[4/1] rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow select-none bg-slate-900 group"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Danh sách các tấm Banner hình ảnh đồ họa */}
        {banners.map((banner, idx) => {
          const isActive = idx === currentIndex;
          const rawLink = banner.link_url && banner.link_url.trim() ? banner.link_url.trim() : '#product-section';
          const isInternal = rawLink.startsWith('/') || rawLink.startsWith('#');

          const ImageElement = (
            <div className="relative w-full h-full">
              <img
                src={banner.image_url}
                alt={banner.title || `Banner ${idx + 1}`}
                className="w-full h-full object-cover object-center"
                loading={idx === 0 ? 'eager' : 'lazy'}
                draggable={false}
              />
            </div>
          );

          return (
            <div
              key={banner.id || idx}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {isInternal ? (
                <Link href={rawLink} className="block w-full h-full cursor-pointer">
                  {ImageElement}
                </Link>
              ) : (
                <a
                  href={rawLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full h-full cursor-pointer"
                >
                  {ImageElement}
                </a>
              )}
            </div>
          );
        })}

        {/* Nút mũi tên lướt sang trái (Prev) */}
        {total > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/35 hover:bg-black/65 text-white flex items-center justify-center backdrop-blur-sm transition-all duration-200 shadow-md cursor-pointer hover:scale-105 active:scale-95"
            aria-label="Banner trước"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}

        {/* Nút mũi tên lướt sang phải (Next) */}
        {total > 1 && (
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/35 hover:bg-black/65 text-white flex items-center justify-center backdrop-blur-sm transition-all duration-200 shadow-md cursor-pointer hover:scale-105 active:scale-95"
            aria-label="Banner tiếp theo"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}

        {/* Dãy chấm chỉ mục vị trí (Pagination Dots) */}
        {total > 1 && (
          <div className="absolute bottom-2.5 sm:bottom-3.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full bg-black/25 backdrop-blur-sm">
            {banners.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIndex(idx);
                }}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  idx === currentIndex
                    ? 'w-6 sm:w-7 h-2 sm:h-2.5 bg-white shadow-sm'
                    : 'w-2 sm:w-2.5 h-2 sm:h-2.5 bg-white/45 hover:bg-white/75'
                }`}
                aria-label={`Chuyển tới banner ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
