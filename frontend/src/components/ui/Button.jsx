import React from 'react';
import { Loader2 } from 'lucide-react';

export function Button({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
  size = 'md', // 'sm' | 'md' | 'lg'
  icon: Icon,
  iconRight: IconRight,
  isLoading = false,
  disabled = false,
  className = '',
  style = {},
  onClick,
  type = 'button',
  ...props
}) {
  const sizeStyles = {
    sm: {
      padding: '6px 12px',
      fontSize: '0.8125rem',
      height: '32px',
      gap: '6px'
    },
    md: {
      padding: '8px 16px',
      fontSize: '0.875rem',
      height: '40px',
      gap: '8px'
    },
    lg: {
      padding: '12px 22px',
      fontSize: '0.9375rem',
      height: '46px',
      gap: '10px'
    }
  };

  const variantStyles = {
    primary: {
      background: 'linear-gradient(135deg, #FF5722 0%, #E64A19 100%)',
      color: '#FFFFFF',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 2px 10px rgba(255, 87, 34, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.25)'
    },
    secondary: {
      background: 'rgba(255, 255, 255, 0.06)',
      color: 'var(--text-primary)',
      border: '1px solid var(--border-medium)',
      boxShadow: 'var(--shadow-sm)'
    },
    outline: {
      background: 'transparent',
      color: 'var(--text-primary)',
      border: '1px solid var(--border-medium)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-secondary)',
      border: '1px solid transparent'
    },
    danger: {
      background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
      color: '#FFFFFF',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 2px 10px rgba(239, 68, 68, 0.35)'
    }
  };

  const isDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={`glass-btn ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 'var(--radius-md)',
        fontWeight: 600,
        letterSpacing: '-0.01em',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: isDisabled ? 0.6 : 1,
        transition: 'all var(--transition-fast)',
        userSelect: 'none',
        whiteSpace: 'nowrap',
        ...sizeStyles[size],
        ...variantStyles[variant],
        ...style
      }}
      onMouseEnter={(e) => {
        if (isDisabled) return;
        if (variant === 'primary') {
          e.currentTarget.style.boxShadow = '0 4px 16px rgba(255, 87, 34, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.35)';
          e.currentTarget.style.transform = 'translateY(-1px)';
        } else if (variant === 'secondary' || variant === 'outline') {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
          e.currentTarget.style.borderColor = 'var(--border-highlight)';
        } else if (variant === 'ghost') {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
          e.currentTarget.style.color = 'var(--text-primary)';
        } else if (variant === 'danger') {
          e.currentTarget.style.boxShadow = '0 4px 16px rgba(239, 68, 68, 0.5)';
          e.currentTarget.style.transform = 'translateY(-1px)';
        }
      }}
      onMouseLeave={(e) => {
        if (isDisabled) return;
        e.currentTarget.style.transform = 'none';
        if (variant === 'primary') {
          e.currentTarget.style.boxShadow = '0 2px 10px rgba(255, 87, 34, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.25)';
        } else if (variant === 'secondary') {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
          e.currentTarget.style.borderColor = 'var(--border-medium)';
        } else if (variant === 'outline') {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.borderColor = 'var(--border-medium)';
        } else if (variant === 'ghost') {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = 'var(--text-secondary)';
        } else if (variant === 'danger') {
          e.currentTarget.style.boxShadow = '0 2px 10px rgba(239, 68, 68, 0.35)';
        }
      }}
      onMouseDown={(e) => {
        if (isDisabled) return;
        e.currentTarget.style.transform = 'translateY(1px) scale(0.99)';
      }}
      onMouseUp={(e) => {
        if (isDisabled) return;
        e.currentTarget.style.transform = 'none';
      }}
      {...props}
    >
      {isLoading ? (
        <Loader2 size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
      ) : Icon ? (
        <Icon size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} />
      ) : null}
      {children}
      {!isLoading && IconRight ? (
        <IconRight size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} />
      ) : null}
    </button>
  );
}
