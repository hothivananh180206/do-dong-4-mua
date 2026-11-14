'use client';

import React from 'react';
import { ImageIcon, Plus, Search, X, RotateCcw, ExternalLink, EyeOff, Eye, Edit3, Trash2 } from 'lucide-react';

export default function AdminBannersTab({
  banners,
  filteredBanners,
  bannerSearch,
  setBannerSearch,
  bannerStatusFilter,
  setBannerStatusFilter,
  onOpenAddBannerModal,
  onToggleBannerStatus,
  onEditBanner,
  onDeleteBanner,
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden space-y-5 p-6">
      {/* Header & Thêm mới */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h2 className="font-heading font-black text-lg text-slate-900 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-emerald-600" />
            <span>Quản Lý Banner Quảng Cáo</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Banner trượt tự động trên trang chủ chào đón khách hàng theo thứ tự ưu tiên
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenAddBannerModal}
          className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-brand-600/20 cursor-pointer transition"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Banner</span>
        </button>
      </div>

      {/* Thống kê nhanh Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 bg-slate-50 border border-slate-200/70 rounded-xl">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Tổng số banner</div>
          <div className="text-xl font-black text-slate-900 mt-0.5">{banners.length} banner</div>
        </div>
        <div className="p-3.5 bg-emerald-50/60 border border-emerald-200/60 rounded-xl">
          <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Đang hiển thị</div>
          <div className="text-xl font-black text-emerald-800 mt-0.5">
            {banners.filter((b) => b.status === 1).length} banner
          </div>
        </div>
        <div className="p-3.5 bg-amber-50/60 border border-amber-200/60 rounded-xl">
          <div className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">Đang tạm ẩn</div>
          <div className="text-xl font-black text-amber-800 mt-0.5">
            {banners.filter((b) => b.status === 0).length} banner
          </div>
        </div>
      </div>

      {/* Toolbar tìm kiếm & lọc */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm banner theo tiêu đề..."
            value={bannerSearch}
            onChange={(e) => setBannerSearch(e.target.value)}
            className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          />
          {bannerSearch && (
            <button
              type="button"
              onClick={() => setBannerSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <div className="w-full sm:w-52">
          <select
            value={bannerStatusFilter}
            onChange={(e) => setBannerStatusFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white focus:outline-none focus:border-brand-500"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="ACTIVE">Đang hiển thị</option>
            <option value="INACTIVE">Đang tạm ẩn</option>
          </select>
        </div>
        {(bannerSearch || bannerStatusFilter !== '') && (
          <button
            type="button"
            onClick={() => {
              setBannerSearch('');
              setBannerStatusFilter('');
            }}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Đặt lại</span>
          </button>
        )}
      </div>

      {filteredBanners.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100">
            <ImageIcon className="w-8 h-8" />
          </div>
          <h4 className="font-heading font-black text-slate-900 text-lg">Chưa có banner nào phù hợp</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Thử thay đổi từ khóa tìm kiếm hoặc bấm Thêm banner mới để tạo banner nổi bật trên trang chủ!
          </p>
          <button
            type="button"
            onClick={onOpenAddBannerModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold hover:bg-brand-700 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm banner ngay</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBanners.map((bn) => (
            <div
              key={bn.id}
              className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm space-y-3 p-3 bg-white flex flex-col justify-between hover:shadow-md transition"
            >
              <div className="space-y-3">
                <div className="relative aspect-[4/1] rounded-xl overflow-hidden bg-slate-100 border border-slate-100">
                  <img src={bn.image_url} alt={bn.title} className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-black/60 text-white backdrop-blur-xs">
                      Thứ tự: {bn.display_order}
                    </span>
                  </div>
                  <div className="absolute top-2 right-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-xs ${
                        bn.status === 1 ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                      }`}
                    >
                      {bn.status === 1 ? 'Hiển thị' : 'Đang ẩn'}
                    </span>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900 line-clamp-1">{bn.title}</h4>
                  <p
                    className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 truncate"
                    title={bn.link_url || '/'}
                  >
                    <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="font-mono text-slate-500 truncate">{bn.link_url || '/'}</span>
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5">
                <button
                  type="button"
                  onClick={() => onToggleBannerStatus(bn)}
                  title={bn.status === 1 ? 'Tạm ẩn banner' : 'Hiển thị banner lên trang chủ'}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                    bn.status === 1
                      ? 'bg-amber-50 hover:bg-amber-100 text-amber-700'
                      : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                  }`}
                >
                  {bn.status === 1 ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{bn.status === 1 ? 'Tạm ẩn' : 'Hiển thị'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onEditBanner(bn)}
                  title="Chỉnh sửa banner"
                  className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => onDeleteBanner(bn)}
                  title="Xóa banner vĩnh viễn"
                  className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

