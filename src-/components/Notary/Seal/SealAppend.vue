<template>
  <div v-show="!prints.CompanySeal">
    <p class="text-center"><i>Kindly create your seal</i></p>
    <button type="button" @click="createSealModal = true" class="btn btn-sm btn-primary d-block ms-auto mt-2">
      <span>Create</span>
    </button>
  </div>

  <div v-show="prints.CompanySeal">
    <div class="row">
      <div class="col-md-4 ms-auto">
        <button @click="createSealModal = true" class="float-end btn btn-outline-secondary btn-sm waves-effect">
          <SealIcon />
          Manage
        </button>
      </div>
    </div>

    <p class="text-center fw-normal">Pick a seal to append</p>

    <div class="grid" style="min-height:200px">
      <div v-if="isSaved">
        <span class="spinner-border" role="status"></span>
      </div>
      <template v-else>
        <label v-for="(print, index) in prints.CompanySeal" :key="index" class="form-check-label border"
          :for="print.id">
          <div @click="
            getImgUrl({ category: print.category, type: print.type, print_id: print.id })
          ">
            <template v-if="print.user_id">
              <input type="radio" :name="print.id" v-model="selected" class="form-check-input tool_name" :id="print.id"
                :value="print.id" />
              <img :src="print.file" class="img-fluid" width="200" :alt="print.id" height="30" />
            </template>

            <template v-else>
              <p class="mt-3" v-if="index == prints.CompanySeal.length - 1">
                <i>Kindly create a signature!</i>
              </p>
            </template>
          </div>
        </label>
      </template>
    </div>

    <button type="button" class="btn btn-sm btn-primary d-block ms-auto mt-2" :disabled="!isDisabled"
      @click="uploadSeal">
      <span v-show="loading" class="spinner-border spinner-border-sm"></span>
      <span>Append</span>
    </button>
  </div>

  <ModalComp :show="createSealModal" :footer="false" :size="'modal-lg'" @close="createSealModal = false">
    <template #header>
      <h4 class="modal-title">Create seal</h4>
    </template>

    <template #body>
      <SealDigitalCreate @close="createSealModal = false" />
    </template>
  </ModalComp>
</template>

<script setup>
import SealDigitalCreate from "@/components/Notary/Seal/SealDigitalCreate.vue";
import ModalComp from "@/components/ModalComp.vue";
import SealIcon from "@/icons/SealIcon.vue"

import { ref, defineEmits } from "vue";
import { useGetters } from "vuex-composition-helpers/dist";

const { prints, isSaved } = useGetters({
  prints: "print/prints",
  isSaved: "print/isSaved",
});

const createSealModal = ref(false);
const isDisabled = ref(false);
const loading = ref(false);
const selected = ref("");
const printId = ref("");

const toolClass = ref("");
const category = ref("");
const type = ref("");
const getImgUrl = (params) => {
  isDisabled.value = true;
  category.value = params.category;
  type.value = params.type;
  printId.value = params.print_id;
  toolClass.value = "tool-box main-element";
};

const emit = defineEmits(["selectedSeal"]);
const uploadSeal = () => {
  const uploadFile = {
    append_print_id: printId.value,
    tool_class: toolClass.value,
    category: category.value,
    type: type.value,
    tool_name: "Seal",
    tool_width: "100",
    tool_height: "100",
  };

  emit("selectedSeal", uploadFile);
  emit("close", true);

  isDisabled.value = false;
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 500);
};
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: 1fr;
  place-items: center;
  gap: 20px;
}

[type="radio"] {
  position: absolute;
  opacity: 0;
}

[type="radio"]+img {
  cursor: pointer;
  margin-right: 0.5rem;
}

[type="radio"]+img:hover {
  outline: 0.5px solid #003bb3;
}

[type="radio"]:checked+img {
  outline: 2px solid #003bb3;
}
</style>
