import React from 'react';
import {
  Cloud,
  Database,
  Cpu,
  Globe,
  ShieldCheck,
  Zap,
  TrendingUp,
  Sparkles,
  Layers
} from 'lucide-react';
import { SpotlightCard } from '../../ui/SpotlightCard.jsx';

export function AboutPage() {
  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 28px', display: 'flex', flexDirection: 'column', gap: '50px' }}>
      {/* Intro Header */}
      <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto' }}>
        <div className="badge" style={{ background: 'rgba(255, 87, 34, 0.15)', color: 'var(--brand-primary)', marginBottom: '12px' }}>
          Our Vision & Technology
        </div>
        <h1 style={{ fontSize: '2.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', lineHeight: 1.15 }}>
          Engineering the Next Generation of Retail.
        </h1>
        <p style={{ fontSize: '1.0625rem', color: 'var(--text-secondary)', marginTop: '14px', lineHeight: 1.6 }}>
          CloudMart 360 was founded to eliminate stock inaccuracies, checkout latency, and fragmented customer experiences. By pairing curated premium craftsmanship with high-availability cloud architecture, we deliver a seamless, reliable shopping journey.
        </p>
      </div>

      {/* 3 Core Pillars */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        <SpotlightCard
          spotlightColor="rgba(56, 189, 248, 0.16)"
          style={{ padding: '24px', borderRadius: 'var(--radius-xl)', display: 'flex', flexDirection: 'column', gap: '12px' }}
        >
          <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-md)', background: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={22} />
          </div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Real-Time Inventory Accuracy
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Never face unexpected backorders or delayed cancellations. Every product in our storefront reflects live fulfillment center inventory with instant stock reservation upon checkout.
          </p>
        </SpotlightCard>

        <SpotlightCard
          spotlightColor="rgba(16, 185, 129, 0.16)"
          style={{ padding: '24px', borderRadius: 'var(--radius-xl)', display: 'flex', flexDirection: 'column', gap: '12px' }}
        >
          <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={22} />
          </div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Enterprise Security & Reliability
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Protected by 256-bit SSL encryption, automated AWS security controls, and high-availability serverless architecture guaranteeing 99.99% uptime and verified authentication.
          </p>
        </SpotlightCard>

        <SpotlightCard
          spotlightColor="rgba(255, 87, 34, 0.16)"
          style={{ padding: '24px', borderRadius: 'var(--radius-xl)', display: 'flex', flexDirection: 'column', gap: '12px' }}
        >
          <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-md)', background: 'rgba(255, 87, 34, 0.15)', color: 'var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Globe size={22} />
          </div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Sustainable Global Fulfillment
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            We partner with carbon-conscious global couriers and utilize 100% recyclable, plastic-free packaging to ensure mindful delivery to your doorstep.
          </p>
        </SpotlightCard>
      </div>

      {/* Architecture Flow Visual */}
      <div
        className="glass-panel"
        style={{
          padding: '32px',
          borderRadius: 'var(--radius-2xl)',
          background: 'rgba(14, 18, 28, 0.9)',
          border: '1px solid var(--border-medium)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            High-Performance Cloud Architecture
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Delivering instant page responses and reliable multi-region fulfillment.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', textAlign: 'center' }}>
          <div className="glass-panel" style={{ padding: '16px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Frontend Layer</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#38BDF8', marginTop: '4px' }}>React 19 + Vite</div>
          </div>

          <div className="glass-panel" style={{ padding: '16px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>API Layer</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--brand-primary)', marginTop: '4px' }}>AWS API Gateway</div>
          </div>

          <div className="glass-panel" style={{ padding: '16px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Compute Layer</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-warning)', marginTop: '4px' }}>AWS Lambda (Node 20)</div>
          </div>

          <div className="glass-panel" style={{ padding: '16px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Storage Layer</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-success)', marginTop: '4px' }}>Amazon DynamoDB</div>
          </div>
        </div>
      </div>
    </div>
  );
}
