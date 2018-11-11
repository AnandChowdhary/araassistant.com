<template>
	<div>
		<nav class="navbar is-light" role="navigation" aria-label="main navigation" style="margin-bottom: 2rem">
			<div class="navbar-brand">
				<nuxt-link class="navbar-item" to="/">
					<strong>Ara</strong>
				</nuxt-link>
				<a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
					<span aria-hidden="true"></span>
					<span aria-hidden="true"></span>
					<span aria-hidden="true"></span>
				</a>
			</div>
			<div id="navbarBasicExample" class="navbar-menu" v-if="user.id">
				<div class="navbar-start">
					<nuxt-link to="/dashboard" class="navbar-item">Dashboard</nuxt-link>
					<nuxt-link to="/settings" class="navbar-item">Settings</nuxt-link>
					<nuxt-link to="/billing" class="navbar-item">Billing</nuxt-link>
					<nuxt-link to="/feedback" class="navbar-item">Feedback</nuxt-link>
				</div>
				<div class="navbar-end">
					<a class="navbar-item">
						<figure class="image" style="margin-right: 0.75rem">
							<img style="width: auto" class="is-rounded" alt="" :src="`https://platform.oswaldlabs.com/v1/profile-picture/${user.email}`">
						</figure>
						{{user.name}}
					</a>
					<div class="navbar-item">
						<div class="buttons">
							<button @click.prevent="logout" class="button is-light">Logout</button>
						</div>
					</div>
				</div>
			</div>
			<div id="navbarBasicExample" class="navbar-menu" v-else>
				<div class="navbar-start">
					<nuxt-link to="/dashboard" class="navbar-item">Features</nuxt-link>
					<nuxt-link to="/dashboard" class="navbar-item">Pricing</nuxt-link>
					<nuxt-link to="/dashboard" class="navbar-item">Privacy</nuxt-link>
					<nuxt-link to="/dashboard" class="navbar-item">FAQ</nuxt-link>
				</div>
				<div class="navbar-end">
					<div class="navbar-item buttons">
						<nuxt-link to="/auth/register" class="button is-primary">Register</nuxt-link>
						<nuxt-link to="/auth/login" class="button is-secondary">Login</nuxt-link>
					</div>
					
				</div>
			</div>
		</nav>
		<div>
			<nuxt />
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {}
	},
	mounted() {
		if (this.token) {
			this.$axios.setToken(this.token, "Bearer");
		}
	},
	computed: {
		user() {
			return this.$store.getters.user;
		},
		token() {
			return this.$store.getters.token;
		}
	},
	methods: {
		logout() {
			this.$store.commit("logout");
			this.$router.push("/auth/login");
		}
	}
}
</script>
