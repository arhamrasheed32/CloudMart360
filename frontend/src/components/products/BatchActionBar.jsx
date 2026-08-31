import React from 'react';
import {
  CheckSquare,
  X,
  CheckCircle2,
  FileText,
  Archive,
  Trash2,
  Download,
  Layers,
  Loader2
} from 'lucide-react';
import { Button } from '../ui/Button.jsx';

export function BatchActionBar({
  selectedCount = 0,
  onClearSelection,
  onBatchStatusChange,
  onBatchDelete,
  onExportSelected,
  onCompareSelected,
  isProcessing = false
}) {
  if (selectedCount === 0) return null;

  return (
    <div
      className="glass-modal"
      style={{
        position: 'fixed',
        bottom: '28px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 'var(--z-modal)',
        padding: '10px 18px',
        borderRadius: 'var(--radius-full)',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        boxShadow: '0 20px 48px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(255, 87, 34, 0.35)',
        background: 'rgba(14, 18, 28, 0.96)',
        backdropFilter: 'blur(20px)',
        animation: 'scaleUp 160ms ease-out',
        flexWrap: 'wrap',
        maxWidth: '94vw'
      }}
    >
      {/* Selection Count Tag */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div
          style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: 'var(--brand-primary)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.75rem',
            fontWeight: 800
          }}
        >
          {selectedCount}
        </div>
        <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
          Selected
        </span>
      </div>

      <div style={{ width: '1px', height: '20px', background: 'var(--border-medium)' }} />

      {/* Compare button if >= 2 items */}
      {selectedCount >= 2 && onCompareSelected && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onCompareSelected}
          icon={Layers}
          style={{
            height: '32px',
            padding: '0 10px',
            fontSize: '0.75rem',
            borderColor: 'rgba(56, 189, 248, 0.4)',
            color: '#38BDF8'
          }}
        >
          Compare ({selectedCount})
        </Button>
      )}

      {/* Batch Status Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onBatchStatusChange('active')}
          disabled={isProcessing}
          icon={CheckCircle2}
          style={{ height: '32px', padding: '0 10px', fontSize: '0.75rem' }}
        >
          Set Active
        </Button>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => onBatchStatusChange('draft')}
          disabled={isProcessing}
          icon={FileText}
          style={{ height: '32px', padding: '0 10px', fontSize: '0.75rem' }}
        >
          Set Draft
        </Button>
      </div>

      <div style={{ width: '1px', height: '20px', background: 'var(--border-medium)' }} />

      {/* Export & Delete */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Button
          variant="secondary"
          size="sm"
          onClick={onExportSelected}
          disabled={isProcessing}
          icon={Download}
          style={{ height: '32px', padding: '0 10px', fontSize: '0.75rem' }}
        >
          Export CSV
        </Button>

        <Button
          variant="danger"
          size="sm"
          onClick={onBatchDelete}
          disabled={isProcessing}
          icon={Trash2}
          style={{ height: '32px', padding: '0 10px', fontSize: '0.75rem' }}
        >
          Delete ({selectedCount})
        </Button>
      </div>

      {/* Clear Button */}
      <button
        onClick={onClearSelection}
        aria-label="Clear selection"
        style={{
          color: 'var(--text-muted)',
          padding: '4px',
          borderRadius: 'var(--radius-full)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid var(--border-subtle)',
          transition: 'all var(--transition-fast)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = 'var(--text-primary)';
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = 'var(--text-muted)';
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
        }}
      >
        <X size={15} />
      </button>
    </div>
  );
}
