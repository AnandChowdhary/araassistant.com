<template>
  <div
    :key="`dashboard_${$route.params.team}`"
    class="container container--type-settings"
  >
    <aside>
      <nav>
        <nuxt-link
          class="item"
          :to="`/dashboard/${$route.params.team}/meetings`"
        >
          <font-awesome-icon class="nav-icon" icon="calendar" fixed-width />
          <span>Meetings</span>
        </nuxt-link>
        <nuxt-link
          class="item"
          :to="`/dashboard/${$route.params.team}/campaigns`"
        >
          <font-awesome-icon class="nav-icon" icon="mail-bulk" fixed-width />
          <span>Campaigns</span>
        </nuxt-link>
      </nav>
    </aside>
    <div class="card">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { mapGetters } from "vuex";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCalendar, faMailBulk } from "@fortawesome/free-solid-svg-icons";
library.add(faCalendar, faMailBulk);

@Component({
  components: {
    FontAwesomeIcon
  }
})
export default class Dashboard extends Vue {
  loggedInMembership = 3;
  doneOnce = false;
  private created() {
    this.loggedInMembership = parseInt(
      this.$store.getters["manage/loggedInMembership"](this.$route.params.team)
    );
  }
  private mounted() {
    this.update();
  }
  private update() {
    this.$store.commit("auth/setActiveOrganization", this.$route.params.team);
    this.getUserMembership();
  }
  private getUserMembership() {
    const user = this.$store.state.auth.user;
    if (user) {
      const org = this.$store.state.auth.activeOrganization;
      if (org) {
        const memberships = this.$store.state.users.memberships[
          user.username || user.id
        ];
        if (memberships) {
          const yourMembership = memberships.data.filter(
            membership =>
              membership.organization.id === org ||
              membership.organization.username === org
          );
          if (yourMembership.length) {
            const role = yourMembership[0].role;
            this.$store.commit("manage/setLoggedInMembership", {
              team: org,
              role
            });
          } else if (!this.doneOnce) {
            this.$store
              .dispatch("users/getMemberships", { slug: user.username })
              .then(() => this.getUserMembership())
              .catch(() => {})
              .then(() => (this.doneOnce = true));
          }
        } else {
          this.$store
            .dispatch("users/getMemberships", { slug: user.username })
            .then(() => this.getUserMembership())
            .catch(() => {});
        }
      }
    }
  }
  @Watch("$route.path")
  onRouteChanged() {
    this.update();
  }
}
</script>
