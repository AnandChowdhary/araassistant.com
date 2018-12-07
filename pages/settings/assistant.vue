<template>
	<main>
		<h1 class="title">Assistant</h1>
		<p class="subtitle">Your assistant's settings</p>
		<form @submit.prevent="update">
			<b-loading v-if="loading" :active.sync="loading"></b-loading>
			<div class="card">
				<div class="card-content">
					<h3 class="title is-5">How should Ara address her emails?</h3>
					<b-field label="Name">
						<b-input required v-model="assistant_name" placeholder="Enter a name for your assistant" />
					</b-field>
					<b-field label="Signature" message="Formatting in Markdown; you can use basic Ara variables like fullName in double curly brackets">
						<b-input type="textarea" required v-model="assistant_signature" placeholder="Enter a name for your assistant" />
					</b-field>
				</div>
			</div>
			<div class="card">
				<div class="card-content">
					<h3 class="title is-5">What email address should Ara use?</h3>
					<b-field label="Default email">
						<b-input v-model="default_email" disabled />
					</b-field>
					<p style="margin-bottom: 2rem">Ara uses this default email unless you use a custom SMTP email. If you set up custom SMTP, make sure you add an email forwarded to the email above.</p>
					<b-field>
						<b-switch true-value="1" false-value="0" v-model="smtp_enabled">
							Use a custom email account
							<b-tag style="margin-left: 0.5rem" class="is-danger">Free in beta</b-tag>
						</b-switch>
					</b-field>
					<b-field label="Email provider">
						<b-select :disabled="smtp_enabled != 1" v-model="smtp_type" expanded>
							<option value="Outlook365">Outlook365</option>
							<option value="Gmail">Gmail or G Suite</option>
							<option value="Yahoo">Yahoo! Mail</option>
							<option value="Zoho">Zoho Mail</option>
							<option value="Yandex">Yandex</option>
							<option value="1und1">1&amp;1 Deutschland</option>
							<option value="AOL">AOL</option>
							<option value="Hotmail">Hotmail</option>
							<option value="iCloud">iCloud</option>
							<option value="smtp">Custom SMTP</option>
						</b-select>
					</b-field>
					<b-field v-if="smtp_type === 'smtp'" label="SMTP host">
						<b-input :disabled="smtp_enabled != 1" v-model="smtp_host" />
					</b-field>
					<b-field v-if="smtp_type === 'smtp'" label="SMTP port">
						<b-input :disabled="smtp_enabled != 1" v-model="smtp_port" />
					</b-field>
					<b-field label="Username">
						<b-input :disabled="smtp_enabled != 1" v-model="smtp_username" />
					</b-field>
					<b-field label="Password">
						<b-input :disabled="smtp_enabled != 1" type="password" v-model="smtp_password" password-reveal />
					</b-field>
					<button type="button" class="button is-secondary" @click.prevent="smtpTest" v-if="smtp_enabled == 1">Test SMTP configuration</button>
				</div>
			</div>
			<button style="margin-top: 1rem" type="submit" class="button is-primary is-medium">Update settings</button>
		</form>
	</main>
</template>

<script>
export default {
	data() {
		return {
			loading: false,
			default_email: "",
			assistant_name: "",
			assistant_signature: "",
			smtp_enabled: false,
			smtp_type: "",
			smtp_host: "",
			smtp_port: "",
			smtp_username: "",
			smtp_password: ""
		}
	},
	computed: {
		user() {
			return this.$store.getters.user;
		}
	},
	mounted() {
		this.default_email = this.user.email_prefix + "@my.araassistant.com";
		this.assistant_name = this.user.assistant_name;
		this.assistant_signature = this.user.assistant_signature;
		this.smtp_enabled = this.user.smtp_enabled;
		this.smtp_type = this.user.smtp_type;
		this.smtp_host = this.user.smtp_host;
		this.smtp_port = this.user.smtp_port;
		this.smtp_username = this.user.smtp_username;
		this.smtp_password = this.user.smtp_password;
	},
	methods: {
		smtpTest() {
			this.loading = true;
			this.$axios.post("/smtp", {
				smtp_type: this.smtp_type,
				smtp_host: this.smtp_host,
				smtp_port: this.smtp_port,
				smtp_username: this.smtp_username,
				smtp_password: this.smtp_password,
			}).then(response => {
				if (response.data.status) {
					this.$snackbar.open("SMTP works perfectly 👍");
				} else {
					this.$snackbar.open({
						type: "is-danger",
						message: "Error! SMTP doesn't work 🚫"
					});
				}
				this.loading = false;
			});
		},
		update() {
			this.loading = true;
			this.$axios.post("/assistant", {
				assistant_name: this.assistant_name,
				assistant_signature: this.assistant_signature,
				smtp_enabled: this.smtp_enabled,
				smtp_type: this.smtp_type,
				smtp_host: this.smtp_host,
				smtp_port: this.smtp_port,
				smtp_username: this.smtp_username,
				smtp_password: this.smtp_password,
			}).then(() =>
				this.$axios.get("/settings")
			).then(profile => {
				this.$snackbar.open("Assistant preferences have been updated 👍");
				this.$store.commit("updateUser", profile.data.user);
			}).catch(error => {
				if (error.response.data.error) this.$snackbar.open({ type: "is-danger", message: error.response.data.error });
			}).then(() => this.loading = false);
		}
	}
}
</script>
