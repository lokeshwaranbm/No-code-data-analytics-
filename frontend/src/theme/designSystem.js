/**
 * Design System - No-Code Data Analyst
 * Modern, minimalistic design with bright and dark theme support
 */

export const designSystem = {
  // SPACING SYSTEM (8px grid)
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
    xxxl: '64px',
  },

  // BORDER RADIUS
  borderRadius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    round: '50%',
    pill: '9999px',
  },

  // SHADOWS
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    xxl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  },

  // TYPOGRAPHY
  typography: {
    fontFamily: {
      sans: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      mono: '"Fira Code", "Courier New", monospace',
    },
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem',// 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem',    // 48px
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },

  // TRANSITIONS
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    normal: '250ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '350ms cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // BREAKPOINTS
  breakpoints: {
    xs: '475px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
};

// BRIGHT THEME
export const brightTheme = {
  name: 'bright',
  
  colors: {
    // Primary Colors
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',  // Main primary
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },
    
    // Secondary Colors
    secondary: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',  // Main secondary
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
    
    // Accent Colors
    accent: {
      50: '#fdf4ff',
      100: '#fae8ff',
      200: '#f5d0fe',
      300: '#f0abfc',
      400: '#e879f9',
      500: '#d946ef',  // Main accent
      600: '#c026d3',
      700: '#a21caf',
      800: '#86198f',
      900: '#701a75',
    },
    
    // Success
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',  // Main success
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    },
    
    // Warning
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',  // Main warning
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
    },
    
    // Error
    error: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',  // Main error
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
    },
    
    // Info
    info: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',  // Main info
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
    },
    
    // Neutral/Grayscale
    neutral: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
    },
    
    // Semantic Colors
    background: '#ffffff',
    surface: '#f8fafc',
    card: '#ffffff',
    border: '#e2e8f0',
    divider: '#e5e7eb',
    
    // Text Colors
    text: {
      primary: '#0f172a',
      secondary: '#475569',
      disabled: '#94a3b8',
      inverse: '#ffffff',
    },
    
    // Chart Colors
    chart: {
      blue: '#3b82f6',
      purple: '#8b5cf6',
      pink: '#ec4899',
      orange: '#f97316',
      green: '#10b981',
      teal: '#14b8a6',
      cyan: '#06b6d4',
      indigo: '#6366f1',
    },
  },
  
  // Component-specific styles
  components: {
    button: {
      height: {
        sm: '32px',
        md: '40px',
        lg: '48px',
      },
      padding: {
        sm: '8px 16px',
        md: '12px 24px',
        lg: '16px 32px',
      },
    },
    input: {
      height: '40px',
      padding: '10px 16px',
      borderColor: '#e2e8f0',
      focusBorderColor: '#3b82f6',
      backgroundColor: '#ffffff',
    },
    card: {
      backgroundColor: '#ffffff',
      borderColor: '#e2e8f0',
      shadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      hoverShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    },
    navbar: {
      height: '64px',
      backgroundColor: '#ffffff',
      borderColor: '#e5e7eb',
      shadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    },
    sidebar: {
      width: '260px',
      backgroundColor: '#f8fafc',
      borderColor: '#e2e8f0',
    },
  },
};

// DARK THEME
export const darkTheme = {
  name: 'dark',
  
  colors: {
    // Primary Colors (slightly adjusted for dark mode)
    primary: {
      50: '#1e3a8a',
      100: '#1e40af',
      200: '#1d4ed8',
      300: '#2563eb',
      400: '#3b82f6',
      500: '#60a5fa',  // Main primary (lighter for dark bg)
      600: '#93c5fd',
      700: '#bfdbfe',
      800: '#dbeafe',
      900: '#eff6ff',
    },
    
    // Secondary Colors
    secondary: {
      50: '#0f172a',
      100: '#1e293b',
      200: '#334155',
      300: '#475569',
      400: '#64748b',
      500: '#94a3b8',  // Main secondary
      600: '#cbd5e1',
      700: '#e2e8f0',
      800: '#f1f5f9',
      900: '#f8fafc',
    },
    
    // Accent Colors
    accent: {
      50: '#701a75',
      100: '#86198f',
      200: '#a21caf',
      300: '#c026d3',
      400: '#d946ef',
      500: '#e879f9',  // Main accent
      600: '#f0abfc',
      700: '#f5d0fe',
      800: '#fae8ff',
      900: '#fdf4ff',
    },
    
    // Success
    success: {
      50: '#14532d',
      100: '#166534',
      200: '#15803d',
      300: '#16a34a',
      400: '#22c55e',
      500: '#4ade80',  // Main success
      600: '#86efac',
      700: '#bbf7d0',
      800: '#dcfce7',
      900: '#f0fdf4',
    },
    
    // Warning
    warning: {
      50: '#78350f',
      100: '#92400e',
      200: '#b45309',
      300: '#d97706',
      400: '#f59e0b',
      500: '#fbbf24',  // Main warning
      600: '#fcd34d',
      700: '#fde68a',
      800: '#fef3c7',
      900: '#fffbeb',
    },
    
    // Error
    error: {
      50: '#7f1d1d',
      100: '#991b1b',
      200: '#b91c1c',
      300: '#dc2626',
      400: '#ef4444',
      500: '#f87171',  // Main error
      600: '#fca5a5',
      700: '#fecaca',
      800: '#fee2e2',
      900: '#fef2f2',
    },
    
    // Info
    info: {
      50: '#0c4a6e',
      100: '#075985',
      200: '#0369a1',
      300: '#0284c7',
      400: '#0ea5e9',
      500: '#38bdf8',  // Main info
      600: '#7dd3fc',
      700: '#bae6fd',
      800: '#e0f2fe',
      900: '#f0f9ff',
    },
    
    // Neutral/Grayscale
    neutral: {
      50: '#171717',
      100: '#262626',
      200: '#404040',
      300: '#525252',
      400: '#737373',
      500: '#a3a3a3',
      600: '#d4d4d4',
      700: '#e5e5e5',
      800: '#f5f5f5',
      900: '#fafafa',
    },
    
    // Semantic Colors
    background: '#0a0a0a',
    surface: '#151515',
    card: '#1a1a1a',
    border: '#2a2a2a',
    divider: '#262626',
    
    // Text Colors
    text: {
      primary: '#f5f5f5',
      secondary: '#a3a3a3',
      disabled: '#525252',
      inverse: '#0a0a0a',
    },
    
    // Chart Colors (optimized for dark backgrounds)
    chart: {
      blue: '#60a5fa',
      purple: '#a78bfa',
      pink: '#f472b6',
      orange: '#fb923c',
      green: '#34d399',
      teal: '#2dd4bf',
      cyan: '#22d3ee',
      indigo: '#818cf8',
    },
  },
  
  // Component-specific styles
  components: {
    button: {
      height: {
        sm: '32px',
        md: '40px',
        lg: '48px',
      },
      padding: {
        sm: '8px 16px',
        md: '12px 24px',
        lg: '16px 32px',
      },
    },
    input: {
      height: '40px',
      padding: '10px 16px',
      borderColor: '#2a2a2a',
      focusBorderColor: '#60a5fa',
      backgroundColor: '#1a1a1a',
    },
    card: {
      backgroundColor: '#1a1a1a',
      borderColor: '#2a2a2a',
      shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
      hoverShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.4)',
    },
    navbar: {
      height: '64px',
      backgroundColor: '#1a1a1a',
      borderColor: '#2a2a2a',
      shadow: '0 1px 3px 0 rgba(0, 0, 0, 0.3)',
    },
    sidebar: {
      width: '260px',
      backgroundColor: '#151515',
      borderColor: '#2a2a2a',
    },
  },
};

export default { designSystem, brightTheme, darkTheme };
