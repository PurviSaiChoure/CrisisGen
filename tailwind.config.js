/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#007BFF',
        warning: '#FF6B35',
        success: '#28A745',
        neutral: '#6C757D',
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};