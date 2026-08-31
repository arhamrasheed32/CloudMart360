import test from 'node:test';
import assert from 'node:assert/strict';
import { handler as getProductsHandler } from '../src/handlers/getProducts.js';
import { handler as getProductHandler } from '../src/handlers/getProduct.js';
import { handler as createProductHandler } from '../src/handlers/createProduct.js';
import { handler as updateProductHandler } from '../src/handlers/updateProduct.js';
import { handler as deleteProductHandler } from '../src/handlers/deleteProduct.js';
import {
  batchStatusHandler,
  batchDeleteHandler,
  stockAdjustHandler
} from '../src/handlers/batchOperations.js';
import { dbService } from '../src/db.js';
import { INITIAL_PRODUCTS } from '../src/seed.js';

test('CloudMart 360 Product Management End-to-End Test Suite', async (t) => {
  // Reset seed
  await dbService.seedProducts(INITIAL_PRODUCTS);

  await t.test('1. getProducts should return all products and calculated KPIs', async () => {
    const res = await getProductsHandler({ queryStringParameters: {} });
    assert.equal(res.statusCode, 200);
    const body = JSON.parse(res.body);
    assert.equal(body.success, true);
    assert.ok(Array.isArray(body.data));
    assert.ok(body.data.length >= 12);
    assert.ok(body.meta.kpis.totalProducts >= 12);
    assert.ok(typeof body.meta.kpis.totalCatalogValuation === 'number');
  });

  await t.test('2. getProducts with category filter should filter properly', async () => {
    const res = await getProductsHandler({ queryStringParameters: { category: 'Electronics' } });
    assert.equal(res.statusCode, 200);
    const body = JSON.parse(res.body);
    assert.ok(body.data.every(p => p.category === 'Electronics'));
  });

  await t.test('3. getProducts with search term should find matching items', async () => {
    const res = await getProductsHandler({ queryStringParameters: { search: 'Headphones' } });
    assert.equal(res.statusCode, 200);
    const body = JSON.parse(res.body);
    assert.ok(body.data.length > 0);
    assert.ok(body.data[0].name.toLowerCase().includes('headphones'));
  });

  let createdId = null;

  await t.test('4. createProduct should validate and reject invalid input', async () => {
    const res = await createProductHandler({
      body: JSON.stringify({ name: '', price: -10, stock: -5 })
    });
    assert.equal(res.statusCode, 422);
    const body = JSON.parse(res.body);
    assert.equal(body.success, false);
    assert.ok(body.validationErrors.name);
    assert.ok(body.validationErrors.price);
    assert.ok(body.validationErrors.stock);
  });

  await t.test('5. createProduct should successfully create a new product', async () => {
    const newProductPayload = {
      name: 'Wireless Ergonomic Vertical Mouse',
      category: 'Electronics',
      brand: 'ErgoTech',
      price: 69.99,
      costPrice: 28.00,
      stock: 45,
      minStockThreshold: 10,
      status: 'active',
      description: 'Ergonomic 57-degree vertical angle gaming mouse with optical sensor.'
    };

    const res = await createProductHandler({
      body: JSON.stringify(newProductPayload)
    });
    assert.equal(res.statusCode, 201);
    const body = JSON.parse(res.body);
    assert.equal(body.success, true);
    assert.ok(body.data.id);
    assert.equal(body.data.name, newProductPayload.name);
    assert.ok(body.data.sku.startsWith('CM-'));
    createdId = body.data.id;
  });

  await t.test('6. stockAdjustHandler should quickly delta-adjust inventory', async () => {
    assert.ok(createdId);
    const res = await stockAdjustHandler({
      pathParameters: { id: createdId },
      body: JSON.stringify({ delta: -5 })
    });
    assert.equal(res.statusCode, 200);
    const body = JSON.parse(res.body);
    assert.equal(body.data.stock, 40);
  });

  await t.test('7. batchStatusHandler should bulk-update product statuses', async () => {
    assert.ok(createdId);
    const res = await batchStatusHandler({
      body: JSON.stringify({ ids: [createdId], status: 'draft' })
    });
    assert.equal(res.statusCode, 200);
    const body = JSON.parse(res.body);
    assert.equal(body.data[0].status, 'draft');
  });

  await t.test('8. updateProduct should update attributes and reflect new price/stock', async () => {
    assert.ok(createdId);
    const updatePayload = {
      price: 59.99,
      stock: 30,
      brand: 'ErgoTech Pro'
    };
    const res = await updateProductHandler({
      pathParameters: { id: createdId },
      body: JSON.stringify(updatePayload)
    });
    assert.equal(res.statusCode, 200);
    const body = JSON.parse(res.body);
    assert.equal(body.data.price, 59.99);
    assert.equal(body.data.stock, 30);
    assert.equal(body.data.brand, 'ErgoTech Pro');
  });

  await t.test('9. deleteProduct should delete the product permanently', async () => {
    assert.ok(createdId);
    const res = await deleteProductHandler({ pathParameters: { id: createdId } });
    assert.equal(res.statusCode, 200);
    const body = JSON.parse(res.body);
    assert.equal(body.success, true);

    // Verify it is no longer found
    const getRes = await getProductHandler({ pathParameters: { id: createdId } });
    assert.equal(getRes.statusCode, 404);
  });
});
