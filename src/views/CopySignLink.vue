<template>
  <div class="grid" v-if="loading">
    <PreLoader />
  </div>
</template>

<script setup>
import PreLoader from "@/components/PreLoader.vue";

import { ref, onMounted, watch } from "vue";

import { useActions, useGetters } from "vuex-composition-helpers/dist";
import { useRouter } from "vue-router";

const route = useRouter();

const { link } = useGetters({
  link: "signLink/link",
});

const { clearToken, getPublicLink } = useActions({
  clearToken: "auth/clearToken",
  getPublicLink: "signLink/getPublicLink",
});

const newInstanceId = ref('')
watch(
  () => link.value,
  (newLink) => {
    if (newLink) {
      newInstanceId.value = newLink.id
      route.push({ name: 'Link', params: { document_id: newInstanceId.value } })
    } else {
      window.location.href = redirectToWebsite.value;
    }
  }
);

const redirectToWebsite = ref("");
const loading = ref(true);
const uri = ref("");

onMounted(() => {
  clearToken()

  redirectToWebsite.value = process.env.VUE_APP_URL_WEBSITE;
  uri.value = route.currentRoute.value.params.document_id;
  getPublicLink(uri.value);

  setTimeout(() => {
    if (window.Tawk_API) {
      window.Tawk_API.hideWidget();
    }
  }, 2000);
});

// onUnmounted(() => {
// });
</script>

<style scoped>
.grid {
  display: grid;
  place-items: center;
  height: 95vh;
}
</style>
