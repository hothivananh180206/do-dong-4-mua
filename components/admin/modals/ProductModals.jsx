'use client';

import React from 'react';
import { RefreshCw, Upload, Package, Plus } from 'lucide-react';

export default function ProductModals({
  showAddProductModal,
  setShowAddProductModal,
  handleCreateProduct,
  newProduct,
  setNewProduct,
  categories,
  handleFileUpload,
  uploadingImage,
  editProductModal,
  setEditProductModal,
  handleUpdateProductSubmit,
  handleDeleteExtraImage
}) {
  return (
    <>
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-heading font-black text-lg text-slate-900">Thêm Sản Phẩm 4 Mùa Mới</h3>
              <button onClick={() => setShowAddProductModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">✕</button>
            </div>
            <form onSubmit={handleCreateProduct} noValidate className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tên trái cây *</label>
                <input
                  type="text" required placeholder="Ví dụ: Bơ Sáp 034 Đắk Lắk"
                  value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Danh mục</label>
                  <select
                    value={newProduct.category_id} onChange={(e) => setNewProduct({ ...newProduct, category_id: parseInt(e.target.value, 10) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium bg-white"
                  >
                    {categories.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Đơn vị</label>
                  <select
                    value={newProduct.unit} onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium bg-white"
                  >
                    <option value="kg">kg</option>
                    <option value="trái">trái</option>
                    <option value="giỏ">giỏ</option>
                    <option value="combo">combo</option>
                    <option value="hộp">hộp</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Giá bán *</label>
                  <input
                    type="number" required placeholder="80000"
                    value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Giá KM</label>
                  <input
                    type="number" placeholder="65000"
                    value={newProduct.discount_price} onChange={(e) => setNewProduct({ ...newProduct, discount_price: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tồn kho</label>
                  <input
                    type="number" value={newProduct.stock} onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Hình ảnh sản phẩm (Upload từ máy tính: JPG, PNG, WEBP &le; 5MB) *
                </label>
                <div className="border-2 border-dashed border-emerald-300 rounded-2xl p-4 bg-emerald-50/30 hover:bg-emerald-50/60 transition relative">
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                    onChange={(e) => handleFileUpload(e, 'product')}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    disabled={uploadingImage}
                  />
                  {uploadingImage ? (
                    <div className="flex items-center justify-center gap-2 text-brand-700 py-3">
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span className="font-bold text-xs">Đang tải ảnh từ máy tính lên hệ thống...</span>
                    </div>
                  ) : newProduct.thumbnail ? (
                    <div className="flex items-center gap-3">
                      <img
                        src={newProduct.thumbnail}
                        alt="Preview"
                        className="w-16 h-16 rounded-xl object-cover border border-brand-300 shadow-sm"
                      />
                      <div className="text-left flex-1 min-w-0">
                        <p className="font-bold text-emerald-700 text-xs truncate">✓ Đã tải ảnh lên: {newProduct.thumbnail}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">Bấm vào đây nếu muốn chọn đổi ảnh khác từ máy tính</p>
                      </div>
                    </div>
                  ) : (
                    <div className="py-2 text-center text-slate-500">
                      <Upload className="w-6 h-6 mx-auto mb-1 text-brand-600" />
                      <p className="font-bold text-xs text-brand-800">Bấm để chọn ảnh từ máy tính (Browse...)</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Định dạng JPG, PNG, WEBP — Dung lượng tối đa 5 MB</p>
                    </div>
                  )}
                </div>

                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 shrink-0">Hoặc dán link:</span>
                  <input
                    type="text"
                    placeholder="https://... hoặc /uploads/..."
                    value={newProduct.thumbnail}
                    onChange={(e) => setNewProduct({ ...newProduct, thumbnail: e.target.value })}
                    className="flex-1 px-2.5 py-1 text-[11px] rounded-lg border border-slate-200 bg-slate-50"
                  />
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Mô tả & Đặc điểm mùa vụ</label>
                <textarea
                  rows={2} value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2.5">
                <button type="button" onClick={() => setShowAddProductModal(false)} className="px-4 py-2 bg-slate-100 rounded-xl font-bold text-slate-600 hover:bg-slate-200 cursor-pointer">Hủy bỏ</button>
                <button type="submit" className="px-5 py-2 bg-brand-600 rounded-xl font-bold text-white hover:bg-brand-700 cursor-pointer">Lưu Sản Phẩm</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CHỈNH SỬA SẢN PHẨM */}
      {editProductModal.isOpen && editProductModal.product && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-heading font-black text-lg text-slate-900 flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-600" />
                  <span>Chỉnh Sửa Thông Tin Sản Phẩm</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Mã sản phẩm: #{editProductModal.product.id} • {editProductModal.product.slug}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditProductModal({ isOpen: false, product: null, name: '', category_id: 1, price: '', discount_price: '', unit: 'kg', stock: 0, thumbnail: '', description: '', is_featured: 0, status: 1 })}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center transition cursor-pointer text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateProductSubmit} noValidate className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tên trái cây *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Bơ Sáp 034 Đắk Lắk"
                  value={editProductModal.name}
                  onChange={(e) => setEditProductModal({ ...editProductModal, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Danh mục *</label>
                  <select
                    value={editProductModal.category_id}
                    onChange={(e) => setEditProductModal({ ...editProductModal, category_id: parseInt(e.target.value, 10) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Đơn vị tính *</label>
                  <select
                    value={editProductModal.unit}
                    onChange={(e) => setEditProductModal({ ...editProductModal, unit: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium bg-white"
                  >
                    <option value="kg">kg</option>
                    <option value="trái">trái</option>
                    <option value="giỏ">giỏ</option>
                    <option value="combo">combo</option>
                    <option value="hộp">hộp</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Giá bán gốc (đ) *</label>
                  <input
                    type="number"
                    required
                    min="1000"
                    placeholder="80000"
                    value={editProductModal.price}
                    onChange={(e) => setEditProductModal({ ...editProductModal, price: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Giá khuyến mãi (đ)</label>
                  <input
                    type="number"
                    placeholder="Để trống nếu không giảm"
                    value={editProductModal.discount_price}
                    onChange={(e) => setEditProductModal({ ...editProductModal, discount_price: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tồn kho *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={editProductModal.stock}
                    onChange={(e) => setEditProductModal({ ...editProductModal, stock: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Trạng thái kinh doanh</label>
                  <select
                    value={editProductModal.status}
                    onChange={(e) => setEditProductModal({ ...editProductModal, status: parseInt(e.target.value, 10) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={1}>Đang hiển thị</option>
                    <option value={0}>Đã ẩn khỏi website</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sản phẩm nổi bật</label>
                  <select
                    value={editProductModal.is_featured}
                    onChange={(e) => setEditProductModal({ ...editProductModal, is_featured: parseInt(e.target.value, 10) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={0}>Bình thường</option>
                    <option value={1}>Nổi bật trang chủ</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Hình ảnh sản phẩm (Upload từ máy tính: JPG, PNG, WEBP &le; 5MB)
                </label>
                <div className="border-2 border-dashed border-blue-300 rounded-2xl p-4 bg-blue-50/30 hover:bg-blue-50/60 transition relative">
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                    onChange={(e) => handleFileUpload(e, 'edit_product')}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    disabled={uploadingImage}
                  />
                  {uploadingImage ? (
                    <div className="flex items-center justify-center gap-2 text-blue-700 py-3">
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span className="font-bold text-xs">Đang tải ảnh từ máy tính lên hệ thống...</span>
                    </div>
                  ) : editProductModal.thumbnail ? (
                    <div className="flex items-center gap-3">
                      <img
                        src={editProductModal.thumbnail}
                        alt="Preview"
                        className="w-16 h-16 rounded-xl object-cover border border-blue-300 shadow-sm"
                      />
                      <div className="text-left flex-1 min-w-0">
                        <p className="font-bold text-blue-700 text-xs truncate">✓ Đã tải ảnh lên: {editProductModal.thumbnail}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">Bấm vào đây nếu muốn chọn đổi ảnh khác từ máy tính</p>
                      </div>
                    </div>
                  ) : (
                    <div className="py-2 text-center text-slate-500">
                      <Upload className="w-6 h-6 mx-auto mb-1 text-blue-600" />
                      <p className="font-bold text-xs text-blue-800">Bấm để chọn ảnh từ máy tính (Browse...)</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Định dạng JPG, PNG, WEBP — Dung lượng tối đa 5 MB</p>
                    </div>
                  )}
                </div>

                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 shrink-0">Hoặc dán link:</span>
                  <input
                    type="text"
                    placeholder="https://... hoặc /uploads/..."
                    value={editProductModal.thumbnail}
                    onChange={(e) => setEditProductModal({ ...editProductModal, thumbnail: e.target.value })}
                    className="flex-1 px-2.5 py-1 text-[11px] rounded-lg border border-slate-200 bg-slate-50"
                  />
                </div>
              </div>

              {/* QUẢN LÝ ẢNH PHỤ SẢN PHẨM */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block font-bold text-slate-800 text-xs">
                      Bộ sưu tập ảnh phụ chi tiết
                    </label>
                    <p className="text-[11px] text-slate-500">Mỗi sản phẩm có thể có nhiều ảnh phụ (JPG, PNG, WebP &le; 5MB)</p>
                  </div>
                  <div className="relative shrink-0">
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                      onChange={(e) => handleFileUpload(e, 'product_extra')}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      disabled={uploadingImage}
                    />
                    <button
                      type="button"
                      disabled={uploadingImage}
                      className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-blue-600/20 cursor-pointer whitespace-nowrap"
                    >
                      <Plus className="w-4 h-4 shrink-0" />
                      <span>Thêm ảnh phụ</span>
                    </button>
                  </div>
                </div>

                {editProductModal.extraImages && editProductModal.extraImages.length > 0 ? (
                  <div className="grid grid-cols-4 gap-2 pt-1">
                    {editProductModal.extraImages.map((img) => (
                      <div key={img.id} className="relative group rounded-xl overflow-hidden border border-slate-200 bg-white aspect-square flex items-center justify-center">
                        <img src={img.image_url} alt="Ảnh phụ" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleDeleteExtraImage(img.id)}
                          className="absolute top-1 right-1 w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center opacity-90 hover:opacity-100 hover:scale-110 transition shadow cursor-pointer text-xs font-bold"
                          title="Xóa ảnh này"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400 italic py-1">
                    Chưa có ảnh phụ nào cho sản phẩm này. Bấm "+ Thêm ảnh phụ" để tải thêm ảnh chi tiết.
                  </p>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mô tả chi tiết</label>
                <textarea
                  rows={2}
                  value={editProductModal.description}
                  onChange={(e) => setEditProductModal({ ...editProductModal, description: e.target.value })}
                  placeholder="Mô tả nguồn gốc xuất xứ, hương vị, độ ngọt, mùa vụ..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditProductModal({ isOpen: false, product: null, name: '', category_id: 1, price: '', discount_price: '', unit: 'kg', stock: 0, thumbnail: '', description: '', is_featured: 0, status: 1 })}
                  className="px-4 py-2 bg-slate-100 rounded-xl font-bold text-slate-600 hover:bg-slate-200 cursor-pointer transition"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold text-white cursor-pointer transition shadow-md shadow-blue-600/20"
                >
                  Lưu Thay Đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </>
  );
}
