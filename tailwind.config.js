/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ejs}", "./public/**/*.html"],
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

