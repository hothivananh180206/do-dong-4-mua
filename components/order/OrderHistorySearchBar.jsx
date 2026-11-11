'use client';

import React from 'react';
import { Search } from 'lucide-react';

export default function OrderHistorySearchBar({ phone, setPhone, loading, onSearch }) {
  return (
    <form onSubmit={onSearch} className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-3">
      <div className="flex-1 relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
        <input
          type="tel"
          required
          placeholder="Nhập số điện thoại đã dùng để đặt hàng..."
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-600"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer disabled:bg-gray-400"
      >
        {loading ? (
          <span>Đang tìm...</span>
        ) : (
          <>
            <Search className="w-3.5 h-3.5" />
            <span>Tra Cứu Đơn</span>
          </>
        )}
      </button>
    </form>
  );
}

