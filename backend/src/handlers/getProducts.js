import { dbService } from '../db.js';

export const handler = async (event = {}) => {
  try {
    const queryParams = event.queryStringParameters || {};
    const {
      search = '',
      category = '',
      status = '',
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 100
    } = queryParams;

    let products = await dbService.getAllProducts();

    // In-memory filter pipeline for rich querying
    if (search && search.trim() !== '') {
      const q = search.toLowerCase().trim();
      products = products.filter(
        p =>
          (p.name && p.name.toLowerCase().includes(q)) ||
          (p.sku && p.sku.toLowerCase().includes(q)) ||
          (p.brand && p.brand.toLowerCase().includes(q)) ||
          (p.category && p.category.toLowerCase().includes(q)) ||
          (p.description && p.description.toLowerCase().includes(q))
      );
    }

    if (category && category !== 'all') {
      products = products.filter(
        p => p.category && p.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (status && status !== 'all') {
      products = products.filter(
        p => p.status && p.status.toLowerCase() === status.toLowerCase()
      );
    }

    // Sorting
    products.sort((a, b) => {
      let fieldA = a[sortBy];
      let fieldB = b[sortBy];

      if (sortBy === 'price' || sortBy === 'stock' || sortBy === 'costPrice') {
        fieldA = Number(fieldA || 0);
        fieldB = Number(fieldB || 0);
        return sortOrder === 'asc' ? fieldA - fieldB : fieldB - fieldA;
      }

      if (sortBy === 'name' || sortBy === 'category' || sortBy === 'sku') {
        fieldA = (fieldA || '').toString().toLowerCase();
        fieldB = (fieldB || '').toString().toLowerCase();
        return sortOrder === 'asc' ? fieldA.localeCompare(fieldB) : fieldB.localeCompare(fieldA);
      }

      // Default date sorting
      const dateA = new Date(fieldA || 0).getTime();
      const dateB = new Date(fieldB || 0).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    const totalCount = products.length;

    // Calculate live KPI metrics directly from active catalog
    const allProducts = await dbService.getAllProducts();
    const kpis = {
      totalProducts: allProducts.length,
      activeProducts: allProducts.filter(p => p.status === 'active').length,
      lowStockProducts: allProducts.filter(p => p.stock > 0 && p.stock <= (p.minStockThreshold || 10)).length,
      outOfStockProducts: allProducts.filter(p => Number(p.stock) === 0).length,
      draftProducts: allProducts.filter(p => p.status === 'draft').length,
      totalCatalogValuation: allProducts.reduce((sum, p) => sum + (Number(p.price || 0) * Number(p.stock || 0)), 0),
      averagePrice: allProducts.length ? (allProducts.reduce((sum, p) => sum + Number(p.price || 0), 0) / allProducts.length) : 0
    };

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        success: true,
        data: products,
        meta: {
          total: totalCount,
          count: products.length,
          kpis,
          databaseEngine: dbService.isUsingAWS() ? 'Amazon DynamoDB' : 'DynamoDB Local Engine'
        }
      })
    };
  } catch (error) {
    console.error('[Lambda: getProducts] Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: false,
        error: 'Failed to retrieve products from DynamoDB',
        message: error.message
      })
    };
  }
};
