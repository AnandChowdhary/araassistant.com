<template>
	<div>{{user}}</div>
</template>

<script>
export default {
	mounted() {
		if (!this.$store.state.token) this.$router.replace("/auth/login");
	},
	computed: {
		user() {
			return this.$store.getters.user;
		}
	}
}
</script>
