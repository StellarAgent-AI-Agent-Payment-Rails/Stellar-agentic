/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // StellarAgent brand palette – driven by CSS custom properties
        sa: {
          bg: 'rgb(var(--sa-bg) / <alpha-value>)',
          surface: 'rgb(var(--sa-surface) / <alpha-value>)',
          border: 'rgb(var(--sa-border) / <alpha-value>)',
          accent: 'rgb(var(--sa-accent) / <alpha-value>)',
          'accent-dim': 'rgb(var(--sa-accent-dim) / <alpha-value>)',
          green: 'rgb(var(--sa-green) / <alpha-value>)',
          'green-dim': 'rgb(var(--sa-green-dim) / <alpha-value>)',
          red: 'rgb(var(--sa-red) / <alpha-value>)',
          yellow: 'rgb(var(--sa-yellow) / <alpha-value>)',
          muted: 'rgb(var(--sa-muted) / <alpha-value>)',
          text: 'rgb(var(--sa-text) / <alpha-value>)',
          'text-dim': 'rgb(var(--sa-text-dim) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        display: ['"Space Grotesk"', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.4s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgb(var(--sa-accent) / 0.2)' },
          '100%': { boxShadow: '0 0 20px rgb(var(--sa-accent) / 0.6)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      backgroundImage: {
        'grid-pattern': `linear-gradient(rgb(var(--sa-accent) / 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgb(var(--sa-accent) / 0.03) 1px, transparent 1px)`,
        'radial-glow': 'radial-gradient(ellipse at top, rgb(var(--sa-accent) / 0.08) 0%, transparent 60%)',
      },
      backgroundSize: {
        'grid': '40px 40px',
      },
    },
  },
  plugins: [],
};
