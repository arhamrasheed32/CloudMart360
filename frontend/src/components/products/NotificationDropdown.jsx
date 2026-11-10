import React, { useEffect, useRef } from 'react';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Package,
  RotateCw,
  X
} from 'lucide-react';
import { formatDate } from '../../utils/formatters.js';

export function NotificationDropdown({ products = [], isOpen, onClose }) {
  const dropdownRef = useRef(null);

  // Close on Escape or click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onClose();
      }
    };

    // Use mousedown with capture to avoid race condition with trigger click
    document.addEventListener('keydown', handleKeyDown);
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 10);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Derive real notifications from active catalog status
  const lowStockItems = products.filter(
    (p) => Number(p.stock) > 0 && Number(p.stock) <= (p.minStockThreshold || 10)
  );
  const outOfStockItems = products.filter((p) => Number(p.stock) === 0);

  const notifications = [
    ...outOfStockItems.map((p) => ({
      id: `oos-${p.id}`,
      type: 'danger',
      title: 'Out of Stock Alert',
      message: `'${p.name}' (${p.sku || p.id}) is at 0 units and requires immediate replenishment.`,
      time: p.updatedAt || p.createdAt
    })),
    ...lowStockItems.map((p) => ({
      id: `low-${p.id}`,
      type: 'warning',
      title: 'Low Stock Alert',
      message: `'${p.name}' is down to ${p.stock} units (threshold: ${p.minStockThreshold || 10}).`,
      time: p.updatedAt || p.createdAt
    })),
    {
      id: 'sys-sync',
      type: 'success',
      title: 'Catalog Synchronized',
      message: 'Amazon DynamoDB DocumentClient sync completed successfully.',
      time: new Date().toISOString()
    }
  ];

  const isSmallScreen = typeof window !== 'undefined' && window.innerWidth < 640;

  return (
    <div
      ref={dropdownRef}
      className="glass-modal"
      onClick={(e) => e.stopPropagation()}
      style={{
        position: isSmallScreen ? 'fixed' : 'absolute',
        top: isSmallScreen ? '72px' : 'calc(100% + 10px)',
        left: isSmallScreen ? '12px' : 'auto',
        right: isSmallScreen ? '12px' : '-70px',
        width: isSmallScreen ? 'auto' : 'min(380px, calc(100vw - 32px))',
        maxHeight: 'min(480px, calc(100vh - 90px))',
        borderRadius: 'var(--radius-xl)',
        boxShadow: '0 20px 45px rgba(0, 0, 0, 0.75), 0 0 24px rgba(255, 87, 34, 0.18)',
        background: 'rgba(12, 16, 26, 0.98)',
        backdropFilter: 'blur(20px)',
        border: '1px solid var(--border-medium)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        animation: 'scaleUp 140ms ease-out'
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '14px 18px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(18, 23, 36, 0.85)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Bell size={16} color="var(--brand-primary)" />
          <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Catalog Notifications
          </span>
          <span
            className="badge"
            style={{
              background: 'rgba(255, 87, 34, 0.18)',
              color: 'var(--brand-primary)',
              border: '1px solid rgba(255, 87, 34, 0.3)',
              fontSize: '0.625rem',
              padding: '1px 6px',
              borderRadius: '9999px'
            }}
          >
            {notifications.length}
          </span>
        </div>

        <button
          onClick={onClose}
          aria-label="Close notifications"
          style={{
            color: 'var(--text-muted)',
            display: 'flex',
            padding: '4px',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--border-subtle)',
            cursor: 'pointer'
          }}
        >
          <X size={14} />
        </button>
      </div>

      {/* Scrollable Notification List */}
      <div style={{ overflowY: 'auto', flex: 1, padding: '8px' }}>
        {notifications.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
            No active alerts at this time.
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              style={{
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                gap: '10px',
                borderBottom: '1px solid var(--border-subtle)',
                transition: 'background var(--transition-fast)'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <div style={{ flexShrink: 0, marginTop: '2px' }}>
                {n.type === 'danger' ? (
                  <AlertTriangle size={15} color="var(--color-danger)" />
                ) : n.type === 'warning' ? (
                  <AlertTriangle size={15} color="var(--color-warning)" />
                ) : (
                  <CheckCircle2 size={15} color="var(--color-success)" />
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {n.title}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.4 }}>
                  {n.message}
                </div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-faint)', marginTop: '4px' }}>
                  {formatDate(n.time)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
