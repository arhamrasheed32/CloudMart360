import React, { createContext, useContext, useState, useEffect } from 'react';

const RATES = {
  USD: { symbol: '$', rate: 1.0, label: 'USD ($)', flag: '🇺🇸' },
  EUR: { symbol: '€', rate: 0.92, label: 'EUR (€)', flag: '🇪🇺' },
  GBP: { symbol: '£', rate: 0.79, label: 'GBP (£)', flag: '🇬🇧' },
  JPY: { symbol: '¥', rate: 154.5, label: 'JPY (¥)', flag: '🇯🇵' },
  CAD: { symbol: 'CA$', rate: 1.36, label: 'CAD ($)', flag: '🇨🇦' },
  AUD: { symbol: 'AU$', rate: 1.52, label: 'AUD ($)', flag: '🇦🇺' }
};

const CurrencyContext = createContext();

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('cloudmart_currency') || 'USD';
  });

  useEffect(() => {
    localStorage.setItem('cloudmart_currency', currency);
  }, [currency]);

  const activeRate = RATES[currency] || RATES.USD;

  const formatPrice = (amountInUSD) => {
    const num = Number(amountInUSD) || 0;
    const converted = num * activeRate.rate;

    if (currency === 'JPY') {
      return `${activeRate.symbol}${Math.round(converted).toLocaleString()}`;
    }

    return `${activeRate.symbol}${converted.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        rates: RATES,
        activeRate,
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
