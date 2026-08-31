import React from 'react';
import { PackageSearch, Plus, RotateCcw, PackageOpen } from 'lucide-react';
import { Button } from '../ui/Button.jsx';

export function ProductEmptyState({
  isFiltered = false,
  searchTerm = '',
  onResetFilters,
  onAddProduct
}) {
  if (isFiltered) {
    return (
      <div
        className="glass-panel"
        style={{
          padding: '64px 24px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 'var(--radius-xl)',
          minHeight: '340px'
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(255, 87, 34, 0.1)',
            border: '1px solid rgba(255, 87, 34, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--brand-primary)',
            marginBottom: '16px',
            boxShadow: '0 0 24px rgba(255, 87, 34, 0.2)'
          }}
        >
          <PackageSearch size={30} />
        </div>

        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
          No Matching Products Found
        </h3>

        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', maxWidth: '420px', marginBottom: '24px', lineHeight: 1.5 }}>
          {searchTerm ? (
            <>No items in catalog matched <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>"{searchTerm}"</span> or your current filter criteria.</>
          ) : (
            'No items in your catalog match the selected category and status filters.'
          )}
        </p>

        <div style={{ display: 'flex', gap: '12px' }}>
          <Button variant="secondary" onClick={onResetFilters} icon={RotateCcw}>
            Clear Filters
          </Button>
          <Button variant="primary" onClick={onAddProduct} icon={Plus}>
            Add New Product
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="glass-panel"
      style={{
        padding: '64px 24px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 'var(--radius-xl)',
        minHeight: '380px'
      }}
    >
      <div
        style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(255, 87, 34, 0.15) 0%, rgba(255, 87, 34, 0.05) 100%)',
          border: '1px solid rgba(255, 87, 34, 0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--brand-primary)',
          marginBottom: '18px',
          boxShadow: '0 0 32px rgba(255, 87, 34, 0.25)'
        }}
      >
        <PackageOpen size={36} />
      </div>

      <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
        Your Retail Catalog is Empty
      </h3>

      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', maxWidth: '440px', marginBottom: '24px', lineHeight: 1.5 }}>
        Get started by creating your first product. Configure pricing, inventory thresholds, specifications, and synchronize with AWS DynamoDB.
      </p>

      <Button variant="primary" size="lg" onClick={onAddProduct} icon={Plus}>
        Create First Product
      </Button>
    </div>
  );
}
