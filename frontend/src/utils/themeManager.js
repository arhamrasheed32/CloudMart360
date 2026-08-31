export const THEME_ACCENTS = [
  {
    id: 'coral',
    name: 'CloudMart Coral',
    primary: '#FF5722',
    hover: '#FF7043',
    active: '#F4511E',
    dark: '#E64A19',
    subtle: 'rgba(255, 87, 34, 0.12)',
    glow: '0 0 24px rgba(255, 87, 34, 0.28)'
  },
  {
    id: 'cyan',
    name: 'Cyber Cyan',
    primary: '#06B6D4',
    hover: '#22D3EE',
    active: '#0891B2',
    dark: '#0E7490',
    subtle: 'rgba(6, 182, 212, 0.12)',
    glow: '0 0 24px rgba(6, 182, 212, 0.28)'
  },
  {
    id: 'emerald',
    name: 'Neon Emerald',
    primary: '#10B981',
    hover: '#34D399',
    active: '#059669',
    dark: '#047857',
    subtle: 'rgba(16, 185, 129, 0.12)',
    glow: '0 0 24px rgba(16, 185, 129, 0.28)'
  },
  {
    id: 'violet',
    name: 'Electric Violet',
    primary: '#8B5CF6',
    hover: '#A78BFA',
    active: '#7C3AED',
    dark: '#6D28D9',
    subtle: 'rgba(139, 92, 246, 0.12)',
    glow: '0 0 24px rgba(139, 92, 246, 0.28)'
  },
  {
    id: 'amber',
    name: 'Solar Amber',
    primary: '#F59E0B',
    hover: '#FBBF24',
    active: '#D97706',
    dark: '#B45309',
    subtle: 'rgba(245, 158, 11, 0.12)',
    glow: '0 0 24px rgba(245, 158, 11, 0.28)'
  }
];

export function applyThemeAccent(accentId) {
  const accent = THEME_ACCENTS.find((a) => a.id === accentId) || THEME_ACCENTS[0];
  const root = document.documentElement;

  root.style.setProperty('--brand-primary', accent.primary);
  root.style.setProperty('--brand-hover', accent.hover);
  root.style.setProperty('--brand-active', accent.active);
  root.style.setProperty('--brand-dark', accent.dark);
  root.style.setProperty('--brand-subtle', accent.subtle);
  root.style.setProperty('--brand-glow', accent.glow);

  localStorage.setItem('cloudmart360_accent', accent.id);
  return accent;
}

export function getSavedThemeAccent() {
  const saved = localStorage.getItem('cloudmart360_accent');
  return THEME_ACCENTS.find((a) => a.id === saved) || THEME_ACCENTS[0];
}
