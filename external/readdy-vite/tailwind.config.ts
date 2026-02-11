
/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            50: '#FFF5F5',
            100: '#FFE8E8',
            200: '#FFCCD2',
            300: '#FFB3BC',
            400: '#FF8A9B',
            500: '#FF6B7A',
            600: '#E85A68',
            700: '#D14A57',
            800: '#B33A45',
            900: '#8C2D36',
          },
          warm: {
            50: '#FFFBF7',
            100: '#FFF4EB',
            200: '#FFE8D6',
            300: '#FFD9BD',
            400: '#FFC299',
            500: '#FFAB75',
          },
          accent: {
            coral: '#FF7F6E',
            peach: '#FFAB91',
            rose: '#F48FB1',
            lavender: '#CE93D8',
          }
        },
      },
    },
    plugins: [],
  }
