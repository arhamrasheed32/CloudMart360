import React, { useRef } from 'react';
import { Printer, Download, QrCode, Barcode as BarcodeIcon } from 'lucide-react';
import { Button } from '../ui/Button.jsx';
import { formatCurrency } from '../../utils/formatters.js';

export function ProductBarcode({ product }) {
  const barcodeRef = useRef(null);

  if (!product) return null;

  // Generate pseudo Code128 bar pattern from SKU string hash
  const generateBarcodePattern = (text) => {
    const bars = [];
    const sanitized = (text || 'CM-360-PRD').toUpperCase();
    for (let i = 0; i < sanitized.length; i++) {
      const code = sanitized.charCodeAt(i);
      const w1 = (code % 3) + 1;
      const w2 = ((code >> 1) % 3) + 1;
      const w3 = ((code >> 2) % 2) + 1;
      bars.push({ width: w1, black: true });
      bars.push({ width: 1, black: false });
      bars.push({ width: w2, black: true });
      bars.push({ width: 2, black: false });
      bars.push({ width: w3, black: true });
      bars.push({ width: 1, black: false });
    }
    return bars;
  };

  const bars = generateBarcodePattern(product.sku);

  const handlePrint = () => {
    const printWindow = window.open('', '_blank', 'width=450,height=350');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Label - ${product.sku}</title>
          <style>
            body { font-family: sans-serif; text-align: center; padding: 20px; }
            .label { border: 2px dashed #333; padding: 16px; border-radius: 8px; max-width: 320px; margin: 0 auto; }
            .title { font-size: 14px; font-weight: bold; margin-bottom: 6px; }
            .price { font-size: 18px; font-weight: bold; color: #E64A19; margin: 8px 0; }
            .sku { font-family: monospace; font-size: 12px; letter-spacing: 2px; }
            svg { margin: 8px 0; }
          </style>
        </head>
        <body>
          <div class="label">
            <div class="title">${product.name}</div>
            <div class="price">${formatCurrency(product.price)}</div>
            ${barcodeRef.current ? barcodeRef.current.outerHTML : ''}
            <div class="sku">${product.sku}</div>
            <div style="font-size: 10px; color: #666; margin-top: 4px;">CloudMart 360 Inventory Management</div>
          </div>
          <script>window.onload = () => { window.print(); window.close(); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div
      className="glass-panel"
      style={{
        padding: '16px',
        borderRadius: 'var(--radius-lg)',
        background: 'rgba(255, 255, 255, 0.02)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <BarcodeIcon size={16} color="var(--brand-primary)" />
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Retail Barcode & Inventory Label
          </span>
        </div>
        <Button variant="secondary" size="sm" onClick={handlePrint} icon={Printer} style={{ height: '28px', fontSize: '0.75rem' }}>
          Print Label
        </Button>
      </div>

      {/* Printable Label Box */}
      <div
        style={{
          background: '#FFFFFF',
          color: '#090D16',
          padding: '16px 20px',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
          boxShadow: 'var(--shadow-md)',
          maxWidth: '320px',
          width: '100%'
        }}
      >
        <div style={{ fontSize: '0.8125rem', fontWeight: 700, textAlign: 'center', color: '#111827', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {product.name}
        </div>

        {/* SVG Barcode */}
        <svg
          ref={barcodeRef}
          width="260"
          height="54"
          viewBox={`0 0 ${bars.reduce((acc, b) => acc + b.width, 0)} 50`}
          preserveAspectRatio="none"
          style={{ width: '100%', height: '48px' }}
        >
          {bars.reduce(
            ({ currentX, elements }, bar, idx) => {
              if (bar.black) {
                elements.push(
                  <rect
                    key={idx}
                    x={currentX}
                    y="0"
                    width={bar.width}
                    height="50"
                    fill="#111827"
                  />
                );
              }
              return { currentX: currentX + bar.width, elements };
            },
            { currentX: 0, elements: [] }
          ).elements}
        </svg>

        <div className="font-mono" style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', color: '#374151' }}>
          {product.sku}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', borderTop: '1px solid #E5E7EB', paddingTop: '4px', marginTop: '2px', fontSize: '0.75rem' }}>
          <span style={{ color: '#6B7280' }}>{product.category}</span>
          <span style={{ fontWeight: 800, color: '#EA580C' }}>{formatCurrency(product.price)}</span>
        </div>
      </div>
    </div>
  );
}
