const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  try {
    const response = await fetch(url, config);
    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      let errorMessage = 'An unexpected API error occurred';
      if (typeof data === 'object' && data !== null) {
        errorMessage = data.error || data.message || errorMessage;
      }

      if (response.status === 400) {
        errorMessage = `Bad Request: ${errorMessage}`;
      } else if (response.status === 401) {
        errorMessage = 'Unauthorized: Please check API credentials';
      } else if (response.status === 403) {
        errorMessage = 'Forbidden: You do not have permission to perform this action';
      } else if (response.status === 404) {
        errorMessage = data.error || 'Requested product resource not found';
      } else if (response.status === 422) {
        errorMessage = data.error || 'Validation error: Please check input fields';
      } else if (response.status >= 500) {
        errorMessage = 'AWS DynamoDB / Lambda Server Error. Please try again';
      }

      throw new ApiError(errorMessage, response.status, data);
    }

    return data;
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }
    // Network or connection failure
    throw new ApiError(
      'Unable to connect to CloudMart 360 API Gateway. Please verify the backend service is running.',
      0,
      { originalError: err.message }
    );
  }
}

export const apiService = {
  /**
   * Fetch list of products with optional filters and sorting
   */
  async getProducts(params = {}) {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.category && params.category !== 'all') query.append('category', params.category);
    if (params.status && params.status !== 'all') query.append('status', params.status);
    if (params.sortBy) query.append('sortBy', params.sortBy);
    if (params.sortOrder) query.append('sortOrder', params.sortOrder);

    const queryString = query.toString();
    const endpoint = queryString ? `/products?${queryString}` : '/products';
    return await request(endpoint, { method: 'GET' });
  },

  /**
   * Get single product by ID
   */
  async getProduct(id) {
    return await request(`/products/${encodeURIComponent(id)}`, { method: 'GET' });
  },

  /**
   * Create a new product in DynamoDB
   */
  async createProduct(productData) {
    return await request('/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    });
  },

  /**
   * Update an existing product
   */
  async updateProduct(id, updates) {
    return await request(`/products/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  },

  /**
   * Delete product from DynamoDB
   */
  async deleteProduct(id) {
    return await request(`/products/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
  },

  /**
   * Batch update status for multiple products
   */
  async batchUpdateStatus(ids, status) {
    return await request('/products/batch-status', {
      method: 'POST',
      body: JSON.stringify({ ids, status })
    });
  },

  /**
   * Batch delete multiple products from DynamoDB
   */
  async batchDeleteProducts(ids) {
    return await request('/products/batch-delete', {
      method: 'POST',
      body: JSON.stringify({ ids })
    });
  },

  /**
   * Quick inline stock delta adjustment
   */
  async adjustStock(id, { delta, stock }) {
    return await request(`/products/${encodeURIComponent(id)}/stock`, {
      method: 'POST',
      body: JSON.stringify({ delta, stock })
    });
  },

  /**
   * Get system & architecture status
   */
  async getStatus() {
    return await request('/status', { method: 'GET' });
  },

  /**
   * Amazon Cognito: Sign up new customer
   */
  async signup(email, password, name = '', phone = '') {
    return await request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name, phone })
    });
  },

  /**
   * Amazon Cognito: Verify email 6-digit confirmation code
   */
  async verifyEmail(email, code) {
    return await request('/auth/verify', {
      method: 'POST',
      body: JSON.stringify({ email, code })
    });
  },

  /**
   * Amazon Cognito: Resend 6-digit confirmation code
   */
  async resendCode(email) {
    return await request('/auth/resend-code', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  },

  /**
   * Amazon Cognito: Request forgot password OTP code
   */
  async forgotPassword(email) {
    return await request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  },

  /**
   * Amazon Cognito: Confirm new password with OTP code
   */
  async confirmForgotPassword(email, code, newPassword) {
    return await request('/auth/confirm-forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email, code, newPassword })
    });
  },

  /**
   * Amazon Cognito: Login for Customer or Admin (with role enforcement)
   */
  async login(email, password, requiredRole = null) {
    return await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, requiredRole })
    });
  }
};

export const api = apiService;

