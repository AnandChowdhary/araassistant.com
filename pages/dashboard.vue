<template>
	<main>
		<div class="container">
			<h1 class="title" style="text-align: center">My meetings</h1>
			<b-loading v-if="loading" :is-full-page="false" :active.sync="loading"></b-loading>
			<div class="columns is-mobile is-centered">
				<div class="column is-three-quarters">
					<div class="card" v-for="(context, index) in contexts" :key="index" style="margin-bottom: 2rem">
						<div class="card-content">
							<div class="content">
								<div class="columns">
									<div class="column is-two-thirds">
										<div class="media">
											<div class="media-left">
												<figure class="image is-48x48">
													<img class="is-rounded" :src="`https://platform.oswaldlabs.com/v1/profile-picture/${context.guests[0].address.toLowerCase()}`">
												</figure>
											</div>
											<div class="media-content">
												<p class="title is-4">{{context.title}}</p>
												<p class="subtitle is-6">{{context.guests[0].address.toLowerCase()}}</p>
											</div>
										</div>
									</div>
									<div class="column" style="text-align: right">
										<div v-if="context.event_at">
											{{new Date(context.event_at * 1000).toLocaleString()}}
											<b-icon class="ml" pack="fas" icon="calendar" size="is-small" />
										</div>
										<div v-else>
											Scheduling
											<b-icon class="ml" pack="fas" icon="calendar" size="is-small" />
										</div>
										<div>
											{{context.location.name.split(",")[0]}}
											<b-icon v-if="context.location.option === 'skype'" class="ml" pack="fab" icon="skype" size="is-small" />
											<b-icon v-else-if="context.location.option === 'messenger'" class="ml" pack="fab" icon="facebook-messenger" size="is-small" />
											<b-icon v-else-if="context.location.option === 'whatsapp'" class="ml" pack="fab" icon="whatsapp" size="is-small" />
											<b-icon v-else-if="context.location.option === 'duo'" class="ml" pack="fas" icon="video" size="is-small" />
											<b-icon v-else-if="context.location.option === 'zoom'" class="ml" pack="fas" icon="video" size="is-small" />
											<b-icon v-else-if="context.location.option === 'appearin'" class="ml" pack="fas" icon="video" size="is-small" />
											<b-icon v-else-if="context.location.option === 'hangouts'" class="ml" pack="fas" icon="video" size="is-small" />
											<b-icon v-else-if="context.location.option === 'gotomeeting'" class="ml" pack="fas" icon="video" size="is-small" />
											<b-icon v-else-if="context.location.option === 'joinme'" class="ml" pack="fas" icon="video" size="is-small" />
											<b-icon v-else-if="context.location.option === 'webex'" class="ml" pack="fas" icon="video" size="is-small" />
											<b-icon v-else-if="context.location.option === 'webconference'" class="ml" pack="fas" icon="video" size="is-small" />
											<b-icon v-else-if="context.location.option === 'cell_phone'" class="ml" pack="fas" icon="phone" size="is-small" />
											<b-icon v-else-if="context.location.option === 'work_phone'" class="ml" pack="fas" icon="phone" size="is-small" />
											<b-icon v-else class="ml" pack="fas" icon="map-marker" size="is-small" />
										</div>
									</div>
								</div>
								<div style="text-align: center" v-if="context.status === 1 && context.potential_times.length">
									<h3 class="title is-5">Potential times</h3>
									<div class="columns">
										<div class="column" v-for="(item, index) in context.potential_times" :key="'t_' + index">
											{{new Date(item * 1000).toLocaleString()}}
										</div>
									</div>
								</div>
							</div>
						</div>
						<footer class="card-footer">
							<a href="#" class="card-footer-item">View details</a>
							<a href="#" class="card-footer-item">Edit meeting</a>
							<a href="#" class="card-footer-item">Send follow-up</a>
							<a href="#" class="card-footer-item">Cancel meeting</a>
						</footer>
					</div>
				</div>
			</div>
		</div>
	</main>
</template>

<script>
export default {
	data() {
		return {
			contexts: [],
			loading: true
		}
	},
	mounted() {
		if (!this.$store.state.token) return this.$router.replace("/auth/login");
		this.$axios.get("http://localhost:8080/contexts").then(data => {
			this.contexts = data.data.contexts;
		}).then(() => this.loading = false);
	},
	computed: {
		user() {
			return this.$store.getters.user;
		}
	}
}
</script>

<style scoped>
.ml {
	margin-left: 0.25rem;
}
</style>
