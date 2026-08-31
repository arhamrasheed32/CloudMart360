import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Plus,
  AlertTriangle,
  XCircle,
  Download,
  RotateCw,
  LayoutGrid,
  List,
  Package,
  ArrowRight,
  Sparkles,
  Command
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters.js';

export function CommandPalette({
  isOpen,
  onClose,
  products = [],
  onSelectProduct,
  onAddProduct,
  onFilterLowStock,
  onFilterOutOfStock,
  onExportCSV,
  onRefresh,
  onToggleViewMode
}) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Global key listener for Ctrl+K / Cmd+K
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Build items list
  const quickActions = [
    {
      id: 'action-add',
      type: 'action',
      title: 'Create New Product',
      subtitle: 'Open product creation drawer',
      icon: Plus,
      shortcut: 'N',
      run: () => {
        onClose();
        onAddProduct();
      }
    },
    {
      id: 'action-low-stock',
      type: 'action',
      title: 'Filter: Low Stock Alerts',
      subtitle: 'View items below safety threshold',
      icon: AlertTriangle,
      iconColor: 'var(--color-warning)',
      run: () => {
        onClose();
        onFilterLowStock();
      }
    },
    {
      id: 'action-out-of-stock',
      type: 'action',
      title: 'Filter: Out of Stock',
      subtitle: 'View items requiring replenishment',
      icon: XCircle,
      iconColor: 'var(--color-danger)',
      run: () => {
        onClose();
        onFilterOutOfStock();
      }
    },
    {
      id: 'action-export',
      type: 'action',
      title: 'Export Catalog as CSV',
      subtitle: 'Download complete inventory spreadsheet',
      icon: Download,
      run: () => {
        onClose();
        onExportCSV();
      }
    },
    {
      id: 'action-sync',
      type: 'action',
      title: 'Synchronize Catalog',
      subtitle: 'Fetch latest records from Amazon DynamoDB',
      icon: RotateCw,
      run: () => {
        onClose();
        onRefresh();
      }
    },
    {
      id: 'action-toggle-view',
      type: 'action',
      title: 'Toggle View Mode',
      subtitle: 'Switch between Data Table and Card Grid',
      icon: LayoutGrid,
      run: () => {
        onClose();
        onToggleViewMode();
      }
    }
  ];

  const filteredActions = query.trim()
    ? quickActions.filter(
        (a) =>
          a.title.toLowerCase().includes(query.toLowerCase()) ||
          a.subtitle.toLowerCase().includes(query.toLowerCase())
      )
    : quickActions;

  const filteredProducts = query.trim()
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            (p.sku && p.sku.toLowerCase().includes(query.toLowerCase())) ||
            (p.category && p.category.toLowerCase().includes(query.toLowerCase())) ||
            (p.brand && p.brand.toLowerCase().includes(query.toLowerCase()))
        )
        .slice(0, 6)
    : [];

  const combinedItems = [
    ...filteredActions.map((item) => ({ ...item, section: 'Actions' })),
    ...filteredProducts.map((product) => ({
      id: product.id,
      type: 'product',
      title: product.name,
      subtitle: `${product.sku} • ${product.category} • ${formatCurrency(product.price)} • Stock: ${product.stock}`,
      product,
      section: 'Products'
    }))
  ];

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, combinedItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + combinedItems.length) % Math.max(1, combinedItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const current = combinedItems[selectedIndex];
      if (current) {
        if (current.type === 'action') {
          current.run();
        } else if (current.type === 'product') {
          onClose();
          onSelectProduct(current.product);
        }
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{ alignItems: 'flex-start', paddingTop: '12vh' }}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="glass-modal"
        style={{
          width: '100%',
          maxWidth: '620px',
          padding: 0,
          overflow: 'hidden',
          borderRadius: 'var(--radius-2xl)',
          boxShadow: '0 24px 64px -8px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(255, 87, 34, 0.25)',
          animation: 'scaleUp 150ms ease-out'
        }}
      >
        {/* Search Header Input */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-default)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'rgba(18, 23, 36, 0.95)'
          }}
        >
          <Search size={20} color="var(--brand-primary)" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search products by name, SKU, brand..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontSize: '1rem',
              fontFamily: 'var(--font-sans)'
            }}
          />
          <kbd
            style={{
              fontSize: '0.6875rem',
              color: 'var(--text-muted)',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid var(--border-subtle)',
              padding: '2px 6px',
              borderRadius: 'var(--radius-xs)',
              fontFamily: 'var(--font-mono)'
            }}
          >
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div
          ref={listRef}
          style={{
            maxHeight: '360px',
            overflowY: 'auto',
            padding: '10px 8px'
          }}
        >
          {combinedItems.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              No commands or products found for "{query}"
            </div>
          ) : (
            combinedItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              const Icon = item.icon || Package;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    if (item.type === 'action') item.run();
                    else {
                      onClose();
                      onSelectProduct(item.product);
                    }
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    background: isSelected ? 'rgba(255, 87, 34, 0.14)' : 'transparent',
                    border: isSelected ? '1px solid rgba(255, 87, 34, 0.3)' : '1px solid transparent',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: 'var(--radius-sm)',
                        background: isSelected ? 'rgba(255, 87, 34, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: item.iconColor || (isSelected ? 'var(--brand-primary)' : 'var(--text-muted)'),
                        flexShrink: 0
                      }}
                    >
                      <Icon size={16} />
                    </div>

                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {item.title}
                      </div>
                      <div
                        style={{
                          fontSize: '0.75rem',
                          color: isSelected ? 'var(--text-secondary)' : 'var(--text-muted)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {item.subtitle}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {item.shortcut && (
                      <kbd
                        style={{
                          fontSize: '0.6875rem',
                          color: 'var(--text-muted)',
                          background: 'rgba(255, 255, 255, 0.06)',
                          padding: '1px 5px',
                          borderRadius: 'var(--radius-xs)',
                          fontFamily: 'var(--font-mono)'
                        }}
                      >
                        {item.shortcut}
                      </kbd>
                    )}
                    {isSelected && (
                      <ArrowRight size={14} color="var(--brand-primary)" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Shortcut Bar */}
        <div
          style={{
            padding: '10px 18px',
            borderTop: '1px solid var(--border-subtle)',
            background: 'rgba(14, 18, 28, 0.98)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.75rem',
            color: 'var(--text-muted)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span><kbd style={{ fontFamily: 'var(--font-mono)' }}>↑↓</kbd> Navigate</span>
            <span><kbd style={{ fontFamily: 'var(--font-mono)' }}>↵</kbd> Select</span>
            <span><kbd style={{ fontFamily: 'var(--font-mono)' }}>ESC</kbd> Close</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={12} color="var(--brand-primary)" />
            <span>CloudMart 360 Command Bar</span>
          </div>
        </div>
      </div>
    </div>
  );
}
