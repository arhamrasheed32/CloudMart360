import React from 'react';
import { Keyboard, Sparkles } from 'lucide-react';
import { Modal } from './Modal.jsx';
import { Button } from './Button.jsx';

export function KeyboardShortcutsModal({ isOpen, onClose }) {
  const shortcuts = [
    { key: 'Ctrl + K / ⌘K', desc: 'Open Linear-style Command Palette' },
    { key: '/', desc: 'Instant search focus' },
    { key: 'N', desc: 'Add new product drawer' },
    { key: 'E', desc: 'Export full catalog to CSV' },
    { key: 'I', desc: 'Open CSV/JSON bulk importer' },
    { key: 'A', desc: 'Toggle Analytics & Insights panel' },
    { key: 'V', desc: 'Toggle Table vs Grid Card view' },
    { key: 'ESC', desc: 'Dismiss any modal, drawer, or palette' },
    { key: '?', desc: 'Open this Keyboard Shortcuts cheat sheet' }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Keyboard Shortcuts"
      subtitle="Power-user hotkeys for ultrafast retail catalog operations."
      maxWidth="500px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div className="glass-panel" style={{ padding: '8px 14px', borderRadius: 'var(--radius-lg)' }}>
          {shortcuts.map((s, idx) => (
            <div
              key={s.key}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 0',
                borderBottom: idx !== shortcuts.length - 1 ? '1px solid var(--border-subtle)' : 'none'
              }}
            >
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{s.desc}</span>
              <kbd
                className="font-mono"
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid var(--border-medium)',
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '6px' }}>
          <Button variant="primary" size="sm" onClick={onClose}>
            Got it
          </Button>
        </div>
      </div>
    </Modal>
  );
}
