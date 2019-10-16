<template>
  <main>
    <div class="row">
      <h2>Assistant</h2>
      <div class="text text--align-right">
        <button
          aria-label="Refresh"
          data-balloon-pos="down"
          class="button button--type-icon"
          @click="load"
        >
          <font-awesome-icon
            title="Refresh"
            class="icon"
            icon="sync"
            fixed-width
          />
        </button>
      </div>
    </div>
    <Loading v-if="loading" :message="loading" />
    <form v-else v-meta-ctrl-enter="save" @submit.prevent="save">
      <Input
        :value="organization.assistantName"
        label="Name"
        placeholder="Enter your assistant's name"
        required
        @input="val => (organization.assistantName = val)"
      />
      <Textarea
        :html="true"
        :value="organization.assistantSignature"
        label="Signature"
        placeholder="Enter your assistant's signature"
        required
        @input="val => (organization.assistantSignature = val)"
      />
      <h2>Scheduling</h2>
      <CheckList
        :json="true"
        :options="days"
        :value="organization.schedulingDays"
        label="Days"
        required
        @input="val => (organization.schedulingDays = val)"
      />
      <div class="row">
        <Input
          :value="organization.schedulingStart"
          label="Start time"
          placeholder="Select a time"
          required
          @input="val => (organization.schedulingStart = val)"
        />
        <Input
          :value="organization.schedulingEnd"
          label="End time"
          placeholder="Select a time"
          required
          @input="val => (organization.schedulingEnd = val)"
        />
      </div>
      <div class="row">
        <Input
          :value="organization.schedulingDuration"
          label="Default duration (min)"
          placeholder="Enter number of minutes"
          required
          @input="val => (organization.schedulingDuration = val)"
        />
        <Input
          :value="organization.schedulingPadding"
          label="Padding time (min)"
          placeholder="Enter number of minutes"
          required
          @input="val => (organization.schedulingPadding = val)"
        />
      </div>
      <h2>Email</h2>
      <Input
        :value="`${organization.username}@my.araassistant.com`"
        label="Assistant email"
        required
        disabled
      />
      <Checkbox
        :value="organization.smtpEnabled"
        label="Enable custom SMTP"
        help="Make sure you set up a forwarder to the above email"
        :question-mark="true"
        @input="val => (organization.smtpEnabled = val)"
      />
      <div class="row">
        <Select
          :value="organization.smtpType"
          label="Provider"
          :options="{
            Gmail: 'Google GSuite',
            Outlook365: 'Microsoft Outlook',
            Gmail: 'Gmail',
            Hotmail: 'Hotmail',
            iCloud: 'iCloud',
            SendGrid: 'SendGrid',
            Yahoo: 'Yahoo! Mail',
            Zoho: 'Zoho Mail',
            smtp: 'Custom SMTP'
          }"
          placeholder="Select an SMTP type"
          @input="val => (organization.smtpType = val)"
        />
        <Input
          :value="organization.smtpPort"
          label="Port"
          placeholder="Enter your SMTP port"
          @input="val => (organization.smtpPort = val)"
        />
      </div>
      <div class="row">
        <Input
          :value="organization.smtpUsername"
          label="Username"
          placeholder="Enter your SMTP username"
          @input="val => (organization.smtpUsername = val)"
        />
        <Input
          :value="organization.smtpPassword"
          label="Password"
          placeholder="Enter your SMTP password"
          type="password"
          @input="val => (organization.smtpPassword = val)"
        />
      </div>
      <button class="button">
        Update settings
      </button>
    </form>
  </main>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { mapGetters } from "vuex";
import { getAllCountries } from "countries-and-timezones";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faSync } from "@fortawesome/free-solid-svg-icons";
import Loading from "@/components/Loading.vue";
import Input from "@/components/form/Input.vue";
import CheckList from "@/components/form/CheckList.vue";
import Textarea from "@/components/form/Textarea.vue";
import Select from "@/components/form/Select.vue";
import ImageInput from "@/components/form/Image.vue";
import Checkbox from "@/components/form/Checkbox.vue";
import { User } from "@/types/auth";
import {
  OrganizationsKV,
  Organization,
  emptyOrganization
} from "@/types/manage";
library.add(faSync);

@Component({
  components: {
    Loading,
    Input,
    CheckList,
    Textarea,
    FontAwesomeIcon,
    Select,
    ImageInput,
    Checkbox
  },
  middleware: "auth"
})
export default class ManageSettings extends Vue {
  loading = "";
  organization: Organization = emptyOrganization;
  loggedInMembership = 3;
  days = {
    mon: { text: "Monday" },
    tue: { text: "Tueday" },
    wed: { text: "Wednesday" },
    thu: { text: "Thursday" },
    fri: { text: "Friday" },
    sat: { text: "Saturday" },
    sun: { text: "Sunday" }
  };

  private created() {
    this.organization = {
      ...this.$store.getters["manage/organization"](this.$route.params.team)
    };
    this.loggedInMembership = parseInt(
      this.$store.getters["manage/loggedInMembership"](this.$route.params.team)
    );
  }

  private load() {
    this.loading = "Loading organization details";
    this.$store
      .dispatch("manage/getOrganization", this.$route.params.team)
      .then(org => {
        this.organization = { ...org };
      })
      .catch(() => {})
      .finally(() => (this.loading = ""));
  }

  private mounted() {
    this.load();
  }

  private save() {
    this.loading = "Saving";
    this.$store
      .dispatch("manage/updateOrganization", {
        team: this.$route.params.team,
        ...this.organization
      })
      .then(org => {
        this.organization = { ...org };
        this.$router.replace(`/manage/${this.organization.username}/settings`);
      })
      .catch(() => {})
      .finally(() => (this.loading = ""));
  }
}
</script>

<style lang="scss" scoped></style>
