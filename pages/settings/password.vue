<template>
	<main>
		<h1 class="title">Profile</h1>
		<p class="subtitle">Password &amp; security</p>
		<form @submit.prevent="update">
			<b-loading v-if="loading" :active.sync="loading"></b-loading>
			<div class="card">
				<div class="card-content">
					<h3 class="title is-5">Change your password</h3>
					<b-field label="Current password">
						<b-input type="password" required v-model="password" placeholder="Enter your current password" />
					</b-field>
                    <b-field label="New password">
						<b-input type="password" required v-model="new_password" placeholder="Enter a new password" />
					</b-field>
				</div>
			</div>
			<button style="margin-top: 1rem" type="submit" class="button is-primary is-medium">Change your password</button>
		</form>
	</main>
</template>

<script>
export default {
	data() {
		return {
            password: "",
            new_password: "",
            loading: false
		}
	},
	computed: {
		user() {
			return this.$store.getters.user;
		}
	},
	mounted() {
		this.name = this.user.name;
	},
	methods: {
		update() {
			this.loading = true;
			this.$axios.patch("/password", {
				password: this.password,
				new_password: this.new_password
			}).then(() =>
				this.$axios.get("/settings")
			).then(profile => {
                this.password = "";
                this.new_password = "";
				this.$snackbar.open("Your password has been changed 👍");
				this.$store.commit("updateUser", profile.data.user);
			}).catch(error => {
				if (error.response.data.error) this.$snackbar.open({ type: "is-danger", message: error.response.data.error });
			}).then(() => this.loading = false);
		}
	}
}
</script>
