<template>
	<main>
		<div class="container">
			<div class="columns columns is-mobile is-centered">
				<div class="column is-half">
					<div class="card">
						<div class="card-content">
							<h1 class="title">Forgot Password</h1>
							<div class="content">
								<b-loading v-if="loading" :active.sync="loading"></b-loading>
								<form @submit.prevent="forgot">
									<b-field label="Email">
										<b-input required v-model="email" placeholder="Enter your work email" />
									</b-field>
									<button type="submit" class="button is-primary">Reset password &rarr;</button>
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
	data: () => {
		return {
			loading: false,
			email: ""
		}
	},
	methods: {
		forgot() {
			this.loading = true;
			this.$axios.$post("/auth/reset", {
				email: this.email
			}).then(data => {
				console.log(data);
			})
			.catch(error => {
				if (error.response.data.error) this.$snackbar.open({ type: "is-danger", message: error.response.data.error });
			}).then(() => {
				this.email = "";
				this.loading = false;
			});
		}
	}
}
</script>