import React, { useState } from 'react';
import { ShoppingBag, ArrowRight, ShieldCheck, Database, Cloud } from 'lucide-react';
import { Button } from '../ui/Button.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { playSuccessChime } from '../../utils/audioFeedback.js';

export function StoreFooter({ onSelectCategory, onSwitchToAdmin }) {
  const [email, setEmail] = useState('');
  const { showSuccess } = useToast();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    playSuccessChime();
    showSuccess('Thank you for subscribing to CloudMart 360 insider perks!', 'Subscribed');
    setEmail('');
  };

  return (
    <footer
      style={{
        borderTop: '1px solid var(--border-default)',
        background: 'rgba(7, 10, 16, 0.95)',
        padding: '54px 28px 32px 28px',
        marginTop: '60px'
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '36px',
          marginBottom: '40px'
        }}
      >
        {/* Col 1: Brand */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <div
              style={{
                width: '30px',
                height: '30px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--brand-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF'
              }}
            >
              <ShoppingBag size={17} strokeWidth={2.4} />
            </div>
            <span style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              CloudMart 360
            </span>
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: '280px' }}>
            Next-generation cloud-native retail management and customer storefront powered by Amazon DynamoDB & AWS Serverless.
          </p>
        </div>

        {/* Col 2: Categories */}
        <div>
          <div style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '14px', letterSpacing: '0.04em' }}>
            Shop Categories
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            {['Electronics', 'Apparel & Fashion', 'Home & Kitchen', 'Health & Beauty', 'Sports & Outdoors'].map((cat) => (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                style={{ textAlign: 'left', color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                className="hover-underline"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Col 3: Architecture & Admin */}
        <div>
          <div style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '14px', letterSpacing: '0.04em' }}>
            Operations & Cloud
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            <button
              onClick={onSwitchToAdmin}
              style={{ textAlign: 'left', color: 'var(--brand-primary)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              ⚙️ Switch to Admin Console (Module 1)
            </button>
            <span>AWS API Gateway (REST Stage: Prod)</span>
            <span>AWS Lambda Node.js Handlers</span>
            <span>Amazon DynamoDB Document Engine</span>
          </div>
        </div>

        {/* Col 4: Newsletter */}
        <div>
          <div style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '14px', letterSpacing: '0.04em' }}>
            Stay Updated
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
            Receive instant alerts on new catalog items and private retail releases.
          </p>
          <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '6px' }}>
            <input
              type="email"
              placeholder="Enter your email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="glass-input"
              style={{ height: '36px', fontSize: '0.8125rem', padding: '0 10px', flex: 1 }}
              required
            />
            <Button variant="primary" size="sm" type="submit" style={{ height: '36px' }}>
              Join
            </Button>
          </form>
        </div>
      </div>

      {/* Copyright Bottom Bar */}
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '0.75rem',
          color: 'var(--text-faint)'
        }}
      >
        <div>© 2026 CloudMart 360 Inc. All rights reserved.</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>Security & Compliance</span>
        </div>
      </div>
    </footer>
  );
}
