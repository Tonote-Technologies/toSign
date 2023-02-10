<template>
  <div class="grid">
    <div v-for="(print, index) in prints.CompanyStamp" :key="index" class="border" :for="print.id">
      <template v-if="print.user_id">
        <div class="position-relative">
          <img :src="print.file" class="img-fluid" style="width: 400px; height: 140px" :alt="print.id" />
          <a role="button" @click="deleteStamp(print.id)" class="text-danger btn-close d-block text-end delete"></a>
        </div>
      </template>

      <template v-else>
        <p class="mt-3" v-if="index == prints.Seal.length - 1">
          <i>Kindly create a stamp!</i>
        </p>
      </template>
    </div>
  </div>

  <ModalComp :show="isDelete" :size="'modal-sm'" @close="isDelete = false">
    <template #header>
      <h4 class="modal-title text-danger mb-0">
        <Icon icon="eva:alert-triangle-outline" style="margin-bottom: 3px" />
        Alert
      </h4>
    </template>

    <template #body>
      <h3 class="text-center">Are you sure?</h3>
      <p class="text-center"><i>You won't be able to revert this!</i></p>
    </template>

    <template #footer>
      <button type="button" class="btn btn-sm btn-primary d-block ms-auto" :class="{ disabled: loading }"
        @click="proceedToDelete">
        <span v-show="loading" class="spinner-border spinner-border-sm"></span>
        <span>Proceed</span>
      </button>
    </template>
  </ModalComp>
</template>

<script setup>
import { Icon } from "@iconify/vue";
import { ref } from "vue";
import { createNamespacedHelpers } from "vuex-composition-helpers/dist";
import ModalComp from "@/components/ModalComp.vue";

const { useGetters, useActions } = createNamespacedHelpers("print");

const { prints } = useGetters(["prints"]);
const { removePrint } = useActions(["removePrint"]);

const loading = ref(false);
const isDelete = ref(false);
const printId = ref("");

const deleteStamp = (params) => {
  isDelete.value = true;
  printId.value = params;
};

const proceedToDelete = () => {
  loading.value = true;
  removePrint(printId.value);

  setTimeout(() => {
    isDelete.value = false;
    loading.value = false;
  }, 1000);
};
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: 1fr;
  place-items: center;
  gap: 20px;
}

.delete {
  position: absolute;
  top: -14px;
  right: -14px;
  border-radius: 50%;
  border: 1px solid red;
  padding: 8px;
}
</style>
