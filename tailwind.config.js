/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./app/**/*.{js,jsx,ts,tsx}",
      "./components/**/*.{js,jsx,ts,tsx}",
    ],
     theme: {
    extend: {
      fontFamily: {
        custom: ['Roboto', 'sans-serif'],
        'josefin-slab': ['Josefin Slab', 'serif'],
        'roboto-slab': ['Roboto Slab', 'serif'],
        montserrat: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
  };
  