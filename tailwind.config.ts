import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
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
          info: '#3b82f6',
        },
        accent: {
          blue: '#3b82f6',
          purple: '#8b5cf6',
          pink: '#ec4899',
        },
        portal: {
          background: '#0f172a',
          'background-alt': '#1e293b',
          text: '#f8fafc',
          'text-muted': '#94a3b8',
          border: '#334155',
          'border-hover': '#475569',
          link: '#60a5fa',
          'link-hover': '#93c5fd',
          highlight: '#6366f1',
          'highlight-hover': '#818cf8',
        },
        background: {
          light: '#0f172a',
          dark: '#020617',
        },
        text: {
          light: '#f8fafc',
          dark: '#e2e8f0',
        },
        card: {
          light: '#1e293b',
          dark: '#0f172a',
        },
        border: {
          light: '#334155',
          dark: '#1e293b',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
        heading: ['var(--font-poppins)'],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '65ch',
            color: '#f8fafc',
            a: {
              color: '#60a5fa',
              '&:hover': {
                color: '#93c5fd',
              },
            },
            h1: {
              color: '#f8fafc',
              fontWeight: '700',
            },
            h2: {
              color: '#f8fafc',
              fontWeight: '600',
            },
            h3: {
              color: '#f8fafc',
              fontWeight: '600',
            },
            h4: {
              color: '#f8fafc',
              fontWeight: '600',
            },
            strong: {
              color: '#f8fafc',
              fontWeight: '600',
            },
            code: {
              color: '#f8fafc',
              backgroundColor: '#1e293b',
              padding: '0.2em 0.4em',
              borderRadius: '0.25rem',
            },
            blockquote: {
              borderLeftColor: '#334155',
              color: '#94a3b8',
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

export default config; 