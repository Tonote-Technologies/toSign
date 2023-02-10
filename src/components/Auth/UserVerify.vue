<template>
  <div class="grid" v-show="isVerified">
    <PreLoader />
  </div>

  <div v-show="!isVerified" class="auth-wrapper auth-basic px-2">
    <div class="auth-inner my-2">
      <div class="card mb-0">
        <div class="card-body">
          <div class="brand-logo">
            <img src="@/assets/logo-dark.png" alt="ToNote Brand" height="26" />
          </div>

          <template v-if="flag == '0' && hasAccount === false">
            <h2 class="card-title fw-bolder mb-1">Two Step Verification 💬</h2>
            <p class="card-text mb-75">
              Enter the code from the email in the field below.
            </p>
            <form class="mt-2" @submit.prevent="verifyAccess">
              <label for="security" class="form-label">Type your security code</label>

              <div class="auth-input-wrapper">
                <v-otp-input ref="otpInput"
                  input-classes="form-control auth-input height-50 text-center numeral-mask mx-25 mb-1" separator=" "
                  :num-inputs="6" :should-auto-focus="true" :is-input-num="false"
                  :conditionalClass="['one', 'two', 'three', 'four', 'five', 'six']"
                  :placeholder="['', '', '', '', '', '']" @on-change="handleOnChange" @on-complete="handleOnComplete" />
              </div>

              <div class="col-12 text-end mb-1">
                <a role="button" class="text-decoration-underline" @click="clearInput()">Clear</a>
              </div>

              <div class="col-12">
                <div class="form-check my-2">
                  <input class="form-check-input" type="checkbox" value="" id="invalidCheck"
                    @change="handleCheck($event)" :checked="isChecked" />
                  <label class="form-check-label" for="invalidCheck">
                    I agree to
                    <a href="https://gettonote.com/privacy" target="_blank">privacy policy</a>
                    and
                    <a href="https://gettonote.com/terms" target="_blank">terms</a>
                  </label>
                </div>
              </div>

              <button type="submit" class="btn btn-primary w-100" tabindex="4" :disabled="!isChecked || loading">
                <span v-show="loading" class="spinner-border spinner-border-sm"></span>
                <template v-if="!loading">&nbsp;Verify</template>
                <template v-else> Processing...</template>
              </button>
            </form>

            <p class="text-center mt-2">
              <span>Didn't get the code?</span>
              <a href="Javascript:void(0)" @click="resendToken"><span>&nbsp;Resend</span></a>
              <span> or</span>
              <a href="Javascript:void(0)"><span>&nbsp;Contact Us</span></a>
            </p>
          </template>
          <template v-else>
            <h2 class="card-title fw-bolder mb-1">Enter your password 💬</h2>
            <p class="card-text mb-75">
              Please, enter your password to view this document.
            </p>

            <form class="mt-2" @submit.prevent="verifyAccess">
              <div class="d-flex justify-content-between align-items-center">
                <label for="security" class="form-label">Password</label>
                <label class="form-label">
                  <a :href="forgotPassword">Forgot Password?</a>
                </label>
              </div>

              <div class="form-group">
                <div class="input-group input-group-merge mb-1">
                  <input type="password" v-model="otpPassword" ref="pass" class="form-control form-control-merge"
                    id="security" placeholder="Enter your password" />
                  <span class="input-group-text cursor-pointer" @click="togglePassword">
                    <Icon icon="bi:eye" style="font-size: 1.5rem" v-show="!show" />
                    <Icon icon="bi:eye-slash" style="font-size: 1.5rem" v-show="show" />
                  </span>
                </div>
              </div>
              <button type="submit" class="btn btn-primary w-100" tabindex="4">
                Sign in
              </button>
            </form>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from "@iconify/vue";
import PreLoader from "@/components/PreLoader.vue";
import VOtpInput from "vue3-otp-input";

import Api from "@/api/Api";
import { ref, onMounted, watch } from "vue";
import { useActions, useGetters } from "vuex-composition-helpers/dist";

import { useRouter } from "vue-router";

const route = useRouter();
const { profile, loader } = useGetters({
  profile: "auth/profile",
  loader: "auth/loader",
});

const { userVerifyOTP, userResendVerifyOTP, clearStore, isGuest } = useActions({
  userVerifyOTP: "auth/userVerifyOTP",
  userResendVerifyOTP: "auth/userResendVerifyOTP",
  clearStore: "auth/clearStore",
  isGuest: "document/isGuest",
});

const uri = ref("");
const email = ref("");
const documentId = ref("");
const otpPassword = ref("");
const isVerified = ref(false);
const flag = ref("");
const otpInput = ref(null);
const forgotPassword = ref("");
const pass = ref("");
const show = ref(false);
const hasAccount = ref(false);

watch(() => loader.value,
  (newLoader) => {
    isVerified.value = newLoader
  }
)

const togglePassword = () => {
  show.value = !show.value;
  pass.value.type = show.value ? "text" : "password";
};

const handleOnComplete = (value) => {
  otpPassword.value = value;
};

const clearInput = () => {
  otpInput.value.clearInput();
};

const loading = ref(false);
const isChecked = ref(false);
const handleCheck = (e) => {
  isChecked.value = e.target.checked ?? false;
};

const verifyAccess = () => {
  isVerified.value = true;
  const verificationObj = {
    document_id: documentId.value,
    email: email.value,
    password: otpPassword.value,
  };
  userVerifyOTP({ flag: flag.value, payload: verificationObj });
  setTimeout(() => (isVerified.value = false), 5000);
};

const resendToken = () => {
  const verificationObj = {
    document_id: documentId.value,
    email: email.value,
  };
  userResendVerifyOTP(verificationObj);
};

onMounted(() => {
  uri.value = route.currentRoute.value.query;
  email.value = uri.value.e;
  documentId.value = uri.value.di;
  flag.value = uri.value.f;

  Api.get(process.env.VUE_APP_API_LIVE + "document-user-check/" + email.value).then(
    (response) => {
      hasAccount.value = response.data.data.message;
      isGuest(!hasAccount.value)
    }
  );

  forgotPassword.value =
    process.env.NODE_ENV != "development"
      ? process.env.VUE_APP_URL_AUTH_FORGOT_PASSWORD_LIVE
      : process.env.VUE_APP_URL_AUTH_FORGOT_PASSWORD_LOCAL;

  if (email.value === profile.value?.email && profile.value?.email != undefined) {
    isVerified.value = true;
    route.push({ name: "document.edit", params: { document_id: documentId.value } });
    setTimeout(() => (isVerified.value = false), 5000);
    return;
  } else clearStore();
});
</script>

<style scoped>
.grid {
  display: grid;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
}

.auth-wrapper {
  min-height: 80vh;
}
</style>
