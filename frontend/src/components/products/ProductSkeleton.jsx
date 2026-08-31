import React from 'react';

export function ProductKpiSkeleton() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="glass-panel"
          style={{
            padding: '20px',
            borderRadius: 'var(--radius-xl)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="skeleton-shimmer" style={{ width: '80px', height: '14px' }} />
            <div className="skeleton-shimmer" style={{ width: '28px', height: '28px', borderRadius: '50%' }} />
          </div>
          <div className="skeleton-shimmer" style={{ width: '110px', height: '28px' }} />
          <div className="skeleton-shimmer" style={{ width: '130px', height: '12px' }} />
        </div>
      ))}
    </div>
  );
}

export function ProductTableSkeleton({ rows = 6 }) {
  return (
    <div className="table-container">
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-default)' }}>
        <div className="skeleton-shimmer" style={{ width: '160px', height: '20px' }} />
      </div>
      <div style={{ padding: '8px 0' }}>
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 20px',
              borderBottom: '1px solid var(--border-subtle)',
              gap: '16px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 2 }}>
              <div className="skeleton-shimmer" style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', flexShrink: 0 }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
                <div className="skeleton-shimmer" style={{ width: '65%', height: '16px' }} />
                <div className="skeleton-shimmer" style={{ width: '35%', height: '12px' }} />
              </div>
            </div>

            <div className="skeleton-shimmer" style={{ width: '90px', height: '22px', borderRadius: 'var(--radius-full)', flex: 1 }} />
            <div className="skeleton-shimmer" style={{ width: '70px', height: '16px', flex: 1 }} />
            <div className="skeleton-shimmer" style={{ width: '80px', height: '16px', flex: 1 }} />
            <div className="skeleton-shimmer" style={{ width: '75px', height: '22px', borderRadius: 'var(--radius-full)', flex: 1 }} />
            <div className="skeleton-shimmer" style={{ width: '70px', height: '32px', borderRadius: 'var(--radius-md)' }} />
          </div>
        ))}
      </div>
    </div>
  );
}
