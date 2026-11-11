'use client';

import React from 'react';
import { QrCode, CheckCircle2, Clock, Maximize2, Check, Copy, RefreshCw } from 'lucide-react';

export default function OrderVietQrBox({
  order,
  copiedField,
  onCopyText,
  onOpenFullQr,
  onRefresh,
}) {
  const isPaid = order.payment_status === 'PAID';
  const totalAmount = parseFloat(order.total_amount) || 0;

  return (
    <div
      className={`bg-white p-6 rounded-3xl border shadow-sm space-y-4 ${
        isPaid ? 'border-gray-100' : 'border-amber-300 ring-4 ring-amber-50'
      }`}
    >
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <h3 className="font-extrabold text-sm text-gray-900 flex items-center gap-2">
          <QrCode className="w-4 h-4 text-brand-600" />
          Thanh Toán Quét Mã VietQR (MB Bank)
        </h3>
        {isPaid ? (
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-black flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> ĐÃ XÁC NHẬN THANH TOÁN
          </span>
        ) : (
          <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-bold flex items-center gap-1.5 animate-pulse">
            <Clock className="w-3.5 h-3.5 text-amber-600" /> Chờ chuyển khoản
          </span>
        )}
      </div>

      {isPaid ? (
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center gap-3 text-xs text-emerald-900">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <p className="font-bold">Cửa hàng đã nhận được thanh toán chuyển khoản cho đơn hàng này!</p>
            <p className="text-[11px] text-emerald-700 mt-0.5">
              Trái cây đang được ưu tiên đóng gói tươi ngon chuẩn bị bàn giao GreenSM.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 pt-1">
          {/* QR image container */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-4 sm:p-5 rounded-3xl border border-emerald-200 text-center shrink-0 w-full sm:w-[420px] md:w-[440px] flex flex-col items-center">
            <div className="relative group w-full aspect-square max-w-[400px] bg-white p-3 rounded-2xl shadow-md border-2 border-emerald-300 flex items-center justify-center">
              <img
                src={`https://img.vietqr.io/image/MB-0929894248-compact2.png?amount=${totalAmount}&addInfo=DODONG4MUA%20${order.order_code}&accountName=TRAN%20VU`}
                alt="VietQR MB Bank"
                className="w-full h-full object-contain select-none"
              />
              <button
                type="button"
                onClick={onOpenFullQr}
                className="absolute bottom-3 right-3 px-3 py-1.5 bg-black/75 hover:bg-black/90 text-white rounded-xl backdrop-blur-xs transition shadow-md cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                title="Phóng to mã QR toàn màn hình"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Phóng to</span>
              </button>
            </div>

            <p className="text-sm text-emerald-950 font-black mt-3.5 flex items-center gap-1.5">
              <QrCode className="w-4 h-4 text-emerald-600" />
              Mở App ngân hàng bất kỳ để quét mã
            </p>
            <p className="text-xs text-emerald-700 mt-1">
              Đã tự động điền số tiền:{' '}
              <strong className="text-emerald-900 font-extrabold">
                {totalAmount.toLocaleString('vi-VN')} đ
              </strong>
            </p>
          </div>

          {/* Transfer details */}
          <div className="space-y-3 flex-1 text-xs w-full">
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                <div>
                  <span className="text-gray-400 text-[10px] block">Ngân hàng thụ hưởng:</span>
                  <strong className="text-gray-900 font-bold">MB Bank (Ngân hàng Quân Đội)</strong>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                <div>
                  <span className="text-gray-400 text-[10px] block">Số tài khoản:</span>
                  <strong className="text-brand-700 font-mono text-sm font-black">0929894248</strong>
                </div>
                <button
                  type="button"
                  onClick={() => onCopyText('0929894248', 'Số tài khoản')}
                  className="px-2.5 py-1 bg-white hover:bg-gray-100 text-gray-700 rounded-lg border border-gray-200 font-bold text-[11px] flex items-center gap-1 transition cursor-pointer shadow-2xs"
                >
                  {copiedField === 'Số tài khoản' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedField === 'Số tài khoản' ? 'Đã chép' : 'Sao chép'}</span>
                </button>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                <div>
                  <span className="text-gray-400 text-[10px] block">Chủ tài khoản:</span>
                  <strong className="text-gray-900 font-bold">TRAN VU</strong>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
                <div>
                  <span className="text-emerald-700 text-[10px] block font-medium">Số tiền cần thanh toán:</span>
                  <strong className="text-emerald-800 text-base font-black">
                    {totalAmount.toLocaleString('vi-VN')} đ
                  </strong>
                </div>
                <button
                  type="button"
                  onClick={() => onCopyText(totalAmount.toString(), 'Số tiền')}
                  className="px-2.5 py-1 bg-white hover:bg-emerald-100 text-emerald-800 rounded-lg border border-emerald-300 font-bold text-[11px] flex items-center gap-1 transition cursor-pointer shadow-2xs"
                >
                  {copiedField === 'Số tiền' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedField === 'Số tiền' ? 'Đã chép' : 'Sao chép'}</span>
                </button>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50 border border-amber-200">
                <div>
                  <span className="text-amber-800 text-[10px] block font-bold">Nội dung chuyển khoản (bắt buộc):</span>
                  <strong className="text-amber-950 font-mono text-xs font-black">
                    DODONG4MUA {order.order_code}
                  </strong>
                </div>
                <button
                  type="button"
                  onClick={() => onCopyText(`DODONG4MUA ${order.order_code}`, 'Nội dung chuyển khoản')}
                  className="px-2.5 py-1 bg-white hover:bg-amber-100 text-amber-900 rounded-lg border border-amber-300 font-bold text-[11px] flex items-center gap-1 transition cursor-pointer shadow-2xs"
                >
                  {copiedField === 'Nội dung chuyển khoản' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedField === 'Nội dung chuyển khoản' ? 'Đã chép' : 'Sao chép'}</span>
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-gray-100">
              <p className="text-[11px] text-gray-500">
                💡 Sau khi chuyển khoản, Admin sẽ đối soát biến động số dư và duyệt đơn.
              </p>
              <button
                type="button"
                onClick={onRefresh}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-[11px] flex items-center gap-1.5 transition cursor-pointer self-start sm:self-auto"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Làm mới trạng thái</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

