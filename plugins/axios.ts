import Vue from "vue";
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
        // $axios.setHeader("X-Api-Key", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQwZThhN2MtM2w4anhsanZ4ZyIsIm9yZ2FuaXphdGlvbklkIjoiZDBlOGE3Yy0zbDhqeGxqdnhnIiwicmVmZXJyZXJSZXN0cmljdGlvbnMiOiJhcmEtYXNzaXN0YW50Lm5ldGxpZnkuY29tLGFyYWFzc2lzdGFudC5jb20sbG9jYWxob3N0Iiwic2NvcGVzIjoib3JnUmVhZCIsImlhdCI6MTU2NzMzMzM2MSwiZXhwIjo4ODQ3OTE5NzcyMzMwLCJpc3MiOiJhcmFhc3Npc3RhbnQuY29tIiwic3ViIjoiYXBpLWtleSIsImp0aSI6IjczMTYwZTJjYTc2NyJ9.V7vCq862CykP2D1h7mvvQFLkvMyHLBxIXkmgdQvm24U");
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
      if (response.data.text) {
        Vue.notify({
          group: "auth",
          text: response.data.text,
          type: "notification notification--color-success"
        });
      } else if (response.data.message) {
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
