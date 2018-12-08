<template>
	<main>
		<h1 class="title is-size-1">Ara is an AI-powered business communication assistant.</h1>
		<nuxt-link class="button is-primary is-large" to="/auth/invite">Request an invite &rarr;</nuxt-link>
	</main>
</template>

<script>
export default {
	data() {
		return {
		}
	},
	computed: {
		user() {
			return this.$store.getters.user;
		}
	},
	mounted() {
		if (this.user.id) {
			this.$router.push("/dashboard");
		}
	},
}
</script>

<style scoped>
main {
	text-align: center;
	margin: auto;
	margin-top: 30vh;
	max-width: 720px;
}
h1 {
	margin-bottom: 3rem !important;
}
</style>

