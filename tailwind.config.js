/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      keyframes: {
        "move-bg": {
          "0%": { "background-position": "0 0" },
          "100%": { "background-position": "64px 64px" },
        },
      },
      animation: {
        "move-bg": "move-bg 3s linear infinite",
      },
    },
  },
  plugins: [],
}; 