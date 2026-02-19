/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FDF8F3',
        milk: '#FFFFFF',
        wheat: '#F5E6D3',
        earth: '#8B7355',
        charcoal: '#2C2420',
        leaf: '#4A7C59',
        'leaf-light': '#E8F5E9',
        sun: '#F4A261',
        'sun-light': '#FEF3E2',
        clay: '#E76F51',
        'clay-light': '#FCE8E4',
        sky: '#87CEEB',
        'sky-light': '#E0F2FE',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
