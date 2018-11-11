<template>
	<main>
		<div class="columns">
			<div class="column is-3">
				<nuxt-link to="/settings/profile" class="button is-light is-medium is-fullwidth">
					<div>
						<b-icon class="ml" pack="fas" icon="user" size="is-small" />
						<div>Profile</div>
					</div>
				</nuxt-link>
			</div>
			<div class="column is-3">
				<nuxt-link to="/settings/emails" class="button is-light is-medium is-fullwidth">
					<div>
						<b-icon class="ml" pack="fas" icon="envelope" size="is-small" />
						<div>Emails</div>
					</div>
				</nuxt-link>
			</div>
			<div class="column is-3">
				<nuxt-link to="/settings/scheduling" class="button is-light is-medium is-fullwidth">
					<div>
						<b-icon class="ml" pack="fas" icon="calendar" size="is-small" />
						<div>Scheduling</div>
					</div>
				</nuxt-link>
			</div>
			<div class="column is-3">
				<nuxt-link to="/settings/assistant" class="button is-light is-medium is-fullwidth">
					<div>
						<b-icon class="ml" pack="fas" icon="hands-helping" size="is-small" />
						<div>Assistant</div>
					</div>
				</nuxt-link>
			</div>
		</div>
		<div class="columns">
			<div class="column is-3">
				<nuxt-link to="/settings/places" class="button is-light is-medium is-fullwidth">
					<div>
						<b-icon class="ml" pack="fas" icon="map-marked-alt" size="is-small" />
						<div>Places</div>
					</div>
				</nuxt-link>
			</div>
			<div class="column is-3">
				<nuxt-link to="/settings/templates" class="button is-light is-medium is-fullwidth">
					<div>
						<b-icon class="ml" pack="fas" icon="file-contract" size="is-small" />
						<div>Templates</div>
					</div>
				</nuxt-link>
			</div>
			<div class="column is-3">
				<nuxt-link to="/settings/scheduling" class="button is-light is-medium is-fullwidth">
					<div>
						<b-icon class="ml" pack="fas" icon="money-bill-wave" size="is-small" />
						<div>Billing</div>
					</div>
				</nuxt-link>
			</div>
			<div class="column is-3">
				<nuxt-link to="/settings/assistant" class="button is-light is-medium is-fullwidth">
					<div>
						<b-icon class="ml" pack="fas" icon="receipt" size="is-small" />
						<div>Invoices</div>
					</div>
				</nuxt-link>
			</div>
		</div>
	</main>
</template>

<style scoped>
.button {
	text-align: center;
	padding: 5rem 0;
}
.button .icon {
	margin: 0 0 0.5rem 0 !important;
	display: block;
	font-size: 2rem;
	text-align: center;
	width: 100%;
}
</style>
