import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext.jsx';
import { playSuccessChime, playClickTone } from '../utils/audioFeedback.js';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('cloudmart360_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const { showSuccess, showInfo, showError } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem('cloudmart360_cart', JSON.stringify(items));
    } catch (e) {}
  }, [items]);

  const addToCart = (product, quantity = 1) => {
    if (!product || product.stock === 0) {
      showError(`'${product?.name || 'Item'}' is currently out of stock`, 'Out of Stock');
      return;
    }

    playSuccessChime();
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        const newQty = Math.min(product.stock, existing.quantity + quantity);
        showSuccess(`Updated '${product.name}' quantity to ${newQty}`, 'Added to Cart');
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: newQty } : item
        );
      } else {
        showSuccess(`Added '${product.name}' to shopping cart`, 'Added to Cart');
        return [...prev, { product, quantity: Math.min(product.stock, quantity) }];
      }
    });
  };

  const removeFromCart = (productId) => {
    playClickTone();
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
    showInfo('Item removed from cart', 'Cart Updated');
  };

  const updateQuantity = (productId, quantity) => {
    playClickTone();
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          const maxQty = item.product.stock || 99;
          return { ...item, quantity: Math.min(maxQty, quantity) };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  // Computations
  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + (Number(item.product.price || 0) * item.quantity), 0);
  const shippingFee = subtotal > 150 || subtotal === 0 ? 0 : 9.99;
  const estimatedTax = subtotal * 0.0825; // 8.25% standard tax
  const grandTotal = subtotal + shippingFee + estimatedTax;

  return (
    <CartContext.Provider
      value={{
        items,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItemsCount,
        subtotal,
        shippingFee,
        estimatedTax,
        grandTotal
      }}
    >
      {children}
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
