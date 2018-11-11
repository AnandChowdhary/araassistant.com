<template>
	<main>
		<div class="container">
			<div class="columns columns is-mobile is-centered">
				<div class="column is-half">
					<div class="card">
						<div class="card-content">
							<h1 class="title">Login</h1>
							<div class="content">
								<b-loading v-if="loading" :is-full-page="false" :active.sync="loading"></b-loading>
								<form @submit.prevent="login">
									<b-field label="Email">
										<b-input required v-model="email" placeholder="Enter your work email" />
									</b-field>
									<b-field label="Password">
										<b-input type="password" password-reveal required v-model="password" placeholder="Enter your password" />
									</b-field>
									<button type="submit" class="button is-primary">Login &rarr;</button>
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
			email: "",
			password: ""
		}
	},
	methods: {
		login() {
			this.loading = true;
			this.$axios.$post("http://localhost:8080/auth/login", {
				email: this.email,
				password: this.password
			}).then(data => {
				this.$store.commit("updateAuth", data.token);
				this.$router.push("/dashboard");
			}).catch(error => {
				alert(error.response.data.error);
			}).then(() => {
				this.loading = false;
			});
		}
	}
}
</script>