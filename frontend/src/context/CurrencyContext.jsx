import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

/**
 * 6 Supported Currencies with exact ISO codes, symbols, locales, and demonstration exchange rates (base: USD = 1.00)
 */
export const CURRENCY_CONFIG = {
  USD: {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    rate: 1.00,
    locale: 'en-US',
    flag: '🇺🇸',
    label: 'USD ($)'
  },
  INR: {
    code: 'INR',
    name: 'Indian Rupee',
    symbol: '₹',
    rate: 88.00,
    locale: 'en-IN',
    flag: '🇮🇳',
    label: 'INR (₹)'
  },
  EUR: {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    rate: 0.86,
    locale: 'de-DE',
    flag: '🇪🇺',
    label: 'EUR (€)'
  },
  GBP: {
    code: 'GBP',
    name: 'British Pound',
    symbol: '£',
    rate: 0.75,
    locale: 'en-GB',
    flag: '🇬🇧',
    label: 'GBP (£)'
  },
  AED: {
    code: 'AED',
    name: 'UAE Dirham',
    symbol: 'د.إ',
    rate: 3.6725,
    locale: 'ar-AE',
    flag: '🇦🇪',
    label: 'AED (د.إ)'
  },
  SAR: {
    code: 'SAR',
    name: 'Saudi Riyal',
    symbol: '﷼',
    rate: 3.75,
    locale: 'ar-SA',
    flag: '🇸🇦',
    label: 'SAR (﷼)'
  }
};

const CurrencyContext = createContext(null);

// Global subscriber mechanism so non-React formatCurrency helper stays 100% in sync
let globalCurrencyCode = 'USD';
const currencyListeners = new Set();

export function setGlobalCurrencyHelper(code) {
  if (CURRENCY_CONFIG[code]) {
    globalCurrencyCode = code;
    currencyListeners.forEach((fn) => fn(code));
  }
}

export function getGlobalCurrencyCode() {
  return globalCurrencyCode;
}

/**
 * Centralized formatting function adhering to Intl.NumberFormat standards
 */
export function formatCurrencyWithConfig(amountInUSD, currencyCode = globalCurrencyCode) {
  const num = Number(amountInUSD || 0);
  const cfg = CURRENCY_CONFIG[currencyCode] || CURRENCY_CONFIG.USD;
  const convertedAmount = num * cfg.rate;

  try {
    return new Intl.NumberFormat(cfg.locale, {
      style: 'currency',
      currency: cfg.code,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(convertedAmount);
  } catch (err) {
    // Fallback if environment lacks locale data
    return `${cfg.symbol}${convertedAmount.toFixed(2)}`;
  }
}

export function CurrencyProvider({ children }) {
  const [currency, setCurrencyState] = useState(() => {
    try {
      const saved = localStorage.getItem('cloudmart_currency');
      return saved && CURRENCY_CONFIG[saved] ? saved : 'USD';
    } catch {
      return 'USD';
    }
  });

  // Keep global state and storage in sync
  useEffect(() => {
    setGlobalCurrencyHelper(currency);
    try {
      localStorage.setItem('cloudmart_currency', currency);
    } catch (e) {
      console.warn('Unable to persist currency selection:', e);
    }
  }, [currency]);

  const setCurrency = useCallback((code) => {
    if (CURRENCY_CONFIG[code]) {
      setCurrencyState(code);
      setGlobalCurrencyHelper(code);
    }
  }, []);

  const activeConfig = CURRENCY_CONFIG[currency] || CURRENCY_CONFIG.USD;

  // Converts any USD base amount to current currency number
  const convertAmount = useCallback((amountInUSD) => {
    const num = Number(amountInUSD || 0);
    return num * activeConfig.rate;
  }, [activeConfig.rate]);

  // Formats any USD base amount to current currency string
  const formatPrice = useCallback((amountInUSD) => {
    return formatCurrencyWithConfig(amountInUSD, currency);
  }, [currency]);

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        currencies: CURRENCY_CONFIG,
        rates: CURRENCY_CONFIG,
        activeConfig,
        activeRate: activeConfig,
        convertAmount,
        formatPrice
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
