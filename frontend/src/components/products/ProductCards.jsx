import React from 'react';
import {
  Package,
  Eye,
  Edit3,
  Trash2,
  Tag
} from 'lucide-react';
import { ProductStatusBadge, Badge } from '../ui/Badge.jsx';
import { formatCurrency, formatDate, getStockStatusInfo } from '../../utils/formatters.js';

export function ProductCards({
  products = [],
  onViewProduct,
  onEditProduct,
  onDeleteProduct
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '16px'
      }}
    >
      {products.map((product) => {
        const stockInfo = getStockStatusInfo(product.stock, product.minStockThreshold);
        return (
          <div
            key={product.id}
            className="glass-panel glass-panel-hover"
            style={{
              padding: '18px',
              borderRadius: 'var(--radius-xl)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '14px',
              position: 'relative'
            }}
          >
            {/* Header: Thumbnail, Name, SKU */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: 'var(--radius-lg)',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-subtle)',
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
                  <Package size={22} color="var(--text-muted)" />
                )}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <h3
                  onClick={() => onViewProduct(product)}
                  style={{
                    fontSize: '0.9375rem',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    cursor: 'pointer',
                    marginBottom: '2px'
                  }}
                  title={product.name}
                >
                  {product.name}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className="font-mono" style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                    {product.sku}
                  </span>
                  {product.brand && (
                    <span style={{ fontSize: '0.6875rem', color: 'var(--text-faint)' }}>
                      • {product.brand}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Badges & Pricing */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
              <Badge variant="category" size="sm">
                {product.category}
              </Badge>

              <ProductStatusBadge
                status={product.status}
                stock={product.stock}
                minStockThreshold={product.minStockThreshold}
              />
            </div>

            {/* Price & Stock bar */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.025)',
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span className="font-mono" style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {formatCurrency(product.price)}
                </span>
                <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {product.stock} in stock
                </span>
              </div>

              <div
                style={{
                  width: '100%',
                  height: '4px',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(255, 255, 255, 0.08)',
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{
                    width: `${stockInfo.percent}%`,
                    height: '100%',
                    backgroundColor:
                      stockInfo.type === 'out_of_stock'
                        ? 'var(--color-danger)'
                        : stockInfo.type === 'low_stock'
                        ? 'var(--color-warning)'
                        : 'var(--color-success)',
                    borderRadius: 'var(--radius-full)'
                  }}
                />
              </div>
            </div>

            {/* Card Footer Actions */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '10px',
                borderTop: '1px solid var(--border-subtle)',
                marginTop: 'auto'
              }}
            >
              <span style={{ fontSize: '0.75rem', color: 'var(--text-faint)' }}>
                {formatDate(product.updatedAt || product.createdAt)}
              </span>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  onClick={() => onViewProduct(product)}
                  aria-label="View product"
                  style={{
                    padding: '6px',
                    color: 'var(--text-muted)',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <Eye size={15} />
                </button>
                <button
                  onClick={() => onEditProduct(product)}
                  aria-label="Edit product"
                  style={{
                    padding: '6px',
                    color: 'var(--brand-primary)',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(255, 87, 34, 0.1)',
                    border: '1px solid rgba(255, 87, 34, 0.25)'
                  }}
                >
                  <Edit3 size={15} />
                </button>
                <button
                  onClick={() => onDeleteProduct(product)}
                  aria-label="Delete product"
                  style={{
                    padding: '6px',
                    color: 'var(--color-danger)',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.25)'
                  }}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
