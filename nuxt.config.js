const pkg = require("./package")

module.exports = {
	mode: "spa",
	head: {
		title: "Ara",
		meta: [
			{ charset: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
			{ hid: "description", name: "description", content: pkg.description },
			{ name: "apple-mobile-web-app-title", content: "Ara" },
			{ name: "application-name", content: "Ara" },
			{ name: "msapplication-TileColor", content: "#2b5797" },
			{ name: "msapplication-TileImage", content: "/mstile-144x144.png" },
			{ name: "theme-color", content: "#3498db" }
		],
		link: [
			{ rel: "apple-touch-icon", type: "image/png", href: "/apple-touch-icon.png", sizes: "180x180" },
			{ rel: "icon", type: "image/png", href: "/favicon-32x32.png", sizes: "32x32" },
			{ rel: "icon", type: "image/png", href: "/android-chrome-192x192.png", sizes: "192x192" },
			{ rel: "icon", type: "image/png", href: "/favicon-16x16.png", sizes: "16x16" },
			{ rel: "manifest", type: "image/png", href: "/site.webmanifest" },
			{ rel: "mask-icon", type: "image/png", href: "/safari-pinned-tab.svg", color: "#3498db" }
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
		baseURL: true ? "http://localhost:8080" : "https://v1.araassistant.com"
	},
	build: {
		extend(config, ctx) {
			
		}
	}
}
