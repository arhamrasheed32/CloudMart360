import express from 'express';
import cors from 'cors';
import { handler as getProductsHandler } from './handlers/getProducts.js';
import { handler as getProductHandler } from './handlers/getProduct.js';
import { handler as createProductHandler } from './handlers/createProduct.js';
import { handler as updateProductHandler } from './handlers/updateProduct.js';
import { handler as deleteProductHandler } from './handlers/deleteProduct.js';
import {
  batchStatusHandler,
  batchDeleteHandler,
  stockAdjustHandler
} from './handlers/batchOperations.js';
import { dbService } from './db.js';
import { INITIAL_PRODUCTS } from './seed.js';

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Helper: Convert Express req to AWS API Gateway Proxy event format
function createApiGatewayEvent(req) {
  return {
    resource: req.route ? req.route.path : req.path,
    path: req.path,
    httpMethod: req.method,
    headers: req.headers,
    queryStringParameters: Object.keys(req.query).length > 0 ? req.query : null,
    pathParameters: Object.keys(req.params).length > 0 ? req.params : null,
    body: req.body ? JSON.stringify(req.body) : null,
    isBase64Encoded: false,
    requestContext: {
      accountId: '123456789012',
      apiId: 'cloudmart360-apigw',
      protocol: 'HTTP/1.1',
      httpMethod: req.method,
      identity: {
        sourceIp: req.ip || '127.0.0.1',
        userAgent: req.get('User-Agent')
      },
      path: req.path,
      stage: 'prod'
    }
  };
}

// Helper: Send Lambda response through Express
function sendLambdaResponse(res, lambdaResult) {
  const { statusCode = 200, headers = {}, body = '' } = lambdaResult;
  Object.entries(headers).forEach(([key, val]) => {
    res.setHeader(key, val);
  });
  res.status(statusCode);
  try {
    const parsed = JSON.parse(body);
    res.json(parsed);
  } catch (e) {
    res.send(body);
  }
}

// Batch Routes
app.post('/api/products/batch-status', async (req, res) => {
  const event = createApiGatewayEvent(req);
  const result = await batchStatusHandler(event);
  sendLambdaResponse(res, result);
});

app.post('/api/products/batch-delete', async (req, res) => {
  const event = createApiGatewayEvent(req);
  const result = await batchDeleteHandler(event);
  sendLambdaResponse(res, result);
});

// Quick inline stock adjustment
app.post('/api/products/:id/stock', async (req, res) => {
  const event = createApiGatewayEvent(req);
  const result = await stockAdjustHandler(event);
  sendLambdaResponse(res, result);
});

// 1. GET /api/products
app.get('/api/products', async (req, res) => {
  const event = createApiGatewayEvent(req);
  const result = await getProductsHandler(event);
  sendLambdaResponse(res, result);
});

// 2. GET /api/products/:id
app.get('/api/products/:id', async (req, res) => {
  const event = createApiGatewayEvent(req);
  const result = await getProductHandler(event);
  sendLambdaResponse(res, result);
});

// 3. POST /api/products
app.post('/api/products', async (req, res) => {
  const event = createApiGatewayEvent(req);
  const result = await createProductHandler(event);
  sendLambdaResponse(res, result);
});

// 4. PUT /api/products/:id
app.put('/api/products/:id', async (req, res) => {
  const event = createApiGatewayEvent(req);
  const result = await updateProductHandler(event);
  sendLambdaResponse(res, result);
});

// 5. DELETE /api/products/:id
app.delete('/api/products/:id', async (req, res) => {
  const event = createApiGatewayEvent(req);
  const result = await deleteProductHandler(event);
  sendLambdaResponse(res, result);
});

// System Status & Architecture metadata endpoint
app.get('/api/status', async (req, res) => {
  const products = await dbService.getAllProducts();
  res.json({
    platform: 'CloudMart 360',
    module: 'Module 1: Product Management',
    status: 'online',
    architecture: {
      frontend: 'React 19 + Vite (Dark Glass SaaS)',
      apiGateway: 'Amazon API Gateway (REST Proxy Integration)',
      compute: 'AWS Lambda (Node.js 20+ Runtime)',
      database: dbService.isUsingAWS() ? 'Amazon DynamoDB (Cloud-Native)' : 'Amazon DynamoDB (Local DocumentClient Engine)',
      tableName: dbService.getTableName()
    },
    metrics: {
      totalProductsInStore: products.length
    },
    timestamp: new Date().toISOString()
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Auto-seed on start if empty
async function init() {
  const existing = await dbService.getAllProducts();
  if (existing.length === 0) {
    console.log('[Server] No products detected. Seeding initial retail catalog...');
    await dbService.seedProducts(INITIAL_PRODUCTS);
  }
}

init().then(() => {
  app.listen(PORT, () => {
    console.log(`========================================================`);
    console.log(`  CLOUDMART 360 - API GATEWAY & LAMBDA SERVER`);
    console.log(`  Running on: http://localhost:${PORT}`);
    console.log(`  Endpoints:`);
    console.log(`    GET    /api/products`);
    console.log(`    POST   /api/products`);
    console.log(`    GET    /api/products/:id`);
    console.log(`    PUT    /api/products/:id`);
    console.log(`    DELETE /api/products/:id`);
    console.log(`    GET    /api/status`);
    console.log(`========================================================`);
  });
});
