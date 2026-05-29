import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
				compatibilityDate: "2025-07-15",
				devtools: { enabled: true },
				modules: [
				 "@nuxt/eslint",
				 "@nuxt/fonts",
				 "nuxt-skill-hub",
				 "@nuxthub/core",
				],
				css: ["~/assets/css/tailwind.css"],
				fonts: {
								provider: "fontsource",
								families: [
												{
																name: "Bai Jamjuree",
																weights: [400, 500, 600, 700],
																styles: ["normal"],
																subsets: ["latin"],
																global: true,
												},
												{
																name: "JetBrains Mono",
																weights: [400, 500, 700, 800],
																styles: ["normal"],
																subsets: ["latin"],
																global: true,
												},
								],
				},
				vite: {
								plugins: [tailwindcss()],
								optimizeDeps: {
												include: ["gsap", "gsap/TextPlugin", "motion"],
								},
				},
				imports: {
								dirs: ["~/composables/**"],
				},
				skillHub: {
								targets: ["claude-code", "codex"],
								generationMode: "prepare",
								eslint: false,
				},
				experimental: {
								inlineRouteRules: true,
				},
});