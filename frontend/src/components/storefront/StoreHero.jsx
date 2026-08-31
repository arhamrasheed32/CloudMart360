import React from 'react';
import {
  Sparkles,
  Zap,
  ShieldCheck,
  Truck,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { Button } from '../ui/Button.jsx';

export function StoreHero({ onExploreCatalog }) {
  return (
    <section
      style={{
        position: 'relative',
        padding: '54px 28px 42px 28px',
        overflow: 'hidden',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'linear-gradient(180deg, rgba(255, 87, 34, 0.05) 0%, rgba(10, 14, 22, 0) 100%)'
      }}
    >
      {/* Background ambient lighting */}
      <div
        style={{
          position: 'absolute',
          top: '-20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '240px',
          background: 'radial-gradient(circle, rgba(255, 87, 34, 0.15) 0%, rgba(0,0,0,0) 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none'
        }}
      />

      <div style={{ maxWidth: '960px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        {/* Pill Tag */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 14px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(255, 87, 34, 0.12)',
            border: '1px solid rgba(255, 87, 34, 0.3)',
            color: 'var(--brand-primary)',
            fontSize: '0.75rem',
            fontWeight: 700,
            marginBottom: '16px'
          }}
        >
          <Sparkles size={13} />
          <span>CloudMart 360 • Live Retail Storefront</span>
        </div>

        <h1
          style={{
            fontSize: 'clamp(2rem, 5vw, 3.25rem)',
            fontWeight: 800,
            color: 'var(--text-primary)',
            letterSpacing: '-0.035em',
            lineHeight: 1.15,
            marginBottom: '16px'
          }}
        >
          Curated Modern Essentials.{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, var(--brand-primary) 0%, #FF8A65 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Real-Time Cloud Inventory.
          </span>
        </h1>

        <p
          style={{
            fontSize: 'clamp(0.9375rem, 2vw, 1.125rem)',
            color: 'var(--text-secondary)',
            maxWidth: '680px',
            margin: '0 auto 28px auto',
            lineHeight: 1.6
          }}
        >
          Explore precision-engineered electronics, lifestyle apparel, and home innovations powered directly by Amazon DynamoDB and AWS Serverless technology.
        </p>

        {/* Feature Badges */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '24px',
            flexWrap: 'wrap',
            fontSize: '0.8125rem',
            color: 'var(--text-muted)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Truck size={16} color="var(--color-success)" />
            <span>Free Express Delivery over $150</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Zap size={16} color="var(--brand-primary)" />
            <span>Live Stock Sync (DynamoDB)</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={16} color="var(--color-info)" />
            <span>1-Year Official Warranty</span>
          </div>
        </div>
      </div>
    </section>
  );
}
