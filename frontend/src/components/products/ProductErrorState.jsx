import React from 'react';
import { AlertCircle, RotateCw, ServerOff } from 'lucide-react';
import { Button } from '../ui/Button.jsx';

export function ProductErrorState({
  errorMessage,
  onRetry,
  isRetrying = false
}) {
  return (
    <div
      className="glass-panel"
      style={{
        padding: '56px 24px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--color-danger-border)',
        minHeight: '340px'
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'var(--color-danger-bg)',
          border: '1px solid var(--color-danger-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-danger)',
          marginBottom: '16px',
          boxShadow: '0 0 24px rgba(239, 68, 68, 0.25)'
        }}
      >
        <ServerOff size={30} />
      </div>

      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
        Unable to Load Product Catalog
      </h3>

      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', maxWidth: '480px', marginBottom: '8px', lineHeight: 1.5 }}>
        An error occurred while communicating with the AWS API Gateway & Lambda service.
      </p>

      {errorMessage && (
        <div
          className="font-mono"
          style={{
            fontSize: '0.75rem',
            color: 'var(--color-danger)',
            background: 'rgba(239, 68, 68, 0.08)',
            padding: '8px 14px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            maxWidth: '500px',
            marginBottom: '24px',
            wordBreak: 'break-word'
          }}
        >
          {errorMessage}
        </div>
      )}

      <Button
        variant="primary"
        onClick={onRetry}
        isLoading={isRetrying}
        icon={RotateCw}
      >
        Retry Connection
      </Button>
    </div>
  );
}
