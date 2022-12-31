<template>
  <footer class="footer footer-static footer-light text-center">
    <p class="clearfix mb-0 ">
      <span class="float-md-center d-block d-md-inline-block mt-25">
        COPYRIGHT &copy; {{ new Date().getFullYear() }}
        <a class="ms-25" href="https://www.gettonote.com" target="_blank">ToNote Technologies Limited</a>
        <span class=" d-sm-inline-block">, All rights Reserved.</span>
      </span>
    </p>
  </footer>
  <button class="btn btn-primary btn-icon scroll-top waves-effect waves-float waves-light" @click="toTop" type="button"
    style="display: inline-block">
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-up">
      <line x1="12" y1="19" x2="12" y2="5"></line>
      <polyline points="5 12 12 5 19 12"></polyline>
    </svg>
  </button>
</template>

<script setup>
const toTop = function () {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}
</script>

<style scoped>
.scroll-top {
  bottom: 20%;
}
</style>
