<template>
	<main>
		<div class="container">
            <b-loading v-if="loading" :active.sync="loading" />
			<div class="columns columns is-desktop is-centered">
				<div class="column is-half">
					<div class="card">
						<div v-if="Object.keys(user).length" class="card-content">
							<h1 class="title">Set up a time with {{user.informal_name}}</h1>
                            <div v-if="chosenDate" class="content">
                                <form>
                                    <b-field label="Name">
										<b-input v-model="name" required placeholder="Enter your full name" />
									</b-field>
                                    <b-field label="Email">
										<b-input required placeholder="Enter your work email" />
									</b-field>
                                    <b-field label="Preferred meeting type">
										<b-select v-model="where" required placeholder="Select your preferred meeting type" expanded>
                                            <option value="video_call">Video call (e.g., Skype or Hangouts)</option>
                                            <option value="phone_call">Phone call</option>
                                            <option value="in_person">In-person meeting</option>
                                        </b-select>
									</b-field>
                                </form>
                                <div class="card card-content" style="margin-top: 1.5rem">
                                    <div><strong>Who: </strong>{{user.informal_name}} and {{name ? name.split(" ")[0] : "You"}}</div>
                                    <div><strong>When: </strong>{{new Date(chosenDate).toLocaleString()}}</div>
                                    <div>
                                        <strong>Where: </strong>
                                        <span class="has-text-grey" v-if="!where">Select preferred meeting type</span>
                                        <span v-else-if="where === 'video_call'">Video call</span>
                                        <span v-else-if="where === 'phone_call'">Phone call</span>
                                        <span v-else-if="where === 'in_person'">In-person meeting at {{user.informal_name}}'s selected location</span>
                                    </div>
                                    <div><strong>Duration: </strong>{{duration}} minutes</div>
                                </div>
                                <p style="margin-top: 1.5rem">If everything looks good, you can request a meeting and I will send you an invitation as soon as {{user.informal_name}} has confirmed.</p>
                                <button class="button is-primary">Request a meeting &rarr;</button>
                            </div>
							<div v-else class="content">
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
                                <div class="columns" style="margin-top: -1rem">
                                    <div class="column">
                                        <button @click.prevent="prevDay" v-bind:disabled="!allowBack" class="button is-fullwidth">&larr; Previous day</button>
                                    </div>
                                    <div class="column">
                                        <button @click.prevent="nextDay" v-bind:disabled="!allowForward" class="button is-fullwidth">Next day &rarr;</button>
                                    </div>
                                </div>
                                <div v-if="!slots.length && !loading">
                                    <h2 class="title">No slots found</h2>
                                    <p>Sorry, no slots are available for {{new Date(this.selectedDate).toLocaleDateString()}}. You can try changing the date above.</p>
                                </div>
                                <div v-else-if="loading">
                                    <h2 class="title">Looking for slots...</h2>
                                    <p>Checking {{user.informal_name}}'s calendar for available slots, just for you.</p>
                                </div>
                                <button @click.prevent="chooseDate(slot)" v-else v-for="(slot, key) in slots" :key="'slot_' + key" class="button is-medium is-fullwidth">{{new Date(slot).toLocaleString()}}</button>
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
            name: "",
            loading: false,
            slots: [],
            where: "",
            allowBack: false,
            allowForward: true,
            user: {},
            chosenDate: null,
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
            }).catch(error => {
                this.loading = false;
                if (error.response.data.error) this.$snackbar.open({ type: "is-danger", message: error.response.data.error });
            })
    },
    methods: {
        chooseDate(slot) {
            this.chosenDate = slot;
        },
        prevDay() {
            const yesterday = new Date(this.selectedDate);
            yesterday.setDate(yesterday.getDate() - 1);
            this.selectedDate = yesterday;
        },
        nextDay() {
            const tomorrow = new Date(this.selectedDate);
            tomorrow.setDate(tomorrow.getDate() + 1);
            this.selectedDate = tomorrow;
        },
        updateSlots() {
            this.loading = true;
            this.$axios.get(`/schedule/${this.user.id}/${this.selectedDate.getUTCFullYear()}/${this.selectedDate.getUTCMonth() + 1}/${this.selectedDate.getDate()}/${this.duration}`)
                .then(response => {
                    this.slots = response.data;
                    const today = new Date();
                    if (
                        this.minDate.getFullYear() === this.selectedDate.getFullYear() &&
                        this.minDate.getMonth() === this.selectedDate.getMonth() &&
                        this.minDate.getDate() === this.selectedDate.getDate()
                    ) {
                        this.allowBack = false;
                    } else {
                        this.allowBack = true;
                    }
                    if (
                        this.maxDate.getFullYear() === this.selectedDate.getFullYear() &&
                        this.maxDate.getMonth() === this.selectedDate.getMonth() &&
                        this.maxDate.getDate() === this.selectedDate.getDate()
                    ) {
                        this.allowForward = false;
                    } else {
                        this.allowForward = true;
                    }
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
