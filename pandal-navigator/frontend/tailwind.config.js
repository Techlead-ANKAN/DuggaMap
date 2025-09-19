/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vermillion: {
          DEFAULT: '#E34234',
          dark: '#C73E32',
          light: '#F56B5C',
        },
        gold: {
          DEFAULT: '#FFD700',
          dark: '#E6C200',
          light: '#FFF04D',
        },
        marigold: {
          DEFAULT: '#FFB84D',
          dark: '#E6A644',
          light: '#FFC566',
        },
        'midnight-blue': {
          DEFAULT: '#1A1A40',
          light: '#2A2A50',
        },
        cream: '#FFF8E7',
        'off-white': '#FAFAFA',
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
          '0%': { boxShadow: '0 0 20px rgba(255, 215, 0, 0.5)' },
          '100%': { boxShadow: '0 0 40px rgba(255, 215, 0, 0.8)' },
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
        'festive-gradient': 'linear-gradient(135deg, #FFF8E7 0%, #FFB84D 50%, #E34234 100%)',
        'gold-gradient': 'linear-gradient(135deg, #FFD700 0%, #FFF04D 100%)',
        'vermillion-gradient': 'linear-gradient(135deg, #E34234 0%, #F56B5C 100%)',
      },
    },
  },
  plugins: [],
}