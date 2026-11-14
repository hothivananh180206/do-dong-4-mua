'use client';

import React from 'react';

export default function OrderDeliveryAndPaymentInfo({ order }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'CHO_THANH_TOAN':
        return { label: 'Chờ thanh toán (VietQR)', className: 'bg-amber-100 text-amber-900 border border-amber-300' };
      case 'CHO_XAC_NHAN':
        return { label: 'Chờ xác nhận (COD)', className: 'bg-yellow-100 text-yellow-900 border border-yellow-300' };
      case 'DA_XAC_NHAN':
        return { label: 'Đã duyệt', className: 'bg-purple-100 text-purple-900' };
      case 'DANG_CHUAN_BI':
        return { label: 'Đang đóng gói', className: 'bg-blue-100 text-blue-900' };
      case 'TAM_DUNG':
        return { label: 'Tạm dừng xử lý', className: 'bg-amber-100 text-amber-900' };
      case 'DANG_GIAO':
        return { label: 'Đang giao GreenSM', className: 'bg-teal-100 text-teal-900' };
      case 'DA_GIAO':
        return { label: 'Giao thành công', className: 'bg-emerald-100 text-emerald-900' };
      case 'DA_HUY':
        return { label: 'Đã hủy đơn', className: 'bg-red-100 text-red-900' };
      default:
        return { label: status, className: 'bg-gray-100 text-gray-800' };
    }
  };

  const statusInfo = getStatusBadge(order.order_status);

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4 text-xs">
      <h3 className="font-bold text-sm text-gray-900 border-b border-gray-100 pb-2">
        Thông Tin Nhận Hàng & Thanh Toán
      </h3>
      <div className="space-y-2.5 text-gray-600">
        <p className="flex items-center gap-2">
          <strong className="text-gray-900 w-24 shrink-0">Người nhận:</strong>
          <span>{order.receiver_name}</span>
        </p>
        <p className="flex items-center gap-2">
          <strong className="text-gray-900 w-24 shrink-0">Số điện thoại:</strong>
          <span>{order.phone}</span>
        </p>
        <p className="flex items-start gap-2">
          <strong className="text-gray-900 w-24 shrink-0">Địa chỉ:</strong>
          <span>{order.address}</span>
        </p>
        <p className="flex items-center gap-2">
          <strong className="text-gray-900 w-24 shrink-0">Thanh toán:</strong>
          <span className="font-bold text-gray-800 uppercase">
            {order.payment_method || 'COD'} ({order.payment_status === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'})
          </span>
        </p>
        <p className="flex items-center gap-2">
          <strong className="text-gray-900 w-24 shrink-0">Trạng thái:</strong>
          <span className={`px-2 py-0.5 rounded-lg text-xs font-bold ${statusInfo.className}`}>
            {statusInfo.label}
          </span>
        </p>
        {order.note && (
          <p className="flex items-start gap-2 bg-yellow-50 p-2.5 rounded-xl border border-yellow-200/60 text-yellow-900">
            <strong className="w-20 shrink-0">Ghi chú:</strong>
            <span>{order.note}</span>
          </p>
        )}
      </div>
    </div>
  );
}

