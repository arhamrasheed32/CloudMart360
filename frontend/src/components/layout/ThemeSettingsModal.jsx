import React, { useState, useEffect } from 'react';
import {
  Palette,
  Volume2,
  VolumeX,
  Check,
  User,
  ShieldCheck,
  Sparkles,
  Zap
} from 'lucide-react';
import { Modal } from '../ui/Modal.jsx';
import { Button } from '../ui/Button.jsx';
import {
  THEME_ACCENTS,
  applyThemeAccent,
  getSavedThemeAccent
} from '../../utils/themeManager.js';
import {
  isAudioFeedbackEnabled,
  setAudioFeedbackEnabled,
  playSuccessChime
} from '../../utils/audioFeedback.js';

export function ThemeSettingsModal({ isOpen, onClose }) {
  const [currentAccent, setCurrentAccent] = useState(getSavedThemeAccent());
  const [soundEnabled, setSoundEnabled] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentAccent(getSavedThemeAccent());
      setSoundEnabled(isAudioFeedbackEnabled());
    }
  }, [isOpen]);

  const handleSelectAccent = (accentId) => {
    const selected = applyThemeAccent(accentId);
    setCurrentAccent(selected);
    playSuccessChime();
  };

  const handleToggleSound = (enabled) => {
    setSoundEnabled(enabled);
    setAudioFeedbackEnabled(enabled);
    if (enabled) {
      setTimeout(() => playSuccessChime(), 50);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Platform Settings & Personalization"
      subtitle="Customize your CloudMart 360 interface accent, audio feedback, and profile."
      maxWidth="540px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* User Profile Snippet */}
        <div
          className="glass-panel"
          style={{
            padding: '16px',
            borderRadius: 'var(--radius-lg)',
            background: 'rgba(255, 255, 255, 0.02)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px'
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
              border: '1px solid var(--border-medium)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-primary)',
              fontSize: '1rem',
              fontWeight: 800
            }}
          >
            AD
          </div>

          <div>
            <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Retail Administrator
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              admin@cloudmart360.internal • Full Catalog Write Access
            </div>
          </div>

          <span className="badge" style={{ marginLeft: 'auto', background: 'var(--brand-subtle)', color: 'var(--brand-primary)' }}>
            Admin Role
          </span>
        </div>

        {/* Theme Accent Color Selection */}
        <div
          className="glass-panel"
          style={{
            padding: '18px',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Palette size={16} color="var(--brand-primary)" />
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Interface Accent Color
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))', gap: '10px' }}>
            {THEME_ACCENTS.map((accent) => {
              const isSelected = currentAccent.id === accent.id;
              return (
                <button
                  key={accent.id}
                  type="button"
                  onClick={() => handleSelectAccent(accent.id)}
                  style={{
                    padding: '12px 8px',
                    borderRadius: 'var(--radius-md)',
                    background: isSelected ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                    border: isSelected ? `2px solid ${accent.primary}` : '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    boxShadow: isSelected ? `0 0 16px ${accent.primary}55` : 'none'
                  }}
                >
                  <span
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: accent.primary,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF'
                    }}
                  >
                    {isSelected && <Check size={14} strokeWidth={3} />}
                  </span>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: isSelected ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                    {accent.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Audio Tactile Feedback */}
        <div
          className="glass-panel"
          style={{
            padding: '16px',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {soundEnabled ? (
              <Volume2 size={20} color="var(--color-success)" />
            ) : (
              <VolumeX size={20} color="var(--text-muted)" />
            )}
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Synthetic Audio Feedback
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Subtle micro-tones for clicks, saves, and stock changes
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleToggleSound(!soundEnabled)}
            style={{
              width: '46px',
              height: '26px',
              borderRadius: 'var(--radius-full)',
              background: soundEnabled ? 'var(--brand-primary)' : 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              position: 'relative',
              cursor: 'pointer',
              transition: 'background var(--transition-fast)'
            }}
          >
            <span
              style={{
                position: 'absolute',
                top: '3px',
                left: soundEnabled ? '23px' : '3px',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: '#FFFFFF',
                boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
                transition: 'left var(--transition-fast)'
              }}
            />
          </button>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '6px' }}>
          <Button variant="primary" size="sm" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
}
