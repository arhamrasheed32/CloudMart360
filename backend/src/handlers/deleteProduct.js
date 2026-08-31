import { dbService } from '../db.js';

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

    const existing = await dbService.getProductById(id);
    if (!existing) {
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ success: false, error: `Product with ID '${id}' not found` })
      };
    }

    const deleted = await dbService.deleteProduct(id);
    if (!deleted) {
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ success: false, error: `Failed to delete product '${id}'` })
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        success: true,
        message: `Product '${existing.name}' (${id}) deleted permanently from DynamoDB`,
        data: { id, name: existing.name }
      })
    };
  } catch (error) {
    console.error('[Lambda: deleteProduct] Error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        success: false,
        error: 'Failed to delete product from DynamoDB',
        message: error.message
      })
    };
  }
};
