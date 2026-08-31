import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Sparkles,
  ArrowUp,
  Volume2,
  Layers,
  ShieldCheck
} from 'lucide-react';
import { useCart } from '../../../context/CartContext.jsx';
import { formatCurrency } from '../../../utils/formatters.js';

export function AppleDynamicIsland({
  productName = 'Aura Pro',
  price = 249.99,
  onBuyClick
}) {
  const { totalItemsCount, setIsCartOpen } = useCart();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 380) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
        animation: 'scaleUp 200ms cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      <div
        className="glass-modal"
        style={{
          padding: '8px 18px',
          borderRadius: 'var(--radius-full)',
          background: 'rgba(10, 14, 22, 0.92)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          boxShadow: '0 20px 48px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 87, 34, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '20px'
        }}
      >
        {/* Brand/Model */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="pulse-status" style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--brand-primary)' }} />
          <span style={{ fontSize: '0.875rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.01em' }}>
            {productName}
          </span>
        </div>

        {/* Anchor Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.75rem', fontWeight: 600, color: '#94A3B8' }} className="dynamic-island-links">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{ color: '#94A3B8', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            className="hover-underline"
          >
            Overview
          </button>
          <button
            onClick={() => window.scrollTo({ top: 750, behavior: 'smooth' })}
            style={{ color: '#94A3B8', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            className="hover-underline"
          >
            Bento Tech
          </button>
          <button
            onClick={() => window.scrollTo({ top: 1400, behavior: 'smooth' })}
            style={{ color: '#94A3B8', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            className="hover-underline"
          >
            Sound Chamber
          </button>
          <button
            onClick={() => window.scrollTo({ top: 2000, behavior: 'smooth' })}
            style={{ color: '#94A3B8', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            className="hover-underline"
          >
            Compare
          </button>
        </div>

        {/* Buy CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={onBuyClick}
            style={{
              height: '32px',
              padding: '0 16px',
              borderRadius: 'var(--radius-full)',
              background: 'linear-gradient(135deg, var(--brand-primary) 0%, #D84315 100%)',
              color: '#FFFFFF',
              fontSize: '0.75rem',
              fontWeight: 800,
              border: '1px solid rgba(255, 255, 255, 0.2)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 0 16px rgba(255, 87, 34, 0.4)'
            }}
          >
            <ShoppingBag size={13} />
            <span>Buy {formatCurrency(price)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
