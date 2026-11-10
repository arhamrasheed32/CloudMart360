import React from 'react';
import { AppleHeroStage } from '../apple/AppleHeroStage.jsx';
import { SoundStageExperience } from '../apple/SoundStageExperience.jsx';
import { AppleBentoGrid } from '../apple/AppleBentoGrid.jsx';
import { AppleModelCompare } from '../apple/AppleModelCompare.jsx';
import { AppleUnboxing } from '../apple/AppleUnboxing.jsx';
import {
  Sparkles,
  ArrowRight,
  ShoppingBag,
  Star,
  Truck,
  ShieldCheck,
  Zap,
  Package,
  TrendingUp,
  ChevronRight
} from 'lucide-react';
import { Button } from '../../ui/Button.jsx';
import { SpotlightCard } from '../../ui/SpotlightCard.jsx';
import { useCart } from '../../../context/CartContext.jsx';
import { formatCurrency } from '../../../utils/formatters.js';

const CATEGORY_CARDS = [
  {
    id: 'Electronics',
    title: 'Precision Electronics',
    subtitle: 'Audio, peripherals & smart devices',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700&q=80',
    tag: 'Flagship Tech'
  },
  {
    id: 'Apparel & Fashion',
    title: 'Minimalist Apparel',
    subtitle: '100% organic cottons & technical fabrics',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=700&q=80',
    tag: 'Sustainable'
  },
  {
    id: 'Home & Kitchen',
    title: 'Artisanal Living',
    subtitle: 'Coffee craft, ergonomics & decor',
    image: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=700&q=80',
    tag: 'Modern Craft'
  },
  {
    id: 'Health & Beauty',
    title: 'Botanical Wellness',
    subtitle: 'Clean formulations & daily recovery',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=700&q=80',
    tag: 'Clean Science'
  }
];

export function HomePage({
  products = [],
  onNavigateToShop,
  onQuickView
}) {
  const { addToCart } = useCart();
  const featuredProduct =
    products.find((p) => p.id === 'prod-001-aura-pro') ||
    products.find((p) => p.name?.toLowerCase().includes('aura')) ||
    products.find((p) => p.category === 'Electronics') ||
    products[0];
  const bestSellers = products.slice(0, 4);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '50px' }}>
      {/* 1. Apple Flagship Hardware Stage */}
      <AppleHeroStage
        featuredProduct={featuredProduct}
        onExploreCatalog={() => onNavigateToShop('all')}
        onQuickView={onQuickView}
      />

      {/* 2. Apple Bento Grid Feature Showcase */}
      <AppleBentoGrid />

      {/* 3. Interactive Spatial Sound Stage Experience */}
      <SoundStageExperience />

      {/* 4. Apple Bento Grid Feature Showcase */}
      <AppleBentoGrid />

      {/* 5. Apple Model Comparison Matrix */}
      <AppleModelCompare onAddToCart={addToCart} />

      {/* 6. Luxury Unboxing & Packaging Showcase */}
      <AppleUnboxing />

      {/* 7. Visual Category Showcase */}
      <section style={{ maxWidth: '1240px', margin: '0 auto', padding: '20px 24px', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--brand-primary)', marginBottom: '6px' }}>
              Curated Collections
            </div>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.03em' }}>
              Explore Categories
            </h2>
          </div>
          <button
            onClick={() => onNavigateToShop('all')}
            style={{ color: 'var(--brand-primary)', fontWeight: 700, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <span>View Entire Catalog</span>
            <ChevronRight size={16} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
          {CATEGORY_CARDS.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onNavigateToShop(cat.id)}
              className="glass-panel glass-panel-hover"
              style={{
                height: '320px',
                borderRadius: 'var(--radius-2xl)',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '24px'
              }}
            >
              <img
                src={cat.image}
                alt={cat.title}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'brightness(0.6)',
                  transition: 'transform 500ms cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              />

              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(6,8,13,0.95) 100%)',
                  pointerEvents: 'none'
                }}
              />

              <div style={{ position: 'relative', zIndex: 1 }}>
                <span className="badge" style={{ background: 'var(--brand-primary)', color: '#FFFFFF', marginBottom: '8px' }}>
                  {cat.tag}
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '4px' }}>
                  {cat.title}
                </h3>
                <p style={{ fontSize: '0.8125rem', color: '#94A3B8' }}>
                  {cat.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Catalog Highlights Grid */}
      <section style={{ maxWidth: '1240px', margin: '0 auto', padding: '20px 24px 60px 24px', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={20} color="var(--brand-primary)" />
              <h2 style={{ fontSize: '2.25rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.03em' }}>
                Catalog Highlights
              </h2>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#94A3B8', marginTop: '4px' }}>
              Handpicked essentials engineered for performance, style, and everyday utility.
            </p>
          </div>

          <Button variant="secondary" size="sm" onClick={() => onNavigateToShop('all')}>
            Browse All ({products.length})
          </Button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
          {bestSellers.map((product) => (
            <SpotlightCard
              key={product.id}
              spotlightColor="rgba(255, 87, 34, 0.16)"
              style={{
                borderRadius: 'var(--radius-2xl)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <div>
                <div
                  style={{
                    width: '100%',
                    height: '180px',
                    borderRadius: 'var(--radius-xl)',
                    overflow: 'hidden',
                    background: 'rgba(0, 0, 0, 0.4)',
                    marginBottom: '14px',
                    position: 'relative'
                  }}
                >
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Package size={40} color="var(--text-muted)" />
                    </div>
                  )}
                  <span className="badge" style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(0, 0, 0, 0.8)', color: '#FFFFFF', backdropFilter: 'blur(8px)' }}>
                    {product.category}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748B' }}>{product.brand || 'CloudMart'}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#F59E0B', fontSize: '0.75rem', fontWeight: 700 }}>
                    <Star size={12} fill="#F59E0B" />
                    <span>4.9</span>
                  </div>
                </div>

                <h3
                  onClick={() => onQuickView(product)}
                  style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '4px', cursor: 'pointer', lineHeight: 1.3 }}
                  className="hover-underline"
                >
                  {product.name}
                </h3>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '14px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', marginTop: '14px' }}>
                <span className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF' }}>
                  {formatCurrency(product.price)}
                </span>
                <Button variant="primary" size="sm" onClick={() => addToCart(product, 1)} icon={ShoppingBag} style={{ height: '34px', padding: '0 12px', fontSize: '0.75rem' }}>
                  Add
                </Button>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </section>
    </div>
  );
}
