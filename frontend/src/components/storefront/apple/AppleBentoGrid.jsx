import React from 'react';
import {
  ShieldCheck,
  BatteryCharging,
  Volume2,
  Cpu,
  Zap,
  Globe,
  Layers,
  Sparkles
} from 'lucide-react';
import { SpotlightCard } from '../../ui/SpotlightCard.jsx';

export function AppleBentoGrid() {
  return (
    <section style={{ maxWidth: '1240px', margin: '0 auto', padding: '60px 24px', width: '100%' }}>
      {/* Header */}
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
          Engineering Highlights
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
          Remarkable in Every Dimension.
        </h2>
      </div>

      {/* Bento Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: '20px'
        }}
      >
        {/* Bento 1: Titanium (Span 7) */}
        <SpotlightCard
          spotlightColor="rgba(255, 255, 255, 0.1)"
          style={{
            gridColumn: 'span 7',
            padding: '36px',
            borderRadius: 'var(--radius-2xl)',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(10, 14, 22, 0.9) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '280px'
          }}
          className="bento-card-span-7"
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94A3B8', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
              <ShieldCheck size={16} color="var(--brand-primary)" />
              <span>Aerospace Engineering</span>
            </div>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              Forged in Grade-5 Titanium.
            </h3>
            <p style={{ fontSize: '0.9375rem', color: '#94A3B8', marginTop: '8px', lineHeight: 1.6, maxWidth: '480px' }}>
              Precision CNC-machined enclosure provides the highest strength-to-weight ratio of any retail audio equipment. Ultra-light, corrosion-proof, and cool to the touch.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div>
              <div className="font-mono" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF' }}>185g</div>
              <div style={{ fontSize: '0.6875rem', color: '#64748B', textTransform: 'uppercase' }}>Total Weight</div>
            </div>
            <div>
              <div className="font-mono" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--brand-primary)' }}>100%</div>
              <div style={{ fontSize: '0.6875rem', color: '#64748B', textTransform: 'uppercase' }}>Recycled Alloy</div>
            </div>
          </div>
        </SpotlightCard>

        {/* Bento 2: 40-Hour Battery (Span 5) */}
        <SpotlightCard
          spotlightColor="rgba(16, 185, 129, 0.15)"
          style={{
            gridColumn: 'span 5',
            padding: '36px',
            borderRadius: 'var(--radius-2xl)',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.06) 0%, rgba(10, 14, 22, 0.9) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '280px'
          }}
          className="bento-card-span-5"
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-success)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
              <BatteryCharging size={16} />
              <span>All-Day Endurance</span>
            </div>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              40 Hours of Continuous Sound.
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#94A3B8', marginTop: '8px', lineHeight: 1.5 }}>
              Fly from New York to Tokyo and back on a single charge. 10 minutes of USB-C fast charging gives 5 hours of playback.
            </p>
          </div>

          <div className="font-mono" style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--color-success)', letterSpacing: '-0.03em' }}>
            40<span style={{ fontSize: '1.25rem', fontWeight: 600 }}>hrs</span>
          </div>
        </SpotlightCard>

        {/* Bento 3: Hybrid ANC (Span 4) */}
        <SpotlightCard
          spotlightColor="rgba(56, 189, 248, 0.15)"
          style={{
            gridColumn: 'span 4',
            padding: '30px',
            borderRadius: 'var(--radius-2xl)',
            background: 'rgba(255, 255, 255, 0.025)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '240px'
          }}
          className="bento-card-span-4"
        >
          <div>
            <Volume2 size={24} color="#38BDF8" style={{ marginBottom: '12px' }} />
            <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF' }}>
              40dB Hybrid ANC
            </h4>
            <p style={{ fontSize: '0.8125rem', color: '#94A3B8', marginTop: '6px', lineHeight: 1.5 }}>
              6 outward and inward microphones calculate ambient noise 48,000 times per second to eliminate office distractions.
            </p>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#38BDF8', fontWeight: 700 }}>
            2x More Noise Reduction
          </div>
        </SpotlightCard>

        {/* Bento 4: 40mm Bio-Cellulose Drivers (Span 4) */}
        <SpotlightCard
          spotlightColor="rgba(255, 87, 34, 0.15)"
          style={{
            gridColumn: 'span 4',
            padding: '30px',
            borderRadius: 'var(--radius-2xl)',
            background: 'rgba(255, 255, 255, 0.025)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '240px'
          }}
          className="bento-card-span-4"
        >
          <div>
            <Cpu size={24} color="var(--brand-primary)" style={{ marginBottom: '12px' }} />
            <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF' }}>
              Custom Bio-Drivers
            </h4>
            <p style={{ fontSize: '0.8125rem', color: '#94A3B8', marginTop: '6px', lineHeight: 1.5 }}>
              Ultra-light diaphragms engineered with natural organic fibers deliver deep, resonant sub-bass and ultra-crisp highs up to 40kHz.
            </p>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--brand-primary)', fontWeight: 700 }}>
            High-Resolution Certified
          </div>
        </SpotlightCard>

        {/* Bento 5: Multipoint Bluetooth 5.3 (Span 4) */}
        <SpotlightCard
          spotlightColor="rgba(245, 158, 11, 0.15)"
          style={{
            gridColumn: 'span 4',
            padding: '30px',
            borderRadius: 'var(--radius-2xl)',
            background: 'rgba(255, 255, 255, 0.025)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '240px'
          }}
          className="bento-card-span-4"
        >
          <div>
            <Zap size={24} color="#F59E0B" style={{ marginBottom: '12px' }} />
            <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF' }}>
              Multipoint Bluetooth 5.3
            </h4>
            <p style={{ fontSize: '0.8125rem', color: '#94A3B8', marginTop: '6px', lineHeight: 1.5 }}>
              Seamlessly pair and transition between your phone, tablet, and workstation with ultra-low latency audio synchronization.
            </p>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#F59E0B', fontWeight: 700 }}>
            Instant Device Handoff
          </div>
        </SpotlightCard>
      </div>
    </section>
  );
}
