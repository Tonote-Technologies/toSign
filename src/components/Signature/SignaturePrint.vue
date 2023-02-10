<template>
  <div v-show="!prints.Signature">
    <p class="text-center"><i>Kindly create your signature(s)</i></p>
    <button type="button" @click="createSignatureModal = true" class="btn btn-sm btn-primary d-block ms-auto mt-2">
      <span>Create</span>
    </button>
  </div>

  <div v-show="prints.Signature">
    <div class="grid">
      <div v-for="(print, index) in prints.Signature" :key="index">
        <img :src="print.file" class="img-fluid" width="200" :alt="print.id" height="30" />
      </div>

      <div v-for="(print, index) in prints.Initial" :key="index">
        <img :src="print.file" class="img-fluid" width="200" :alt="print.id" height="30" />
      </div>
    </div>
  </div>

  <ModalComp :show="createSignatureModal" :footer="false" @close="createSignatureModal = false">
    <template #header>
      <h4 class="modal-title">Create your signature</h4>
    </template>

    <template #body>
      <LeftTabWrapper>
        <LeftTabList title="Draw">
          <SignaturePad />
        </LeftTabList>

        <LeftTabList title="Select">
          <SignatureSelectFull />
        </LeftTabList>

        <LeftTabList title="Upload">
          <!-- <div class="row"> -->
          <div class="position-relative">
            <SignatureUpload />
          </div>
          <!-- </div> -->
        </LeftTabList>
      </LeftTabWrapper>
      <div class="row">
        <div class="col-md-10 ms-auto mt-2">
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
import LeftTabWrapper from "@/components/Tab/TabLeftNav/LeftTabWrapper.vue";
import LeftTabList from "@/components/Tab/TabLeftNav/LeftTabList.vue";
import SignaturePad from "@/components/Signature/SignaturePad.vue";
import SignatureSelectFull from "@/components/Signature/SignatureSelectFull.vue";
import SignatureUpload from "@/components/Signature/SignatureUpload.vue";

import { ref, watch } from "vue";
import { createNamespacedHelpers } from "vuex-composition-helpers/dist";
const { useGetters } = createNamespacedHelpers("print");

const { prints } = useGetters(["prints"]);

const createSignatureModal = ref(false);

watch(
  () => prints.value,
  (newValue) => {
    prints.value = newValue;
  }
);
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
