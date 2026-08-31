import React, { useState } from 'react';

export function Tooltip({ text, children, position = 'top' }) {
  const [isVisible, setIsVisible] = useState(false);

  const positionStyles = {
    top: {
      bottom: '100%',
      left: '50%',
      transform: 'translateX(-50%)',
      marginBottom: '6px'
    },
    bottom: {
      top: '100%',
      left: '50%',
      transform: 'translateX(-50%)',
      marginTop: '6px'
    },
    right: {
      top: '50%',
      left: '100%',
      transform: 'translateY(-50%)',
      marginLeft: '6px'
    }
  };

  return (
    <div
      style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && text && (
        <div
          role="tooltip"
          className="glass-modal"
          style={{
            position: 'absolute',
            zIndex: 'var(--z-tooltip)',
            padding: '4px 8px',
            fontSize: '0.6875rem',
            fontWeight: 500,
            color: 'var(--text-primary)',
            background: 'rgba(10, 14, 22, 0.95)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-xs)',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            boxShadow: 'var(--shadow-md)',
            animation: 'fadeIn 120ms ease-out',
            ...positionStyles[position]
          }}
        >
          {text}
        </div>
      )}
    </div>
  );
}
