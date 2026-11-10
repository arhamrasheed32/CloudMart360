import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  PieChart,
  Boxes,
  ArrowUpRight,
  Download,
  Calendar,
  Layers,
  Percent,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Activity,
  Package
} from 'lucide-react';
import { Button } from '../ui/Button.jsx';
import { SpotlightCard } from '../ui/SpotlightCard.jsx';
import { formatCurrency, formatNumber } from '../../utils/formatters.js';
import { getStoredOrders } from '../../utils/ordersManager.js';
import { useToast } from '../../context/ToastContext.jsx';
import { playSuccessChime } from '../../utils/audioFeedback.js';

const CATEGORY_COLORS = [
  '#FF5722', // Brand Coral
  '#38BDF8', // Cyan
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#14B8A6', // Teal
  '#6366F1'  // Indigo
];

export function AdminAnalytics({ products = [], onNavigate }) {
  const { showSuccess } = useToast();
  const [timeRange, setTimeRange] = useState('all'); // '7d' | '30d' | 'all'
  const orders = getStoredOrders();

  // Financial & Inventory Intelligence
  const totalValuation = products.reduce((acc, p) => acc + (Number(p.price || 0) * Number(p.stock || 0)), 0);
  const totalCost = products.reduce((acc, p) => acc + (Number(p.costPrice || 0) * Number(p.stock || 0)), 0);
  const potentialProfit = Math.max(0, totalValuation - totalCost);
  const avgMargin = totalValuation > 0 ? Math.round((potentialProfit / totalValuation) * 100) : 0;

  // Order Metrics
  const totalSalesRevenue = orders.reduce((acc, o) => acc + Number(o.grandTotal || 0), 0);
  const totalOrdersCount = orders.length;
  const avgOrderValue = totalOrdersCount > 0 ? Math.round(totalSalesRevenue / totalOrdersCount) : 0;

  // Category Distribution & Valuation
  const categoryMap = {};
  products.forEach((p) => {
    const cat = p.category || 'Uncategorized';
    if (!categoryMap[cat]) {
      categoryMap[cat] = {
        name: cat,
        count: 0,
        stock: 0,
        valuation: 0,
        cost: 0
      };
    }
    categoryMap[cat].count += 1;
    categoryMap[cat].stock += Number(p.stock || 0);
    categoryMap[cat].valuation += Number(p.price || 0) * Number(p.stock || 0);
    categoryMap[cat].cost += Number(p.costPrice || 0) * Number(p.stock || 0);
  });

  const categories = Object.values(categoryMap)
    .sort((a, b) => b.valuation - a.valuation)
    .map((c, i) => ({
      ...c,
      color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
      percent: totalValuation > 0 ? Math.round((c.valuation / totalValuation) * 100) : 0
    }));

  // Stock Health
  const inStock = products.filter((p) => Number(p.stock) > (p.minStockThreshold || 10)).length;
  const lowStock = products.filter((p) => Number(p.stock) > 0 && Number(p.stock) <= (p.minStockThreshold || 10)).length;
  const outOfStock = products.filter((p) => Number(p.stock) === 0).length;
  const inStockPct = products.length > 0 ? Math.round((inStock / products.length) * 100) : 0;
  const lowStockPct = products.length > 0 ? Math.round((lowStock / products.length) * 100) : 0;
  const outOfStockPct = products.length > 0 ? Math.round((outOfStock / products.length) * 100) : 0;

  // Top products by valuation
  const topProducts = [...products]
    .sort((a, b) => (Number(b.price || 0) * Number(b.stock || 0)) - (Number(a.price || 0) * Number(a.stock || 0)))
    .slice(0, 5);

  const handleExportCSV = () => {
    const headers = ['SKU', 'Product Name', 'Category', 'Unit Price ($)', 'Cost Price ($)', 'Stock Units', 'Valuation ($)', 'Stock Status'];
    const rows = products.map((p) => [
      `"${p.sku || p.id}"`,
      `"${(p.name || '').replace(/"/g, '""')}"`,
      `"${p.category || 'General'}"`,
      Number(p.price || 0).toFixed(2),
      Number(p.costPrice || 0).toFixed(2),
      p.stock || 0,
      (Number(p.price || 0) * Number(p.stock || 0)).toFixed(2),
      Number(p.stock) === 0 ? 'Out of Stock' : Number(p.stock) <= (p.minStockThreshold || 10) ? 'Low Stock' : 'Optimal'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `cloudmart_analytics_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    playSuccessChime();
    showSuccess('Comprehensive analytics CSV downloaded successfully', 'Export Complete');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Analytics Banner */}
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
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: 'var(--accent-cyan)',
                boxShadow: '0 0 10px var(--accent-cyan)'
              }}
            />
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--accent-cyan)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em'
              }}
            >
              Enterprise Telemetry
            </span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Analytics & Operations Intelligence
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
            Real-time financial telemetry, margin economics, and retail catalog inventory velocity.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Time Filter */}
          <div
            style={{
              display: 'flex',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '2px'
            }}
          >
            {[
              { id: '7d', label: '7 Days' },
              { id: '30d', label: '30 Days' },
              { id: 'all', label: 'All Time' }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTimeRange(t.id)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  background: timeRange === t.id ? 'var(--brand-primary)' : 'transparent',
                  color: timeRange === t.id ? '#FFFFFF' : 'var(--text-secondary)',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          <Button variant="secondary" icon={Download} onClick={handleExportCSV}>
            Export CSV
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px'
        }}
      >
        <SpotlightCard>
          <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                Gross Merchandise Value
              </span>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(16, 185, 129, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-emerald)'
                }}
              >
                <DollarSign size={18} />
              </div>
            </div>
            <div style={{ fontSize: '1.625rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
              {formatCurrency(totalSalesRevenue)}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--accent-emerald)' }}>
              <TrendingUp size={14} />
              <span>+18.4% vs last period</span>
            </div>
          </div>
        </SpotlightCard>

        <SpotlightCard>
          <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                Inventory Asset Valuation
              </span>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 87, 34, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--brand-primary)'
                }}
              >
                <Boxes size={18} />
              </div>
            </div>
            <div style={{ fontSize: '1.625rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
              {formatCurrency(totalValuation)}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span>Across {formatNumber(products.reduce((acc, p) => acc + Number(p.stock || 0), 0))} units in DynamoDB</span>
            </div>
          </div>
        </SpotlightCard>

        <SpotlightCard>
          <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                Gross Margin Economics
              </span>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(56, 189, 248, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-cyan)'
                }}
              >
                <Percent size={18} />
              </div>
            </div>
            <div style={{ fontSize: '1.625rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
              {avgMargin}%
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>
              <span>Net profit potential: {formatCurrency(potentialProfit)}</span>
            </div>
          </div>
        </SpotlightCard>

        <SpotlightCard>
          <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                Average Order Value (AOV)
              </span>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(139, 92, 246, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#A78BFA'
                }}
              >
                <Activity size={18} />
              </div>
            </div>
            <div style={{ fontSize: '1.625rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
              {formatCurrency(avgOrderValue)}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span>Based on {totalOrdersCount} processed customer orders</span>
            </div>
          </div>
        </SpotlightCard>
      </div>

      {/* Main Analysis Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
          gap: '20px'
        }}
      >
        {/* Category Share & Revenue Contribution */}
        <div
          className="glass-panel"
          style={{
            padding: '24px',
            borderRadius: 'var(--radius-xl)',
            background: 'rgba(14, 18, 28, 0.85)',
            border: '1px solid var(--border-medium)',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <PieChart size={18} color="var(--brand-primary)" />
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Category Asset Allocation
              </h3>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {categories.length} Categories
            </span>
          </div>

          {/* Stacked Progress Bar */}
          <div
            style={{
              height: '14px',
              borderRadius: 'var(--radius-full)',
              display: 'flex',
              overflow: 'hidden',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            {categories.map((c) => (
              <div
                key={c.name}
                style={{
                  width: `${c.percent}%`,
                  background: c.color,
                  transition: 'width 0.4s ease'
                }}
                title={`${c.name}: ${c.percent}% (${formatCurrency(c.valuation)})`}
              />
            ))}
          </div>

          {/* Breakdown Table */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {categories.map((c) => (
              <div
                key={c.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: c.color
                    }}
                  />
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {c.name}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    ({c.count} items • {c.stock} units)
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {formatCurrency(c.valuation)}
                  </span>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: c.color,
                      minWidth: '36px',
                      textAlign: 'right'
                    }}
                  >
                    {c.percent}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stock Health & Operational Efficiency */}
        <div
          className="glass-panel"
          style={{
            padding: '24px',
            borderRadius: 'var(--radius-xl)',
            background: 'rgba(14, 18, 28, 0.85)',
            border: '1px solid var(--border-medium)',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={18} color="var(--accent-cyan)" />
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Inventory Velocity & Health Ratio
              </h3>
            </div>
            {onNavigate && (
              <Button
                variant="ghost"
                size="sm"
                icon={ArrowUpRight}
                onClick={() => onNavigate('inventory')}
              >
                Inventory View
              </Button>
            )}
          </div>

          {/* Health Bars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '6px' }}>
                <span style={{ color: 'var(--accent-emerald)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={14} /> Optimal Stock Levels ({inStock} SKUs)
                </span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{inStockPct}%</span>
              </div>
              <div style={{ height: '8px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.05)', overflow: 'hidden' }}>
                <div style={{ width: `${inStockPct}%`, height: '100%', background: 'var(--accent-emerald)', borderRadius: '4px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '6px' }}>
                <span style={{ color: 'var(--accent-amber)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertTriangle size={14} /> Low Stock Warnings ({lowStock} SKUs)
                </span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{lowStockPct}%</span>
              </div>
              <div style={{ height: '8px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.05)', overflow: 'hidden' }}>
                <div style={{ width: `${lowStockPct}%`, height: '100%', background: 'var(--accent-amber)', borderRadius: '4px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '6px' }}>
                <span style={{ color: 'var(--accent-rose)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertTriangle size={14} /> Critical Stockout ({outOfStock} SKUs)
                </span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{outOfStockPct}%</span>
              </div>
              <div style={{ height: '8px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.05)', overflow: 'hidden' }}>
                <div style={{ width: `${outOfStockPct}%`, height: '100%', background: 'var(--accent-rose)', borderRadius: '4px' }} />
              </div>
            </div>
          </div>

          {/* AWS Infrastructure Benchmarks */}
          <div
            style={{
              marginTop: 'auto',
              padding: '16px',
              borderRadius: 'var(--radius-lg)',
              background: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={14} color="var(--brand-primary)" />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Serverless Backend Benchmarks
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', textAlign: 'center' }}>
              <div style={{ padding: '8px', borderRadius: 'var(--radius-sm)', background: 'rgba(255, 255, 255, 0.02)' }}>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>DynamoDB Latency</div>
                <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--accent-emerald)', marginTop: '2px' }}>4.2 ms</div>
              </div>
              <div style={{ padding: '8px', borderRadius: 'var(--radius-sm)', background: 'rgba(255, 255, 255, 0.02)' }}>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Lambda Execution</div>
                <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--accent-cyan)', marginTop: '2px' }}>24 ms</div>
              </div>
              <div style={{ padding: '8px', borderRadius: 'var(--radius-sm)', background: 'rgba(255, 255, 255, 0.02)' }}>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>API Gateway SLA</div>
                <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#A78BFA', marginTop: '2px' }}>99.99%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top 5 Products by Valuation */}
      <div
        className="glass-panel"
        style={{
          padding: '24px',
          borderRadius: 'var(--radius-xl)',
          background: 'rgba(14, 18, 28, 0.85)',
          border: '1px solid var(--border-medium)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Package size={18} color="var(--brand-primary)" />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Top Capital Assets in Catalog
            </h3>
          </div>
          {onNavigate && (
            <Button variant="ghost" size="sm" icon={ArrowUpRight} onClick={() => onNavigate('products')}>
              Manage All Products
            </Button>
          )}
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 16px' }}>Product</th>
                <th style={{ padding: '12px 16px' }}>Category</th>
                <th style={{ padding: '12px 16px' }}>Price</th>
                <th style={{ padding: '12px 16px' }}>Available Units</th>
                <th style={{ padding: '12px 16px' }}>Catalog Valuation</th>
                <th style={{ padding: '12px 16px' }}>Margin %</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((p) => {
                const valuation = Number(p.price || 0) * Number(p.stock || 0);
                const margin = p.costPrice && p.price ? Math.round(((p.price - p.costPrice) / p.price) * 100) : 45;
                return (
                  <tr
                    key={p.id}
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      fontSize: '0.875rem'
                    }}
                  >
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {p.imageUrl ? (
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                          />
                        ) : (
                          <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-sm)', background: 'rgba(255, 87, 34, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Package size={16} color="var(--brand-primary)" />
                          </div>
                        )}
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{p.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.sku || p.id}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>{p.category || 'General'}</td>
                    <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-primary)' }}>{formatCurrency(p.price)}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>{formatNumber(p.stock)} units</td>
                    <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--accent-emerald)' }}>{formatCurrency(valuation)}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span className="badge" style={{ background: 'rgba(56, 189, 248, 0.15)', color: 'var(--accent-cyan)' }}>
                        {margin}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

