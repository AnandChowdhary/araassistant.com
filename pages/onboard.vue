<template>
	<main>
		<div class="container">
			<div class="columns columns is-mobile is-centered">
				<div class="column is-half">
					<div v-for="(item, index) in chat" :key="'c_' + index" :class="`message_${item.from}`">
						<div class="text">
							{{item.text}}
						</div>
					</div>
					<div class="message_ara" v-if="typing">
						<div class="text">&bullet; &bullet; &bullet;</div>
					</div>
					<div style="margin-top: 5rem">
						<h2 v-if="chat.length === 1" class="subtitle is-5">Click on a response to reply to Ara:</h2>
						<div class="message_user">
								<button @click.prevent="respond(item)" v-for="(item, index) in responses" :key="'r_' + index" class="responds text">
								{{item.text || item}}
							</button>
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
		return {
			time: 500,
			typing: false,
			chat: [],
			lastResponse: "",
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
		if (new Date().getHours() > 12) greeting = "afternoon";
		if (new Date().getHours() > 17) greeting = "evening";
		this.say("Good " + greeting + ", " + this.user.informal_name + "!", ["Hi, Ara 👋"]);
	},
	methods: {
		say(text, responses = []) {
			this.typing = true;
			if (typeof text === "string") {
				setTimeout(() => {
					this.chat.push({
						text,
						from: "ara"
					});
					this.typing = false;
					setTimeout(() => {
						this.responses = responses;
					}, this.time / 2);
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
						i++;
					} else {
						clearInterval(chatInterval);
						this.typing = false;
						setTimeout(() => {
							this.responses = responses;
						}, this.time / 2);
					}
				}, this.time);
			}
		},
		respond(input) {
			let text = typeof input === "string" ? input : input.text;
			if (text !== input && input.case) {
				this.current = input.case;
			} else {
				this.current++;
			}
			this.lastResponse = text;
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
						case: 5
					}, {
						text: "No, change my name",
						case: 4
					}]);
					break;
				case 4:
					this.say(["Okay, what's your name?"], ["ENTER NAME"]);
					break;
				case 5:
					this.say(["Perfect", "I have your email saved as " + this.user.email, "Do you have another email?"], ["Yes, add another email", "No, that's it"]);
					break;
			}
		}
	}
}
</script>

<style>
.text {
	background-color: #eee;
	padding: 0.5rem 1rem;
	border-radius: 5rem;
	display: inline-block;
	font: inherit;
	border: none;
	text-align: left;
	margin: 0.5rem 0;
}
.message_ara .text {
	background-color: #3498db;
	color: #fff;
	border-bottom-left-radius: 1.5rem;
}
.message_user {
	display: flex;
	justify-content: flex-end;
}
.message_user .text {
	border-bottom-right-radius: 1.5rem;
}
.responds {
	margin-left: 1rem;
}
</style>
