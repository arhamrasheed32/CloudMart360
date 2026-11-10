import { formatCurrencyWithConfig } from '../context/CurrencyContext.jsx';

export function formatCurrency(amount, currencyCode) {
  return formatCurrencyWithConfig(amount, currencyCode);
}

export function formatNumber(num) {
  return new Intl.NumberFormat('en-US').format(Number(num || 0));
}

export function formatDate(dateString) {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '—';

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours < 1 && diffHours >= 0) {
      const minutes = Math.floor(diffMs / (1000 * 60));
      return minutes <= 1 ? 'Just now' : `${minutes}m ago`;
    }
    if (diffHours < 24 && diffHours >= 0) {
      return `${Math.floor(diffHours)}h ago`;
    }
    if (diffHours < 48 && diffHours >= 0) {
      return 'Yesterday';
    }

    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    }).format(date);
  } catch (e) {
    return dateString;
  }
}

export function formatDateTime(dateString) {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '—';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date);
  } catch (e) {
    return dateString;
  }
}

export function getStockStatusInfo(stock, minThreshold = 10) {
  const stockNum = Number(stock || 0);
  const minStock = Number(minThreshold || 10);

  if (stockNum <= 0) {
    return {
      type: 'out_of_stock',
      label: 'Out of Stock',
      variant: 'danger',
      percent: 0
    };
  }
  if (stockNum <= minStock) {
    return {
      type: 'low_stock',
      label: `Low Stock (${stockNum})`,
      variant: 'warning',
      percent: Math.min(Math.round((stockNum / (minStock * 2)) * 100), 100)
    };
  }
  return {
    type: 'in_stock',
    label: 'In Stock',
    variant: 'success',
    percent: Math.min(Math.round((stockNum / 100) * 100), 100)
  };
}

export function truncateText(text, max = 80) {
  if (!text) return '';
  if (text.length <= max) return text;
  return text.substring(0, max).trim() + '...';
}
