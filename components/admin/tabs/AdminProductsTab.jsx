'use client';

import React from 'react';
import Link from 'next/link';
import { Package, Search, Plus } from 'lucide-react';
import Pagination from '@/components/Pagination';

export default function AdminProductsTab({
  categories,
  filteredProducts,
  paginatedProducts,
  productSearch,
  setProductSearch,
  productCategoryFilter,
  setProductCategoryFilter,
  productStatusFilter,
  setProductStatusFilter,
  productPage,
  setProductPage,
  productPageSize,
  setProductPageSize,
  onOpenAddProductModal,
  onOpenEditProductModal,
  onToggleProductStatus,
  onDeleteProduct,
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden space-y-5 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h2 className="font-heading font-black text-lg text-slate-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-600" />
            <span>Danh Mục Sản Phẩm 4 Mùa</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Quản lý kho hàng, giá bán, tồn kho và hình ảnh sản phẩm
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Tìm tên sản phẩm..."
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              className="pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
            />
          </div>

          <select
            value={productCategoryFilter}
            onChange={(e) => setProductCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={productStatusFilter}
            onChange={(e) => setProductStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="1">Đang hiển thị</option>
            <option value="0">Đã ẩn</option>
          </select>

          <button
            type="button"
            onClick={onOpenAddProductModal}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-brand-600/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Sản Phẩm Mới</span>
          </button>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-100">
            <Package className="w-8 h-8" />
          </div>
          <h4 className="font-heading font-black text-slate-900 text-lg">Không tìm thấy sản phẩm nào</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Chưa có sản phẩm phù hợp với bộ lọc hiện tại. Bấm nút dưới để thêm sản phẩm mới ngay!
          </p>
          <button
            type="button"
            onClick={onOpenAddProductModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold hover:bg-brand-700 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm sản phẩm mới</span>
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[1020px]">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-extrabold uppercase tracking-wider border-b border-slate-200">
                <th className="py-3 px-4 whitespace-nowrap w-16">#Mã SP</th>
                <th className="py-3 px-4 min-w-[280px]">Ảnh & Tên sản phẩm</th>
                <th className="py-3 px-4 whitespace-nowrap">Danh mục</th>
                <th className="py-3 px-4 whitespace-nowrap">Giá bán</th>
                <th className="py-3 px-4 whitespace-nowrap">Giá khuyến mãi</th>
                <th className="py-3 px-4 whitespace-nowrap">Đơn vị</th>
                <th className="py-3 px-4 whitespace-nowrap">Tồn kho</th>
                <th className="py-3 px-4 whitespace-nowrap">Trạng thái</th>
                <th className="py-3 px-4 text-right whitespace-nowrap">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedProducts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-4 font-mono font-bold text-slate-400 whitespace-nowrap">#{p.id}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 shrink-0 overflow-hidden flex items-center justify-center">
                        {p.thumbnail ? (
                          <img
                            src={p.thumbnail}
                            alt={p.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src =
                                'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=200';
                            }}
                          />
                        ) : (
                          <Package className="w-6 h-6 text-slate-400" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5 flex-wrap">
                          <span className="truncate max-w-[220px]">{p.name}</span>
                          {p.is_featured === 1 && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-100 text-amber-800 font-black shrink-0">
                              Nổi bật
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-500 line-clamp-1">{p.description}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-medium whitespace-nowrap">
                    {p.category_name}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                    {parseFloat(p.price).toLocaleString('vi-VN')} đ
                  </td>
                  <td className="py-3 px-4 text-brand-600 font-bold whitespace-nowrap">
                    {p.discount_price ? `${parseFloat(p.discount_price).toLocaleString('vi-VN')} đ` : '-'}
                  </td>
                  <td className="py-3 px-4 text-slate-500 whitespace-nowrap">{p.unit}</td>
                  <td className="py-3 px-4 font-bold whitespace-nowrap">
                    <span
                      className={
                        p.stock <= 0
                          ? 'inline-block text-rose-600 font-black bg-rose-50 px-2.5 py-0.5 rounded-md border border-rose-200 whitespace-nowrap'
                          : p.stock <= 10
                          ? 'text-amber-600 font-black'
                          : 'text-slate-900'
                      }
                    >
                      {p.stock <= 0 ? '0 (Hết hàng)' : p.stock}
                    </span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {p.status === 1 ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                        <span>Đang hiển thị</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-500 border border-slate-200 whitespace-nowrap">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0"></span>
                        <span>Đã ẩn</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onOpenEditProductModal(p)}
                        className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-bold transition cursor-pointer"
                        title="Chỉnh sửa thông tin sản phẩm"
                      >
                        Chỉnh sửa
                      </button>
                      <button
                        type="button"
                        onClick={() => onToggleProductStatus(p)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                          p.status === 1
                            ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        }`}
                        title={
                          p.status === 1
                            ? 'Ẩn sản phẩm khỏi website'
                            : 'Hiển thị sản phẩm lên website'
                        }
                      >
                        {p.status === 1 ? 'Ẩn' : 'Hiển thị'}
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteProduct(p)}
                        className="px-2.5 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg text-xs font-bold transition cursor-pointer"
                        title="Xóa sản phẩm"
                      >
                        Xóa
                      </button>
                      <Link
                        href={`/san-pham/${p.id}`}
                        target="_blank"
                        className="px-2.5 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-xs font-bold transition inline-block"
                        title="Xem chi tiết trên website"
                      >
                        Xem
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Phân trang sản phẩm */}
      {filteredProducts.length > 0 && (
        <Pagination
          currentPage={productPage}
          totalItems={filteredProducts.length}
          pageSize={productPageSize}
          onPageChange={setProductPage}
          onPageSizeChange={setProductPageSize}
          pageSizeOptions={[5, 10, 20, 50]}
          itemName="sản phẩm"
        />
      )}
    </div>
  );
}

