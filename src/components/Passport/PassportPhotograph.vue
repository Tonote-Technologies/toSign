<template>
  <div v-if="appendPass === true">
    <div class="d-flex justify-content-between align-items-center flex-column mt-2" style="height: 35vh">
      <div class="grid grid__3">
        <div class="w-100">
          <label v-for="(print, index) in prints" :key="index" class="form-check-label border position-relative"
            :for="print.category">
            <div v-if="print.type === 'Photograph'" @click="
              getPrintId({ file: print.file, category: print.category, type: print.type })
            ">
              <input type="radio" :name="print.category" v-model="selected" class="form-check-input tool_name"
                :id="print.category" :value="print.category" />
              <img :src="print.file" class="img-fluid" :alt="print.category" />

              <span @click="deletePrint(index)"
                class="btn-outline-danger position-absolute top-0 start-100 translate-middle"
                style="padding:1px 4px">&cross;</span>
            </div>
          </label>
        </div>
      </div>

      <div class="modal-footer w-100">
        <button class="btn btn-secondary" @click="appendPass = false">close</button>
        <button type="button" class="btn btn-primary d-block ms-auto" :class="{ disabled: !isSelected }"
          @click="affixPassport">
          <span v-show="isLoading" class="spinner-border spinner-border-sm"></span>
          <span>Append</span>
        </button>
      </div>
    </div>
  </div>
  <div v-else>
    <TopTabWrapper>
      <TopTabList title="Select">
        <div class="d-flex justify-content-between align-items-center flex-column" style="min-height: 18rem">
          <template v-if="prints.length > 0">
            <div v-for="(print, index) in prints" :key="index">
              <label v-if="print.type === 'Photograph'" class="form-check-label border position-relative"
                :for="print.category">
                <div @click="
                  getPrintId({ file: print.file, category: print.category, type: print.type })
                ">
                  <input type="radio" :name="print.category" v-model="selected" class="form-check-input tool_name"
                    :id="print.category" :value="print.category" />
                  <img :src="print.file" class="img-fluid" :alt="print.category" />

                  <span @click="deletePrint(index)"
                    class="btn-outline-danger position-absolute top-0 start-100 translate-middle"
                    style="padding:1px 4px">&cross;</span>
                </div>
              </label>
            </div>
          </template>
          <template v-else>
            <p class="grid grid__1 text-center" style="height: 20vh">
              <i>kindly create a passport photograph!</i>
            </p>
          </template>

          <div class="modal-footer justify-content-center w-100 mt-2 pb-0">
            <button type="button" class="btn btn-sm btn-primary" :class="{ disabled: !isSelected }"
              @click="affixPassport">
              <span v-show="isLoading" class="spinner-border spinner-border-sm"></span>
              <span>Append</span>
            </button>
          </div>
        </div>
      </TopTabList>

      <TopTabList title="Upload">
        <template v-if="!isUpload">
          <p>MAX FILE SIZE: 2MB</p>
          <p class="text-danger">{{ fileValidated }}</p>
          <DropZone @drop.prevent="drop" @change="selectedFile">
            <template #format> PNG, JPEG OR JPG </template>
            <template #input>
              <input type="file" id="dropzoneFile" class="dropzoneFile" accept="image/png, image/jpg, image/jpeg" />
            </template>
          </DropZone>
        </template>
        <template v-else>
          <div class="d-flex justify-content-center align-items-center my-2">
            <div class="grid grid__1 w-100">
              <div class="position-relative">
                <div class="grid grid__2">
                  <cropper ref="cropped" :src="preview" @change="change" style="width:200px" />
                  <img :src="croppedData" class="img-fluid d-block p-1" style="width:200px" alt="Photograph" />
                </div>
                <div class="position-absolute top-0 start-100 translate-middle">
                  <button class="btn-close bg-danger rounded-circle" v-show="isUpload" @click="isUpload = !isUpload"
                    style="padding: 10px"></button>
                </div>
              </div>
            </div>
          </div>
        </template>

        <button type="button" class="btn btn-sm btn-primary d-block ms-auto mt-2" :class="{ disabled: !isSelected }"
          @click="uploadPhotograph">
          <span v-show="loading" class="spinner-border spinner-border-sm"></span>
          <span>Upload</span>
        </button>
      </TopTabList>

      <TopTabList title="Take picture">
        <div class="app">
          <div class="text-center">
            <button type="button" class="btn btn-sm mb-2"
              :class="{ 'btn-primary': !isCameraOpen, 'btn-danger': isCameraOpen }" @click="toggleCamera">
              <span v-if="!isCameraOpen">Open Camera</span>
              <span v-else>Close Camera</span>
            </button>
          </div>

          <PassportCamera v-if="isCameraOpen" @close="closeSnap" @getFile="getPrintId" @affix="affixPassport" />
        </div>
      </TopTabList>
    </TopTabWrapper>
  </div>

  <ModalComp :show="isDelete" :size="'modal-sm'" @close="isDelete = false">
    <template #header>
      <h4 class="modal-title text-danger">
        <Icon icon="eva:alert-triangle-outline" style="margin-bottom: 3px" />
        Alert
      </h4>
    </template>

    <template #body>
      <h5 class="text-center">Are you sure?</h5>
      <p class="fw-normal text-center"><i>You won't be able to revert this!</i></p>
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
import DropZone from "@/components/DropZone.vue";
import { Cropper } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";
import PassportCamera from "@/components/Passport/PassportCamera.vue";
import TopTabList from "@/components/Tab/TabTopNav/TopTabList.vue";
import TopTabWrapper from "@/components/Tab/TabTopNav/TopTabWrapper.vue";
import ModalComp from "@/components/ModalComp.vue";

import { ref, defineEmits } from "vue";
import { useActions, useGetters } from "vuex-composition-helpers/dist";

const { prints } = useGetters({
  prints: "printSignLink/prints",
});

const { savePrint, removePrint } = useActions({
  savePrint: "printSignLink/savePrint",
  removePrint: "printSignLink/removePrint",
});

const dropzoneFile = ref("");
const preview = ref(null);
const fileValidated = ref("");
const isSelected = ref(false);
const appendPass = ref(false);
const isUpload = ref(false);
const isLoading = ref(false);
const loading = ref(false);
const isDelete = ref(false);
const printId = ref("");
const theFile = ref("");
const selectedTitle = ref(false);
const isCameraOpen = ref(false);

const croppedData = ref("");
const change = ({ canvas }) => {
  croppedData.value = canvas.toDataURL();
}

const preparedFile = (file) => {
  let reader = new FileReader();

  reader.onloadend = () => {
    preview.value = reader.result;
  };

  reader.readAsDataURL(file);
  isSelected.value = true;
};

const drop = (e) => {
  isUpload.value = true;
  let dropFiles = (dropzoneFile.value = e.dataTransfer.files[0]);
  const fileSize = dropFiles.size;
  const fileMb = fileSize / 1024 ** 2;
  if (fileMb >= 2) {
    isUpload.value = false
    fileValidated.value = "Please select a file less than 2MB."
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
    fileValidated.value = "Please select a file less than 2MB."
    setTimeout(() => { isSelected.value = false }, 100);
  }

  preparedFile(dropFiles);
};

const closeSnap = () => {
  emit("close", true);
};

const emit = defineEmits(["close"]);
const uploadPhotograph = () => {
  isUpload.value = false;
  const uploadPassport = {
    file: preview.value,
    type: "Photograph",
    category: "Passport",
  };

  savePrint(uploadPassport);
  selectedTitle.value = true;
  // closeSnap()

  loading.value = true;
  isSelected.value = false;

  setTimeout(() => {
    loading.value = false;
    appendPass.value = true;
  }, 1000);
};

const deletePrint = (params) => {
  removePrint(params)
}

const getPrintId = (params) => {
  isSelected.value = true;
  theFile.value = params.file;
};

const toggleCamera = () => {
  isCameraOpen.value = !isCameraOpen.value
};

const affixPassport = () => {

  const uploadPassport = { tool_name: 'Photo', value: theFile.value, };

  emit("selectedPassport", uploadPassport);

  isLoading.value = true;
  isSelected.value = false;
  setTimeout(() => {
    isLoading.value = false;
  }, 1000);
};

// const fromSnap = (params) => {
//   const uploadPassport = { append_print_id: params.append_print_id };

//   emit("selectedPassport", uploadPassport);

//   loading.value = true;
//   setTimeout(() => { loading.value = false }, 1000);
// };

const proceedToDelete = () => {
  isLoading.value = false;
  loading.value = true;
  removePrint(printId.value);

  setTimeout(() => {
    isDelete.value = false;
    loading.value = false;
  }, 1000);
};
</script>

<style scoped>
.app {
  width: 100%;
  min-height: 33vh;
  display: grid;
  place-items: center;
}

.grid {
  display: grid;
  place-items: center;
  gap: 10px;
}

.grid__3 {
  grid-template-columns: repeat(6, 1fr);
}

.grid__1 {
  grid-template-columns: 1fr;
}

.grid__2 {
  grid-template-columns: 1fr 1fr;
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
  outline: 3px solid #003bb3;
}

.delete {
  position: absolute;
  top: -14px;
  right: -14px;
  border-radius: 50%;
  border: 1px solid red;
  padding: 8px;
}

@media screen and (max-width: 991.5px) {
  .grid__3 {
    grid-template-columns: repeat(3, 1fr);
  }

  .grid__2 {
    grid-template-columns: 1fr;
  }
}
</style>
