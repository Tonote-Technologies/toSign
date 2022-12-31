<template>
  <p>MAX FILE SIZE: 2MB</p>
  <p class="text-danger">{{ fileValidated }}</p>
  <div class="d-flex flex-column justify-content-between align-items-center" style="height: 400px">
    <template v-if="!isUpload">
      <DropZone @drop.prevent="drop" @change="selectedFile">
        <template #format> PNG, JPEG OR JPG </template>
        <template #input>
          <input type="file" id="dropzoneFile" class="dropzoneFile" accept="image/png, image/jpg, image/jpeg" />
        </template>
      </DropZone>
    </template>
    <template v-else>
      <div class="d-flex justify-content-center align-items-center my-2" style="min-height: 200px">
        <div class="position-relative">
          <img :src="base64Url" class="img-fluid d-block" width="100" height="100%" alt="preview" />
          <div class="position-absolute top-0 start-100 translate-middle">
            <button class="btn-close bg-danger rounded-circle" v-show="isUpload" @click="isUpload = !isUpload"
              style="padding: 10px"></button>
          </div>
        </div>
      </div>
    </template>
    <button class="btn btn-primary d-block ms-auto mt-2" :class="{ disabled: isUpload == true ? false : true }"
      @click="uploadSignature">
      Create
    </button>
  </div>
</template>

<script setup>
import { ref, defineEmits } from "vue";
import DropZone from "@/components/DropZone.vue";
import { createNamespacedHelpers } from "vuex-composition-helpers/dist";
const { useActions } = createNamespacedHelpers(["print"]);
// const { prints } = useGetters(["prints"]);
const { savePrint } = useActions(["savePrint"]);

const isSelected = ref(false);
const isUpload = ref(false);
const dropzoneFile = ref("");
const fileValidated = ref("");
const base64Url = ref("");

function preparedFile(file) {
  let reader = new FileReader();
  reader.onloadend = () => {
    base64Url.value = reader.result;
  };

  reader.readAsDataURL(file);

  isSelected.value = true;
}
const drop = (e) => {
  isUpload.value = true;
  let dropFiles = (dropzoneFile.value = e.dataTransfer.files[0]);
  const fileSize = dropFiles.size;
  const fileMb = fileSize / 1024 ** 2;
  if (fileMb >= 2) {
    isUpload.value = false
    fileValidated.value = "Please upload a signature less than 2MB."
    setTimeout(() => { isSelected.value = false }, 100);
  }
  preparedFile(dropFiles);
};

const selectedFile = () => {
  isUpload.value = true;
  let dropFiles = (dropzoneFile.value = document.querySelector(".dropzoneFile").files[0]);
  const fileSize = dropFiles.size;
  const fileMb = fileSize / 1024 ** 2;
  if (fileMb >= 2) {
    isUpload.value = false
    fileValidated.value = "Please upload a signature less than 2MB."
    setTimeout(() => { isSelected.value = false }, 100);
  }
  preparedFile(dropFiles);
};

const emit = defineEmits(["close"]);
const uploadSignature = () => {
  isUpload.value = false;
  const signatureObj = {
    file: base64Url.value,
    type: "Signature",
    category: "Upload",
  };
  savePrint(signatureObj);
  emit("close", true);
};
</script>

<style scoped>

</style>
