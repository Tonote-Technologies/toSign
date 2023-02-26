<template>
  <!-- <p class="text-center fst-italic">Kindly create your signature(s)</p> -->
  <div v-for="(participant, index) in userDocument.participants" :key="index">
    <div class="grid">
      <label
        v-for="(print, index) in participant.user.prints.Seal"
        :key="index"
        class="form-check-label border"
        :for="print.id"
      >
        <div @click="getImgUrl({ category: 'Upload', print_id: print.id })">
          <template v-if="participant.user.id === print.user_id">
            <input
              type="radio"
              :name="print.id"
              v-model="selected"
              class="form-check-input tool_name"
              :id="print.id"
              :value="print.id"
            />
            <img
              :src="print.file"
              class="img-fluid"
              width="200"
              :alt="print.id"
              height="30"
            />
          </template>

          <template v-else>
            <p class="mt-3" v-if="index == participant.user.prints.Seal.length - 1">
              <i>Kindly create a signature!</i>
            </p>
          </template>
        </div>
      </label>
    </div>
  </div>

  <button
    type="button"
    class="btn btn-sm btn-primary d-block ms-auto mt-2"
    :disabled="loading"
    @click="uploadSeal"
  >
    <span v-show="loading" class="spinner-border spinner-border-sm"></span>
    <span>Append</span>
  </button>
</template>

<script setup>
import { ref, defineEmits } from "vue";
import { createNamespacedHelpers } from "vuex-composition-helpers/dist";

const { useGetters } = createNamespacedHelpers("document");

const { userDocument } = useGetters(["userDocument"]);

const loading = ref(false);
const selected = ref("");
// const imgUrl = ref('');
const printId = ref("");

// const selectedValue = computed(() => selected.value);
// selectedValue.value

const toolClass = ref("");
const getImgUrl = (params) => {
  printId.value = params.print_id;
  toolClass.value = "tool-box main-element";
};

const emit = defineEmits(["selectedSeal"]);
const uploadSeal = () => {
  const uploadFile = {
    append_print_id: printId.value,
    tool_class: toolClass.value,
  };

  emit("selectedSeal", uploadFile);

  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 1000);
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

[type="radio"] + img {
  cursor: pointer;
  margin-right: 0.5rem;
}

[type="radio"] + img:hover {
  outline: 0.5px solid #003bb3;
}

[type="radio"]:checked + img {
  outline: 2px solid #003bb3;
}
</style>
