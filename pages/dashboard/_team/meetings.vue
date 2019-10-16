<template>
  <main>
    <h1>Meetings</h1>
    <p>List of upcoming and past meeting will come here.</p>
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
  private mounted() {}
}
</script>
