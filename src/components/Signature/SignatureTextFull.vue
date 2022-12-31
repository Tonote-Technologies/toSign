<template>
  <div class="row">
    <div class="col-12">
      <div class="mb-1">
        <label class="col-form-label" for="fullName">Full Name</label>
        <input type="text" class="form-control" name="fullName" v-model="fullName" placeholder="Full name" />
      </div>
    </div>

    <div class="d-flex flex-column justify-content-between" style="height: 360px">
      <div class="row px-1">
        <div class="col-md-6 hover mb-1" v-for="(font, index) in fonts" :key="index">
          <div class="form-check p-1">
            <label :for="font" class="form-check-label" @click="onCapture(font)">
              <div class="me-0">
                <input type="radio" :name="font" v-model="selected" :value="font" class="form-check-input"
                  style="margin-top: 8px" :id="font" />
              </div>

              <div class="css-pl8xw2">
                <div class="css-fv3lde">
                  <span class="css-4x8v88 fullName" :class="font" :style="{ fontFamily: font, fontSize: '1.5rem' }">
                    {{ fullName }}
                  </span>
                </div>
              </div>
            </label>
          </div>
        </div>

        <span class="d-inline-block p-0">
          <span ref="capture" class="d-inline-block custom-fs-sm" data-type="Signature"
            :style="{ fontFamily: selectedFont }">
            {{ fullName }}
          </span>
        </span>

        <!-- <img :src="imgUrl" class="border border-danger" alt="type"> -->
      </div>

      <div class="col-md-12">
        <button type="button" class="btn btn-primary d-block ms-auto" :disabled="capturing === false"
          @click="createTypedSignature">
          <span v-show="loading" class="spinner-border spinner-border-sm"></span>
          <span>Create</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import domToImage from "dom-to-image";
import { ref, watch, defineEmits } from "vue";

import { useActions } from "vuex-composition-helpers/dist";

// const { profile } = useGetters({
//   profile: "auth/profile",
//   prints: "print/prints",
// });

const { savePrint } = useActions({ savePrint: "printSignLink/savePrint" });

const imgUrl = ref("");
const selected = ref("");
const loading = ref(false);
const capturing = ref(false);
const capture = ref("");
const data = ref([]);
const selectedFont = ref("");

const fonts = ["Great Vibes", "Arizonia"];
const fullName = ref("");

watch(
  () => fullName.value,
  (newValue) => {
    fullName.value = newValue;
  }
);

const onCapture = (font) => {
  loading.value = true;
  capturing.value = false;
  selectedFont.value = font;

  if (selectedFont.value != "") {
    let type = capture.value.dataset.type;
    const scale = 5;

    domToImage
      .toPng(capture.value, {
        quality: 1,
        width: capture.value.clientWidth * scale,
        height: capture.value.clientHeight * scale,
        style: {
          transform: 'scale(' + scale + ')',
          transformOrigin: 'top left'
        },
      })
      .then((dataUrl) => {
        imgUrl.value = dataUrl;
        data.value = { file: dataUrl, type: type, category: "Type" };
        loading.value = false;
        capturing.value = true;
      })
      .catch((error) => {
        capturing.value = false;
        console.error("oops, something went wrong!", error);
      });
  }
};

const emit = defineEmits(["close"]);
const createTypedSignature = () => {
  loading.value = true;

  const formData = {
    category: data.value.category,
    type: data.value.type,
    file: data.value.file,
    value: fullName.value,
  };

  savePrint(formData);
  emit("close", true);

  setTimeout(() => {
    loading.value = false;
    capturing.value = false;
  }, 1000);
};
</script>

<style scoped>
@import "@/assets/css/signature-font-face.css";

.hover {
  width: 48% !important;
  margin: 0 5px;
  outline: 1px solid #ccc !important;
  border-radius: 20px;
}

.hover:hover {
  outline: 2px solid #7367f0 !important;
}

.custom-fs-sm {
  color: #000;
  padding: 0 3px;
  font-size: 46px;
  font-size: clamp(1rem, 2vw, 2.875rem);
}

@media screen and (max-width: 991.5px) {
  .hover {
    width: 100% !important;
    margin: 0;
  }
}
</style>
