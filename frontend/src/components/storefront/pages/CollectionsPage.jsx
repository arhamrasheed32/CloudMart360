import React from 'react';
import {
  Sparkles,
  ArrowRight,
  ShoppingBag,
  Layers,
  Star,
  Package
} from 'lucide-react';
import { Button } from '../../ui/Button.jsx';
import { SpotlightCard } from '../../ui/SpotlightCard.jsx';
import { useCart } from '../../../context/CartContext.jsx';
import { formatCurrency } from '../../../utils/formatters.js';

const COLLECTIONS = [
  {
    id: 'wfh',
    title: 'Workplace Ergonomics & Focus',
    tagline: 'High-precision engineering tailored for all-day creative workflows.',
    coverImage: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=900&q=80',
    categoryMatch: 'Electronics'
  },
  {
    id: 'apparel',
    title: 'Minimalist Earth & Weather Wear',
    tagline: '100% GOTS certified organic textiles engineered for climate versatility.',
    coverImage: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=900&q=80',
    categoryMatch: 'Apparel & Fashion'
  },
  {
    id: 'home',
    title: 'Artisanal Coffee & Morning Rituals',
    tagline: 'Single-origin beans, heat-resistant borosilicate glass, and precision kettles.',
    coverImage: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=900&q=80',
    categoryMatch: 'Home & Kitchen'
  }
];

export function CollectionsPage({
  products = [],
  onNavigateToCategory,
  onQuickView
}) {
  const { addToCart } = useCart();

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 28px', display: 'flex', flexDirection: 'column', gap: '50px' }}>
      {/* Header */}
      <div>
        <div className="badge" style={{ background: 'rgba(255, 87, 34, 0.15)', color: 'var(--brand-primary)', marginBottom: '10px' }}>
          Curated Lookbooks
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
          Signature Collections
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginTop: '6px', maxWidth: '600px' }}>
          Explore harmoniously curated equipment packages and themed lifestyle capsules.
        </p>
      </div>

      {/* Lookbooks List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
        {COLLECTIONS.map((col) => {
          const matchingItems = products.filter((p) => p.category === col.categoryMatch).slice(0, 3);

          return (
            <div
              key={col.id}
              className="glass-panel"
              style={{
                borderRadius: 'var(--radius-2xl)',
                overflow: 'hidden',
                border: '1px solid var(--border-medium)',
                background: 'rgba(14, 18, 28, 0.85)'
              }}
            >
              {/* Collection Banner */}
              <div
                style={{
                  position: 'relative',
                  height: '240px',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'flex-end',
                  padding: '32px'
                }}
              >
                <img
                  src={col.coverImage}
                  alt={col.title}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: 'brightness(0.55)'
                  }}
                />

                <div style={{ position: 'relative', zIndex: 1, maxWidth: '640px' }}>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '6px' }}>
                    {col.title}
                  </h2>
                  <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.85)', lineHeight: 1.5 }}>
                    {col.tagline}
                  </p>
                </div>
              </div>

              {/* Items in Collection */}
              <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Featured Pieces ({matchingItems.length})
                  </span>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onNavigateToCategory(col.categoryMatch)}
                    icon={ArrowRight}
                  >
                    View All {col.categoryMatch}
                  </Button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                  {matchingItems.map((item) => (
                    <SpotlightCard
                      key={item.id}
                      style={{
                        padding: '14px',
                        borderRadius: 'var(--radius-lg)',
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        <div
                          style={{
                            width: '100%',
                            height: '140px',
                            borderRadius: 'var(--radius-md)',
                            overflow: 'hidden',
                            background: 'rgba(0, 0, 0, 0.3)',
                            marginBottom: '10px'
                          }}
                        >
                          {item.imageUrl ? (
                            <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Package size={28} color="var(--text-muted)" />
                            </div>
                          )}
                        </div>

                        <h4
                          onClick={() => onQuickView(item)}
                          style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', cursor: 'pointer' }}
                          className="hover-underline"
                        >
                          {item.name}
                        </h4>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)', marginTop: '10px' }}>
                        <span className="font-mono" style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {formatCurrency(item.price)}
                        </span>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => addToCart(item, 1)}
                          icon={ShoppingBag}
                          style={{ height: '30px', padding: '0 8px', fontSize: '0.75rem' }}
                        >
                          Add
                        </Button>
                      </div>
                    </SpotlightCard>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
