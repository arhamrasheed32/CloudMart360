import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { Modal } from '../ui/Modal.jsx';
import { Button } from '../ui/Button.jsx';

export function DeleteProductDialog({
  isOpen,
  onClose,
  onConfirm,
  product,
  isDeleting = false
}) {
  if (!product) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Product"
      maxWidth="460px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {/* Danger Alert Icon & Notice */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '14px',
            padding: '14px 16px',
            background: 'var(--color-danger-bg)',
            border: '1px solid var(--color-danger-border)',
            borderRadius: 'var(--radius-lg)'
          }}
        >
          <AlertTriangle size={22} color="var(--color-danger)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-danger)' }}>
              Permanent Deletion Warning
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.4 }}>
              This action cannot be undone. The product record will be immediately removed from the Amazon DynamoDB table.
            </div>
          </div>
        </div>

        {/* Product Details Snippet */}
        <div
          className="glass-panel"
          style={{
            padding: '14px 16px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255, 255, 255, 0.02)'
          }}
        >
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Product to be removed:
          </div>
          <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)', marginTop: '2px' }}>
            {product.name}
          </div>
          <div className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            SKU: {product.sku || 'N/A'} • ID: {product.id}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
          <Button variant="ghost" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => onConfirm(product.id)}
            isLoading={isDeleting}
            icon={Trash2}
          >
            Delete Permanently
          </Button>
        </div>
      </div>
    </Modal>
  );
}
