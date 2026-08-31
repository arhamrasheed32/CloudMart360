import React, { forwardRef, useId } from 'react';
import { ChevronDown, AlertCircle } from 'lucide-react';

export const Select = forwardRef(function Select(
  {
    label,
    name,
    id,
    value,
    defaultValue,
    onChange,
    options = [],
    placeholder = 'Select option...',
    helperText,
    error,
    required = false,
    disabled = false,
    className = '',
    style = {},
    ...props
  },
  ref
) {
  const generatedId = useId();
  const selectId = id || name || generatedId;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', ...style }}>
      {label && (
        <label
          htmlFor={selectId}
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
        <select
          ref={ref}
          id={selectId}
          name={name}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`glass-input ${error ? 'border-danger' : ''} ${className}`}
          style={{
            width: '100%',
            height: '40px',
            padding: '0 36px 0 12px',
            background: 'var(--bg-surface)',
            border: error ? '1px solid var(--color-danger)' : '1px solid var(--border-default)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-primary)',
            fontSize: '0.875rem',
            appearance: 'none',
            WebkitAppearance: 'none',
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.6 : 1
          }}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined}
          {...props}
        >
          {placeholder && (
            <option value="" disabled style={{ background: '#121724', color: '#64748B' }}>
              {placeholder}
            </option>
          )}
          {options.map((opt) => {
            const optVal = typeof opt === 'object' ? opt.value : opt;
            const optLabel = typeof opt === 'object' ? opt.label : opt;
            return (
              <option
                key={optVal}
                value={optVal}
                style={{ background: '#121724', color: '#F8FAFC' }}
              >
                {optLabel}
              </option>
            );
          })}
        </select>

        <div
          style={{
            position: 'absolute',
            right: '12px',
            color: 'var(--text-muted)',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <ChevronDown size={16} />
        </div>
      </div>

      {error ? (
        <div
          id={`${selectId}-error`}
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
          id={`${selectId}-helper`}
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
