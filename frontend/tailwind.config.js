/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './data/**/*.{js,jsx,ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#08090B',
        obsidian: '#08090B',
        charcoal: '#111216',
        graphite: '#18191E',
        mist: '#DAD9D6',
        softwhite: '#F5F3F0',
        coolgray: '#B1B1BA',
        muted: '#85858F',
        border: {
          DEFAULT: '#303138',
          subtle: '#303138',
          active: '#F46A45',
        },
        orange: {
          DEFAULT: '#F46A45',
          primary: '#F46A45',
          light: '#FF8662',
          hover: '#FF8662',
          burnt: '#E65A32',
          deep: '#9B3825',
          crimson: '#762316',
          glow: 'rgba(244, 106, 69, 0.25)',
          dim: 'rgba(244, 106, 69, 0.08)',
        },
        accent: {
          DEFAULT: '#F46A45',
          primary: '#F46A45',
          hover: '#FF8662',
          deep: '#9B3825',
          glow: 'rgba(244, 106, 69, 0.25)',
        },
        // Safeguard alias: maps any legacy lavender reference to cinematic orange
        lavender: {
          DEFAULT: '#F46A45',
          light: '#FF8662',
          dark: '#9B3825',
          dim: 'rgba(244, 106, 69, 0.08)',
          glow: 'rgba(244, 106, 69, 0.25)',
        },
        surface: {
          50: '#111216',
          100: '#18191E',
          200: '#222329',
          300: '#2D2E36',
          primary: '#18191E',
          elevated: '#222329',
          border: '#303138',
          'border-hover': 'rgba(244, 106, 69, 0.4)',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Space Grotesk', 'sans-serif'],
        monument: ['var(--font-monument)', 'Anton', 'Space Grotesk', 'sans-serif'],
        sans: ['var(--font-sans)', 'Inter', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.04em',
        widestx: '0.25em',
      },
      backgroundImage: {
        'radial-gradient-hero': 'radial-gradient(circle at 50% 30%, rgba(244, 106, 69, 0.08) 0%, rgba(8, 9, 11, 0.95) 70%)',
        'subtle-grid': 'radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        marquee: 'marquee 35s linear infinite',
      },
    },
  },
  plugins: [],
};
