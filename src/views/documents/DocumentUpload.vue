<template>
  <div class="grid" v-if="isLoading === true">
    <PreLoader />
  </div>

  <section class="container-fluid" v-else>
    <div class="email-header-left d-flex align-items-center mb-2 fw-bold" style="font-size: 1rem">
      <router-link :to="{ name: 'Document' }" role="button" @click="$router.go(-1)" class="back">
        <span class="go-back me-1 float-start">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            class="feather feather-chevron-left font-medium-4">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </span>
        <span class="email-subject mb-0 float-start">Back</span>
      </router-link>
      <span>Sign a Document</span>
    </div>

    <div class="grid" v-show="isSubmitted">
      <PreLoader />
    </div>
    <div v-show="!isSubmitted">
      <Form @submit="onProceed" :validation-schema="schema" v-slot="{ errors }">
        <div class="card">
          <div class="card-body">
            <div class="form-group mb-2">
              <div class="form-group">
                <label>Document title</label>
                <Field name="title" type="text" class="form-control" :class="{ 'is-invalid': errors.title }"
                  placeholder="Enter document title" v-model="title" required />
                <div class="invalid-feedback">{{ errors.title }}</div>
              </div>
            </div>

            <template v-if="!initialUpload">
              <DropZone @drop.prevent="drop" @change="selectedFile($event, true)">
                <template #format>Upload PDF</template>
                <template #input>
                  <input type="file" id="dropzoneFile" multiple class="dropzoneFile" accept=".pdf" />
                </template>
              </DropZone>
            </template>
            <template v-else>
              <label for="choose" class="btn btn-primary">
                <input type="file" id="choose" @change="selectedFile($event, true)" multiple accept=".pdf" />
                Upload more
              </label>
            </template>
          </div>
        </div>

        <div class="card mb-1 mb-0 shadow-none border" v-for="(prev, index) in previewFile" :key="index">
          <div class="p-2">
            <div class="row align-items-center">
              <div class="col-auto">
                <img data-dz-thumbnail src="@/assets/default.png" class="avatar-sm rounded bg-light" :alt="prev" />
              </div>

              <div class="col ps-0">
                <a href="javascript:void(0)" class="text-muted fw-bold" data-dz-name></a>
                <p class="mb-0" data-dz-size>{{ prev }}</p>
              </div>

              <div class="col-auto">
                <a role="button" class="btn btn-sm btn-outline-danger ds-remove filed" data-id="#document_id"
                  data-name="fileName" @click="removeItem(index)">
                  X
                </a>
              </div>
            </div>
          </div>
        </div>

        <div class="card mb-2 p-2">
          <button type="submit" class="btn btn-sm btn-primary d-block ms-auto" :class="{ disabled: !isSelected }">
            Proceed
          </button>
        </div>
      </Form>
    </div>
  </section>
</template>

<script setup>
import PreLoader from "@/components/PreLoader.vue";
import DropZone from "@/components/DropZone.vue";
import { Form, Field } from "vee-validate";
import { dashboard } from "@/store/dashboard";

import { ref, toRaw, onMounted } from "vue";

import { useRouter } from "vue-router";

import { useActions, useGetters } from "vuex-composition-helpers/dist";

const { token } = useGetters({ token: "auth/token" });

const { setAuthForDocumentUpload, fileUploads, getUserPrints } = useActions({
  setAuthForDocumentUpload: "auth/setAuthForDocumentUpload",
  fileUploads: "signLink/fileUploads",
  getUserPrints: "print/getUserPrints",
});

const initialUpload = ref(false);
const isSubmitted = ref(false);
const isSelected = ref(false);
const dropzoneFile = ref("");
const previewFile = ref([]);
const dataFile = ref([]);
const title = ref("");

dataFile.value = [];
previewFile.value = [];
const preparedFile = (files) => {
  for (let i = 0; i < files.length; i++) {
    let reader = new FileReader();
    const params = files[i];
    reader.onloadend = () => {
      dataFile.value.push(reader.result);
      previewFile.value.push(params.name);
    };
    reader.readAsDataURL(params);
  }

  isSelected.value = true;
};

const drop = (e) => {
  initialUpload.value = true;
  let dropFiles = (dropzoneFile.value = e.dataTransfer.files);
  title.value = dropzoneFile.value[0].name.split(".").slice(0, -1).join(".");
  preparedFile(dropFiles);
  isSelected.value = true;
};

const selectedFile = (e, init) => {
  initialUpload.value = init;
  let dropFiles = (dropzoneFile.value = e.target.files);
  title.value = dropFiles[0].name.split(".").slice(0, -1).join(".");
  preparedFile(dropFiles);
  isSelected.value = true;
};

const removeItem = (index) => {
  previewFile.value.splice(index, 1);
  dataFile.value.splice(index, 1);
  if (previewFile.value.length == 0) {
    title.value = "";
    initialUpload.value = isSelected.value = false;
  }
};

const onProceed = (params) => {
  isSubmitted.value = true;
  const uploadFile = {
    files: toRaw(dataFile.value),
    title: params.title,
  };

  fileUploads(uploadFile);
  dataFile.value = [];
  previewFile.value = [];
  setTimeout(() => {
    isSubmitted.value = false;
  }, 10000);
};

const route = useRouter();
const uri = ref("");
const isLoading = ref(true);
const hasToken = ref("");

onMounted(() => {
  uri.value = route.currentRoute.value.query;
  hasToken.value =
    uri.value.qt != undefined || uri.value.qt != null ? uri.value.qt : token.value;

  if (hasToken.value == undefined || hasToken.value == "" || hasToken.value == null) {
    return (window.location.href = process.env.VUE_APP_URL_AUTH_LIVE);
  }

  dashboard.value.setToken(hasToken.value);

  getUserPrints(hasToken.value);

  setAuthForDocumentUpload(hasToken.value);
  isLoading.value = false;
});
</script>

<style scoped>
.back {
  display: inline-block;
  width: 100px;
  border-right: 2px solid #ccc;
  margin-right: 1.5rem;
}

.grid {
  display: grid;
  place-items: center;
  height: 80vh;
}

.avatar-sm {
  height: 3rem;
  width: 3rem;
}
</style>
