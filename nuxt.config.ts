import tailwindcss from "@tailwindcss/vite";

type NuxtConfigProcess = {
	env: Record<string, string | undefined>;
	platform: string;
};

declare const process: NuxtConfigProcess;

const unixSocketPathLimit = 104;
const nuxtViteNodeSocketPathOverhead =
	"/nuxt-vite-node-XXXXXX/nuxt-vite-node-000000-0000000000000.sock".length;
const currentTempDir =
	process.env.TMPDIR ?? process.env.TMP ?? process.env.TEMP ?? "/tmp";

if (
	process.platform !== "win32" &&
	currentTempDir.length + nuxtViteNodeSocketPathOverhead >=
		unixSocketPathLimit
) {
	// Nuxt dev uses a Unix socket for Vite Node; macOS rejects paths over 104 bytes.
	process.env.TMPDIR = "/tmp";
	process.env.TMP = "/tmp";
	process.env.TEMP = "/tmp";
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2025-07-15",
	devtools: { enabled: true },
	modules: ["@nuxt/eslint", "@nuxt/fonts", "nuxt-skill-hub", "@nuxthub/core"],
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
