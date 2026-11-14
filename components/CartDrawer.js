'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import { useCart } from './CartContext';

export default function CartDrawer() {
  const pathname = usePathname();
  const { items, updateQuantity, removeFromCart, subtotal, isCartOpen, setIsCartOpen, showToast } = useCart();

  if (pathname?.startsWith('/admin')) return null;
  if (!isCartOpen) return null;

  // Phí giao hàng hiện tại mặc định 0đ (Sẵn sàng tích hợp API đo khoảng cách)

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity cursor-pointer"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-6 py-5 bg-brand-800 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-6 h-6 text-emerald-200" />
              <h3 className="font-extrabold text-xl font-heading">Giỏ Hàng Của Bạn</h3>
              <span className="bg-brand-950/60 text-white px-3 py-0.5 rounded-full font-black">
                {items.length} món
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-xl hover:bg-brand-700 transition text-white cursor-pointer"
              aria-label="Đóng giỏ hàng"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* GreenSM Shipping Info */}
          <div className="bg-emerald-50/80 px-6 py-3.5 border-b border-emerald-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-brand-900 font-bold">
              <Truck className="w-4 h-4 text-brand-600 shrink-0" />
              <span>Giao hàng hỏa tốc đối tác GreenSM</span>
            </div>
            <span className="text-[11px] font-extrabold text-brand-700 bg-white px-2.5 py-0.5 rounded-full border border-emerald-200 shadow-xs">
              Phí ship: 0 đ
            </span>
          </div>

          {/* Item List */}
          <div className="flex-1 overflow-y-auto px-6 py-5 divide-y divide-gray-100">
            {items.length === 0 ? (
              <div className="text-center py-20 space-y-4">
                <div className="w-20 h-20 rounded-full bg-emerald-50 text-brand-600 flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h4 className="font-extrabold text-gray-800 text-2xl font-heading">Giỏ hàng đang trống</h4>
                <p className="text-gray-500 max-w-xs mx-auto font-medium leading-relaxed">
                  Hãy dạo quanh các quầy trái cây 4 mùa và chọn những quả tươi ngọt nhất nhé!
                </p>
                <Link
                  href="/#product-section"
                  onClick={() => setIsCartOpen(false)}
                  className="mt-2 btn-primary inline-flex items-center justify-center cursor-pointer"
                >
                  Khám phá trái cây ngay
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="py-5 flex gap-4 items-center">
                  <img
                    src={item.thumbnail}
                    alt={item.name}
                    className="w-20 h-20 rounded-2xl object-cover border border-gray-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-extrabold text-gray-900 truncate">{item.name}</h4>
                    <p className="text-brand-700 font-black mt-1">
                      {item.price.toLocaleString('vi-VN')} đ <span className="text-gray-400 font-normal">/ {item.unit}</span>
                    </p>
                    <div className="flex items-center gap-3 mt-2.5">
                      <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-brand-500">
                        <button
                          onClick={() => updateQuantity(item.id, (Number(item.quantity) || 1) - 1)}
                          className="p-2 hover:bg-gray-200 rounded-l-xl transition cursor-pointer active:scale-95"
                          aria-label="Giảm số lượng"
                        >
                          <Minus className="w-4 h-4 text-gray-700" />
                        </button>
                        <input
                          type="number"
                          min="1"
                          max={item.stock || 999}
                          value={item.quantity}
                          onChange={(e) => {
                            const raw = e.target.value;
                            if (raw === '') {
                              updateQuantity(item.id, '');
                              return;
                            }
                            const val = parseInt(raw, 10);
                            if (!isNaN(val)) {
                              if (val < 1) {
                                updateQuantity(item.id, 1);
                              } else if (item.stock && val > item.stock) {
                                updateQuantity(item.id, item.stock);
                                if (showToast) showToast(`Tồn kho chỉ còn ${item.stock} ${item.unit || ''}!`);
                              } else {
                                updateQuantity(item.id, val);
                              }
                            }
                          }}
                          onBlur={(e) => {
                            const val = parseInt(e.target.value, 10);
                            if (isNaN(val) || val < 1) {
                              updateQuantity(item.id, 1);
                            }
                          }}
                          className="w-11 text-center font-black text-gray-900 bg-transparent focus:outline-none focus:bg-white rounded text-sm py-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          aria-label="Số lượng sản phẩm"
                        />
                        <button
                          onClick={() => {
                            const current = Number(item.quantity) || 1;
                            if (item.stock && current >= item.stock) {
                              if (showToast) showToast(`Tồn kho chỉ còn ${item.stock} ${item.unit || ''}!`);
                              return;
                            }
                            updateQuantity(item.id, current + 1);
                          }}
                          className="p-2 hover:bg-gray-200 rounded-r-xl transition cursor-pointer active:scale-95"
                          aria-label="Tăng số lượng"
                        >
                          <Plus className="w-4 h-4 text-gray-700" />
                        </button>
                      </div>
                      <span className="text-gray-400 font-semibold text-xs">
                        = {(item.price * (Number(item.quantity) || 0)).toLocaleString('vi-VN')} đ
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2.5 text-gray-400 hover:text-red-600 transition rounded-xl hover:bg-red-50 cursor-pointer"
                    title="Xóa món này"
                    aria-label={`Xóa ${item.name} khỏi giỏ`}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer Subtotal & Action */}
          {items.length > 0 && (
            <div className="border-t border-gray-200 px-6 py-5 bg-gray-50 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 font-bold">Tạm tính:</span>
                <span className="text-2xl font-black text-brand-800">{subtotal.toLocaleString('vi-VN')} đ</span>
              </div>
              <p className="text-gray-500 font-medium">
                * Phí vận chuyển và ưu đãi giảm giá sẽ được áp dụng tại bước thanh toán.
              </p>
              <Link
                href="/dat-hang"
                onClick={() => setIsCartOpen(false)}
                className="w-full py-4 px-6 bg-accent-500 hover:bg-accent-600 text-white rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg shadow-accent-500/30 transition-all cursor-pointer transform active:scale-[0.99]"
              >
                <span>Tiến hành đặt hàng</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
