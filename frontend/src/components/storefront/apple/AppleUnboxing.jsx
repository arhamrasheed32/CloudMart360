import React from 'react';
import {
  Package,
  ShieldCheck,
  Zap,
  Layers,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { SpotlightCard } from '../../ui/SpotlightCard.jsx';

const BOX_CONTENTS = [
  { title: 'Aura Pro Flagship Headphones', desc: 'Pre-calibrated in aerospace titanium finish' },
  { title: 'Magnetic Hard-Shell Travel Folio', desc: 'Ultra-slim shock-absorbing magnetic travel enclosure' },
  { title: 'Braided Kevlar USB-C Fast Cable (2m)', desc: 'Reinforced 100W power delivery & lossless audio pass' },
  { title: '3.5mm Gold-Plated Hi-Res Cable', desc: 'Analog backup for studio mixers and flights' },
  { title: 'DynamoDB Provenance Certificate', desc: 'Serialized cryptographic identity & 2-year warranty card' }
];

export function AppleUnboxing() {
  return (
    <section style={{ maxWidth: '1240px', margin: '0 auto', padding: '60px 24px', width: '100%' }}>
      <SpotlightCard
        spotlightColor="rgba(255, 255, 255, 0.08)"
        style={{
          padding: '44px 36px',
          borderRadius: 'var(--radius-2xl)',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(8, 11, 18, 0.95) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '36px',
          alignItems: 'center'
        }}
      >
        {/* Left Info */}
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--brand-primary)', marginBottom: '8px' }}>
            Unboxing Experience
          </div>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
            Everything You Need.{' '}
            <span style={{ color: '#94A3B8' }}>Nothing You Don't.</span>
          </h2>
          <p style={{ fontSize: '0.9375rem', color: '#94A3B8', marginTop: '12px', lineHeight: 1.6 }}>
            Every CloudMart 360 flagship package is crafted from 100% recycled virgin fiber and unbleached kraft paper with zero single-use plastics.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-success)', fontSize: '0.8125rem', fontWeight: 700, marginTop: '16px' }}>
            <ShieldCheck size={16} />
            <span>Official 2-Year CloudMart Manufacturer Guarantee Included</span>
          </div>
        </div>

        {/* Right What's in the Box List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748B', letterSpacing: '0.08em', marginBottom: '4px' }}>
            In the Box:
          </div>

          {BOX_CONTENTS.map((item, idx) => (
            <div
              key={idx}
              className="glass-panel"
              style={{
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'rgba(255, 87, 34, 0.15)',
                  color: 'var(--brand-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  flexShrink: 0
                }}
              >
                {idx + 1}
              </div>

              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#FFFFFF' }}>
                  {item.title}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                  {item.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </SpotlightCard>
    </section>
  );
}
