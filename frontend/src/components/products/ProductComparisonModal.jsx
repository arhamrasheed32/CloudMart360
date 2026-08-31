import React from 'react';
import {
  Layers,
  X,
  Check,
  Package,
  ShoppingBag,
  Edit3,
  TrendingUp,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { Modal } from '../ui/Modal.jsx';
import { Button } from '../ui/Button.jsx';
import { Badge } from '../ui/Badge.jsx';
import { formatCurrency } from '../../utils/formatters.js';

export function ProductComparisonModal({
  isOpen,
  onClose,
  products = [],
  onAddToCart,
  onEditProduct
}) {
  if (!isOpen || products.length === 0) return null;

  const compareFields = [
    { label: 'Category', key: 'category' },
    { label: 'Brand', key: 'brand', fallback: 'CloudMart Retail' },
    { label: 'Retail Price', render: (p) => <span className="font-mono" style={{ fontWeight: 800, color: 'var(--brand-primary)' }}>{formatCurrency(p.price)}</span> },
    { label: 'Cost Price', render: (p) => <span className="font-mono" style={{ color: 'var(--text-muted)' }}>{p.costPrice ? formatCurrency(p.costPrice) : 'N/A'}</span> },
    {
      label: 'Gross Margin',
      render: (p) => {
        const margin = p.price > 0 && p.costPrice > 0 ? Math.round(((p.price - p.costPrice) / p.price) * 100) : null;
        return margin !== null ? (
          <span className="font-mono" style={{ color: 'var(--color-success)', fontWeight: 700 }}>
            {margin}%
          </span>
        ) : 'N/A';
      }
    },
    {
      label: 'Inventory Stock',
      render: (p) => (
        <span className="font-mono" style={{ color: p.stock === 0 ? 'var(--color-danger)' : p.stock <= 10 ? 'var(--color-warning)' : 'var(--color-success)', fontWeight: 700 }}>
          {p.stock} units
        </span>
      )
    },
    { label: 'SKU', render: (p) => <span className="font-mono" style={{ fontSize: '0.75rem' }}>{p.sku}</span> },
    { label: 'Status', render: (p) => <Badge variant={p.status === 'active' ? 'success' : 'warning'} size="sm">{p.status}</Badge> },
    { label: 'Description', render: (p) => <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{p.description || 'Standard retail specification'}</span> }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Side-by-Side Product Comparison"
      subtitle={`Comparing ${products.length} products across technical & financial specifications.`}
      maxWidth="880px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="table-container" style={{ maxHeight: '420px', overflowY: 'auto' }}>
          <table className="glass-table" style={{ fontSize: '0.8125rem' }}>
            <thead>
              <tr>
                <th style={{ minWidth: '140px', background: 'rgba(18, 23, 36, 0.95)' }}>Specification</th>
                {products.map((p) => (
                  <th key={p.id} style={{ minWidth: '180px', textAlign: 'center', background: 'rgba(18, 23, 36, 0.95)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <div
                        style={{
                          width: '60px',
                          height: '60px',
                          borderRadius: 'var(--radius-md)',
                          overflow: 'hidden',
                          background: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid var(--border-subtle)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {p.imageUrl ? (
                          <img src={p.imageUrl} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <Package size={24} color="var(--text-muted)" />
                        )}
                      </div>
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {p.name}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {compareFields.map((field) => (
                <tr key={field.label}>
                  <td style={{ fontWeight: 600, color: 'var(--text-muted)', background: 'rgba(255, 255, 255, 0.01)' }}>
                    {field.label}
                  </td>
                  {products.map((p) => (
                    <td key={p.id} style={{ textAlign: 'center' }}>
                      {field.render ? field.render(p) : p[field.key] || field.fallback || '—'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
          <Button variant="primary" size="md" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
}
