<template>
	<main>
		<div class="container">
			<div class="columns columns is-mobile is-centered">
				<div class="column is-half">
					<div class="card">
						<div class="card-content">
							<h1 class="title">Reset password</h1>
							<div class="content">
								<b-loading v-if="loading" :active.sync="loading"></b-loading>
								<form @submit.prevent="reset">
									<b-field label="New password">
										<b-input type="password" password-reveal required v-model="password" placeholder="Enter your password" />
									</b-field>
									<button type="submit" class="button is-primary">Reset your password &rarr;</button>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</main>
</template>

<script>
export default {
	data() {
		return {
			loading: false,
			password: "",
			done: true
		}
	},
	methods: {
		reset() {
			this.loading = true;
			this.$axios.put("/auth/reset", {
				password: this.password,
				token: this.$route.params.code
			}).then(() => {
				this.$snackbar.open("Your password has been changed 👍");
				setTimeout(() => {
					this.$router.push("/auth/login");
				}, 2500);
			}).catch(error => {
				if (error.response.data.error) this.$snackbar.open({ type: "is-danger", message: error.response.data.error });
			}).then(() => {
				this.password = "";
				this.loading = false;
			});
		}
	}
}
</script>
