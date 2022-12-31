<template>
  <div class="grid">
    <template v-if="isEncrypting">
      <div class="text-dark custom-position">
        Encrypting
        <div class="lds-ellipsis">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </template>
    <template v-else>
      <h3 class="text-dark">Done</h3>
    </template>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { createNamespacedHelpers } from "vuex-composition-helpers/dist";
import { useRouter } from "vue-router";

const route = useRouter();

const { useGetters } = createNamespacedHelpers(["signLink"]);

const { link } = useGetters(["link"]);

const isEncrypting = ref(true);

setTimeout(() => {
  isEncrypting.value = false;
  route.push({ name: "document.edit", params: { document_id: link.value.id } });
}, 2000);
</script>

<style scoped>
.grid {
  display: grid;
  place-items: center;
  height: 80vh;
}

.custom-position {
  font-weight: bolder;
  font-size: 1.5rem;
}

.lds-ellipsis {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 5px;
}

.lds-ellipsis div {
  position: absolute;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: #000;
  animation-timing-function: cubic-bezier(0, 1, 1, 0);
}

.lds-ellipsis div:nth-child(1) {
  left: 8px;
  animation: lds-ellipsis1 0.6s infinite;
}

.lds-ellipsis div:nth-child(2) {
  left: 8px;
  animation: lds-ellipsis2 0.6s infinite;
}

.lds-ellipsis div:nth-child(3) {
  left: 32px;
  animation: lds-ellipsis2 0.6s infinite;
}

.lds-ellipsis div:nth-child(4) {
  left: 56px;
  animation: lds-ellipsis3 0.6s infinite;
}

@keyframes lds-ellipsis1 {
  0% {
    transform: scale(0);
  }

  100% {
    transform: scale(1);
  }
}

@keyframes lds-ellipsis3 {
  0% {
    transform: scale(1);
  }

  100% {
    transform: scale(0);
  }
}

@keyframes lds-ellipsis2 {
  0% {
    transform: translate(0, 0);
  }

  100% {
    transform: translate(24px, 0);
  }
}

@media screen and (max-width: 991.5px) {
  .grid {
    height: 65vh;
  }

  .custom-position {
    font-size: 1.25rem;
  }
}
</style>
