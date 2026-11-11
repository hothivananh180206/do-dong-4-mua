'use client';

import React, { useState } from 'react';
import { Tag, Check, SlidersHorizontal, X, RefreshCw } from 'lucide-react';

export default function ProductFilterSection({
  categories = [],
  currentCategory = '',
  currentSeason = '',
  currentSearch = '',
  inStockFilter = false,
  discountedFilter = false,
  minPriceParam = '',
  maxPriceParam = '',
  sort = 'newest',
  onSortChange,
  onUpdateFilters,
  onClearAllFilters
}) {
  const [customMin, setCustomMin] = useState(minPriceParam);
  const [customMax, setCustomMax] = useState(maxPriceParam);
  const [showPricePopover, setShowPricePopover] = useState(false);

  const getPricePreset = () => {
    if (!minPriceParam && !maxPriceParam) return '';
    if (!minPriceParam && maxPriceParam === '50000') return 'under_50';
    if (minPriceParam === '50000' && maxPriceParam === '100000') return '50_100';
    if (minPriceParam === '100000' && maxPriceParam === '200000') return '100_200';
    if (minPriceParam === '200000' && !maxPriceParam) return 'above_200';
    return 'custom';
  };

  const handlePricePresetSelect = (preset) => {
    if (preset === '') {
      onUpdateFilters({ min_price: '', max_price: '' });
      setShowPricePopover(false);
    } else if (preset === 'under_50') {
      onUpdateFilters({ min_price: '', max_price: '50000' });
      setShowPricePopover(false);
    } else if (preset === '50_100') {
      onUpdateFilters({ min_price: '50000', max_price: '100000' });
      setShowPricePopover(false);
    } else if (preset === '100_200') {
      onUpdateFilters({ min_price: '100000', max_price: '200000' });
      setShowPricePopover(false);
    } else if (preset === 'above_200') {
      onUpdateFilters({ min_price: '200000', max_price: '' });
      setShowPricePopover(false);
    } else if (preset === 'custom') {
      setShowPricePopover(true);
    }
  };

  const applyCustomPrice = () => {
    onUpdateFilters({
      min_price: customMin ? customMin.trim() : '',
      max_price: customMax ? customMax.trim() : ''
    });
    setShowPricePopover(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Category tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => onUpdateFilters({ category: '' })}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              currentCategory === ''
                ? 'bg-brand-700 text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            Tất Cả Danh Mục
          </button>
          {categories.map((c) => (
            <button
              type="button"
              key={c.id}
              onClick={() => onUpdateFilters({ category: c.slug })}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                currentCategory === c.slug
                  ? 'bg-brand-700 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {c.name} ({c.product_count || 0})
            </button>
          ))}
        </div>

        {/* Quick Filters & Sort Selector */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {/* Lọc theo Khoảng giá */}
          <div className="relative">
            <select
              value={getPricePreset()}
              onChange={(e) => {
                if (e.target.value === 'custom') {
                  setShowPricePopover(true);
                } else {
                  handlePricePresetSelect(e.target.value);
                }
              }}
              className={`font-bold border rounded-xl px-3 py-2 text-xs transition cursor-pointer shadow-sm ${
                getPricePreset() !== ''
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-1 ring-emerald-500'
                  : 'bg-white border-gray-200 text-slate-700 hover:border-gray-300'
              }`}
            >
              <option value="">Khoảng giá: Tất cả</option>
              <option value="under_50">Dưới 50.000 đ</option>
              <option value="50_100">50.000 đ - 100.000 đ</option>
              <option value="100_200">100.000 đ - 200.000 đ</option>
              <option value="above_200">Trên 200.000 đ</option>
              <option value="custom">Tùy chọn khoảng giá...</option>
            </select>

            {/* Popover tùy chọn khoảng giá */}
            {showPricePopover && (
              <div className="absolute top-full right-0 sm:left-0 mt-2 z-40 bg-white border border-gray-200 shadow-xl rounded-2xl p-4 w-72 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-gray-900 uppercase tracking-wide">Nhập khoảng giá (VNĐ)</h4>
                  <button
                    type="button"
                    onClick={() => setShowPricePopover(false)}
                    className="text-gray-400 hover:text-gray-600 p-0.5 rounded-lg cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-gray-500 mb-1 block">Tối thiểu (đ)</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={customMin}
                      onChange={(e) => setCustomMin(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-600"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-500 mb-1 block">Tối đa (đ)</label>
                    <input
                      type="number"
                      placeholder="500000"
                      value={customMax}
                      onChange={(e) => setCustomMax(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-600"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setCustomMin('');
                      setCustomMax('');
                      onUpdateFilters({ min_price: '', max_price: '' });
                      setShowPricePopover(false);
                    }}
                    className="px-3 py-1.5 text-xs font-bold text-gray-500 hover:text-gray-700 cursor-pointer"
                  >
                    Đặt lại
                  </button>
                  <button
                    type="button"
                    onClick={applyCustomPrice}
                    className="px-4 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-extrabold shadow-sm cursor-pointer"
                  >
                    Áp dụng
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Filter: Đang giảm giá */}
          <button
            type="button"
            onClick={() => onUpdateFilters({ discounted: discountedFilter ? '' : '1' })}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              discountedFilter
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-rose-50 hover:text-rose-600'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Đang giảm giá</span>
          </button>

          {/* Quick Filter: Còn hàng */}
          <button
            type="button"
            onClick={() => onUpdateFilters({ in_stock: inStockFilter ? '' : '1' })}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              inStockFilter
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-emerald-50 hover:text-emerald-700'
            }`}
          >
            <Check className="w-3.5 h-3.5" />
            <span>Còn hàng</span>
          </button>

          {/* Sắp xếp */}
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400 font-bold text-xs flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </span>
            <select
              value={sort}
              onChange={(e) => onSortChange(e.target.value)}
              className="font-bold bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-600 cursor-pointer shadow-sm"
            >
              <option value="newest">Mới nhất</option>
              <option value="price_asc">Giá tăng dần</option>
              <option value="price_desc">Giá giảm dần</option>
              <option value="name_asc">Tên A → Z</option>
              <option value="name_desc">Tên Z → A</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Filter Notification Bar */}
      {(currentSearch || currentCategory || currentSeason || inStockFilter || discountedFilter || minPriceParam || maxPriceParam) && (
        <div className="bg-emerald-50/80 border border-emerald-200 px-4 py-2.5 rounded-2xl flex flex-wrap items-center justify-between gap-2 text-xs shadow-sm">
          <div className="text-brand-900 font-medium flex flex-wrap items-center gap-1.5">
            <span className="font-bold text-slate-500">Đang lọc theo:</span>
            {currentSearch && (
              <span className="font-extrabold bg-white px-2 py-0.5 rounded-lg border border-emerald-200 text-accent-700">
                Từ khóa: &quot;{currentSearch}&quot;
              </span>
            )}
            {currentCategory && (
              <span className="font-extrabold bg-white px-2 py-0.5 rounded-lg border border-emerald-200 text-brand-700">
                Danh mục: {categories.find(c => c.slug === currentCategory || String(c.id) === currentCategory)?.name || currentCategory}
              </span>
            )}
            {currentSeason && (
              <span className="font-extrabold bg-white px-2 py-0.5 rounded-lg border border-emerald-200 text-amber-700 uppercase">
                Mùa: {currentSeason}
              </span>
            )}
            {discountedFilter && (
              <span className="font-extrabold bg-rose-100 text-rose-700 px-2 py-0.5 rounded-lg">
                Chỉ hàng giảm giá
              </span>
            )}
            {inStockFilter && (
              <span className="font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-lg">
                Chỉ hàng còn trong kho
              </span>
            )}
            {minPriceParam && !maxPriceParam && (
              <span className="font-extrabold bg-white px-2 py-0.5 rounded-lg border border-emerald-200 text-emerald-800">
                Giá từ: {Number(minPriceParam).toLocaleString('vi-VN')} đ
              </span>
            )}
            {!minPriceParam && maxPriceParam && (
              <span className="font-extrabold bg-white px-2 py-0.5 rounded-lg border border-emerald-200 text-emerald-800">
                Giá dưới: {Number(maxPriceParam).toLocaleString('vi-VN')} đ
              </span>
            )}
            {minPriceParam && maxPriceParam && (
              <span className="font-extrabold bg-white px-2 py-0.5 rounded-lg border border-emerald-200 text-emerald-800">
                Khoảng giá: {Number(minPriceParam).toLocaleString('vi-VN')} đ - {Number(maxPriceParam).toLocaleString('vi-VN')} đ
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClearAllFilters}
            className="font-bold text-red-600 hover:text-red-700 hover:underline flex items-center gap-1 cursor-pointer text-xs ml-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Xóa bộ lọc</span>
          </button>
        </div>
      )}
    </div>
  );
}

