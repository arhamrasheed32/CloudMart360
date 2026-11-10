import React, { useState } from 'react';
import {
  CreditCard,
  CheckCircle2,
  Truck,
  ShieldCheck,
  Package,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Lock
} from 'lucide-react';
import { Modal } from '../ui/Modal.jsx';
import { Button } from '../ui/Button.jsx';
import { Input } from '../ui/Input.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { useCurrency } from '../../context/CurrencyContext.jsx';
import { formatCurrency } from '../../utils/formatters.js';
import { playSuccessChime } from '../../utils/audioFeedback.js';

export function CheckoutModal({
  isOpen,
  onClose,
  onCompleteOrder
}) {
  const { items, subtotal, shippingFee, estimatedTax, grandTotal, clearCart } = useCart();
  const { currency } = useCurrency();

  const [step, setStep] = useState('form'); // 'form' | 'success'
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderReceipt, setOrderReceipt] = useState(null);

  const [shippingData, setShippingData] = useState({
    fullName: 'Jane Doe',
    email: 'jane.doe@example.com',
    address: '742 Evergreen Terrace',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94107',
    cardNumber: '•••• •••• •••• 4242',
    expiry: '12/28',
    cvv: '888'
  });

  const handleChange = (field, val) => {
    setShippingData((prev) => ({ ...prev, [field]: val }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Simulate AWS Serverless order processing latency
      await new Promise((r) => setTimeout(r, 900));

      const orderNumber = `CM360-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
      const receipt = {
        orderNumber,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        items: [...items],
        grandTotal,
        customer: shippingData.fullName,
        address: `${shippingData.address}, ${shippingData.city}, ${shippingData.state}`
      };

      setOrderReceipt(receipt);

      // Call parent mutation to decrement real stock in DynamoDB
      if (onCompleteOrder) {
        await onCompleteOrder(items);
      }

      clearCart();
      playSuccessChime();
      setStep('success');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setStep('form');
    setOrderReceipt(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={step === 'form' ? 'Express Checkout' : 'Order Confirmed!'}
      subtitle={
        step === 'form'
          ? 'Secure 256-bit encrypted checkout powered by AWS Serverless.'
          : `Receipt #${orderReceipt?.orderNumber || ''}`
      }
      maxWidth="620px"
    >
      {step === 'form' ? (
        <form onSubmit={handlePlaceOrder} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Order Summary Pill */}
          <div
            className="glass-panel"
            style={{
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 255, 255, 0.02)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Total Order Amount ({items.length} unique items)
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Includes {shippingFee === 0 ? 'Free Shipping' : `${formatCurrency(shippingFee)} Shipping`} & Taxes
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--brand-primary)' }}>
                {formatCurrency(grandTotal)}
              </div>
              {currency !== 'USD' && (
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Base amount: ${grandTotal.toFixed(2)} USD
                </div>
              )}
            </div>
          </div>

          {/* Shipping Information */}
          <div className="glass-panel" style={{ padding: '16px', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Truck size={16} color="var(--brand-primary)" />
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase' }}>
                Delivery Address
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <Input
                label="Full Name"
                value={shippingData.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                required
              />
              <Input
                label="Email"
                type="email"
                value={shippingData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
              />
            </div>

            <Input
              label="Street Address"
              value={shippingData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              required
            />

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '10px' }}>
              <Input
                label="City"
                value={shippingData.city}
                onChange={(e) => handleChange('city', e.target.value)}
                required
              />
              <Input
                label="State"
                value={shippingData.state}
                onChange={(e) => handleChange('state', e.target.value)}
                required
              />
              <Input
                label="ZIP Code"
                value={shippingData.zipCode}
                onChange={(e) => handleChange('zipCode', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="glass-panel" style={{ padding: '16px', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CreditCard size={16} color="var(--color-success)" />
                <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase' }}>
                  Payment Method
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.6875rem', color: 'var(--color-success)' }}>
                <Lock size={12} />
                <span>SSL Encrypted</span>
              </div>
            </div>

            <Input
              label="Card Number"
              value={shippingData.cardNumber}
              onChange={(e) => handleChange('cardNumber', e.target.value)}
              required
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <Input
                label="Expiry Date"
                value={shippingData.expiry}
                onChange={(e) => handleChange('expiry', e.target.value)}
                required
              />
              <Input
                label="CVV"
                value={shippingData.cvv}
                onChange={(e) => handleChange('cvv', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Place Order CTA */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '6px' }}>
            <Button variant="ghost" type="button" onClick={handleClose} disabled={isProcessing}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="lg"
              type="submit"
              isLoading={isProcessing}
              icon={CheckCircle2}
              style={{ padding: '0 24px' }}
            >
              Authorize & Pay {formatCurrency(grandTotal)}
            </Button>
          </div>
        </form>
      ) : (
        /* Step 2: Order Confirmed Screen */
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '18px', padding: '12px 0' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.15)',
              color: 'var(--color-success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 24px rgba(16, 185, 129, 0.4)'
            }}
          >
            <CheckCircle2 size={36} strokeWidth={2.5} />
          </div>

          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Thank you for your order!
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Your order <strong style={{ color: 'var(--brand-primary)' }}>{orderReceipt?.orderNumber}</strong> has been successfully processed in Amazon DynamoDB.
            </p>
          </div>

          {/* Receipt Breakdown Card */}
          <div
            className="glass-panel"
            style={{
              width: '100%',
              padding: '18px',
              borderRadius: 'var(--radius-lg)',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              background: 'rgba(255, 255, 255, 0.02)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Estimated Delivery:</span>
              <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>2-3 Business Days (Express)</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Shipping To:</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{orderReceipt?.address}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', fontWeight: 700, borderTop: '1px solid var(--border-subtle)', paddingTop: '8px' }}>
              <span style={{ color: 'var(--text-primary)' }}>Total Charged:</span>
              <span className="font-mono" style={{ color: 'var(--brand-primary)' }}>
                {formatCurrency(orderReceipt?.grandTotal || 0)}
              </span>
            </div>
          </div>

          <Button variant="primary" size="md" onClick={handleClose} style={{ width: '100%' }}>
            Continue Shopping
          </Button>
        </div>
      )}
    </Modal>
  );
}
