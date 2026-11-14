'use client';

import React from 'react';

export default function ProductGallery({
  name,
  thumbnail,
  images,
  selectedImage,
  setSelectedImage,
  discountPercent,
}) {
  return (
    <div className="lg:col-span-6 space-y-5">
      <div className="relative aspect-square rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-lg">
        <img
          src={selectedImage || thumbnail}
          alt={name}
          className="w-full h-full object-cover"
        />
        {discountPercent > 0 && (
          <div className="absolute top-5 left-5 bg-accent-500 text-white font-black px-4 py-1.5 rounded-2xl shadow-xl">
            TIẾT KIỆM {discountPercent}%
          </div>
        )}
      </div>

      {/* Thumbnails list */}
      {images && images.length > 1 && (
        <div className="flex items-center gap-3.5 overflow-x-auto pb-2">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelectedImage(img)}
              className={`w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                selectedImage === img
                  ? 'border-brand-600 scale-105 shadow-md'
                  : 'border-gray-200 opacity-70 hover:opacity-100'
              }`}
            >
              <img src={img} alt={`${name} ${i}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

