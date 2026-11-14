'use client';

import React from 'react';
import { PackageOpen, ChevronDown } from 'lucide-react';
import ProductCard from '@/components/ProductCard';

export default function ShopeeProductGrid({
  products = [],
  loading = false,
  visibleCount = 12,
  onShowMore,
  onClearFilters
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-6">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="bg-white rounded-3xl p-5 border border-gray-100 animate-pulse space-y-4">
            <div className="aspect-square bg-gray-100 rounded-2xl" />
            <div className="h-5 bg-gray-100 rounded-xl w-3/4" />
            <div className="h-5 bg-gray-100 rounded-xl w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 max-w-lg mx-auto space-y-4 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-brand-600 flex items-center justify-center mx-auto">
          <PackageOpen className="w-8 h-8" />
        </div>
        <h3 className="font-extrabold text-gray-900 text-xl font-heading">Không tìm thấy sản phẩm phù hợp</h3>
        <p className="text-gray-500 font-medium text-xs leading-relaxed">
          Hãy thử tìm kiếm với từ khóa khác hoặc chuyển sang danh mục mùa vụ khác nhé!
        </p>
        <button
          type="button"
          onClick={onClearFilters}
          className="mt-2 btn-primary cursor-pointer text-xs"
        >
          Xem lại tất cả sản phẩm
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.slice(0, visibleCount).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Shopee-style Xem them button */}
      {products.length > visibleCount && (
        <div className="flex flex-col items-center justify-center pt-4 pb-2 space-y-2">
          <button
            type="button"
            onClick={onShowMore}
            className="px-10 py-3.5 bg-white hover:bg-brand-50 text-brand-700 font-extrabold text-sm rounded-2xl border-2 border-brand-600 hover:border-brand-700 transition-all shadow-xs hover:shadow-md cursor-pointer flex items-center gap-2 group active:scale-95"
          >
            <span>Xem Thêm Sản Phẩm</span>
            <ChevronDown className="w-4 h-4 text-brand-600 group-hover:translate-y-0.5 transition-transform" />
          </button>
          <p className="text-xs text-gray-400 font-medium">
            Đang hiển thị {Math.min(visibleCount, products.length)} trên tổng số {products.length} sản phẩm
          </p>
        </div>
      )}
    </div>
  );
}

