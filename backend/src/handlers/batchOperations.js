import { dbService } from '../db.js';

export const batchStatusHandler = async (event = {}) => {
  try {
    let body = {};
    if (typeof event.body === 'string') {
      body = JSON.parse(event.body);
    } else if (event.body) {
      body = event.body;
    }

    const { ids = [], status } = body;
    if (!Array.isArray(ids) || ids.length === 0 || !status) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ success: false, error: 'Valid ids array and status are required' })
      };
    }

    const updated = [];
    for (const id of ids) {
      const res = await dbService.updateProduct(id, { status, updatedAt: new Date().toISOString() });
      if (res) updated.push(res);
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        success: true,
        message: `Updated ${updated.length} products to status '${status}'`,
        data: updated
      })
    };
  } catch (err) {
    console.error('[Lambda: batchStatus] Error:', err);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ success: false, error: err.message })
    };
  }
};

export const batchDeleteHandler = async (event = {}) => {
  try {
    let body = {};
    if (typeof event.body === 'string') {
      body = JSON.parse(event.body);
    } else if (event.body) {
      body = event.body;
    }

    const { ids = [] } = body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ success: false, error: 'Valid ids array is required' })
      };
    }

    let deletedCount = 0;
    for (const id of ids) {
      const ok = await dbService.deleteProduct(id);
      if (ok) deletedCount++;
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        success: true,
        message: `Successfully deleted ${deletedCount} products from DynamoDB`,
        data: { deletedCount, ids }
      })
    };
  } catch (err) {
    console.error('[Lambda: batchDelete] Error:', err);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ success: false, error: err.message })
    };
  }
};

export const stockAdjustHandler = async (event = {}) => {
  try {
    const id = event.pathParameters?.id;
    if (!id) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ success: false, error: 'Product ID required' })
      };
    }

    let body = {};
    if (typeof event.body === 'string') {
      body = JSON.parse(event.body);
    } else if (event.body) {
      body = event.body;
    }

    const existing = await dbService.getProductById(id);
    if (!existing) {
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ success: false, error: 'Product not found' })
      };
    }

    let newStock = existing.stock;
    if (body.delta !== undefined) {
      newStock = Math.max(0, Number(existing.stock || 0) + Number(body.delta));
    } else if (body.stock !== undefined) {
      newStock = Math.max(0, parseInt(body.stock, 10));
    }

    const updated = await dbService.updateProduct(id, {
      stock: newStock,
      status: newStock === 0 ? 'draft' : existing.status,
      updatedAt: new Date().toISOString()
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        success: true,
        message: `Stock updated for '${existing.name}' to ${newStock} units`,
        data: updated
      })
    };
  } catch (err) {
    console.error('[Lambda: stockAdjust] Error:', err);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ success: false, error: err.message })
    };
  }
};
