/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{astro,html,js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        accent: "var(--color-accent)",
      },
    },
  },
  darkMode: 'class',
  plugins: [],
};