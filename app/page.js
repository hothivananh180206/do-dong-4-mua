'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import HomeHeroBanner from '@/components/home/HomeHeroBanner';
import ProductFilterSection from '@/components/home/ProductFilterSection';
import ShopeeProductGrid from '@/components/home/ShopeeProductGrid';
import HomeSkeleton from '@/components/home/HomeSkeleton';

function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentSearch = searchParams.get('search') || '';
  const currentCategory = searchParams.get('category') || '';
  const currentSeason = searchParams.get('season') || '';
  const inStockFilter = searchParams.get('in_stock') === '1';
  const discountedFilter = searchParams.get('discounted') === '1';
  const minPriceParam = searchParams.get('min_price') || '';
  const maxPriceParam = searchParams.get('max_price') || '';

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [banners, setBanners] = useState([]);
  const [bannersLoaded, setBannersLoaded] = useState(false);
  const [activeBannerIdx, setActiveBannerIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('newest');
  const [visibleCount, setVisibleCount] = useState(12);

  // Load Categories & Banners Metadata on mount (với localStorage Cache 0ms)
  useEffect(() => {
    try {
      const cachedBanners = localStorage.getItem('dodong4mua_home_banners');
      if (cachedBanners) {
        const parsed = JSON.parse(cachedBanners);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setBanners(parsed);
          setBannersLoaded(true);
        }
      }
    } catch (e) {}

    let isMounted = true;
    async function loadMeta() {
      try {
        const [catRes, banRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/banners')
        ]);
        const catData = await catRes.json();
        const banData = await banRes.json();
        if (isMounted) {
          if (catData.success && Array.isArray(catData.data)) setCategories(catData.data);
          if (banData.success && Array.isArray(banData.data)) {
            setBanners(banData.data);
            setBannersLoaded(true);
            try {
              localStorage.setItem('dodong4mua_home_banners', JSON.stringify(banData.data));
            } catch (e) {}
          }
        }
      } catch (err) {
        console.error('Failed to load metadata', err);
      }
    }
    loadMeta();
    return () => { isMounted = false; };
  }, []);

  // Load Products based on Filters & Sorting
  useEffect(() => {
    setVisibleCount(12);
    let isMounted = true;
    async function loadProducts() {
      setLoading(true);
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);

        const params = new URLSearchParams();
        if (currentSearch) params.set('search', currentSearch);
        if (currentCategory) params.set('category', currentCategory);
        if (currentSeason) params.set('season', currentSeason);
        if (inStockFilter) params.set('in_stock', '1');
        if (discountedFilter) params.set('discounted', '1');
        if (minPriceParam) params.set('min_price', minPriceParam);
        if (maxPriceParam) params.set('max_price', maxPriceParam);
        if (sort) params.set('sort', sort);

        const res = await fetch(`/api/products?${params.toString()}`, { signal: controller.signal });
        clearTimeout(timeoutId);
        const data = await res.json();
        if (isMounted && data.success) {
          setProducts(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch products', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadProducts();
    return () => { isMounted = false; };
  }, [currentSearch, currentCategory, currentSeason, inStockFilter, discountedFilter, minPriceParam, maxPriceParam, sort]);

  const updateFilters = (newParams) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params.set(key, String(value));
      } else {
        params.delete(key);
      }
    });
    const queryString = params.toString();
    router.replace(queryString ? `/?${queryString}` : '/', { scroll: false });
  };

  const clearAllFilters = () => {
    setSort('newest');
    router.replace('/', { scroll: false });
  };

  const scrollToProducts = () => {
    const el = document.getElementById('product-section');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="space-y-12 pb-20">
      {/* 1. Hero Section */}
      <HomeHeroBanner
        banners={banners}
        bannersLoaded={bannersLoaded}
        activeIdx={activeBannerIdx}
        onSelectIdx={setActiveBannerIdx}
        onScrollToProducts={scrollToProducts}
      />

      {/* 2. Main Content Container */}
      <div id="product-section" className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        {/* 3. Filter Toolbar */}
        <ProductFilterSection
          categories={categories}
          currentCategory={currentCategory}
          currentSeason={currentSeason}
          currentSearch={currentSearch}
          inStockFilter={inStockFilter}
          discountedFilter={discountedFilter}
          minPriceParam={minPriceParam}
          maxPriceParam={maxPriceParam}
          sort={sort}
          onSortChange={setSort}
          onUpdateFilters={updateFilters}
          onClearAllFilters={clearAllFilters}
        />

        {/* 4. Product Grid & Shopee-style Pagination */}
        <ShopeeProductGrid
          products={products}
          loading={loading}
          visibleCount={visibleCount}
          onShowMore={() => setVisibleCount((prev) => prev + 12)}
          onClearFilters={clearAllFilters}
        />
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<HomeSkeleton />}>
      <HomeContent />
    </Suspense>
  );
}
