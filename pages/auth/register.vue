<template>
	<main>
		<div class="container">
			<div class="columns columns is-mobile is-centered">
				<div class="column is-half">
					<div class="card">
						<div class="card-content">
							<h1 class="title">Register</h1>
							<div class="content">
								<b-loading v-if="loading" :active.sync="loading"></b-loading>
								<transition-group name="fade" mode="out-in">
									<form key="animation_1" @submit.prevent="enrichment" v-if="page === 0">
										<p>Ara is your AI-powered business communication assistant. To register for Ara, you need a valid invitation code. You can get this from another user with an Ara assistant, or you can <nuxt-link to="/auth/invite">request an invitation</nuxt-link>.</p>
										<b-field label="Invitation code">
											<b-input required v-model="inviteCode" placeholder="Enter your invitation code" />
										</b-field>
										<b-field label="Email">
											<b-input required v-model="email" placeholder="Enter your work email" />
										</b-field>
										<button type="submit" class="button is-primary">Next &rarr;</button>
									</form>
									<form key="animation_2" @submit.prevent="next" v-else-if="page === 1">
										<h2 class="subtitle is-4">Hi there, what should I call you?</h2>
										<b-field label="First Name">
											<b-input type="text" required v-model="firstName" placeholder="Enter your first name" />
										</b-field>
										<b-field label="Last Name">
											<b-input type="text" required v-model="lastName" placeholder="Enter your last name" />
										</b-field>
										<button type="submit" class="button is-primary">Next &rarr;</button>
									</form>
									<form key="animation_3" @submit.prevent="next" v-else-if="page === 2">
										<h2 class="subtitle is-4">Great! Where do you work, {{firstName}}?</h2>
										<b-field label="Title">
											<b-input type="text" v-model="companyTitle" placeholder="Enter your work position" />
										</b-field>
										<b-field label="Company">
											<b-input type="text" v-model="companyName" placeholder="Enter your company name" />
										</b-field>
										<b-field label="Website">
											<b-input type="text" v-model="companyDomain" placeholder="Enter your company website" />
										</b-field>
										<button type="submit" class="button is-primary">Next &rarr;</button>
									</form>
									<form key="animation_3" @submit.prevent="next" v-else-if="page === 3">
										<h2 class="subtitle is-4">Choose a strong password, {{firstName}}.</h2>
										<b-field label="Password">
											<b-input type="password" password-reveal v-model="password" placeholder="Enter a strong password" />
										</b-field>
										<b-field label="Repeat password">
											<b-input type="password" v-model="password_repeat" placeholder="Repeat the password" />
										</b-field>
										<button type="submit" class="button is-primary">Next &rarr;</button>
									</form>
									<form key="animation_4" @submit.prevent="register" v-else-if="page === 4">
										<h2 class="subtitle is-4">Let's get started, {{firstName}}!</h2>
										<p>By signing up, you agree with our <a href="#">Privacy Policy</a>, <a href="#">Cookie Policy</a>, and <a href="#">Terms of Use</a>.</p>
										<p>Since Ara is your personal assistant, you're giving us permission to:</p>
										<ul>
											<li>send emails on your behalf</li>
											<li>store information (such as name, email, etc.) of you and your contacts</li>
											<li>store a copy of any emails you or your contacts send to or receive from Ara</li>
										</ul>
										<p>If you ever change your mind, it's very easy to export and delete all your data from the settings page. We care about your privacy and never share your data with third-parties.</p>
										<button type="submit" class="button is-primary">Start using Ara &rarr;</button>
									</form>
									<div key="animation_5" v-else-if="page === 5">
										<h2 class="subtitle is-4">Verify your email</h2>
										<p>{{firstName}}, I've sent you an email on {{email}} with a link to verify the email. As soon as you've done that, you can log in to your account and I'll get you set up:</p>
										<nuxt-link class="button is-primary" to="/auth/login">Log in to your account</nuxt-link>
									</div>
								</transition-group>
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
			person: null,
			firstName: "",
			lastName: "",
			email: "",
			companyName: "",
			companyDomain: "",
			companyTitle: "",
			companyDomain: "",
			timezone: "",
			countryCode: "",
			page: 0,
			loading: false,
			password: "",
			password_repeat: ""
		}
	},
	methods: {
		enrichment() {
			this.loading = true;
			this.$axios.$post("/auth/enrichment", {
				email: this.email
			}).then(data => {
				this.loading = false;
				if (data.person && data.person.name) this.firstName = data.person.name.givenName || "";
				if (data.person && data.person.name) this.lastName = data.person.name.familyName || "";
				if (data.person && data.person.email) this.email = data.person.email || "";
				if (data.person && data.person.employment) this.companyName = data.person.employment.name || "";
				if (data.person && data.person.employment) this.companyDomain = data.person.employment.domain || "";
				if (data.person && data.person.employment) this.companyTitle = data.person.employment.title || "";
				if (data.person && data.person.employment) this.companyDomain = data.person.employment.domain || "";
				if (!this.companyDomain && data.company && data.company.domain) this.companyDomain = data.company.domain || "";
				if (!this.companyName && data.company && data.company.name) this.companyName = data.company.name || "";
				if (data.person && data.person.timeZone) this.timezone = data.person.timeZone || data.company.timeZone || "";
				if (data.person && data.person.geo) this.countryCode = data.person.geo.countryCode || data.company.geo.countryCode || "NL";
				if (data.ipInfo && data.ipInfo.country) this.countryCode = data.ipInfo.country || this.countryCode;
				this.next();
			});
		},
		register() {
			this.loading = true;
			this.$axios.$put("/auth/register", {
				email: this.email,
				name: this.firstName + " " + this.lastName,
				password: this.password,
				companyName: this.companyName,
				companyDomain: this.companyDomain,
				companyTitle: this.companyTitle,
				companyDomain: this.companyDomain,
				timezone: this.timezone,
				country: this.countryCode,
				onboarded: 0
			}).then(data => {
				this.next();
			}).catch(error => {
				if (error.response.data.error) this.$snackbar.open({ type: "is-danger", message: error.response.data.error });
				this.page = 0;
			}).then(() => {
				this.loading = false;
			});
		},
		next() {
			this.page++;
		},
		prev() {
			this.page--;
		}
	}
}
</script>

<style>
.loading-overlay, .loading-icon:after {
	z-index: 500;
}
.fade-enter-active, .fade-leave-active {
	transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to {
	opacity: 0;
}
</style>
