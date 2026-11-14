'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Image as ImageIcon, 
  X, 
  RefreshCw, 
  Upload, 
  Edit3, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Move 
} from 'lucide-react';

/**
 * Component Khung Xem Trước & Căn Chỉnh Vị Trí Ảnh Banner (Giữ nguyên toàn bộ ảnh gốc, đặt khung ranh giới 4:1 lên trên y hệt Logo)
 */
function BannerAdjuster({
  imageUrl,
  onImageChange,
  uploadingImage,
  handleFileUpload,
  uploadType = 'banner'
}) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const frameRef = useRef(null);
  const imgRef = useRef(null);

  // Reset căn chỉnh khi đổi URL ảnh mới
  useEffect(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [imageUrl]);

  // Mouse Pan Handlers
  const handleMouseDown = (e) => {
    if (!imageUrl) return;
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    if (isDragging) setIsDragging(false);
  };

  // Touch Pan Handlers (Mobile)
  const handleTouchStart = (e) => {
    if (!imageUrl || e.touches.length !== 1) return;
    setIsDragging(true);
    const touch = e.touches[0];
    setDragStart({ x: touch.clientX - position.x, y: touch.clientY - position.y });
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const touch = e.touches[0];
    setPosition({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y
    });
  };

  return (
    <div className="space-y-2.5">
      {/* Tiêu đề & Nhãn cố định chuẩn 4:1 */}
      <div className="flex items-center justify-between">
        <label className="font-bold text-slate-700 flex items-center gap-1.5 text-xs">
          <Eye className="w-3.5 h-3.5 text-emerald-600" />
          <span>Khung xem trước banner (Tỷ lệ 4:1) *</span>
        </label>
        <span className="px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-[11px] border border-emerald-100">
          Tỷ lệ 4:1 (Chuẩn Trang Chủ)
        </span>
      </div>

      {/* Khung căn chỉnh hình ảnh trực quan (Giữ nguyên toàn bộ ảnh gốc, đặt khung 4:1 lên trên y hệt Logo) */}
      <div
        ref={frameRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
        className="relative w-full h-72 bg-slate-950 rounded-2xl overflow-hidden flex items-center justify-center select-none cursor-grab active:cursor-grabbing border border-slate-800"
      >
        {uploadingImage ? (
          <div className="flex flex-col items-center gap-2 text-white">
            <RefreshCw className="w-6 h-6 animate-spin text-emerald-400" />
            <span className="font-bold text-xs">Đang tải ảnh từ máy tính lên...</span>
          </div>
        ) : imageUrl ? (
          <>
            <img
              ref={imgRef}
              src={imageUrl}
              alt="Bản xem trước banner"
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                transformOrigin: 'center center',
                maxHeight: '88%',
                maxWidth: '88%',
                objectFit: 'contain',
                transition: isDragging ? 'none' : 'transform 0.1s ease-out'
              }}
              className="max-w-none pointer-events-none select-none"
              draggable={false}
              crossOrigin="anonymous"
            />

            {/* Khung ranh giới Banner tỷ lệ 4:1 (Spotlight Frame y hệt Logo bên Cấu hình) */}
            <div
              className="w-[90%] aspect-[4/1] pointer-events-none rounded-xl border-2 border-emerald-400 shadow-[0_0_0_9999px_rgba(2,6,23,0.76)] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
            >
              <div className="w-3 h-3 border-t border-l border-emerald-300/40 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>

            {/* Gợi ý kéo chuột căn chỉnh */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-slate-900/90 backdrop-blur-md text-white text-[11px] font-medium flex items-center gap-1.5 shadow-lg border border-slate-700 pointer-events-none whitespace-nowrap z-10">
              <Move className="w-3 h-3 text-emerald-400" />
              <span>Kéo chuột để đặt lại vị trí hình ảnh</span>
            </div>

            {/* Nút xóa ảnh để chọn lại */}
            <button
              type="button"
              onClick={() => onImageChange('')}
              className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-black/60 hover:bg-rose-600/90 text-white backdrop-blur-md transition cursor-pointer z-10"
              title="Xóa ảnh để chọn lại"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </>
        ) : (
          <div className="text-center p-4 text-slate-400">
            <ImageIcon className="w-8 h-8 mx-auto mb-1 text-slate-500/80" />
            <p className="font-bold text-xs text-slate-300">
              Khung xem trước banner (Tỷ lệ 4:1)
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Tải ảnh lên hoặc dán link URL bên dưới để xem vị trí trong khung banner
            </p>
          </div>
        )}
      </div>

      {/* THANH CĂN CHỈNH ZOOM VÀ ĐẶT LẠI */}
      {imageUrl && (
        <div className="flex items-center gap-3 px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-xl">
          <button
            type="button"
            onClick={() => setScale((s) => Math.max(0.5, Number((s - 0.1).toFixed(2))))}
            className="w-8 h-8 rounded-full bg-white hover:bg-slate-200 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 transition cursor-pointer shrink-0 shadow-xs"
            title="Thu nhỏ"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <input
            type="range"
            min="0.5"
            max="3"
            step="0.05"
            value={scale}
            onChange={(e) => setScale(parseFloat(e.target.value))}
            className="flex-1 accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
          />

          <button
            type="button"
            onClick={() => setScale((s) => Math.min(3, Number((s + 0.1).toFixed(2))))}
            className="w-8 h-8 rounded-full bg-white hover:bg-slate-200 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 transition cursor-pointer shrink-0 shadow-xs"
            title="Phóng to"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => {
              setScale(1);
              setPosition({ x: 0, y: 0 });
            }}
            className="px-3 py-1.5 text-xs rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold transition cursor-pointer flex items-center gap-1.5 shrink-0 shadow-xs"
            title="Đặt lại vị trí và tỉ lệ ban đầu"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Đặt lại</span>
          </button>
        </div>
      )}

      {/* Khối tải ảnh & nhập URL */}
      <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
        <div className="flex items-center gap-2">
          <label className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition cursor-pointer inline-flex items-center gap-1.5 shadow-sm text-xs shrink-0">
            <Upload className="w-3.5 h-3.5" />
            <span>Tải ảnh từ máy tính</span>
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
              onChange={(e) => handleFileUpload(e, uploadType)}
              className="hidden"
              disabled={uploadingImage}
            />
          </label>
          <span className="text-[11px] text-slate-500 font-medium truncate">
            JPG, PNG, WEBP &le; 5 MB (Lưu ảnh nguyên bản 100%)
          </span>
        </div>

        <div className="flex items-center gap-2 pt-1 border-t border-slate-200/60">
          <span className="text-[11px] text-slate-500 font-bold shrink-0">Hoặc dán URL:</span>
          <input
            type="text"
            placeholder="https://... hoặc /uploads/..."
            value={imageUrl || ''}
            onChange={(e) => onImageChange(e.target.value)}
            className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-mono focus:outline-none focus:border-brand-500"
          />
        </div>
      </div>
    </div>
  );
}

export default function BannerModals({
  showAddBannerModal,
  setShowAddBannerModal,
  handleCreateBanner,
  newBanner,
  setNewBanner,
  handleFileUpload,
  uploadingImage,
  editingBanner,
  setEditingBanner,
  handleUpdateBanner,
  deletingBanner,
  setDeletingBanner,
  handleConfirmDeleteBanner
}) {
  return (
    <>
      {/* 1. MODAL THÊM BANNER MỚI (FR-042) */}
      {showAddBannerModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-heading font-black text-lg text-slate-900 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-emerald-600" />
                <span>Thêm Banner Trang Chủ</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddBannerModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateBanner} noValidate className="space-y-4 text-xs">
              {/* Tiêu đề banner */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tiêu đề banner *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Mùa Cam Sành Mọng Nước - Giảm Giá 20%"
                  value={newBanner.title}
                  onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-brand-500 text-xs"
                />
              </div>

              {/* KHUNG CĂN CHỈNH BANNER (Giữ nguyên toàn bộ ảnh gốc, đặt khung 4:1 lên trên y hệt Logo) */}
              <BannerAdjuster
                imageUrl={newBanner.image_url}
                onImageChange={(url) => setNewBanner({ ...newBanner, image_url: url })}
                uploadingImage={uploadingImage}
                handleFileUpload={handleFileUpload}
                uploadType="banner"
              />

              {/* Đường dẫn khi click vào banner */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Đường dẫn liên kết khi bấm vào banner</label>
                <input
                  type="text"
                  placeholder="Ví dụ: / hoặc /san-pham/1"
                  value={newBanner.link_url}
                  onChange={(e) => setNewBanner({ ...newBanner, link_url: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-brand-500 font-mono text-xs"
                />
              </div>

              {/* Thứ tự hiển thị */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Thứ tự hiển thị (Số nhỏ xếp trước)</label>
                <input
                  type="number"
                  value={newBanner.display_order}
                  onChange={(e) => setNewBanner({ ...newBanner, display_order: parseInt(e.target.value, 10) || 0 })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-brand-500 text-xs"
                />
              </div>

              {/* Nút hành động */}
              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddBannerModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-600 transition cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={uploadingImage}
                  className="px-5 py-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white rounded-xl font-bold transition shadow-md shadow-brand-600/20 cursor-pointer flex items-center gap-1.5"
                >
                  <span>Thêm Banner</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. MODAL CHỈNH SỬA BANNER (FR-042) */}
      {editingBanner && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-heading font-black text-lg text-slate-900 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-blue-600" />
                <span>Chỉnh Sửa Banner</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingBanner(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateBanner} noValidate className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tiêu đề banner *</label>
                <input
                  type="text"
                  required
                  placeholder="Tiêu đề banner"
                  value={editingBanner.title}
                  onChange={(e) => setEditingBanner({ ...editingBanner, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-brand-500 text-xs"
                />
              </div>

              {/* KHUNG CĂN CHỈNH BANNER (Giữ nguyên toàn bộ ảnh gốc, đặt khung 4:1 lên trên y hệt Logo) */}
              <BannerAdjuster
                imageUrl={editingBanner.image_url}
                onImageChange={(url) => setEditingBanner({ ...editingBanner, image_url: url })}
                uploadingImage={uploadingImage}
                handleFileUpload={handleFileUpload}
                uploadType="edit_banner"
              />

              <div>
                <label className="block font-bold text-slate-700 mb-1">Đường dẫn liên kết khi bấm vào banner</label>
                <input
                  type="text"
                  placeholder="Ví dụ: / hoặc /san-pham/1"
                  value={editingBanner.link_url || ''}
                  onChange={(e) => setEditingBanner({ ...editingBanner, link_url: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-brand-500 font-mono text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Thứ tự hiển thị</label>
                  <input
                    type="number"
                    value={editingBanner.display_order}
                    onChange={(e) => setEditingBanner({ ...editingBanner, display_order: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-brand-500 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Trạng thái hiển thị</label>
                  <select
                    value={editingBanner.status}
                    onChange={(e) => setEditingBanner({ ...editingBanner, status: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium bg-white focus:outline-none focus:border-brand-500 text-xs"
                  >
                    <option value={1}>Đang hiển thị</option>
                    <option value={0}>Đang tạm ẩn</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingBanner(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-600 transition cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={uploadingImage}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-bold transition shadow-md shadow-blue-600/20 cursor-pointer flex items-center gap-1.5"
                >
                  <span>Lưu Thay Đổi</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. MODAL XÁC NHẬN XÓA BANNER (FR-042) */}
      {deletingBanner && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading font-black text-base text-slate-900">Xóa Banner Quảng Cáo</h3>
                <p className="text-xs text-slate-500">Mã #{deletingBanner.id}</p>
              </div>
            </div>

            <div className="aspect-[4/1] rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-sm">
              <img src={deletingBanner.image_url} alt={deletingBanner.title} className="w-full h-full object-cover" />
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Bạn có chắc chắn muốn xóa vĩnh viễn banner <strong className="text-slate-900 font-bold">{deletingBanner.title}</strong>? Banner này sẽ bị gỡ bỏ khỏi toàn bộ trang chủ và không thể khôi phục lại.
            </p>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeletingBanner(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-600 transition cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteBanner}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold transition shadow-md shadow-rose-600/20 cursor-pointer"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
