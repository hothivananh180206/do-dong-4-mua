'use client';

import React from 'react';
import Link from 'next/link';

export default function AuthBrandHeader({ title, subtitle }) {
  return (
    <div className="text-center space-y-2">
      <Link href="/" className="inline-flex items-center gap-2">
        <div className="w-10 h-10 bg-brand-600 rounded-2xl flex items-center justify-center text-white text-xl shadow-md">
          🍉
        </div>
        <span className="text-xl font-black text-brand-700">
          ĐỔ ĐỐNG <span className="text-accent-500">4 MÙA</span>
        </span>
      </Link>
      {title && (
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 font-heading pt-1">
          {title}
        </h2>
      )}
      {subtitle && (
        <p className="text-xs text-gray-500 font-medium">
          {subtitle}
        </p>
      )}
    </div>
  );
}

