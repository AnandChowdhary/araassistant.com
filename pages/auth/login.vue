<template>
  <main
    class="container container--size-small container--top-20height container--bottom-20height"
  >
    <Card>
      <h1>Login</h1>
      <Loading v-if="isLoading" message="Logging you in" />
      <form v-else v-meta-ctrl-enter="login" @submit.prevent="login">
        <Input
          v-model="email"
          type="email"
          label="Email"
          placeholder="Enter your work email"
          autocomplete="authname"
          autofocus
          required
        />
        <Input
          v-model="password"
          type="password"
          label="Password"
          placeholder="Enter your password"
          autocomplete="current-password"
          required
        />
        <button
          class="button button--width-full button--size-large"
          type="submit"
        >
          Login to your account
        </button>
        <button
          class="button button--width-full button--size-large button--color-info text text--mt-1"
          type="submit"
        >
          Login with Google
        </button>
      </form>
    </Card>
    <div class="row text text--mt-1">
      <nuxt-link to="/auth/forgot">Forgot your password?</nuxt-link>
      <nuxt-link to="/auth/register" style="text-align: right"
        >Create an account</nuxt-link
      >
    </div>
  </main>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faGoogle,
  faSalesforce,
  faFacebook,
  faMicrosoft,
  faApple,
  faWeixin,
  faGithub
} from "@fortawesome/free-brands-svg-icons";
import { faDotCircle, faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import Input from "@/components/form/Input.vue";
import Loading from "@/components/Loading.vue";
import Modal from "@/components/Modal.vue";
import Card from "@/components/Card.vue";
library.add(
  faGoogle,
  faSalesforce,
  faFacebook,
  faMicrosoft,
  faApple,
  faDotCircle,
  faEllipsisH,

  faWeixin,
  faGithub
);

interface IWindow extends Window {
  AppleID: any;
}

@Component({
  components: {
    Modal,
    Card,
    Loading,
    Input,
    FontAwesomeIcon
  },
  computed: mapGetters({
    isAuthenticated: "auth/isAuthenticated",
    isLoading: "auth/isLoading"
  })
})
export default class Login extends Vue {
  email = "";
  password = "";
  isAuthenticated!: boolean;
  showMore = false;
  redirect: string | undefined = "";
  private login() {
    this.$store
      .dispatch("auth/loginWithEmailPassword", {
        email: this.email,
        password: this.password
      })
      .then(response => {
        if (response === "2fa") {
          return this.$router.push("/auth/2fa");
        } else {
        }
      })
      .then(() => this.$store.dispatch("users/getMemberships", { slug: "me" }))
      .then(memberships => {
        if (
          memberships?.data.length &&
          memberships?.data[0]?.organization?.username
        )
          return this.$router.replace(
            `/teams/${memberships.data[0].organization.username}/products`
          );
        return this.$router.replace("/");
      })
      .catch(error => {
        throw new Error(error);
      })
      .finally(() => {
        this.email = "";
        this.password = "";
      });
  }

  private created() {
    this.redirect = this.$route.query.redirect as string | undefined;
    if (this.isAuthenticated)
      return this.$router.replace(this.redirect || "/dashboard");
  }

  private async oauthLogin(service: string) {
    this.$store.commit("auth/startLoading");
    const link = (await this.$axios.get(`/auth/oauth/${service}`)).data
      .redirect;
    location.replace(link);
  }
}
</script>

<style lang="scss" scoped>
.or {
  text-align: center;
  margin: 1rem 0;
}
.row--type-social {
  flex-wrap: wrap;
}
.social-buttons .button {
  margin-bottom: 0.5rem;
}
</style>
