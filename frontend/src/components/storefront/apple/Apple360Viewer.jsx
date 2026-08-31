import React, { useState, useRef } from 'react';
import {
  Sparkles,
  Cpu,
  BatteryCharging,
  ShieldCheck,
  Zap,
  Eye,
  Layers,
  Check
} from 'lucide-react';
import { SpotlightCard } from '../../ui/SpotlightCard.jsx';
import { formatCurrency } from '../../../utils/formatters.js';

const HOTSPOTS = [
  {
    id: 'chamber',
    x: '32%',
    y: '42%',
    title: 'Precision Acoustic Chamber',
    subtitle: '40mm Bio-Cellulose Drivers',
    detail: 'Machined from a single block of aerospace titanium with micro-perforated damping ports for 0.05% THD harmonic clarity.'
  },
  {
    id: 'battery',
    x: '68%',
    y: '58%',
    title: 'Solid-State Power Core',
    subtitle: '40-Hour Continuous Playback',
    detail: 'Graphene-enhanced lithium cell supporting 15W USB-C fast charging. 10 minutes equals 5 hours of lossless playback.'
  },
  {
    id: 'chip',
    x: '50%',
    y: '28%',
    title: 'CloudMart Neural DSP',
    subtitle: '48kHz Dynamic Head Tracking',
    detail: 'Dual 32-bit DSPs process 6 ambient environmental microphones 48,000 times per second for instant ANC calibration.'
  }
];

export function Apple360Viewer({ activeImage, activeTitle = 'Aura Pro' }) {
  const containerRef = useRef(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [activeHotspot, setActiveHotspot] = useState(HOTSPOTS[0]);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12; // Max 12deg tilt
    const rotateY = ((x - centerX) / centerX) * 16;  // Max 16deg tilt

    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
  };

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '1240px',
        margin: '0 auto',
        padding: '0 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}
    >
      {/* 3D Stage Container */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          position: 'relative',
          width: '100%',
          height: '480px',
          borderRadius: 'var(--radius-2xl)',
          background: 'radial-gradient(ellipse at 50% 50%, rgba(255, 87, 34, 0.08) 0%, rgba(6, 8, 13, 0.95) 75%)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 32px 80px -16px rgba(0, 0, 0, 0.95), inset 0 1px 2px rgba(255, 255, 255, 0.15)',
          perspective: '1200px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'grab'
        }}
      >
        {/* Mirror Floor Grid Sheen */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '140px',
            background: 'linear-gradient(180deg, transparent 0%, rgba(255, 87, 34, 0.03) 100%)',
            pointerEvents: 'none'
          }}
        />

        {/* 3D Rotating Product Image */}
        <div
          style={{
            position: 'relative',
            width: '380px',
            height: '380px',
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale3d(${isHovered ? 1.05 : 1}, ${isHovered ? 1.05 : 1}, 1)`,
            transition: isHovered ? 'transform 80ms ease-out' : 'transform 600ms cubic-bezier(0.16, 1, 0.3, 1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <img
            src={activeImage}
            alt={activeTitle}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: 'var(--radius-2xl)',
              filter: 'drop-shadow(0 28px 50px rgba(0,0,0,0.85))',
              userSelect: 'none',
              pointerEvents: 'none'
            }}
          />

          {/* Interactive Hotspot Node Markers */}
          {HOTSPOTS.map((spot) => {
            const isSelected = activeHotspot.id === spot.id;

            return (
              <button
                key={spot.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveHotspot(spot);
                }}
                style={{
                  position: 'absolute',
                  top: spot.y,
                  left: spot.x,
                  transform: 'translate(-50%, -50%)',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: isSelected ? 'var(--brand-primary)' : 'rgba(255, 255, 255, 0.25)',
                  border: isSelected ? '2px solid #FFFFFF' : '2px solid rgba(255, 255, 255, 0.8)',
                  boxShadow: isSelected ? '0 0 20px rgba(255, 87, 34, 0.8)' : '0 0 10px rgba(0, 0, 0, 0.5)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0,
                  transition: 'all 200ms ease',
                  zIndex: 20
                }}
                title={spot.title}
              >
                <span
                  className="pulse-status"
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: isSelected ? '#FFFFFF' : 'var(--brand-primary)'
                  }}
                />
              </button>
            );
          })}
        </div>

        {/* 3D Drag Hint */}
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(10, 14, 22, 0.85)',
            backdropFilter: 'blur(16px)',
            padding: '6px 16px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            fontSize: '0.75rem',
            color: '#94A3B8',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            pointerEvents: 'none'
          }}
        >
          <Sparkles size={12} color="var(--brand-primary)" />
          <span>Interactive 3D Stage • Move mouse to inspect angles</span>
        </div>
      </div>

      {/* Telemetry Detail Readout Card */}
      {activeHotspot && (
        <SpotlightCard
          spotlightColor="rgba(255, 87, 34, 0.15)"
          style={{
            padding: '24px 32px',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            background: 'rgba(14, 18, 28, 0.9)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px'
          }}
        >
          <div>
            <div style={{ fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--brand-primary)', marginBottom: '4px' }}>
              Selected Hardware Architecture
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '4px' }}>
              {activeHotspot.title}
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#94A3B8', maxWidth: '640px', lineHeight: 1.5, margin: 0 }}>
              {activeHotspot.detail}
            </p>
          </div>

          <div
            className="badge"
            style={{
              padding: '6px 14px',
              fontSize: '0.8125rem',
              fontWeight: 700,
              background: 'rgba(255, 87, 34, 0.15)',
              color: 'var(--brand-primary)',
              border: '1px solid rgba(255, 87, 34, 0.3)'
            }}
          >
            {activeHotspot.subtitle}
          </div>
        </SpotlightCard>
      )}
    </div>
  );
}
