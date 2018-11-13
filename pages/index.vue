<template>
	<main>
		<b-loading v-if="!done" :is-full-page="true" :active.sync="loading"></b-loading>
	</main>
</template>

<script>
export default {
	computed: {
		user() {
			return this.$store.getters.user;
		}
	},
	mounted() {
		if (this.user.id) {
			this.$router.push("/dashboard");
		} else {
			this.$router.push("/auth/login");
		}
	},
}
</script>
