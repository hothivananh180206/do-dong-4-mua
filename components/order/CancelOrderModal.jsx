'use client';

import React from 'react';

export default function CancelOrderModal({
  show,
  onClose,
  cancelReason,
  setCancelReason,
  cancelling,
  onConfirmCancel,
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
        <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto text-xl font-bold">
          ⚠️
        </div>
        <div className="text-center">
          <h3 className="font-extrabold text-gray-900 text-base">Hủy Đơn Hàng Này?</h3>
          <p className="text-xs text-gray-500 mt-1">
            Đơn hàng đang ở trạng thái Chờ xác nhận nên bạn có thể hủy. Số lượng trái cây sẽ được tự động trả lại kho.
          </p>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Lý do hủy:</label>
          <select
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            className="w-full text-xs p-2.5 rounded-xl border border-gray-200"
          >
            <option value="Đổi ý không mua nữa">Đổi ý không mua nữa</option>
            <option value="Muốn chọn loại trái cây khác">Muốn chọn loại trái cây khác</option>
            <option value="Đổi địa chỉ giao">Đổi địa chỉ giao</option>
            <option value="Khác">Khác</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl text-xs hover:bg-gray-200 cursor-pointer"
          >
            Quay lại
          </button>
          <button
            type="button"
            disabled={cancelling}
            onClick={onConfirmCancel}
            className="py-2.5 bg-red-600 text-white font-bold rounded-xl text-xs hover:bg-red-700 shadow-md shadow-red-600/30 cursor-pointer"
          >
            {cancelling ? 'Đang hủy...' : 'Đồng Ý Hủy'}
          </button>
        </div>
      </div>
    </div>
  );
}

