'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';
import ProductCard from '@/components/ProductCard';

export default function RelatedProductsSection({ related }) {
  if (!related || related.length === 0) return null;

  return (
    <div className="pt-12 border-t border-gray-100 space-y-8">
      <h3 className="text-2xl font-black text-gray-900 flex items-center gap-2.5 font-heading">
        <Sparkles className="w-6 h-6 text-brand-600" />
        <span>Sản Phẩm Cùng Danh Mục</span>
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {related.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </div>
  );
}

