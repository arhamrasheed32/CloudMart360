import React from 'react';
import {
  LayoutDashboard,
  Package,
  Boxes,
  ShoppingCart,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Database,
  Cloud,
  Shield,
  Zap,
  Plus,
  RefreshCw,
  Truck
} from 'lucide-react';
import { Button } from '../ui/Button.jsx';
import { SpotlightCard } from '../ui/SpotlightCard.jsx';
import { formatCurrency, formatNumber } from '../../utils/formatters.js';
import { getStoredOrders } from '../../utils/ordersManager.js';

export function AdminOverview({
  products = [],
  onNavigate,
  onAddProduct,
  onOpenRestock,
  onAdjustStock,
  onSwitchToStore
}) {
  const orders = getStoredOrders();

  // Metrics
  const totalItems = products.length;
  const totalStockUnits = products.reduce((acc, p) => acc + Number(p.stock || 0), 0);
  const totalValuation = products.reduce((acc, p) => acc + (Number(p.price || 0) * Number(p.stock || 0)), 0);
  const lowStockProducts = products.filter((p) => Number(p.stock) <= (p.minStockThreshold || 10));
  const totalOrdersAmount = orders.reduce((acc, o) => acc + Number(o.grandTotal || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '24px',
          borderRadius: 'var(--radius-xl)',
          background: 'linear-gradient(135deg, rgba(255, 87, 34, 0.08) 0%, rgba(10, 14, 22, 0.95) 100%)',
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
            <span className="pulse-status" style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-success)' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand-primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Operations Dashboard
            </span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>
            CloudMart 360 Executive Overview
          </h1>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '4px', margin: 0 }}>
            Real-time catalog metrics, inventory alerts, orders pipeline, and AWS serverless health.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Button variant="secondary" size="sm" onClick={onSwitchToStore}>
            Storefront &rarr;
          </Button>
          <Button variant="primary" size="sm" onClick={onAddProduct} icon={Plus}>
            Add Product
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        {/* Card 1: Total Catalog Products */}
        <SpotlightCard
          spotlightColor="rgba(255, 87, 34, 0.15)"
          style={{ padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-default)', display: 'flex', flexDirection: 'column', gap: '8px' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Live Products</span>
            <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-sm)', background: 'rgba(255, 87, 34, 0.12)', color: 'var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Package size={16} />
            </div>
          </div>
          <div className="font-mono" style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {totalItems}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <CheckCircle2 size={12} />
            <span>100% Synced with DynamoDB</span>
          </div>
        </SpotlightCard>

        {/* Card 2: Total Units In Stock */}
        <SpotlightCard
          spotlightColor="rgba(56, 189, 248, 0.15)"
          style={{ padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-default)', display: 'flex', flexDirection: 'column', gap: '8px' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Stock Units</span>
            <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-sm)', background: 'rgba(56, 189, 248, 0.12)', color: '#38BDF8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Boxes size={16} />
            </div>
          </div>
          <div className="font-mono" style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {formatNumber(totalStockUnits)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Across 5 Retail Categories
          </div>
        </SpotlightCard>

        {/* Card 3: Inventory Valuation */}
        <SpotlightCard
          spotlightColor="rgba(16, 185, 129, 0.15)"
          style={{ padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-default)', display: 'flex', flexDirection: 'column', gap: '8px' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Asset Valuation</span>
            <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-sm)', background: 'rgba(16, 185, 129, 0.12)', color: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="font-mono" style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {formatCurrency(totalValuation)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-success)' }}>
            Retail Inventory Equity
          </div>
        </SpotlightCard>

        {/* Card 4: Orders & Revenue */}
        <SpotlightCard
          spotlightColor="rgba(245, 158, 11, 0.15)"
          style={{ padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-default)', display: 'flex', flexDirection: 'column', gap: '8px' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Orders Revenue</span>
            <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-sm)', background: 'rgba(245, 158, 11, 0.12)', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingCart size={16} />
            </div>
          </div>
          <div className="font-mono" style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {formatCurrency(totalOrdersAmount)}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#F59E0B' }}>
            {orders.length} Verified Customer Orders
          </div>
        </SpotlightCard>
      </div>

      {/* Main Grid: Orders & Stock Alerts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '20px' }}>
        {/* Left: Recent Customer Orders */}
        <div className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--radius-xl)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShoppingCart size={18} color="var(--brand-primary)" />
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Recent Customer Orders
              </h2>
            </div>
            <button
              onClick={() => onNavigate('orders')}
              style={{ fontSize: '0.75rem', color: 'var(--brand-primary)', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <span>View All ({orders.length})</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {orders.slice(0, 4).map((ord) => (
              <div
                key={ord.orderId}
                className="glass-panel"
                style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="font-mono" style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {ord.orderId}
                    </span>
                    <span
                      style={{
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-full)',
                        background:
                          ord.status === 'Delivered'
                            ? 'rgba(16, 185, 129, 0.15)'
                            : ord.status === 'Out for Delivery'
                            ? 'rgba(56, 189, 248, 0.15)'
                            : 'rgba(245, 158, 11, 0.15)',
                        color:
                          ord.status === 'Delivered'
                            ? 'var(--color-success)'
                            : ord.status === 'Out for Delivery'
                            ? '#38BDF8'
                            : '#F59E0B'
                      }}
                    >
                      {ord.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {ord.customer} • {ord.items?.length || 1} item(s) • {ord.date}
                  </div>
                </div>

                <div className="font-mono" style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--brand-primary)' }}>
                  {formatCurrency(ord.grandTotal)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Low Stock & Inventory Alerts */}
        <div className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--radius-xl)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={18} color="var(--color-warning)" />
                <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  Stock Action Alerts ({lowStockProducts.length})
                </h2>
              </div>
              <button
                onClick={() => onNavigate('inventory')}
                style={{ fontSize: '0.75rem', color: 'var(--brand-primary)', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <span>Stock Control</span>
                <ArrowRight size={14} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {lowStockProducts.slice(0, 4).map((p) => {
                const isOut = Number(p.stock) === 0;

                return (
                  <div
                    key={p.id}
                    className="glass-panel"
                    style={{
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0, marginRight: '10px' }}>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {p.name}
                      </div>
                      <div style={{ fontSize: '0.6875rem', color: isOut ? 'var(--color-danger)' : 'var(--color-warning)', fontWeight: 600 }}>
                        {isOut ? 'Sold Out (0 left)' : `Low: only ${p.stock} units left`}
                      </div>
                    </div>

                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onAdjustStock(p.id, 10)}
                      style={{ height: '28px', padding: '0 10px', fontSize: '0.6875rem' }}
                    >
                      +10 Restock
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Bulk Restock Action */}
          <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }}>
            <Button variant="primary" size="sm" onClick={onOpenRestock} style={{ width: '100%', justifyContent: 'center' }}>
              Open Bulk Restock Utility
            </Button>
          </div>
        </div>
      </div>

      {/* AWS Cloud Infrastructure Health Monitor */}
      <div
        className="glass-panel"
        style={{
          padding: '20px 24px',
          borderRadius: 'var(--radius-xl)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          background: 'rgba(10, 14, 22, 0.6)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-md)', background: 'rgba(255, 87, 34, 0.15)', color: 'var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Database size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Storage Layer</div>
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>Amazon DynamoDB</div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--color-success)' }}>Table: CloudMart360-Products</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-md)', background: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Compute Engine</div>
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>AWS Lambda (Node 20.x)</div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--color-success)' }}>Sub-10ms Execution</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-md)', background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Cloud size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Gateway Layer</div>
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>AWS API Gateway</div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--color-success)' }}>Stage: Prod (HTTPS)</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Auth & Security</div>
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>Amazon Cognito</div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--color-success)' }}>Role-Based Access Control</div>
          </div>
        </div>
      </div>
    </div>
  );
}

