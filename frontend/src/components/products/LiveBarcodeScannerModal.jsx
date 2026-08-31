import React, { useState } from 'react';
import {
  Camera,
  Barcode,
  Search,
  CheckCircle2,
  AlertCircle,
  Package,
  Plus,
  Eye,
  Zap,
  Sparkles
} from 'lucide-react';
import { Modal } from '../ui/Modal.jsx';
import { Button } from '../ui/Button.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { playSuccessChime } from '../../utils/audioFeedback.js';
import { formatCurrency } from '../../utils/formatters.js';

export function LiveBarcodeScannerModal({
  isOpen,
  onClose,
  products = [],
  onAdjustStock,
  onViewProduct
}) {
  const { showSuccess } = useToast();
  const [scanCode, setScanCode] = useState('');
  const [matchedProduct, setMatchedProduct] = useState(null);
  const [isScanning, setIsScanning] = useState(true);

  if (!isOpen) return null;

  const handleLookup = (codeToLookup) => {
    const term = (codeToLookup || scanCode).trim().toUpperCase();
    if (!term) return;

    const match = products.find(
      (p) =>
        (p.sku && p.sku.toUpperCase() === term) ||
        (p.id && p.id.toUpperCase() === term) ||
        (p.variants && p.variants.some((v) => v.sku && v.sku.toUpperCase() === term))
    );

    if (match) {
      setMatchedProduct(match);
      playSuccessChime();
    } else {
      setMatchedProduct(null);
    }
  };

  const handleQuickRestock = async () => {
    if (!matchedProduct) return;
    await onAdjustStock(matchedProduct.id, 1);
    playSuccessChime();
    showSuccess(`Added +1 stock unit to ${matchedProduct.name} in DynamoDB!`, 'Quick Restock Completed');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Live Retail Barcode & QR Scanner"
      subtitle="Point physical barcode at camera or enter scanned SKU to look up DynamoDB inventory."
      maxWidth="620px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Simulated Camera Viewfinder */}
        <div
          style={{
            width: '100%',
            height: '220px',
            borderRadius: 'var(--radius-xl)',
            background: 'radial-gradient(circle at 50% 50%, rgba(255, 87, 34, 0.15) 0%, #05070A 100%)',
            border: '1px solid rgba(255, 87, 34, 0.4)',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'inset 0 0 30px rgba(0,0,0,0.8)'
          }}
        >
          {/* Laser Scanning Line */}
          <div
            style={{
              position: 'absolute',
              left: '10%',
              right: '10%',
              height: '2px',
              background: 'linear-gradient(90deg, transparent 0%, #FF5722 50%, transparent 100%)',
              boxShadow: '0 0 12px #FF5722',
              animation: 'shimmer 2s infinite ease-in-out',
              top: '50%'
            }}
          />

          {/* Center Target Box */}
          <div
            style={{
              width: '180px',
              height: '100px',
              border: '2px dashed rgba(255, 255, 255, 0.4)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Camera size={24} color="var(--brand-primary)" />
            <span style={{ fontSize: '0.6875rem', color: '#FFFFFF', fontWeight: 600 }}>
              Align Barcode in Reticle
            </span>
          </div>

          <div style={{ position: 'absolute', bottom: '10px', right: '12px', fontSize: '0.6875rem', color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span className="pulse-status" style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }} />
            <span>Optical Sensor Active</span>
          </div>
        </div>

        {/* Scan Input & Lookup */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLookup();
          }}
          style={{ display: 'flex', gap: '8px' }}
        >
          <input
            type="text"
            placeholder="Scan / Type SKU (e.g. CM-ELE-AUR-9021)..."
            value={scanCode}
            onChange={(e) => setScanCode(e.target.value)}
            className="glass-input font-mono"
            style={{ flex: 1, height: '40px', padding: '0 12px', fontSize: '0.875rem' }}
            autoFocus
          />
          <Button variant="primary" size="md" type="submit" icon={Search} style={{ height: '40px' }}>
            Scan
          </Button>
        </form>

        {/* Quick Sample Chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <span>Quick scan demo:</span>
          {products.slice(0, 3).map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                setScanCode(p.sku);
                handleLookup(p.sku);
              }}
              style={{ color: 'var(--brand-primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, textDecoration: 'underline' }}
            >
              {p.sku}
            </button>
          ))}
        </div>

        {/* Matched Product Record Card */}
        {matchedProduct ? (
          <div
            className="glass-panel"
            style={{
              padding: '18px',
              borderRadius: 'var(--radius-xl)',
              background: 'rgba(16, 185, 129, 0.06)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              animation: 'fadeIn 180ms ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={18} color="var(--color-success)" />
                <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-success)' }}>
                  Product Found in DynamoDB
                </span>
              </div>
              <span className="font-mono" style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--brand-primary)' }}>
                {matchedProduct.sku}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'rgba(0,0,0,0.3)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {matchedProduct.imageUrl ? (
                  <img src={matchedProduct.imageUrl} alt={matchedProduct.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <Package size={24} color="var(--text-muted)" />
                )}
              </div>

              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  {matchedProduct.name}
                </h4>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {matchedProduct.category} • {formatCurrency(matchedProduct.price)} • Current Stock: <strong style={{ color: 'var(--text-primary)' }}>{matchedProduct.stock} units</strong>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'flex', gap: '10px', paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <Button
                variant="primary"
                size="sm"
                onClick={handleQuickRestock}
                icon={Plus}
                style={{ flex: 1, justifyContent: 'center' }}
              >
                +1 Quick Restock Unit
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  onClose();
                  onViewProduct(matchedProduct);
                }}
                icon={Eye}
                style={{ flex: 1, justifyContent: 'center' }}
              >
                Open Full Specifications
              </Button>
            </div>
          </div>
        ) : scanCode && (
          <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.25)', color: 'var(--color-danger)', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={16} />
            <span>No matching product SKU found in active Amazon DynamoDB table for "{scanCode}".</span>
          </div>
        )}
      </div>
    </Modal>
  );
}
