/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'brand-green': '#4CAF50',
        'brand-green-dark': '#388E3C',
        'brand-green-light': '#C8E6C9',
        'brand-brown': '#795548',
        'brand-gray': '#F5F5F5',
      },
    },
  },
  plugins: [],
}
