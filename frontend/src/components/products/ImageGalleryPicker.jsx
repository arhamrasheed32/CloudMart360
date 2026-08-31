import React, { useState, useRef } from 'react';
import {
  Image as ImageIcon,
  Upload,
  Sparkles,
  Check,
  X,
  ExternalLink,
  Layers
} from 'lucide-react';
import { Button } from '../ui/Button.jsx';
import { Input } from '../ui/Input.jsx';

export const CURATED_RETAIL_GALLERY = [
  { id: 'img-1', name: 'ANC Headphones', category: 'Electronics', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80' },
  { id: 'img-2', name: 'Smart Fitness Watch', category: 'Electronics', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80' },
  { id: 'img-3', name: 'Mechanical Keyboard', category: 'Electronics', url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80' },
  { id: 'img-4', name: '4K Curved Monitor', category: 'Electronics', url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&q=80' },
  { id: 'img-5', name: 'Merino Wool Hoodie', category: 'Apparel', url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&q=80' },
  { id: 'img-6', name: 'Carbon Trail Shoes', category: 'Footwear', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80' },
  { id: 'img-7', name: 'Single-Origin Coffee', category: 'Groceries', url: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=600&q=80' },
  { id: 'img-8', name: 'Barista Electric Kettle', category: 'Kitchen', url: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=600&q=80' },
  { id: 'img-9', name: 'Acoustic Wool Panels', category: 'Home', url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&q=80' },
  { id: 'img-10', name: 'Botanical Face Serum', category: 'Beauty', url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80' },
  { id: 'img-11', name: 'Leather Cardholder', category: 'Accessories', url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&q=80' },
  { id: 'img-12', name: 'Titanium Fountain Pen', category: 'Stationery', url: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=600&q=80' }
];

export function ImageGalleryPicker({
  value = '',
  onChange
}) {
  const [activeTab, setActiveTab] = useState('gallery'); // 'gallery' | 'upload' | 'url'
  const [dragActive, setDragActive] = useState(false);
  const [fileSizeInfo, setFileSizeInfo] = useState('');
  const fileInputRef = useRef(null);

  const handleFileUpload = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const sizeKb = Math.round(file.size / 1024);
    setFileSizeInfo(`${file.name} (${sizeKb} KB)`);

    const reader = new FileReader();
    reader.onload = (e) => {
      onChange(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ImageIcon size={16} color="var(--color-info)" />
          <h3 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Media & Product Imagery
          </h3>
        </div>

        {/* Tab switcher */}
        <div style={{ display: 'flex', background: 'rgba(255, 255, 255, 0.04)', borderRadius: 'var(--radius-sm)', padding: '2px' }}>
          <button
            type="button"
            onClick={() => setActiveTab('gallery')}
            style={{
              padding: '4px 8px',
              fontSize: '0.6875rem',
              fontWeight: 600,
              borderRadius: 'var(--radius-xs)',
              color: activeTab === 'gallery' ? 'var(--text-primary)' : 'var(--text-muted)',
              background: activeTab === 'gallery' ? 'rgba(255, 87, 34, 0.25)' : 'transparent',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Gallery
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            style={{
              padding: '4px 8px',
              fontSize: '0.6875rem',
              fontWeight: 600,
              borderRadius: 'var(--radius-xs)',
              color: activeTab === 'upload' ? 'var(--text-primary)' : 'var(--text-muted)',
              background: activeTab === 'upload' ? 'rgba(255, 87, 34, 0.25)' : 'transparent',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Upload
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('url')}
            style={{
              padding: '4px 8px',
              fontSize: '0.6875rem',
              fontWeight: 600,
              borderRadius: 'var(--radius-xs)',
              color: activeTab === 'url' ? 'var(--text-primary)' : 'var(--text-muted)',
              background: activeTab === 'url' ? 'rgba(255, 87, 34, 0.25)' : 'transparent',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Direct URL
          </button>
        </div>
      </div>

      {/* Tab 1: Curated Photo Presets */}
      {activeTab === 'gallery' && (
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
            Select from high-resolution catalog assets:
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '8px',
              maxHeight: '160px',
              overflowY: 'auto',
              paddingRight: '4px'
            }}
          >
            {CURATED_RETAIL_GALLERY.map((img) => {
              const isSelected = value === img.url;
              return (
                <div
                  key={img.id}
                  onClick={() => onChange(img.url)}
                  style={{
                    height: '65px',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    position: 'relative',
                    cursor: 'pointer',
                    border: isSelected ? '2px solid var(--brand-primary)' : '1px solid var(--border-subtle)',
                    boxShadow: isSelected ? '0 0 12px rgba(255, 87, 34, 0.4)' : 'none',
                    transition: 'all var(--transition-fast)'
                  }}
                  title={img.name}
                >
                  <img
                    src={img.url}
                    alt={img.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  {isSelected && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '4px',
                        right: '4px',
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        background: 'var(--brand-primary)',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Check size={11} strokeWidth={3} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Local File Upload Dropzone */}
      {activeTab === 'upload' && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) handleFileUpload(e.target.files[0]);
            }}
            style={{ display: 'none' }}
          />
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              padding: '24px',
              border: `2px dashed ${dragActive ? 'var(--brand-primary)' : 'var(--border-medium)'}`,
              borderRadius: 'var(--radius-md)',
              background: dragActive ? 'rgba(255, 87, 34, 0.08)' : 'rgba(255, 255, 255, 0.02)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <Upload size={22} color="var(--brand-primary)" style={{ marginBottom: '6px' }} />
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Click to browse or drop an image file
            </span>
            <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              PNG, JPG, WebP supported • Converted automatically
            </span>
            {fileSizeInfo && (
              <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--color-success)', marginTop: '8px' }}>
                {fileSizeInfo}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Direct URL Input */}
      {activeTab === 'url' && (
        <Input
          label="Image URL"
          placeholder="https://images.unsplash.com/..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          helperText="Direct HTTP/HTTPS link to high-res product photo"
        />
      )}

      {/* Live Preview Display */}
      {value && (
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '140px',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            background: 'rgba(0, 0, 0, 0.4)',
            border: '1px solid var(--border-medium)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <img
            src={value}
            alt="Selected preview"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <button
            type="button"
            onClick={() => onChange('')}
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              padding: '4px',
              borderRadius: '50%',
              background: 'rgba(0, 0, 0, 0.7)',
              color: '#FFFFFF',
              border: 'none',
              cursor: 'pointer'
            }}
            title="Remove image"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
