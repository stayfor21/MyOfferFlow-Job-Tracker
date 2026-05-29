import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'offerflow-theme';
const THEMES = ['dark', 'light'];

function getStoredTheme() {
  if (typeof window === 'undefined') return 'dark';
  const value = window.localStorage.getItem(STORAGE_KEY);
  return THEMES.includes(value) ? value : 'dark';
}

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(getStoredTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const value = useMemo(() => {
    const setTheme = (nextTheme) => {
      setThemeState(THEMES.includes(nextTheme) ? nextTheme : 'dark');
    };

    const toggleTheme = () => {
      setThemeState((current) => (current === 'dark' ? 'light' : 'dark'));
    };

    return { theme, setTheme, toggleTheme, isLight: theme === 'light' };
  }, [theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used inside ThemeProvider');
  return context;
}

