import React, { useState } from 'react';
import { Plus, Minus, Check, RefreshCw, X } from 'lucide-react';

export function InlineStockAdjuster({
  product,
  onAdjustStock,
  onClose
}) {
  const [customDelta, setCustomDelta] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleDelta = async (delta) => {
    setIsUpdating(true);
    try {
      await onAdjustStock(product.id, delta);
      if (onClose) onClose();
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCustomSubmit = async (e) => {
    e.preventDefault();
    const val = parseInt(customDelta, 10);
    if (isNaN(val) || val === 0) return;
    await handleDelta(val);
  };

  return (
    <div
      className="glass-modal"
      onClick={(e) => e.stopPropagation()}
      style={{
        padding: '12px 14px',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-lg)',
        background: 'rgba(14, 18, 28, 0.98)',
        border: '1px solid var(--border-highlight)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        minWidth: '220px',
        maxWidth: 'calc(100vw - 32px)',
        animation: 'scaleUp 120ms ease-out'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
          Quick Stock Adjustment
        </span>
        {onClose && (
          <button
            onClick={onClose}
            style={{ color: 'var(--text-muted)', padding: '2px', display: 'flex' }}
          >
            <X size={13} />
          </button>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0' }}>
        <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Current Stock:</span>
        <span className="font-mono" style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          {product.stock} units
        </span>
      </div>

      {/* Quick Increments / Decrements Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px' }}>
        <button
          onClick={() => handleDelta(-5)}
          disabled={isUpdating || product.stock < 5}
          style={{
            padding: '6px 0',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            color: 'var(--color-danger)',
            fontSize: '0.6875rem',
            fontWeight: 700,
            cursor: 'pointer'
          }}
          title="Subtract 5 units"
        >
          -5
        </button>

        <button
          onClick={() => handleDelta(-1)}
          disabled={isUpdating || product.stock < 1}
          style={{
            padding: '6px 0',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            color: 'var(--color-danger)',
            fontSize: '0.6875rem',
            fontWeight: 700,
            cursor: 'pointer'
          }}
          title="Subtract 1 unit"
        >
          -1
        </button>

        <button
          onClick={() => handleDelta(1)}
          disabled={isUpdating}
          style={{
            padding: '6px 0',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            color: 'var(--color-success)',
            fontSize: '0.6875rem',
            fontWeight: 700,
            cursor: 'pointer'
          }}
          title="Add 1 unit"
        >
          +1
        </button>

        <button
          onClick={() => handleDelta(5)}
          disabled={isUpdating}
          style={{
            padding: '6px 0',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            color: 'var(--color-success)',
            fontSize: '0.6875rem',
            fontWeight: 700,
            cursor: 'pointer'
          }}
          title="Add 5 units"
        >
          +5
        </button>

        <button
          onClick={() => handleDelta(10)}
          disabled={isUpdating}
          style={{
            padding: '6px 0',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(255, 87, 34, 0.12)',
            border: '1px solid rgba(255, 87, 34, 0.3)',
            color: 'var(--brand-primary)',
            fontSize: '0.6875rem',
            fontWeight: 700,
            cursor: 'pointer'
          }}
          title="Restock 10 units"
        >
          +10
        </button>
      </div>

      {/* Custom Delta Input */}
      <form onSubmit={handleCustomSubmit} style={{ display: 'flex', gap: '6px', marginTop: '2px' }}>
        <input
          type="number"
          placeholder="Custom +/- delta"
          value={customDelta}
          onChange={(e) => setCustomDelta(e.target.value)}
          className="glass-input"
          style={{
            flex: 1,
            height: '28px',
            padding: '0 8px',
            fontSize: '0.75rem',
            borderRadius: 'var(--radius-sm)'
          }}
        />
        <button
          type="submit"
          disabled={isUpdating || !customDelta}
          style={{
            padding: '0 8px',
            height: '28px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--brand-primary)',
            color: '#FFFFFF',
            border: 'none',
            fontSize: '0.75rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer'
          }}
        >
          <Check size={13} />
        </button>
      </form>
    </div>
  );
}
