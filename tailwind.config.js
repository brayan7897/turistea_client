/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
    colors: {
      colorp: 'var(--color-primary)',
      colorm:'var(--color-message)',
      coloru: 'var(--color-user)',
      colorb:'var(--color-blanco)',
      colors: 'var(--color-secondary)',
      colorwc: 'var(--color-widget-claro)',
      colorwo: 'var(--color-widget-oscuro)',
    },
  },
}

