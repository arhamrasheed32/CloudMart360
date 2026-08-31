import React, { useState } from 'react';
import {
  Eye,
  Edit3,
  Trash2,
  Package,
  ArrowUp,
  ArrowDown,
  Copy,
  Check,
  Plus,
  Minus,
  CopyPlus,
  ChevronDown,
  ChevronRight,
  Layers
} from 'lucide-react';
import { ProductStatusBadge, Badge } from '../ui/Badge.jsx';
import { Tooltip } from '../ui/Tooltip.jsx';
import { InlineStockAdjuster } from './InlineStockAdjuster.jsx';
import { formatCurrency, formatDate, getStockStatusInfo } from '../../utils/formatters.js';

export function ProductTable({
  products = [],
  selectedIds = [],
  onToggleSelectId,
  onToggleSelectAll,
  sortBy = 'createdAt',
  sortOrder = 'desc',
  onSort,
  onViewProduct,
  onEditProduct,
  onDeleteProduct,
  onDuplicateProduct,
  onAdjustStock
}) {
  const [copiedSku, setCopiedSku] = useState(null);
  const [activeStockAdjustId, setActiveStockAdjustId] = useState(null);
  const [expandedProductIds, setExpandedProductIds] = useState([]);

  const toggleExpandedProduct = (id) => {
    setExpandedProductIds((prev) =>
      prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id]
    );
  };

  const handleSortClick = (field) => {
    if (sortBy === field) {
      onSort(field, sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      onSort(field, 'desc');
    }
  };

  const renderSortIndicator = (field) => {
    if (sortBy !== field) return null;
    return sortOrder === 'asc' ? (
      <ArrowUp size={13} style={{ color: 'var(--brand-primary)' }} />
    ) : (
      <ArrowDown size={13} style={{ color: 'var(--brand-primary)' }} />
    );
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedSku(id);
    setTimeout(() => setCopiedSku(null), 1800);
  };

  const isAllSelected = products.length > 0 && selectedIds.length === products.length;
  const isIndeterminate = selectedIds.length > 0 && selectedIds.length < products.length;

  return (
    <div className="table-container">
      <table className="glass-table" aria-label="Products Catalog Table">
        <thead>
          <tr>
            {/* Selection Checkbox */}
            <th scope="col" style={{ width: '40px', padding: '14px 12px 14px 18px' }}>
              <input
                type="checkbox"
                checked={isAllSelected}
                ref={(input) => {
                  if (input) input.indeterminate = isIndeterminate;
                }}
                onChange={onToggleSelectAll}
                aria-label="Select all products"
                style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: 'var(--radius-xs)',
                  accentColor: 'var(--brand-primary)',
                  cursor: 'pointer'
                }}
              />
            </th>

            <th
              scope="col"
              style={{ cursor: 'pointer', minWidth: '240px' }}
              onClick={() => handleSortClick('name')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>Product</span>
                {renderSortIndicator('name')}
              </div>
            </th>

            <th
              scope="col"
              style={{ cursor: 'pointer', minWidth: '140px' }}
              onClick={() => handleSortClick('category')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>Category</span>
                {renderSortIndicator('category')}
              </div>
            </th>

            <th
              scope="col"
              style={{ cursor: 'pointer', minWidth: '120px' }}
              onClick={() => handleSortClick('price')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>Price</span>
                {renderSortIndicator('price')}
              </div>
            </th>

            <th
              scope="col"
              style={{ cursor: 'pointer', minWidth: '150px' }}
              onClick={() => handleSortClick('stock')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>Stock / Health</span>
                {renderSortIndicator('stock')}
              </div>
            </th>

            <th scope="col" style={{ minWidth: '110px' }}>
              Status
            </th>

            <th
              scope="col"
              style={{ cursor: 'pointer', minWidth: '110px' }}
              onClick={() => handleSortClick('updatedAt')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>Updated</span>
                {renderSortIndicator('updatedAt')}
              </div>
            </th>

            <th scope="col" style={{ textAlign: 'right', minWidth: '130px' }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const isSelected = selectedIds.includes(product.id);
            const isExpanded = expandedProductIds.includes(product.id);
            const stockInfo = getStockStatusInfo(product.stock, product.minStockThreshold);
            const isStockAdjustOpen = activeStockAdjustId === product.id;

            return (
              <React.Fragment key={product.id}>
                <tr
                  style={{
                    background: isSelected ? 'rgba(255, 87, 34, 0.05)' : isExpanded ? 'rgba(255, 255, 255, 0.02)' : undefined,
                    borderBottom: isExpanded ? 'none' : undefined
                  }}
                >
                {/* Row Checkbox */}
                <td style={{ padding: '16px 12px 16px 18px' }}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelectId(product.id)}
                    aria-label={`Select ${product.name}`}
                    style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: 'var(--radius-xs)',
                      accentColor: 'var(--brand-primary)',
                      cursor: 'pointer'
                    }}
                  />
                </td>

                {/* Product Identity Column */}
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    {/* Thumbnail */}
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: 'var(--radius-md)',
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
                        <Package size={18} color="var(--text-muted)" />
                      )}
                    </div>

                    {/* Name & SKU */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
                      <button
                        onClick={() => onViewProduct(product)}
                        style={{
                          color: 'var(--text-primary)',
                          fontWeight: 600,
                          fontSize: '0.875rem',
                          textAlign: 'left',
                          display: 'inline-block',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          maxWidth: '260px',
                          padding: 0
                        }}
                        className="hover-underline"
                        title={product.name}
                      >
                        {product.name}
                      </button>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span
                          className="font-mono"
                          style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', letterSpacing: '0.02em' }}
                        >
                          {product.sku}
                        </span>

                        <Tooltip text={copiedSku === product.id ? 'Copied!' : 'Copy SKU'}>
                          <button
                            onClick={() => copyToClipboard(product.sku, product.id)}
                            style={{
                              color: copiedSku === product.id ? 'var(--color-success)' : 'var(--text-faint)',
                              padding: '2px',
                              display: 'flex',
                              alignItems: 'center'
                            }}
                            aria-label="Copy SKU"
                          >
                            {copiedSku === product.id ? <Check size={11} /> : <Copy size={11} />}
                          </button>
                        </Tooltip>

                        {product.brand && (
                          <span style={{ fontSize: '0.6875rem', color: 'var(--text-faint)' }}>
                            • {product.brand}
                          </span>
                        )}

                        {product.hasVariants && product.variants && product.variants.length > 0 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleExpandedProduct(product.id);
                            }}
                            className="badge"
                            style={{
                              background: isExpanded ? 'rgba(255, 87, 34, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                              color: isExpanded ? 'var(--brand-primary)' : 'var(--text-secondary)',
                              border: isExpanded ? '1px solid rgba(255, 87, 34, 0.4)' : '1px solid var(--border-subtle)',
                              fontSize: '0.625rem',
                              padding: '1px 6px',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '3px',
                              marginLeft: '4px'
                            }}
                            title="Click to view all SKU variants"
                          >
                            {isExpanded ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
                            <span>{product.variants.length} Variants</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Category Column */}
                <td>
                  <Badge variant="category" size="sm">
                    {product.category}
                  </Badge>
                </td>

                {/* Price Column */}
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span
                      className="font-mono"
                      style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)' }}
                    >
                      {formatCurrency(product.price)}
                    </span>
                    {product.costPrice && (
                      <span
                        className="font-mono"
                        style={{ fontSize: '0.6875rem', color: 'var(--text-faint)' }}
                      >
                        Cost: {formatCurrency(product.costPrice)}
                      </span>
                    )}
                  </div>
                </td>

                {/* Stock Level Column + Quick Adjust Popover Trigger */}
                <td style={{ position: 'relative' }}>
                  <div
                    onClick={() => setActiveStockAdjustId(isStockAdjustOpen ? null : product.id)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      width: '120px',
                      cursor: 'pointer',
                      padding: '4px 6px',
                      borderRadius: 'var(--radius-sm)',
                      background: isStockAdjustOpen ? 'rgba(255, 255, 255, 0.06)' : 'transparent',
                      transition: 'background var(--transition-fast)'
                    }}
                    title="Click to quickly adjust stock quantity"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span
                        className="font-mono"
                        style={{
                          fontSize: '0.8125rem',
                          fontWeight: 600,
                          color:
                            product.stock === 0
                              ? 'var(--color-danger)'
                              : product.stock <= (product.minStockThreshold || 10)
                              ? 'var(--color-warning)'
                              : 'var(--text-primary)'
                        }}
                      >
                        {product.stock} units
                      </span>
                      <span style={{ fontSize: '0.6875rem', color: 'var(--brand-primary)', fontWeight: 600 }}>
                        +/-
                      </span>
                    </div>

                    {/* Stock level mini bar */}
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
                          borderRadius: 'var(--radius-full)',
                          transition: 'width var(--transition-normal)'
                        }}
                      />
                    </div>
                  </div>

                  {/* Inline Stock Adjuster Popover */}
                  {isStockAdjustOpen && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '48px',
                        left: '0',
                        zIndex: 'var(--z-dropdown)'
                      }}
                    >
                      <InlineStockAdjuster
                        product={product}
                        onAdjustStock={onAdjustStock}
                        onClose={() => setActiveStockAdjustId(null)}
                      />
                    </div>
                  )}
                </td>

                {/* Status Badge */}
                <td>
                  <ProductStatusBadge
                    status={product.status}
                    stock={product.stock}
                    minStockThreshold={product.minStockThreshold}
                  />
                </td>

                {/* Last Updated */}
                <td>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                    {formatDate(product.updatedAt || product.createdAt)}
                  </span>
                </td>

                {/* Row Actions */}
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Tooltip text="View Details">
                      <button
                        onClick={() => onViewProduct(product)}
                        aria-label={`View details of ${product.name}`}
                        style={{
                          padding: '6px',
                          color: 'var(--text-muted)',
                          borderRadius: 'var(--radius-sm)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid var(--border-subtle)',
                          transition: 'all var(--transition-fast)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = 'var(--text-primary)';
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = 'var(--text-muted)';
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                        }}
                      >
                        <Eye size={15} />
                      </button>
                    </Tooltip>

                    <Tooltip text="Edit Product">
                      <button
                        onClick={() => onEditProduct(product)}
                        aria-label={`Edit ${product.name}`}
                        style={{
                          padding: '6px',
                          color: 'var(--text-muted)',
                          borderRadius: 'var(--radius-sm)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid var(--border-subtle)',
                          transition: 'all var(--transition-fast)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = 'var(--brand-primary)';
                          e.currentTarget.style.background = 'rgba(255, 87, 34, 0.12)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = 'var(--text-muted)';
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                        }}
                      >
                        <Edit3 size={15} />
                      </button>
                    </Tooltip>

                    <Tooltip text="Duplicate Product">
                      <button
                        onClick={() => onDuplicateProduct(product)}
                        aria-label={`Duplicate ${product.name}`}
                        style={{
                          padding: '6px',
                          color: 'var(--text-muted)',
                          borderRadius: 'var(--radius-sm)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid var(--border-subtle)',
                          transition: 'all var(--transition-fast)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = '#38BDF8';
                          e.currentTarget.style.background = 'rgba(56, 189, 248, 0.12)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = 'var(--text-muted)';
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                        }}
                      >
                        <CopyPlus size={15} />
                      </button>
                    </Tooltip>

                    <Tooltip text="Delete Product">
                      <button
                        onClick={() => onDeleteProduct(product)}
                        aria-label={`Delete ${product.name}`}
                        style={{
                          padding: '6px',
                          color: 'var(--text-muted)',
                          borderRadius: 'var(--radius-sm)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid var(--border-subtle)',
                          transition: 'all var(--transition-fast)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = 'var(--color-danger)';
                          e.currentTarget.style.background = 'rgba(239, 68, 68, 0.12)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = 'var(--text-muted)';
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                        }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </Tooltip>
                  </div>
                </td>
              </tr>

              {/* Accordion Expanded Sub-Table for Product Variants */}
              {isExpanded && product.hasVariants && product.variants && (
                <tr style={{ background: 'rgba(8, 12, 20, 0.95)' }}>
                  <td colSpan="8" style={{ padding: '0 18px 16px 54px' }}>
                    <div
                      className="glass-panel"
                      style={{
                        padding: '14px',
                        borderRadius: 'var(--radius-lg)',
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid rgba(255, 87, 34, 0.25)',
                        animation: 'fadeIn 180ms ease-out'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Layers size={15} color="var(--brand-primary)" />
                          <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                            SKU Variant Inventory Matrix ({product.variants.length} Options)
                          </span>
                        </div>
                        <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Combined Parent Stock: <strong>{product.stock} units</strong>
                        </span>
                      </div>

                      <table className="glass-table" style={{ fontSize: '0.75rem' }}>
                        <thead>
                          <tr>
                            <th style={{ background: 'rgba(14, 18, 28, 0.8)' }}>Sub-SKU</th>
                            <th style={{ background: 'rgba(14, 18, 28, 0.8)' }}>Variant Option</th>
                            <th style={{ background: 'rgba(14, 18, 28, 0.8)' }}>Unit Price</th>
                            <th style={{ background: 'rgba(14, 18, 28, 0.8)' }}>Cost Price</th>
                            <th style={{ background: 'rgba(14, 18, 28, 0.8)' }}>Variant Stock</th>
                            <th style={{ background: 'rgba(14, 18, 28, 0.8)' }}>Status</th>
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
                                <span className="font-mono" style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                                  {formatCurrency(v.price)}
                                </span>
                              </td>
                              <td>
                                <span className="font-mono" style={{ color: 'var(--text-muted)' }}>
                                  {v.costPrice ? formatCurrency(v.costPrice) : '—'}
                                </span>
                              </td>
                              <td>
                                <span className="font-mono" style={{ fontWeight: 700, color: v.stock === 0 ? 'var(--color-danger)' : v.stock <= 5 ? 'var(--color-warning)' : 'var(--color-success)' }}>
                                  {v.stock} units
                                </span>
                              </td>
                              <td>
                                <span className="badge" style={{ fontSize: '0.625rem', padding: '1px 6px', background: v.stock > 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', color: v.stock > 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                                  {v.stock > 0 ? 'Available' : 'Backordered'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          );
        })}
      </tbody>
      </table>
    </div>
  );
}
