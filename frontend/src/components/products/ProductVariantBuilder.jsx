import React, { useState, useEffect } from 'react';
import {
  Layers,
  Plus,
  Trash2,
  Sparkles,
  Check,
  X,
  AlertCircle,
  Package
} from 'lucide-react';
import { Button } from '../ui/Button.jsx';
import { Input } from '../ui/Input.jsx';
import { formatCurrency } from '../../utils/formatters.js';

export function ProductVariantBuilder({
  hasVariants = false,
  onToggleHasVariants,
  options = [],
  onOptionsChange,
  variants = [],
  onVariantsChange,
  baseSku = 'CM-PRD',
  basePrice = 0,
  baseCostPrice = 0
}) {
  const [newOptionName, setNewOptionName] = useState('');
  const [newOptionValueMap, setNewOptionValueMap] = useState({});

  // Generate Cartesian Product of Option Values
  const generateVariantMatrix = () => {
    if (options.length === 0) return;

    // Filter valid options with >= 1 value
    const validOptions = options.filter((o) => o.values && o.values.length > 0);
    if (validOptions.length === 0) return;

    const cartesian = (arrays) => {
      return arrays.reduce((acc, curr) => {
        return acc.flatMap((x) => curr.map((y) => [...x, y]));
      }, [[]]);
    };

    const valueArrays = validOptions.map((o) => o.values);
    const combinations = cartesian(valueArrays);

    const newVariants = combinations.map((combo, idx) => {
      const attributes = {};
      const skuSuffixParts = [];
      const titleParts = [];

      combo.forEach((val, i) => {
        const optName = validOptions[i].name;
        attributes[optName] = val;
        titleParts.push(val);
        const code = val.substring(0, 3).toUpperCase().replace(/[^A-Z0-9]/g, '');
        skuSuffixParts.push(code);
      });

      const title = titleParts.join(' / ');
      const subSku = `${baseSku || 'CM-VAR'}-${skuSuffixParts.join('-')}`;

      // Check if variant with same attributes already exists to preserve stock/price
      const existing = variants.find((v) =>
        Object.entries(attributes).every(([k, vVal]) => v.attributes && v.attributes[k] === vVal)
      );

      return {
        id: existing ? existing.id : `var-${idx + 1}-${Date.now()}`,
        sku: existing ? existing.sku : subSku,
        title,
        attributes,
        price: existing && existing.price !== undefined ? existing.price : Number(basePrice) || 29.99,
        costPrice: existing && existing.costPrice !== undefined ? existing.costPrice : Number(baseCostPrice) || 12.00,
        stock: existing && existing.stock !== undefined ? existing.stock : 10
      };
    });

    onVariantsChange(newVariants);
  };

  const addOption = () => {
    const trimmed = newOptionName.trim();
    if (!trimmed) return;
    if (options.some((o) => o.name.toLowerCase() === trimmed.toLowerCase())) return;

    onOptionsChange([...options, { name: trimmed, values: [] }]);
    setNewOptionName('');
  };

  const removeOption = (index) => {
    const updated = options.filter((_, i) => i !== index);
    onOptionsChange(updated);
  };

  const addValueToOption = (optionIndex) => {
    const inputVal = (newOptionValueMap[optionIndex] || '').trim();
    if (!inputVal) return;

    const opt = options[optionIndex];
    if (opt.values.includes(inputVal)) return;

    const updatedOptions = [...options];
    updatedOptions[optionIndex] = {
      ...opt,
      values: [...opt.values, inputVal]
    };
    onOptionsChange(updatedOptions);
    setNewOptionValueMap({ ...newOptionValueMap, [optionIndex]: '' });
  };

  const removeValueFromOption = (optionIndex, valueIndex) => {
    const opt = options[optionIndex];
    const updatedValues = opt.values.filter((_, i) => i !== valueIndex);
    const updatedOptions = [...options];
    updatedOptions[optionIndex] = { ...opt, values: updatedValues };
    onOptionsChange(updatedOptions);
  };

  const updateVariantRow = (variantIndex, field, value) => {
    const updated = [...variants];
    updated[variantIndex] = {
      ...updated[variantIndex],
      [field]: field === 'price' || field === 'costPrice' ? parseFloat(value) || 0 : field === 'stock' ? parseInt(value, 10) || 0 : value
    };
    onVariantsChange(updated);
  };

  const removeVariant = (index) => {
    const updated = variants.filter((_, i) => i !== index);
    onVariantsChange(updated);
  };

  const totalVariantStock = variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0);

  return (
    <div
      className="glass-panel"
      style={{
        padding: '18px',
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}
    >
      {/* Header & Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers size={16} color="var(--brand-primary)" />
          <h3 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Product Variants & SKU Matrix
          </h3>
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          <span>Enable Multi-Variants</span>
          <input
            type="checkbox"
            checked={hasVariants}
            onChange={(e) => onToggleHasVariants(e.target.checked)}
            style={{ width: '16px', height: '16px', accentColor: 'var(--brand-primary)', cursor: 'pointer' }}
          />
        </label>
      </div>

      {hasVariants && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Options Manager */}
          <div
            className="glass-panel"
            style={{
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 255, 255, 0.02)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              1. Define Option Types (e.g. Color, Size, Storage, Edition)
            </div>

            {/* Existing Options List */}
            {options.map((opt, optIdx) => (
              <div
                key={optIdx}
                style={{
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--brand-primary)' }}>
                    Option: {opt.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeOption(optIdx)}
                    style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}
                  >
                    <X size={14} />
                  </button>
                </div>

                {/* Values Chips */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {opt.values.map((val, valIdx) => (
                    <span
                      key={valIdx}
                      className="badge"
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        color: 'var(--text-primary)',
                        padding: '2px 8px',
                        fontSize: '0.75rem',
                        gap: '6px'
                      }}
                    >
                      <span>{val}</span>
                      <button
                        type="button"
                        onClick={() => removeValueFromOption(optIdx, valIdx)}
                        style={{ color: 'var(--text-muted)', display: 'flex' }}
                      >
                        <X size={11} />
                      </button>
                    </span>
                  ))}
                </div>

                {/* Add Value Input */}
                <div style={{ display: 'flex', gap: '6px', marginTop: '2px' }}>
                  <input
                    type="text"
                    placeholder={`Add ${opt.name} value (e.g. ${opt.name === 'Color' ? 'Matte Black' : opt.name === 'Size' ? 'XL' : '256GB'})...`}
                    value={newOptionValueMap[optIdx] || ''}
                    onChange={(e) => setNewOptionValueMap({ ...newOptionValueMap, [optIdx]: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addValueToOption(optIdx);
                      }
                    }}
                    className="glass-input"
                    style={{ flex: 1, height: '30px', padding: '0 8px', fontSize: '0.75rem' }}
                  />
                  <Button variant="secondary" size="sm" type="button" onClick={() => addValueToOption(optIdx)} style={{ height: '30px', fontSize: '0.75rem' }}>
                    <Plus size={13} />
                    <span>Add</span>
                  </Button>
                </div>
              </div>
            ))}

            {/* Add New Option Type */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="New option name (e.g. Color, Size, Storage)..."
                value={newOptionName}
                onChange={(e) => setNewOptionName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addOption();
                  }
                }}
                className="glass-input"
                style={{ flex: 1, height: '34px', padding: '0 10px', fontSize: '0.8125rem' }}
              />
              <Button variant="secondary" size="sm" type="button" onClick={addOption} style={{ height: '34px' }}>
                <Plus size={14} />
                <span>Add Option Type</span>
              </Button>
            </div>
          </div>

          {/* Matrix Generator Button */}
          {options.length > 0 && options.some((o) => o.values.length > 0) && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Button
                variant="primary"
                size="sm"
                type="button"
                onClick={generateVariantMatrix}
                icon={Sparkles}
                style={{ height: '34px' }}
              >
                Generate / Refresh Variant Matrix ({options.reduce((acc, o) => acc * Math.max(1, o.values.length), 1)} Combos)
              </Button>

              <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--color-success)', fontWeight: 700 }}>
                Total Combined Stock: {totalVariantStock} units
              </span>
            </div>
          )}

          {/* Generated Variants Table */}
          {variants.length > 0 && (
            <div className="table-container" style={{ maxHeight: '280px', overflowY: 'auto' }}>
              <table className="glass-table" style={{ fontSize: '0.75rem' }}>
                <thead>
                  <tr>
                    <th>Variant</th>
                    <th>Sub-SKU</th>
                    <th>Price ($)</th>
                    <th>Stock</th>
                    <th style={{ width: '36px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {variants.map((v, vIdx) => (
                    <tr key={v.id || vIdx}>
                      <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        {v.title}
                      </td>
                      <td>
                        <input
                          type="text"
                          value={v.sku}
                          onChange={(e) => updateVariantRow(vIdx, 'sku', e.target.value)}
                          className="glass-input font-mono"
                          style={{ height: '26px', padding: '0 6px', fontSize: '0.6875rem', width: '130px' }}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          step="0.01"
                          value={v.price}
                          onChange={(e) => updateVariantRow(vIdx, 'price', e.target.value)}
                          className="glass-input font-mono"
                          style={{ height: '26px', padding: '0 6px', fontSize: '0.6875rem', width: '70px' }}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          value={v.stock}
                          onChange={(e) => updateVariantRow(vIdx, 'stock', e.target.value)}
                          className="glass-input font-mono"
                          style={{ height: '26px', padding: '0 6px', fontSize: '0.6875rem', width: '60px' }}
                        />
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => removeVariant(vIdx)}
                          style={{ color: 'var(--text-muted)', padding: '2px', background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                          <X size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
