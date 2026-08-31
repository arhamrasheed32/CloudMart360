export function exportProductsToCSV(products, filename = 'cloudmart360-catalog-export.csv') {
  if (!products || products.length === 0) return;

  const headers = [
    'Product ID',
    'Product Name',
    'SKU',
    'Category',
    'Brand',
    'Selling Price (USD)',
    'Cost Price (USD)',
    'Gross Margin (%)',
    'Stock Quantity',
    'Stock Status',
    'Min Stock Threshold',
    'Listing Status',
    'Description',
    'Created Date',
    'Last Updated'
  ];

  const escapeCSV = (val) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = products.map((p) => {
    const price = Number(p.price || 0);
    const cost = Number(p.costPrice || 0);
    const margin = price > 0 && cost > 0 ? `${Math.round(((price - cost) / price) * 100)}%` : 'N/A';
    const stockStatus = p.stock === 0 ? 'Out of Stock' : p.stock <= (p.minStockThreshold || 10) ? 'Low Stock' : 'In Stock';

    return [
      escapeCSV(p.id),
      escapeCSV(p.name),
      escapeCSV(p.sku),
      escapeCSV(p.category),
      escapeCSV(p.brand || 'CloudMart Retail'),
      escapeCSV(price.toFixed(2)),
      escapeCSV(cost > 0 ? cost.toFixed(2) : '0.00'),
      escapeCSV(margin),
      escapeCSV(p.stock),
      escapeCSV(stockStatus),
      escapeCSV(p.minStockThreshold || 10),
      escapeCSV(p.status || 'active'),
      escapeCSV(p.description || ''),
      escapeCSV(p.createdAt || ''),
      escapeCSV(p.updatedAt || p.createdAt || '')
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
