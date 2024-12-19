/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'rgba(147, 51, 234, 0.05)',
          100: 'rgba(147, 51, 234, 0.1)',
          200: 'rgba(147, 51, 234, 0.2)',
          300: 'rgba(147, 51, 234, 0.3)',
          400: 'rgba(147, 51, 234, 0.4)',
          500: 'rgba(147, 51, 234, 0.5)',
          600: 'rgba(147, 51, 234, 0.6)',
          700: 'rgba(147, 51, 234, 0.7)',
          800: 'rgba(147, 51, 234, 0.8)',
          900: 'rgba(147, 51, 234, 0.9)',
        },
        accent: {
          light: '#7dd3fc', // sky-300
          DEFAULT: '#38bdf8', // sky-400
          dark: '#0284c7', // sky-600
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(126, 34, 206, 0.05) 100%)',
        'gradient-accent': 'linear-gradient(135deg, rgba(56, 189, 248, 0.1) 0%, rgba(2, 132, 199, 0.05) 100%)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        fade: 'fade 0.5s ease-in-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        glow: {
          '0%, 100%': { opacity: 0.8 },
          '50%': { opacity: 1 },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },
        fade: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
}
