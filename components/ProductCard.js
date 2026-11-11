'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Eye, Sun, Flower2, Wind, Snowflake } from 'lucide-react';
import { useCart } from './CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const price = parseFloat(product.price);
  const discountPrice = product.discount_price ? parseFloat(product.discount_price) : null;
  const effectivePrice = discountPrice !== null ? discountPrice : price;
  const discountPercent = discountPrice ? Math.round(((price - discountPrice) / price) * 100) : 0;

  // Extract season badge with Lucide SVG icon
  let seasonBadge = null;
  if (product.description?.includes('MÙA XUÂN')) {
    seasonBadge = {
      text: 'Mùa Xuân',
      icon: Flower2,
      style: 'bg-rose-50 text-rose-700 border-rose-200'
    };
  } else if (product.description?.includes('MÙA HẠ')) {
    seasonBadge = {
      text: 'Mùa Hạ',
      icon: Sun,
      style: 'bg-amber-50 text-amber-700 border-amber-200'
    };
  } else if (product.description?.includes('MÙA THU')) {
    seasonBadge = {
      text: 'Mùa Thu',
      icon: Wind,
      style: 'bg-orange-50 text-orange-700 border-orange-200'
    };
  } else if (product.description?.includes('MÙA ĐÔNG')) {
    seasonBadge = {
      text: 'Mùa Đông',
      icon: Snowflake,
      style: 'bg-sky-50 text-sky-700 border-sky-200'
    };
  }

  const SeasonIcon = seasonBadge?.icon;

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden">
      {/* Thumbnail area */}
      <div className="relative aspect-square overflow-hidden bg-emerald-50/40">
        <Link href={`/san-pham/${product.id}`} className="block w-full h-full cursor-pointer">
          <img
            src={product.thumbnail || 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&auto=format&fit=crop&q=80'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </Link>

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-3 left-3 bg-accent-500 text-white font-black text-xs px-2.5 py-1 rounded-lg shadow-md tracking-tight">
            -{discountPercent}%
          </div>
        )}

        {/* Trạng thái Hết hàng (BR-004 & FR-012) */}
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] flex items-center justify-center z-10">
            <span className="bg-rose-600 text-white font-black text-xs uppercase px-3 py-1.5 rounded-xl shadow-lg tracking-wider border border-rose-400">
              Hết hàng
            </span>
          </div>
        )}

        {/* Season Badge (SVG Icon + Clean Pill) */}
        {seasonBadge && (
          <div className={`absolute top-3 right-3 flex items-center gap-1.5 font-bold text-xs px-2.5 py-1 rounded-lg border shadow-sm backdrop-blur-md ${seasonBadge.style}`}>
            {SeasonIcon && <SeasonIcon className="w-3.5 h-3.5 stroke-[2.5]" />}
            <span>{seasonBadge.text}</span>
          </div>
        )}

        {/* Quick View Button on Hover */}
        <Link
          href={`/san-pham/${product.id}`}
          className="absolute inset-x-4 bottom-3 py-2 bg-white/95 backdrop-blur-md text-brand-700 text-sm font-bold rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center gap-1.5 hover:bg-brand-50 cursor-pointer"
        >
          <Eye className="w-4 h-4 text-brand-600" />
          <span>Xem chi tiết</span>
        </Link>
      </div>

      {/* Info area */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <div className="text-xs text-brand-600 font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span>
            <span>{product.category_name || 'Đặc Sản 4 Mùa'}</span>
          </div>
          <Link href={`/san-pham/${product.id}`} className="hover:text-brand-600 transition-colors cursor-pointer">
            <h3 className="font-extrabold text-gray-900 text-base leading-snug line-clamp-2">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-black text-brand-700">
                {effectivePrice.toLocaleString('vi-VN')} đ
              </span>
              <span className="text-xs text-gray-400 font-semibold">/{product.unit || 'kg'}</span>
            </div>
            {discountPrice && (
              <span className="text-xs text-gray-400 line-through font-medium block">
                {price.toLocaleString('vi-VN')} đ
              </span>
            )}
          </div>

          <button
            onClick={() => addToCart(product, 1)}
            disabled={product.stock <= 0}
            className={`p-2.5 rounded-xl transition-all duration-200 flex items-center justify-center cursor-pointer shadow-sm ${
              product.stock > 0
                ? 'bg-brand-50 text-brand-700 hover:bg-brand-600 hover:text-white hover:shadow-md border border-brand-200'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
            title={product.stock > 0 ? 'Thêm vào giỏ hàng' : 'Hết hàng'}
            aria-label={`Thêm ${product.name} vào giỏ hàng`}
          >
            <ShoppingBag className="w-5 h-5 stroke-[2.2]" />
          </button>
        </div>
      </div>
    </div>
  );
}
