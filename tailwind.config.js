/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'agri-green': '#2B7A0B',
        'agri-green-light': '#4CAF50',
        'agri-green-dark': '#1B5E20',
        'agri-yellow': '#FFDE00',
        'agri-yellow-light': '#FFF59D',
        'agri-gray': '#F5F5F5',
        'agri-gray-dark': '#E0E0E0',
        'agri-blue': '#1976D2',
        'agri-blue-light': '#64B5F6',
        'agri-orange': '#FF9800',
        'agri-red': '#F44336',
        'agri-purple': '#9C27B0'
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
      }
    },
  },
  plugins: [],
}
