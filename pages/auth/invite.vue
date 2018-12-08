<template>
	<main>
		<div class="container">
			<div class="columns columns is-mobile is-centered">
				<div class="column is-half">
					<div class="card">
						<div class="card-content">
							<h1 class="title">Request an invite</h1>
							<div class="content">
								<form method="POST" action="https://formspree.io/hi@araassistant.com">
									<b-field label="Name">
										<b-input name="name" required v-model="name" placeholder="Enter your full name" />
									</b-field>
									<b-field label="Email">
										<b-input name="_replyto" required v-model="email" placeholder="Enter your work email" />
									</b-field>
									<input type="hidden" name="ip" v-model="ipInfo.ip">
									<input type="hidden" name="city" v-model="ipInfo.city">
									<input type="hidden" name="region" v-model="ipInfo.region">
									<input type="hidden" name="country" v-model="ipInfo.country">
									<input type="hidden" name="postal" v-model="ipInfo.postal">
									<button type="submit" class="button is-primary">Request an invite &rarr;</button>
								</form>
							</div>
						</div>
					</div>
					<p style="margin-top: 1rem">Already got an invite? <nuxt-link to="/auth/register">Register</nuxt-link></p>
				</div>
			</div>
		</div>
	</main>
</template>

<script>
export default {
	data: () => {
		return {
			email: "",
			name: "",
			ipInfo: {}
		}
	},
	computed: {
		user() {
			return this.$store.getters.user;
		}
	},
	mounted() {
		if (this.user.id) {
			if (this.user.onboarded) {
				this.$router.push("/dashboard");
			} else {
				this.$router.push("/onboard");
			}
		}
		this.$axios.get("https://ipinfo.io/?token=8a036c8feb3737")
			.then(ip => this.ipInfo = ip.data)
			.catch(error => {});
	}
}
</script>