import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  DollarSign,
  Package,
  Layers,
  Image as ImageIcon,
  Save,
  CheckCircle,
  Tag,
  Plus,
  X
} from 'lucide-react';
import { Drawer } from '../ui/Drawer.jsx';
import { Button } from '../ui/Button.jsx';
import { Input } from '../ui/Input.jsx';
import { Select } from '../ui/Select.jsx';
import { Textarea } from '../ui/Textarea.jsx';
import { ImageGalleryPicker } from './ImageGalleryPicker.jsx';
import { ProductVariantBuilder } from './ProductVariantBuilder.jsx';
import { AiProductAssistant } from './AiProductAssistant.jsx';
import { VALID_CATEGORIES, VALID_STATUSES } from '../../utils/constants.js';

export function ProductFormDrawer({
  isOpen,
  onClose,
  onSubmit,
  product = null,
  isSubmitting = false
}) {
  const isEditMode = Boolean(product && product.id);

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'Electronics',
    brand: 'CloudMart Retail',
    price: '',
    costPrice: '',
    stock: '',
    minStockThreshold: '10',
    status: 'active',
    description: '',
    imageUrl: '',
    tags: [],
    hasVariants: false,
    options: [],
    variants: []
  });

  const [newTagInput, setNewTagInput] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        sku: product.sku || '',
        category: product.category || 'Electronics',
        brand: product.brand || '',
        price: product.price !== undefined ? String(product.price) : '',
        costPrice: product.costPrice !== undefined && product.costPrice !== null ? String(product.costPrice) : '',
        stock: product.stock !== undefined ? String(product.stock) : '',
        minStockThreshold: product.minStockThreshold !== undefined ? String(product.minStockThreshold) : '10',
        status: product.status || 'active',
        description: product.description || '',
        imageUrl: product.imageUrl || '',
        tags: Array.isArray(product.tags) ? product.tags : [],
        hasVariants: Boolean(product.hasVariants),
        options: Array.isArray(product.options) ? product.options : [],
        variants: Array.isArray(product.variants) ? product.variants : []
      });
    } else {
      setFormData({
        name: '',
        sku: '',
        category: 'Electronics',
        brand: 'CloudMart Retail',
        price: '',
        costPrice: '',
        stock: '',
        minStockThreshold: '10',
        status: 'active',
        description: '',
        imageUrl: '',
        tags: [],
        hasVariants: false,
        options: [],
        variants: []
      });
    }
    setErrors({});
    setNewTagInput('');
  }, [product, isOpen]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const generateAutoSku = () => {
    const cat = formData.category || 'GEN';
    const catPrefix = cat.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, 'X');
    const namePrefix = (formData.name || 'PRD').substring(0, 3).toUpperCase().replace(/[^A-Z]/g, 'X');
    const rand = Math.floor(1000 + Math.random() * 9000);
    const newSku = `CM-${catPrefix}-${namePrefix}-${rand}`;
    handleChange('sku', newSku);
  };

  const addTag = () => {
    const trimmed = newTagInput.trim().toLowerCase();
    if (trimmed && !formData.tags.includes(trimmed)) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, trimmed] }));
      setNewTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tagToRemove)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name || formData.name.trim().length === 0) {
      newErrors.name = 'Product name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Product name must be at least 2 characters';
    }

    if (formData.price === '' || isNaN(Number(formData.price))) {
      newErrors.price = 'Selling price is required';
    } else if (Number(formData.price) < 0) {
      newErrors.price = 'Price cannot be negative';
    }

    if (formData.costPrice !== '' && (isNaN(Number(formData.costPrice)) || Number(formData.costPrice) < 0)) {
      newErrors.costPrice = 'Cost price must be a non-negative number';
    }

    if (formData.stock === '' || isNaN(Number(formData.stock))) {
      newErrors.stock = 'Stock quantity is required';
    } else if (!Number.isInteger(Number(formData.stock)) || Number(formData.stock) < 0) {
      newErrors.stock = 'Stock must be a non-negative whole integer';
    }

    if (formData.minStockThreshold !== '' && (isNaN(Number(formData.minStockThreshold)) || Number(formData.minStockThreshold) < 0)) {
      newErrors.minStockThreshold = 'Low stock threshold must be a non-negative number';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      name: formData.name.trim(),
      sku: formData.sku.trim() || undefined,
      category: formData.category,
      brand: formData.brand.trim() || undefined,
      price: parseFloat(formData.price),
      costPrice: formData.costPrice !== '' ? parseFloat(formData.costPrice) : undefined,
      stock: parseInt(formData.stock, 10),
      minStockThreshold: formData.minStockThreshold !== '' ? parseInt(formData.minStockThreshold, 10) : 10,
      status: formData.status,
      description: formData.description.trim(),
      imageUrl: formData.imageUrl.trim(),
      tags: formData.tags
    };

    await onSubmit(payload, product ? product.id : null);
  };

  const footer = (
    <>
      <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
        Cancel
      </Button>
      <Button
        variant="primary"
        onClick={handleSubmit}
        isLoading={isSubmitting}
        icon={Save}
      >
        {isEditMode ? 'Save Changes' : 'Create Product'}
      </Button>
    </>
  );

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Edit Product' : 'Add New Product'}
      subtitle={
        isEditMode
          ? `Modify attributes for SKU: ${formData.sku || 'N/A'}`
          : 'Define product catalog parameters, pricing, and DynamoDB stock records.'
      }
      footer={footer}
      width="580px"
    >
      <form
        id="product-form"
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
      >
        {/* Amazon Bedrock AI Copywriting Assistant */}
        <AiProductAssistant
          currentCategory={formData.category}
          onApplyCopy={(aiData) => {
            setFormData((prev) => ({
              ...prev,
              name: aiData.title || prev.name,
              description: aiData.description || prev.description,
              tags: aiData.tags || prev.tags,
              price: prev.price || String(aiData.suggestedPrice || ''),
              costPrice: prev.costPrice || String(aiData.suggestedCost || '')
            }));
          }}
        />

        {/* Section 1: General Product Information */}
        <div
          className="glass-panel"
          style={{
            padding: '18px',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
            <Package size={16} color="var(--brand-primary)" />
            <h3 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              General Information
            </h3>
          </div>

          <Input
            label="Product Name"
            required
            placeholder="e.g. Aura Pro Noise Cancelling Headphones"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            error={errors.name}
            helperText="Clear customer-facing catalog name"
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px', alignItems: 'flex-start' }}>
            <Input
              label="SKU (Stock Keeping Unit)"
              placeholder="e.g. CM-ELE-AUR-9021"
              value={formData.sku}
              onChange={(e) => handleChange('sku', e.target.value)}
              error={errors.sku}
              helperText="Unique product inventory identifier"
              style={{ flex: 1 }}
            />
            <div style={{ paddingTop: '22px' }}>
              <Button
                variant="secondary"
                size="sm"
                onClick={generateAutoSku}
                type="button"
                style={{ height: '40px', padding: '0 12px' }}
                title="Auto-generate SKU"
              >
                <Sparkles size={14} color="var(--brand-primary)" />
                <span>Auto</span>
              </Button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Select
              label="Category"
              required
              options={VALID_CATEGORIES.map((c) => ({ value: c, label: c }))}
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              error={errors.category}
            />

            <Input
              label="Brand / Manufacturer"
              placeholder="e.g. AcoustiCloud"
              value={formData.brand}
              onChange={(e) => handleChange('brand', e.target.value)}
              error={errors.brand}
            />
          </div>

          <Textarea
            label="Product Description"
            placeholder="Detailed specifications, materials, warranty, and key features..."
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            rows={3}
            maxLength={1000}
            error={errors.description}
          />

          {/* Tags Chips Manager */}
          <div>
            <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
              Search Tags & Badges
            </label>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
              <input
                type="text"
                placeholder="Add tag (e.g. wireless, premium)..."
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                }}
                className="glass-input"
                style={{ flex: 1, height: '34px', padding: '0 10px', fontSize: '0.8125rem' }}
              />
              <Button variant="secondary" size="sm" type="button" onClick={addTag} style={{ height: '34px' }}>
                <Plus size={14} />
                <span>Add</span>
              </Button>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {formData.tags.map((t) => (
                <span
                  key={t}
                  className="badge"
                  style={{
                    background: 'rgba(255, 255, 255, 0.06)',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border-subtle)',
                    padding: '2px 8px',
                    gap: '6px',
                    fontSize: '0.75rem'
                  }}
                >
                  <span>#{t}</span>
                  <button
                    type="button"
                    onClick={() => removeTag(t)}
                    style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Section 2: Pricing & Margins */}
        <div
          className="glass-panel"
          style={{
            padding: '18px',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
            <DollarSign size={16} color="var(--color-success)" />
            <h3 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Pricing & Economics
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Input
              label="Retail Selling Price ($)"
              required
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={formData.price}
              onChange={(e) => handleChange('price', e.target.value)}
              error={errors.price}
              suffix="USD"
            />

            <Input
              label="Cost Price ($)"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={formData.costPrice}
              onChange={(e) => handleChange('costPrice', e.target.value)}
              error={errors.costPrice}
              helperText="Internal wholesale unit cost"
              suffix="USD"
            />
          </div>

          {/* Real-time Profit Margin Indicator */}
          {formData.price && !isNaN(Number(formData.price)) && formData.costPrice && !isNaN(Number(formData.costPrice)) && Number(formData.price) > 0 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.75rem'
              }}
            >
              <span style={{ color: 'var(--text-secondary)' }}>Calculated Gross Margin:</span>
              <span className="font-mono" style={{ color: 'var(--color-success)', fontWeight: 700 }}>
                {Math.round(((Number(formData.price) - Number(formData.costPrice)) / Number(formData.price)) * 100)}% (
                ${(Number(formData.price) - Number(formData.costPrice)).toFixed(2)}/unit)
              </span>
            </div>
          )}
        </div>

        {/* Section 3: Inventory & Fulfillment */}
        <div
          className="glass-panel"
          style={{
            padding: '18px',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
            <Layers size={16} color="var(--color-warning)" />
            <h3 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Inventory & Status
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Input
              label="Stock Quantity"
              required
              type="number"
              step="1"
              min="0"
              placeholder="0"
              value={formData.stock}
              onChange={(e) => handleChange('stock', e.target.value)}
              error={errors.stock}
              suffix="units"
            />

            <Input
              label="Low Stock Alert Threshold"
              type="number"
              step="1"
              min="0"
              placeholder="10"
              value={formData.minStockThreshold}
              onChange={(e) => handleChange('minStockThreshold', e.target.value)}
              error={errors.minStockThreshold}
              helperText="Trigger alert when stock drops below"
              suffix="units"
            />
          </div>

          <Select
            label="Listing Status"
            options={[
              { value: 'active', label: 'Active (Visible in retail catalog)' },
              { value: 'draft', label: 'Draft (Saved internally, unpublished)' },
              { value: 'archived', label: 'Archived (Discontinued)' }
            ]}
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
          />
        </div>

        {/* Section 4: Multi-Variant & SKU Matrix Builder */}
        <ProductVariantBuilder
          hasVariants={formData.hasVariants}
          onToggleHasVariants={(val) => handleChange('hasVariants', val)}
          options={formData.options}
          onOptionsChange={(opts) => handleChange('options', opts)}
          variants={formData.variants}
          onVariantsChange={(vars) => {
            handleChange('variants', vars);
            const totalStock = vars.reduce((acc, v) => acc + (Number(v.stock) || 0), 0);
            if (vars.length > 0) {
              handleChange('stock', String(totalStock));
            }
          }}
          baseSku={formData.sku}
          basePrice={formData.price}
          baseCostPrice={formData.costPrice}
        />

        {/* Section 5: Media & Visual Assets */}
        <ImageGalleryPicker
          value={formData.imageUrl}
          onChange={(val) => handleChange('imageUrl', val)}
        />
      </form>
    </Drawer>
  );
}
