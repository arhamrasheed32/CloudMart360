import React, { useState, useRef } from 'react';
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Download,
  X,
  FileText,
  Loader2
} from 'lucide-react';
import { Modal } from '../ui/Modal.jsx';
import { Button } from '../ui/Button.jsx';
import { Badge } from '../ui/Badge.jsx';
import { formatCurrency } from '../../utils/formatters.js';

export function CatalogImportModal({
  isOpen,
  onClose,
  onImportProducts
}) {
  const [parsedRows, setParsedRows] = useState([]);
  const [fileName, setFileName] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file) => {
    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = (event) => {
      const content = event.target.result;
      try {
        if (file.name.endsWith('.json')) {
          const json = JSON.parse(content);
          const items = Array.isArray(json) ? json : [json];
          validateAndSetRows(items);
        } else {
          // Parse CSV
          const lines = content.split(/\r?\n/).filter((l) => l.trim().length > 0);
          if (lines.length <= 1) return;

          const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, '').toLowerCase());
          const rows = [];

          for (let i = 1; i < lines.length; i++) {
            // Regex to handle comma separation with quotes
            const rowValues = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || lines[i].split(',');
            const item = {};
            headers.forEach((header, idx) => {
              const val = rowValues[idx] ? rowValues[idx].trim().replace(/^"|"$/g, '') : '';
              if (header.includes('name') || header === 'product') item.name = val;
              else if (header.includes('sku')) item.sku = val;
              else if (header.includes('category')) item.category = val;
              else if (header.includes('brand')) item.brand = val;
              else if (header.includes('price')) item.price = parseFloat(val) || 0;
              else if (header.includes('cost')) item.costPrice = parseFloat(val) || 0;
              else if (header.includes('stock') || header.includes('qty')) item.stock = parseInt(val, 10) || 0;
              else if (header.includes('status')) item.status = val.toLowerCase() === 'draft' ? 'draft' : 'active';
              else if (header.includes('desc')) item.description = val;
            });

            if (item.name) {
              rows.push(item);
            }
          }
          validateAndSetRows(rows);
        }
      } catch (err) {
        console.error('File parsing error:', err);
      }
    };

    reader.readAsText(file);
  };

  const validateAndSetRows = (items) => {
    const validated = items.map((item, idx) => {
      const errors = [];
      if (!item.name || item.name.length < 2) errors.push('Invalid name');
      if (item.price === undefined || item.price < 0 || isNaN(Number(item.price))) errors.push('Invalid price');
      if (item.stock === undefined || item.stock < 0 || isNaN(Number(item.stock))) errors.push('Invalid stock');

      return {
        id: `row-${idx}`,
        name: item.name || `Imported Item #${idx + 1}`,
        sku: item.sku || `CM-IMP-${Math.floor(1000 + Math.random() * 9000)}`,
        category: item.category || 'Other',
        brand: item.brand || 'Imported Brand',
        price: Number(item.price || 29.99),
        costPrice: Number(item.costPrice || 12.00),
        stock: parseInt(item.stock || 20, 10),
        minStockThreshold: 10,
        status: item.status || 'active',
        description: item.description || '',
        isValid: errors.length === 0,
        errors
      };
    });

    setParsedRows(validated);
  };

  const handleExecuteImport = async () => {
    if (parsedRows.length === 0) return;
    setIsImporting(true);
    try {
      const validRows = parsedRows.filter((r) => r.isValid);
      await onImportProducts(validRows);
      onClose();
    } finally {
      setIsImporting(false);
    }
  };

  const downloadSampleTemplate = () => {
    const csvContent =
      'Product Name,SKU,Category,Brand,Price,Cost Price,Stock,Status,Description\r\n' +
      '"Wireless Mechanical Keyboard","CM-ELE-KEY-1092","Electronics","Keychron",119.99,55.00,30,"active","RGB Wireless gaming keyboard"\r\n' +
      '"Organic Cotton T-Shirt","CM-APP-TSH-2041","Apparel & Fashion","EcoWear",34.50,11.20,65,"active","100% GOTS certified cotton"\r\n' +
      '"Pour-Over Glass Carafe","CM-HOM-CAR-3301","Home & Kitchen","BrewMaster",42.00,16.00,18,"active","Heat-resistant borosilicate glass"';

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'cloudmart360-sample-template.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Bulk Catalog Import"
      subtitle="Import multiple products directly into Amazon DynamoDB from CSV or JSON."
      maxWidth="720px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {/* Dropzone Area */}
        {parsedRows.length === 0 ? (
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              padding: '40px 24px',
              border: `2px dashed ${dragActive ? 'var(--brand-primary)' : 'var(--border-medium)'}`,
              borderRadius: 'var(--radius-xl)',
              background: dragActive ? 'rgba(255, 87, 34, 0.08)' : 'rgba(255, 255, 255, 0.02)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.json"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                background: 'rgba(255, 87, 34, 0.15)',
                color: 'var(--brand-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '12px'
              }}
            >
              <Upload size={24} />
            </div>

            <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Drag and drop your CSV or JSON file here
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              or click to browse from your computer (.csv, .json supported)
            </div>

            <div style={{ marginTop: '16px' }}>
              <Button
                variant="secondary"
                size="sm"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  downloadSampleTemplate();
                }}
                icon={Download}
              >
                Download Sample CSV Template
              </Button>
            </div>
          </div>
        ) : (
          /* Preview Table of Parsed Rows */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileSpreadsheet size={18} color="var(--brand-primary)" />
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {fileName} ({parsedRows.length} items parsed)
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setParsedRows([]);
                  setFileName('');
                }}
              >
                Choose Different File
              </Button>
            </div>

            <div className="table-container" style={{ maxHeight: '240px', overflowY: 'auto' }}>
              <table className="glass-table" style={{ fontSize: '0.8125rem' }}>
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>Product Name</th>
                    <th>SKU</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {parsedRows.map((r) => (
                    <tr key={r.id}>
                      <td>
                        {r.isValid ? (
                          <span style={{ color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <CheckCircle2 size={14} /> Valid
                          </span>
                        ) : (
                          <span style={{ color: 'var(--color-danger)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <AlertTriangle size={14} /> Error
                          </span>
                        )}
                      </td>
                      <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{r.name}</td>
                      <td className="font-mono">{r.sku}</td>
                      <td>{r.category}</td>
                      <td className="font-mono">{formatCurrency(r.price)}</td>
                      <td className="font-mono">{r.stock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
          <Button variant="ghost" onClick={onClose} disabled={isImporting}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleExecuteImport}
            disabled={parsedRows.length === 0 || isImporting}
            isLoading={isImporting}
            icon={Upload}
          >
            Import {parsedRows.filter((r) => r.isValid).length} Products to DynamoDB
          </Button>
        </div>
      </div>
    </Modal>
  );
}
