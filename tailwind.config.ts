import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb',
          hover: '#1d4ed8',
          light: '#dbeafe',
          dark: '#1e40af',
        },
        neutral: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        state: {
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
        },
        accent: {
          purple: '#8b5cf6',
          pink: '#ec4899',
          orange: '#f97316',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
        serif: ['var(--font-merriweather)'],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '65ch',
            color: '#334155',
            a: {
              color: '#2563eb',
              '&:hover': {
                color: '#1d4ed8',
              },
            },
            h1: {
              color: '#0f172a',
            },
            h2: {
              color: '#1e293b',
            },
            h3: {
              color: '#334155',
            },
            strong: {
              color: '#1e293b',
            },
            code: {
              color: '#0f172a',
            },
            figcaption: {
              color: '#64748b',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
} 