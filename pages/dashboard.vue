<template>
	<div>{{user}}</div>
</template>

<script>
export default {
	mounted() {
		if (!this.$store.state.token) return this.$router.replace("/auth/login");
		this.$axios.get("http://localhost:8080/contexts").then(data => {
			console.log(data);
		})
	},
	computed: {
		user() {
			return this.$store.getters.user;
		}
	}
}
</script>
