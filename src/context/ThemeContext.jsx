import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loadThemes, applyTheme, getThemeDisplayName } from '../utils/themeLoader';
import { useLocalStorage } from '../hooks/useLocalStorage';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [themes, setThemes] = useState({});
  const [currentTheme, setCurrentTheme] = useLocalStorage('scribbles_theme', 'scribbles');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAllThemes() {
      try {
        const loadedThemes = await loadThemes();
        setThemes(loadedThemes);
      } catch (error) {
        console.error('Failed to load themes:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadAllThemes();
  }, []);

  useEffect(() => {
    if (!isLoading && themes[currentTheme]) {
      applyTheme(themes[currentTheme], 'light');
    }
  }, [currentTheme, themes, isLoading]);

  const changeTheme = useCallback((themeName) => {
    if (themes[themeName]) {
      setCurrentTheme(themeName);
    }
  }, [themes, setCurrentTheme]);

  const themeList = Object.keys(themes).map(key => ({
    id: key,
    name: getThemeDisplayName(key),
    data: themes[key]
  }));

  const value = {
    themes: themeList,
    currentTheme,
    changeTheme,
    isLoading,
    currentThemeData: themes[currentTheme]
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
