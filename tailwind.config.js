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
        charcoal: '#111318',
        graphite: '#1C1E24',
        mist: '#DAD9D6',
        softwhite: '#F3F2EF',
        muted: '#898B92',
        lavender: {
          DEFAULT: '#C7B8FF',
          light: '#E2DAFF',
          dark: '#9B82FF',
          dim: 'rgba(199, 184, 255, 0.08)',
          glow: 'rgba(199, 184, 255, 0.25)',
        },
        surface: {
          50: '#121419',
          100: '#15181F',
          200: '#1C2029',
          300: '#252A36',
          border: 'rgba(255, 255, 255, 0.08)',
          'border-hover': 'rgba(199, 184, 255, 0.3)',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Space Grotesk', 'sans-serif'],
        sans: ['var(--font-sans)', 'Inter', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.04em',
        widestx: '0.25em',
      },
      backgroundImage: {
        'radial-gradient-hero': 'radial-gradient(circle at 50% 30%, rgba(199, 184, 255, 0.06) 0%, rgba(8, 9, 11, 0.95) 70%)',
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
