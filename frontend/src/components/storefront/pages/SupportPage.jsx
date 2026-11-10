import React, { useState } from 'react';
import {
  HelpCircle,
  Truck,
  Package,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Search,
  Send,
  ShieldCheck,
  RotateCcw,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { Button } from '../../ui/Button.jsx';
import { Input } from '../../ui/Input.jsx';
import { Textarea } from '../../ui/Textarea.jsx';
import { SpotlightCard } from '../../ui/SpotlightCard.jsx';
import { useToast } from '../../../context/ToastContext.jsx';
import { playSuccessChime } from '../../../utils/audioFeedback.js';

const FAQS = [
  {
    q: 'How fast is CloudMart 360 express delivery?',
    a: 'All orders placed before 3:00 PM EST are processed on the same day through our automated AWS serverless fulfillment system. Domestic express delivery arrives in 1-3 business days, and international orders arrive in 3-5 business days.'
  },
  {
    q: 'What is your 30-Day return and replacement policy?',
    a: 'We offer a 100% satisfaction guarantee. If your product does not meet expectations, return it within 30 days in original packaging for an immediate refund or replacement. Return shipping labels are pre-paid and generated automatically.'
  },
  {
    q: 'How is inventory verified in real time?',
    a: 'Unlike traditional retail platforms with batch inventory delays, CloudMart 360 utilizes real-time catalog synchronization. Stock reserves instantaneously upon checkout, completely preventing backorders or overselling.'
  },
  {
    q: 'Do products include official manufacturer warranty?',
    a: 'Yes. All hardware, electronics, and lifestyle items sold on CloudMart 360 include an official 2-year manufacturer warranty covering manufacturing defects, materials, and workmanship.'
  }
];

export function SupportPage() {
  const { showSuccess } = useToast();
  const [orderQuery, setOrderQuery] = useState('');
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // Contact form
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSending, setIsSending] = useState(false);

  const handleTrackOrder = (e) => {
    e.preventDefault();
    if (!orderQuery.trim()) return;

    // Generate realistic simulated order tracking
    setTrackedOrder({
      orderId: orderQuery.toUpperCase().startsWith('CM360') ? orderQuery.toUpperCase() : `CM360-${orderQuery.toUpperCase()}`,
      carrier: 'FedEx Express Worldwide',
      trackingNumber: 'FDX-99201948210',
      status: 'Out for Delivery',
      currentCity: 'San Francisco, CA Distribution Center',
      estimatedDelivery: 'Tomorrow, by 4:00 PM',
      steps: [
        { title: 'Order Confirmed & Payment Verified', time: 'Aug 30, 10:14 AM', done: true },
        { title: 'Fulfillment & Quality Inspection', time: 'Aug 30, 02:30 PM', done: true },
        { title: 'Departed Regional Distribution Hub', time: 'Aug 31, 01:15 AM', done: true },
        { title: 'Out for Delivery with Courier', time: 'Aug 31, 07:45 AM', active: true }
      ]
    });
    playSuccessChime();
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    await new Promise((r) => setTimeout(r, 600));
    playSuccessChime();
    showSuccess(`Your support ticket (TKT-${Math.floor(1000 + Math.random() * 9000)}) has been logged!`, 'Ticket Submitted');
    setContactForm({ name: '', email: '', subject: '', message: '' });
    setIsSending(false);
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 28px', display: 'flex', flexDirection: 'column', gap: '50px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
        <div className="badge" style={{ background: 'rgba(255, 87, 34, 0.15)', color: 'var(--brand-primary)', marginBottom: '12px' }}>
          Customer Support & Help Desk
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
          How Can We Help You?
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
          Track real-time orders, browse frequently asked questions, or speak directly with our retail support specialists.
        </p>
      </div>

      {/* Live Order Tracker Section */}
      <SpotlightCard
        spotlightColor="rgba(255, 87, 34, 0.18)"
        style={{
          padding: '32px',
          borderRadius: 'var(--radius-2xl)',
          border: '1px solid var(--border-medium)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Truck size={22} color="var(--brand-primary)" />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Live Cloud Order Tracking
          </h2>
        </div>

        <form onSubmit={handleTrackOrder} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Enter your Order ID (e.g. CM360-ORD-892140)..."
              value={orderQuery}
              onChange={(e) => setOrderQuery(e.target.value)}
              className="glass-input font-mono"
              style={{ width: '100%', height: '42px', padding: '0 12px 0 38px', fontSize: '0.875rem' }}
            />
          </div>
          <Button variant="primary" size="md" type="submit" style={{ height: '42px', padding: '0 20px' }}>
            Track Package
          </Button>
        </form>

        {/* Demo Quick Button */}
        {!trackedOrder && (
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Try sample order:</span>
            <button
              type="button"
              onClick={() => {
                setOrderQuery('CM360-ORD-892140');
                setTrackedOrder({
                  orderId: 'CM360-ORD-892140',
                  carrier: 'FedEx Express Worldwide',
                  trackingNumber: 'FDX-99201948210',
                  status: 'Out for Delivery',
                  currentCity: 'San Francisco, CA Distribution Center',
                  estimatedDelivery: 'Tomorrow, by 4:00 PM',
                  steps: [
                    { title: 'Order Confirmed & Payment Verified', time: 'Aug 30, 10:14 AM', done: true },
                    { title: 'Fulfillment & Quality Inspection', time: 'Aug 30, 02:30 PM', done: true },
                    { title: 'Departed Regional Distribution Hub', time: 'Aug 31, 01:15 AM', done: true },
                    { title: 'Out for Delivery with Courier', time: 'Aug 31, 07:45 AM', active: true }
                  ]
                });
              }}
              style={{ color: 'var(--brand-primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, textDecoration: 'underline' }}
            >
              CM360-ORD-892140
            </button>
          </div>
        )}

        {/* Tracking Results Card */}
        {trackedOrder && (
          <div
            className="glass-panel"
            style={{
              padding: '24px',
              borderRadius: 'var(--radius-xl)',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-medium)',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
              animation: 'scaleUp 150ms ease-out'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--color-success)', marginBottom: '4px' }}>
                  {trackedOrder.status}
                </span>
                <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {trackedOrder.orderId}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Carrier: {trackedOrder.carrier} ({trackedOrder.trackingNumber})
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Estimated Delivery
                </div>
                <div className="font-mono" style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--brand-primary)' }}>
                  {trackedOrder.estimatedDelivery}
                </div>
              </div>
            </div>

            {/* Milestones Flow */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', position: 'relative', paddingLeft: '20px', marginTop: '6px' }}>
              <div style={{ position: 'absolute', left: '6px', top: '8px', bottom: '8px', width: '2px', background: 'var(--border-medium)' }} />

              {trackedOrder.steps.map((step, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: step.done ? 'var(--color-success)' : step.active ? 'var(--brand-primary)' : 'var(--text-faint)',
                      boxShadow: step.active ? '0 0 10px var(--brand-primary)' : 'none',
                      marginTop: '3px',
                      flexShrink: 0
                    }}
                  />
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: step.active ? 700 : 500, color: step.active ? 'var(--brand-primary)' : 'var(--text-primary)' }}>
                      {step.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {step.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </SpotlightCard>

      {/* Grid: FAQ Accordion + Contact Support Ticket Form */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
        {/* FAQs */}
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '16px' }}>
            Frequently Asked Questions
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="glass-panel"
                  style={{
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                    border: isOpen ? '1px solid var(--brand-primary)' : '1px solid var(--border-subtle)'
                  }}
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    style={{
                      width: '100%',
                      padding: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      textAlign: 'left',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-primary)',
                      fontSize: '0.9375rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp size={16} color="var(--brand-primary)" /> : <ChevronDown size={16} color="var(--text-muted)" />}
                  </button>

                  {isOpen && (
                    <div style={{ padding: '0 16px 16px 16px', fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact Form */}
        <div
          className="glass-panel"
          style={{
            padding: '24px',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-medium)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={18} color="var(--brand-primary)" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Open a Support Ticket
            </h2>
          </div>

          <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Input
              label="Full Name"
              placeholder="e.g. David Miller"
              value={contactForm.name}
              onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
              required
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="david@example.com"
              value={contactForm.email}
              onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
              required
            />

            <Input
              label="Subject / Order ID"
              placeholder="e.g. Question regarding CM360-ORD-892140"
              value={contactForm.subject}
              onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
              required
            />

            <Textarea
              label="Message"
              placeholder="Describe your inquiry in detail..."
              value={contactForm.message}
              onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
              rows={3}
              required
            />

            <Button
              variant="primary"
              size="md"
              type="submit"
              isLoading={isSending}
              icon={Send}
              style={{ marginTop: '4px' }}
            >
              Submit Ticket
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
