import Vue from "vue";
import { MutationTree, ActionTree, GetterTree } from "vuex";
import { NuxtAxiosInstance } from "@nuxtjs/axios";
import { AxiosRequestConfig } from "axios";
import decode from "jwt-decode";
import en from "@/locales/en";
import { removeNulls, removeReadOnlyValues } from "~/helpers/crud";
import { RootState } from "~/types/auth";
const messages = en.messages;
const errors = en.errors;

const redirectErrors = ["unapproved-location", "missing-token"];
const ignoredErrors = ["no-customer"];

export default function({
  $axios,
  redirect,
  store
}: {
  $axios: NuxtAxiosInstance;
  redirect: any;
  store: {
    state: {
      auth: RootState;
    };
    dispatch: any;
  };
}) {
  $axios.interceptors.request.use(
    (config: AxiosRequestConfig) =>
      new Promise((resolve, reject) => {
        config.data = removeNulls(removeReadOnlyValues(config.data));
        $axios.setHeader("X-Requested-With", "XMLHttpRequest");

        // Don't worry, this is a public API key and you can see this :)
        $axios.setHeader("X-Api-Key", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwib3JnYW5pemF0aW9uSWQiOjEsInJlZmVycmVyUmVzdHJpY3Rpb25zIjoic3RhYXJ0LWRlbW8ubzE1eS5jb20sbG9jYWxob3N0LG9zd2FsZGxhYnMuY29tLHNlcnZlby5uZXQiLCJpYXQiOjE1NjM0NDg5MTUsImV4cCI6ODg1MTc4MDUzMzAxMiwiaXNzIjoic3RhYXJ0Iiwic3ViIjoiYXBpLWtleSIsImp0aSI6IjVlNTViMTY4ZGU1NCJ9.2_VIQ9yLa-4mTyJOMKLtKLlbUGVH15U2P32PalYK6_A");
        try {
          const token = config.headers.common.Authorization.replace(
            "Bearer ",
            ""
          );
          if (decode(token).exp * 1000 < new Date().getTime()) {
            $axios.setHeader("Authorization", undefined);
            store
              .dispatch("auth/refresh")
              .then((newToken: string) => {
                config.headers = {
                  ...config.headers,
                  Authorization: `Bearer ${newToken}`
                };
              })
              .catch((error: any) => {
                throw new Error(error);
              })
              .then(() => resolve(config));
          } else {
            resolve(config);
          }
        } catch (error) {
          resolve(config);
        }
      })
  );
  $axios.onResponse(response => {
    if (response.data.success === true) {
      if (response.data.message) {
        Vue.notify({
          group: "auth",
          text: messages[response.data.message] || messages.success,
          type: "notification notification--color-success"
        });
      } else {
        Vue.notify({
          group: "auth",
          text: messages.success,
          type: "notification notification--color-success"
        });
      }
    }
  });
  $axios.onError(error => {
    if (!error.response) return;
    if (
      ["revoked-token", "invalid-token", "expired-token"].includes(
        error.response.data.code || error.response.data.error
      )
    ) {
      return redirect("/auth/refresh");
    }
    if (
      ignoredErrors.includes(
        error.response.data.code || error.response.data.error
      )
    ) {
    } else if (
      redirectErrors.includes(
        error.response.data.code || error.response.data.error
      )
    ) {
      return redirect(
        `/errors/${error.response.data.code || error.response.data.error}`
      );
    } else if (
      Object.keys(errors).includes(
        error.response.data.code || error.response.data.error
      )
    ) {
      Vue.notify({
        group: "auth",
        text: errors[error.response.data.code || error.response.data.error],
        duration: 5000,
        type: "notification notification--color-danger"
      });
    } else {
      Vue.notify({
        group: "auth",
        text: error.response.data.code || error.response.data.error,
        type: "notification notification--color-danger"
      });
    }
  });
}