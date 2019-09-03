<template>
  <main>
    <h1>Campaigns</h1>
    <p>List of outbound marketing campaigns will come here.</p>
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
  private async mounted() {
    const result = (await this.$axios.get(
      "/organizations/anands-assistant/leads/domain?q=oswaldlabs.com"
    )).data;
    console.log("GOT RESULT", result);
  }
}
</script>
