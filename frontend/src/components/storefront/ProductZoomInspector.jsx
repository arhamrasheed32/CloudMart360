import React, { useState, useRef } from 'react';
import { Package, Search } from 'lucide-react';

export function ProductZoomInspector({
  imageUrl,
  alt = 'Product image',
  width = '100%',
  height = '320px',
  zoomLevel = 2.5
}) {
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 0, y: 0, bgX: '50%', bgY: '50%' });

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const bgX = (x / rect.width) * 100;
    const bgY = (y / rect.height) * 100;

    setLensPos({ x, y, bgX: `${bgX}%`, bgY: `${bgY}%` });
  };

  if (!imageUrl) {
    return (
      <div
        style={{
          width,
          height,
          borderRadius: 'var(--radius-xl)',
          background: 'rgba(0, 0, 0, 0.4)',
          border: '1px solid var(--border-medium)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Package size={54} color="var(--text-muted)" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      style={{
        position: 'relative',
        width,
        height,
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        background: 'rgba(0, 0, 0, 0.4)',
        border: '1px solid var(--border-medium)',
        cursor: 'crosshair',
        userSelect: 'none'
      }}
    >
      {/* Base Photo */}
      <img
        src={imageUrl}
        alt={alt}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block'
        }}
      />

      {/* Magnified Glass Hover Lens */}
      {isHovered && (
        <div
          style={{
            position: 'absolute',
            top: `${lensPos.y - 65}px`,
            left: `${lensPos.x - 65}px`,
            width: '130px',
            height: '130px',
            borderRadius: '50%',
            border: '2px solid rgba(255, 255, 255, 0.8)',
            boxShadow: '0 0 24px rgba(0, 0, 0, 0.8), inset 0 0 10px rgba(0, 0, 0, 0.4)',
            backgroundImage: `url(${imageUrl})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: `${lensPos.bgX} ${lensPos.bgY}`,
            backgroundSize: `${zoomLevel * 100}%`,
            pointerEvents: 'none',
            zIndex: 10
          }}
        />
      )}

      {/* Lens Hint Indicator */}
      <div
        style={{
          position: 'absolute',
          bottom: '10px',
          right: '10px',
          padding: '4px 8px',
          borderRadius: 'var(--radius-sm)',
          background: 'rgba(10, 14, 22, 0.8)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          fontSize: '0.6875rem',
          color: '#94A3B8',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          pointerEvents: 'none'
        }}
      >
        <Search size={11} />
        <span>Hover to inspect high-res zoom</span>
      </div>
    </div>
  );
}
