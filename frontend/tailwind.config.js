/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        myFont: ['MyFont', 'sans-serif'],
        geist_regular: ['geist-regular','sans-serif']
      }
  },
  plugins: [],
}
}
