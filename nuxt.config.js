const pkg = require("./package")

module.exports = {
	mode: "spa",
	head: {
		title: "Ara",
		meta: [
			{ charset: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
			{ hid: "description", name: "description", content: pkg.description }
		],
		link: [
			{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }
		]
	},
	loading: { color: "#fff" },
	css: [
	],
	plugins: [
	],
	modules: [
		"@nuxtjs/axios",
		"nuxt-buefy"
	],
	axios: {
		baseURL: "https://v1.araassistant.com"
	},
	build: {
		extend(config, ctx) {
			
		}
	}
}
