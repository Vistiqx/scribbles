const THEME_PATH = '/themes/';

export async function loadThemes() {
  const response = await fetch(`${THEME_PATH}scribbles.json`);
  const defaultTheme = await response.json();
  
  const themeFiles = [
    'scribbles', 'amethyst-haze', 'catppuccin', 'claymorphism', 'cyberpunk',
    'darkmatter', 'graphite', 'modern-minimal', 'northern-lights',
    'ocean-breeze', 'sage-garden', 'soft-pop', 'supabase',
    'twitter', 'vintage-paper', 'violet-bloom'
  ];

  const themes = {};
  
  for (const file of themeFiles) {
    try {
      const res = await fetch(`${THEME_PATH}${file}.json`);
      const theme = await res.json();
      themes[file] = theme;
    } catch (error) {
      console.error(`Failed to load theme: ${file}`, error);
    }
  }

  return themes;
}

export function applyTheme(themeData, mode = 'light') {
  const vars = themeData.cssVars?.light;
  if (!vars) return;

  const root = document.documentElement;
  
  const cssVarMappings = {
    background: '--background',
    foreground: '--foreground',
    card: '--card',
    'card-foreground': '--card-foreground',
    popover: '--popover',
    'popover-foreground': '--popover-foreground',
    primary: '--primary',
    'primary-foreground': '--primary-foreground',
    secondary: '--secondary',
    'secondary-foreground': '--secondary-foreground',
    muted: '--muted',
    'muted-foreground': '--muted-foreground',
    accent: '--accent',
    'accent-foreground': '--accent-foreground',
    destructive: '--destructive',
    'destructive-foreground': '--destructive-foreground',
    border: '--border',
    input: '--input',
    ring: '--ring',
    radius: '--radius',
    'font-sans': '--font-sans',
    'font-mono': '--font-mono',
    'font-serif': '--font-serif',
    'shadow-color': '--shadow-color',
    'shadow-opacity': '--shadow-opacity',
    'shadow-blur': '--shadow-blur',
    'shadow-spread': '--shadow-spread',
    'shadow-offset-x': '--shadow-offset-x',
    'shadow-offset-y': '--shadow-offset-y',
    'shadow-2xs': '--shadow-2xs',
    'shadow-xs': '--shadow-xs',
    'shadow-sm': '--shadow-sm',
    'shadow': '--shadow',
    'shadow-md': '--shadow-md',
    'shadow-lg': '--shadow-lg',
    'shadow-xl': '--shadow-xl',
    'shadow-2xl': '--shadow-2xl',
    'sidebar': '--sidebar',
    'sidebar-foreground': '--sidebar-foreground',
    'scribbles-primary': '--scribbles-primary',
    'scribbles-foreground': '--scribbles-foreground',
  };

  for (const [key, value] of Object.entries(vars)) {
    const cssVar = cssVarMappings[key];
    if (cssVar) {
      root.style.setProperty(cssVar, value);
    }
  }
}

export function getThemeDisplayName(themeName) {
  return themeName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
