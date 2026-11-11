'use client';

import React from 'react';
import { Star, Minus, Plus, ShoppingBag } from 'lucide-react';
import ProductComboNotice from '@/components/product/ProductComboNotice';
import ProductTrustBadges from '@/components/product/ProductTrustBadges';

export default function ProductPurchaseBox({
  product,
  effectivePrice,
  price,
  discountPrice,
  quantity,
  setQuantity,
  onAddToCart,
  onBuyNow,
}) {
  return (
    <div className="lg:col-span-6 space-y-7">
      <div>
        <span className="px-4 py-1.5 rounded-full bg-emerald-50 text-brand-700 font-black uppercase tracking-wider border border-emerald-200">
          {product.category_name}
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mt-3 leading-tight font-heading">
          {product.name}
        </h1>
        <div className="flex items-center gap-3.5 mt-3 text-gray-500 font-medium">
          <div className="flex items-center text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-current" />
            ))}
          </div>
          <span className="font-extrabold text-gray-800">5.0</span>
          <span>•</span>
          <span className="text-brand-700 font-bold">Bao ăn 1 đổi 1 trong 24h</span>
        </div>
      </div>

      {/* Price Box */}
      <div className="bg-emerald-50/70 p-5 rounded-3xl border border-emerald-100 flex items-baseline gap-4">
        <span className="text-4xl font-black text-brand-700">
          {effectivePrice.toLocaleString('vi-VN')} đ
        </span>
        <span className="text-gray-500 font-bold">/ 1 {product.unit || 'kg'}</span>
        {discountPrice && (
          <span className="text-xl text-gray-400 line-through font-medium">
            {price.toLocaleString('vi-VN')} đ
          </span>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <h4 className="font-extrabold text-gray-800 uppercase tracking-wider">Đặc điểm & Vị ngon:</h4>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm leading-relaxed text-gray-700 font-medium">
          {product.description || 'Trái cây sạch, độ ngọt chuẩn tự nhiên, được lựa chọn kỹ càng từng trái.'}
        </div>
      </div>

      {/* Combo notice */}
      <ProductComboNotice product={product} />

      {/* Stock & Quantity */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between font-bold">
          <span className="text-gray-800">Số lượng ({product.unit || 'kg'}):</span>
          <span className="text-gray-500">
            Tồn kho:{' '}
            <strong className={product.stock <= 0 ? 'text-rose-600 font-black' : 'text-brand-700 font-black'}>
              {product.stock}
            </strong>{' '}
            {product.unit || 'kg'}
          </span>
        </div>

        {product.stock <= 0 ? (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0"></span>
            <span>Sản phẩm này hiện đang tạm hết hàng. Quý khách vui lòng tham khảo các loại trái cây khác!</span>
          </div>
        ) : (
          <div className="flex items-center gap-5">
            <div className="flex items-center border border-gray-300 rounded-2xl bg-white shadow-sm focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-brand-500">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, (Number(quantity) || 1) - 1))}
                className="p-3.5 hover:bg-gray-100 rounded-l-2xl transition cursor-pointer active:scale-95"
                aria-label="Giảm số lượng"
              >
                <Minus className="w-5 h-5 text-gray-700" />
              </button>
              <input
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) => {
                  const raw = e.target.value;
                  if (raw === '') {
                    setQuantity('');
                    return;
                  }
                  const val = parseInt(raw, 10);
                  if (!isNaN(val)) {
                    if (val < 1) {
                      setQuantity(1);
                    } else if (product.stock && val > product.stock) {
                      setQuantity(product.stock);
                      alert(`Số lượng không được vượt quá số lượng tồn kho (${product.stock} ${product.unit || 'kg'})`);
                    } else {
                      setQuantity(val);
                    }
                  }
                }}
                onBlur={() => {
                  if (quantity === '' || isNaN(quantity) || Number(quantity) < 1) {
                    setQuantity(1);
                  }
                }}
                className="w-16 text-center font-black text-gray-900 focus:outline-none rounded py-1 text-base [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                aria-label="Số lượng đặt"
              />
              <button
                type="button"
                onClick={() => {
                  const current = Number(quantity) || 1;
                  if (product.stock && current >= product.stock) {
                    alert(`Số lượng tồn kho chỉ còn ${product.stock} ${product.unit || 'kg'}`);
                    return;
                  }
                  setQuantity(current + 1);
                }}
                className="p-3.5 hover:bg-gray-100 rounded-r-2xl transition cursor-pointer active:scale-95"
                aria-label="Tăng số lượng"
              >
                <Plus className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            <div className="text-gray-600 font-medium">
              Tổng tiền:{' '}
              <strong className="text-2xl text-brand-700 font-black">
                {(effectivePrice * (Number(quantity) || 1)).toLocaleString('vi-VN')} đ
              </strong>
            </div>
          </div>
        )}
      </div>

      {/* Action CTA Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
        <button
          type="button"
          onClick={onAddToCart}
          disabled={product.stock <= 0}
          className={`py-4 px-6 rounded-2xl font-black flex items-center justify-center gap-2.5 transition-all shadow-sm ${
            product.stock <= 0
              ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
              : 'bg-brand-50 hover:bg-brand-100 text-brand-700 border-2 border-brand-300 cursor-pointer active:scale-95'
          }`}
        >
          <ShoppingBag className="w-6 h-6" />
          <span>{product.stock <= 0 ? 'Sản Phẩm Tạm Hết Hàng' : 'Thêm Vào Giỏ Hàng'}</span>
        </button>
        <button
          type="button"
          onClick={onBuyNow}
          disabled={product.stock <= 0}
          className={`py-4 px-6 rounded-2xl font-black flex items-center justify-center gap-2.5 transition-all ${
            product.stock <= 0
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-accent-500 hover:bg-accent-600 text-white shadow-lg shadow-accent-500/30 cursor-pointer active:scale-95'
          }`}
        >
          <span>{product.stock <= 0 ? 'Tạm Hết Hàng' : 'Mua Ngay (Giao 2H)'}</span>
        </button>
      </div>

      {/* Trust Guarantees */}
      <ProductTrustBadges />
    </div>
  );
}

