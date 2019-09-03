<template>
  <main />
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
  private created() {
    this.$router.replace(`/dashboard/${this.$route.params.team}/meetings`);
  }
}
</script>
