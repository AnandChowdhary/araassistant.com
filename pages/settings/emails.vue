<template>
	<main>
		<h1 class="title">Profile</h1>
		<p class="subtitle">Your emails</p>
		<p>You can talk to Ara from any of the following verified emails, so it's suggested to add all your emails here. You can also log in to this website using any of these emails.</p>
		<section class="card" style="margin-top: 1.5rem">
			<b-table
				:data="data"
				:striped="true"
				:loading="loading"
				:mobile-cards="true">
				<template slot-scope="props">
					<b-table-column field="email" label="Email">
						<img class="website-logo" alt="Website logo" :src="`https://logo.clearbit.com/${props.row.email.split('@')[1]}`">
						{{ props.row.email }}
					</b-table-column>
					<b-table-column field="date" label="Added" centered>
						{{ new Date(props.row.created_at * 1000).toLocaleDateString() }}
					</b-table-column>
					<b-table-column label="Verified">
						<b-icon class="has-text-success" v-if="props.row.verified" pack="fas" icon="check" />
						<b-icon class="has-text-danger" v-else pack="fas" icon="times" />
					</b-table-column>
					<b-table-column label="Delete">
						<button type="button" @click.prevent="deleteEmail(props.row.id)" class="button is-danger is-outlined is-small">
							<b-icon style="margin-right: 0.25rem" pack="fas" icon="trash" />
							Delete
						</button>
					</b-table-column>
				</template>
				<template slot="empty">
					<section class="section" v-if="loading">
						<div class="content has-text-grey has-text-centered" style="min-height: 100px" />
					</section>
					<section class="section" v-else>
						<div class="content has-text-grey has-text-centered">
							<p>
								<b-icon class="ml" pack="fas" icon="frown-open" size="is-large" />
							</p>
							<p>You don't have any emails.</p>
						</div>
					</section>
				</template>
			</b-table>
		</section>
		<div class="card">
			<form @submit.prevent="add" class="card-content">
				<h3 class="title is-5">Have another email account?</h3>
				<p>You can add all your work and personal emails, and Ara will understand you if you email her from any of them. You can also log in to this website from any of these emails.</p>
				<b-field label="Email">
					<b-input required v-model="newEmail" placeholder="Enter your email" />
				</b-field>
				<button type="submit" class="button is-primary">Add another email</button>
			</form>
		</div>
	</main>
</template>

<script>
export default {
	data() {
		return {
			newEmail: "",
			data: [],
			loading: false
		}
	},
	mounted() {
		this.loading = true;
		this.$axios.get("/emails").then(list => {
			this.data = list.data.emails;
		}).catch(error => {
			if (error.response.data.error) this.$snackbar.open({ type: "is-danger", message: error.response.data.error });
		}).then(() => {
			this.loading = false;
		});
	},
	methods: {
		add() {
			this.$axios.put("/emails", {
				email: this.newEmail
			}).then(() =>
				this.$axios.get("/emails")
			).then(list => {
				this.data = list.data.emails;
				this.$snackbar.open("Your new email has been added 👍");
			}).catch(error => {
				if (error.response.data.error) this.$snackbar.open({ type: "is-danger", message: error.response.data.error });
			}).then(() => {
				this.loading = false;
				this.newEmail = "";
			});
		},
		deleteEmail(id) {
			this.$dialog.confirm({
			title: "Deleting email",
			message: "Are you sure you want to <b>delete</b> this email? This action cannot be undone.",
			confirmText: "Delete email",
			type: "is-danger",
			hasIcon: true,
			onConfirm: () => {
				this.$axios.delete("/emails", {
						data: {
							id
						}
					}).then(() =>
						this.$axios.get("/emails")
					).then(list => {
						this.$snackbar.open({
							type: "is-danger",
							message: "This email has been deleted 🗑"
						});
						this.data = list.data.emails;
					}).catch(error => {
						if (error.response.data.error) this.$snackbar.open({ type: "is-danger", message: error.response.data.error });
					}).then(() => {
						this.loading = false;
					});
				}
			})
		}
	}
}
</script>

<style scoped>
form p {
	margin-top: -1rem;
	margin-bottom: 1.5rem;
}
td {
	vertical-align: middle;
}
.website-logo {
	height: 25px;
	margin-right: 0.5rem;
	width: 25px;
	border-radius: 100%;
	vertical-align: middle;
}
</style>
