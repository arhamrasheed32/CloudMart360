import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button.jsx';

export function Pagination({
  currentPage = 1,
  totalItems = 0,
  pageSize = 10,
  onPageChange
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  if (totalItems <= pageSize && totalPages === 1) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 18px',
          fontSize: '0.8125rem',
          color: 'var(--text-muted)',
          borderTop: '1px solid var(--border-subtle)'
        }}
      >
        <span>Showing all {totalItems} items</span>
        <span className="badge" style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--text-secondary)' }}>
          Catalog in Sync
        </span>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 18px',
        fontSize: '0.8125rem',
        color: 'var(--text-muted)',
        borderTop: '1px solid var(--border-subtle)',
        flexWrap: 'wrap',
        gap: '12px'
      }}
    >
      <div>
        Showing <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{startItem}</span> to{' '}
        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{endItem}</span> of{' '}
        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{totalItems}</span> products
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Button
          variant="secondary"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft size={14} />
          <span>Previous</span>
        </Button>

        <div style={{ padding: '0 8px', fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
          Page {currentPage} of {totalPages}
        </div>

        <Button
          variant="secondary"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Next page"
        >
          <span>Next</span>
          <ChevronRight size={14} />
        </Button>
      </div>
    </div>
  );
}
