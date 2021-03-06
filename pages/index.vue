<template>
  <div>
    <header class="section section--bg-white">
      <div class="container">
        <div class="row">
          <div>
            <h1>
              <Translate t="pages.index.hero.title" />
            </h1>
            <p class="lead">
              <Translate t="pages.index.hero.intro" />
            </p>
            <div v-if="isAuthenticated">
              <nuxt-link
                v-if="
                  memberships &&
                    memberships.data &&
                    memberships.data.length &&
                    memberships.data[0].organization
                "
                class="button button--size-large button--color-primary"
                :to="
                  `/teams/${memberships.data[0].organization.username}/products`
                "
              >
                <Translate t="buttons.goToDashboard" />
              </nuxt-link>
            </div>
            <div v-else>
              <nuxt-link
                class="button button--size-large button--color-primary"
                to="/auth/register"
              >
                <Translate t="buttons.getStarted" />
              </nuxt-link>
            </div>
          </div>
          <img class="b" alt="" src="/images/undraw_happy_news_hxmt.svg" />
        </div>
      </div>
    </header>
    <main>
      <section class="section">
        <div class="container">
          <div class="row text text--align-center main-features">
            <div>
              <font-awesome-icon
                class="icon icon--size-lg"
                icon="calendar"
                fixed-width
              />
              <h3>
                <Translate t="pages.index.features.1.title" />
              </h3>
              <p>
                <Translate t="pages.index.features.1.intro" />
              </p>
            </div>
            <div>
              <font-awesome-icon
                class="icon icon--size-lg"
                icon="envelope-open"
                fixed-width
              />
              <h3>
                <Translate t="pages.index.features.2.title" />
              </h3>
              <p>
                <Translate t="pages.index.features.2.intro" />
              </p>
            </div>
            <div>
              <font-awesome-icon
                class="icon icon--size-lg"
                icon="hands-helping"
                fixed-width
              />
              <h3>
                <Translate t="pages.index.features.3.title" />
              </h3>
              <p>
                <Translate t="pages.index.features.3.intro" />
              </p>
            </div>
            <div>
              <font-awesome-icon
                class="icon icon--size-lg"
                icon="language"
                fixed-width
              />
              <h3>
                <Translate t="pages.index.features.4.title" />
              </h3>
              <p>
                <Translate t="pages.index.features.4.intro" />
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faSync,
  faUserLock,
  faFingerprint,
  faCode,
  faGlobeEurope,
  faShieldAlt,
  faToggleOn,
  faFile,
  faLanguage,
  faRocket,
  faMagic,
  faCreditCard,
  faUsers,
  faLaptop,
  faEnvelopeOpen,
  faHandsHelping,
  faCalendar,
  faImage
} from "@fortawesome/free-solid-svg-icons";
import {
  faNodeJs,
  faVuejs,
  faAccessibleIcon
} from "@fortawesome/free-brands-svg-icons";
import Translate from "@/components/Translate.vue";
import { Memberships } from "../types/users";
import { emptyPagination } from "../types/manage";
library.add(
  faSync,
  faMagic,
  faUserLock,
  faCalendar,
  faEnvelopeOpen,
  faImage,
  faHandsHelping,
  faFingerprint,
  faCode,
  faUsers,
  faLaptop,
  faGlobeEurope,
  faShieldAlt,
  faNodeJs,
  faVuejs,
  faToggleOn,
  faFile,
  faLanguage,
  faAccessibleIcon,
  faRocket,
  faCreditCard,
  faLanguage
);

@Component({
  computed: mapGetters({
    isAuthenticated: "auth/isAuthenticated"
  }),
  components: {
    Translate,
    FontAwesomeIcon
  }
})
export default class Home extends Vue {
  memberships: Memberships = emptyPagination;
  isAuthenticated!: boolean;
  private created() {
    if (!this.isAuthenticated) return;
    this.load();
    const user = this.$store.getters["auth/user"];
    if (user && user.username) {
      this.memberships = {
        ...this.$store.getters["users/memberships"](user.username)
      };
    }
  }

  private load() {
    if (!this.isAuthenticated) return;
    const user = this.$store.getters["auth/user"];
    if (
      user &&
      user.username &&
      (!this.memberships ||
        !this.memberships.data ||
        !this.memberships.data.length)
    )
      this.$store
        .dispatch("users/getMemberships", { slug: user.username })
        .then(memberships => {
          this.memberships = { ...memberships };
        })
        .catch(error => {
          throw new Error(error);
        });
  }
}
</script>

<style lang="scss" scoped>
header {
  padding: 15rem 0 5rem 0;
  margin-top: -7.5rem;
  h1 {
    margin: 0 0 2rem 0;
    font-size: 400%;
  }
}
.lead {
  font-size: 110%;
  max-width: 500px;
}
h2 {
  font-weight: 300;
  font-size: 200%;
  margin-bottom: 5rem;
}
.icon-circle {
  background-color: #fff;
  margin-right: 1rem;
  height: 3.5rem;
  width: 3.5rem;
  text-align: center;
  line-height: 3.5rem;
  font-size: 150%;
  border-radius: 100%;
}
dt {
  font-size: 125%;
  margin-bottom: 0.1rem;
  + dd {
    margin-left: 0;
  }
}
.rc {
  > div:first-child {
    float: left;
    margin-bottom: 2.5rem;
    > div {
      box-shadow: 0 0.1rem 0.2rem rgba(0, 0, 0, 0.1);
    }
  }
  &::after {
    content: "";
    display: block;
    width: 100%;
    clear: both;
  }
}
.icon--size-lg {
  font-size: 250%;
  opacity: 0.5;
  margin-bottom: 1rem;
}
.label-help {
  line-height: 1;
}
@media (max-width: 500px) {
  .label-help {
    display: none;
  }
}
.label-help::after {
  font-size: 90% !important;
  line-height: 1.5;
  width: 300px;
  white-space: normal;
}
.b {
  height: 20rem;
  margin-top: -4rem;
  margin-bottom: -5rem;
}
@media (max-width: 500px) {
  .b {
    margin-top: 0;
    margin-bottom: 0;
    height: auto;
    width: 100%;
    margin-bottom: -5rem;
  }
}
</style>
