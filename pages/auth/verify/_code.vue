<template>
	<main>
		<b-loading v-if="!done" :is-full-page="true" :active.sync="loading"></b-loading>
		<div v-else class="content has-text-grey has-text-centered">
			<p>
				<b-icon class="ml" pack="fas" icon="envelope" size="is-large" />
			</p>
			<h1 class="title">Email confirmed</h1>
			<p>Your email has been successfully confirmed.</p>
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
		if (this.$route.params.code) {
			this.loading = true;
			this.$axios.post("/verify", {
				token: this.$route.params.code
			}).then(() => {
				this.$snackbar.open("Your email has been verified 👍");
				this.$router.push("/auth/login");
			}).catch(error => {
				if (error.response.data.error) this.$snackbar.open({ type: "is-danger", message: error.response.data.error });
			}).then(() => this.loading = false);
		}
	}
}
</script>
