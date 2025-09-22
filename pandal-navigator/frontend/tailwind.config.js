/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Professional Durga Puja Color Palette
        primary: {
          50: '#fef2f2',   // Lightest red tint
          100: '#fde6e6',  // Very light red
          200: '#fbd5d5',  // Light red
          300: '#f8b4b4',  // Soft red
          400: '#f87171',  // Medium red
          500: '#dc2626',  // Classic red (main)
          600: '#b91c1c',  // Deep red
          700: '#991b1b',  // Darker red
          800: '#7f1d1d',  // Very dark red
          900: '#450a0a',  // Deepest red
          DEFAULT: '#dc2626',
        },
        secondary: {
          50: '#fffdf7',   // Lightest gold
          100: '#fffbeb',  // Very light gold
          200: '#fef3c7',  // Light gold
          300: '#fde68a',  // Soft gold
          400: '#fcd34d',  // Medium gold
          500: '#f59e0b',  // Classic gold (main)
          600: '#d97706',  // Deep gold
          700: '#b45309',  // Darker gold
          800: '#92400e',  // Very dark gold
          900: '#78350f',  // Deepest gold
          DEFAULT: '#f59e0b',
        },
        accent: {
          50: '#f0f9ff',   // Lightest blue
          100: '#e0f2fe',  // Very light blue
          200: '#bae6fd',  // Light blue
          300: '#7dd3fc',  // Soft blue
          400: '#38bdf8',  // Medium blue
          500: '#0ea5e9',  // Classic blue (main)
          600: '#0284c7',  // Deep blue
          700: '#0369a1',  // Darker blue
          800: '#075985',  // Very dark blue
          900: '#0c4a6e',  // Deepest blue
          DEFAULT: '#0ea5e9',
        },
        neutral: {
          50: '#fafafa',   // Pure white
          100: '#f5f5f5',  // Off white
          200: '#e5e5e5',  // Light gray
          300: '#d4d4d4',  // Soft gray
          400: '#a3a3a3',  // Medium gray
          500: '#737373',  // Gray
          600: '#525252',  // Dark gray
          700: '#404040',  // Darker gray
          800: '#262626',  // Very dark gray
          900: '#171717',  // Almost black
          DEFAULT: '#737373',
        },
        // Durga Puja specific colors with subtle variants
        vermillion: {
          50: '#fef2f2',
          100: '#fde6e6',
          200: '#fbd5d5',
          300: '#f8b4b4',
          400: '#f87171',
          500: '#ef4444',   // Softer vermillion
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          DEFAULT: '#ef4444',
        },
        gold: {
          50: '#fffdf7',
          100: '#fffbeb',
          200: '#fef3c7',
          300: '#fde68a',
          400: '#fcd34d',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          DEFAULT: '#f59e0b',
        },
        marigold: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',   // Warm orange
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          DEFAULT: '#f97316',
        },
        'royal-blue': {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',   // Royal blue
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          DEFAULT: '#3b82f6',
        },
        cream: {
          50: '#fefefe',
          100: '#fefefe',
          200: '#fefcf7',
          300: '#fcf9f0',
          400: '#f9f5e9',
          500: '#f6f1e2',   // Warm cream
          DEFAULT: '#f6f1e2',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        festive: ['Kalam', 'Comic Sans MS', 'cursive'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Playfair Display', 'Georgia', 'serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 25px -2px rgba(0, 0, 0, 0.1), 0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'large': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'festive': '0 10px 30px rgba(239, 68, 68, 0.2), 0 5px 15px rgba(245, 158, 11, 0.1)',
        'gold': '0 8px 25px rgba(245, 158, 11, 0.3)',
        'vermillion': '0 8px 25px rgba(239, 68, 68, 0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2.5s linear infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'bounce-gentle': 'bounceGentle 1s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(245, 158, 11, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(245, 158, 11, 0.6)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'festive-gradient': 'linear-gradient(135deg, #fef2f2 0%, #fde68a 25%, #fcd34d 75%, #ef4444 100%)',
        'gold-gradient': 'linear-gradient(135deg, #f59e0b 0%, #fcd34d 50%, #fde68a 100%)',
        'vermillion-gradient': 'linear-gradient(135deg, #ef4444 0%, #f87171 50%, #fbd5d5 100%)',
        'royal-gradient': 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 50%, #bfdbfe 100%)',
        'cream-gradient': 'linear-gradient(135deg, #fefefe 0%, #f6f1e2 100%)',
        'hero-gradient': 'linear-gradient(135deg, #fef2f2 0%, #f6f1e2 50%, #fde68a 100%)',
      },
    },
  },
  plugins: [],
}