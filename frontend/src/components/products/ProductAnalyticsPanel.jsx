import React from 'react';
import {
  PieChart,
  TrendingUp,
  Boxes,
  Percent,
  Layers,
  ChevronUp,
  BarChart3,
  DollarSign
} from 'lucide-react';
import { formatCurrency, formatNumber } from '../../utils/formatters.js';

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

export function ProductAnalyticsPanel({
  products = [],
  onFilterCategory,
  onClose
}) {
  if (!products || products.length === 0) return null;

  // 1. Calculate Category Distribution
  const categoryMap = {};
  products.forEach((p) => {
    const cat = p.category || 'Other';
    categoryMap[cat] = (categoryMap[cat] || 0) + 1;
  });

  const categoryDistribution = Object.entries(categoryMap)
    .map(([category, count], idx) => ({
      category,
      count,
      percent: Math.round((count / products.length) * 100),
      color: CATEGORY_COLORS[idx % CATEGORY_COLORS.length]
    }))
    .sort((a, b) => b.count - a.count);

  // 2. Calculate Stock Health Ratio
  const inStockCount = products.filter((p) => Number(p.stock) > (p.minStockThreshold || 10)).length;
  const lowStockCount = products.filter((p) => Number(p.stock) > 0 && Number(p.stock) <= (p.minStockThreshold || 10)).length;
  const outOfStockCount = products.filter((p) => Number(p.stock) === 0).length;

  const inStockPct = Math.round((inStockCount / products.length) * 100);
  const lowStockPct = Math.round((lowStockCount / products.length) * 100);
  const outOfStockPct = Math.round((outOfStockCount / products.length) * 100);

  // 3. Financial Margin Economics
  const totalValuation = products.reduce((acc, p) => acc + (Number(p.price || 0) * Number(p.stock || 0)), 0);
  const totalCost = products.reduce((acc, p) => acc + (Number(p.costPrice || 0) * Number(p.stock || 0)), 0);
  const potentialProfit = Math.max(0, totalValuation - totalCost);
  const avgMargin = totalValuation > 0 && totalCost > 0 ? Math.round((potentialProfit / totalValuation) * 100) : 0;

  return (
    <div
      className="glass-panel"
      style={{
        padding: '22px',
        borderRadius: 'var(--radius-xl)',
        marginBottom: '20px',
        background: 'rgba(14, 18, 28, 0.82)',
        border: '1px solid var(--border-medium)',
        display: 'flex',
        flexDirection: 'column',
        gap: '18px',
        animation: 'scaleUp 150ms ease-out'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BarChart3 size={18} color="var(--brand-primary)" />
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Catalog Analytics & Inventory Intelligence
          </h2>
          <span className="badge" style={{ background: 'rgba(255, 87, 34, 0.15)', color: 'var(--brand-primary)' }}>
            Live Metrics
          </span>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 8px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(255, 255, 255, 0.04)'
            }}
          >
            <ChevronUp size={14} />
            <span>Hide Insights</span>
          </button>
        )}
      </div>

      {/* Grid: Category Distribution + Stock Health + Economic Yield */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        {/* Card 1: Category Distribution */}
        <div
          className="glass-panel"
          style={{
            padding: '16px',
            borderRadius: 'var(--radius-lg)',
            background: 'rgba(255, 255, 255, 0.02)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Category Share
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-faint)' }}>
              {categoryDistribution.length} Categories
            </span>
          </div>

          {/* Stacked Progress Bar */}
          <div
            style={{
              display: 'flex',
              width: '100%',
              height: '8px',
              borderRadius: 'var(--radius-full)',
              overflow: 'hidden',
              background: 'rgba(255, 255, 255, 0.06)'
            }}
          >
            {categoryDistribution.map((cat) => (
              <div
                key={cat.category}
                style={{
                  width: `${cat.percent}%`,
                  height: '100%',
                  backgroundColor: cat.color,
                  transition: 'width var(--transition-normal)'
                }}
                title={`${cat.category}: ${cat.count} products (${cat.percent}%)`}
              />
            ))}
          </div>

          {/* Category Chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {categoryDistribution.slice(0, 5).map((cat) => (
              <button
                key={cat.category}
                onClick={() => onFilterCategory && onFilterCategory(cat.category)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.75rem',
                  padding: '4px 8px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: cat.color }} />
                <span>{cat.category}</span>
                <span className="font-mono" style={{ color: 'var(--text-muted)', fontWeight: 600 }}>
                  ({cat.percent}%)
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Card 2: Stock Health Distribution */}
        <div
          className="glass-panel"
          style={{
            padding: '16px',
            borderRadius: 'var(--radius-lg)',
            background: 'rgba(255, 255, 255, 0.02)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Inventory Health Ratio
            </span>
            <span className="font-mono" style={{ fontSize: '0.75rem', color: inStockPct > 70 ? 'var(--color-success)' : 'var(--color-warning)' }}>
              {inStockPct}% Healthy
            </span>
          </div>

          {/* Tri-color Health Bar */}
          <div
            style={{
              display: 'flex',
              width: '100%',
              height: '8px',
              borderRadius: 'var(--radius-full)',
              overflow: 'hidden',
              background: 'rgba(255, 255, 255, 0.06)'
            }}
          >
            <div style={{ width: `${inStockPct}%`, backgroundColor: 'var(--color-success)' }} title={`Healthy: ${inStockCount}`} />
            <div style={{ width: `${lowStockPct}%`, backgroundColor: 'var(--color-warning)' }} title={`Low: ${lowStockCount}`} />
            <div style={{ width: `${outOfStockPct}%`, backgroundColor: 'var(--color-danger)' }} title={`Out: ${outOfStockCount}`} />
          </div>

          {/* Health Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', textAlign: 'center' }}>
            <div style={{ padding: '6px', borderRadius: 'var(--radius-sm)', background: 'var(--color-success-bg)' }}>
              <div style={{ fontSize: '0.6875rem', color: 'var(--color-success)', fontWeight: 600 }}>Healthy</div>
              <div className="font-mono" style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-success)' }}>
                {inStockCount}
              </div>
            </div>

            <div style={{ padding: '6px', borderRadius: 'var(--radius-sm)', background: 'var(--color-warning-bg)' }}>
              <div style={{ fontSize: '0.6875rem', color: 'var(--color-warning)', fontWeight: 600 }}>Low</div>
              <div className="font-mono" style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-warning)' }}>
                {lowStockCount}
              </div>
            </div>

            <div style={{ padding: '6px', borderRadius: 'var(--radius-sm)', background: 'var(--color-danger-bg)' }}>
              <div style={{ fontSize: '0.6875rem', color: 'var(--color-danger)', fontWeight: 600 }}>Depleted</div>
              <div className="font-mono" style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-danger)' }}>
                {outOfStockCount}
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Financial & Margin Economics */}
        <div
          className="glass-panel"
          style={{
            padding: '16px',
            borderRadius: 'var(--radius-lg)',
            background: 'rgba(255, 255, 255, 0.02)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Catalog Economics
            </span>
            <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--color-success)' }}>
              {avgMargin}% Avg Margin
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Gross Inventory Value:</span>
            <span className="font-mono" style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
              {formatCurrency(totalValuation)}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Total Cost Investment:</span>
            <span className="font-mono" style={{ color: 'var(--text-secondary)' }}>
              {formatCurrency(totalCost)}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '6px' }}>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Potential Gross Profit:</span>
            <span className="font-mono" style={{ color: 'var(--color-success)', fontWeight: 800 }}>
              {formatCurrency(potentialProfit)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
