import React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export function ToastItem({ toast, onClose }) {
  const { id, type = 'info', title, message } = toast;

  const icons = {
    success: <CheckCircle2 size={18} className="toast-icon text-success" />,
    error: <AlertCircle size={18} className="toast-icon text-danger" />,
    warning: <AlertTriangle size={18} className="toast-icon text-warning" />,
    info: <Info size={18} className="toast-icon text-info" />
  };

  const borderClasses = {
    success: 'border-success',
    error: 'border-danger',
    warning: 'border-warning',
    info: 'border-info'
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className={`toast-notification glass-modal ${borderClasses[type] || 'border-info'}`}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        padding: '14px 18px',
        minWidth: '320px',
        maxWidth: '440px',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-lg)',
        animation: 'scaleUp 180ms ease-out',
        position: 'relative'
      }}
    >
      <div style={{ flexShrink: 0, marginTop: '2px' }}>
        {icons[type] || icons.info}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        {title && (
          <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)', marginBottom: '2px' }}>
            {title}
          </div>
        )}
        <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
          {message}
        </div>
      </div>
      <button
        onClick={() => onClose(id)}
        aria-label="Close notification"
        style={{
          color: 'var(--text-muted)',
          padding: '2px',
          borderRadius: 'var(--radius-xs)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'color var(--transition-fast)'
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
      >
        <X size={16} />
      </button>
    </div>
  );
}

export function ToastContainer({ toasts, onClose }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 'var(--z-toast)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        pointerEvents: 'none'
      }}
    >
      {toasts.map(toast => (
        <div key={toast.id} style={{ pointerEvents: 'auto' }}>
          <ToastItem toast={toast} onClose={onClose} />
        </div>
      ))}
    </div>
  );
}
