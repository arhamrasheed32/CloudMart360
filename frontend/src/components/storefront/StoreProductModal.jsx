import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Star,
  Package,
  Truck,
  ShieldCheck,
  RotateCcw,
  Check,
  Plus,
  Minus,
  Sparkles,
  Layers
} from 'lucide-react';
import { Modal } from '../ui/Modal.jsx';
import { Button } from '../ui/Button.jsx';
import { Badge } from '../ui/Badge.jsx';
import { StoreReviewsSection } from './StoreReviewsSection.jsx';
import { ProductZoomInspector } from './ProductZoomInspector.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { formatCurrency } from '../../utils/formatters.js';

export function StoreProductModal({
  isOpen,
  onClose,
  product
}) {
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({});

  // Initialize selected options to first variant or first options
  useEffect(() => {
    if (product && product.hasVariants && product.options && product.options.length > 0) {
      const initial = {};
      product.options.forEach((opt) => {
        if (opt.values && opt.values.length > 0) {
          initial[opt.name] = opt.values[0];
        }
      });
      setSelectedOptions(initial);
    } else {
      setSelectedOptions({});
    }
    setQty(1);
  }, [product]);

  if (!product) return null;

  // Find matching variant if options are selected
  const activeVariant =
    product.hasVariants && product.variants
      ? product.variants.find((v) =>
          Object.entries(selectedOptions).every(([k, val]) => v.attributes && v.attributes[k] === val)
        ) || product.variants[0]
      : null;

  const currentPrice = activeVariant ? activeVariant.price : product.price;
  const currentStock = activeVariant ? activeVariant.stock : product.stock;
  const currentSku = activeVariant ? activeVariant.sku : product.sku;
  const isOutOfStock = currentStock === 0;

  const handleAdd = () => {
    const itemToAdd = activeVariant
      ? {
          ...product,
          price: activeVariant.price,
          sku: activeVariant.sku,
          stock: activeVariant.stock,
          variantTitle: activeVariant.title,
          selectedAttributes: activeVariant.attributes
        }
      : product;

    addToCart(itemToAdd, qty);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={product.name}
      subtitle={`${product.category} • SKU: ${currentSku}`}
      maxWidth="760px"
    >
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        {/* Product Image with High-Res Glass Zoom Lens */}
        <div style={{ width: '280px', flexShrink: 0 }}>
          <ProductZoomInspector
            imageUrl={product.imageUrl}
            alt={product.name}
            width="280px"
            height="280px"
          />
        </div>

        {/* Product Details */}
        <div style={{ flex: 1, minWidth: '260px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            {/* Rating & Brand */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#F59E0B', fontSize: '0.8125rem', fontWeight: 700 }}>
                <Star size={14} fill="#F59E0B" />
                <span>4.9 / 5.0 (128 Customer Reviews)</span>
              </div>
              <span className="badge" style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-secondary)' }}>
                {product.brand || 'CloudMart Retail'}
              </span>
            </div>

            {/* Price & Stock Urgency */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '12px' }}>
              <div className="font-mono" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {formatCurrency(currentPrice)}
              </div>
              <span style={{ fontSize: '0.75rem', color: isOutOfStock ? 'var(--color-danger)' : currentStock <= 5 ? 'var(--color-warning)' : 'var(--color-success)', fontWeight: 600 }}>
                {isOutOfStock ? '• Sold Out' : currentStock <= 5 ? `• Only ${currentStock} Left in Stock!` : '• In Stock'}
              </span>
            </div>

            {/* Variant Options Selector */}
            {product.hasVariants && product.options && product.options.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px', background: 'rgba(255, 255, 255, 0.02)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                {product.options.map((opt) => (
                  <div key={opt.name}>
                    <div style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      {opt.name}: <strong style={{ color: 'var(--brand-primary)' }}>{selectedOptions[opt.name]}</strong>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {opt.values.map((val) => {
                        const isSelected = selectedOptions[opt.name] === val;
                        return (
                          <button
                            key={val}
                            type="button"
                            onClick={() => setSelectedOptions({ ...selectedOptions, [opt.name]: val })}
                            style={{
                              padding: '4px 10px',
                              borderRadius: 'var(--radius-sm)',
                              fontSize: '0.75rem',
                              fontWeight: isSelected ? 700 : 500,
                              color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                              background: isSelected ? 'var(--brand-primary)' : 'rgba(255, 255, 255, 0.05)',
                              border: isSelected ? '1px solid var(--brand-hover)' : '1px solid var(--border-subtle)',
                              cursor: 'pointer',
                              transition: 'all var(--transition-fast)'
                            }}
                          >
                            {val}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Description */}
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '12px' }}>
              {product.description || 'Premium retail product engineered with industry-leading quality standards and precision.'}
            </p>

            {/* Value Props */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Truck size={13} color="var(--color-success)" />
                <span>Free express delivery in 1-3 business days</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={13} color="var(--color-info)" />
                <span>2-Year Complete Manufacturer Warranty</span>
              </div>
            </div>
          </div>

          {/* Quantity Selector & Add to Cart */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 'var(--radius-md)',
                padding: '4px 10px',
                border: '1px solid var(--border-medium)'
              }}
            >
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                disabled={qty <= 1}
                style={{ color: 'var(--text-secondary)', display: 'flex' }}
              >
                <Minus size={14} />
              </button>
              <span className="font-mono" style={{ fontSize: '0.9375rem', fontWeight: 700, minWidth: '24px', textAlign: 'center' }}>
                {qty}
              </span>
              <button
                onClick={() => setQty((q) => Math.min(currentStock, q + 1))}
                disabled={qty >= currentStock}
                style={{ color: 'var(--text-secondary)', display: 'flex' }}
              >
                <Plus size={14} />
              </button>
            </div>

            <Button
              variant={isOutOfStock ? 'secondary' : 'primary'}
              size="lg"
              onClick={handleAdd}
              disabled={isOutOfStock}
              icon={ShoppingBag}
              style={{ flex: 1, justifyContent: 'center' }}
            >
              {isOutOfStock ? 'Sold Out' : `Add ${qty} to Cart • ${formatCurrency(currentPrice * qty)}`}
            </Button>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div style={{ width: '100%' }}>
          <StoreReviewsSection product={product} />
        </div>
      </div>
    </Modal>
  );
}
