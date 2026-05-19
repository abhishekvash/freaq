import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2025-07-15",
	devtools: { enabled: true },
	modules: ["@nuxt/eslint", "nuxt-skill-hub"],
	css: ["~/assets/css/tailwind.css"],
	vite: {
		plugins: [tailwindcss()],
	},
	imports: {
		dirs: ["~/composables/**"],
	},
	skillHub: {
		targets: ["claude-code", "codex"],
		generationMode: "prepare",
		eslint: false,
	},
});
