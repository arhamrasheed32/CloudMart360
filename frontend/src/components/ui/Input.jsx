import React, { forwardRef, useId } from 'react';
import { AlertCircle } from 'lucide-react';

export const Input = forwardRef(function Input(
  {
    label,
    name,
    id,
    type = 'text',
    value,
    defaultValue,
    onChange,
    placeholder,
    helperText,
    error,
    required = false,
    disabled = false,
    icon: Icon,
    suffix,
    className = '',
    style = {},
    inputStyle = {},
    ...props
  },
  ref
) {
  const generatedId = useId();
  const inputId = id || name || generatedId;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', ...style }}>
      {label && (
        <label
          htmlFor={inputId}
          style={{
            fontSize: '0.8125rem',
            fontWeight: 600,
            color: error ? 'var(--color-danger)' : 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          {label}
          {required && <span style={{ color: 'var(--brand-primary)' }}>*</span>}
        </label>
      )}

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
        {Icon && (
          <div
            style={{
              position: 'absolute',
              left: '12px',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              pointerEvents: 'none',
              zIndex: 2
            }}
          >
            <Icon size={16} />
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          name={name}
          type={type}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`glass-input ${error ? 'border-danger' : ''} ${className}`}
          style={{
            width: '100%',
            height: '40px',
            padding: Icon ? '0 12px 0 38px' : suffix ? '0 38px 0 12px' : '0 12px',
            background: 'rgba(255, 255, 255, 0.035)',
            border: error ? '1px solid var(--color-danger)' : '1px solid var(--border-default)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-primary)',
            fontSize: '0.875rem',
            opacity: disabled ? 0.6 : 1,
            ...inputStyle
          }}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          {...props}
        />

        {suffix && (
          <div
            style={{
              position: 'absolute',
              right: '12px',
              color: 'var(--text-muted)',
              fontSize: '0.8125rem',
              display: 'flex',
              alignItems: 'center',
              pointerEvents: 'none'
            }}
          >
            {suffix}
          </div>
        )}
      </div>

      {error ? (
        <div
          id={`${inputId}-error`}
          role="alert"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '0.75rem',
            color: 'var(--color-danger)',
            marginTop: '2px'
          }}
        >
          <AlertCircle size={13} />
          <span>{error}</span>
        </div>
      ) : helperText ? (
        <div
          id={`${inputId}-helper`}
          style={{
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            marginTop: '2px'
          }}
        >
          {helperText}
        </div>
      ) : null}
    </div>
  );
});
