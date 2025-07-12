/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {},
		colors: {
			colorp: "var(--color-primary)",
			colorm: "var(--color-message)",
			coloru: "var(--color-user)",
			colorb: "var(--color-blanco)",
			colors: "var(--color-secondary)",
			colorwc: "var(--color-widget-claro)",
			colorwo: "var(--color-widget-oscuro)",
			coloro1: "var(--color-oscuro-1)",
			coloro2: "var(--color-oscuro-2)",
			colorc1: "var(--color-claro-1)",
			colorc2: "var(--color-claro-2)",
		},
	},
	plugins: [require("tailwind-scrollbar")],
};
