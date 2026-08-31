import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, FileText, Tag } from 'lucide-react';

export function Badge({
  children,
  variant = 'default', // 'success' | 'warning' | 'danger' | 'info' | 'draft' | 'brand' | 'category'
  icon: CustomIcon,
  size = 'md', // 'sm' | 'md'
  showDot = false,
  className = '',
  style = {},
  ...props
}) {
  const variantStyles = {
    success: {
      background: 'var(--color-success-bg)',
      color: 'var(--color-success)',
      border: '1px solid var(--color-success-border)'
    },
    warning: {
      background: 'var(--color-warning-bg)',
      color: 'var(--color-warning)',
      border: '1px solid var(--color-warning-border)'
    },
    danger: {
      background: 'var(--color-danger-bg)',
      color: 'var(--color-danger)',
      border: '1px solid var(--color-danger-border)'
    },
    info: {
      background: 'var(--color-info-bg)',
      color: 'var(--color-info)',
      border: '1px solid var(--color-info-border)'
    },
    draft: {
      background: 'var(--color-draft-bg)',
      color: 'var(--color-draft)',
      border: '1px solid var(--color-draft-border)'
    },
    brand: {
      background: 'var(--brand-subtle)',
      color: 'var(--brand-primary)',
      border: '1px solid rgba(255, 87, 34, 0.3)'
    },
    category: {
      background: 'rgba(255, 255, 255, 0.05)',
      color: 'var(--text-secondary)',
      border: '1px solid var(--border-subtle)',
      textTransform: 'none',
      fontWeight: 500
    },
    default: {
      background: 'rgba(255, 255, 255, 0.05)',
      color: 'var(--text-secondary)',
      border: '1px solid var(--border-default)'
    }
  };

  const defaultIcons = {
    success: CheckCircle2,
    warning: AlertTriangle,
    danger: XCircle,
    draft: FileText,
    category: Tag
  };

  const IconComponent = CustomIcon || defaultIcons[variant];

  return (
    <span
      className={`badge ${className}`}
      style={{
        ...variantStyles[variant] || variantStyles.default,
        fontSize: size === 'sm' ? '0.6875rem' : '0.75rem',
        padding: size === 'sm' ? '2px 7px' : '3px 10px',
        ...style
      }}
      {...props}
    >
      {showDot && (
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: 'currentColor'
          }}
        />
      )}
      {IconComponent && !showDot && (
        <IconComponent size={size === 'sm' ? 11 : 13} style={{ flexShrink: 0 }} />
      )}
      <span>{children}</span>
    </span>
  );
}

export function ProductStatusBadge({ status, stock, minStockThreshold = 10 }) {
  const stockNum = Number(stock || 0);

  if (status === 'draft') {
    return <Badge variant="draft">Draft</Badge>;
  }
  if (status === 'archived') {
    return <Badge variant="draft">Archived</Badge>;
  }
  if (stockNum === 0) {
    return <Badge variant="danger">Out of Stock</Badge>;
  }
  if (stockNum <= minStockThreshold) {
    return <Badge variant="warning">Low Stock ({stockNum})</Badge>;
  }
  return <Badge variant="success">Active</Badge>;
}
