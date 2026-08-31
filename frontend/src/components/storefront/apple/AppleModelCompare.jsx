import React from 'react';
import {
  Check,
  ShoppingBag,
  Volume2,
  BatteryCharging,
  Cpu,
  Sparkles,
  Layers
} from 'lucide-react';
import { Button } from '../../ui/Button.jsx';
import { useCart } from '../../../context/CartContext.jsx';
import { formatCurrency } from '../../../utils/formatters.js';

const MODELS = [
  {
    id: 'aura-std',
    name: 'Aura Standard',
    tagline: 'Pure essential sound for daily productivity.',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&q=80',
    battery: '30 hours',
    anc: '32dB Standard ANC',
    material: 'Anodized Aluminum',
    driver: '35mm Dynamic',
    spatialAudio: 'Stereo Sound',
    isPro: false
  },
  {
    id: 'aura-pro',
    name: 'Aura Pro Flagship',
    tagline: 'The pinnacle of acoustic precision and cloud sync.',
    price: 249.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
    battery: '40 hours',
    anc: '40dB Hybrid ANC (6 Mics)',
    material: 'Grade-5 Titanium Alloy',
    driver: '40mm Bio-Cellulose',
    spatialAudio: 'Personalized Spatial Audio',
    isPro: true
  },
  {
    id: 'aura-studio',
    name: 'Aura Studio Master',
    tagline: 'Lossless audio precision for sound engineers.',
    price: 289.99,
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=80',
    battery: '48 hours',
    anc: '45dB Adaptive ANC (8 Mics)',
    material: 'Surgical Stainless Steel',
    driver: '45mm Planar Magnetic',
    spatialAudio: 'Dolby Atmos Master Studio',
    isPro: false
  }
];

export function AppleModelCompare({ onAddToCart }) {
  const { addToCart } = useCart();

  return (
    <section style={{ maxWidth: '1240px', margin: '0 auto', padding: '60px 24px', width: '100%' }}>
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <div
          style={{
            fontSize: '0.8125rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            color: 'var(--brand-primary)',
            marginBottom: '8px'
          }}
        >
          Compare Models
        </div>
        <h2
          style={{
            fontSize: 'clamp(2rem, 4.5vw, 3.25rem)',
            fontWeight: 900,
            color: '#FFFFFF',
            letterSpacing: '-0.035em',
            lineHeight: 1.1
          }}
        >
          Which Aura is Right for You?
        </h2>
      </div>

      {/* 3-Column Apple Comparison Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px'
        }}
      >
        {MODELS.map((model) => {
          const isFeatured = model.isPro;

          return (
            <div
              key={model.id}
              className="glass-panel"
              style={{
                borderRadius: 'var(--radius-2xl)',
                padding: '32px 24px',
                background: isFeatured ? 'linear-gradient(180deg, rgba(255, 87, 34, 0.08) 0%, rgba(10, 14, 22, 0.95) 100%)' : 'rgba(255, 255, 255, 0.02)',
                border: isFeatured ? '1px solid rgba(255, 87, 34, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: isFeatured ? '0 24px 64px -12px rgba(255, 87, 34, 0.25)' : 'none',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative'
              }}
            >
              {isFeatured && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'var(--brand-primary)',
                    color: '#FFFFFF',
                    fontSize: '0.6875rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    padding: '3px 12px',
                    borderRadius: 'var(--radius-full)',
                    boxShadow: '0 4px 12px rgba(255, 87, 34, 0.4)'
                  }}
                >
                  Most Popular
                </div>
              )}

              <div>
                {/* Product Photo */}
                <div
                  style={{
                    width: '100%',
                    height: '180px',
                    borderRadius: 'var(--radius-xl)',
                    overflow: 'hidden',
                    background: 'rgba(0, 0, 0, 0.3)',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <img
                    src={model.image}
                    alt={model.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                <h3 style={{ fontSize: '1.375rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '4px' }}>
                  {model.name}
                </h3>
                <p style={{ fontSize: '0.8125rem', color: '#94A3B8', lineHeight: 1.5, minHeight: '36px', marginBottom: '14px' }}>
                  {model.tagline}
                </p>

                <div className="font-mono" style={{ fontSize: '1.75rem', fontWeight: 900, color: '#FFFFFF', marginBottom: '20px' }}>
                  {formatCurrency(model.price)}
                </div>

                {/* Specs Checklist */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '20px' }}>
                  <div>
                    <div style={{ fontSize: '0.6875rem', color: '#64748B', textTransform: 'uppercase' }}>Battery Life</div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#FFFFFF' }}>{model.battery}</div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.6875rem', color: '#64748B', textTransform: 'uppercase' }}>Noise Cancellation</div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#FFFFFF' }}>{model.anc}</div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.6875rem', color: '#64748B', textTransform: 'uppercase' }}>Enclosure Material</div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#FFFFFF' }}>{model.material}</div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.6875rem', color: '#64748B', textTransform: 'uppercase' }}>Acoustic Drivers</div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#FFFFFF' }}>{model.driver}</div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.6875rem', color: '#64748B', textTransform: 'uppercase' }}>Spatial Audio</div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#FFFFFF' }}>{model.spatialAudio}</div>
                  </div>
                </div>
              </div>

              {/* Buy CTA */}
              <div style={{ paddingTop: '24px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', marginTop: '20px' }}>
                <Button
                  variant={isFeatured ? 'primary' : 'secondary'}
                  size="md"
                  onClick={() => addToCart({ id: model.id, name: model.name, price: model.price, stock: 20, sku: `CM-AUR-${model.id.toUpperCase()}`, imageUrl: model.image }, 1)}
                  icon={ShoppingBag}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Select & Buy
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
