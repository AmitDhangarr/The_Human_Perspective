/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        cinzel_d: ["var(--font-cinzel_d)", "serif"],
        plus_j: ["var(--font-plus_j)", "sans-serif"],
        space_mono: ["var(--font-space_mono)", "monospace"],
      },
    },
  },
  plugins: [],
};