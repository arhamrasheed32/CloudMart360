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

const TABLE_NAME = process.env.PRODUCTS_TABLE || 'CloudMart360-Products';
const AWS_REGION = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || 'us-east-1';
const USE_AWS_DYNAMODB = Boolean(
  process.env.USE_AWS_DYNAMODB === 'true' ||
  (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY)
);

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
    console.log(`[CloudMart 360 DB] Connected to DynamoDB Table: ${TABLE_NAME} in region ${AWS_REGION}`);
  } catch (err) {
    console.warn('[CloudMart 360 DB] Failed to initialize AWS DynamoDB Client, using local fallback:', err.message);
    docClient = null;
  }
}

// Local persistence helper for local dev & testing
function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}

function readLocalProducts() {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    console.error('[CloudMart 360 DB] Error reading local data file:', e);
    return [];
  }
}

function writeLocalProducts(products) {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2), 'utf-8');
}

export const dbService = {
  isUsingAWS: () => Boolean(docClient),
  getTableName: () => TABLE_NAME,

  async getAllProducts() {
    if (docClient) {
      const command = new ScanCommand({ TableName: TABLE_NAME });
      const response = await docClient.send(command);
      return response.Items || [];
    }
    return readLocalProducts();
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
    const products = readLocalProducts();
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
    const products = readLocalProducts();
    // Check if duplicate ID
    const exists = products.some(p => p.id === product.id);
    if (exists) {
      throw new Error(`Product with ID ${product.id} already exists`);
    }
    products.unshift(product);
    writeLocalProducts(products);
    return product;
  },

  async updateProduct(id, updates) {
    if (docClient) {
      // Build DynamoDB update expression
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

    const products = readLocalProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) {
      return null;
    }
    const updatedProduct = {
      ...products[index],
      ...updates,
      id // preserve ID
    };
    products[index] = updatedProduct;
    writeLocalProducts(products);
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
    const products = readLocalProducts();
    const initialLen = products.length;
    const filtered = products.filter(p => p.id !== id);
    if (filtered.length === initialLen) {
      return false;
    }
    writeLocalProducts(filtered);
    return true;
  },

  async seedProducts(items) {
    if (docClient) {
      for (const item of items) {
        await this.createProduct(item);
      }
      return items.length;
    }
    writeLocalProducts(items);
    return items.length;
  }
};
