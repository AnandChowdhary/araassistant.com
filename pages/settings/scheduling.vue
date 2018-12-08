<template>
	<main>
		<h1 class="title">Scheduling</h1>
		<p class="subtitle">Meeting and timing preferences</p>
		<form @submit.prevent="update">
			<b-loading v-if="loading" :active.sync="loading"></b-loading>
			<div class="card">
				<div class="card-content">
					<h3 class="title is-5">How long should your meetings be?</h3>
					<b-field label="Meeting duration">
						<b-input type="number" min="0" required v-model="duration" placeholder="Enter default meeting duration in minutes" />
					</b-field>
					<p>Your meetings will last {{duration}} minutes unless you specify a duration to Ara.</p>
				</div>
			</div>
			<div class="card">
				<div class="card-content">
					<h3 class="title is-5">When do you want Ara to schedule meetings?</h3>
					<section style="margin-bottom: 1rem">
						<div class="field">
							<b-checkbox v-model="Monday">Monday</b-checkbox>
						</div>
						<div class="field">
							<b-checkbox v-model="Tuesday">Tuesday</b-checkbox>
						</div>
						<div class="field">
							<b-checkbox v-model="Wednesday">Wednesday</b-checkbox>
						</div>
						<div class="field">
							<b-checkbox v-model="Thursday">Thursday</b-checkbox>
						</div>
						<div class="field">
							<b-checkbox v-model="Friday">Friday</b-checkbox>
						</div>
						<div class="field">
							<b-checkbox v-model="Saturday">Saturday</b-checkbox>
						</div>
						<div class="field">
							<b-checkbox v-model="Sunday">Sunday</b-checkbox>
						</div>
					</section>
					<b-field label="Start time">
						<b-input type="time" required v-model="scheduling_start_time" placeholder="Enter morning start time" />
					</b-field>
					<b-field label="End time">
						<b-input type="time" required v-model="scheduling_end_time" placeholder="Enter evening end time" />
					</b-field>
				</div>
			</div>
			<div class="card">
				<div class="card-content">
					<h3 class="title is-5">Which calendars should Ara check for conflicts?</h3>
					<section v-if="calendars && calendars.length">
						<div class="field" v-for="(item, index) in calendars" :key="'c_' + index">
							<b-checkbox @input="value => {
								updateCalendars(index, value);
							}" v-bind:value="item.use">{{item.summary}}</b-checkbox>
						</div>
					</section>
					<div v-else class="content has-text-grey has-text-centered">
						<p>
							<b-icon class="ml" pack="fas" icon="frown-open" size="is-large" />
						</p>
						<p>You don't have any calendars.</p>
					</div>
					<button style="margin-top: 1rem" @click.prevent="reconnect" class="button is-secondary">
						<b-icon class="ml" pack="fab" icon="google" style="margin-right: 0.5rem" />
						<span v-if="calendars && calendars.length">Reconnect Google Calendar</span><span v-else>Reconnect Google Calendar</span>
					</button>
				</div>
			</div>
			<button style="margin-top: 1rem" type="submit" class="button is-primary is-medium">Update your preferences</button>
		</form>
	</main>
</template>

<script>
export default {
	data() {
		return {
			duration: "",
			calendars: [],
			scheduling_days: "",
			scheduling_start_time: "",
			scheduling_end_time: "",
			loading: false,
			Monday: false,
			Tuesday: false,
			Wednesday: false,
			Thursday: false,
			Friday: false,
			Saturday: false,
			Sunday: false
		}
	},
	computed: {
		user() {
			return this.$store.getters.user;
		}
	},
	watch: {
		Monday() {
			this.updateDays();
		},
		Tuesday() {
			this.updateDays();
		},
		Wednesday() {
			this.updateDays();
		},
		Thursday() {
			this.updateDays();
		},
		Friday() {
			this.updateDays();
		},
		Saturday() {
			this.updateDays();
		},
		Sunday() {
			this.updateDays();
		}
	},
	mounted() {
		this.duration = this.user.duration;
		this.calendars = this.user.calendars || [];
		try {
			this.calendars = JSON.parse(this.user.calendars);
		} catch (e) {}
		this.scheduling_days = this.user.scheduling_days;
		this.scheduling_start_time = this.user.scheduling_start_time;
		this.scheduling_end_time = this.user.scheduling_end_time;
		if (this.scheduling_days.includes("mon")) this.Monday = true;
		if (this.scheduling_days.includes("tue")) this.Tuesday = true;
		if (this.scheduling_days.includes("wed")) this.Wednesday = true;
		if (this.scheduling_days.includes("thu")) this.Thursday = true;
		if (this.scheduling_days.includes("fri")) this.Friday = true;
		if (this.scheduling_days.includes("sat")) this.Saturday = true;
		if (this.scheduling_days.includes("sun")) this.Sunday = true;
	},
	methods: {
		reconnect() {
			this.loading = true;
			this.$axios.get(`/google?to=${encodeURIComponent(location.protocol)}%2F%2F${encodeURIComponent(location.host)}%2Fauth%2Fgoogle`).then(response => {
				this.loading = false;
				if (response.data.url) {
					location.href = response.data.url;
				}
			});
		},
		updateCalendars(index, value) {
			this.calendars[index].use = value;
		},
		updateDays() {
			const days = [];
			if (this.Monday) days.push("mon");
			if (this.Tuesday) days.push("tue");
			if (this.Wednesday) days.push("wed");
			if (this.Thursday) days.push("thu");
			if (this.Friday) days.push("fri");
			if (this.Saturday) days.push("sat");
			if (this.Sunday) days.push("sun");
			this.scheduling_days = days;
		},
		update() {
			this.loading = true;
			this.$axios.post("/scheduling", {
				duration: this.duration,
				calendars: JSON.stringify(this.calendars),
				scheduling_days: JSON.stringify(this.scheduling_days),
				scheduling_start_time: this.scheduling_start_time,
				scheduling_end_time: this.scheduling_end_time,
			}).then(() =>
				this.$axios.get("/settings")
			).then(profile => {
				this.$snackbar.open("Your preferences have been updated 👍");
				this.$store.commit("updateUser", profile.data.user);
			}).catch(error => {
				if (error.response.data.error) this.$snackbar.open({ type: "is-danger", message: error.response.data.error });
			}).then(() => this.loading = false);
		},
	}
}
</script>
