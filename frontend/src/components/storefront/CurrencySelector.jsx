import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Globe } from 'lucide-react';
import { useCurrency, CURRENCY_CONFIG } from '../../context/CurrencyContext.jsx';
import { playClickTone } from '../../utils/audioFeedback.js';

export function CurrencySelector({ compact = false }) {
  const { currency, setCurrency, activeConfig } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code) => {
    playClickTone();
    setCurrency(code);
    setIsOpen(false);
  };

  const currencyList = Object.values(CURRENCY_CONFIG);

  return (
    <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
      {/* Selector Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select Currency"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        style={{
          height: '38px',
          padding: compact ? '0 10px' : '0 12px',
          borderRadius: 'var(--radius-full, 9999px)',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid var(--border-medium, rgba(255, 255, 255, 0.12))',
          color: 'var(--text-primary, #FFFFFF)',
          fontSize: '0.8125rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '7px',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: isOpen ? '0 0 12px rgba(255, 87, 34, 0.25)' : 'none'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--brand-primary, #FF5722)';
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
        }}
        onMouseLeave={(e) => {
          if (!isOpen) {
            e.currentTarget.style.borderColor = 'var(--border-medium, rgba(255, 255, 255, 0.12))';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
          }
        }}
      >
        <span style={{ fontSize: '1rem', lineHeight: 1 }}>{activeConfig.flag}</span>
        <span style={{ letterSpacing: '0.02em' }}>{activeConfig.code} ({activeConfig.symbol})</span>
        <ChevronDown
          size={14}
          style={{
            color: 'var(--text-muted, #9CA3AF)',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease'
          }}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          role="listbox"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            width: '230px',
            background: 'rgba(13, 17, 28, 0.95)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '16px',
            padding: '8px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(255, 87, 34, 0.15)',
            backdropFilter: 'blur(24px)',
            zIndex: 100,
            animation: 'fadeIn 0.15s ease-out'
          }}
        >
          <div
            style={{
              padding: '6px 10px',
              fontSize: '0.6875rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--text-muted, #9CA3AF)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
              marginBottom: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Globe size={12} color="var(--brand-primary, #FF5722)" />
            <span>Select Currency</span>
          </div>

          {currencyList.map((c) => {
            const isSelected = c.code === currency;
            return (
              <div
                key={c.code}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(c.code)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  background: isSelected ? 'rgba(255, 87, 34, 0.15)' : 'transparent',
                  border: isSelected ? '1px solid rgba(255, 87, 34, 0.35)' : '1px solid transparent',
                  transition: 'all 0.15s ease',
                  marginBottom: '2px'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>{c.flag}</span>
                  <div>
                    <div
                      style={{
                        fontSize: '0.8125rem',
                        fontWeight: isSelected ? 800 : 600,
                        color: isSelected ? 'var(--brand-primary, #FF5722)' : 'var(--text-primary, #FFFFFF)'
                      }}
                    >
                      {c.code} ({c.symbol})
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted, #9CA3AF)' }}>
                      {c.name}
                    </div>
                  </div>
                </div>

                {isSelected && (
                  <Check size={16} color="var(--brand-primary, #FF5722)" strokeWidth={2.5} />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
