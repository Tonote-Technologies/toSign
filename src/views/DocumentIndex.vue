<template>
  <div class="horizontal-layout horizontal-menu 1-column navbar-floating footer-static" data-open="hover"
    data-menu="horizontal-menu" data-col="1-column">
    <TheHeader />

    <div class="app-content content email-application">
      <div class="content-overlay"></div>
      <div class="header-navbar shadow-lg"></div>

      <div class="content-wrapper container-xxl p-0">
        <div class="content-body">
          <router-view v-slot="{ Component }">
            <transition-page>
              <component :is="Component" />
            </transition-page>
          </router-view>
        </div>
      </div>
    </div>

    <TheFooter />
  </div>
</template>

<script setup>
import TheHeader from "@/layout/Header/TheHeader.vue";
import TheFooter from "@/layout/Footer/TheFooter.vue";
</script>

<style>
.table> :not(caption)>* {
  padding: 0.72rem 1rem;
}

.table-bordered> :not(caption) * {
  border-width: 1px;
}

.btn:focus,
.btn-outline-primary:focus {
  outline: none !important;
  box-shadow: none !important;
}

.form-control-sm {
  padding: 0.188rem 0.857rem !important;
}

.btn-group-sm>.btn,
.btn-sm {
  padding: 0.486rem 1rem !important;
}

@media screen and (max-width: 800px) {
  html [data-col='1-column'].horizontal-layout .app-content {
    padding: calc(2rem + 6.45rem + 1.3rem) 1rem 0 !important;
  }
}
</style>
