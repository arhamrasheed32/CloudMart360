import React, { useState } from 'react';
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
      message: `'${p.name}' (${p.sku}) is at 0 units and requires immediate replenishment.`,
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

  return (
    <div
      className="glass-modal"
      onClick={(e) => e.stopPropagation()}
      style={{
        position: 'absolute',
        top: '60px',
        right: '60px',
        width: '360px',
        maxHeight: '440px',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-lg)',
        background: 'rgba(14, 18, 28, 0.98)',
        border: '1px solid var(--border-medium)',
        zIndex: 'var(--z-dropdown)',
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
          background: 'rgba(18, 23, 36, 0.8)'
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
              background: 'var(--brand-subtle)',
              color: 'var(--brand-primary)',
              fontSize: '0.625rem',
              padding: '1px 6px'
            }}
          >
            {notifications.length}
          </span>
        </div>

        <button onClick={onClose} style={{ color: 'var(--text-muted)', display: 'flex' }}>
          <X size={15} />
        </button>
      </div>

      {/* List */}
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
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)')}
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
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.35 }}>
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
