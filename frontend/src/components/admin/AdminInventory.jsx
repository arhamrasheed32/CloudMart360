import React, { useState } from 'react';
import {
  Boxes,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Plus,
  Minus,
  Search,
  RefreshCw,
  Package,
  Layers,
  ArrowUpDown,
  TrendingDown
} from 'lucide-react';
import { Button } from '../ui/Button.jsx';
import { SpotlightCard } from '../ui/SpotlightCard.jsx';
import { formatCurrency, formatNumber } from '../../utils/formatters.js';

export function AdminInventory({
  products = [],
  onAdjustStock,
  onOpenRestock,
  onAddProduct
}) {
  const [filter, setFilter] = useState('all'); // 'all' | 'low' | 'out' | 'in'
  const [search, setSearch] = useState('');

  // Metrics
  const totalUnits = products.reduce((acc, p) => acc + Number(p.stock || 0), 0);
  const lowStockItems = products.filter((p) => Number(p.stock) > 0 && Number(p.stock) <= (p.minStockThreshold || 10));
  const outOfStockItems = products.filter((p) => Number(p.stock) === 0);
  const healthyStockItems = products.filter((p) => Number(p.stock) > (p.minStockThreshold || 10));

  const totalWholesaleValue = products.reduce((acc, p) => acc + (Number(p.costPrice || 0) * Number(p.stock || 0)), 0);

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      search.trim() === '' ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(search.toLowerCase())) ||
      (p.category && p.category.toLowerCase().includes(search.toLowerCase()));

    if (!matchesSearch) return false;

    if (filter === 'low') return Number(p.stock) > 0 && Number(p.stock) <= (p.minStockThreshold || 10);
    if (filter === 'out') return Number(p.stock) === 0;
    if (filter === 'in') return Number(p.stock) > (p.minStockThreshold || 10);
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div
        className="glass-panel"
        style={{
          padding: '24px',
          borderRadius: 'var(--radius-xl)',
          background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.08) 0%, rgba(10, 14, 22, 0.95) 100%)',
          border: '1px solid var(--border-medium)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="pulse-status" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#38BDF8' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38BDF8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Stock Management
            </span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>
            Inventory & Warehouse Stock Control
          </h1>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '4px', margin: 0 }}>
            Real-time atomic stock adjustment synchronized directly with Amazon DynamoDB.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Button variant="primary" size="sm" onClick={onOpenRestock} icon={Boxes}>
            Bulk Restock Utility
          </Button>
          <Button variant="secondary" size="sm" onClick={onAddProduct} icon={Plus}>
            Add SKU
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <SpotlightCard
          spotlightColor="rgba(56, 189, 248, 0.15)"
          style={{ padding: '18px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-default)', display: 'flex', flexDirection: 'column', gap: '6px' }}
        >
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Available Units</span>
          <div className="font-mono" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {formatNumber(totalUnits)}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Wholesale Cost: {formatCurrency(totalWholesaleValue)}</span>
        </SpotlightCard>

        <SpotlightCard
          spotlightColor="rgba(16, 185, 129, 0.15)"
          style={{ padding: '18px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-default)', display: 'flex', flexDirection: 'column', gap: '6px' }}
        >
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Healthy Stock</span>
          <div className="font-mono" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-success)' }}>
            {healthyStockItems.length} SKUs
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-success)' }}>Above Safety Threshold</span>
        </SpotlightCard>

        <SpotlightCard
          spotlightColor="rgba(245, 158, 11, 0.15)"
          style={{ padding: '18px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-default)', display: 'flex', flexDirection: 'column', gap: '6px' }}
        >
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Low Stock Warnings</span>
          <div className="font-mono" style={{ fontSize: '1.75rem', fontWeight: 800, color: '#F59E0B' }}>
            {lowStockItems.length} SKUs
          </div>
          <span style={{ fontSize: '0.75rem', color: '#F59E0B' }}>Action Required</span>
        </SpotlightCard>

        <SpotlightCard
          spotlightColor="rgba(239, 68, 68, 0.15)"
          style={{ padding: '18px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-default)', display: 'flex', flexDirection: 'column', gap: '6px' }}
        >
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Sold Out SKUs</span>
          <div className="font-mono" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-danger)' }}>
            {outOfStockItems.length} SKUs
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-danger)' }}>Critical Depletion</span>
        </SpotlightCard>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="glass-panel"
        style={{
          padding: '14px 20px',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {[
            { id: 'all', label: `All Items (${products.length})` },
            { id: 'in', label: `In Stock (${healthyStockItems.length})` },
            { id: 'low', label: `Low Stock (${lowStockItems.length})` },
            { id: 'out', label: `Sold Out (${outOfStockItems.length})` }
          ].map((f) => {
            const isActive = filter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                  background: isActive ? 'var(--brand-primary)' : 'rgba(255, 255, 255, 0.04)',
                  border: isActive ? '1px solid var(--brand-primary)' : '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        <div style={{ position: 'relative', width: '260px' }}>
          <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search SKU or product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="glass-input"
            style={{ width: '100%', height: '34px', padding: '0 10px 0 32px', fontSize: '0.8125rem' }}
          />
        </div>
      </div>

      {/* Inventory Table */}
      <div className="glass-panel" style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255, 255, 255, 0.02)', borderBottom: '1px solid var(--border-default)', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              <th style={{ padding: '14px 20px' }}>Product & SKU</th>
              <th style={{ padding: '14px 16px' }}>Category</th>
              <th style={{ padding: '14px 16px' }}>Unit Price / Cost</th>
              <th style={{ padding: '14px 16px' }}>Current Stock</th>
              <th style={{ padding: '14px 16px' }}>Min Threshold</th>
              <th style={{ padding: '14px 16px' }}>Stock Health</th>
              <th style={{ padding: '14px 20px', textAlign: 'right' }}>Quick Adjust</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p) => {
              const stock = Number(p.stock || 0);
              const minThreshold = Number(p.minStockThreshold || 10);
              const isOut = stock === 0;
              const isLow = stock > 0 && stock <= minThreshold;

              return (
                <tr
                  key={p.id}
                  style={{
                    borderBottom: '1px solid var(--border-subtle)',
                    transition: 'background var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  {/* Product */}
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: 'var(--radius-md)',
                          overflow: 'hidden',
                          background: 'rgba(255, 255, 255, 0.04)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      >
                        {p.imageUrl ? (
                          <img src={p.imageUrl} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <Package size={18} color="var(--text-muted)" />
                        )}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {p.name}
                        </div>
                        <div className="font-mono" style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          SKU: {p.sku || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td style={{ padding: '14px 16px', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                    {p.category}
                  </td>

                  {/* Pricing */}
                  <td style={{ padding: '14px 16px' }}>
                    <div className="font-mono" style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {formatCurrency(p.price)}
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                      Cost: {formatCurrency(p.costPrice || p.price * 0.45)}
                    </div>
                  </td>

                  {/* Stock */}
                  <td style={{ padding: '14px 16px' }}>
                    <div className="font-mono" style={{ fontSize: '1.125rem', fontWeight: 800, color: isOut ? 'var(--color-danger)' : isLow ? '#F59E0B' : 'var(--text-primary)' }}>
                      {stock}
                    </div>
                  </td>

                  {/* Threshold */}
                  <td style={{ padding: '14px 16px', fontSize: '0.8125rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                    {minThreshold} units
                  </td>

                  {/* Health Badge */}
                  <td style={{ padding: '14px 16px' }}>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '3px 10px',
                        borderRadius: 'var(--radius-full)',
                        background: isOut ? 'rgba(239, 68, 68, 0.15)' : isLow ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                        color: isOut ? 'var(--color-danger)' : isLow ? '#F59E0B' : 'var(--color-success)'
                      }}
                    >
                      {isOut ? 'Depleted' : isLow ? 'Low Stock' : 'Optimal'}
                    </span>
                  </td>

                  {/* Quick Adjust Buttons */}
                  <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <button
                        onClick={() => onAdjustStock(p.id, -1)}
                        disabled={stock <= 0}
                        style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: 'var(--radius-sm)',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid var(--border-medium)',
                          color: 'var(--text-secondary)',
                          cursor: stock <= 0 ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        title="Decrement 1 unit"
                      >
                        <Minus size={13} />
                      </button>

                      <button
                        onClick={() => onAdjustStock(p.id, 1)}
                        style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: 'var(--radius-sm)',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid var(--border-medium)',
                          color: 'var(--text-secondary)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        title="Increment 1 unit"
                      >
                        <Plus size={13} />
                      </button>

                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onAdjustStock(p.id, 10)}
                        style={{ height: '26px', padding: '0 8px', fontSize: '0.6875rem' }}
                      >
                        +10
                      </Button>

                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => onAdjustStock(p.id, 25)}
                        style={{ height: '26px', padding: '0 8px', fontSize: '0.6875rem' }}
                      >
                        +25
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
