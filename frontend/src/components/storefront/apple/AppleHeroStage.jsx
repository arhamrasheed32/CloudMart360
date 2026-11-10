import React, { useState } from 'react';
import {
  Sparkles,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Zap,
  Volume2,
  BatteryCharging,
  Cpu,
  Check,
  ChevronRight
} from 'lucide-react';
import { Button } from '../../ui/Button.jsx';
import { useCart } from '../../../context/CartContext.jsx';
import { formatCurrency } from '../../../utils/formatters.js';

const COLOR_FINISHES = [
  {
    id: 'space-black',
    name: 'Space Black',
    colorCode: '#1A1C23',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&q=85',
    tagline: 'Deep anodized matte black with diamond-cut chamfered edges.'
  },
  {
    id: 'natural-titanium',
    name: 'Natural Titanium',
    colorCode: '#9E9A93',
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=900&q=85',
    tagline: 'Raw brushed titanium alloy with zero-fingerprint ceramic coating.'
  },
  {
    id: 'midnight-blue',
    name: 'Midnight Blue',
    colorCode: '#1E293B',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=900&q=85',
    tagline: 'Deep oceanic blue with micro-textured aluminum earcups.'
  },
  {
    id: 'silver-frost',
    name: 'Silver Frost',
    colorCode: '#E2E8F0',
    image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=900&q=85',
    tagline: 'High-polish surgical stainless steel with white memory foam.'
  }
];

export function AppleHeroStage({
  featuredProduct,
  onExploreCatalog,
  onQuickView
}) {
  const { addToCart } = useCart();
  const [activeFinish, setActiveFinish] = useState(COLOR_FINISHES[0]);

  const productToUse = featuredProduct || {
    id: 'prod-001-aura-pro',
    name: 'Aura Pro Noise Cancelling Headphones',
    price: 249.99,
    stock: 30,
    sku: 'CM-ELE-AUR-9021'
  };

  return (
    <section
      style={{
        position: 'relative',
        padding: '90px 24px 70px 24px',
        background: 'radial-gradient(ellipse 90% 60% at 50% 0%, #151824 0%, #06080D 100%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '24px'
        }}
      >
        {/* Eyebrow */}
        <div
          style={{
            fontSize: '0.8125rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            color: 'var(--brand-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Sparkles size={14} />
          <span>CloudMart 360 Flagship Hardware</span>
        </div>

        {/* Main Display Headline */}
        <h1
          style={{
            fontSize: 'clamp(2.75rem, 7vw, 5.25rem)',
            fontWeight: 900,
            color: '#FFFFFF',
            letterSpacing: '-0.045em',
            lineHeight: 1.02,
            maxWidth: '900px',
            margin: 0
          }}
        >
          Aura Pro.{' '}
          <span
            style={{
              background: 'linear-gradient(180deg, #FFFFFF 30%, #94A3B8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Acoustic Genius.
          </span>
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: 'clamp(1.125rem, 2.5vw, 1.375rem)',
            color: '#94A3B8',
            maxWidth: '680px',
            lineHeight: 1.5,
            margin: 0,
            letterSpacing: '-0.01em'
          }}
        >
          Aerospace titanium construction. Custom 40mm bio-cellulose acoustic drivers. 40-hour battery life with USB-C fast charging.
        </p>

        {/* Pricing and Action Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '8px' }}>
          <button
            onClick={() => addToCart({ ...productToUse, variantTitle: activeFinish.name, imageUrl: activeFinish.image }, 1)}
            style={{
              height: '48px',
              padding: '0 32px',
              borderRadius: 'var(--radius-full)',
              background: 'linear-gradient(135deg, #FFFFFF 0%, #E2E8F0 100%)',
              color: '#000000',
              fontWeight: 800,
              fontSize: '0.9375rem',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 24px rgba(255, 255, 255, 0.25)',
              transition: 'all 200ms ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.03)';
              e.currentTarget.style.boxShadow = '0 6px 32px rgba(255, 255, 255, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 24px rgba(255, 255, 255, 0.25)';
            }}
          >
            <ShoppingBag size={18} color="#000000" />
            <span>Buy Now • {formatCurrency(productToUse.price)}</span>
          </button>

          <button
            onClick={() => onQuickView(productToUse)}
            style={{
              height: '48px',
              padding: '0 24px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(255, 255, 255, 0.06)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '0.9375rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 200ms ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
            }}
          >
            <span>Explore Technical Specs</span>
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Apple Stage Visual & Color Swatches */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '840px', marginTop: '30px' }}>
          {/* Main Visual Display */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '380px',
              borderRadius: 'var(--radius-2xl)',
              overflow: 'hidden',
              background: 'radial-gradient(circle at 50% 50%, rgba(255, 87, 34, 0.08) 0%, rgba(0, 0, 0, 0.6) 80%)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 32px 80px -16px rgba(0, 0, 0, 0.9), inset 0 1px 1px rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <img
              src={activeFinish.image}
              alt={activeFinish.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.8))',
                transition: 'all 500ms cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            />

            {/* Spec Highlight Floating Pills */}
            <div
              className="glass-panel"
              style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(10, 14, 22, 0.85)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#FFFFFF'
              }}
            >
              <Cpu size={14} color="var(--brand-primary)" />
              <span>40mm Bio-Cellulose Drivers</span>
            </div>

            <div
              className="glass-panel"
              style={{
                position: 'absolute',
                bottom: '20px',
                right: '20px',
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(10, 14, 22, 0.85)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#FFFFFF'
              }}
            >
              <BatteryCharging size={14} color="var(--color-success)" />
              <span>40-Hour Battery • USB-C Fast Charge</span>
            </div>
          </div>

          {/* Color Finish Picker (Space Black, Natural Titanium, Midnight Blue, Silver Frost) */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px',
              marginTop: '24px'
            }}
          >
            <span style={{ fontSize: '0.8125rem', color: '#94A3B8', fontWeight: 600 }}>
              Available in 4 Precision Finishes: <strong style={{ color: '#FFFFFF' }}>{activeFinish.name}</strong>
            </span>

            <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
              {COLOR_FINISHES.map((finish) => {
                const isSelected = activeFinish.id === finish.id;
                return (
                  <button
                    key={finish.id}
                    onClick={() => setActiveFinish(finish)}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: finish.colorCode,
                      border: isSelected ? '2px solid #FFFFFF' : '2px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: isSelected ? '0 0 16px rgba(255, 255, 255, 0.5)' : 'none',
                      cursor: 'pointer',
                      transform: isSelected ? 'scale(1.2)' : 'scale(1)',
                      transition: 'all 200ms ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 0
                    }}
                    title={finish.name}
                  >
                    {isSelected && (
                      <Check size={14} color={finish.id === 'silver-frost' ? '#000000' : '#FFFFFF'} strokeWidth={3} />
                    )}
                  </button>
                );
              })}
            </div>

            <p style={{ fontSize: '0.75rem', color: '#64748B', maxWidth: '420px', textAlign: 'center', margin: '4px 0 0 0' }}>
              {activeFinish.tagline}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
