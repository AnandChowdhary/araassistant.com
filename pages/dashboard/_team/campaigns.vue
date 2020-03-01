<template>
  <main>
    <h1>Contacts</h1>
    <p>List of outbound marketing campaigns will come here.</p>
    <form @submit.prevent="search">
      <input
        v-model="query"
        type="search"
        placeholder="Enter a domain, e.g., oswaldlabs.com"
      />
      <button>Submit</button>
    </form>
    <div v-if="emails.length">
      <h2>Leads</h2>
      <ul>
        <li v-for="(email, i) in emails" :key="`e${i}${email.email}`">
          <strong>{{ email.first_name }} {{ email.last_name }}</strong>
          {{ email.email }}
          <button
            class="button button--size-small"
            @click.prevent="save(email)"
          >
            Save
          </button>
        </li>
      </ul>
    </div>
  </main>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";
import Loading from "@/components/Loading.vue";

@Component({
  middleware: "auth",
  components: {
    Loading
  }
})
export default class Dashboard extends Vue {
  emails: any = [];
  query = "";

  private async search() {
    if (!this.query) return;
    const result = (
      await this.$axios.get(
        `/organizations/${this.$route.params.team}/leads/domain?q=${this.query}`
      )
    ).data;
    this.query = "";
    this.emails = result.data;
  }

  private async save(contact: any) {
    await this.$axios.put(
      `/organizations/${this.$route.params.team}/leads/contacts`,
      contact
    );
  }
}
</script>
