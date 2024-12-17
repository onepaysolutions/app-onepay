/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,css}",
    "./pages/**/*.{js,jsx,ts,tsx,css}",
    "./components/**/*.{js,jsx,ts,tsx,css}",
  ],
  theme: {
    extend: {
      colors: {
        purple: {
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
        yellow: {
          light: 'rgba(250, 204, 21, 0.1)',
          dark: 'rgba(250, 204, 21, 1)',
        },
        indigo: {
          500: '#6366f1',
          600: '#4f46e5',
        },
        pink: {
          500: '#ec4899',
          600: '#db2777',
        },
        sky: {
          300: '#7dd3fc',
          400: '#38bdf8',
        },
      },
      animation: {
        'fade': 'fade 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-in-out',
        'glow': 'glow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fade: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        glow: {
          '0%, 100%': { opacity: '0.8' },
          '50%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-purple': 'linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(126, 34, 206, 0.05) 100%)',
        'gradient-yellow': 'linear-gradient(135deg, rgba(250, 204, 21, 0.1) 0%, rgba(234, 179, 8, 0.1) 100%)',
      },
      zIndex: {
        '45': '45',
        '55': '55',
      }
    },
  },
  plugins: []
}
