<template>
  <div v-show="!prints.Initial">
    <p class="text-center"><i>Kindly create your initial signature(s)</i></p>
    <button type="button" @click="createSignatureModal = true" class="btn btn-sm btn-primary d-block ms-auto mt-2">
      <span>Create</span>
    </button>
  </div>

  <div v-show="prints.Initial">
    <p class="text-center fw-normal">Pick an initial signature to append</p>
    <div class="grid">
      <label v-for="(print, index) in prints.Initial" :key="index" class="form-check-label border" :for="print.id">
        <div @click="
          getImgUrl({ category: print.category, type: print.type, print_id: print.id })
        ">
          <template v-if="print.user_id">
            <input type="radio" :name="print.id" v-model="selected" class="form-check-input tool_name" :id="print.id"
              :value="print.id" />
            <img :src="print.file" class="img-fluid" width="200" :alt="print.id" height="30" />
          </template>
        </div>
      </label>
    </div>

    <button type="button" class="btn btn-sm btn-primary d-block ms-auto mt-2" :disabled="!isDisabled"
      @click="uploadSignature">
      <span v-show="loading" class="spinner-border spinner-border-sm"></span>
      <span>Append</span>
    </button>
  </div>

  <ModalComp :show="createSignatureModal" :footer="false" :size="'modal-md'" @close="createSignatureModal = false">
    <template #header>
      <h4 class="modal-title">Create your initial signature</h4>
    </template>

    <template #body>
      <div class="row">
        <div class="col-md-12">
          <SignatureSelectInitial @close="createSignatureModal = false" />
          <p>
            By clicking create, I agree that all signatures, marks or initials created
            here are as valid as my hand written signature to the extent allowed by law.
          </p>
        </div>
      </div>
    </template>
  </ModalComp>
</template>

<script setup>
import ModalComp from "@/components/ModalComp.vue";
import SignatureSelectInitial from "@/components/Signature/SignatureSelectInitial.vue";

import { ref, defineEmits, watch } from "vue";
import { createNamespacedHelpers } from "vuex-composition-helpers/dist";
const { useGetters } = createNamespacedHelpers("print");

const { prints } = useGetters(["prints"]);

const createSignatureModal = ref(false);
const loading = ref(false);
const isDisabled = ref(false);
const selected = ref("");
const printId = ref("");

watch(
  () => prints.value,
  (newValue) => {
    prints.value = newValue;
  }
);

const toolClass = ref("");
const category = ref("");
const type = ref("");
const getImgUrl = (params) => {
  category.value = params.category;
  type.value = params.type;
  printId.value = params.print_id;
  toolClass.value = "tool-box main-element";
  isDisabled.value = true;
};

const emit = defineEmits(["selectedSignature"]);
const uploadSignature = () => {
  const uploadFile = {
    append_print_id: printId.value,
    tool_class: toolClass.value,
    category: category.value,
    type: type.value,
    tool_name: "Initial",
    tool_width: "95",
    tool_height: "53",
  };

  emit("selectedSignature", uploadFile);
  emit("closeModal", true);

  loading.value = true;
  isDisabled.value = false;
  setTimeout(() => (loading.value = false), 500);
};
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
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
