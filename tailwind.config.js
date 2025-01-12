/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#007BFF',
          dark: '#0056b3',
          light: '#3395ff',
        },
        secondary: {
          DEFAULT: '#FF6B35',
          dark: '#e55a2a',
          light: '#ff8659',
        },
        success: {
          DEFAULT: '#28A745',
          dark: '#1e7e34',
          light: '#34ce57',
        },
        neutral: {
          DEFAULT: '#6C757D',
          dark: '#495057',
          light: '#adb5bd',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};