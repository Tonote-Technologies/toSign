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

          <template v-if="flag == '0'">
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
              <button type="submit" class="btn btn-primary w-100" tabindex="4">
                Verify
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
import { ref, onMounted, watch } from "vue";
import PreLoader from "@/components/PreLoader.vue";
import VOtpInput from "vue3-otp-input";
import { createNamespacedHelpers } from "vuex-composition-helpers/dist";
import { useRouter } from "vue-router";
// import Api from "@/api/Api";

const route = useRouter();
const { useActions, useGetters } = createNamespacedHelpers("auth");
const { loader } = useGetters(["loader"]);
const { userVerifyOTP } = useActions(["userVerifyOTP"]);
const { userResendVerifyOTP } = useActions(["userResendVerifyOTP"]);

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
// const hasAccount = ref(false);

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

const verifyAccess = () => {
  const verificationObj = {
    document_id: documentId.value,
    email: email.value,
    password: otpPassword.value,
  };
  userVerifyOTP({ flag: flag.value, payload: verificationObj });
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

  // if (flag.value == 0)
  //   Api.get(process.env.VUE_APP_API_LIVE + "document-user-check/" + email.value).then(
  //     (response) => {
  //       hasAccount.value = response.data.data.message;
  //       console.log(hasAccount.value)
  //       if (hasAccount.value) { flag.value = 1 }
  //     }
  //   );

  forgotPassword.value =
    process.env.NODE_ENV != "development"
      ? process.env.VUE_APP_URL_AUTH_FORGOT_PASSWORD_LIVE
      : process.env.VUE_APP_URL_AUTH_FORGOT_PASSWORD_LOCAL;
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
