'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { formatDateTime } from '@/lib/date';

export default function OrderHistoryCard({ order, onOpenCancelModal }) {
  const getStatusBadge = (st) => {
    switch (st) {
      case 'CHO_THANH_TOAN':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">Chờ thanh toán (QR)</span>;
      case 'CHO_XAC_NHAN':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-yellow-100 text-yellow-800">Chờ xác nhận (COD)</span>;
      case 'DA_XAC_NHAN':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">Đã tiếp nhận</span>;
      case 'DANG_CHUAN_BI':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">Đang đóng gói</span>;
      case 'TAM_DUNG':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-yellow-100 text-yellow-800">Tạm dừng xử lý</span>;
      case 'DANG_GIAO':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800">Đang giao GreenSM</span>;
      case 'DA_GIAO':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Giao thành công</span>;
      case 'DA_HUY':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-100 text-red-800">Đã hủy đơn</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-gray-100 text-gray-800">{st}</span>;
    }
  };

  const totalAmount = parseFloat(order.total_amount) || 0;

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
        <div className="flex items-center gap-3">
          <span className="font-mono font-black text-brand-700 text-sm">{order.order_code}</span>
          {getStatusBadge(order.order_status)}
        </div>
        <div className="text-[11px] text-gray-400">
          Ngày đặt: {formatDateTime(order.created_at)}
        </div>
      </div>

      {/* Items in order */}
      <div className="divide-y divide-gray-50">
        {order.items?.map((item) => {
          const lineTotal = parseFloat(item.subtotal || item.total_price || (item.unit_price * item.quantity) || 0);
          const itemImg = item.thumbnail || item.image;
          return (
            <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                {itemImg ? (
                  <img 
                    src={itemImg} 
                    alt={item.product_name} 
                    className="w-10 h-10 rounded-xl object-cover bg-gray-50 border border-gray-100"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-base">
                    🍇
                  </div>
                )}
                <div>
                  <div className="font-bold text-gray-800">{item.product_name}</div>
                  <div className="text-[11px] text-gray-400">
                    {parseFloat(item.unit_price || 0).toLocaleString('vi-VN')} đ x {item.quantity}
                  </div>
                </div>
              </div>
              <span className="font-bold text-gray-900">
                {lineTotal.toLocaleString('vi-VN')} đ
              </span>
            </div>
          );
        })}
      </div>

      {/* Order Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-gray-100 text-xs">
        <div>
          <span className="text-gray-500">Tổng thanh toán: </span>
          <strong className="text-base font-black text-brand-700">
            {totalAmount.toLocaleString('vi-VN')} đ
          </strong>
          <span className="text-[11px] text-gray-400 ml-2">
            ({order.payment_method} - {order.payment_status === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'})
          </span>
        </div>

        <div className="flex items-center gap-2">
          {['CHO_THANH_TOAN', 'CHO_XAC_NHAN'].includes(order.order_status) && (
            <button
              type="button"
              onClick={() => onOpenCancelModal(order)}
              className="px-3.5 py-1.5 bg-red-50 text-red-600 rounded-xl font-bold text-xs hover:bg-red-100 transition cursor-pointer"
            >
              Hủy đơn
            </button>
          )}
          <Link
            href={`/don-hang/${order.order_code}`}
            className="px-4 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-700 rounded-xl font-bold text-xs transition flex items-center gap-1 cursor-pointer"
          >
            <span>Xem chi tiết đơn</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

