<template>
	<main>
		<h1 class="title">Templates</h1>
		<p class="subtitle" v-if="editing">Editing {{name}}</p>
		<p class="subtitle" v-else>Add a new template</p>
		<div class="card">
			<b-loading v-if="loading" :is-full-page="true" :active.sync="loading"></b-loading>
			<form @submit.prevent="update" class="card-content">
				<b-field label="Name">
					<b-input required v-model="name" placeholder="Enter a name for this template" />
				</b-field>
				<b-field label="Email subject">
					<b-input required v-model="subject" placeholder="Enter an email subject for this template" />
				</b-field>
				<b-field label="Labels">
					<b-taginput v-model="labels" icon="label" placeholder="Add another label" />
				</b-field>
				<b-field label="Email body">
					<b-input required type="textarea" v-model="body" placeholder="Enter the text for this template" />
				</b-field>
				<div v-if="editing">
					<button type="submit" class="button is-primary">Save changes to {{name || "template"}}</button>
					<button type="button" @click.prevent="deleteTemplate" class="button is-danger is-outlined"><b-icon style="margin-right: 0.25rem" pack="fas" icon="trash" />Delete</button>
				</div>
				<div v-else>
					<button type="submit" class="button is-primary">Add new template</button>
				</div>
			</form>
		</div>
	</main>
</template>

<script>
export default {
	data() {
		return {
			loading: false,
			editing: false,
			name: "",
			labels: [],
			subject: "",
			body: ""
		}
	},
	mounted() {
		if (this.$route.params.id !== "new") {
			this.editing = true;
			this.loading = true;
			this.$axios.get("/templates/" + this.$route.params.id).then(response => {
				this.loading = false;
				this.id = response.data.results[0].id;
				this.name = response.data.results[0].name;
				this.labels = response.data.results[0].labels;
				this.subject = response.data.results[0].subject;
				this.body = response.data.results[0].body;
			})
		}
	},
	methods: {
		addLabel() {
			alert('label');
		},
		update() {
			this.loading = true;
			this.$axios[this.editing ? "post" : "put"]("/templates", {
				id: this.id,
				name: this.name,
				labels: JSON.stringify(this.labels),
				subject: this.subject,
				body: this.body
			}).then(() =>
				this.$axios.get("/templates")
			).then(response => {
				this.data = response.data;
				this.$snackbar.open(this.editing ? "Your template has been updated 👍" : "Your new template has been added 👍");
				this.$router.push("/settings/templates");
			}).catch(error => {
				if (error.response.data.error) if (error.response.data.error) this.$snackbar.open({ type: "is-danger", message: error.response.data.error });
			}).then(() => {
				this.loading = false;
			});
		},
		deleteTemplate() {
			this.$dialog.confirm({
			title: "Deleting template",
			message: "Are you sure you want to <b>delete</b> this template? This action cannot be undone.",
			confirmText: "Delete template",
			type: "is-danger",
			hasIcon: true,
			onConfirm: () => {
				this.loading = true;
				this.$axios.delete("/templates", {
						data: {
							id: this.id
						}
					}).then(() =>
						this.$axios.get("/templates")
					).then(response => {
						this.$snackbar.open({
							type: "is-danger",
							message: "This template has been deleted 🗑"
						});
						this.data = response.data;
						this.$router.push("/settings/templates");
					}).catch(error => {
						if (error.response.data.error) this.$snackbar.open({ type: "is-danger", message: error.response.data.error });
					}).then(() => {
						this.loading = false;
					});
				}
			});
		}
	}
}
</script>
