import { ordersService } from '../db.js';
import { snsService } from '../services/snsService.js';

export async function getOrdersHandler(event) {
  try {
    const orders = await ordersService.getAllOrders();
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        count: orders.length,
        orders,
        databaseTable: ordersService.getTableName(),
        storageEngine: ordersService.isUsingAWS() ? 'Amazon DynamoDB' : 'Local DocumentClient'
      })
    };
  } catch (err) {
    console.error('[GetOrdersHandler] Error:', err);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: false,
        error: 'Failed to retrieve orders from DynamoDB',
        details: err.message
      })
    };
  }
}

export async function createOrderHandler(event) {
  try {
    const body = event.body ? (typeof event.body === 'string' ? JSON.parse(event.body) : event.body) : {};

    if (!body.grandTotal && body.grandTotal !== 0) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ success: false, error: 'Missing required field: grandTotal' })
      };
    }

    const savedOrder = await ordersService.createOrder(body);

    // Asynchronously trigger Amazon SNS Order Confirmation & Customer Subscription
    try {
      if (body.email) {
        snsService.subscribeCustomer(body.email).catch(() => {});
      }
      snsService.publishOrderConfirmation(savedOrder).catch(err => {
        console.warn('[CreateOrderHandler] SNS publish note:', err.message);
      });
    } catch (snsErr) {
      console.warn('[CreateOrderHandler] SNS trigger note:', snsErr.message);
    }

    return {
      statusCode: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        message: `Order #${savedOrder.orderId} created and persisted in DynamoDB table: ${ordersService.getTableName()}`,
        order: savedOrder,
        databaseTable: ordersService.getTableName()
      })
    };
  } catch (err) {
    console.error('[CreateOrderHandler] Error:', err);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: false,
        error: 'Failed to persist order in DynamoDB',
        details: err.message
      })
    };
  }
}

export async function updateOrderStatusHandler(event) {
  try {
    const orderId = event.pathParameters?.id || event.params?.id;
    const body = event.body ? (typeof event.body === 'string' ? JSON.parse(event.body) : event.body) : {};
    const { status } = body;

    if (!orderId || !status) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ success: false, error: 'Missing orderId or status' })
      };
    }

    const updated = await ordersService.updateOrderStatus(orderId, status);

    // Asynchronously trigger Amazon SNS Delivery Status Update
    try {
      snsService.publishDeliveryUpdate(orderId, status, updated || body).catch(err => {
        console.warn('[UpdateOrderStatusHandler] SNS delivery note:', err.message);
      });
    } catch (snsErr) {
      console.warn('[UpdateOrderStatusHandler] SNS status trigger note:', snsErr.message);
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        message: `Order #${orderId} status updated to '${status}' in DynamoDB`,
        order: updated
      })
    };
  } catch (err) {
    console.error('[UpdateOrderStatusHandler] Error:', err);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: false,
        error: 'Failed to update order in DynamoDB',
        details: err.message
      })
    };
  }
}

