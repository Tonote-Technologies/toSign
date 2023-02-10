<template>
  <div>
    <div class="row mb-3">
      <div class="form-group col-4">
        <label for="text_cnv">Company Name:</label>
        <input
          type="text"
          class="input form-control"
          placeholder="Company Name"
          v-model="text_cnv"
          size="40"
          maxlength=""
        />
      </div>
      <div class="form-group col-4">
        <label for="text_cnv">Address:</label>
        <input
          type="text"
          class="input form-control"
          placeholder="Your place, State"
          v-model="text_cnv2"
          size="40"
          maxlength=""
        />
      </div>
      <div class="col-4">
        <label style="padding-right: 32px">RC Number:</label>
        <input
          type="text"
          v-model="text_horizontal"
          class="input form-control"
          placeholder="RC:12345"
        />
      </div>
    </div>

    <div class="row">
      <div class="position-relative" style="width: auto" ref="capture">
        <div id="coy_number"></div>
        <img
          width="380"
          height="380"
          src="@/assets/red_seal-2.png"
          alt="Freedom Blog"
        />

        <canvas
          id="canvas"
          width="300"
          height="300"
          style="
            transform: translate(-50%, -50%);
            position: absolute;
            top: 50%;
            left: 216px;
          "
        ></canvas>
      </div>
    </div>

    <div class="preview"><img :src="data.file" class="img-fluid" alt="Seal" /></div>

    <button
      type="button"
      class="btn btn-primary d-block ms-auto mt-2"
      @click="captureSeal"
      :disabled="!isAdopt"
    >
      <span v-show="loading" class="spinner-border spinner-border-sm"></span>
      <span>Adopt</span>
    </button>
  </div>
</template>

<script setup>
import domToImage from "dom-to-image";

import { ref, onMounted, watch } from "vue";

import { createNamespacedHelpers } from "vuex-composition-helpers/dist";
const { useActions } = createNamespacedHelpers(["print"]);
const { savePrint } = useActions(["savePrint"]);

const text_cnv = ref("TONOTE TECHNOLOGIES LTD.");
const text_cnv2 = ref("1625B Adeola Odeku V.I Lagos");
const text_horizontal = ref("RC:12345");
const base64Url = ref("");
const capture = ref("");
const data = ref("");
const isAdopt = ref(false);

const r = 106;
const space = Math.PI / 12;

const updateCanvas = function (text, x, y, radius, space, top, fontSize) {
  const canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d");

  draw3dText(ctx, "", canvas.width / 2, 120, 5);
  ctx.font = "normal " + fontSize + " arial ";
  ctx.beginPath();
  ctx.arc(155, 155, r, 0, Math.pow(r, 2), false);
  ctx.fillStyle = "#C1353F";
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

const draw3dText = (context, text, x, y, textDepth) => {
  let n;
  for (n = 0; n < textDepth; n++) {
    context.fillText(text, x - n, y - n);
  }

  context.shadowColor = "#000";
  context.shadowBlur = 2;
  context.shadowOffsetX = textDepth + 2;
  context.shadowOffsetY = textDepth + 2;
  context.fillText(text, x - n, y - n);
};

const captureSeal = () => {
  domToImage
    .toPng(capture.value)
    .then((dataUrl) => {
      data.value = { file: dataUrl, type: "Seal", category: "Upload" };
      savePrint(data.value);
    })
    .catch((error) => {
      console.error("oops, something went wrong!", error);
    });
};

watch(
  () => [text_cnv.value, text_cnv2.value, text_horizontal.value],
  ([newCnv, newCnv2, newCoy], [oldCnv, oldCnv2, oldCoy]) => {
    if (text_cnv.value != "" && text_cnv2.value != "" && text_horizontal.value != "") {
      isAdopt.value = true;
    }

    if (newCnv != oldCnv) return updateCanvas(newCnv, 131.5, 141, r, space, 1, "20px");

    if (newCnv2 != oldCnv2)
      return updateCanvas(newCnv2, 131, 144, r, space, 0, "1.125em");

    if (newCoy != oldCoy) {
      const coy_number = document.getElementById("coy_number");
      coy_number.innerText = newCoy;
    }
  }
);

onMounted(() => {
  updateCanvas(0, 150, 145, r, space, 0, "20px");
});
</script>

<style scoped>
#canvas {
  border-radius: 50%;
  letter-spacing: 20px;
}

#coy_number {
  position: absolute;
  top: 168px;
  left: -3px;
  font-weight: normal;
  font-size: 25px;
  font-family: "arial";
  width: 100%;
  text-align: center;
  text-transform: uppercase;
  color: #c1353f;
  text-shadow: 3px 1px 0px #000;
}

.input {
  text-transform: uppercase;
}

.preview {
  position: absolute;
  top: 180px;
  right: 40px;
  width: 200px;
}
</style>
