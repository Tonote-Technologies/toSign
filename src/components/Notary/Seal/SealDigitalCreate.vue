<template>
  <div class="company">
    <div class="row mb-3">
      <div class="form-group col-4">
        <label for="companyName">Company Name:</label>
        <input type="text" class="input form-control" placeholder="Company Name" v-model="companyName" size="40"
          maxlength="" />
      </div>
      <div class="form-group col-4">
        <label for="companyAddress">Company Address:</label>
        <input type="text" class="input form-control" placeholder="Your place, State" v-model="companyAddress" size="40"
          maxlength="" />
      </div>
      <div class="col-4">
        <label style="padding-right: 32px">RC Number:</label>
        <input type="text" v-model="companyRC" class="input form-control" placeholder="RC:12345" />
      </div>
    </div>

    <!-- <div class="row"> -->
    <div class="grid">
      <div class="custom-sm">
        <div v-for="(seal, index) in sealFrame" :key="index">
          <div style="width: 100px; height: 100px" class="sealList mb-1 active" data-id="1">
            <img @click="selectedSeal" ref="selected" :src="seal" alt="seal gray" class="img-fluid" />
          </div>
        </div>
      </div>

      <div class="grid-8">
        <div class="position-relative" style="width: max-content" ref="capture">
          <div id="coy_number1"></div>
          <img width="380" height="380" ref="thumbSeal" src="@/assets/company_seal_01.png" alt="Freedom Blog" />
          <canvas id="canvas1" width="300" height="300" style="transform: translate(-50%, -50%);
          position:absolute;top: 50%;left: 190px;
            "></canvas>
        </div>
      </div>

      <div class="preview">
        <template v-if="data.file == null">
          <img src="@/assets/empty.png" class="img-fluid" alt="Seal" />
        </template>
        <template v-else>
          <img :src="data.file" class="img-fluid" alt="Seal" />
        </template>
      </div>
    </div>
    <!-- </div> -->

    <button type="button" class="btn btn-primary d-block ms-auto mt-2" @click="captureSeal" :disabled="!isSealAdopt">
      <span v-show="loading" class="spinner-border spinner-border-sm"></span>
      <span>Adopt</span>
    </button>
  </div>
</template>

<script setup>
import domToImage from "dom-to-image";

import { ref, onMounted, watch, defineEmits } from "vue";

import { useGetters, useActions } from "vuex-composition-helpers/dist";

const { token, companies } = useGetters({
  token: "auth/token",
  companies: "company/companies",
});

const { savePrint, getCompanies } = useActions({
  savePrint: "print/savePrint",
  getCompanies: "company/getCompanies",
});

const loading = ref(false);
const companyName = ref(companies.value.company_name);
const companyAddress = ref(companies.value.address);
const companyRC = ref(companies.value.registration_company_number);
const base64Url = ref("");
const capture = ref("");
const data = ref("");
const isSealAdopt = ref(false);

const sealFrame = ref([
  require("@/assets/company_seal_01.png"),
  require("@/assets/company_seal_02.png"),
  require("@/assets/company_seal_03.png"),
]);

const thumbSeal = ref("");
const selectedSeal = (e) => {
  thumbSeal.value.src = e.target.src;
  isSealAdopt.value = true
};

const r = 120;
const space = Math.PI / 12;

const updateCanvas = function (text, x, y, radius, space, top, fontSize, color) {
  const canvas = document.getElementById("canvas1"),
    ctx = canvas.getContext("2d");

  ctx.font = "normal " + fontSize + " verdana ";
  ctx.beginPath();
  ctx.arc(155, 155, r, 0, Math.pow(r, 2), false);
  ctx.fillStyle = color;
  ctx.closePath();

  ctx.clearRect(0, top ? 0 : y, 600, y);
  space = space || 0;
  const numRadsPerLetter = (Math.PI - space * 2) / text.length;
  ctx.save();
  ctx.translate(x, y);

  const k = top ? 1 : -1;
  ctx.rotate(-k * ((Math.PI - numRadsPerLetter) / 2 - space));

  for (let i = 0; i < text.length; i++) {
    ctx.save();
    ctx.rotate(k * i * numRadsPerLetter);
    ctx.textAlign = "left";
    ctx.textBaseline = !top ? "top" : "bottom";
    ctx.backgroundColor = "rgba(255,255,255,0.1)";
    const cText = text[i].split(" ").join(String.fromCharCode(8201));
    ctx.fillText(cText.toUpperCase(), 0, -k * radius);
    ctx.restore();
  }

  base64Url.value = canvas.toDataURL("image/png");

  ctx.restore();
};

const emit = defineEmits(["close"]);
const captureSeal = () => {
  loading.value = true;
  isSealAdopt.value = false;
  const scale = 2;

  domToImage
    .toPng(capture.value, {
      quality: 1,
      width: capture.value.clientWidth * scale,
      height: capture.value.clientHeight * scale,
      bgcolor: 'rgba(255,255,255,0.1)',
      style: {
        transform: 'scale(' + scale + ')',
        transformOrigin: 'top left'
      },
    })
    .then((dataUrl) => {
      data.value = { file: dataUrl, type: "CompanySeal", category: "Upload" };
      savePrint(data.value);

      loading.value = false;
      emit("close", true);
    })
    .catch((error) => {
      console.error("oops, something went wrong!", error);
    });
};

watch(
  () => [companyName?.value, companyAddress?.value, companyRC?.value],
  ([newCnv, newCnv2, newCoy], [oldCnv, oldCnv2, oldCoy]) => {
    if (companyName?.value != "" && companyAddress?.value != "" && companyRC?.value != "") {
      isSealAdopt.value = true;
    }

    if (newCnv != oldCnv)
      return updateCanvas(newCnv, 150, 150, 118, space, 1, "1.3em", "#000");

    if (newCnv2 != oldCnv2)
      return updateCanvas(newCnv2, 149, 157, 118, space, 0, "1em", "#000");

    if (newCoy != oldCoy) {
      const coy_number1 = document.getElementById("coy_number1");
      coy_number1.innerText = newCoy;
    }
  }
);

onMounted(() => {
  getCompanies(token.value);
  let name = companyName?.value == undefined ? "Company" : companyName?.value;
  let address = companyAddress?.value == undefined ? "Address" : companyAddress?.value;
  let rc = companyRC?.value == undefined ? "RC NUMBER" : companyRC?.value;
  updateCanvas(name, 150, 150, 118, space, 1, "1.3em", "#000");
  updateCanvas(address, 149, 157, 118, space, 0, "1em", "#000");
  const coy_number1 = document.getElementById("coy_number1");
  coy_number1.innerText = rc;
});
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: 2fr 8fr 2fr;
}

#canvas1 {
  border-radius: 50%;
  letter-spacing: 20px;
}

#coy_number1 {
  position: absolute;
  top: 176px;
  left: -1px;
  font-weight: normal;
  font-size: 20px;
  font-family: "verdana";
  width: 100%;
  text-align: center;
  text-transform: uppercase;
  color: #000;
  /* text-shadow: 1px 4px 6px #190000; */
}

.input {
  text-transform: uppercase;
}

@media screen and (max-width: 991.5px) {
  .grid {
    grid-template-columns: 1fr;
  }

  .custom-sm {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
  }

  .preview {
    /* width: 200px; */
    display: none;
  }
}
</style>
