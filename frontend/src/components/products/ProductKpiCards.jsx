import React from 'react';
import {
  Package,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Coins,
  ArrowUpRight,
  TrendingUp
} from 'lucide-react';
import { SpotlightCard } from '../ui/SpotlightCard.jsx';
import { AnimatedNumber } from '../ui/AnimatedNumber.jsx';
import { formatCurrency, formatNumber } from '../../utils/formatters.js';

export function ProductKpiCards({
  kpis = {},
  activeFilter = null,
  onDrillDown
}) {
  const {
    totalProducts = 0,
    activeProducts = 0,
    lowStockProducts = 0,
    outOfStockProducts = 0,
    totalCatalogValuation = 0,
    averagePrice = 0
  } = kpis;

  const activePercent = totalProducts > 0 ? Math.round((activeProducts / totalProducts) * 100) : 0;

  const cards = [
    {
      id: 'total',
      filterType: 'all',
      label: 'Total Products',
      numValue: totalProducts,
      formatter: (v) => Math.round(v).toLocaleString(),
      subtitle: `${activeProducts} active in store`,
      icon: Package,
      accentColor: '#38BDF8',
      spotlightColor: 'rgba(56, 189, 248, 0.18)',
      bgGlow: 'rgba(56, 189, 248, 0.12)',
      borderColor: 'rgba(56, 189, 248, 0.25)'
    },
    {
      id: 'active',
      filterType: 'active',
      label: 'Active Listings',
      numValue: activeProducts,
      formatter: (v) => Math.round(v).toLocaleString(),
      subtitle: `${activePercent}% of total catalog`,
      icon: CheckCircle2,
      accentColor: '#10B981',
      spotlightColor: 'rgba(16, 185, 129, 0.18)',
      bgGlow: 'rgba(16, 185, 129, 0.12)',
      borderColor: 'rgba(16, 185, 129, 0.25)'
    },
    {
      id: 'low_stock',
      filterType: 'low_stock',
      label: 'Low Stock Alerts',
      numValue: lowStockProducts,
      formatter: (v) => Math.round(v).toLocaleString(),
      subtitle: 'Stock <= threshold',
      icon: AlertTriangle,
      accentColor: '#F59E0B',
      spotlightColor: 'rgba(245, 158, 11, 0.18)',
      bgGlow: 'rgba(245, 158, 11, 0.12)',
      borderColor: 'rgba(245, 158, 11, 0.25)',
      isWarning: lowStockProducts > 0
    },
    {
      id: 'out_of_stock',
      filterType: 'out_of_stock',
      label: 'Out of Stock',
      numValue: outOfStockProducts,
      formatter: (v) => Math.round(v).toLocaleString(),
      subtitle: 'Requires replenishment',
      icon: XCircle,
      accentColor: '#EF4444',
      spotlightColor: 'rgba(239, 68, 68, 0.18)',
      bgGlow: 'rgba(239, 68, 68, 0.12)',
      borderColor: 'rgba(239, 68, 68, 0.25)',
      isAlert: outOfStockProducts > 0
    },
    {
      id: 'valuation',
      filterType: 'none',
      label: 'Catalog Valuation',
      numValue: totalCatalogValuation,
      formatter: (v) => formatCurrency(v),
      subtitle: `Avg ${formatCurrency(averagePrice)} / unit`,
      icon: Coins,
      accentColor: '#FF5722',
      spotlightColor: 'rgba(255, 87, 34, 0.22)',
      bgGlow: 'rgba(255, 87, 34, 0.12)',
      borderColor: 'rgba(255, 87, 34, 0.3)'
    }
  ];

  return (
    <section aria-label="Product Analytics KPIs" style={{ marginBottom: '28px' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '16px'
        }}
      >
        {cards.map((card) => {
          const Icon = card.icon;
          const isDrillable = card.filterType !== 'none';
          const isSelected = activeFilter === card.filterType;

          return (
            <SpotlightCard
              key={card.id}
              spotlightColor={card.spotlightColor}
              onClick={() => {
                if (isDrillable && onDrillDown) {
                  onDrillDown(card.filterType);
                }
              }}
              style={{
                padding: '20px 22px',
                borderRadius: 'var(--radius-xl)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '124px',
                cursor: isDrillable ? 'pointer' : 'default',
                borderColor: isSelected ? 'var(--brand-primary)' : undefined,
                boxShadow: isSelected ? '0 0 20px rgba(255, 87, 34, 0.25)' : undefined
              }}
              title={isDrillable ? `Click to filter: ${card.label}` : undefined}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    color: 'var(--text-muted)'
                  }}
                >
                  {card.label}
                </span>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: 'var(--radius-md)',
                    background: card.bgGlow,
                    border: `1px solid ${card.borderColor}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: card.accentColor,
                    flexShrink: 0
                  }}
                >
                  <Icon size={16} />
                </div>
              </div>

              {/* Numerical Value with Animated Counter */}
              <div>
                <div
                  className="font-mono"
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.2
                  }}
                >
                  <AnimatedNumber value={card.numValue} formatter={card.formatter} />
                </div>
                <div
                  style={{
                    fontSize: '0.75rem',
                    color: card.isAlert ? 'var(--color-danger)' : card.isWarning ? 'var(--color-warning)' : 'var(--text-faint)',
                    marginTop: '4px',
                    fontWeight: (card.isAlert || card.isWarning) ? 600 : 400,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span>{card.subtitle}</span>
                  {isDrillable && (
                    <ArrowUpRight size={13} color="var(--text-faint)" />
                  )}
                </div>
              </div>
            </SpotlightCard>
          );
        })}
      </div>
    </section>
  );
}
