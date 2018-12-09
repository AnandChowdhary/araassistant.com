<template>
	<main>
		<div class="container">
            <b-loading v-if="loading" :active.sync="loading" />
			<div class="columns columns is-mobile is-centered">
				<div class="column is-half">
					<div class="card">
						<div class="card-content">
							<h1 class="title">Set up a time with {{user.informal_name}}</h1>
							<div class="content">
                                <div class="columns">
                                    <div class="column">
                                        <b-datepicker icon="calendar-today" placeholder="Click to select..." :min-date="minDate" :max-date="maxDate" v-model="selectedDate" />
                                    </div>
                                    <div class="column">
                                        <b-select placeholder="Select duration" v-model="duration" expanded>
                                            <option value="15">15 minutes</option>
                                            <option value="30">30 minutes</option>
                                            <option value="45">45 minutes</option>
                                            <option value="60">1 hour</option>
                                        </b-select>
                                    </div>
                                </div>
                                <div v-if="!slots.length">
                                    <h2 class="title">No slots found</h2>
                                    <p>Sorry, no slots are available for {{new Date(this.selectedDate).toLocaleDateString()}}. You can try changing the date above.</p>
                                </div>
                                <button v-else v-for="(slot, key) in slots" :key="'slot_' + key" class="button is-medium is-fullwidth">{{new Date(slot).toLocaleString()}}</button>
                                <p style="margin-top: 1rem">If you have any questions, you can email {{user.informal_name}}'s assistant at {{user.assistant_email}}.</p>
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
    data() {
        const today = new Date();
        return {
            timezone: "Europe/Amsterdam",
            duration: 30,
            loading: false,
            slots: [],
            user: {},
            selectedDate: today,
            minDate: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
            maxDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 14)
        }
    },
    watch: {
        duration() {
            this.updateSlots();
        },
        timezone() {
            this.updateSlots();
        },
        selectedDate() {
            this.updateSlots();
        }
    },
    mounted() {
        this.loading = true;
        this.$axios.get(`/profile/${this.$route.params.id}`)
            .then(response => {
                this.user = response.data;
                this.updateSlots();
            });
    },
    methods: {
        updateSlots() {
            this.loading = true;
            this.$axios.get(`/schedule/${this.$route.params.id}/${this.selectedDate.getUTCFullYear()}/${this.selectedDate.getUTCMonth() + 1}/${this.selectedDate.getDate()}/${this.duration}`)
                .then(response => {
                    this.slots = response.data;
                    this.loading = false;
                });
        }
    }
}
</script>

<style scoped>
.card {
    overflow: visible;
}
.button.is-fullwidth {
    margin-bottom: 1rem;
}
</style>
