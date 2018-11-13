<template>
	<main>
		<b-loading v-if="!done" :is-full-page="true" :active.sync="loading"></b-loading>
		<div v-else class="content has-text-grey has-text-centered">
			<p>
				<b-icon class="ml" pack="fab" icon="google" size="is-large" />
			</p>
			<h1 class="title">Calendar Connected</h1>
			<p>Your Google Calendar has been successfully connected.</p>
		</div>
	</main>
</template>

<script>
export default {
	data() {
		return {
			loading: false,
			done: true
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
			}).catch(error => {
				if (error.response.data.error) this.$snackbar.open({ type: "is-danger", message: error.response.data.error });
			}).then(() => this.loading = false);
		}
	}
}
</script>
