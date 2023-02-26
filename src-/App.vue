<template>
  <router-view></router-view>
</template>

<script setup>
import { onMounted } from 'vue';

import { useGetters, useActions } from "vuex-composition-helpers/dist";

const { token } = useGetters({
  token: "auth/token",
});

const { logoutUser } = useActions({
  logoutUser: "auth/logoutUser",
});

const timeoutInMS = 600000; //? 5 minutes -> 5 * 60 * 1000
let timeoutId;

function handleInactive() {
  if (token.value) {
    logoutUser({ token: token.value });
  }
}

function startTimer() {
  timeoutId = setTimeout(handleInactive, timeoutInMS);
}

function resetTimer() {
  clearTimeout(timeoutId);
  startTimer();
}

function setupTimers() {
  document.addEventListener("keypress", resetTimer, false);
  document.addEventListener("mousemove", resetTimer, false);
  document.addEventListener("mousedown", resetTimer, false);
  document.addEventListener("touchmove", resetTimer, false);

  startTimer();
}

onMounted(() => {
  setupTimers();

  (function () {
    const propertyId = process.env.VUE_APP_TAWK_PROPERTY_ID;
    const widgetId = process.env.VUE_APP_TAWK_WIDGET_ID;
    const s1 = document.createElement("script"),
      s0 = document.getElementsByTagName("script")[0];
    s1.async = true;
    s1.src = "https://embed.tawk.to/" + propertyId + "/" + widgetId;
    s1.charset = "UTF-8";
    s1.setAttribute("crossorigin", "*");
    s0.parentNode.insertBefore(s1, s0);
  })();
})
</script>

<style>

</style>
