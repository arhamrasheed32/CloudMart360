import { useState, useEffect, useCallback, useRef } from 'react';
import { apiService } from '../services/api.js';

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [allProductsRaw, setAllProductsRaw] = useState([]);
  const [kpis, setKpis] = useState({
    totalProducts: 0,
    activeProducts: 0,
    lowStockProducts: 0,
    outOfStockProducts: 0,
    draftProducts: 0,
    totalCatalogValuation: 0,
    averagePrice: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [databaseEngine, setDatabaseEngine] = useState('Amazon DynamoDB');

  // Query / Filter state
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');
  const [stockCondition, setStockCondition] = useState('all'); // 'all' | 'in_stock' | 'low_stock' | 'out_of_stock'
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  // Multi-selection state
  const [selectedIds, setSelectedIds] = useState([]);

  // Prevent race conditions with request tracking
  const requestIdRef = useRef(0);

  const fetchProducts = useCallback(async (showRefreshingSpinner = false) => {
    const currentReqId = ++requestIdRef.current;
    if (showRefreshingSpinner) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const response = await apiService.getProducts({
        search,
        category,
        status,
        sortBy,
        sortOrder
      });

      if (currentReqId === requestIdRef.current) {
        let items = response.data || [];

        // Apply client-side price & stock condition filters if set
        if (minPrice !== '' && !isNaN(Number(minPrice))) {
          items = items.filter((p) => Number(p.price) >= Number(minPrice));
        }
        if (maxPrice !== '' && !isNaN(Number(maxPrice))) {
          items = items.filter((p) => Number(p.price) <= Number(maxPrice));
        }
        if (stockCondition === 'low_stock') {
          items = items.filter((p) => Number(p.stock) > 0 && Number(p.stock) <= (p.minStockThreshold || 10));
        } else if (stockCondition === 'out_of_stock') {
          items = items.filter((p) => Number(p.stock) === 0);
        } else if (stockCondition === 'in_stock') {
          items = items.filter((p) => Number(p.stock) > (p.minStockThreshold || 10));
        }

        setProducts(items);
        setAllProductsRaw(response.data || []);
        if (response.meta?.kpis) {
          setKpis(response.meta.kpis);
        }
        if (response.meta?.databaseEngine) {
          setDatabaseEngine(response.meta.databaseEngine);
        }
      }
    } catch (err) {
      if (currentReqId === requestIdRef.current) {
        console.error('[useProducts] Fetch error:', err);
        setError(err.message || 'Failed to load products');
      }
    } finally {
      if (currentReqId === requestIdRef.current) {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    }
  }, [search, category, status, stockCondition, minPrice, maxPrice, sortBy, sortOrder]);

  // Initial and reactive fetch
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Mutations
  const createProduct = async (productData) => {
    const response = await apiService.createProduct(productData);
    await fetchProducts(false);
    return response.data;
  };

  const updateProduct = async (id, updateData) => {
    const response = await apiService.updateProduct(id, updateData);
    await fetchProducts(false);
    return response.data;
  };

  const deleteProduct = async (id) => {
    const response = await apiService.deleteProduct(id);
    setSelectedIds((prev) => prev.filter((item) => item !== id));
    await fetchProducts(false);
    return response.data;
  };

  const batchUpdateStatus = async (ids, newStatus) => {
    const response = await apiService.batchUpdateStatus(ids, newStatus);
    setSelectedIds([]);
    await fetchProducts(false);
    return response.data;
  };

  const batchDelete = async (ids) => {
    const response = await apiService.batchDeleteProducts(ids);
    setSelectedIds([]);
    await fetchProducts(false);
    return response.data;
  };

  const adjustStock = async (id, delta) => {
    const response = await apiService.adjustStock(id, { delta });
    await fetchProducts(false);
    return response.data;
  };

  const resetFilters = () => {
    setSearch('');
    setCategory('all');
    setStatus('all');
    setStockCondition('all');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('createdAt');
    setSortOrder('desc');
  };

  // Selection helpers
  const toggleSelectId = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === products.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(products.map((p) => p.id));
    }
  };

  const clearSelection = () => {
    setSelectedIds([]);
  };

  return {
    products,
    allProductsRaw,
    kpis,
    isLoading,
    isRefreshing,
    error,
    databaseEngine,
    // Filters & Sorting
    search,
    setSearch,
    category,
    setCategory,
    status,
    setStatus,
    stockCondition,
    setStockCondition,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    resetFilters,
    // Multi-Selection
    selectedIds,
    toggleSelectId,
    toggleSelectAll,
    clearSelection,
    // Actions
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    batchUpdateStatus,
    batchDelete,
    adjustStock
  };
}
