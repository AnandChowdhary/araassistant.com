<template>
	<main>
		<div class="has-text-right" style="margin-bottom: 1rem">
			<button type="button" @click="tour" class="button is-primary">Need a tour?</button>
			<v-tour name="myTour" :steps="steps" />
		</div>
		<div class="columns">
			<div class="column is-3">
				<nuxt-link id="v-step-0" to="/settings/profile" class="button is-white is-medium is-fullwidth">
					<div>
						<b-icon class="ml" pack="fas" icon="user" size="is-small" />
						<div>Profile</div>
					</div>
				</nuxt-link>
			</div>
			<div class="column is-3">
				<nuxt-link id="v-step-1" to="/settings/emails" class="button is-white is-medium is-fullwidth">
					<div>
						<b-icon class="ml" pack="fas" icon="envelope" size="is-small" />
						<div>Emails</div>
					</div>
				</nuxt-link>
			</div>
			<div class="column is-3">
				<nuxt-link id="v-step-2" to="/settings/scheduling" class="button is-white is-medium is-fullwidth">
					<div>
						<b-icon class="ml" pack="fas" icon="calendar" size="is-small" />
						<div>Scheduling</div>
					</div>
				</nuxt-link>
			</div>
			<div class="column is-3">
				<nuxt-link id="v-step-3" to="/settings/assistant" class="button is-white is-medium is-fullwidth">
					<div>
						<b-icon class="ml" pack="fas" icon="hands-helping" size="is-small" />
						<div>Assistant</div>
					</div>
				</nuxt-link>
			</div>
		</div>
		<div class="columns">
			<div class="column is-3">
				<nuxt-link id="v-step-4" to="/settings/places" class="button is-white is-medium is-fullwidth">
					<div>
						<b-icon class="ml" pack="fas" icon="map-marked-alt" size="is-small" />
						<div>Places</div>
					</div>
				</nuxt-link>
			</div>
			<div class="column is-3">
				<nuxt-link id="v-step-5" to="/settings/templates" class="button is-white is-medium is-fullwidth">
					<div>
						<b-icon class="ml" pack="fas" icon="file-contract" size="is-small" />
						<div>Templates</div>
					</div>
				</nuxt-link>
			</div>
			<div class="column is-3">
				<nuxt-link id="v-step-6" to="/settings/scheduling" class="button is-white is-medium is-fullwidth">
					<div>
						<b-icon class="ml" pack="fas" icon="money-bill-wave" size="is-small" />
						<div>Billing</div>
					</div>
				</nuxt-link>
			</div>
			<div class="column is-3">
				<nuxt-link id="v-step-7" to="/feedback" class="button is-white is-medium is-fullwidth">
					<div>
						<b-icon class="ml" pack="fas" icon="comments" size="is-small" />
						<div>Feedback</div>
					</div>
				</nuxt-link>
			</div>
		</div>
		<div class="columns">
			<div class="column is-3">
				<nuxt-link id="v-step-8" to="/help" class="button is-white is-medium is-fullwidth">
					<div>
						<b-icon class="ml" pack="fas" icon="question-circle" size="is-small" />
						<div>Help &amp; Docs</div>
					</div>
				</nuxt-link>
			</div>
		</div>
	</main>
</template>

<script>
import Vue from "vue";
import VueTour from "vue-tour";
import("vue-tour/dist/vue-tour.css");
Vue.use(VueTour);
export default {
	data() {
		return {
			steps: [
				{
					target: "#v-step-0",
					content: "This is your profile. Here, you can manage your basic info (like name and gender) and location details (like country, timezone, and language)."
				},
				{
					target: "#v-step-1",
					content: "In emails, you can add or remove all emails that you own. You can CC Ara from and log in with any of these emails."
				},
				{
					target: "#v-step-2",
					content: "You can set up your scheduling preferences here. These include days and times you want to work and what calendars Ara should use."
				},
				{
					target: "#v-step-3",
					content: "Make Ara your own by giving her a name, custom domain email, and signature under Assistant preferences."
				},
				{
					target: "#v-step-4",
					content: "Set up your go-to meeting locations, usernames for services like Skype, and phone numbers, so Ara can automatically share them with your guests."
				},
				{
					target: "#v-step-5",
					content: "Templates help Ara automatically respond to your usual requests. Set up custom templates for things you often need to send people."
				},
				{
					target: "#v-step-6",
					content: "Look at your billing details like subscription, monthly costs, and invoices under billing."
				},
				{
					target: "#v-step-7",
					content: "Like Ara? Dislike something? Tell us! For every message of feedback you give us, you get 1 free week of Ara Pro!"
				},
				{
					target: "#v-step-8",
					content: "If you need help with something or want to build actions for Ara, read more in our documentation"
				}
			]
		}
	},
	mounted() {
		if (this.$route.query.startTour) this.tour();
	},
	methods: {
		tour() {
			this.$tours["myTour"].start();
		}
	}
}
</script>


<style scoped>
.button.is-fullwidth {
	text-align: center;
	padding: 5rem 0;
}
.button.is-fullwidth .icon {
	margin: 0 0 0.5rem 0 !important;
	display: block;
	font-size: 2rem;
	text-align: center;
	width: 100%;
}
</style>
