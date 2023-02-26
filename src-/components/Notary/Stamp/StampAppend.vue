<template>
  <div v-show="!prints.CompanyStamp">
    <p class="text-center"><i>Kindly create your stamp</i></p>
    <button type="button" @click="createStampModal = true" class="btn btn-sm btn-primary d-block ms-auto mt-2">
      <span>Create</span>
    </button>
  </div>

  <div v-show="prints.CompanyStamp">
    <div class="row">
      <div class="col-md-4 ms-auto">
        <button @click="createStampModal = true" class="float-end btn btn-outline-secondary btn-sm waves-effect">
          <StampIcon />
          Manage
        </button>
      </div>
    </div>

    <p class="text-center fw-normal">Pick a stamp to append</p>

    <div class="grid" style="min-height:200px">
      <div v-if="isSaved">
        <span class="spinner-border" role="status"></span>
      </div>
      <template v-else>
        <label v-for="(print, index) in prints.CompanyStamp" :key="index" class="form-check-label border"
          :for="print.id">
          <div @click="
            getPrintId({ category: print.category, type: print.type, print_id: print.id })
          ">
            <template v-if="print.user_id">
              <input type="radio" :name="print.id" v-model="selected" class="form-check-input tool_name" :id="print.id"
                :value="print.id" />
              <img :src="print.file" data-stamp="stamp" class="img-fluid" :alt="print.id" />
            </template>

            <template v-else>
              <p class="mt-3" v-if="index == prints.CompanyStamp.length - 1">
                <i>Kindly create a stamp!</i>
              </p>
            </template>
          </div>
        </label>
      </template>
    </div>

    <button type="button" class="btn btn-sm btn-primary d-block ms-auto mt-2" :disabled="!isDisabled"
      @click="uploadStamp">
      <span v-show="loading" class="spinner-border spinner-border-sm"></span>
      <span>Append</span>
    </button>
  </div>

  <ModalComp :show="createStampModal" :footer="false" :size="'modal-md'" @close="createStampModal = false">
    <template #header>
      <h4 class="modal-title">Create stamp</h4>
    </template>

    <template #body>
      <StampCreate @close="createStampModal = false" />
    </template>
  </ModalComp>
</template>

<script setup>
import { ref, defineEmits } from "vue";
import StampCreate from "@/components/Notary/Stamp/StampCreate.vue";
import ModalComp from "@/components/ModalComp.vue";
import StampIcon from "@/icons/StampIcon.vue"

import { useGetters } from "vuex-composition-helpers/dist";

const { prints, isSaved } = useGetters({
  prints: "print/prints",
  isSaved: "print/isSaved",
});

const createStampModal = ref(false);
const isDisabled = ref(false);
const loading = ref(false);
const selected = ref("");
const printId = ref("");

const toolClass = ref("");
const category = ref("");
const type = ref("");
const getPrintId = (params) => {
  isDisabled.value = true;
  category.value = params.category;
  type.value = params.type;
  printId.value = params.print_id;
  toolClass.value = "tool-box main-element";
};

const emit = defineEmits(["selectedStamp"]);
const uploadStamp = () => {
  const stampObj = {
    append_print_id: printId.value,
    tool_class: toolClass.value,
    category: category.value,
    type: type.value,
    tool_name: "Stamp",
    tool_width: "330",
    tool_height: "120",
  };

  emit("selectedStamp", stampObj);
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
