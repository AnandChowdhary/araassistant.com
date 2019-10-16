<template>
  <div>
    <main class="section section--bg-white">
      <div class="container">
        <div class="row">
          <div>
            <h2>Give your assistant a personality</h2>
            <p>
              Set up a custom name, email, and signature for your assistant.
            </p>
          </div>
          <div>
            <h2>Works at @your-domain</h2>
            <p>
              Supports custom emails on your domain from all major providers.
            </p>
          </div>
        </div>
        <div class="row text text--mt-2">
          <div>
            <h2>Slack notifications</h2>
            <p>
              Get notified in your channel when an appointment is confirmed.
            </p>
          </div>
          <div>
            <h2>Calendar invitations</h2>
            <p>
              Email links to all major online calendar platforms to your guests.
            </p>
          </div>
        </div>
        <div class="row text text--mt-2">
          <div>
            <h2>Preferred locations</h2>
            <p>
              Set up addresses to help your assistant schedule meetings.
            </p>
          </div>
          <div>
            <h2>Audio, video, in-person</h2>
            <p>
              Supports all different types of online and offline meetings.
            </p>
          </div>
        </div>
        <div class="row text text--mt-2">
          <div>
            <h2>Automated follow ups</h2>
            <p>
              Send email nudges and reminders for appointments and tasks.
            </p>
          </div>
          <div>
            <h2>Generate new leads</h2>
            <p>
              Find contacts based on company domains and auto-email them.
            </p>
          </div>
        </div>
        <div class="row text text--mt-2">
          <div>
            <h2>Templated replies</h2>
            <p>
              Automatically reply to common queries over email.
            </p>
          </div>
          <div>
            <h2>Available times</h2>
            <p>
              Sets up appointments when you're free based on your calendar.
            </p>
          </div>
        </div>
        <div class="row text text--mt-2">
          <div>
            <h2>Across timezones and languages</h2>
            <p>
              Sends calendar invitations and emails in local time and language.
            </p>
          </div>
          <div>
            <h2>Personalized link</h2>
            <p>
              Get a personal webpage to let guests book a time.
            </p>
          </div>
        </div>
      </div>
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
  faHandsHelping,
  faCalendar,
  faImage,
  faEnvelopeOpen
} from "@fortawesome/free-solid-svg-icons";
import {
  faNodeJs,
  faVuejs,
  faAccessibleIcon
} from "@fortawesome/free-brands-svg-icons";
import Translate from "@/components/Translate.vue";
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
export default class Home extends Vue {}
</script>

<style lang="scss" scoped>
.row > * {
  flex: 1 0 0;
}
</style>
