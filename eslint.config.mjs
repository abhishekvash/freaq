import withNuxt from "./.nuxt/eslint.config.mjs";
import prettierRecommended from "eslint-plugin-prettier/recommended";

export default withNuxt(
	{
		rules: {
			"vue/html-self-closing": [
				"warn",
				{
					html: {
						component: "always",
						normal: "always",
						void: "always",
					},
					math: "always",
					svg: "always",
				},
			],
		},
	},
	prettierRecommended
);
