import User from "@/api/modules/Auth";
import router from "@/router/router";
import { useToast } from "vue-toast-notification";
const toast = useToast();

export const clearToken = ({ commit }) => {
  commit("SET_TOKEN", null);
  commit("SET_USER_PROFILE", null);
  commit("SET_RESEND_OTP", null);
  commit("SET_FLAG", {})
  window.localStorage.removeItem('vuex');
};

export const logoutUser = ({ commit }, formData) => {
  User.logout(formData)
    .then(() => {
      commit("SET_TOKEN", null);
      commit("SET_USER_PROFILE", null);
      commit("SET_RESEND_OTP", null);
      commit("SET_FLAG", {})
      window.localStorage.removeItem('vuex');

      if (process.env.NODE_ENV == 'development') {
        router.push({ name: "Login" });
      } else {
        window.location.href = process.env.VUE_APP_URL_WEBSITE;
      }
    })
    .catch((error) => {
      if (error.response.status === 401 || error.response.status == 422 || error.response.status == 403) {
        commit("SET_TOKEN", null);
        commit("SET_USER_PROFILE", null);
        commit("SET_RESEND_OTP", null);
        commit("SET_FLAG", {})
        router.push({ name: "Login" });
      }
    });
};

export const userVerifyOTP = ({ commit }, formData) => {
  commit("SET_LOADER", true);
  if (formData.flag == 2) {
    const data = formData.payload;
    User.login({ email: data.email, password: data.password })
      .then((response) => {
        commit("SET_TOKEN", response.data.token);

        User.show()
          .then((response) => {
            commit("SET_USER_PROFILE", response.data.data);
          })

        router.push({
          name: "document.audit",
          params: { document_id: data.document_id },
        });

        setTimeout(() => {
          commit("SET_LOADER", false);
        }, 1000);
      })
      .catch((error) => {
        commit("SET_LOADER", false);
        if (error?.response?.status == 401 || error?.response?.status == 404) {
          commit("SET_AUTH_ERROR", error?.response?.data.message);
          return toast.error(`${error?.response?.data.errors.root}`, {
            timeout: 5000,
            position: "top-right",
          });
        }
      });
  } else {
    User.verifyOTP(formData.payload)
      .then((response) => {
        commit("SET_TOKEN", response.data.token);
        commit("SET_TOKEN_TYPE", "Bearer");
        User.show().then((response) => {
          commit("SET_USER_PROFILE", response.data.data);

          router.push({
            name: "document.edit",
            params: { document_id: formData.payload.document_id },
          });

          setTimeout(() => {
            commit("SET_LOADER", false);
          }, 1000);
        })
      })
      .catch((error) => {
        commit("SET_LOADER", false);
        if (error.response.status == 422) {
          toast.error(error.response.data.message, {
            timeout: 5000,
            position: "top-right",
          });
        } else if (error.response.status == 401) {
          let hasError = ''
          if (error.response.data?.data?.error != '') {
            hasError = error.response.data?.data?.error
          }
          if (error.response.data?.errors?.root) {
            hasError = error.response.data?.errors?.root
          }

          if (hasError == 'You are not a participant in this document') {
            router.push({ name: 'Error' })
          }

          toast.error(hasError, {
            timeout: 5000,
            position: "top-right",
          });
        }
      });
  }
};

export const resetPassword = ({ commit }, formData) => {
  User.changePassword(formData)
    .then(() => {
      commit("SET_FLAG", {})
      toast.success("Password created successfully", {
        timeout: 5000,
        position: "top-right",
      });
    })
    .catch((error) => {
      if (error.response.status == 422) {
        commit("SET_FLAG", { guest: false })
      }
    });
};

export const userResendVerifyOTP = ({ commit }, formData) => {
  User.resendVerifyOTP(formData)
    .then(() => {
      commit("SET_RESEND_OTP", true);
      toast.success("OTP has been sent to your email", {
        timeout: 5000,
        position: "top-right",
      });
    })
};

export const setAuthentication = ({ commit }, data) => {
  commit("SET_TOKEN", data.token);
  commit("SET_TOKEN_TYPE", "Bearer");

  User.show()
    .then((response) => {
      commit("SET_USER_PROFILE", response.data.data);
      if (data.documentId != undefined) {
        return router.push({
          name: "document.audit",
          params: { document_id: data.documentId },
        });
      }
      if (data.status != '') {
        return router.push({ name: "Document", query: { status: data.status } })
      }
    })
    .catch((error) => {
      if (error.response.status == 401 || error.response.status == 404) {
        window.location.href = process.env.VUE_APP_URL_AUTH_LIVE;
      }
    });
};

export const setAuthForDocumentUpload = ({ commit }, token) => {
  commit("SET_TOKEN", token);
  commit("SET_TOKEN_TYPE", "Bearer");
  User.show()
    .then((response) => {
      commit("SET_USER_PROFILE", response.data.data);
      router.push({ name: "document.upload" });
    })
};

export const loginUser = ({ commit }, formData) => {
  User.login(formData)
    .then((response) => {
      commit("SET_TOKEN", response.data.token);
      commit("SET_TOKEN_TYPE", response.data.token_type);

      User.show()
        .then((response) => {
          commit("SET_USER_PROFILE", response.data.data);
          router.push({ name: "Document" });

          toast.success("Welcome to ToNote ", {
            timeout: 5000,
            position: "top-right",
          });
        })
    })
    .catch((error) => {
      if (error.response.status == 401 || error.response.status == 404) {
        commit("SET_AUTH_ERROR", error.response.data.message);
        toast.error(`${error.response.data.errors.root}`, {
          timeout: 5000,
          position: "top-right",
        });
      }
      if (error.response.status == 422) {
        commit("SET_AUTH_ERROR", error.response.data.message);
        toast.error(`${error.response.data.message}`, {
          timeout: 5000,
          position: "top-right",
        });
      }
    });
};

export const createUserAccount = ({ commit }, formData) => {
  User.register(formData.payload)
    .then((response) => {
      commit("SET_TOKEN", response.data.token);
      commit("SET_TOKEN_TYPE", response.data.token_type);

      User.show()
        .then((response) => {
          commit("SET_USER_PROFILE", response.data.data);
          if (formData.di != undefined) {
            return router.push({
              name: "Verify",
              query: { e: formData.payload.email, f: 0, di: formData.di },
            });
          }
        })
    })
    .catch((error) => {
      if (error.response.status == 401 || error.response.status == 404) {
        commit("SET_AUTH_ERROR", error.response.data.message);
        toast.error(`${error.response.data.errors.root}`, {
          timeout: 5000,
          position: "top-right",
        });
      }
      if (error.response.status == 422) {
        commit("SET_AUTH_ERROR", error.response.data.message);
        toast.error(`${error.response.data.message}`, {
          timeout: 5000,
          position: "top-right",
        });
      }
    });
};