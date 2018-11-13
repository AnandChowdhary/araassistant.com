<template>
	<main>
		<h1 class="title">Profile</h1>
		<p class="subtitle">General settings</p>
		<form @submit.prevent="update">
			<b-loading v-if="loading" :is-full-page="false" :active.sync="loading"></b-loading>
			<div class="card">
				<div class="card-content">
					<h3 class="title is-5">What should Ara call you?</h3>
					<b-field label="Name">
						<b-input required v-model="name" placeholder="Enter your full name" />
					</b-field>
					<b-field label="Informal name">
						<b-input required v-model="informal_name" placeholder="Enter your nickname" />
					</b-field>
				</div>
			</div>
			<div class="card">
				<div class="card-content">
					<h3 class="title is-5">How should Ara address you?</h3>
					<b-field label="Gender" message="Ara uses your gender for saying things like 'Call him' or 'Call her'. If you identify with a non-binary gender, choose the gender with the pronoun you are more comfortable with.">
						<b-select v-model="gender" placeholder="Select your gender" expanded>
							<option value="1">Male</option>
							<option value="2">Female</option>
						</b-select>
					</b-field>
				</div>
			</div>
			<div class="card">
				<div class="card-content">
					<h3 class="title is-5">Where are you based, {{informal_name}}?</h3>
					<b-field label="Country">
						<b-select placeholder="Select your country" expanded v-model="country">
							<option v-for="(item, index) in countries" :key="'c_' + index" :value="index.toUpperCase()">{{item}}</option>
						</b-select>
					</b-field>
					<b-field label="Timezone">
						<b-select placeholder="Select your timezone" expanded v-model="timezone">
							<option v-for="(item, index) in timezones" :key="'t_' + index">{{item.tzCode}}</option>
						</b-select>
					</b-field>
					<b-field label="Language">
						<b-select placeholder="Select your language" expanded v-model="language">
							<option v-for="(item, index) in languages" :key="'l_' + index" :value="index">{{item}}</option>
						</b-select>
					</b-field>
				</div>
			</div>
			<div class="card">
				<div class="card-content">
					<h3 class="title is-5">What do you do?</h3>
					<b-field label="Work position">
						<b-input v-model="companyTitle" placeholder="Enter your work position" />
					</b-field>
					<b-field label="Company">
						<b-input v-model="companyName" placeholder="Enter your name website" />
					</b-field>
					<b-field label="Website">
						<b-input v-model="companyDomain" placeholder="Enter your company website" />
					</b-field>
				</div>
			</div>
			<button style="margin-top: 1rem" type="submit" class="button is-primary is-medium">Update your profile</button>
		</form>
	</main>
</template>

<script>
import timezones from "compact-timezone-list";
import countries from "country-list";
import languages from "@/components/languages";
export default {
	data() {
		return {
			countries: countries().getCodeList(),
			timezones: timezones,
			languages: languages,
			loading: false,
			name: "",
			gender: "",
			informal_name: "",
			companyName: "",
			companyDomain: "",
			companyTitle: "",
			country: "",
			timezone: "",
			language: ""
		}
	},
	computed: {
		user() {
			return this.$store.getters.user;
		}
	},
	mounted() {
		this.name = this.user.name;
		this.gender = this.user.gender;
		this.informal_name = this.user.informal_name;
		this.companyName = this.user.company_name;
		this.companyDomain = this.user.company_website;
		this.companyTitle = this.user.company_title;
		this.country = this.user.country;
		this.timezone = this.user.timezone;
		this.language = this.user.language;
	},
	methods: {
		update() {
			this.loading = true;
			this.$axios.post("/settings", {
				name: this.name,
				gender: this.gender,
				informal_name: this.informal_name,
				companyName: this.companyName,
				companyDomain: this.companyDomain,
				companyTitle: this.companyTitle,
				country: this.country,
				timezone: this.timezone,
				language: this.language
			}).then(() =>
				this.$axios.get("/settings")
			).then(profile => {
				this.$snackbar.open("Your profile has been updated 👍");
				this.$store.commit("updateUser", profile.data.user);
			}).catch(error => {
				if (error.response.data.error) this.$snackbar.open({ type: "is-danger", message: error.response.data.error });
			}).then(() => this.loading = false);
		}
	}
}
</script>
