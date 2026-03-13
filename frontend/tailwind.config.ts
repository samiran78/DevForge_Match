import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        violet: {
          950: '#0f0a1a',
          900: '#1a0f2e',
          800: '#2d1b4e',
          700: '#4c2a7a',
          600: '#6b3fa0',
          500: '#8b5cf6',
          400: '#a78bfa',
        },
        neon: {
          pink: '#ff2d6a',
          blue: '#00d4ff',
          purple: '#bf5af2',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-aura': 'linear-gradient(135deg, #1a0f2e 0%, #2d1b4e 50%, #0f0a1a 100%)',
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'aura-spin': 'aura-spin 8s linear infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 20px rgba(139, 92, 246, 0.5)' },
          '50%': { opacity: '0.8', boxShadow: '0 0 40px rgba(139, 92, 246, 0.8)' },
        },
        'aura-spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};

export default config;
