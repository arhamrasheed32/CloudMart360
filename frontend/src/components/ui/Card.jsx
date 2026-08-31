import React from 'react';

export function Card({
  children,
  level = 1, // 1 | 2 | 3
  hoverable = false,
  className = '',
  style = {},
  onClick,
  ...props
}) {
  const levelClasses = {
    1: 'glass-panel',
    2: 'glass-elevated',
    3: 'glass-modal'
  };

  return (
    <div
      className={`${levelClasses[level] || 'glass-panel'} ${hoverable ? 'glass-panel-hover' : ''} ${className}`}
      onClick={onClick}
      style={{
        padding: '20px',
        position: 'relative',
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default',
        ...style
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action, style = {} }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px',
        ...style
      }}
    >
      <div>
        {title && (
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            {title}
          </h3>
        )}
        {subtitle && (
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            {subtitle}
          </p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
