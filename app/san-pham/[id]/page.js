'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, PackageOpen } from 'lucide-react';
import { useCart } from '@/components/CartContext';

import ProductGallery from '@/components/product/ProductGallery';
import ProductPurchaseBox from '@/components/product/ProductPurchaseBox';
import RelatedProductsSection from '@/components/product/RelatedProductsSection';

export default function ProductDetailPage({ params }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { addToCart, setIsCartOpen } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    async function loadDetail() {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${resolvedParams.id}`);
        const data = await res.json();
        if (data.success) {
          setProduct(data.data);
          setSelectedImage(data.data.thumbnail);
        }
      } catch (e) {
        console.error('Failed to load product detail', e);
      } finally {
        setLoading(false);
      }
    }
    loadDetail();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 animate-pulse space-y-8">
        <div className="h-8 bg-gray-200 rounded-2xl w-1/4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="aspect-square bg-gray-200 rounded-3xl" />
          <div className="space-y-5">
            <div className="h-10 bg-gray-200 rounded-2xl w-3/4" />
            <div className="h-8 bg-gray-200 rounded-2xl w-1/3" />
            <div className="h-32 bg-gray-200 rounded-2xl w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-5">
        <div className="w-20 h-20 rounded-full bg-emerald-50 text-brand-600 flex items-center justify-center mx-auto">
          <PackageOpen className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 font-heading">Không tìm thấy sản phẩm này</h2>
        <p className="text-gray-500 font-medium">Sản phẩm có thể đã hết mùa vụ hoặc tạm ngưng kinh doanh.</p>
        <Link href="/" className="btn-primary cursor-pointer inline-flex">
          <ArrowLeft className="w-5 h-5" />
          <span>Quay lại trang chủ</span>
        </Link>
      </div>
    );
  }

  const price = parseFloat(product.price);
  const discountPrice = product.discount_price ? parseFloat(product.discount_price) : null;
  const effectivePrice = discountPrice !== null ? discountPrice : price;
  const discountPercent = discountPrice ? Math.round(((price - discountPrice) / price) * 100) : 0;

  const handleBuyNow = () => {
    addToCart(product, Number(quantity) || 1);
    router.push('/dat-hang');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-14">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2.5 text-gray-500 font-bold">
        <Link href="/" className="hover:text-brand-600 transition cursor-pointer">Trang chủ</Link>
        <span>/</span>
        <Link href={`/?category=${product.category_slug}`} className="hover:text-brand-600 transition cursor-pointer">
          {product.category_name}
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-black truncate max-w-sm">{product.name}</span>
      </div>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Gallery */}
        <ProductGallery
          name={product.name}
          thumbnail={product.thumbnail}
          images={product.images}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          discountPercent={discountPercent}
        />

        {/* Purchase Box */}
        <ProductPurchaseBox
          product={product}
          effectivePrice={effectivePrice}
          price={price}
          discountPrice={discountPrice}
          quantity={quantity}
          setQuantity={setQuantity}
          onAddToCart={() => {
            addToCart(product, quantity);
            setIsCartOpen(true);
          }}
          onBuyNow={handleBuyNow}
        />
      </div>

      {/* Related Products */}
      <RelatedProductsSection related={product.related} />
    </div>
  );
}
