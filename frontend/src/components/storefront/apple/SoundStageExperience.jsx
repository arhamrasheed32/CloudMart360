import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Sparkles,
  Waves,
  Play,
  Pause,
  ShieldCheck,
  Headphones,
  Zap
} from 'lucide-react';
import { Button } from '../../ui/Button.jsx';
import { SpotlightCard } from '../../ui/SpotlightCard.jsx';

const AUDIO_MODES = [
  {
    id: 'anc',
    title: 'Active Noise Cancellation',
    subtitle: 'Silent Obsidian Void',
    freqLabel: '40dB Attenuation • 20Hz - 20kHz Silent Phase',
    desc: 'Inverse soundwaves counteract ambient low-frequency chatter and urban rumble.'
  },
  {
    id: 'spatial',
    title: 'Personalized Spatial Audio',
    subtitle: 'Dynamic 3D Sphere',
    freqLabel: 'Dolby Atmos Spatial Calibrated • 48kHz / 24-Bit',
    desc: 'Simulates a 12-speaker physical acoustic theater with precision head tracking.'
  },
  {
    id: 'transparency',
    title: 'Adaptive Transparency',
    subtitle: 'Natural Acoustic Pass-Through',
    freqLabel: 'Zero-Latency Ambient Mix • Dual Neural DSP Engine',
    desc: 'Hear conversations naturally while attenuating sudden loud construction spikes.'
  }
];

export function SoundStageExperience() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeMode, setActiveMode] = useState(AUDIO_MODES[1]); // Spatial
  const audioContextRef = useRef(null);
  const oscillatorRef = useRef(null);

  // Toggle Web Audio API synthetic ambient frequency
  const toggleSound = () => {
    try {
      if (isPlaying) {
        if (audioContextRef.current) {
          audioContextRef.current.close();
          audioContextRef.current = null;
        }
        setIsPlaying(false);
      } else {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;

        const ctx = new AudioContext();
        audioContextRef.current = ctx;

        // Gentle harmonic chord
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(220, ctx.currentTime); // A3

        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(329.63, ctx.currentTime); // E4

        gain.gain.setValueAtTime(0.04, ctx.currentTime);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start();
        osc2.start();

        setIsPlaying(true);
      }
    } catch (e) {
      console.warn('AudioContext error:', e);
    }
  };

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <section style={{ maxWidth: '1240px', margin: '0 auto', padding: '60px 24px', width: '100%' }}>
      <SpotlightCard
        spotlightColor="rgba(56, 189, 248, 0.15)"
        style={{
          padding: '48px 36px',
          borderRadius: 'var(--radius-2xl)',
          background: 'linear-gradient(135deg, rgba(14, 20, 36, 0.95) 0%, rgba(6, 8, 13, 0.98) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          boxShadow: '0 32px 80px -16px rgba(0, 0, 0, 0.9)',
          display: 'flex',
          flexDirection: 'column',
          gap: '32px'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38BDF8', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '6px' }}>
              <Headphones size={16} />
              <span>Interactive Acoustic Chamber</span>
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.03em', margin: 0 }}>
              Listen to Sound Architecture.
            </h2>
          </div>

          {/* Sound Toggle Button */}
          <button
            onClick={toggleSound}
            style={{
              height: '44px',
              padding: '0 22px',
              borderRadius: 'var(--radius-full)',
              background: isPlaying ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.08)',
              border: isPlaying ? '1px solid #38BDF8' : '1px solid rgba(255, 255, 255, 0.15)',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: isPlaying ? '0 0 20px rgba(56, 189, 248, 0.4)' : 'none',
              transition: 'all 200ms ease'
            }}
          >
            {isPlaying ? <Pause size={16} color="#38BDF8" /> : <Play size={16} color="#FFFFFF" />}
            <span>{isPlaying ? 'Pause Spatial Soundscape' : 'Play Spatial Audio Demo'}</span>
          </button>
        </div>

        {/* Mode Selector Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
          {AUDIO_MODES.map((mode) => {
            const isSelected = activeMode.id === mode.id;

            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => setActiveMode(mode)}
                style={{
                  padding: '20px',
                  borderRadius: 'var(--radius-xl)',
                  background: isSelected ? 'rgba(56, 189, 248, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                  border: isSelected ? '1px solid #38BDF8' : '1px solid rgba(255, 255, 255, 0.08)',
                  boxShadow: isSelected ? '0 0 24px rgba(56, 189, 248, 0.2)' : 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 200ms ease',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}
              >
                <div style={{ fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase', color: isSelected ? '#38BDF8' : '#64748B' }}>
                  {mode.subtitle}
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#FFFFFF' }}>
                  {mode.title}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8', lineHeight: 1.4 }}>
                  {mode.desc}
                </div>
              </button>
            );
          })}
        </div>

        {/* Animated Waveform Frequency Canvas Visualizer */}
        <div
          style={{
            padding: '24px',
            borderRadius: 'var(--radius-xl)',
            background: 'rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
            <span style={{ color: '#94A3B8', fontWeight: 600 }}>Active Spectrum: {activeMode.freqLabel}</span>
            <span style={{ color: isPlaying ? '#10B981' : '#64748B', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
              <span className="pulse-status" style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: isPlaying ? '#10B981' : '#64748B' }} />
              {isPlaying ? 'Live Acoustic Harmonic Stream' : 'Awaiting Playback'}
            </span>
          </div>

          {/* Equalizer Frequency Bars */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '64px', gap: '4px' }}>
            {[...Array(36)].map((_, i) => {
              const baseHeight = Math.sin((i / 36) * Math.PI) * 50 + 10;
              const animatedHeight = isPlaying ? Math.max(12, (baseHeight + Math.sin(Date.now() / 200 + i) * 20)) : 8;

              return (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: `${animatedHeight}px`,
                    borderRadius: 'var(--radius-full)',
                    background: isPlaying
                      ? `linear-gradient(180deg, #38BDF8 0%, var(--brand-primary) 100%)`
                      : 'rgba(255, 255, 255, 0.1)',
                    transition: 'height 150ms ease'
                  }}
                />
              );
            })}
          </div>
        </div>
      </SpotlightCard>
    </section>
  );
}
