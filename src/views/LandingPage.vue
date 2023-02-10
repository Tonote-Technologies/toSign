<template>
  <div class="pace-done vertical-layout navbar-floating footer-static" :class="[
    ['md','xs'].includes(type) ? 'vertical-overlay-menu' : 'menu-expanded vertical-menu-modern',
    dashboard.isOpened ? 'menu-open' : 'menu-hide',
  ]">
    <DashboardHeader />

    <DashboardNav />

    <DashboardContent />

    <div class="sidenav-overlay" :class="{ show: dashboard.isOpened }" @click="dashboard.setIsOpened(false)"></div>
  </div>
</template>

<script setup>
import DashboardNav from "@/components/Document/Dashboard/DashboardNav.vue";
import DashboardHeader from "@/components/Document/Dashboard/DashboardHeader.vue";
import DashboardContent from "@/components/Document/Dashboard/DashboardContent.vue";
import { dashboard } from "@/store/dashboard";

import { computed, onMounted, onUnmounted, ref } from "vue";

function useBreakpoints() {
  let windowWidth = ref(window.innerWidth);

  const onWidthChange = () => (windowWidth.value = window.innerWidth);
  onMounted(() => {
    window.addEventListener("resize", onWidthChange)
    setTimeout(() => {
      if (window.Tawk_API) {
        window.Tawk_API.showWidget();
      }
    }, 500);
  });
  onUnmounted(() => window.removeEventListener("resize", onWidthChange));

  const type = computed(() => {
    if (windowWidth.value < 550) return "xs";
    if (windowWidth.value >= 550 && windowWidth.value < 1200) return "md";
    if (windowWidth.value >= 1200) return "lg";
    return null;
  });

  const width = computed(() => windowWidth.value);

  return { width, type };
}

const { type } = useBreakpoints();
</script>

<style scoped>
@import "@/assets/css/vertical-menu.min.css";
</style>