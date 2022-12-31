<template>
  <div v-if="environment == 'development'">
    <LoginUsers />
  </div>
  <div v-else>
    <div v-if="isLoading" class="grid">
      <PreLoader />
    </div>
  </div>
</template>

<script setup>
import PreLoader from "@/components/PreLoader.vue";
import LoginUsers from "@/components/LoginUsers.vue";
import { dashboard } from "@/store/dashboard";

import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

import { useActions } from "vuex-composition-helpers/dist";

const { setAuthentication } = useActions({
  setAuthentication: "auth/setAuthentication",
});

const route = useRouter();
const uri = ref("");
const token = ref("");
const status = ref("");
const documentId = ref("");
const environment = ref('')
const isLoading = ref(true)

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 1000);

  uri.value = route.currentRoute.value.query;
  token.value = uri.value.qt;
  documentId.value = uri.value.di;

  dashboard.value.setToken(token.value);

  (uri.value.status != undefined || uri.value.status != "") ? status.value = uri.value.status : status.value = "";

  environment.value = process.env.NODE_ENV

  if (environment.value == 'development') return

  if (token.value == undefined)
    return (window.location.href = process.env.VUE_APP_URL_WEBSITE);

  setAuthentication({ token: token.value, status: status.value, documentId: documentId.value });
});
</script>

<style scoped>
.grid {
  display: grid;
  place-items: center;
  height: 100vh;
}
</style>
