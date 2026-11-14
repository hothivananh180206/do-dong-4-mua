'use client';

import React from 'react';
import { Truck, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function OrderTrackingStepper({
  order,
  isCancelled,
  steps,
  currentLevel,
}) {
  if (isCancelled) {
    return (
      <div className="bg-red-50 p-6 rounded-3xl border border-red-200 flex items-center gap-4 text-xs text-red-800">
        <AlertTriangle className="w-6 h-6 text-red-600 shrink-0" />
        <div>
          <strong className="block text-sm font-bold">Đơn hàng này đã bị hủy</strong>
          Toàn bộ số lượng trái cây trong đơn đã được hệ thống tự động hoàn lại kho hàng.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-extrabold text-base text-gray-900 flex items-center gap-2">
          <Truck className="w-5 h-5 text-brand-600" /> Tiến Độ Vận Đơn GreenSM
        </h2>
        {order.tracking_code && ['DANG_GIAO', 'DA_GIAO'].includes(order.order_status) ? (
          <span className="text-xs bg-emerald-50 text-emerald-800 font-mono font-bold px-3 py-1 rounded-full border border-emerald-200">
            Mã vận đơn: {order.tracking_code}
          </span>
        ) : (
          <span className="text-xs text-slate-400 font-medium italic">
            Chưa tạo mã vận đơn (chờ đóng gói & giao GreenSM)
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 relative">
        {steps.map((st, idx) => {
          const stepLevel = idx + 1;
          const isCompleted = currentLevel >= stepLevel;
          const isCurrent = currentLevel === stepLevel;

          return (
            <div key={st.key} className="text-center space-y-2">
              <div
                className={`w-9 h-9 mx-auto rounded-full flex items-center justify-center font-bold text-xs transition ${
                  isCompleted
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                    : 'bg-gray-100 text-gray-400'
                } ${isCurrent ? 'ring-4 ring-brand-200 animate-pulse' : ''}`}
              >
                {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : stepLevel}
              </div>
              <div>
                <div className={`text-xs font-bold ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                  {st.label}
                </div>
                <div className="text-[10px] text-gray-400 mt-0.5">{st.desc}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

