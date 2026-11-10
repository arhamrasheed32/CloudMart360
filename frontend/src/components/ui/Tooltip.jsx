import React, { useState, useRef, useEffect } from 'react';

export function Tooltip({ text, children, position = 'top' }) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);
  const [coords, setCoords] = useState(null);

  useEffect(() => {
    if (isVisible && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const style = {};

      // Vertical placement:
      // If position requested is 'top', but element is within 45px of viewport top, auto-flip to bottom!
      if (position === 'bottom' || (position === 'top' && rect.top < 45)) {
        style.top = 'calc(100% + 6px)';
        style.bottom = 'auto';
      } else if (position === 'right') {
        style.top = '50%';
        style.transform = 'translateY(-50%)';
        // If too close to right edge, flip to left
        if (window.innerWidth - rect.right < 140) {
          style.right = 'calc(100% + 6px)';
          style.left = 'auto';
        } else {
          style.left = 'calc(100% + 6px)';
          style.right = 'auto';
        }
      } else {
        // Default top placement
        style.bottom = 'calc(100% + 6px)';
        style.top = 'auto';
      }

      // Horizontal boundary clamping for top/bottom tooltips:
      if (position !== 'right') {
        const viewportWidth = window.innerWidth;
        const centerX = rect.left + rect.width / 2;

        if (centerX < 100) {
          // Near left screen edge: align flush left
          style.left = '0';
          style.right = 'auto';
          style.transform = 'none';
        } else if (viewportWidth - centerX < 100) {
          // Near right screen edge: align flush right
          style.right = '0';
          style.left = 'auto';
          style.transform = 'none';
        } else {
          // Centered
          style.left = '50%';
          style.right = 'auto';
          style.transform = 'translateX(-50%)';
        }
      }

      setCoords(style);
    } else {
      setCoords(null);
    }
  }, [isVisible, position]);

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && text && (
        <div
          role="tooltip"
          className="glass-modal"
          style={{
            position: 'absolute',
            zIndex: 'var(--z-tooltip, 150)',
            padding: '5px 10px',
            fontSize: '0.6875rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            background: 'rgba(10, 14, 22, 0.96)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-sm)',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6), 0 0 10px rgba(255, 87, 34, 0.2)',
            animation: 'fadeIn 120ms ease-out',
            ...(coords || {
              // Safe initial fallback while coords effect runs
              top: position === 'bottom' || position === 'top' ? 'calc(100% + 6px)' : 'auto',
              bottom: position === 'top' ? 'auto' : 'auto',
              left: '50%',
              transform: 'translateX(-50%)'
            })
          }}
        >
          {text}
        </div>
      )}
    </div>
  );
}
