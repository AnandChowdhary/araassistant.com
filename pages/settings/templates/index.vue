<template>
	<main>
		<h1 class="title">Places and profiles</h1>
		<p class="subtitle">Where you like to have meetings</p>
		<p>Ara can automatically respond to your email based on templates. You can create templates for common tasks, such as sharing your bank account number with others. You can add labels and later say &ldquo;Ara, can you share by bank info?&rdquo;, and Ara will respond with the relevant template.</p>
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
					<b-table-column field="subject" label="Email subject">
						{{ props.row.subject }}
					</b-table-column>
					<b-table-column field="labels" label="Labels">
						&ldquo;{{ props.row.labels[0] }}&rdquo; + {{ props.row.labels.length - 1 }}
					</b-table-column>
					<b-table-column label="Details">
						<nuxt-link :to="`/settings/templates/${props.row.id}`" class="button is-info is-outlined is-small">
							<b-icon style="margin-right: 0.25rem" pack="fas" icon="info-circle" />
							Edit
						</nuxt-link>
					</b-table-column>
					<b-table-column label="Delete">
						<button type="button" @click.prevent="deleteTemplate(props.row.id)" class="button is-danger is-outlined is-small">
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
							<p>You don't have any templates.</p>
						</div>
					</section>
				</template>
			</b-table>
		</section>
		<div class="card card-content">
			<h3 class="title is-5">Want to create another template?</h3>
			<nuxt-link to="/settings/templates/new" class="button is-primary">Add new template</nuxt-link>
		</div>
	</main>
</template>

<script>
export default {
	data() {
		return {
			loading: false,
			data: []
		}
	},
	computed: {
		user() {
			return this.$store.getters.user;
		}
	},
	mounted() {
		this.loading = true;
		this.$axios.get("/templates").then(response => {
			this.data = response.data.results;
		}).catch(error => {
			if (error.response.data.error) this.$snackbar.open({ type: "is-danger", message: error.response.data.error });
		}).then(() => { this.loading = false });
	},
	methods: {
		deleteTemplate(id) {
			this.$dialog.confirm({
			title: "Deleting template",
			message: "Are you sure you want to <b>delete</b> this template? This action cannot be undone.",
			confirmText: "Delete template",
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
							message: "This template has been deleted 🗑"
						});
						this.data = response.data;
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
