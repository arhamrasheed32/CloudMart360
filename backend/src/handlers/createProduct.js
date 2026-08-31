import { v4 as uuidv4 } from 'uuid';
import { dbService } from '../db.js';
import { validateProductInput, sanitizeProduct } from '../validators.js';

function generateSku(category, name) {
  const catPrefix = (category || 'GEN').substring(0, 3).toUpperCase().replace(/[^A-Z]/g, 'X');
  const namePrefix = (name || 'PRD').substring(0, 3).toUpperCase().replace(/[^A-Z]/g, 'X');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `CM-${catPrefix}-${namePrefix}-${randomSuffix}`;
}

export const handler = async (event = {}) => {
  try {
    let body = {};
    if (typeof event.body === 'string') {
      try {
        body = JSON.parse(event.body);
      } catch (err) {
        return {
          statusCode: 400,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
          body: JSON.stringify({ success: false, error: 'Invalid JSON request body' })
        };
      }
    } else if (event.body) {
      body = event.body;
    }

    const { isValid, errors } = validateProductInput(body, false);
    if (!isValid) {
      return {
        statusCode: 422,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({
          success: false,
          error: 'Validation failed',
          validationErrors: errors
        })
      };
    }

    const sanitized = sanitizeProduct(body);
    const now = new Date().toISOString();
    const newProduct = {
      id: uuidv4(),
      name: sanitized.name,
      sku: sanitized.sku || generateSku(sanitized.category, sanitized.name),
      category: sanitized.category,
      price: sanitized.price,
      costPrice: sanitized.costPrice || null,
      stock: sanitized.stock,
      minStockThreshold: sanitized.minStockThreshold || 10,
      status: sanitized.status || (sanitized.stock === 0 ? 'draft' : 'active'),
      brand: sanitized.brand || 'CloudMart Retail',
      description: sanitized.description || '',
      imageUrl: sanitized.imageUrl || '',
      tags: Array.isArray(sanitized.tags) ? sanitized.tags : [],
      createdAt: now,
      updatedAt: now
    };

    const created = await dbService.createProduct(newProduct);

    return {
      statusCode: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        success: true,
        message: 'Product created successfully in DynamoDB',
        data: created
      })
    };
  } catch (error) {
    console.error('[Lambda: createProduct] Error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        success: false,
        error: 'Failed to create product in DynamoDB',
        message: error.message
      })
    };
  }
};
