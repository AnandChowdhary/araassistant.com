<template>
	<main>
		<b-loading :is-full-page="true" :active.sync="loading"></b-loading>
	</main>
</template>

<script>
export default {
	data() {
		return {
			loading: true
		}
	},
	mounted() {
		this.loading = true;
		this.$axios.get(`/google?to=${location.protocol}//${location.host}/auth/google`).then(response => {
			this.loading = false;
			if (response.data.url) {
				location.href = response.data.url;
			}
		});
	}
}
</script>
