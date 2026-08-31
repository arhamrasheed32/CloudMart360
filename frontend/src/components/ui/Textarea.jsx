import React, { forwardRef, useId } from 'react';
import { AlertCircle } from 'lucide-react';

export const Textarea = forwardRef(function Textarea(
  {
    label,
    name,
    id,
    value,
    defaultValue,
    onChange,
    placeholder,
    helperText,
    error,
    required = false,
    disabled = false,
    rows = 3,
    maxLength,
    className = '',
    style = {},
    ...props
  },
  ref
) {
  const generatedId = useId();
  const textareaId = id || name || generatedId;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', ...style }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {label && (
          <label
            htmlFor={textareaId}
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
        {maxLength && typeof value === 'string' && (
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {value.length} / {maxLength}
          </span>
        )}
      </div>

      <textarea
        ref={ref}
        id={textareaId}
        name={name}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        rows={rows}
        maxLength={maxLength}
        className={`glass-input ${error ? 'border-danger' : ''} ${className}`}
        style={{
          width: '100%',
          padding: '10px 12px',
          background: 'rgba(255, 255, 255, 0.035)',
          border: error ? '1px solid var(--color-danger)' : '1px solid var(--border-default)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--text-primary)',
          fontSize: '0.875rem',
          resize: 'vertical',
          minHeight: '80px',
          opacity: disabled ? 0.6 : 1
        }}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined}
        {...props}
      />

      {error ? (
        <div
          id={`${textareaId}-error`}
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
          id={`${textareaId}-helper`}
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
