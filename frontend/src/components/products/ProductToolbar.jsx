import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  X,
  Filter,
  ArrowUpDown,
  LayoutGrid,
  List,
  SlidersHorizontal,
  RotateCcw,
  Download,
  Command,
  DollarSign
} from 'lucide-react';
import { Button } from '../ui/Button.jsx';
import { VALID_CATEGORIES } from '../../utils/constants.js';

const CATEGORY_OPTIONS = [
  { value: 'all', label: 'All Categories' },
  ...VALID_CATEGORIES.map((c) => ({ value: c, label: c }))
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'active', label: 'Active Listings' },
  { value: 'draft', label: 'Drafts' },
  { value: 'archived', label: 'Archived' }
];

const STOCK_OPTIONS = [
  { value: 'all', label: 'All Stock Levels' },
  { value: 'in_stock', label: 'In Stock (>10 units)' },
  { value: 'low_stock', label: 'Low Stock (≤10 units)' },
  { value: 'out_of_stock', label: 'Out of Stock (0 units)' }
];

const SORT_OPTIONS = [
  { value: 'createdAt-desc', label: 'Newest First' },
  { value: 'createdAt-asc', label: 'Oldest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'stock-asc', label: 'Stock: Low to High' },
  { value: 'stock-desc', label: 'Stock: High to Low' },
  { value: 'name-asc', label: 'Name: A to Z' },
  { value: 'name-desc', label: 'Name: Z to A' }
];

export function ProductToolbar({
  search = '',
  onSearchChange,
  category = 'all',
  onCategoryChange,
  status = 'all',
  onStatusChange,
  stockCondition = 'all',
  onStockConditionChange,
  minPrice = '',
  onMinPriceChange,
  maxPrice = '',
  onMaxPriceChange,
  sortBy = 'createdAt',
  sortOrder = 'desc',
  onSortChange,
  onResetFilters,
  viewMode = 'table',
  onViewModeChange,
  onOpenCommandPalette,
  onExportCSV,
  totalResults = 0
}) {
  const searchInputRef = useRef(null);
  const [filterPopoverOpen, setFilterPopoverOpen] = useState(false);

  // Global key listener for Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (onOpenCommandPalette) onOpenCommandPalette();
      } else if (
        e.key === '/' &&
        document.activeElement.tagName !== 'INPUT' &&
        document.activeElement.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenCommandPalette]);

  const hasActiveFilters =
    search.trim() !== '' ||
    category !== 'all' ||
    status !== 'all' ||
    stockCondition !== 'all' ||
    minPrice !== '' ||
    maxPrice !== '';

  const currentSortValue = `${sortBy}-${sortOrder}`;

  const handleSortSelectChange = (e) => {
    const val = e.target.value;
    const [field, order] = val.split('-');
    onSortChange(field, order);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
      {/* Primary Toolbar Bar */}
      <div
        className="glass-panel"
        style={{
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        {/* Left Side: Search Bar & Filters */}
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '10px', flex: 1, minWidth: '280px' }}>
          {/* Instant Search Input */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
            <div
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                pointerEvents: 'none'
              }}
            >
              <Search size={16} />
            </div>

            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search catalog (/ or Ctrl+K)..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="glass-input"
              style={{
                width: '100%',
                height: '38px',
                padding: '0 64px 0 36px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8125rem'
              }}
            />

            <div
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              {search ? (
                <button
                  onClick={() => onSearchChange('')}
                  aria-label="Clear search"
                  style={{
                    color: 'var(--text-muted)',
                    padding: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 'var(--radius-xs)'
                  }}
                >
                  <X size={14} />
                </button>
              ) : (
                <kbd
                  style={{
                    fontSize: '0.6875rem',
                    color: 'var(--text-faint)',
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid var(--border-subtle)',
                    padding: '1px 5px',
                    borderRadius: 'var(--radius-xs)',
                    fontFamily: 'var(--font-mono)'
                  }}
                >
                  /
                </kbd>
              )}
            </div>
          </div>

          {/* Category Filter Select */}
          <div style={{ position: 'relative' }}>
            <select
              value={category}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="glass-input"
              aria-label="Filter by Category"
              style={{
                height: '38px',
                padding: '0 28px 0 12px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8125rem',
                background: category !== 'all' ? 'rgba(255, 87, 34, 0.1)' : 'rgba(255, 255, 255, 0.035)',
                borderColor: category !== 'all' ? 'var(--brand-primary)' : 'var(--border-default)',
                color: category !== 'all' ? 'var(--text-primary)' : 'var(--text-secondary)',
                appearance: 'none',
                WebkitAppearance: 'none',
                cursor: 'pointer'
              }}
            >
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} style={{ background: '#121724', color: '#F8FAFC' }}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter Select */}
          <div style={{ position: 'relative' }}>
            <select
              value={status}
              onChange={(e) => onStatusChange(e.target.value)}
              className="glass-input"
              aria-label="Filter by Status"
              style={{
                height: '38px',
                padding: '0 28px 0 12px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8125rem',
                background: status !== 'all' ? 'rgba(255, 87, 34, 0.1)' : 'rgba(255, 255, 255, 0.035)',
                borderColor: status !== 'all' ? 'var(--brand-primary)' : 'var(--border-default)',
                color: status !== 'all' ? 'var(--text-primary)' : 'var(--text-secondary)',
                appearance: 'none',
                WebkitAppearance: 'none',
                cursor: 'pointer'
              }}
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} style={{ background: '#121724', color: '#F8FAFC' }}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Advanced Filter Popover Toggle */}
          <div style={{ position: 'relative' }}>
            <Button
              variant={filterPopoverOpen || (minPrice || maxPrice || stockCondition !== 'all') ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setFilterPopoverOpen(!filterPopoverOpen)}
              icon={SlidersHorizontal}
              style={{ height: '38px', padding: '0 12px', fontSize: '0.8125rem' }}
            >
              <span>Filters</span>
              {(minPrice || maxPrice || stockCondition !== 'all') && (
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#FFFFFF'
                  }}
                />
              )}
            </Button>

            {/* Filter Popover */}
            {filterPopoverOpen && (
              <div
                className="glass-modal"
                onClick={(e) => e.stopPropagation()}
                style={{
                  position: 'absolute',
                  top: '46px',
                  left: 0,
                  width: '290px',
                  padding: '16px',
                  borderRadius: 'var(--radius-lg)',
                  zIndex: 'var(--z-dropdown)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  background: 'rgba(14, 18, 28, 0.98)',
                  boxShadow: 'var(--shadow-lg)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Advanced Filters
                  </span>
                  <button onClick={() => setFilterPopoverOpen(false)} style={{ color: 'var(--text-muted)' }}>
                    <X size={14} />
                  </button>
                </div>

                {/* Stock Condition */}
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    Stock Availability
                  </label>
                  <select
                    value={stockCondition}
                    onChange={(e) => onStockConditionChange(e.target.value)}
                    className="glass-input"
                    style={{ width: '100%', height: '32px', fontSize: '0.75rem', padding: '0 8px' }}
                  >
                    {STOCK_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value} style={{ background: '#121724', color: '#F8FAFC' }}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    Price Range ($ USD)
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <input
                      type="number"
                      placeholder="Min $"
                      value={minPrice}
                      onChange={(e) => onMinPriceChange(e.target.value)}
                      className="glass-input"
                      style={{ height: '32px', fontSize: '0.75rem', padding: '0 8px' }}
                    />
                    <input
                      type="number"
                      placeholder="Max $"
                      value={maxPrice}
                      onChange={(e) => onMaxPriceChange(e.target.value)}
                      className="glass-input"
                      style={{ height: '32px', fontSize: '0.75rem', padding: '0 8px' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px', paddingTop: '4px' }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      onStockConditionChange('all');
                      onMinPriceChange('');
                      onMaxPriceChange('');
                    }}
                    style={{ fontSize: '0.75rem', height: '28px' }}
                  >
                    Reset
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setFilterPopoverOpen(false)}
                    style={{ fontSize: '0.75rem', height: '28px' }}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Command Bar, Export, Sorting & View Mode Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Command Palette Trigger */}
          <Button
            variant="secondary"
            size="sm"
            onClick={onOpenCommandPalette}
            icon={Command}
            style={{ height: '38px', padding: '0 10px', fontSize: '0.8125rem' }}
            title="Open Command Palette (Ctrl+K)"
          >
            <span className="desktop-btn-text">Commands</span>
            <kbd
              style={{
                fontSize: '0.625rem',
                color: 'var(--text-muted)',
                background: 'rgba(255, 255, 255, 0.08)',
                padding: '1px 4px',
                borderRadius: 'var(--radius-xs)',
                fontFamily: 'var(--font-mono)'
              }}
            >
              ⌘K
            </kbd>
          </Button>

          {/* Export CSV Button */}
          <Button
            variant="secondary"
            size="sm"
            onClick={onExportCSV}
            icon={Download}
            style={{ height: '38px', padding: '0 10px', fontSize: '0.8125rem' }}
            title="Export Catalog to CSV"
          >
            <span className="desktop-btn-text">Export CSV</span>
          </Button>

          {/* Sort Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ArrowUpDown size={14} color="var(--text-muted)" />
            <select
              value={currentSortValue}
              onChange={handleSortSelectChange}
              className="glass-input"
              aria-label="Sort products"
              style={{
                height: '38px',
                padding: '0 24px 0 10px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8125rem',
                background: 'rgba(255, 255, 255, 0.035)',
                color: 'var(--text-secondary)',
                appearance: 'none',
                WebkitAppearance: 'none',
                cursor: 'pointer'
              }}
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} style={{ background: '#121724', color: '#F8FAFC' }}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* View Mode Toggle: Table vs Cards */}
          <div
            style={{
              display: 'flex',
              background: 'rgba(255, 255, 255, 0.04)',
              borderRadius: 'var(--radius-md)',
              padding: '3px',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <button
              onClick={() => onViewModeChange('table')}
              aria-label="Table View"
              style={{
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm)',
                color: viewMode === 'table' ? 'var(--text-primary)' : 'var(--text-muted)',
                background: viewMode === 'table' ? 'rgba(255, 87, 34, 0.2)' : 'transparent',
                border: viewMode === 'table' ? '1px solid rgba(255, 87, 34, 0.4)' : '1px solid transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all var(--transition-fast)'
              }}
            >
              <List size={16} />
            </button>

            <button
              onClick={() => onViewModeChange('grid')}
              aria-label="Grid Cards View"
              style={{
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm)',
                color: viewMode === 'grid' ? 'var(--text-primary)' : 'var(--text-muted)',
                background: viewMode === 'grid' ? 'rgba(255, 87, 34, 0.2)' : 'transparent',
                border: viewMode === 'grid' ? '1px solid rgba(255, 87, 34, 0.4)' : '1px solid transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all var(--transition-fast)'
              }}
            >
              <LayoutGrid size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Active Filter Pills Bar (Shown only when filters are active) */}
      {hasActiveFilters && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap',
            padding: '2px 4px',
            fontSize: '0.8125rem'
          }}
        >
          <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>
            Active filters:
          </span>

          {search && (
            <span
              className="badge"
              style={{
                background: 'rgba(255, 87, 34, 0.12)',
                color: 'var(--brand-primary)',
                border: '1px solid rgba(255, 87, 34, 0.3)',
                padding: '3px 8px',
                gap: '6px'
              }}
            >
              <span>Search: "{search}"</span>
              <button
                onClick={() => onSearchChange('')}
                style={{ display: 'flex', alignItems: 'center', color: 'inherit' }}
                aria-label="Remove search filter"
              >
                <X size={12} />
              </button>
            </span>
          )}

          {category !== 'all' && (
            <span
              className="badge"
              style={{
                background: 'rgba(255, 87, 34, 0.12)',
                color: 'var(--brand-primary)',
                border: '1px solid rgba(255, 87, 34, 0.3)',
                padding: '3px 8px',
                gap: '6px'
              }}
            >
              <span>Category: {category}</span>
              <button
                onClick={() => onCategoryChange('all')}
                style={{ display: 'flex', alignItems: 'center', color: 'inherit' }}
                aria-label="Remove category filter"
              >
                <X size={12} />
              </button>
            </span>
          )}

          {status !== 'all' && (
            <span
              className="badge"
              style={{
                background: 'rgba(255, 87, 34, 0.12)',
                color: 'var(--brand-primary)',
                border: '1px solid rgba(255, 87, 34, 0.3)',
                padding: '3px 8px',
                gap: '6px'
              }}
            >
              <span>Status: {status}</span>
              <button
                onClick={() => onStatusChange('all')}
                style={{ display: 'flex', alignItems: 'center', color: 'inherit' }}
                aria-label="Remove status filter"
              >
                <X size={12} />
              </button>
            </span>
          )}

          {stockCondition !== 'all' && (
            <span
              className="badge"
              style={{
                background: 'rgba(255, 87, 34, 0.12)',
                color: 'var(--brand-primary)',
                border: '1px solid rgba(255, 87, 34, 0.3)',
                padding: '3px 8px',
                gap: '6px'
              }}
            >
              <span>Stock: {stockCondition.replace('_', ' ')}</span>
              <button
                onClick={() => onStockConditionChange('all')}
                style={{ display: 'flex', alignItems: 'center', color: 'inherit' }}
                aria-label="Remove stock filter"
              >
                <X size={12} />
              </button>
            </span>
          )}

          {(minPrice || maxPrice) && (
            <span
              className="badge"
              style={{
                background: 'rgba(255, 87, 34, 0.12)',
                color: 'var(--brand-primary)',
                border: '1px solid rgba(255, 87, 34, 0.3)',
                padding: '3px 8px',
                gap: '6px'
              }}
            >
              <span>Price: ${minPrice || '0'} – ${maxPrice || '∞'}</span>
              <button
                onClick={() => {
                  onMinPriceChange('');
                  onMaxPriceChange('');
                }}
                style={{ display: 'flex', alignItems: 'center', color: 'inherit' }}
                aria-label="Remove price filter"
              >
                <X size={12} />
              </button>
            </span>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={onResetFilters}
            style={{ fontSize: '0.75rem', height: '26px', padding: '0 8px', color: 'var(--text-muted)' }}
          >
            <RotateCcw size={12} />
            <span>Clear all</span>
          </Button>

          <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--text-faint)' }}>
            Found {totalResults} {totalResults === 1 ? 'product' : 'products'}
          </span>
        </div>
      )}
    </div>
  );
}
