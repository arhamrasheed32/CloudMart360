import React, { useRef, useState } from 'react';

export function SpotlightCard({
  children,
  className = '',
  style = {},
  spotlightColor = 'rgba(255, 87, 34, 0.15)',
  onClick,
  ...props
}) {
  const divRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseEnter = () => setOpacity(1);
  const handleMouseLeave = () => setOpacity(0);

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`glass-panel ${className}`}
      style={{
        position: 'relative',
        overflow: 'hidden',
        ...style
      }}
      {...props}
    >
      {/* Spotlight Glow Layer */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          opacity,
          transition: 'opacity 300ms ease',
          background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 60%)`
        }}
      />
      {children}
    </div>
  );
}
