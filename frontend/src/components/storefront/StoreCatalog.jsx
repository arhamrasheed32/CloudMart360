import React, { useState } from 'react';
import {
  ShoppingBag,
  Eye,
  Star,
  Package,
  Check,
  AlertTriangle,
  SlidersHorizontal,
  ArrowUpDown
} from 'lucide-react';
import { Button } from '../ui/Button.jsx';
import { Badge } from '../ui/Badge.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { formatCurrency } from '../../utils/formatters.js';

export function StoreCatalog({
  products = [],
  activeCategory = 'all',
  onSelectCategory,
  onQuickView
}) {
  const { addToCart } = useCart();
  const [sortBy, setSortBy] = useState('featured');

  // Filter only active catalog items for the customer storefront
  const activeProducts = products.filter((p) => p.status !== 'archived');

  const filteredProducts = activeCategory === 'all'
    ? activeProducts
    : activeProducts.filter((p) => p.category === activeCategory);

  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return Number(a.price) - Number(b.price);
    if (sortBy === 'price-high') return Number(b.price) - Number(a.price);
    if (sortBy === 'stock') return Number(b.stock) - Number(a.stock);
    return 0; // default featured
  });

  const categories = [
    'all',
    ...Array.from(new Set(activeProducts.map((p) => p.category))).filter(Boolean)
  ];

  return (
    <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '36px 24px' }}>
      {/* Category Pills & Sorting Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px',
          marginBottom: '28px'
        }}
      >
        {/* Category Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {categories.map((cat) => {
            const count = cat === 'all' ? activeProducts.length : activeProducts.filter((p) => p.category === cat).length;
            const isSelected = activeCategory === cat;

            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                  background: isSelected ? 'var(--brand-primary)' : 'rgba(255, 255, 255, 0.04)',
                  border: isSelected ? '1px solid var(--brand-primary)' : '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                  boxShadow: isSelected ? '0 0 16px rgba(255, 87, 34, 0.35)' : 'none'
                }}
              >
                <span>{cat === 'all' ? 'All Items' : cat}</span>
                <span
                  style={{
                    fontSize: '0.6875rem',
                    opacity: 0.8,
                    background: isSelected ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                    padding: '1px 6px',
                    borderRadius: 'var(--radius-full)'
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Sort Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="glass-input"
            style={{
              height: '36px',
              padding: '0 12px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.8125rem',
              cursor: 'pointer'
            }}
          >
            <option value="featured" style={{ background: '#121724' }}>Featured Collection</option>
            <option value="price-low" style={{ background: '#121724' }}>Price: Low to High</option>
            <option value="price-high" style={{ background: '#121724' }}>Price: High to Low</option>
            <option value="stock" style={{ background: '#121724' }}>Availability</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {sortedProducts.length === 0 ? (
        <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Package size={48} color="var(--text-faint)" style={{ margin: '0 auto 12px auto' }} />
          <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            No products found in this category
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Try selecting a different category or clearing search filters.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
            gap: '22px'
          }}
        >
          {sortedProducts.map((product) => {
            const isOutOfStock = product.stock === 0;
            const isLowStock = product.stock > 0 && product.stock <= (product.minStockThreshold || 10);

            return (
              <div
                key={product.id}
                className="glass-panel glass-panel-hover"
                style={{
                  borderRadius: 'var(--radius-xl)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  border: '1px solid var(--border-default)',
                  transition: 'all var(--transition-normal)'
                }}
              >
                {/* Product Image Area */}
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    paddingTop: '75%', // 4:3 aspect ratio
                    background: 'rgba(0, 0, 0, 0.25)',
                    overflow: 'hidden'
                  }}
                >
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 300ms ease'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Package size={40} color="var(--text-muted)" />
                    </div>
                  )}

                  {/* Stock Status Badge Overlay */}
                  <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
                    {isOutOfStock ? (
                      <span className="badge" style={{ background: 'rgba(239, 68, 68, 0.9)', color: '#FFFFFF', backdropFilter: 'blur(8px)' }}>
                        Sold Out
                      </span>
                    ) : isLowStock ? (
                      <span className="badge" style={{ background: 'rgba(245, 158, 11, 0.9)', color: '#090D16', fontWeight: 700, backdropFilter: 'blur(8px)' }}>
                        Only {product.stock} Left
                      </span>
                    ) : (
                      <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.85)', color: '#FFFFFF', backdropFilter: 'blur(8px)' }}>
                        In Stock
                      </span>
                    )}
                  </div>

                  {/* Quick View Button on Image */}
                  <button
                    onClick={() => onQuickView(product)}
                    style={{
                      position: 'absolute',
                      bottom: '10px',
                      right: '10px',
                      padding: '8px',
                      borderRadius: 'var(--radius-full)',
                      background: 'rgba(14, 18, 28, 0.85)',
                      color: '#FFFFFF',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)'
                    }}
                    title="Quick Preview"
                  >
                    <Eye size={15} />
                  </button>
                </div>

                {/* Content Details */}
                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--brand-primary)', letterSpacing: '0.04em' }}>
                        {product.category}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#F59E0B', fontSize: '0.75rem', fontWeight: 700 }}>
                        <Star size={12} fill="#F59E0B" />
                        <span>4.9</span>
                      </div>
                    </div>

                    <h3
                      onClick={() => onQuickView(product)}
                      style={{
                        fontSize: '0.9375rem',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        marginBottom: '6px',
                        cursor: 'pointer',
                        lineHeight: 1.35
                      }}
                      className="hover-underline"
                    >
                      {product.name}
                    </h3>

                    {product.brand && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                        By {product.brand}
                      </div>
                    )}
                  </div>

                  {/* Price & Add to Cart Button */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)', marginTop: '8px' }}>
                    <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {formatCurrency(product.price)}
                    </div>

                    <Button
                      variant={isOutOfStock ? 'secondary' : 'primary'}
                      size="sm"
                      onClick={() => addToCart(product, 1)}
                      disabled={isOutOfStock}
                      icon={ShoppingBag}
                      style={{ height: '34px', padding: '0 12px', fontSize: '0.75rem' }}
                    >
                      {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
