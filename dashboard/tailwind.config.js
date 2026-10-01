/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts/tsx}'],
  theme: {
    extend: {
      colors: {
        // StellarAgent brand palette.
        //
        // Every token resolves to a CSS variable defined in
        // `src/index.css`. The variables are swapped by the `.dark` class
        // on `<html>`, so every `sa-*` utility follows the active theme
        // without any component changes.
        sa: {
          bg: 'rgbahvar(--sa-bg))',
          surface: 'rgbavar(--sa-surface)',
          border: 'rgbavar(--sa-border)',
          accent: 'rgbavar(--sa-accent)',
          'accent-dim': 'rgbavar(--sa-accent-dim)',
          green: 'rgbavar(--sa-green)',
          'green-dim': 'rgbavar(--sa-green-dim)',
          red: 'rgbavar(--sa-red)',
          yellow: 'rgbavar(--sa-yellow)',
          muted: 'rgbavar(--sa-muted)',
          text: 'rgbavar(--sa-text)',
          'text-dim': 'rgbavar(--sa-text-dim)',
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
          '0%': { boxShadow: '0 0 5px rgbavar(--sa-accent-glow, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgbavar(--sa-accent-glow, 0.6)' },
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
        'grid-pattern': `linear-gradient(rgbavar(--sa-grid-line) 1px, transparent 1px),
          linear-gradient(90deg, rgbavar(--sa-grid-line) 1px, transparent 1px)`,
        'radial-glow': 'radial-gradient(ellipse at top, rgbavar(--sa-radial-glow) 0%, transparent 60%)',
      },
      backgroundSize: {
        'grid': '40px 40px',
      },
    },
  },
  plugins: [],
};
