'use client';

import React, { useState } from 'react';
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-react';

/**
 * Phân trang chuẩn phong cách KhoHang_JAVA:
 * - Nút « Trang đầu, ‹ Trang trước
 * - Dãy số trang trượt thông minh (3 trang)
 * - Ô nhập số trang trực tiếp ("Nhập...") + Enter để nhảy trang tức thì
 * - Nút hiển thị trang cuối
 * - Nút › Trang sau, » Trang cuối
 * - Bộ chọn số dòng hiển thị (10, 20, 50 dòng/trang)
 * - Dòng thông tin thống kê số lượng
 */
export default function Pagination({
  currentPage = 1,
  totalItems = 0,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50],
  itemName = 'mặt hàng',
}) {
  const [jumpPageInput, setJumpPageInput] = useState('');

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  // Thuật toán trượt số trang theo chuẩn KhoHang_JAVA
  let startPage = 1;
  let endPage = totalPages;

  if (totalPages <= 3) {
    startPage = 1;
    endPage = totalPages;
  } else {
    if (safeCurrentPage < 2) {
      startPage = 1;
      endPage = 3;
    } else if (safeCurrentPage >= totalPages - 1) {
      startPage = totalPages - 2;
      endPage = totalPages;
    } else {
      startPage = safeCurrentPage - 1;
      endPage = safeCurrentPage + 1;
    }
  }

  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const handleJumpSubmit = (e) => {
    e.preventDefault();
    const val = parseInt(jumpPageInput, 10);
    if (!isNaN(val) && val >= 1 && val <= totalPages) {
      onPageChange(val);
      setJumpPageInput('');
    }
  };

  const fromIndex = totalItems === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1;
  const toIndex = Math.min(safeCurrentPage * pageSize, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 text-xs">
      {/* Thông tin số lượng */}
      <div className="flex items-center gap-3 text-slate-500 flex-wrap">
        <span>
          Hiển thị <strong className="text-slate-800 font-bold">{fromIndex} - {toIndex}</strong> trên tổng số{' '}
          <strong className="text-slate-800 font-bold">{totalItems}</strong> {itemName}
          {' '}(Trang <strong className="text-emerald-600 font-bold">{safeCurrentPage}</strong> / {totalPages})
        </span>

        {onPageSizeChange && (
          <div className="flex items-center gap-1.5 ml-2">
            <span className="text-[11px] text-slate-400">Xem:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                onPageSizeChange(parseInt(e.target.value, 10));
                onPageChange(1);
              }}
              className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt} / trang
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Cụm điều khiển phân trang */}
      {totalPages > 1 && (
        <nav className="flex items-center gap-1.5 flex-wrap">
          {/* Nút Trang đầu « */}
          <button
            type="button"
            disabled={safeCurrentPage === 1}
            onClick={() => onPageChange(1)}
            title="Trang đầu tiên"
            className="w-8 h-8 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-emerald-600 hover:border-emerald-300 transition disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>

          {/* Nút Trang trước ‹ */}
          <button
            type="button"
            disabled={safeCurrentPage === 1}
            onClick={() => onPageChange(Math.max(1, safeCurrentPage - 1))}
            title="Trang trước"
            className="w-8 h-8 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-emerald-600 hover:border-emerald-300 transition disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Dãy số trang thông minh */}
          {pageNumbers.map((num) => {
            const isActive = num === safeCurrentPage;
            return (
              <button
                key={num}
                type="button"
                onClick={() => onPageChange(num)}
                className={`min-w-8 h-8 px-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 border border-emerald-600'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-emerald-600 hover:border-emerald-300'
                }`}
              >
                {num}
              </button>
            );
          })}

          {/* Ô nhập nhảy trang trực tiếp chuẩn KhoHang_JAVA */}
          <form onSubmit={handleJumpSubmit} noValidate className="inline-flex items-center">
            <input
              type="number"
              min="1"
              max={totalPages}
              placeholder="Nhập..."
              value={jumpPageInput}
              onChange={(e) => setJumpPageInput(e.target.value)}
              className="w-16 h-8 text-center text-xs font-bold rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-slate-300 placeholder:italic placeholder:font-normal"
              title="Nhập số trang rồi bấm Enter để nhảy trang nhanh"
            />
          </form>

          {/* Nút hiển thị trang cuối (nếu endPage chưa tới trang cuối) */}
          {endPage < totalPages && (
            <button
              type="button"
              onClick={() => onPageChange(totalPages)}
              title={`Nhảy tới trang cuối (${totalPages})`}
              className="min-w-8 h-8 px-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-emerald-600 hover:border-emerald-300 transition cursor-pointer"
            >
              {totalPages}
            </button>
          )}

          {/* Nút Trang sau › */}
          <button
            type="button"
            disabled={safeCurrentPage >= totalPages}
            onClick={() => onPageChange(Math.min(totalPages, safeCurrentPage + 1))}
            title="Trang sau"
            className="w-8 h-8 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-emerald-600 hover:border-emerald-300 transition disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Nút Trang cuối » */}
          <button
            type="button"
            disabled={safeCurrentPage >= totalPages}
            onClick={() => onPageChange(totalPages)}
            title="Trang cuối cùng"
            className="w-8 h-8 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-emerald-600 hover:border-emerald-300 transition disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </nav>
      )}
    </div>
  );
}

