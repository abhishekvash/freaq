/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
export default {
	plugins: ["prettier-plugin-tailwindcss"],
	semi: true,
	singleQuote: false,
	tailwindStylesheet: "./app/assets/css/tailwind.css",
	trailingComma: "es5",
	useTabs: true,
	tabWidth: 4,
};
