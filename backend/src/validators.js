export const VALID_CATEGORIES = [
  'Electronics',
  'Apparel & Fashion',
  'Home & Kitchen',
  'Health & Beauty',
  'Sports & Outdoors',
  'Accessories',
  'Groceries',
  'Books & Stationery',
  'Other'
];

export const VALID_STATUSES = ['active', 'draft', 'archived'];

export function validateProductInput(data, isUpdate = false) {
  const errors = {};

  if (!isUpdate || data.name !== undefined) {
    if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
      errors.name = 'Product name is required';
    } else if (data.name.trim().length < 2) {
      errors.name = 'Product name must be at least 2 characters';
    } else if (data.name.trim().length > 150) {
      errors.name = 'Product name must not exceed 150 characters';
    }
  }

  if (!isUpdate || data.price !== undefined) {
    const priceNum = Number(data.price);
    if (data.price === undefined || data.price === null || isNaN(priceNum)) {
      errors.price = 'Valid price is required';
    } else if (priceNum < 0) {
      errors.price = 'Price cannot be negative';
    } else if (priceNum > 1000000) {
      errors.price = 'Price exceeds maximum allowed limit ($1,000,000)';
    }
  }

  if (data.costPrice !== undefined && data.costPrice !== null && data.costPrice !== '') {
    const costNum = Number(data.costPrice);
    if (isNaN(costNum) || costNum < 0) {
      errors.costPrice = 'Cost price must be a non-negative number';
    }
  }

  if (!isUpdate || data.stock !== undefined) {
    const stockNum = Number(data.stock);
    if (data.stock === undefined || data.stock === null || isNaN(stockNum) || !Number.isInteger(stockNum)) {
      errors.stock = 'Stock quantity must be a whole integer';
    } else if (stockNum < 0) {
      errors.stock = 'Stock quantity cannot be negative';
    }
  }

  if (data.minStockThreshold !== undefined && data.minStockThreshold !== null && data.minStockThreshold !== '') {
    const minThreshold = Number(data.minStockThreshold);
    if (isNaN(minThreshold) || minThreshold < 0 || !Number.isInteger(minThreshold)) {
      errors.minStockThreshold = 'Low stock threshold must be a non-negative integer';
    }
  }

  if (!isUpdate || data.category !== undefined) {
    if (!data.category || typeof data.category !== 'string') {
      errors.category = 'Category is required';
    }
  }

  if (data.status !== undefined) {
    if (!VALID_STATUSES.includes(data.status)) {
      errors.status = `Status must be one of: ${VALID_STATUSES.join(', ')}`;
    }
  }

  if (data.hasVariants) {
    if (!Array.isArray(data.variants) || data.variants.length === 0) {
      errors.variants = 'At least one variant is required when variants are enabled';
    } else {
      data.variants.forEach((v, index) => {
        if (!v.sku || !v.title) errors[`variant_${index}`] = `Variant ${index + 1} must have a SKU and Title`;
      });
    }
  }

  if (data.sku !== undefined && data.sku !== null && data.sku.trim().length > 0) {
    if (data.sku.trim().length > 50) {
      errors.sku = 'SKU must not exceed 50 characters';
    }
  }

  if (data.description !== undefined && data.description !== null) {
    if (data.description.length > 2000) {
      errors.description = 'Description must not exceed 2000 characters';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function sanitizeProduct(data) {
  const sanitized = { ...data };
  if (sanitized.name) sanitized.name = sanitized.name.trim();
  if (sanitized.sku) sanitized.sku = sanitized.sku.trim().toUpperCase();
  if (sanitized.price !== undefined) sanitized.price = Math.round(Number(sanitized.price) * 100) / 100;
  if (sanitized.costPrice !== undefined && sanitized.costPrice !== '') {
    sanitized.costPrice = Math.round(Number(sanitized.costPrice) * 100) / 100;
  }
  if (sanitized.stock !== undefined) sanitized.stock = parseInt(sanitized.stock, 10);
  if (sanitized.minStockThreshold !== undefined && sanitized.minStockThreshold !== '') {
    sanitized.minStockThreshold = parseInt(sanitized.minStockThreshold, 10);
  } else if (!sanitized.minStockThreshold) {
    sanitized.minStockThreshold = 10;
  }
  if (sanitized.status) sanitized.status = sanitized.status.toLowerCase();
  if (sanitized.hasVariants && Array.isArray(sanitized.variants) && sanitized.variants.length > 0) {
    sanitized.variants = sanitized.variants.map((v, i) => ({
      id: v.id || `var-${i + 1}-${Date.now()}`,
      sku: v.sku ? String(v.sku).trim().toUpperCase() : `${sanitized.sku || 'CM-VAR'}-${i + 1}`,
      title: v.title ? String(v.title).trim() : `Variant ${i + 1}`,
      attributes: typeof v.attributes === 'object' && v.attributes !== null ? v.attributes : {},
      price: !isNaN(Number(v.price)) ? Math.round(Number(v.price) * 100) / 100 : sanitized.price,
      costPrice: v.costPrice !== undefined && v.costPrice !== '' && !isNaN(Number(v.costPrice)) ? Math.round(Number(v.costPrice) * 100) / 100 : sanitized.costPrice,
      stock: !isNaN(parseInt(v.stock, 10)) ? Math.max(0, parseInt(v.stock, 10)) : 0
    }));
    sanitized.stock = sanitized.variants.reduce((sum, v) => sum + v.stock, 0);
  }
  return sanitized;
}
