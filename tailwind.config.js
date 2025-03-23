/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'agri-green': 'rgb(var(--color-agri-green) / <alpha-value>)',
        'agri-green-light': 'rgb(var(--color-agri-green-light) / <alpha-value>)',
        'agri-green-dark': 'rgb(var(--color-agri-green-dark) / <alpha-value>)',
        'agri-yellow': 'rgb(var(--color-agri-yellow) / <alpha-value>)',
        'agri-yellow-light': 'rgb(var(--color-agri-yellow-light) / <alpha-value>)',
        'agri-gray': 'rgb(var(--color-agri-gray) / <alpha-value>)',
        'agri-gray-dark': 'rgb(var(--color-agri-gray-dark) / <alpha-value>)',
        'agri-blue': 'rgb(var(--color-agri-blue) / <alpha-value>)',
        'agri-blue-light': 'rgb(var(--color-agri-blue-light) / <alpha-value>)',
        'agri-orange': 'rgb(var(--color-agri-orange) / <alpha-value>)',
        'agri-red': 'rgb(var(--color-agri-red) / <alpha-value>)',
        'agri-purple': 'rgb(var(--color-agri-purple) / <alpha-value>)'
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'top': '0 -2px 10px rgba(0, 0, 0, 0.1)'
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem'
      },
      fontSize: {
        'xxs': '0.65rem'
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideIn: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
