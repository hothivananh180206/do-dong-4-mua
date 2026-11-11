'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('dodong4mua_cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch (e) {
      console.error('Failed to load cart from localStorage', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save cart to localStorage on changes - TUYỆT ĐỐI CHỈ LƯU SAU KHI ĐÃ LOAD XONG
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('dodong4mua_cart', JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [items, isLoaded]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const addToCart = (product, quantity = 1) => {
    const numQty = Math.max(1, parseInt(quantity, 10) || 1);
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      const effectivePrice = product.discount_price !== null && product.discount_price !== undefined
        ? parseFloat(product.discount_price)
        : parseFloat(product.price);
      const maxStock = product.stock !== undefined && product.stock !== null ? parseInt(product.stock, 10) : 999;

      if (existing) {
        const targetQty = (Number(existing.quantity) || 0) + numQty;
        const validQty = Math.min(maxStock, targetQty);
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: validQty, stock: maxStock }
            : item
        );
      } else {
        const validQty = Math.min(maxStock, numQty);
        return [
          ...prev,
          {
            id: product.id,
            name: product.name,
            slug: product.slug,
            thumbnail: product.thumbnail,
            unit: product.unit || 'kg',
            price: effectivePrice,
            original_price: parseFloat(product.price),
            quantity: validQty,
            stock: maxStock,
          },
        ];
      }
    });

    showToast(`Đã thêm ${product.name} vào giỏ hàng!`);
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity === '') {
      setItems((prev) =>
        prev.map((item) =>
          item.id === productId ? { ...item, quantity: '' } : item
        )
      );
      return;
    }
    const num = parseInt(quantity, 10);
    if (isNaN(num) || num <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === productId) {
          const maxStock = item.stock !== undefined && item.stock !== null ? item.stock : 999;
          const validQty = Math.min(maxStock, num);
          return { ...item, quantity: validQty };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId) => {
    setItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * (Number(item.quantity) || 0), 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isLoaded,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        subtotal,
        isCartOpen,
        setIsCartOpen,
        toastMessage,
        showToast,
      }}
    >
      {children}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-brand-700 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-brand-500 animate-bounce">
          <span className="text-xl">🧺</span>
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

