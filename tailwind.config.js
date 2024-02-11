/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./client/*.{html,js}"],
  theme: {
    colors: {
      'cyan':{
        600: 'rgb(8 145 178)'
      },
      'indigo': {
        400: '#6366f1',
        600: '#4f46e5'
      }
    },
    extend: {},
  },
  plugins: [],
}

