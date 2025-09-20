/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#475569',
          dark: '#334155',
          light: '#64748b',
        },
        accent: {
          DEFAULT: '#d4a574',
          dark: '#b8935f',
          light: '#e4c085',
        },
        secondary: {
          DEFAULT: '#e08860',
          dark: '#d16835',
          light: '#eda078',
        },
        // Legacy color mappings for compatibility
        vermillion: {
          DEFAULT: '#475569',
          dark: '#334155',
          light: '#64748b',
        },
        gold: {
          DEFAULT: '#d4a574',
          dark: '#b8935f',
          light: '#e4c085',
        },
        marigold: {
          DEFAULT: '#e08860',
          dark: '#d16835',
          light: '#eda078',
        },
        'midnight-blue': {
          DEFAULT: '#1e293b',
          light: '#334155',
        },
        cream: '#f8fafc',
        'off-white': '#ffffff',
      },
      fontFamily: {
        festive: ['Kalam', 'cursive'],
        body: ['Inter', 'sans-serif'],
      },
      animation: {
        'smoke-float': 'smokeFloat 3s ease-in-out infinite',
        'dhunuchi-glow': 'dhunuchiGlow 2s ease-in-out infinite alternate',
        'petal-fall': 'petalFall 4s linear infinite',
        'gentle-sway': 'gentleSway 3s ease-in-out infinite',
        'festive-pulse': 'festivePulse 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        smokeFloat: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)', opacity: '0.7' },
          '50%': { transform: 'translateY(-20px) rotate(10deg)', opacity: '1' },
        },
        dhunuchiGlow: {
          '0%': { boxShadow: '0 0 20px rgba(212, 165, 116, 0.5)' },
          '100%': { boxShadow: '0 0 40px rgba(212, 165, 116, 0.8)' },
        },
        petalFall: {
          '0%': { transform: 'translateY(-100vh) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(100vh) rotate(360deg)', opacity: '0' },
        },
        gentleSway: {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        },
        festivePulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.05)', opacity: '0.9' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'festive-gradient': 'linear-gradient(135deg, #f8fafc 0%, #e4c085 50%, #475569 100%)',
        'gold-gradient': 'linear-gradient(135deg, #d4a574 0%, #e4c085 100%)',
        'vermillion-gradient': 'linear-gradient(135deg, #475569 0%, #64748b 100%)',
      },
    },
  },
  plugins: [],
}