import React from 'react';
import {
  ShoppingBag,
  X,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Truck,
  ShieldCheck,
  Package
} from 'lucide-react';
import { Drawer } from '../ui/Drawer.jsx';
import { Button } from '../ui/Button.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { formatCurrency } from '../../utils/formatters.js';

export function CartDrawer({ onOpenCheckout }) {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    shippingFee,
    estimatedTax,
    grandTotal,
    totalItemsCount
  } = useCart();

  const freeShippingThreshold = 150;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const footer = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%' }}>
      {/* Pricing Summary */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8125rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
          <span>Subtotal ({totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'}):</span>
          <span className="font-mono" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{formatCurrency(subtotal)}</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
          <span>Estimated Shipping:</span>
          <span className="font-mono" style={{ color: shippingFee === 0 ? 'var(--color-success)' : 'var(--text-primary)', fontWeight: 600 }}>
            {shippingFee === 0 ? 'FREE' : formatCurrency(shippingFee)}
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
          <span>Estimated Tax (8.25%):</span>
          <span className="font-mono" style={{ color: 'var(--text-primary)' }}>{formatCurrency(estimatedTax)}</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: 800, borderTop: '1px solid var(--border-medium)', paddingTop: '10px', marginTop: '2px' }}>
          <span style={{ color: 'var(--text-primary)' }}>Total:</span>
          <span className="font-mono" style={{ color: 'var(--brand-primary)' }}>{formatCurrency(grandTotal)}</span>
        </div>
      </div>

      {/* Checkout Button */}
      <Button
        variant="primary"
        size="lg"
        onClick={() => {
          setIsCartOpen(false);
          onOpenCheckout();
        }}
        disabled={items.length === 0}
        icon={ArrowRight}
        style={{ width: '100%', justifyContent: 'center' }}
      >
        Proceed to Checkout ({formatCurrency(grandTotal)})
      </Button>
    </div>
  );

  return (
    <Drawer
      isOpen={isCartOpen}
      onClose={() => setIsCartOpen(false)}
      title={`Shopping Cart (${totalItemsCount})`}
      subtitle="Review your selected items before proceeding to secure checkout."
      footer={items.length > 0 ? footer : null}
      width="480px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Free Shipping Progress Bar */}
        <div
          className="glass-panel"
          style={{
            padding: '14px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255, 255, 255, 0.02)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '6px' }}>
            <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Truck size={14} color="var(--brand-primary)" />
              {amountToFreeShipping === 0
                ? '🎉 You unlocked Free Express Delivery!'
                : `Add ${formatCurrency(amountToFreeShipping)} more for FREE delivery`}
            </span>
            <span className="font-mono" style={{ fontWeight: 700, color: 'var(--brand-primary)' }}>
              {freeShippingProgress}%
            </span>
          </div>

          <div style={{ width: '100%', height: '6px', borderRadius: 'var(--radius-full)', background: 'rgba(255, 255, 255, 0.08)', overflow: 'hidden' }}>
            <div
              style={{
                width: `${freeShippingProgress}%`,
                height: '100%',
                backgroundColor: freeShippingProgress === 100 ? 'var(--color-success)' : 'var(--brand-primary)',
                transition: 'width var(--transition-normal)'
              }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        {items.length === 0 ? (
          <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <ShoppingBag size={48} color="var(--text-faint)" style={{ margin: '0 auto 12px auto' }} />
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Your cart is empty
            </div>
            <p style={{ fontSize: '0.8125rem', marginTop: '6px', color: 'var(--text-secondary)' }}>
              Explore our curated catalog to discover premium essentials and add them to your cart.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {items.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="glass-panel"
                style={{
                  padding: '12px',
                  borderRadius: 'var(--radius-lg)',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'center'
                }}
              >
                {/* Thumbnail */}
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid var(--border-subtle)',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <Package size={24} color="var(--text-muted)" />
                  )}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {product.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {product.category}
                  </div>
                  <div className="font-mono" style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--brand-primary)', marginTop: '4px' }}>
                    {formatCurrency(product.price)}
                  </div>
                </div>

                {/* Quantity Controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: 'var(--radius-sm)', padding: '2px 6px', border: '1px solid var(--border-subtle)' }}>
                  <button
                    onClick={() => updateQuantity(product.id, quantity - 1)}
                    style={{ color: 'var(--text-secondary)', padding: '4px', display: 'flex' }}
                  >
                    <Minus size={13} />
                  </button>
                  <span className="font-mono" style={{ fontSize: '0.8125rem', fontWeight: 700, minWidth: '18px', textAlign: 'center' }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                    disabled={quantity >= product.stock}
                    style={{ color: quantity >= product.stock ? 'var(--text-faint)' : 'var(--text-secondary)', padding: '4px', display: 'flex' }}
                  >
                    <Plus size={13} />
                  </button>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => removeFromCart(product.id)}
                  style={{ color: 'var(--text-muted)', padding: '6px', borderRadius: 'var(--radius-xs)', display: 'flex' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-danger)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Drawer>
  );
}
