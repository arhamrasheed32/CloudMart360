import React, { useState } from 'react';
import {
  Search,
  Filter,
  SlidersHorizontal,
  Star,
  ShoppingBag,
  Eye,
  Package,
  RotateCcw,
  Check,
  ChevronDown
} from 'lucide-react';
import { Button } from '../../ui/Button.jsx';
import { SpotlightCard } from '../../ui/SpotlightCard.jsx';
import { useCart } from '../../../context/CartContext.jsx';
import { formatCurrency } from '../../../utils/formatters.js';

export function ShopPage({
  products = [],
  selectedCategory = 'all',
  onSelectCategory,
  onQuickView
}) {
  const { addToCart } = useCart();

  const [search, setSearch] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('featured');

  const categories = [
    'all',
    ...Array.from(new Set(products.map((p) => p.category))).filter(Boolean)
  ];

  // Filtering
  const filteredProducts = products.filter((p) => {
    if (p.status === 'archived') return false;

    const matchesSearch =
      search.trim() === '' ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(search.toLowerCase())) ||
      (p.brand && p.brand.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesMinPrice = minPrice === '' || Number(p.price) >= Number(minPrice);
    const matchesMaxPrice = maxPrice === '' || Number(p.price) <= Number(maxPrice);
    const matchesStock = !inStockOnly || p.stock > 0;

    return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice && matchesStock;
  });

  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return Number(a.price) - Number(b.price);
    if (sortBy === 'price-high') return Number(b.price) - Number(a.price);
    if (sortBy === 'name-az') return a.name.localeCompare(b.name);
    if (sortBy === 'stock') return Number(b.stock) - Number(a.stock);
    return 0; // featured
  });

  const resetAllFilters = () => {
    setSearch('');
    onSelectCategory('all');
    setMinPrice('');
    setMaxPrice('');
    setInStockOnly(false);
  };

  return (
    <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '36px 28px' }}>
      {/* Page Title Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.025em' }}>
          Shop All Products
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>
          Showing {sortedProducts.length} items from Amazon DynamoDB live catalog.
        </p>
      </div>

      {/* Main Layout: Filter Sidebar + Products Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '32px', alignItems: 'flex-start' }} className="shop-layout-grid">
        {/* Left Faceted Filters Sidebar */}
        <aside
          className="glass-panel"
          style={{
            padding: '20px',
            borderRadius: 'var(--radius-xl)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            position: 'sticky',
            top: '90px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <SlidersHorizontal size={16} color="var(--brand-primary)" />
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>Filters</span>
            </div>
            <button
              onClick={resetAllFilters}
              style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Reset
            </button>
          </div>

          {/* Search Input */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
              Keyword Search
            </label>
            <div style={{ position: 'relative' }}>
              <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Filter by name, brand..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="glass-input"
                style={{ width: '100%', height: '34px', padding: '0 8px 0 30px', fontSize: '0.8125rem' }}
              />
            </div>
          </div>

          {/* Categories Radio Checklist */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
              Category
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {categories.map((cat) => {
                const count = cat === 'all' ? products.length : products.filter((p) => p.category === cat).length;
                const isSelected = selectedCategory === cat;

                return (
                  <button
                    key={cat}
                    onClick={() => onSelectCategory(cat)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '6px 10px',
                      borderRadius: 'var(--radius-sm)',
                      background: isSelected ? 'rgba(255, 87, 34, 0.12)' : 'transparent',
                      border: isSelected ? '1px solid rgba(255, 87, 34, 0.3)' : '1px solid transparent',
                      color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                      fontSize: '0.8125rem',
                      fontWeight: isSelected ? 700 : 500,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <span>{cat === 'all' ? 'All Categories' : cat}</span>
                    <span style={{ fontSize: '0.6875rem', color: 'var(--text-faint)' }}>{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range Slider / Inputs */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
              Price Range ($ USD)
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <input
                type="number"
                placeholder="Min $"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="glass-input"
                style={{ height: '32px', padding: '0 8px', fontSize: '0.75rem' }}
              />
              <input
                type="number"
                placeholder="Max $"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="glass-input"
                style={{ height: '32px', padding: '0 8px', fontSize: '0.75rem' }}
              />
            </div>
          </div>

          {/* In Stock Only Checkbox */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
            <input
              type="checkbox"
              id="inStockCheck"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              style={{ width: '16px', height: '16px', accentColor: 'var(--brand-primary)', cursor: 'pointer' }}
            />
            <label htmlFor="inStockCheck" style={{ fontSize: '0.8125rem', color: 'var(--text-primary)', cursor: 'pointer', fontWeight: 500 }}>
              In-Stock Items Only
            </label>
          </div>
        </aside>

        {/* Right Products View */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Top Sort & Count Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Showing <strong>{sortedProducts.length}</strong> items
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="glass-input"
                style={{ height: '36px', padding: '0 12px', borderRadius: 'var(--radius-md)', fontSize: '0.8125rem', cursor: 'pointer' }}
              >
                <option value="featured" style={{ background: '#121724' }}>Featured Collection</option>
                <option value="price-low" style={{ background: '#121724' }}>Price: Low to High</option>
                <option value="price-high" style={{ background: '#121724' }}>Price: High to Low</option>
                <option value="name-az" style={{ background: '#121724' }}>Name: A to Z</option>
                <option value="stock" style={{ background: '#121724' }}>Stock Availability</option>
              </select>
            </div>
          </div>

          {/* Grid Cards */}
          {sortedProducts.length === 0 ? (
            <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Package size={48} color="var(--text-faint)" style={{ margin: '0 auto 12px auto' }} />
              <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                No products match these criteria
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Try adjusting your price range or clearing active category filters.
              </p>
              <Button variant="secondary" size="sm" onClick={resetAllFilters} style={{ marginTop: '16px' }}>
                Reset Filters
              </Button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
              {sortedProducts.map((product) => {
                const isOutOfStock = product.stock === 0;
                const isLowStock = product.stock > 0 && product.stock <= (product.minStockThreshold || 10);

                return (
                  <SpotlightCard
                    key={product.id}
                    spotlightColor="rgba(255, 87, 34, 0.15)"
                    style={{
                      borderRadius: 'var(--radius-xl)',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      padding: '16px',
                      border: '1px solid var(--border-default)'
                    }}
                  >
                    <div>
                      {/* Image */}
                      <div
                        style={{
                          width: '100%',
                          height: '180px',
                          borderRadius: 'var(--radius-lg)',
                          overflow: 'hidden',
                          background: 'rgba(0, 0, 0, 0.3)',
                          marginBottom: '12px',
                          position: 'relative'
                        }}
                      >
                        {product.imageUrl ? (
                          <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Package size={36} color="var(--text-muted)" />
                          </div>
                        )}

                        <span className="badge" style={{ position: 'absolute', top: '8px', left: '8px', background: 'rgba(0, 0, 0, 0.75)', color: '#FFFFFF' }}>
                          {product.category}
                        </span>

                        <button
                          onClick={() => onQuickView(product)}
                          style={{
                            position: 'absolute',
                            bottom: '8px',
                            right: '8px',
                            padding: '6px',
                            borderRadius: '50%',
                            background: 'rgba(14, 18, 28, 0.85)',
                            color: '#FFFFFF',
                            border: '1px solid rgba(255,255,255,0.15)',
                            cursor: 'pointer'
                          }}
                          title="Quick View"
                        >
                          <Eye size={14} />
                        </button>
                      </div>

                      {/* Title & Brand */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{product.brand || 'CloudMart'}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#F59E0B', fontSize: '0.6875rem', fontWeight: 700 }}>
                          <Star size={11} fill="#F59E0B" />
                          <span>4.9</span>
                        </div>
                      </div>

                      <h3
                        onClick={() => onQuickView(product)}
                        style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px', cursor: 'pointer', lineHeight: 1.3 }}
                        className="hover-underline"
                      >
                        {product.name}
                      </h3>
                    </div>

                    {/* Price & Add */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)', marginTop: '12px' }}>
                      <div>
                        <div className="font-mono" style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                          {formatCurrency(product.price)}
                        </div>
                        <div style={{ fontSize: '0.6875rem', color: isOutOfStock ? 'var(--color-danger)' : isLowStock ? 'var(--color-warning)' : 'var(--color-success)' }}>
                          {isOutOfStock ? 'Sold Out' : isLowStock ? `Only ${product.stock} left` : 'In Stock'}
                        </div>
                      </div>

                      <Button
                        variant={isOutOfStock ? 'secondary' : 'primary'}
                        size="sm"
                        onClick={() => addToCart(product, 1)}
                        disabled={isOutOfStock}
                        icon={ShoppingBag}
                        style={{ height: '32px', padding: '0 10px', fontSize: '0.75rem' }}
                      >
                        Add
                      </Button>
                    </div>
                  </SpotlightCard>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
