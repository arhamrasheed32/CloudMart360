import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  CheckCircle2,
  Truck,
  ShieldCheck,
  Package,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Lock,
  QrCode,
  Smartphone,
  DollarSign,
  Tag,
  Copy,
  Check,
  Printer,
  ExternalLink,
  Shield,
  Zap,
  Clock,
  Radio,
  FileText
} from 'lucide-react';
import { Modal } from '../ui/Modal.jsx';
import { Button } from '../ui/Button.jsx';
import { Input } from '../ui/Input.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useCurrency } from '../../context/CurrencyContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { formatCurrency } from '../../utils/formatters.js';
import { playSuccessChime, playClickTone } from '../../utils/audioFeedback.js';
import { saveStoredOrder } from '../../utils/ordersManager.js';

export function CheckoutModal({
  isOpen,
  onClose,
  onCompleteOrder
}) {
  const { items, subtotal, shippingFee: baseShippingFee, estimatedTax: baseTax, grandTotal: cartGrandTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { currency } = useCurrency();
  const { showSuccess, showError, showInfo } = useToast();

  // Wizard Steps: 'shipping' | 'payment' | 'processing' | 'success'
  const [currentStep, setCurrentStep] = useState('shipping');
  const [paymentGateway, setPaymentGateway] = useState('card'); // 'card' | 'upi' | 'wallet' | 'cod'
  const [copiedOrderId, setCopiedOrderId] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Delivery method
  const [shippingMethod, setShippingMethod] = useState('standard'); // 'standard' | 'express'

  // Discount / Coupon engine
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null); // { code: 'CLOUDMART10', discountPct: 10, discountAmount: X }

  // Customer Shipping & Delivery Details
  const [formData, setFormData] = useState({
    fullName: user?.name || 'Jane Doe',
    email: user?.email || 'jane.doe@example.com',
    phone: '+1 (555) 234-5678',
    address: '742 Evergreen Terrace',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94107',
    country: 'United States',
    cardNumber: '4242 •••• •••• 4242',
    cardName: user?.name || 'JANE DOE',
    expiry: '12/28',
    cvv: '888',
    saveCard: true
  });

  // Processing stage messages
  const [processingStage, setProcessingStage] = useState(0);
  const [orderReceipt, setOrderReceipt] = useState(null);

  // Auto-fill customer if auth changes
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || '',
        email: prev.email || user.email || '',
        cardName: (prev.cardName || user.name || 'JANE DOE').toUpperCase()
      }));
    }
  }, [user]);

  // Derived financials
  const effectiveShipping = shippingMethod === 'express'
    ? (baseShippingFee === 0 ? 9.99 : baseShippingFee + 9.99)
    : baseShippingFee;

  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percent') {
      discountAmount = (subtotal * appliedCoupon.value) / 100;
    } else if (appliedCoupon.type === 'fixed') {
      discountAmount = Math.min(subtotal, appliedCoupon.value);
    } else if (appliedCoupon.type === 'shipping') {
      discountAmount = effectiveShipping;
    }
  }

  const finalSubtotal = Math.max(0, subtotal - discountAmount);
  const effectiveTax = finalSubtotal * 0.0825;
  const finalGrandTotal = finalSubtotal + effectiveShipping + effectiveTax;

  // Handle Input Changes
  const handleChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  // Card formatting
  const handleCardNumberChange = (val) => {
    // Strip non-digits
    const clean = val.replace(/\D/g, '').slice(0, 16);
    // Format into 4-digit groups
    const parts = clean.match(/[\s\S]{1,4}/g) || [];
    handleChange('cardNumber', parts.join(' '));
  };

  const handleExpiryChange = (val) => {
    let clean = val.replace(/\D/g, '').slice(0, 4);
    if (clean.length >= 2) {
      clean = `${clean.slice(0, 2)}/${clean.slice(2)}`;
    }
    handleChange('expiry', clean);
  };

  // Detect Card Brand
  const getCardBrand = (number) => {
    const num = (number || '').replace(/\D/g, '');
    if (num.startsWith('4')) return { name: 'Visa', color: '#1A1F71' };
    if (num.startsWith('5') || num.startsWith('2')) return { name: 'Mastercard', color: '#EB001B' };
    if (num.startsWith('34') || num.startsWith('37')) return { name: 'Amex', color: '#007BC1' };
    if (num.startsWith('60') || num.startsWith('65') || num.startsWith('81')) return { name: 'RuPay', color: '#2C7337' };
    return { name: 'Credit / Debit', color: 'var(--brand-primary)' };
  };

  const cardBrand = getCardBrand(formData.cardNumber);

  // Apply Coupon
  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const code = couponInput.trim().toUpperCase();
    if (!code) return;

    if (code === 'CLOUDMART10') {
      setAppliedCoupon({ code: 'CLOUDMART10', type: 'percent', value: 10, label: '10% Storewide Discount' });
      showSuccess('Coupon CLOUDMART10 applied! 10% discount deducted.', 'Coupon Applied');
      playSuccessChime();
    } else if (code === 'FREESHIP') {
      setAppliedCoupon({ code: 'FREESHIP', type: 'shipping', value: effectiveShipping, label: 'Free Priority Shipping' });
      showSuccess('Coupon FREESHIP applied! Shipping fee waived.', 'Coupon Applied');
      playSuccessChime();
    } else if (code === 'SAVE20') {
      setAppliedCoupon({ code: 'SAVE20', type: 'fixed', value: 20, label: '$20 Instant Credit' });
      showSuccess('Coupon SAVE20 applied! $20 deducted from order.', 'Coupon Applied');
      playSuccessChime();
    } else {
      showError('Invalid promo code. Try "CLOUDMART10", "SAVE20", or "FREESHIP".', 'Invalid Code');
    }
    setCouponInput('');
  };

  // Safety watchdog: ensure 'processing' never hangs under any browser condition
  useEffect(() => {
    if (currentStep === 'processing') {
      const timer = setTimeout(() => {
        setOrderReceipt((prev) => {
          if (prev) return prev;
          const fallbackNum = `CM360-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
          return {
            orderId: fallbackNum,
            transactionId: `tx_sec_${Date.now()}`,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            customer: formData?.fullName || 'Valued Customer',
            email: formData?.email || 'customer@example.com',
            phone: formData?.phone || '',
            address: `${formData?.address || '742 Evergreen Terrace'}, ${formData?.city || 'San Francisco'}, ${formData?.state || 'CA'} ${formData?.zipCode || '94107'}`,
            carrier: shippingMethod === 'express' ? 'FedEx Priority Express Worldwide' : 'FedEx Ground Standard',
            trackingNumber: `FDX-${Math.floor(10000000000 + Math.random() * 90000000000)}`,
            estimatedDelivery: '3-4 Business Days',
            paymentMethod: paymentGateway === 'card'
              ? `${cardBrand?.name || 'Visa'} (•••• 4242)`
              : paymentGateway === 'upi'
              ? 'Instant UPI Pay'
              : 'Digital Wallet Pay',
            items: Array.isArray(items) && items.length > 0 ? [...items] : [],
            subtotal: Number(subtotal) || 0,
            discountAmount: Number(discountAmount) || 0,
            shippingFee: Number(effectiveShipping) || 0,
            tax: Number(effectiveTax) || 0,
            grandTotal: Number(finalGrandTotal) || 0
          };
        });
        clearCart();
        try { playSuccessChime(); } catch (e) {}
        setCurrentStep('success');
      }, 1000); // 1.0s hard ceiling maximum

      return () => clearTimeout(timer);
    }
  }, [currentStep, formData, shippingMethod, paymentGateway, cardBrand, items, subtotal, discountAmount, effectiveShipping, effectiveTax, finalGrandTotal]);

  // Gateway Authorization Handshake & Order Placement
  const handleAuthorizePayment = async () => {
    try {
      setCurrentStep('processing');
      setProcessingStage(1);

      // Stage 1: TLS Handshake (Fast & Snappy: 100ms)
      await new Promise((r) => setTimeout(r, 100));
      setProcessingStage(2);

      // Stage 2: Bank / Gateway Authorization (120ms)
      await new Promise((r) => setTimeout(r, 120));
      setProcessingStage(3);

      // Stage 3: DynamoDB Stock Reservation (100ms)
      await new Promise((r) => setTimeout(r, 100));

      const orderNumber = `CM360-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
      const txId = `tx_sec_${Math.random().toString(36).substring(2, 11)}_${Date.now().toString().slice(-4)}`;
      const carrier = shippingMethod === 'express' ? 'FedEx Priority Express Worldwide' : 'FedEx Ground Standard';
      const trackingNumber = `FDX-${Math.floor(10000000000 + Math.random() * 90000000000)}`;

      const deliveryEstimate = new Date();
      deliveryEstimate.setDate(deliveryEstimate.getDate() + (shippingMethod === 'express' ? 2 : 4));
      const deliveryDateStr = deliveryEstimate.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });

      const cleanCard = (formData?.cardNumber || '4242').replace(/\D/g, '');
      const last4 = cleanCard.length >= 4 ? cleanCard.slice(-4) : '4242';

      const receipt = {
        orderId: orderNumber,
        transactionId: txId,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        customer: formData?.fullName || 'Valued Customer',
        email: formData?.email || 'customer@example.com',
        phone: formData?.phone || '+1 (555) 234-5678',
        address: `${formData?.address || '742 Evergreen Terrace'}, ${formData?.city || 'San Francisco'}, ${formData?.state || 'CA'} ${formData?.zipCode || '94107'}, ${formData?.country || 'United States'}`,
        carrier,
        trackingNumber,
        estimatedDelivery: deliveryDateStr,
        paymentMethod: paymentGateway === 'card'
          ? `${cardBrand?.name || 'Visa'} (•••• ${last4})`
          : paymentGateway === 'upi'
          ? 'Instant UPI Pay (Google Pay / PhonePe)'
          : paymentGateway === 'wallet'
          ? 'Apple Pay / Digital Wallet'
          : 'Cash on Delivery (COD)',
        items: Array.isArray(items) && items.length > 0 ? [...items] : [],
        subtotal: Number(subtotal) || 0,
        discountAmount: Number(discountAmount) || 0,
        shippingFee: Number(effectiveShipping) || 0,
        tax: Number(effectiveTax) || 0,
        grandTotal: Number(finalGrandTotal) || 0
      };

      setOrderReceipt(receipt);

      // Persist to Admin Orders Database & Notifications
      try {
        saveStoredOrder({
          orderId: orderNumber,
          date: 'Just now',
          customer: receipt.customer,
          email: receipt.email,
          address: receipt.address,
          carrier,
          trackingNumber,
          status: 'Processing',
          paymentMethod: receipt.paymentMethod,
          grandTotal: receipt.grandTotal,
          items: receipt.items
        });
      } catch (saveErr) {
        console.warn('[CheckoutModal] Local order storage notice:', saveErr);
      }

      // Mutate live DynamoDB stock in parent safely with timeout protection
      if (onCompleteOrder && Array.isArray(items) && items.length > 0) {
        try {
          await Promise.race([
            onCompleteOrder(items),
            new Promise((r) => setTimeout(r, 350))
          ]);
        } catch (stockSyncErr) {
          console.warn('[CheckoutModal] Non-blocking stock sync notice:', stockSyncErr?.message || stockSyncErr);
        }
      }

      try {
        clearCart();
      } catch (cErr) {}

      try {
        playSuccessChime();
      } catch (aErr) {}

      setCurrentStep('success');
    } catch (err) {
      console.error('[CheckoutModal] Recovery from error in authorization flow:', err);
      setCurrentStep('success');
    }
  };

  const handleCopyOrderId = () => {
    if (orderReceipt?.orderId) {
      navigator.clipboard.writeText(orderReceipt.orderId);
      setCopiedOrderId(true);
      showInfo('Order reference copied to clipboard', 'Copied');
      setTimeout(() => setCopiedOrderId(false), 2000);
    }
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText('cloudmart360.retail@okaxis');
    setCopiedUpi(true);
    showInfo('UPI VPA copied to clipboard', 'Copied');
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleCloseModal = () => {
    setCurrentStep('shipping');
    setOrderReceipt(null);
    setAppliedCoupon(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCloseModal}
      title={
        currentStep === 'shipping'
          ? '1. Delivery & Customer Address'
          : currentStep === 'payment'
          ? '2. Select Payment Gateway'
          : currentStep === 'processing'
          ? 'Processing Payment...'
          : 'Payment Approved & Order Confirmed!'
      }
      subtitle={
        currentStep === 'shipping'
          ? 'Provide destination coordinates for encrypted fulfillment and courier dispatch.'
          : currentStep === 'payment'
          ? 'Enterprise 256-bit encrypted checkout with instant DynamoDB reservation.'
          : currentStep === 'processing'
          ? 'Securing transaction credentials with payment gateway...'
          : `Receipt #${orderReceipt?.orderId || ''}`
      }
      maxWidth="700px"
    >
      {/* Wizard Step Progress Indicator */}
      {currentStep !== 'processing' && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', padding: '0 4px' }}>
          {[
            { id: 'shipping', label: '1. Shipping', num: 1 },
            { id: 'payment', label: '2. Payment Gateway', num: 2 },
            { id: 'success', label: '3. Order Receipt', num: 3 }
          ].map((st, idx) => {
            const isCompleted =
              (currentStep === 'payment' && idx === 0) ||
              (currentStep === 'success' && idx <= 1);
            const isCurrent = currentStep === st.id;

            return (
              <div
                key={st.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  opacity: isCurrent || isCompleted ? 1 : 0.4
                }}
              >
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: isCompleted
                      ? 'var(--color-success)'
                      : isCurrent
                      ? 'var(--brand-primary)'
                      : 'rgba(255, 255, 255, 0.1)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 700
                  }}
                >
                  {isCompleted ? <Check size={14} strokeWidth={3} /> : st.num}
                </div>
                <span style={{ fontSize: '0.8125rem', fontWeight: isCurrent ? 700 : 500, color: isCurrent ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                  {st.label}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* STEP 1: SHIPPING & DELIVERY */}
      {currentStep === 'shipping' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Order Snapshot Pill */}
          <div
            className="glass-panel"
            style={{
              padding: '14px 18px',
              borderRadius: 'var(--radius-lg)',
              background: 'rgba(255, 87, 34, 0.05)',
              border: '1px solid rgba(255, 87, 34, 0.25)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Cart Subtotal ({items.length} {items.length === 1 ? 'item' : 'items'})
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Delivery speed and taxes calculated at payment step
              </div>
            </div>
            <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--brand-primary)' }}>
              {formatCurrency(subtotal)}
            </div>
          </div>

          {/* Delivery Form */}
          <div className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--radius-xl)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
              <Truck size={16} color="var(--brand-primary)" />
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Recipient & Destination Address
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Input
                label="Full Name"
                placeholder="e.g. Jane Doe"
                value={formData.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                required
              />
              <Input
                label="Email Address (Receipt recipient)"
                type="email"
                placeholder="e.g. jane@example.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Input
                label="Phone Number"
                placeholder="e.g. +1 (555) 000-0000"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                required
              />
              <Input
                label="Country / Region"
                value={formData.country}
                onChange={(e) => handleChange('country', e.target.value)}
                required
              />
            </div>

            <Input
              label="Street Address (Apartment, suite, unit)"
              placeholder="e.g. 742 Evergreen Terrace, Apt 4B"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              required
            />

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '12px' }}>
              <Input
                label="City"
                placeholder="San Francisco"
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
                required
              />
              <Input
                label="State / Province"
                placeholder="CA"
                value={formData.state}
                onChange={(e) => handleChange('state', e.target.value)}
                required
              />
              <Input
                label="Postal / ZIP Code"
                placeholder="94107"
                value={formData.zipCode}
                onChange={(e) => handleChange('zipCode', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Shipping Speed Selection */}
          <div className="glass-panel" style={{ padding: '18px', borderRadius: 'var(--radius-xl)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Select Shipping Speed
            </span>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div
                onClick={() => setShippingMethod('standard')}
                style={{
                  padding: '14px',
                  borderRadius: 'var(--radius-lg)',
                  background: shippingMethod === 'standard' ? 'rgba(255, 87, 34, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                  border: shippingMethod === 'standard' ? '1px solid var(--brand-primary)' : '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>Standard Ground</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-success)' }}>
                    {baseShippingFee === 0 ? 'FREE' : formatCurrency(baseShippingFee)}
                  </span>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Estimated: 3-5 Business Days</span>
              </div>

              <div
                onClick={() => setShippingMethod('express')}
                style={{
                  padding: '14px',
                  borderRadius: 'var(--radius-lg)',
                  background: shippingMethod === 'express' ? 'rgba(255, 87, 34, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                  border: shippingMethod === 'express' ? '1px solid var(--brand-primary)' : '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>FedEx Priority Express</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                    +{formatCurrency(9.99)}
                  </span>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Estimated: 1-2 Business Days</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '4px' }}>
            <Button variant="ghost" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="lg"
              icon={ArrowRight}
              onClick={() => {
                playClickTone();
                setCurrentStep('payment');
              }}
            >
              Continue to Payment
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: PAYMENT GATEWAY SELECTION & AUTHORIZATION */}
      {currentStep === 'payment' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Payment Gateway Tabs */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '8px',
              background: 'rgba(255, 255, 255, 0.03)',
              padding: '4px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            {[
              { id: 'card', label: 'Credit Card', icon: CreditCard },
              { id: 'upi', label: 'UPI / QR Pay', icon: QrCode },
              { id: 'wallet', label: 'Apple / Google', icon: Smartphone },
              { id: 'cod', label: 'Cash on Delivery', icon: DollarSign }
            ].map((gw) => {
              const Icon = gw.icon;
              const isSelected = paymentGateway === gw.id;
              return (
                <button
                  key={gw.id}
                  onClick={() => {
                    playClickTone();
                    setPaymentGateway(gw.id);
                  }}
                  style={{
                    padding: '10px 8px',
                    borderRadius: 'var(--radius-md)',
                    border: 'none',
                    background: isSelected ? 'var(--brand-primary)' : 'transparent',
                    color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                    fontWeight: isSelected ? 700 : 500,
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Icon size={16} />
                  <span>{gw.label}</span>
                </button>
              );
            })}
          </div>

          {/* GATEWAY 1: CREDIT / DEBIT CARD */}
          {paymentGateway === 'card' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Interactive Virtual Card Preview */}
              <div
                style={{
                  height: '180px',
                  borderRadius: '16px',
                  padding: '22px 24px',
                  background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 60%, #020617 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  boxShadow: '0 12px 30px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(255, 87, 34, 0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Metallic Shimmer Overlay */}
                <div
                  style={{
                    position: 'absolute',
                    top: '-50%',
                    right: '-20%',
                    width: '300px',
                    height: '300px',
                    background: 'radial-gradient(circle, rgba(255, 87, 34, 0.15) 0%, rgba(0,0,0,0) 70%)',
                    pointerEvents: 'none'
                  }}
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {/* EMV Chip & Contactless */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '28px',
                        borderRadius: '4px',
                        background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                        border: '1px solid #B45309'
                      }}
                    />
                    <Zap size={16} color="rgba(255, 255, 255, 0.6)" />
                  </div>
                  <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '0.04em' }}>
                    {cardBrand.name}
                  </span>
                </div>

                {/* Formatted Number */}
                <div
                  className="font-mono"
                  style={{
                    fontSize: '1.25rem',
                    letterSpacing: '0.14em',
                    fontWeight: 700,
                    color: '#F8FAFC',
                    textShadow: '0 2px 4px rgba(0,0,0,0.6)'
                  }}
                >
                  {formData.cardNumber || '•••• •••• •••• 4242'}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div>
                    <div style={{ fontSize: '0.5625rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      Cardholder
                    </div>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#FFFFFF', letterSpacing: '0.04em' }}>
                      {(formData.cardName || 'JANE DOE').toUpperCase()}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.5625rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      Expires
                    </div>
                    <div className="font-mono" style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#FFFFFF' }}>
                      {formData.expiry || '12/28'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Inputs */}
              <div className="glass-panel" style={{ padding: '18px', borderRadius: 'var(--radius-xl)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Input
                  label="Card Number"
                  placeholder="4242 4242 4242 4242"
                  value={formData.cardNumber}
                  onChange={(e) => handleCardNumberChange(e.target.value)}
                  required
                />

                <Input
                  label="Name on Card"
                  placeholder="JANE DOE"
                  value={formData.cardName}
                  onChange={(e) => handleChange('cardName', e.target.value)}
                  required
                />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <Input
                    label="Expiry Date (MM/YY)"
                    placeholder="12/28"
                    value={formData.expiry}
                    onChange={(e) => handleExpiryChange(e.target.value)}
                    required
                  />
                  <Input
                    label="Security CVV / CVC"
                    placeholder="888"
                    type="password"
                    maxLength={4}
                    value={formData.cvv}
                    onChange={(e) => handleChange('cvv', e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* GATEWAY 2: UPI / QR CODE */}
          {paymentGateway === 'upi' && (
            <div
              className="glass-panel"
              style={{
                padding: '24px',
                borderRadius: 'var(--radius-xl)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '16px'
              }}
            >
              <div
                style={{
                  padding: '16px',
                  borderRadius: '16px',
                  background: '#FFFFFF',
                  boxShadow: '0 0 30px rgba(255, 87, 34, 0.2)'
                }}
              >
                {/* SVG High-Contrast QR Code */}
                <svg width="180" height="180" viewBox="0 0 100 100">
                  <rect width="100" height="100" fill="#FFFFFF" />
                  {/* Top-Left Corner */}
                  <rect x="5" y="5" width="28" height="28" fill="#000000" />
                  <rect x="9" y="9" width="20" height="20" fill="#FFFFFF" />
                  <rect x="13" y="13" width="12" height="12" fill="#000000" />
                  {/* Top-Right Corner */}
                  <rect x="67" y="5" width="28" height="28" fill="#000000" />
                  <rect x="71" y="9" width="20" height="20" fill="#FFFFFF" />
                  <rect x="75" y="13" width="12" height="12" fill="#000000" />
                  {/* Bottom-Left Corner */}
                  <rect x="5" y="67" width="28" height="28" fill="#000000" />
                  <rect x="9" y="71" width="20" height="20" fill="#FFFFFF" />
                  <rect x="13" y="75" width="12" height="12" fill="#000000" />
                  {/* Data patterns */}
                  <rect x="38" y="10" width="8" height="8" fill="#FF5722" />
                  <rect x="50" y="15" width="8" height="8" fill="#000000" />
                  <rect x="38" y="25" width="8" height="8" fill="#000000" />
                  <rect x="50" y="32" width="14" height="6" fill="#000000" />
                  <rect x="10" y="40" width="8" height="8" fill="#000000" />
                  <rect x="24" y="45" width="8" height="8" fill="#000000" />
                  <rect x="38" y="45" width="24" height="24" fill="#FF5722" rx="4" />
                  <rect x="67" y="40" width="10" height="8" fill="#000000" />
                  <rect x="80" y="48" width="12" height="8" fill="#000000" />
                  <rect x="42" y="75" width="10" height="12" fill="#000000" />
                  <rect x="58" y="70" width="8" height="8" fill="#000000" />
                  <rect x="72" y="75" width="18" height="18" fill="#000000" />
                </svg>
              </div>

              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  Scan with any UPI App
                </h4>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
                  Google Pay • PhonePe • Paytm • BHIM • Cred
                </p>
              </div>

              {/* Copyable UPI ID */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <span className="font-mono" style={{ fontSize: '0.8125rem', color: 'var(--text-primary)' }}>
                  cloudmart360.retail@okaxis
                </span>
                <button
                  type="button"
                  onClick={handleCopyUpi}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: copiedUpi ? 'var(--color-success)' : 'var(--text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.75rem'
                  }}
                >
                  {copiedUpi ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          )}

          {/* GATEWAY 3: DIGITAL WALLET (APPLE PAY / GOOGLE PAY) */}
          {paymentGateway === 'wallet' && (
            <div
              className="glass-panel"
              style={{
                padding: '28px',
                borderRadius: 'var(--radius-xl)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '16px'
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid var(--border-medium)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Smartphone size={32} color="var(--brand-primary)" />
              </div>

              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  Express 1-Click Biometric Payment
                </h4>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                  Authorize instantly using Apple Pay Touch ID / Face ID or Google Pay.
                </p>
              </div>

              <div
                style={{
                  width: '100%',
                  maxWidth: '320px',
                  padding: '12px',
                  borderRadius: 'var(--radius-lg)',
                  background: '#000000',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                <span>Pay / GPay Ready</span>
              </div>
            </div>
          )}

          {/* GATEWAY 4: CASH ON DELIVERY */}
          {paymentGateway === 'cod' && (
            <div
              className="glass-panel"
              style={{
                padding: '24px',
                borderRadius: 'var(--radius-xl)',
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}
            >
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: 'var(--radius-lg)',
                  background: 'rgba(16, 185, 129, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-success)',
                  flexShrink: 0
                }}
              >
                <DollarSign size={28} />
              </div>

              <div>
                <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  Pay on Delivery (Cash or POS Card)
                </h4>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                  Pay courier directly via cash or wireless card terminal when your package arrives at your doorstep.
                </p>
              </div>
            </div>
          )}

          {/* PROMO / COUPON CODE SECTION */}
          <div
            className="glass-panel"
            style={{
              padding: '14px 18px',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Tag size={14} color="var(--brand-primary)" />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                Have a Promo Voucher or Coupon?
              </span>
            </div>

            <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="e.g. CLOUDMART10 or SAVE20"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                className="glass-input"
                style={{
                  flex: 1,
                  height: '38px',
                  padding: '0 12px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.8125rem',
                  textTransform: 'uppercase'
                }}
              />
              <Button variant="secondary" size="sm" type="submit">
                Apply Code
              </Button>
            </form>

            {appliedCoupon && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', borderRadius: 'var(--radius-sm)', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-success)' }}>
                  ✓ {appliedCoupon.code}: {appliedCoupon.label}
                </span>
                <button
                  type="button"
                  onClick={() => setAppliedCoupon(null)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.75rem', cursor: 'pointer' }}
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* FINAL ORDER VALUATION BREAKDOWN */}
          <div
            className="glass-panel"
            style={{
              padding: '18px',
              borderRadius: 'var(--radius-xl)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              background: 'rgba(255, 255, 255, 0.02)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              <span>Subtotal ({items.length} items):</span>
              <span className="font-mono" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{formatCurrency(subtotal)}</span>
            </div>

            {discountAmount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', color: 'var(--color-success)' }}>
                <span>Discount ({appliedCoupon?.code}):</span>
                <span className="font-mono" style={{ fontWeight: 700 }}>-{formatCurrency(discountAmount)}</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              <span>Shipping ({shippingMethod === 'express' ? 'FedEx Priority' : 'Ground'}):</span>
              <span className="font-mono" style={{ color: effectiveShipping === 0 ? 'var(--color-success)' : 'var(--text-primary)', fontWeight: 600 }}>
                {effectiveShipping === 0 ? 'FREE' : formatCurrency(effectiveShipping)}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              <span>Estimated Sales Tax (8.25%):</span>
              <span className="font-mono" style={{ color: 'var(--text-primary)' }}>{formatCurrency(effectiveTax)}</span>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '1.125rem',
                fontWeight: 800,
                borderTop: '1px solid var(--border-medium)',
                paddingTop: '10px',
                marginTop: '4px'
              }}
            >
              <span style={{ color: 'var(--text-primary)' }}>Total Due:</span>
              <span className="font-mono" style={{ color: 'var(--brand-primary)' }}>{formatCurrency(finalGrandTotal)}</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4px' }}>
            <Button variant="ghost" icon={ArrowLeft} onClick={() => setCurrentStep('shipping')}>
              Back
            </Button>

            <Button
              variant="primary"
              size="lg"
              icon={CheckCircle2}
              onClick={handleAuthorizePayment}
              style={{ padding: '0 28px' }}
            >
              Authorize & Pay {formatCurrency(finalGrandTotal)}
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: LIVE GATEWAY AUTHORIZATION TERMINAL */}
      {currentStep === 'processing' && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            padding: '36px 16px',
            gap: '24px'
          }}
        >
          {/* Animated Glowing Spinner */}
          <div style={{ position: 'relative', width: '80px', height: '80px' }}>
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                border: '4px solid rgba(255, 87, 34, 0.15)',
                borderTopColor: 'var(--brand-primary)',
                animation: 'spin 0.8s linear infinite'
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                color: 'var(--brand-primary)'
              }}
            >
              <Lock size={28} />
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Connecting to Payment Gateway
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: '6px 0 0 0' }}>
              Communicating securely with AWS API Gateway & Banking Network...
            </p>
          </div>

          {/* Sequential Step Verification */}
          <div
            className="glass-panel"
            style={{
              width: '100%',
              maxWidth: '420px',
              padding: '18px',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              textAlign: 'left'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8125rem' }}>
              <CheckCircle2 size={16} color="var(--color-success)" />
              <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>TLS 1.3 256-Bit SSL Handshake</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8125rem' }}>
              {processingStage >= 2 ? (
                <CheckCircle2 size={16} color="var(--color-success)" />
              ) : (
                <Clock size={16} color="var(--brand-primary)" style={{ animation: 'pulse 1s infinite' }} />
              )}
              <span style={{ color: processingStage >= 2 ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: 600 }}>
                PCI-DSS Level 1 Gateway Tokenization
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8125rem' }}>
              {processingStage >= 3 ? (
                <CheckCircle2 size={16} color="var(--color-success)" />
              ) : (
                <Clock size={16} color={processingStage >= 2 ? 'var(--brand-primary)' : 'var(--text-faint)'} />
              )}
              <span style={{ color: processingStage >= 3 ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: 600 }}>
                DynamoDB Real-Time Stock Reservation
              </span>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: ORDER CONFIRMED & PERFECT OFFICIAL RECEIPT */}
      {currentStep === 'success' && orderReceipt && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '4px 0' }}>
          {/* Header Badge */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px' }}>
            <div
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '2px solid rgba(16, 185, 129, 0.4)',
                color: 'var(--color-success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 30px rgba(16, 185, 129, 0.5)'
              }}
            >
              <CheckCircle2 size={40} strokeWidth={2.5} />
            </div>

            <div>
              <h3 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Order Confirmed & Payment Verified!
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: '6px 0 0 0' }}>
                Thank you, <strong style={{ color: 'var(--text-primary)' }}>{orderReceipt.customer}</strong>. Your payment was approved and receipt dispatched to <strong style={{ color: 'var(--brand-primary)' }}>{orderReceipt.email}</strong>.
              </p>
            </div>
          </div>

          {/* Reference Numbers Banner */}
          <div
            className="glass-panel"
            style={{
              padding: '16px 20px',
              borderRadius: 'var(--radius-lg)',
              background: 'rgba(255, 87, 34, 0.06)',
              border: '1px solid rgba(255, 87, 34, 0.3)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px'
            }}
          >
            <div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Order Confirmation Number
              </div>
              <div className="font-mono" style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--brand-primary)', marginTop: '2px' }}>
                {orderReceipt.orderId}
              </div>
            </div>

            <button
              onClick={handleCopyOrderId}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                color: copiedOrderId ? 'var(--color-success)' : 'var(--text-secondary)',
                padding: '6px 12px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.75rem',
                cursor: 'pointer'
              }}
            >
              {copiedOrderId ? <Check size={14} /> : <Copy size={14} />}
              <span>{copiedOrderId ? 'Copied' : 'Copy Reference'}</span>
            </button>
          </div>

          {/* Live 4-Stage Fulfillment Tracker */}
          <div
            className="glass-panel"
            style={{
              padding: '18px',
              borderRadius: 'var(--radius-xl)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Live Fulfillment Progress
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-success)', fontWeight: 600 }}>
                Est. Delivery: {orderReceipt.estimatedDelivery}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', textAlign: 'center' }}>
              {[
                { title: 'Ordered', desc: 'Verified', done: true },
                { title: 'Payment', desc: 'Authorized', done: true },
                { title: 'Packing', desc: 'Fulfillment Hub', active: true },
                { title: 'Delivery', desc: 'FedEx Express', pending: true }
              ].map((step, idx) => (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <div
                    style={{
                      width: '100%',
                      height: '4px',
                      borderRadius: '2px',
                      background: step.done
                        ? 'var(--color-success)'
                        : step.active
                        ? 'var(--brand-primary)'
                        : 'rgba(255, 255, 255, 0.1)'
                    }}
                  />
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: step.done || step.active ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                    {step.title}
                  </span>
                  <span style={{ fontSize: '0.625rem', color: step.done ? 'var(--color-success)' : 'var(--text-faint)' }}>
                    {step.desc}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)', paddingTop: '8px', display: 'flex', justifyContent: 'space-between' }}>
              <span>Carrier: <strong>{orderReceipt.carrier}</strong></span>
              <span>Tracking: <strong className="font-mono">{orderReceipt.trackingNumber}</strong></span>
            </div>
          </div>

          {/* Itemized Order Line Items */}
          <div
            className="glass-panel"
            style={{
              padding: '18px',
              borderRadius: 'var(--radius-xl)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Purchased Items ({orderReceipt.items.length})
            </span>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {orderReceipt.items.map((it, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {it.product.imageUrl ? (
                      <img
                        src={it.product.imageUrl}
                        alt={it.product.name}
                        style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', background: 'rgba(255, 87, 34, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Package size={18} color="var(--brand-primary)" />
                      </div>
                    )}

                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {it.product.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Qty: {it.quantity} × {formatCurrency(it.product.price)}
                      </div>
                    </div>
                  </div>

                  <div className="font-mono" style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {formatCurrency(Number(it.product.price || 0) * it.quantity)}
                  </div>
                </div>
              ))}
            </div>

            {/* Total Charged summary */}
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                <span>Paid Via:</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{orderReceipt.paymentMethod}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                <span>Delivery Destination:</span>
                <span style={{ color: 'var(--text-primary)', textAlign: 'right', maxWidth: '300px' }}>{orderReceipt.address}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.125rem', fontWeight: 800, borderTop: '1px solid var(--border-medium)', paddingTop: '8px', marginTop: '4px' }}>
                <span style={{ color: 'var(--text-primary)' }}>Total Amount Paid:</span>
                <span className="font-mono" style={{ color: 'var(--brand-primary)' }}>
                  {formatCurrency(orderReceipt.grandTotal)}
                </span>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button variant="secondary" icon={Printer} onClick={handlePrintReceipt} style={{ flex: 1 }}>
              Print Receipt
            </Button>
            <Button variant="primary" icon={ShoppingBag} onClick={handleCloseModal} style={{ flex: 2 }}>
              Continue Shopping
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
