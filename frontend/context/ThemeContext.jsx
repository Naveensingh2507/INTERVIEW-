"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext({
  dark: true,
  toggle: () => {},
});

export function ThemeProvider({ children }) {
  // Start with dark as the default (matches the blocking script default)
  const [dark, setDark] = useState(true);

  useEffect(() => {
    // Read the data-theme that the blocking script already applied
    const current = document.documentElement.getAttribute('data-theme');
    setDark(current !== 'light');
  }, []);

  const toggle = () => {
    setDark(prev => {
      const next = !prev;
      const theme = next ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', theme);
      try { localStorage.setItem('hv_theme', theme); } catch (e) {}
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ dark, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
