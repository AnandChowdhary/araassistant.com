<template>
	<main>
		<b-loading :is-full-page="true" :active.sync="loading"></b-loading>
	</main>
</template>

<script>
export default {
	data() {
		return {
			loading: true
		}
	},
	mounted() {
		if (this.$route.query.code) {
			this.loading = true;
			this.$axios.post("/google", {
				code: this.$route.query.code
			}).then(() =>
				this.$axios.get("/settings")
			).then(profile => {
				this.$store.commit("updateUser", profile.data.user);
				this.$snackbar.open("Your Google Calendar has been linked 👍");
				setTimeout(this.$router.push("/"), 100);
			}).catch(error => {
				if (error.response.data.error) alert(error.response.data.error);
			}).then(() => this.loading = false);
		}
	}
}
</script>
