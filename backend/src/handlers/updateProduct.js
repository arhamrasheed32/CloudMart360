import { dbService } from '../db.js';
import { validateProductInput, sanitizeProduct } from '../validators.js';

export const handler = async (event = {}) => {
  try {
    const id = event.pathParameters?.id;
    if (!id) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ success: false, error: 'Product ID parameter is required' })
      };
    }

    const existingProduct = await dbService.getProductById(id);
    if (!existingProduct) {
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ success: false, error: `Product with ID '${id}' not found` })
      };
    }

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

    const { isValid, errors } = validateProductInput(body, true);
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
    const updates = {
      ...sanitized,
      updatedAt: new Date().toISOString()
    };

    const updated = await dbService.updateProduct(id, updates);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        success: true,
        message: 'Product updated successfully in DynamoDB',
        data: updated
      })
    };
  } catch (error) {
    console.error('[Lambda: updateProduct] Error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        success: false,
        error: 'Failed to update product in DynamoDB',
        message: error.message
      })
    };
  }
};
