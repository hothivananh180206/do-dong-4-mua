'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw, Move, Leaf, Globe, Check, RefreshCw } from 'lucide-react';

export default function LogoCropperModal({
  isOpen,
  imageSrc,
  onClose,
  onSave,
  siteName = 'ĐỔ ĐỐNG 4 MÙA',
  siteSlogan = '',
  title = 'Xem trước & Căn chỉnh Logo',
  initialShape = 'circle'
}) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [shape, setShape] = useState(initialShape);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isSaving, setIsSaving] = useState(false);

  const imgRef = useRef(null);
  const frameRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Synchronize live preview canvas with exact spotlight coordinates
  useEffect(() => {
    if (!isOpen || !imageSrc) return;
    const canvas = previewCanvasRef.current;
    const img = imgRef.current;
    const frame = frameRef.current;
    if (!canvas || !img || !frame) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imgRect = img.getBoundingClientRect();
    const frameRect = frame.getBoundingClientRect();
    if (frameRect.width === 0 || frameRect.height === 0) return;

    const PREVIEW_SIZE = 96;
    canvas.width = PREVIEW_SIZE;
    canvas.height = PREVIEW_SIZE;
    ctx.clearRect(0, 0, PREVIEW_SIZE, PREVIEW_SIZE);

    const scaleFactor = PREVIEW_SIZE / frameRect.width;
    const dx = (imgRect.left - frameRect.left) * scaleFactor;
    const dy = (imgRect.top - frameRect.top) * scaleFactor;
    const dw = imgRect.width * scaleFactor;
    const dh = imgRect.height * scaleFactor;

    ctx.save();
    if (shape === 'circle') {
      ctx.beginPath();
      ctx.arc(PREVIEW_SIZE / 2, PREVIEW_SIZE / 2, PREVIEW_SIZE / 2, 0, Math.PI * 2);
      ctx.clip();
    }
    try {
      ctx.drawImage(img, dx, dy, dw, dh);
    } catch {
      // safe fallback if image not ready
    }
    ctx.restore();
  }, [isOpen, imageSrc, position, scale, shape, imageLoaded]);

  // Reset values when modal opens with new image
  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
      setShape(initialShape);
      setIsSaving(false);
    }
  }, [isOpen, imageSrc, initialShape]);

  // Mouse & Touch Pan handlers
  const handleMouseDown = (e) => {
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

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      const touch = e.touches[0];
      setDragStart({ x: touch.clientX - position.x, y: touch.clientY - position.y });
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const touch = e.touches[0];
    setPosition({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y
    });
  };

  // High-Resolution 512x512 Canvas Export on Save
  const handleSave = async () => {
    if (!imageSrc || isSaving) return;
    setIsSaving(true);

    try {
      const img = imgRef.current;
      const frame = frameRef.current;
      if (!img || !frame) throw new Error('Không tìm thấy khung ảnh');

      const imgRect = img.getBoundingClientRect();
      const frameRect = frame.getBoundingClientRect();

      const canvas = document.createElement('canvas');
      const OUTPUT_SIZE = 512;
      canvas.width = OUTPUT_SIZE;
      canvas.height = OUTPUT_SIZE;
      const ctx = canvas.getContext('2d');

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      const scaleFactor = OUTPUT_SIZE / frameRect.width;
      const dx = (imgRect.left - frameRect.left) * scaleFactor;
      const dy = (imgRect.top - frameRect.top) * scaleFactor;
      const dw = imgRect.width * scaleFactor;
      const dh = imgRect.height * scaleFactor;

      ctx.save();
      if (shape === 'circle') {
        ctx.beginPath();
        ctx.arc(OUTPUT_SIZE / 2, OUTPUT_SIZE / 2, OUTPUT_SIZE / 2, 0, Math.PI * 2);
        ctx.clip();
      }
      ctx.drawImage(img, dx, dy, dw, dh);
      ctx.restore();

      const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
      if (!blob) throw new Error('Không thể tạo file ảnh');

      if (onSave) {
        await onSave(blob, shape);
      }
      onClose();
    } catch (err) {
      console.error('Lỗi crop ảnh:', err);
      alert('Lỗi căn chỉnh ảnh: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 select-none animate-in fade-in duration-200"
      onMouseUp={handleMouseUp}
      onTouchEnd={handleMouseUp}
    >
      <div className="bg-white text-slate-800 rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="relative px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="w-8" />
          <h3 className="font-heading font-black text-base sm:text-lg text-slate-900 text-center flex-1">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center transition cursor-pointer text-sm font-bold"
            title="Đóng"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-4">
          {/* Main Interactive Canvas & Crop Container */}
          <div
            className="relative w-full h-72 bg-slate-950 rounded-2xl overflow-hidden flex items-center justify-center select-none cursor-grab active:cursor-grabbing border border-slate-800"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
          >
            {imageSrc && (
              <img
                ref={imgRef}
                src={imageSrc}
                alt="Crop Source"
                crossOrigin="anonymous"
                draggable={false}
                onLoad={() => setImageLoaded((v) => !v)}
                className="max-w-none pointer-events-none select-none"
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                  transformOrigin: 'center center',
                  maxHeight: '85%',
                  maxWidth: '85%',
                  objectFit: 'contain',
                }}
              />
            )}

            {/* Dark Mask with Clear Spotlight Frame (240px x 240px) */}
            <div
              ref={frameRef}
              className={`w-60 h-60 pointer-events-none transition-all duration-150 ${
                shape === 'circle' ? 'rounded-full' : 'rounded-2xl'
              } border-2 border-emerald-400 shadow-[0_0_0_9999px_rgba(2,6,23,0.76)] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center`}
            >
              <div className="w-3 h-3 border-t border-l border-emerald-300/40 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>

            {/* Floating Guide Hint */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-slate-900/90 backdrop-blur-md text-white text-[11px] font-medium flex items-center gap-1.5 shadow-lg border border-slate-700 pointer-events-none whitespace-nowrap">
              <Move className="w-3 h-3 text-emerald-400" />
              <span>Kéo chuột để đặt lại vị trí hình ảnh</span>
            </div>
          </div>

          {/* Zoom Slider Row */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center gap-3 px-1">
              <button
                type="button"
                onClick={() => setScale((s) => Math.max(0.5, Number((s - 0.1).toFixed(2))))}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 transition cursor-pointer"
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
                className="flex-1 accent-emerald-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
              />

              <button
                type="button"
                onClick={() => setScale((s) => Math.min(3, Number((s + 0.1).toFixed(2))))}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 transition cursor-pointer"
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
                className="px-2.5 py-1 text-xs rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition cursor-pointer flex items-center gap-1 shrink-0"
                title="Đặt lại vị trí ban đầu"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Đặt lại</span>
              </button>
            </div>

            {/* Shape Switcher */}
            <div className="flex items-center justify-between px-1 text-xs text-slate-600">
              <span className="text-xs font-bold text-slate-500">Kiểu khung cắt:</span>
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl">
                <button
                  type="button"
                  onClick={() => setShape('circle')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    shape === 'circle' ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Khung tròn
                </button>
                <button
                  type="button"
                  onClick={() => setShape('square')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    shape === 'square' ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Khung vuông bo góc
                </button>
              </div>
            </div>

            {/* Live Real-Time 60FPS Simulation on Website Navbar */}
            <div className="p-3 bg-slate-50 border border-slate-200/90 rounded-2xl space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span className="font-bold text-slate-700">Mô phỏng hiển thị trên thanh Menu website:</span>
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 text-[11px]">
                  Xem trước trực tiếp
                </span>
              </div>
              <div className="bg-white rounded-xl p-2.5 flex items-center gap-3 text-slate-800 shadow-sm border border-slate-200">
                {/* Simulated Navbar Icon: Proportionally Synchronized with zero lag */}
                <div
                  className={`w-11 h-11 ${
                    shape === 'circle' ? 'rounded-full' : 'rounded-xl'
                  } bg-transparent border border-emerald-500/30 overflow-hidden relative flex items-center justify-center shrink-0 shadow-sm`}
                >
                  {imageSrc ? (
                    <canvas
                      ref={previewCanvasRef}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Leaf className="w-5 h-5 text-emerald-600" />
                  )}
                </div>
                <div className="leading-tight">
                  <div className="font-heading font-black text-xs text-emerald-800">
                    {siteName}
                  </div>
                  {siteSlogan ? (
                    <div className="text-[10px] text-slate-400">
                      {siteSlogan}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Notice text */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500 px-1">
              <Globe className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
              <span>Logo sau khi lưu sẽ được áp dụng trực tiếp lên toàn bộ hệ thống website.</span>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition cursor-pointer"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition cursor-pointer flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Đang xử lý & lưu...</span>
              </>
            ) : (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Lưu logo</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
