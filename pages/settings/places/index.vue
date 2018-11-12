<template>
	<main>
		<h1 class="title">Places and profiles</h1>
		<p class="subtitle">Where you like to have meetings</p>
		<p>Ara selects a place from here when you ask her to set up a meeting, so it's best to have all your contact information and preferred locations here. Ara will share these details with your guests, e.g., call {{user.informal_name}} at (your number).</p>
		<section class="card" style="margin-top: 1.5rem">
			<b-table
				:data="data"
				:striped="true"
				:loading="loading"
				:mobile-cards="true">
				<template slot-scope="props">
					<b-table-column field="name" label="Name">
						{{ props.row.name }}
					</b-table-column>
					<b-table-column field="option" label="Type">
						{{ props.row.option }}
					</b-table-column>
					<b-table-column field="value" label="Location">
						{{ props.row.place && props.row.place.address_components ? props.row.place.name || props.row.place.formatted_address : props.row.value }}
					</b-table-column>
					<b-table-column label="Details">
						<nuxt-link :to="`/settings/places/${props.row.id}`" class="button is-info is-outlined is-small">
							<b-icon style="margin-right: 0.25rem" pack="fas" icon="info-circle" />
							Edit
						</nuxt-link>
					</b-table-column>
					<b-table-column label="Delete">
						<button type="button" @click.prevent="deletePlace(props.row.id)" class="button is-danger is-outlined is-small">
							<b-icon style="margin-right: 0.25rem" pack="fas" icon="trash" />
							Delete
						</button>
					</b-table-column>
				</template>
				<template slot="empty">
					<section class="section">
						<div class="content has-text-grey has-text-centered">
							<p>
								<b-icon class="ml" pack="fas" icon="frown-open" size="is-large" />
							</p>
							<p>You don't have any places or profiles.</p>
						</div>
					</section>
				</template>
			</b-table>
		</section>
		<div class="card card-content">
			<h3 class="title is-5">Have another place or profile?</h3>
			<nuxt-link to="/settings/places/new" class="button is-primary">Add new place or profile</nuxt-link>
		</div>
	</main>
</template>

<script>
export default {
	data() {
		return {
			loading: false,
			googleLoaded: false,
			data: [],
			addressString: null,
			add: {
				name: "",
				place: "",
				instructions: "",
				isDefault: false,
				type: 1,
				option: "cell_phone",
				value: ""
			},
			add_options: {
				1: [
					{
						slug: "cell_phone",
						title: "Personal cell phone"
					},
					{
						slug: "work_phone",
						title: "Work phone"
					}
				],
				2: [
					{
						slug: "zoom",
						title: "Zoom link"
					},
					{
						slug: "appearin",
						title: "Appear.in link"
					},
					{
						slug: "hangouts",
						title: "Google Hangouts email"
					},
					{
						slug: "gotomeeting",
						title: "GoToMeeting link"
					},
					{
						slug: "joinme",
						title: "join.me link"
					},
					{
						slug: "webex",
						title: "WebEx link"
					},
					{
						slug: "webconference",
						title: "WebConference link"
					}
				],
				3: [
					{
						slug: "office",
						title: "Office"
					},
					{
						slug: "home",
						title: "Home"
					},
					{
						slug: "breakfast",
						title: "Breakfast"
					},
					{
						slug: "brunch",
						title: "Brunch"
					},
					{
						slug: "lunch",
						title: "Lunch"
					},
					{
						slug: "coffee",
						title: "Coffee"
					},
					{
						slug: "dinner",
						title: "Dinner"
					},
					{
						slug: "drinks",
						title: "Drinks"
					},
				],
				4: [
					{
						slug: "skype",
						title: "Skype username"
					},
					{
						slug: "messenger",
						title: "Facebook Messenger username"
					},
					{
						slug: "whatsapp",
						title: "WhatsApp number"
					},
					{
						slug: "duo",
						title: "Google Duo number"
					}
				]
			}
		}
	},
	computed: {
		user() {
			return this.$store.getters.user;
		}
	},
	mounted() {
		this.loading = true;
		this.$axios.get("/locations").then(response => {
			this.data = response.data;
		}).catch(error => {
			if (error.response.data.error) alert(error.response.data.error);
		}).then(this.loading = false);
	},
	methods: {
		updateOptions() {
			this.add.option = this.add_options[this.add.type][0].slug;
		},
		getAddressData(address) {
			this.addressString = JSON.stringify(address);
		},
		deletePlace(id) {
			this.$dialog.confirm({
			title: "Deleting place or profile",
			message: "Are you sure you want to <b>delete</b> this place or profile? This action cannot be undone.",
			confirmText: "Delete place or profile",
			type: "is-danger",
			hasIcon: true,
			onConfirm: () => {
				this.$axios.delete("/locations", {
						data: {
							id
						}
					}).then(() =>
						this.$axios.get("/locations")
					).then(response => {
						this.$snackbar.open({
							type: "is-danger",
							message: "This place or profile has been deleted 🗑"
						});
						this.data = response.data;
					}).catch(error => {
						if (error.response.data.error) alert(error.response.data.error);
					}).then(() => {
						this.loading = false;
					});
				}
			});
		}
	}
}
</script>
