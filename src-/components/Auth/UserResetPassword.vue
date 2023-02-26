<template>
  <div>
    <label class="form-label" for="password">Password</label>
    <div class="input-group input-group-merge mb-1">
      <input type="password" @input="password_check" name="password" v-model="newPassword" ref="pass"
        class="form-control form-control-merge" id="password" placeholder="Enter your password" />
      <span class="input-group-text cursor-pointer" @click="togglePassword">
        <Icon icon="bi:eye" style="font-size: 1.5rem" v-show="!show" />
        <Icon icon="bi:eye-slash" style="font-size: 1.5rem" v-show="show" />
      </span>
    </div>

    <div class="form-check my-2">
      <input class="form-check-input" type="checkbox" value="" id="invalidCheck" @change="handleCheck($event)"
        :checked="isChecked">
      <label class="form-check-label" for="invalidCheck">
        I agree to
        <a href="https://gettonote.com/privacy" target="_blank">privacy policy</a> and
        <a href="https://gettonote.com/terms" target="_blank">terms</a>
      </label>
    </div>

    <p class="text-secondary small mb-0" :class="[newPassword.length > 7 ? 'text-success' : 'text-danger']">
      <Icon icon="carbon:dot-mark" /> At least 8 characters
    </p>
    <p class="text-secondary small mb-0" :class="[has_uppercase ? 'text-success' : 'text-danger']">
      <Icon icon="carbon:dot-mark" /> Has a capital letter
    </p>
    <p class="text-secondary small mb-0" :class="[has_lowercase ? 'text-success' : 'text-danger']">
      <Icon icon="carbon:dot-mark" /> Has a lowercase letter
    </p>
    <p class="text-secondary small mb-0" :class="[has_number ? 'text-success' : 'text-danger']">
      <Icon icon="carbon:dot-mark" /> Has a number
    </p>
    <p class="text-secondary small mb-0" :class="[has_special ? 'text-success' : 'text-danger']">
      <Icon icon="carbon:dot-mark" /> Has a special character
    </p>
  </div>

  <div class="mt-2">
    <div class="modal-footer" style="padding: 1rem 0 0.3rem">
      <button class="btn btn-sm btn-secondary" @click="$emit('save', false)">
        <span v-show="loading" class="spinner-border spinner-border-sm"></span>
        No
      </button>
      <button class="btn btn-sm btn-primary" @click="changePassword" :disabled="!valid_password || !isChecked">
        <span v-show="loading" class="spinner-border spinner-border-sm"></span>
        Save
      </button>
    </div>
  </div>
</template>

<script setup>
import { Icon } from "@iconify/vue";
import { ref } from "vue";

import { useGetters, useActions } from "vuex-composition-helpers/dist";

const { OTPFlag } = useGetters({
  OTPFlag: "auth/OTPFlag",
});

const { resetPassword } = useActions({
  resetPassword: "auth/resetPassword"
});


const pass = ref("");
const show = ref(false);
const newPassword = ref("");
const valid_password = ref(false);
const loading = ref(false);

const has_number = ref(false);
const has_lowercase = ref(false);
const has_uppercase = ref(false);
const has_special = ref(false);

const isChecked = ref(false);
const handleCheck = (e) => {
  isChecked.value = e.target.checked ?? false;
};

const changePassword = () => {
  if (valid_password.value == false) return
  loading.value = true
  valid_password.value = false

  const passwordObj = {
    current_password: OTPFlag.value?.data?.password,
    password: newPassword.value
  }

  resetPassword(passwordObj)
  if (!OTPFlag.value.guest) { loading.value = false }
}

const togglePassword = () => {
  show.value = !show.value;
  pass.value.type = show.value ? "text" : "password";
};

const password_check = () => {
  has_number.value = /\d/.test(newPassword.value);
  has_lowercase.value = /[a-z]/.test(newPassword.value);
  has_uppercase.value = /[A-Z]/.test(newPassword.value);
  has_special.value = /[ !@#$%^&*()_+\-=\\[\]{};':"\\|,.<>\\/?]/.test(newPassword.value);

  if (has_number.value === true
    && has_lowercase.value === true
    && has_uppercase.value === true
    && has_special.value === true
    && newPassword.value.length > 7) {
    valid_password.value = true;
  } else {
    valid_password.value = false;
  }
};
</script>

<style scoped>

</style>
