import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
  ScanCommand
} from '@aws-sdk/lib-dynamodb';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'products.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const TICKETS_FILE = path.join(DATA_DIR, 'tickets.json');

const TABLE_NAME = process.env.PRODUCTS_TABLE || 'CloudMart360-Products';
const ORDERS_TABLE = process.env.ORDERS_TABLE || 'CloudMart360-Orders';
const TICKETS_TABLE = process.env.TICKETS_TABLE || 'CloudMart360-Tickets';
const AWS_REGION = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || 'us-east-1';

const USE_AWS_DYNAMODB = process.env.USE_AWS_DYNAMODB !== 'false';

let docClient = null;

if (USE_AWS_DYNAMODB) {
  try {
    const clientConfig = { region: AWS_REGION };
    if (process.env.DYNAMODB_ENDPOINT) {
      clientConfig.endpoint = process.env.DYNAMODB_ENDPOINT;
    }
    const rawClient = new DynamoDBClient(clientConfig);
    docClient = DynamoDBDocumentClient.from(rawClient, {
      marshallOptions: { removeUndefinedValues: true }
    });
    console.log(`[CloudMart 360 DB] Connected to AWS DynamoDB in region ${AWS_REGION}`);
    console.log(`[CloudMart 360 DB] Active Tables: ${TABLE_NAME}, ${ORDERS_TABLE}, ${TICKETS_TABLE}`);
  } catch (err) {
    console.warn('[CloudMart 360 DB] Failed to initialize AWS DynamoDB Client, using local fallback:', err.message);
    docClient = null;
  }
}

// Local persistence helpers for local dev & testing fallback
function ensureFile(filePath, defaultData = []) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2), 'utf-8');
  }
}

function readFile(filePath, defaultData = []) {
  ensureFile(filePath, defaultData);
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    return defaultData;
  }
}

function writeFile(filePath, data) {
  ensureFile(filePath);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// ==========================================
// 1. PRODUCTS DATABASE SERVICE
// ==========================================
export const dbService = {
  isUsingAWS: () => Boolean(docClient),
  getTableName: () => TABLE_NAME,

  async getAllProducts() {
    if (docClient) {
      const command = new ScanCommand({ TableName: TABLE_NAME });
      const response = await docClient.send(command);
      return response.Items || [];
    }
    return readFile(DATA_FILE, []);
  },

  async getProductById(id) {
    if (docClient) {
      const command = new GetCommand({
        TableName: TABLE_NAME,
        Key: { id }
      });
      const response = await docClient.send(command);
      return response.Item || null;
    }
    const products = readFile(DATA_FILE, []);
    return products.find(p => p.id === id) || null;
  },

  async createProduct(product) {
    if (docClient) {
      const command = new PutCommand({
        TableName: TABLE_NAME,
        Item: product
      });
      await docClient.send(command);
      return product;
    }
    const products = readFile(DATA_FILE, []);
    const exists = products.some(p => p.id === product.id);
    if (exists) {
      throw new Error(`Product with ID ${product.id} already exists`);
    }
    products.unshift(product);
    writeFile(DATA_FILE, products);
    return product;
  },

  async updateProduct(id, updates) {
    if (docClient) {
      const updateKeys = Object.keys(updates).filter(k => k !== 'id');
      if (updateKeys.length === 0) return await this.getProductById(id);

      const ExpressionAttributeNames = {};
      const ExpressionAttributeValues = {};
      const setExpressions = [];

      updateKeys.forEach((key, index) => {
        const attrName = `#attr${index}`;
        const attrVal = `:val${index}`;
        ExpressionAttributeNames[attrName] = key;
        ExpressionAttributeValues[attrVal] = updates[key];
        setExpressions.push(`${attrName} = ${attrVal}`);
      });

      const command = new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { id },
        UpdateExpression: `SET ${setExpressions.join(', ')}`,
        ExpressionAttributeNames,
        ExpressionAttributeValues,
        ReturnValues: 'ALL_NEW'
      });

      const response = await docClient.send(command);
      return response.Attributes;
    }

    const products = readFile(DATA_FILE, []);
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;
    const updatedProduct = { ...products[index], ...updates, id };
    products[index] = updatedProduct;
    writeFile(DATA_FILE, products);
    return updatedProduct;
  },

  async deleteProduct(id) {
    if (docClient) {
      const command = new DeleteCommand({
        TableName: TABLE_NAME,
        Key: { id },
        ReturnValues: 'ALL_OLD'
      });
      const response = await docClient.send(command);
      return Boolean(response.Attributes);
    }
    const products = readFile(DATA_FILE, []);
    const initialLen = products.length;
    const filtered = products.filter(p => p.id !== id);
    if (filtered.length === initialLen) return false;
    writeFile(DATA_FILE, filtered);
    return true;
  },

  async seedProducts(items) {
    if (docClient) {
      for (const item of items) {
        await this.createProduct(item);
      }
      return items.length;
    }
    writeFile(DATA_FILE, items);
    return items.length;
  }
};

// ==========================================
// 2. ORDERS DATABASE SERVICE (CloudMart360-Orders)
// ==========================================
export const ordersService = {
  isUsingAWS: () => Boolean(docClient),
  getTableName: () => ORDERS_TABLE,

  async getAllOrders() {
    if (docClient) {
      try {
        const command = new ScanCommand({ TableName: ORDERS_TABLE });
        const response = await docClient.send(command);
        return (response.Items || []).sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      } catch (err) {
        console.error('[CloudMart 360 DB] Scan Orders error:', err.message);
        return readFile(ORDERS_FILE, []);
      }
    }
    return readFile(ORDERS_FILE, []);
  },

  async getOrderById(orderId) {
    if (docClient) {
      const command = new GetCommand({
        TableName: ORDERS_TABLE,
        Key: { orderId }
      });
      const response = await docClient.send(command);
      return response.Item || null;
    }
    const orders = readFile(ORDERS_FILE, []);
    return orders.find(o => o.orderId === orderId) || null;
  },

  async createOrder(order) {
    const item = {
      ...order,
      orderId: order.orderId || `CM360-ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: order.createdAt || new Date().toISOString(),
      status: order.status || 'Processing'
    };

    if (docClient) {
      const command = new PutCommand({
        TableName: ORDERS_TABLE,
        Item: item
      });
      await docClient.send(command);
      console.log(`[CloudMart 360 DB] Successfully saved Order #${item.orderId} in DynamoDB table: ${ORDERS_TABLE}`);
      return item;
    }

    const orders = readFile(ORDERS_FILE, []);
    orders.unshift(item);
    writeFile(ORDERS_FILE, orders);
    return item;
  },

  async updateOrderStatus(orderId, status) {
    if (docClient) {
      const command = new UpdateCommand({
        TableName: ORDERS_TABLE,
        Key: { orderId },
        UpdateExpression: 'SET #st = :st, #ua = :ua',
        ExpressionAttributeNames: {
          '#st': 'status',
          '#ua': 'updatedAt'
        },
        ExpressionAttributeValues: {
          ':st': status,
          ':ua': new Date().toISOString()
        },
        ReturnValues: 'ALL_NEW'
      });
      const response = await docClient.send(command);
      return response.Attributes;
    }

    const orders = readFile(ORDERS_FILE, []);
    const idx = orders.findIndex(o => o.orderId === orderId);
    if (idx === -1) return null;
    orders[idx] = { ...orders[idx], status, updatedAt: new Date().toISOString() };
    writeFile(ORDERS_FILE, orders);
    return orders[idx];
  }
};

// ==========================================
// 3. SUPPORT TICKETS SERVICE (CloudMart360-Tickets)
// ==========================================
export const ticketsService = {
  isUsingAWS: () => Boolean(docClient),
  getTableName: () => TICKETS_TABLE,

  async getAllTickets() {
    if (docClient) {
      try {
        const command = new ScanCommand({ TableName: TICKETS_TABLE });
        const response = await docClient.send(command);
        return (response.Items || []).sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      } catch (err) {
        console.error('[CloudMart 360 DB] Scan Tickets error:', err.message);
        return readFile(TICKETS_FILE, []);
      }
    }
    return readFile(TICKETS_FILE, []);
  },

  async createTicket(ticket) {
    const item = {
      ...ticket,
      ticketId: ticket.ticketId || `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: ticket.createdAt || new Date().toISOString(),
      status: ticket.status || 'open'
    };

    if (docClient) {
      const command = new PutCommand({
        TableName: TICKETS_TABLE,
        Item: item
      });
      await docClient.send(command);
      console.log(`[CloudMart 360 DB] Successfully saved Support Ticket #${item.ticketId} in DynamoDB table: ${TICKETS_TABLE}`);
      return item;
    }

    const tickets = readFile(TICKETS_FILE, []);
    tickets.unshift(item);
    writeFile(TICKETS_FILE, tickets);
    return item;
  },

  async updateTicketStatus(ticketId, status) {
    if (docClient) {
      const command = new UpdateCommand({
        TableName: TICKETS_TABLE,
        Key: { ticketId },
        UpdateExpression: 'SET #st = :st, #ua = :ua',
        ExpressionAttributeNames: {
          '#st': 'status',
          '#ua': 'updatedAt'
        },
        ExpressionAttributeValues: {
          ':st': status,
          ':ua': new Date().toISOString()
        },
        ReturnValues: 'ALL_NEW'
      });
      const response = await docClient.send(command);
      return response.Attributes;
    }

    const tickets = readFile(TICKETS_FILE, []);
    const idx = tickets.findIndex(t => t.ticketId === ticketId);
    if (idx === -1) return null;
    tickets[idx] = { ...tickets[idx], status, updatedAt: new Date().toISOString() };
    writeFile(TICKETS_FILE, tickets);
    return tickets[idx];
  }
};
