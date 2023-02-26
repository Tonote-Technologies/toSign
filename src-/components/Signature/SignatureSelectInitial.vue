<template>
  <div class="row">
    <div class="col-7 d-none">
      <div class="mb-1 row">
        <div class="col-sm-4 col-md-4">
          <label class="col-form-label" for="fullName">Full Name</label>
        </div>
        <div class="col-sm-8 col-md-8">
          <div class="input-group input-group-merge">
            <input type="text" class="form-control" name="fullName" v-model="fullName" placeholder="Full name" />
          </div>
        </div>
      </div>
    </div>

    <div class="col-12">
      <div class="mb-1">
        <label class="col-form-label" for="initials">Initials</label>
        <input type="text" class="form-control" name="initials" v-model="nameInitials" placeholder="Initial" />
      </div>
    </div>

    <div class="d-flex flex-column justify-content-between" style="height: 360px">
      <div class="row px-1">
        <div class="col-md-6 hover" v-for="(font, index) in fonts" :key="index">
          <div class="form-check p-1">
            <label :for="font + index" class="form-check-label" @click="onCapture(font)">
              <div class="me-3">
                <input type="radio" :name="font" v-model="selected" :value="font" class="form-check-input border-0"
                  style="margin-top: 7px" :id="font + index" />
              </div>

              <div class="css-pl8xw2">
                <div class="css-fv3lde">
                  <span class="css-4x8v88 initials" :class="font" :style="{ fontFamily: font, fontSize: '30px' }">
                    {{ nameInitials }}
                  </span>
                </div>
              </div>
            </label>
          </div>
        </div>

        <h1 class="d-inline-block p-0 my-2">
          <span ref="capture" class="d-inline-block fw-bolder" data-type="Initial"
            style="padding:3px 12px 0 8px;color: #000" :style="{ fontFamily: selectedFont }">
            {{ nameInitials }}
          </span>
        </h1>

        <!-- <img :src="imgUrl" class="border border-danger" alt="type"> -->
      </div>

      <div class="col-md-12 mb-2">
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
import { ref, defineEmits, watch } from "vue";

import { useGetters, useActions } from "vuex-composition-helpers/dist";

const { profile } = useGetters({
  profile: "auth/profile",
  prints: "print/prints",
});

const { savePrint } = useActions({ savePrint: "print/savePrint" });

const selected = ref("");
const imgUrl = ref("");
const loading = ref(false);
const capture = ref("");
const capturing = ref(false);
const data = ref(null);
const selectedFont = ref("");

const fonts = ["Great Vibes", "Arizonia"];
const fullName = ref("");
const nameInitials = ref("");

const getFirstLetters = (str) => {
  const firstLetters = str
    .split(" ")
    .map((word) => word[0])
    .join("");

  return firstLetters;
};

fullName.value = profile.value.first_name + " " + profile.value.last_name;
nameInitials.value = getFirstLetters(fullName.value);

watch(
  () => nameInitials.value,
  (newValue) => {
    nameInitials.value = newValue;
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
    value: nameInitials.value,
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
  width: 46% !important;
  margin: 0 5px;
  outline: 1px solid #ccc !important;
  border-radius: 20px;
}

.hover:hover {
  outline: 2px solid #7367f0 !important;
}

@media screen and (max-width: 991.5px) {
  .custom-fs-sm {
    font-size: 2rem !important;
  }

  .hover {
    width: 100% !important;
    margin: 0;
  }
}
</style>
