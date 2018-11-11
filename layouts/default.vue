<template>
	<div>
		<nav class="navbar" role="navigation" aria-label="main navigation" style="margin-bottom: 2rem">
			<div class="navbar-brand">
				<router-link class="navbar-item" to="/">
					<img src="https://bulma.io/images/bulma-logo.png" width="112" height="28">
				</router-link>
				<a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
					<span aria-hidden="true"></span>
					<span aria-hidden="true"></span>
					<span aria-hidden="true"></span>
				</a>
			</div>
			<div id="navbarBasicExample" class="navbar-menu">
				<div class="navbar-start">
					<router-link to="/dashboard" class="navbar-item">
						Dashboard
					</router-link>
					<a class="navbar-item">
						Documentation
					</a>
				</div>
				<div class="navbar-end" v-if="user.id">
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
				<div class="navbar-end" v-else>
					<div class="navbar-item">
						<div class="buttons">
							<nuxt-link to="/auth/register" class="button is-primary">
								<strong>Sign up</strong>
							</nuxt-link>
							<nuxt-link to="/auth/login" class="button is-light">
								Log in
							</nuxt-link>
						</div>
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
	computed: {
		user() {
			return this.$store.getters.user;
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
