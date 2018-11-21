<template>
	<main>
		<div class="container">
			<div class="columns columns is-mobile is-centered">
				<div class="column is-half-tablet">
					<div v-for="(item, index) in chat" :key="'c_' + index" :class="`message_${item.from}`">
						<div class="text">
							{{item.text}}
						</div>
						<img v-if="item.from === 'user'" alt="" :src="`https://platform.oswaldlabs.com/v1/profile-picture/anandchowdhary@gmail.com`">
					</div>
					<div class="message_ara" v-if="typing">
						<div class="text">&bullet; &bullet; &bullet;</div>
					</div>
				</div>
			</div>
		</div>
		<footer v-if="responses.length">
			<div class="container">
				<div class="columns columns is-mobile is-centered">
					<div class="column is-half-tablet">
						<h2 v-if="chat.length === 1" class="subtitle is-5 pulse">Click on a response to reply to Ara:</h2>
						<div class="message_user" :key="'r_' + index" v-for="(item, index) in responses">
							<form @submit.prevent="respond(newMessage, item.modal)" v-if="item && item.type">
								<div style="margin-bottom: 1rem; font-weight: bold">
									{{item.placeholder}}:
								</div>
								<b-field grouped>
									<b-select v-if="item.type === `select`" v-model="newMessage">
										<option v-for="(option, index) in item.options" :key="'o_' + index" :value="typeof index === 'string' ? (item.uc ? index.toUpperCase() : index) : (item.value ? option[item.value] : option)">
											{{item.value ? option[item.value] : option}}
										</option>
									</b-select>
									<b-input v-else v-model="newMessage"></b-input>
									<p class="control">
										<button class="button is-primary" type="submit">Reply</button>
									</p>
								</b-field>
							</form>
							<a :href="item.redirect_link" target="_blank" v-else-if="item.redirect_link" class="responds text">
								{{item.text || item}}
							</a>
							<button v-else @click.prevent="respond(item, item.modal)" class="responds text">
								{{item.text || item}}
							</button>
						</div>
					</div>
				</div>
			</div>
		</footer>
	</main>
</template>

<script>
import timezones from "compact-timezone-list";
import countries from "country-list";
import languages from "@/components/languages";
export default {
	data() {
		return {
			time: 500,
			typing: false,
			chat: [],
			newMessage: "",
			responses: [],
			current: 0
		}
	},
	computed: {
		user() {
			return this.$store.getters.user;
		}
	},
	mounted() {
		let greeting = "morning";
		if (new Date().getHours() >= 12) greeting = "afternoon";
		if (new Date().getHours() >= 17) greeting = "evening";
		this.say("Good " + greeting + ", " + this.user.informal_name + "!", ["Hi, Ara 👋"]);
	},
	methods: {
		say(text, responses = []) {
			this.newMessage = "";
			this.typing = true;
			if (typeof text === "string") {
				setTimeout(() => {
					this.chat.push({
						text,
						from: "ara"
					});
					this.typing = false;
					this.responses = responses;
					setTimeout(() => {
						window.scrollTo(0, document.body.scrollHeight);
					}, 5);
				}, this.time);
			} else {
				let i = 0;
				const chatInterval = setInterval(() => {
					if (i < text.length) {
						this.typing = true;
						this.chat.push({
							text: text[i],
							from: "ara"
						});
						setTimeout(() => {
							window.scrollTo(0, document.body.scrollHeight);
						}, 5);
						if (i === text.length - 1) this.typing = false;
						i++;
					} else {
						clearInterval(chatInterval);
						this.responses = responses;
						setTimeout(() => {
							window.scrollTo(0, document.body.scrollHeight);
						}, 5);
					}
				}, this.time);
			}
		},
		respond(input, modal) {
			let text = typeof input === "string" ? input : input.text;
			if (text !== input && input.case) {
				this.current = input.case;
			} else {
				this.current++;
			}
			if (input.redirect) {
				return this.$router.push(input.redirect);
			}
			if (modal) {
				this.user[modal] = input.value || text || this.user[modal];
				if (modal === "name") this.user.informal_name = (input.value || text).split(" ")[0] || this.user.informal_name;
				if (["duration", "calendars", "scheduling_days", "scheduling_start_time", "scheduling_end_time"].includes(modal)) {
					this.$axios.post("/scheduling", {
						duration: this.user.duration,
						calendars: JSON.stringify(this.user.calendars),
						scheduling_days: JSON.stringify(this.user.scheduling_days),
						scheduling_start_time: this.user.scheduling_start_time,
						scheduling_end_time: this.user.scheduling_end_time
					}).then(() =>
						this.$axios.get("/settings")
					).then(profile => {
						this.$store.commit("updateUser", profile.data.user);
					});
				} else if (["new_skype", "new_work_phone", "new_personal_cell"].includes(modal)) {
					if (this.user[modal] !== "Incomplete_details") {
						const placeDetails = {};
						if (modal === "new_skype") {
							placeDetails.name = "Skype";
							placeDetails.type = 4;
							placeDetails.value = this.user[modal];
							placeDetails.option = "skype";
							placeDetails.isDefault = true;
						} else if (modal === "new_work_phone") {
							placeDetails.name = "Work phone";
							placeDetails.type = 1;
							placeDetails.value = this.user[modal];
							placeDetails.option = "work_phone";
							placeDetails.isDefault = true;
						} else if (modal === "new_personal_cell") {
							placeDetails.name = "Personal cell";
							placeDetails.type = 1;
							placeDetails.value = this.user[modal];
							placeDetails.option = "cell_phone";
							placeDetails.isDefault = true;
						}
						this.$axios.put("/locations", placeDetails);
					} else {
						delete this.user[modal];
					}
				} else {
					this.$axios.post("/settings", {
						onboarded: "1",
						name: this.user.name,
						gender: this.user.gender,
						informal_name: this.user.informal_name,
						companyName: this.user.companyName,
						companyDomain: this.user.companyDomain,
						companyTitle: this.user.companyTitle,
						country: this.user.country,
						timezone: this.user.timezone,
						language: this.user.language
					}).then(() =>
						this.$axios.get("/settings")
					).then(profile => {
						this.$store.commit("updateUser", profile.data.user);
					});
				}
			}
			this.chat.push({
				text,
				from: "user"
			})
			this.typing = true;
			this.responses = [];
			this.think();
		},
		think() {
			switch (this.current) {
				case 1:
					this.say("How are you doing today?", ["Great, thanks!", "Alright, I guess"]);
					break;
				case 2:
					this.say("Good to know. Can I call you " + this.user.name + "?", [{
						text: "Yes, that's my name",
						case: 4
					}, {
						text: "No, change my name",
						case: 3
					}]);
					break;
				case 3:
					this.say(["Okay, what's your name?"], [{
						type: "input",
						placeholder: "Enter your full name",
						modal: "name"
					}]);
					break;
				case 4:
					if (this.user.tokens) {
						this.say(["Perfect, I'll call you " + this.user.informal_name], ["Sounds good!"]);
					} else {
						this.say(["Perfect, I'll call you " + this.user.informal_name], ["Sounds good!"]);
					}
					break;
				case 5:
					if (this.user.tokens) {
						this.say(["I see that you've already connected your Google Calendar, so let's continue!"], ["Yes, let's do it"]);
					} else {
						this.say(["You haven't connected your Google Calendar yet, so let's get that out of the way first", "Once you're done, come back here and we'll continue"], [{
							text: "Connect Google Calendar",
							redirect_link: "/settings/reconnect"
						}, "Done, let's continue!"]);
					}
					break;
				case 6:
					this.say(["Let's get started!", "When I write emails for you, I might have to say things like 'call his phone' or 'Skype with her'", "I know it's " + new Date().getFullYear() + " and it's silly to stick to binary genders, but I need the pronoun", "So, can you share your preferred gender with me?"], [
						{ modal: "gender", value: "1", text: "Male (his)" },
						{ modal: "gender", value: "2", text: "Female (her)" }
					]);
					break;
				case 7:
					this.say(["Awesome!", "In which country do you live?"], [{
						type: "select",
						placeholder: "Select your country",
						modal: "country",
						uc: true,
						options: countries().getCodeList()
					}]);
					break;
				case 8:
					this.say(["And what timezone are you in?", "I'll remember this when putting things on your calendar"], [{
						type: "select",
						placeholder: "Select your timezone",
						modal: "timezone",
						value: "tzCode",
						options: timezones
					}]);
					break;
				case 9:
					this.say(["Perfect", "What language should I remember you speak?"], [{
						type: "select",
						placeholder: "Select your language",
						modal: "language",
						options: languages
					}]);
					break;
				case 10:
					this.say(["Let's talk about setting up meetings now", "How long should your meetings be?", "Of course, you can also specify durations for individual meetings", "But by default, what do you prefer?"], [
						{ modal: "duration", text: "15 minutes", value: 15 },
						{ modal: "duration", text: "30 minutes", value: 30 },
						{ modal: "duration", text: "45 minutes", value: 45 },
						{ modal: "duration", text: "1 hour", value: 60 }
					]);
					break;
				case 11:
					this.say(["Lovely, I'll remember that", "What days do you work on?", "I won't disturb you on other days 😊"], [
						{ modal: "scheduling_days", text: "Monday to Thursday", value: ["mon", "tue", "wed", "thu"] },
						{ modal: "scheduling_days", text: "Monday to Friday", value: ["mon", "tue", "wed", "thu", "fri"] },
						{ modal: "scheduling_days", text: "Monday to Sunday", value: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] },
					]);
					break;
				case 12:
					this.say(["What time should I start scheduling in the morning?"], [
						{ modal: "scheduling_start_time", text: "8:30 am, I'm an early riser", value: "08:30" },
						{ modal: "scheduling_start_time", text: "9:00 am", value: "09:00" },
						{ modal: "scheduling_start_time", text: "9:30 am", value: "09:30" }
					]);
					break;
				case 13:
					this.say(["And what time should I stop scheduling in the evening?"], [
						{ modal: "scheduling_end_time", text: "4:30 pm", value: "16:30" },
						{ modal: "scheduling_end_time", text: "5:00 pm", value: "17:00" },
						{ modal: "scheduling_end_time", text: "5:30 pm", value: "17:30" }
					]);
					break;
				case 14:
					this.say(["That sounds good", "Thanks, " + this.user.informal_name + "!", "Now, I want to know how to reach you", "So when I set up a Skype call, for example, I can share you Skype info with the guests", "Sounds good?"], ["Yes, let's get started!"]);
					break;
				case 15:
					this.say(["Perfect", "What's your Skype username?"], [{
						type: "input",
						placeholder: "Enter your Skype username",
						modal: "new_skype"
					}, {
						text: "I don't have a Skype account",
						modal: "new_skype",
						value: "Incomplete_details"
					}]);
					break;
				case 16:
					this.say(["Okay", "What's your work phone number?"], [{
						type: "input",
						placeholder: "Enter your work phone number",
						modal: "new_work_phone"
					}, {
						text: "I don't have a work number",
						modal: "new_work_phone",
						value: "Incomplete_details"
					}]);
					break;
				case 17:
					this.say(["Okay", "And what about your personal cell phone?"], [{
						type: "input",
						placeholder: "Enter your personal phone number",
						modal: "new_personal_cell"
					}, {
						text: "I'd rather not share that",
						modal: "new_personal_cell",
						value: "Incomplete_details"
					}]);
					break;
				case 18:
					this.say(["Fantastic", "If you have an office location or preferred coffee meeting places, you can add that in 'Places and profiles' under 'Settings' later", "For now, we're good to go!", "Do you want to learn how to ask me to schedule meetings?"], [{
						text: "Yes, please!",
						case: 19
					}, {
						text: "No, thanks",
						case: 20
					}]);
					break;
				case 19:
					this.say(["So, I'm your personal assistant for work", "When you want to set up a meeting with someone, for example, I can do it for you", "My email is " + this.user.email_prefix + "@my.araassistant.com", "This is just for you, and you can CC me on anything", "So let's say you want to set up a meeting with Steve", "Just send Steve an email, like 'Hi Steve, looking forward to meeting with you'", "And CC me in the email, 'Ara, can you set up a Skype call with Steve?'", "And I'll get on it!", "I'll find the right time that works for both of you and send you both an invitation", "You can change my email (like add a custom domain) and customize my name, signature, etc., by going to 'Settings'"], ["Sounds good 🤩"]);
					break;
				case 20:
					this.say(["That's it for now!", "Thanks for talking to me", "Let's check out your settings now!"], [{
						text: "Let's go!",
						redirect: "/settings?startTour=true"
					}]);
					break;
			}
		}
	}
}
</script>

<style scoped>
main {
	margin-bottom: 10rem;
}
footer {
	background-color: #eee;
	position: fixed;
	z-index: 1;
	left: 0; right: 0;
	bottom: 0;
	padding: 2rem 0;
	text-align: right;
}
footer .text {
	background-color: #fff;
	box-shadow: 0 3px 7px rgba(0, 0, 0, 0.1);
	transition: 0.2s;
}
footer .text:hover {
	box-shadow: 0 3px 14px rgba(0, 0, 0, 0.15);
	transform: scale(1.05);
}
.text {
	background-color: #eee;
	padding: 0.5rem 1rem;
	border-radius: 1.5rem;
	display: inline-block;
	font: inherit;
	border: none;
	text-align: left;
	margin: 0.5rem 0;
}
.text + img {
	height: 1.5rem;
	width: 1.5rem;
	vertical-align: bottom;
	float: right;
	margin-top: 1.25rem;
	margin-left: 0.75rem;
	border-radius: 100%;
}
.message_ara .text {
	max-width: 80%;
	background-color: #3498db;
	color: #fff;
	border-bottom-left-radius: 0.5rem;
}
.message_user {
	display: flex;
	justify-content: flex-end;
}
.message_user .text {
	border-bottom-right-radius: 0.5rem;
}
footer .message_user {
	display: inline-block;
}
.responds {
	margin-left: 1rem;
}
@keyframes pulse {
	0% { transform: scale(1.05) }
	50% { transform: scale(1) }
	100% { transform: scale(1.05) }
}
.pulse {
	animation: pulse 3s ease-out;
	animation-iteration-count: infinite; 
	opacity: 1;
}
</style>
