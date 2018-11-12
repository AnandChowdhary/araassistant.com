<template>
	<main>
		<h1 class="title">Places and profiles</h1>
		<p class="subtitle" v-if="editing">Editing {{name}}</p>
		<p class="subtitle" v-else>Add a new place</p>
		<div class="card">
			<b-loading v-if="loading" :is-full-page="true" :active.sync="loading"></b-loading>
			<form @submit.prevent="update" class="card-content">
				<b-field label="Name">
					<b-input required v-model="name" placeholder="Enter a name for this place or profile" />
				</b-field>
				<div class="columns">
					<div class="column">
						<b-field label="Type">
							<b-select v-model="type" @input="updateOptions" expanded>
								<option value="1">Phone number for voice calls</option>
								<option value="4">Web account for video calls</option>
								<option value="2">Web account for conferences</option>
								<option value="3">Location for in-person meetings</option>
							</b-select>
						</b-field>
					</div>
					<div class="column">
						<b-field label="Type">
							<b-select v-model="option" expanded>
								<option v-for="(item, index) in add_options[type]" :key="'o_' + index" :value="item.slug">{{item.title}}</option>
							</b-select>
						</b-field>
					</div>
				</div>
				<div v-if="type == 3">
					<div v-if="!this.addressString.formatted_address">
						<b-field label="Map location">
							<b-input @input="findLocation" required v-model="value" placeholder="Search for a place" />
						</b-field>
						<ul>
							<li style="margin-bottom: 1rem" v-for="(item, index) in locationRecommendations" :key="'l_' + index">
								{{item.description}}
								<button @click.prevent="selectLocation(item)" class="button is-primary is-small" style="margin-left: 0.5rem">Select this location</button>
							</li>
						</ul>
					</div>
					<p v-else style="margin: 1rem 0">
						<strong>Selected location:</strong> {{addressString.formatted_address || "None"}}
						<button style="margin-left: 0.5rem" type="button" @click.prevent="addressString = {}" class="button is-info is-outlined is-small">
							<b-icon style="margin-right: 0.25rem" pack="fas" icon="pencil-alt" />
							Edit location
						</button>
					</p>
				</div>
				<b-field v-else label="Value">
					<b-input required v-model="value" placeholder="Enter details" />
				</b-field>
				<b-field label="Instructions">
					<b-input type="textarea" v-model="instructions" placeholder="Add any additional instructions to share with guests here..." />
				</b-field>
				<!-- isDefault -->
				<div v-if="editing">
					<button type="submit" class="button is-primary">Save changes to {{name || "place"}}</button>
					<button type="button" @click.prevent="deletePlace" class="button is-danger is-outlined"><b-icon style="margin-right: 0.25rem" pack="fas" icon="trash" />Delete</button>
				</div>
				<div v-else>
					<button type="submit" class="button is-primary">Add new place or profile</button>
				</div>
			</form>
		</div>
	</main>
</template>



<script>
import debounce from "lodash/debounce";
export default {
	data() {
		return {
			editing: false,
			debounce: debounce,
			loading: false,
			id: undefined,
			addressString: {},
			instructions: "",
			locationRecommendations: [],
			name: "",
			option: 0,
			place: "",
			preference: "",
			type: 1,
			value: "",
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
		if (this.$route.params.id !== "new") {
			this.editing = true;
			this.loading = true;
			this.$axios.get("/locations/" + this.$route.params.id).then(response => {
				this.instructions = response.data[0].instructions;
				this.name = response.data[0].name;
				this.id = response.data[0].id;
				this.option = response.data[0].option;
				this.place = response.data[0].place;
				this.addressString = response.data[0].place;
				this.preference = response.data[0].preference;
				this.type = response.data[0].type.id;
				this.loading = false;
				if (this.place && this.place.formatted_address) {
					this.value = this.place.formatted_address;
				} else {
					this.value = response.data[0].value;
				}
			})
		} else {
			this.updateOptions();
		}
	},
	methods: {
		deletePlace() {
			this.loading = true;
			this.$dialog.confirm({
			title: "Deleting place or profile",
			message: "Are you sure you want to <b>delete</b> this place or profile? This action cannot be undone.",
			confirmText: "Delete place or profile",
			type: "is-danger",
			hasIcon: true,
			onConfirm: () => {
				this.$axios.delete("/locations", {
						data: {
							id: this.id
						}
					}).then(() =>
						this.$axios.get("/locations")
					).then(response => {
						this.$snackbar.open({
							type: "is-danger",
							message: "This place or profile has been deleted 🗑"
						});
						this.data = response.data;
						this.$router.push("/settings/places");
					}).catch(error => {
						if (error.response.data.error) alert(error.response.data.error);
					}).then(() => {
						this.loading = false;
					});
				}
			});
		},
		selectLocation(place) {
			this.loading = true;
			this.$axios.post("/places", {
				q: place.description
			}).then(response => {
				try {
					this.addressString = response.data.candidates[0];
				} catch (e) {}
			}).catch(error => {
				if (error.response.data.error) alert(error.response.data.error);
			}).then(this.loading = false);
		},
		realFindLocation() {
			this.$axios.post("/autocomplete", {
				q: this.value
			}).then(response => {
				this.locationRecommendations = response.data.predictions;
			}).catch(error => {
				if (error.response.data.error) alert(error.response.data.error);
			});
		},
		findLocation() {
			this.realFindLocation();
		},
		updateOptions() {
			this.option = this.add_options[this.type][0].slug;
		},
		getAddressData(address) {
			this.addressString = address;
			this.value = address.formatted_address;
		},
		update() {
			this.loading = true;
			this.$axios[this.editing ? "post" : "put"]("/locations", {
				id: this.id,
				name: this.name,
				type: this.type,
				place: JSON.stringify(this.addressString),
				value: this.value,
				option: this.option,
				instructions: this.instructions,
				isDefault: false,
			}).then(() =>
				this.$axios.get("/locations")
			).then(response => {
				this.data = response.data;
				this.$snackbar.open(this.editing ? "Your place or profile has been updated 👍" : "Your new place or profile has been added 👍");
				this.$router.push("/settings/places");
			}).catch(error => {
				if (error.response.data.error) if (error.response.data.error) alert(error.response.data.error);
			}).then(() => {
				this.loading = false;
				this.add = {
					type: 1,
					option: "cell_phone",
					value: ""
				};
			});
		}
	}
}
</script>