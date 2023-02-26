<template>
  <div class="grid">
    <div>
      <img src="@/assets/error.png" width="150" alt="Error" />
      <h1 class="fw-light my-4">
        Sorry, you can no longer access this document <br />
        as the document owner has revoked your access.
      </h1>
      <router-link :to="{ name: 'Dashboard' }" type="button" class="btn btn-sm btn-primary">
        &leftarrow; Back to home
      </router-link>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.grid {
  display: grid;
  place-items: center;
  height: 100vh !important;
  width: 100%;
  text-align: center;
}

@media screen and (max-width: 991.5px) {
  img {
    width: 100px;
  }

  h1 {
    font-size: 1rem;
  }

  .my-4 {
    margin: 1.5rem 0 !important;
  }
}
</style>
