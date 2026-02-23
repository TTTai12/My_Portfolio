// src/components/ThemeToggle.tsx
import React from 'react';
import useTheme from '../hook/theme';
import { FiMoon, FiSun } from 'react-icons/fi';

interface ThemeToggleProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function ThemeToggle({ className, style }: ThemeToggleProps) {
  const { theme, toggle } = useTheme();
  const iconColor = theme === 'light' ? '#111827' : '#e6eef8';
  return (
 <button
  onClick={toggle}
  className={className ?? 'theme-toggle'}
  style={{ color: 'var(--icon-color)', padding: 6, borderRadius: 6, background: 'transparent', border: 'none' }}
  aria-pressed={theme === 'dark'}
>
  {theme === 'light' ? <FiMoon size={18} /> : <FiSun size={18} />}
</button>
  );
}
