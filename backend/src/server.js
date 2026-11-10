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
import {
  getOrdersHandler,
  createOrderHandler,
  updateOrderStatusHandler
} from './handlers/orders.js';
import {
  getTicketsHandler,
  createTicketHandler,
  updateTicketStatusHandler
} from './handlers/tickets.js';
import { dbService, ordersService, ticketsService } from './db.js';
import { INITIAL_PRODUCTS } from './seed.js';
import {
  customerSignUp,
  verifyEmailCode,
  resendVerificationCode,
  forgotPasswordRequest,
  confirmForgotPassword,
  authenticateUser
} from './cognitoAuth.js';

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

// =========================================================================
// Amazon Cognito Authentication Endpoints (Module 3)
// =========================================================================

// 1. Customer Sign Up (Full Name, Email, Phone, Password)
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
    }
    const result = await customerSignUp(email, password, name, phone);
    res.status(201).json({
      success: true,
      message: 'Verification code sent to email',
      userSub: result.UserSub,
      userConfirmed: result.UserConfirmed
    });
  } catch (err) {
    let msg = err.message || 'Failed to sign up with Cognito';
    if (err.name === 'UsernameExistsException') {
      msg = 'An account with this email address already exists. Please sign in instead.';
    }
    res.status(400).json({ error: msg, code: err.name });
  }
});

// 2. Customer Email Code Verification
app.post('/api/auth/verify', async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.status(400).json({ error: 'Email and 6-digit confirmation code are required.' });
    }
    await verifyEmailCode(email, code);
    res.json({
      success: true,
      message: 'Email verified successfully! You can now sign in.'
    });
  } catch (err) {
    let msg = err.message || 'Invalid or expired confirmation code';
    if (err.name === 'CodeMismatchException') {
      msg = 'The verification code entered is incorrect. Please check your inbox and try again.';
    } else if (err.name === 'ExpiredCodeException') {
      msg = 'The verification code has expired. Please request a new code.';
    }
    res.status(400).json({ error: msg, code: err.name });
  }
});

// 3. Resend Verification Code
app.post('/api/auth/resend-code', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
    }
    await resendVerificationCode(email);
    res.json({
      success: true,
      message: 'A new 6-digit confirmation code has been dispatched to your email.'
    });
  } catch (err) {
    res.status(400).json({ error: err.message || 'Failed to resend confirmation code' });
  }
});

// 4. Forgot Password - Request Recovery Code
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
    }
    await forgotPasswordRequest(email);
    res.json({
      success: true,
      message: 'Password reset code has been sent to your email.'
    });
  } catch (err) {
    res.status(400).json({ error: err.message || 'Failed to initiate password reset' });
  }
});

// 5. Confirm Forgot Password - Set New Password
app.post('/api/auth/confirm-forgot-password', async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    if (!email || !code || !newPassword) {
      return res.status(400).json({ error: 'Email, confirmation code, and new password are required.' });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters long.' });
    }
    await confirmForgotPassword(email, code, newPassword);
    res.json({
      success: true,
      message: 'Password reset successfully! You can now sign in with your new password.'
    });
  } catch (err) {
    res.status(400).json({ error: err.message || 'Failed to reset password' });
  }
});

// 6. User & Admin Sign In (Supports requiredRole enforcement)
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password, requiredRole } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    const authResult = await authenticateUser(email, password, requiredRole);
    res.json(authResult);
  } catch (err) {
    let msg = err.message || 'Authentication failed';
    if (err.name === 'NotAuthorizedException') {
      msg = 'Incorrect email or password. Please verify your credentials.';
    } else if (err.name === 'UserNotConfirmedException') {
      msg = 'Your email has not been verified yet. Please enter the verification code sent to your email.';
    } else if (err.name === 'UserNotFoundException') {
      msg = 'No account found with this email address. Please sign up first.';
    }
    res.status(401).json({ error: msg, code: err.name });
  }
});

// ==========================================
// Orders Endpoints (Amazon DynamoDB CloudMart360-Orders Table)
// ==========================================
app.get('/api/orders', async (req, res) => {
  const event = createApiGatewayEvent(req);
  const result = await getOrdersHandler(event);
  sendLambdaResponse(res, result);
});

app.post('/api/orders', async (req, res) => {
  const event = createApiGatewayEvent(req);
  const result = await createOrderHandler(event);
  sendLambdaResponse(res, result);
});

app.put('/api/orders/:id/status', async (req, res) => {
  const event = createApiGatewayEvent(req);
  const result = await updateOrderStatusHandler(event);
  sendLambdaResponse(res, result);
});

// ==========================================
// Support Tickets Endpoints (Amazon DynamoDB CloudMart360-Tickets Table)
// ==========================================
app.get('/api/tickets', async (req, res) => {
  const event = createApiGatewayEvent(req);
  const result = await getTicketsHandler(event);
  sendLambdaResponse(res, result);
});

app.post('/api/tickets', async (req, res) => {
  const event = createApiGatewayEvent(req);
  const result = await createTicketHandler(event);
  sendLambdaResponse(res, result);
});

app.put('/api/tickets/:id/status', async (req, res) => {
  const event = createApiGatewayEvent(req);
  const result = await updateTicketStatusHandler(event);
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

  const existingOrders = await ordersService.getAllOrders();
  if (existingOrders.length === 0) {
    console.log('[Server] Seeding initial customer orders into DynamoDB CloudMart360-Orders...');
    await ordersService.createOrder({
      orderId: 'CM360-ORD-892140',
      date: 'Today, 10:14 AM',
      customer: 'Jane Doe',
      email: 'jane.doe@example.com',
      address: '742 Evergreen Terrace, San Francisco, CA 94107',
      carrier: 'FedEx Express Worldwide',
      trackingNumber: 'FDX-99201948210',
      status: 'Out for Delivery',
      paymentMethod: 'Visa (•••• 4242)',
      grandTotal: 249.99,
      items: [
        {
          product: {
            id: 'prod-001-aura-pro',
            name: 'Aura Pro Noise Cancelling Headphones',
            price: 249.99,
            sku: 'CM-ELE-AUR-9021',
            category: 'Electronics'
          },
          quantity: 1
        }
      ]
    });
  }

  const existingTickets = await ticketsService.getAllTickets();
  if (existingTickets.length === 0) {
    console.log('[Server] Seeding initial support tickets into DynamoDB CloudMart360-Tickets...');
    await ticketsService.createTicket({
      ticketId: 'TKT-9959',
      name: 'David Miller',
      email: 'david@example.com',
      subject: 'Inquiry regarding Order CM360-ORD-892140',
      message: 'Hello, please confirm if the package includes the carrying case and USB-C audio cable.',
      status: 'open'
    });
  }
}

init().then(() => {
  app.listen(PORT, () => {
    console.log(`========================================================`);
    console.log(`  CLOUDMART 360 - API GATEWAY & LAMBDA SERVER`);
    console.log(`  Running on: http://localhost:${PORT}`);
    console.log(`  DynamoDB Tables Connected:`);
    console.log(`    • CloudMart360-Products`);
    console.log(`    • CloudMart360-Orders`);
    console.log(`    • CloudMart360-Tickets`);
    console.log(`  Endpoints:`);
    console.log(`    GET    /api/products`);
    console.log(`    POST   /api/products`);
    console.log(`    GET    /api/products/:id`);
    console.log(`    PUT    /api/products/:id`);
    console.log(`    DELETE /api/products/:id`);
    console.log(`    GET    /api/orders`);
    console.log(`    POST   /api/orders`);
    console.log(`    PUT    /api/orders/:id/status`);
    console.log(`    GET    /api/tickets`);
    console.log(`    POST   /api/tickets`);
    console.log(`    PUT    /api/tickets/:id/status`);
    console.log(`    GET    /api/status`);
    console.log(`========================================================`);
  });
});
