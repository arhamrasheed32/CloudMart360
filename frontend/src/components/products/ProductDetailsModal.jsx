import React, { useState } from 'react';
import {
  Package,
  Calendar,
  Layers,
  DollarSign,
  Tag,
  ShieldCheck,
  Edit3,
  Trash2,
  Copy,
  Check,
  Code,
  CopyPlus,
  TrendingUp,
  Barcode as BarcodeIcon,
  History,
  Activity
} from 'lucide-react';
import { Modal } from '../ui/Modal.jsx';
import { Button } from '../ui/Button.jsx';
import { ProductStatusBadge, Badge } from '../ui/Badge.jsx';
import { ProductBarcode } from './ProductBarcode.jsx';
import { formatCurrency, formatDateTime, getStockStatusInfo } from '../../utils/formatters.js';

export function ProductDetailsModal({
  isOpen,
  onClose,
  product,
  onEdit,
  onDelete,
  onDuplicate
}) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'economics' | 'barcode' | 'history' | 'json'
  const [copiedKey, setCopiedKey] = useState(null);

  if (!product) return null;

  const copyText = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const stockInfo = getStockStatusInfo(product.stock, product.minStockThreshold);
  const totalItemValuation = Number(product.price || 0) * Number(product.stock || 0);
  const totalCostValuation = Number(product.costPrice || 0) * Number(product.stock || 0);
  const profitMarginPercent =
    product.price > 0 && product.costPrice > 0
      ? Math.round(((Number(product.price) - Number(product.costPrice)) / Number(product.price)) * 100)
      : null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={product.name}
      subtitle={`SKU: ${product.sku || 'N/A'} • CloudMart 360 Catalog Item`}
      maxWidth="700px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '4px',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '4px',
            flexWrap: 'wrap'
          }}
        >
          <button
            onClick={() => setActiveTab('overview')}
            style={{
              padding: '6px 12px',
              fontSize: '0.8125rem',
              fontWeight: 600,
              borderRadius: 'var(--radius-sm)',
              color: activeTab === 'overview' ? 'var(--brand-primary)' : 'var(--text-muted)',
              background: activeTab === 'overview' ? 'rgba(255, 87, 34, 0.12)' : 'transparent',
              border: activeTab === 'overview' ? '1px solid rgba(255, 87, 34, 0.25)' : '1px solid transparent',
              transition: 'all var(--transition-fast)'
            }}
          >
            Overview
          </button>

          <button
            onClick={() => setActiveTab('economics')}
            style={{
              padding: '6px 12px',
              fontSize: '0.8125rem',
              fontWeight: 600,
              borderRadius: 'var(--radius-sm)',
              color: activeTab === 'economics' ? 'var(--brand-primary)' : 'var(--text-muted)',
              background: activeTab === 'economics' ? 'rgba(255, 87, 34, 0.12)' : 'transparent',
              border: activeTab === 'economics' ? '1px solid rgba(255, 87, 34, 0.25)' : '1px solid transparent',
              transition: 'all var(--transition-fast)'
            }}
          >
            Economics & Margins
          </button>

          {product.hasVariants && product.variants && product.variants.length > 0 && (
            <button
              onClick={() => setActiveTab('variants')}
              style={{
                padding: '6px 12px',
                fontSize: '0.8125rem',
                fontWeight: 600,
                borderRadius: 'var(--radius-sm)',
                color: activeTab === 'variants' ? 'var(--brand-primary)' : 'var(--text-muted)',
                background: activeTab === 'variants' ? 'rgba(255, 87, 34, 0.12)' : 'transparent',
                border: activeTab === 'variants' ? '1px solid rgba(255, 87, 34, 0.25)' : '1px solid transparent',
                transition: 'all var(--transition-fast)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Layers size={13} />
              <span>Variants ({product.variants.length})</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('barcode')}
            style={{
              padding: '6px 12px',
              fontSize: '0.8125rem',
              fontWeight: 600,
              borderRadius: 'var(--radius-sm)',
              color: activeTab === 'barcode' ? 'var(--brand-primary)' : 'var(--text-muted)',
              background: activeTab === 'barcode' ? 'rgba(255, 87, 34, 0.12)' : 'transparent',
              border: activeTab === 'barcode' ? '1px solid rgba(255, 87, 34, 0.25)' : '1px solid transparent',
              transition: 'all var(--transition-fast)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <BarcodeIcon size={13} />
            <span>Barcode & Label</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            style={{
              padding: '6px 12px',
              fontSize: '0.8125rem',
              fontWeight: 600,
              borderRadius: 'var(--radius-sm)',
              color: activeTab === 'history' ? 'var(--brand-primary)' : 'var(--text-muted)',
              background: activeTab === 'history' ? 'rgba(255, 87, 34, 0.12)' : 'transparent',
              border: activeTab === 'history' ? '1px solid rgba(255, 87, 34, 0.25)' : '1px solid transparent',
              transition: 'all var(--transition-fast)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <History size={13} />
            <span>Audit Trail</span>
          </button>

          <button
            onClick={() => setActiveTab('json')}
            style={{
              padding: '6px 12px',
              fontSize: '0.8125rem',
              fontWeight: 600,
              borderRadius: 'var(--radius-sm)',
              color: activeTab === 'json' ? 'var(--brand-primary)' : 'var(--text-muted)',
              background: activeTab === 'json' ? 'rgba(255, 87, 34, 0.12)' : 'transparent',
              border: activeTab === 'json' ? '1px solid rgba(255, 87, 34, 0.25)' : '1px solid transparent',
              transition: 'all var(--transition-fast)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Code size={13} />
            <span>JSON</span>
          </button>
        </div>

        {/* Tab 1: Overview & Specs */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap' }}>
              {/* Image */}
              <div
                style={{
                  width: '140px',
                  height: '140px',
                  borderRadius: 'var(--radius-lg)',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-medium)',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <Package size={48} color="var(--text-muted)" />
                )}
              </div>

              {/* Quick Metrics Grid */}
              <div style={{ flex: 1, minWidth: '220px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="glass-panel" style={{ padding: '12px', borderRadius: 'var(--radius-md)', background: 'rgba(255, 255, 255, 0.03)' }}>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Selling Price
                  </div>
                  <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
                    {formatCurrency(product.price)}
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: '12px', borderRadius: 'var(--radius-md)', background: 'rgba(255, 255, 255, 0.03)' }}>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Stock Available
                  </div>
                  <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 700, color: product.stock === 0 ? 'var(--color-danger)' : 'var(--color-success)', marginTop: '2px' }}>
                    {product.stock} units
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: '12px', borderRadius: 'var(--radius-md)', background: 'rgba(255, 255, 255, 0.03)' }}>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Inventory Value
                  </div>
                  <div className="font-mono" style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {formatCurrency(totalItemValuation)}
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: '12px', borderRadius: 'var(--radius-md)', background: 'rgba(255, 255, 255, 0.03)' }}>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Catalog Status
                  </div>
                  <div style={{ marginTop: '4px' }}>
                    <ProductStatusBadge status={product.status} stock={product.stock} minStockThreshold={product.minStockThreshold} />
                  </div>
                </div>
              </div>
            </div>

            {/* Tags if present */}
            {product.tags && product.tags.length > 0 && (
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {product.tags.map((t) => (
                  <span key={t} className="badge" style={{ background: 'rgba(255, 255, 255, 0.06)', color: 'var(--text-secondary)', textTransform: 'none' }}>
                    #{t}
                  </span>
                ))}
              </div>
            )}

            {/* Description */}
            {product.description && (
              <div className="glass-panel" style={{ padding: '16px', borderRadius: 'var(--radius-lg)', background: 'rgba(255, 255, 255, 0.02)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Description & Specs
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {product.description}
                </p>
              </div>
            )}

            {/* Metadata Table */}
            <div className="glass-panel" style={{ padding: '16px', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Category</span>
                <Badge variant="category" size="sm">{product.category}</Badge>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Brand / Vendor</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{product.brand || 'CloudMart Retail'}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)' }}>SKU</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className="font-mono" style={{ color: 'var(--text-primary)' }}>{product.sku}</span>
                  <button onClick={() => copyText(product.sku, 'sku')} style={{ color: copiedKey === 'sku' ? 'var(--color-success)' : 'var(--text-muted)' }}>
                    {copiedKey === 'sku' ? <Check size={13} /> : <Copy size={13} />}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)' }}>DynamoDB Record ID</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className="font-mono" style={{ fontSize: '0.6875rem', color: 'var(--text-faint)' }}>{product.id}</span>
                  <button onClick={() => copyText(product.id, 'id')} style={{ color: copiedKey === 'id' ? 'var(--color-success)' : 'var(--text-muted)' }}>
                    {copiedKey === 'id' ? <Check size={13} /> : <Copy size={13} />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Economics & Margins */}
        {activeTab === 'economics' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              <div className="glass-panel" style={{ padding: '14px', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Unit Selling Price
                </div>
                <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
                  {formatCurrency(product.price)}
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '14px', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Unit Cost Price
                </div>
                <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {product.costPrice ? formatCurrency(product.costPrice) : 'N/A'}
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '14px', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Gross Profit Margin
                </div>
                <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-success)', marginTop: '2px' }}>
                  {profitMarginPercent !== null ? `${profitMarginPercent}%` : 'N/A'}
                </div>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '16px', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Estimated Retail Revenue (Full Stock)</span>
                <span className="font-mono" style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{formatCurrency(totalItemValuation)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Total Cost Investment</span>
                <span className="font-mono" style={{ color: 'var(--text-secondary)' }}>{formatCurrency(totalCostValuation)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Projected Gross Profit</span>
                <span className="font-mono" style={{ color: 'var(--color-success)', fontWeight: 700 }}>
                  {formatCurrency(totalItemValuation - totalCostValuation)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Variants & Options */}
        {activeTab === 'variants' && product.hasVariants && product.variants && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="glass-panel" style={{ padding: '16px', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                  Configured Product Options
                </div>
                <span className="badge" style={{ background: 'rgba(255, 87, 34, 0.15)', color: 'var(--brand-primary)' }}>
                  {product.variants.length} Sub-SKU Variations
                </span>
              </div>

              {product.options && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {product.options.map((opt, i) => (
                    <div key={i} style={{ padding: '8px 12px', borderRadius: 'var(--radius-sm)', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)', fontSize: '0.75rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>{opt.name}: </span>
                      <strong style={{ color: 'var(--text-primary)' }}>{opt.values?.join(', ')}</strong>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="table-container" style={{ maxHeight: '280px', overflowY: 'auto' }}>
              <table className="glass-table" style={{ fontSize: '0.75rem' }}>
                <thead>
                  <tr>
                    <th>Sub-SKU</th>
                    <th>Variant</th>
                    <th>Price</th>
                    <th>Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {product.variants.map((v) => (
                    <tr key={v.id}>
                      <td>
                        <span className="font-mono" style={{ fontWeight: 700, color: 'var(--brand-primary)' }}>
                          {v.sku}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        {v.title}
                      </td>
                      <td>
                        <span className="font-mono" style={{ fontWeight: 700 }}>
                          {formatCurrency(v.price)}
                        </span>
                      </td>
                      <td>
                        <span className="font-mono" style={{ fontWeight: 700, color: v.stock === 0 ? 'var(--color-danger)' : v.stock <= 5 ? 'var(--color-warning)' : 'var(--color-success)' }}>
                          {v.stock} units
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Barcode & Print Label */}
        {activeTab === 'barcode' && (
          <ProductBarcode product={product} />
        )}

        {/* Tab 4: Audit History */}
        {activeTab === 'history' && (
          <div className="glass-panel" style={{ padding: '18px', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Amazon DynamoDB Transaction Log
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', position: 'relative', paddingLeft: '16px' }}>
              <div style={{ position: 'absolute', left: '4px', top: '6px', bottom: '6px', width: '2px', background: 'var(--border-medium)' }} />

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-success)', marginTop: '5px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Last Attribute Update
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {formatDateTime(product.updatedAt || product.createdAt)} by Administrator (Role: StoreManager)
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--brand-primary)', marginTop: '5px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Initial DynamoDB Record Created
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {formatDateTime(product.createdAt)} via API Gateway Proxy Integration
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Raw JSON */}
        {activeTab === 'json' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                DynamoDB Item Document Schema
              </span>
              <button
                onClick={() => copyText(JSON.stringify(product, null, 2), 'raw-json')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.75rem',
                  color: copiedKey === 'raw-json' ? 'var(--color-success)' : 'var(--brand-primary)',
                  padding: '4px 8px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(255, 87, 34, 0.1)'
                }}
              >
                {copiedKey === 'raw-json' ? <Check size={13} /> : <Copy size={13} />}
                <span>{copiedKey === 'raw-json' ? 'Copied!' : 'Copy JSON'}</span>
              </button>
            </div>

            <pre
              className="font-mono"
              style={{
                background: '#07090E',
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.75rem',
                color: '#A5B4FC',
                maxHeight: '260px',
                overflowY: 'auto',
                border: '1px solid var(--border-subtle)'
              }}
            >
              {JSON.stringify(product, null, 2)}
            </pre>
          </div>
        )}

        {/* Modal Footer Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              onClose();
              onDelete(product);
            }}
            icon={Trash2}
          >
            Delete
          </Button>

          <div style={{ display: 'flex', gap: '8px' }}>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                onClose();
                onDuplicate(product);
              }}
              icon={CopyPlus}
            >
              Duplicate
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                onClose();
                onEdit(product);
              }}
              icon={Edit3}
            >
              Edit Product
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
