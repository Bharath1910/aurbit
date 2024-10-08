/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["**/*.{html,js,ejs}"],
  theme: {
    extend: {
      colors: {
        'brand': '#FF4500',
        'accent': '#2A3236',
        'background': '#0E1113',
        'error': '#FF4F40'
      },
    },
  },
  plugins: [],
}

