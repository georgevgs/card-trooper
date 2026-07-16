/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{ts,tsx,astro}',
  ],
  theme: {
    extend: {
      borderRadius: {
        xl: "calc(var(--radius) + 8px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 8px)",
      },
    },
  },
  plugins: [],
}
