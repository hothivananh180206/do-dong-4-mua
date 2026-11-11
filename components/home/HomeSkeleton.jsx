'use client';

import React from 'react';

export default function HomeSkeleton() {
  return (
    <div className="space-y-12 pb-20 animate-pulse">
      {/* Hero Skeleton */}
      <section className="bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 min-h-[480px] lg:min-h-[520px] flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
          <div className="lg:col-span-7 space-y-5">
            <div className="w-48 h-8 rounded-full bg-white/15" />
            <div className="w-3/4 h-12 rounded-2xl bg-white/20" />
            <div className="w-full h-16 rounded-xl bg-white/10" />
            <div className="w-56 h-12 rounded-2xl bg-white/20" />
          </div>
          <div className="lg:col-span-5">
            <div className="aspect-[4/3] rounded-3xl bg-white/10" />
          </div>
        </div>
      </section>

      {/* Product Grid Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="h-10 w-48 bg-slate-200 rounded-xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="bg-white rounded-3xl p-5 border border-slate-100 space-y-4">
              <div className="aspect-square bg-slate-100 rounded-2xl" />
              <div className="h-5 bg-slate-100 rounded-xl w-3/4" />
              <div className="h-5 bg-slate-100 rounded-xl w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

