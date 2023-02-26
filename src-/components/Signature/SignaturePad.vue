<template>
  <div class="grid">
    <div class="px-0">
      <div class="my-1 text-center">
        Draw your signature in the tool box
      </div>
      <div @touchmove.prevent>
        <canvas :id="state.uid" class="canvas shadow" :data-uid="state.uid" :disabled="state?.disabled"></canvas>
      </div>
    </div>

    <div class="text-center">
      <div style="margin:10px 0;">
        <button class="btn btn-sm btn-outline-primary waves-effect" @click="clear">Clear</button>
      </div>

      <template v-if="imgBase64 != ''">
        <img :src="imgBase64" class="img-thumbnail d-block mx-auto" alt="preview" />
      </template>
      <template v-else>
        <img src="@/assets/empty.png" class="img-thumbnail d-block mx-auto" width="100" alt="Preview" />
      </template>
    </div>
  </div>

  <button class="btn btn-primary d-block ms-auto mt-2" ref="create" @click="createDrawSignature">
    Create
  </button>
</template>

<script setup>
import SignaturePad from "signature_pad";
import { v4 as uuidv4 } from 'uuid';
import {
  defineProps,
  onMounted,
  onUnmounted,
  reactive,
  watch,
  defineExpose,
  ref,
  computed,
  defineEmits,
} from "vue";

import { createNamespacedHelpers } from "vuex-composition-helpers/dist";
const { useActions } = createNamespacedHelpers(["print"]);
const { savePrint } = useActions(["savePrint"]);

const emit = defineEmits(["close"]);

const create = ref(false);

function useBreakpoints() {
  let windowWidth = ref(window.innerWidth);

  const onWidthChange = () => (windowWidth.value = window.innerWidth);
  onMounted(() => {
    window.addEventListener("resize", onWidthChange)
    setTimeout(() => {
      if (window.Tawk_API) {
        window.Tawk_API.showWidget();
      }
    }, 500);
  });
  onUnmounted(() => window.removeEventListener("resize", onWidthChange));

  const type = computed(() => {
    if (windowWidth.value < 550) return "xs";
    if (windowWidth.value >= 550 && windowWidth.value < 1200) return "md";
    if (windowWidth.value >= 1200) return "lg";
    return null;
  });

  const width = computed(() => windowWidth.value);

  return { width, type };
}

const { type } = useBreakpoints();

const props = defineProps({
  sigOption: {
    type: Object,
    default: () => {
      return {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        penColor: "rgb(0, 0, 0)",
      };
    },
  },
  w: {
    type: String,
    default: "100%",
  },
  h: {
    type: String,
    default: "100%",
  },
  clearOnResize: {
    type: Boolean,
    default: false,
  },
  waterMark: {
    type: Object,
    default: () => {
      return {};
    },
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  defaultUrl: {
    type: String,
    default: "",
  },
});

let state = reactive({
  sig: () => { },
  option: {
    minWidth: 1.5,
    maxWidth: 1.5,
    backgroundColor: "rgb(255, 255, 255)",
    penColor: "rgb(0, 0, 0)",
  },
  uid: "",
});

let sigOptions = Object.keys(props.sigOption);
for (let item of sigOptions) {
  // eslint-disable-next-line vue/no-setup-props-destructure
  state.option[item] = props.sigOption[item];
}

watch(
  () => props?.disabled,
  (val) => {
    if (val) {
      state.sig.off();
    } else {
      state.sig.on();
    }
  }
);

const draw = () => {
  let canvas = document.getElementById(state?.uid);
  state.sig = new SignaturePad(canvas, state.option);

  state.sig.addEventListener("endStroke", () => save());

  SignaturePad.prototype.removeBlanks = function () {
    let tempCanvas = document.createElement('canvas').getContext('2d')
    const imgWidth = this._ctx.canvas.width;
    const imgHeight = this._ctx.canvas.height;
    const imageData = this._ctx.getImageData(0, 0, imgWidth, imgHeight)
    const data = imageData.data,
      getAlpha = function (x, y) {
        return {
          red: data[(imgWidth * y + x) * 4],
          green: data[(imgWidth * y + x) * 4 + 1],
          blue: data[(imgWidth * y + x) * 4 + 2]
        };
      },
      isWhite = function (rgb) {
        return rgb.red == 255 && rgb.green == 255 && rgb.blue == 255;
      },
      scanY = function (fromTop) {
        const offset = fromTop ? 1 : -1;

        for (let y = fromTop ? 0 : imgHeight - 1; fromTop ? (y < imgHeight) : (y > -1); y += offset) {
          for (let x = 0; x < imgWidth; x++) {
            if (!isWhite(getAlpha(x, y))) return y;
          }
        }
        return null;
      },
      scanX = function (fromLeft) {
        const offset = fromLeft ? 1 : -1;

        for (let x = fromLeft ? 0 : imgWidth - 1; fromLeft ? (x < imgWidth) : (x > -1); x += offset) {
          for (let y = 0; y < imgHeight; y++) {
            if (!isWhite(getAlpha(x, y))) return x;
          }
        }
        return null;
      };

    const cropTop = scanY(true),
      cropBottom = scanY(false),
      cropLeft = scanX(true),
      cropRight = scanX(false);

    const relevantData = this._ctx.getImageData(cropLeft, cropTop, cropRight - cropLeft, cropBottom - cropTop);

    tempCanvas.canvas.width = cropRight - cropLeft;
    tempCanvas.canvas.height = cropBottom - cropTop;
    tempCanvas.putImageData(relevantData, 0, 0);

    const dataURL = tempCanvas.canvas.toDataURL();
    imgBase64.value = dataURL
  };

  function resizeCanvas(c) {
    let url;
    if (!isEmpty()) url = save();

    c.width = 400;
    c.height = 300;
    if (type.value == 'xs') {
      c.width = 290;
      c.height = 190;
    }


    c.getContext("2d").scale(1, 1);
    clear();

    !props.clearOnResize && url !== undefined && fromDataURL(url);
  }

  window.addEventListener("resize", resizeCanvas(canvas));
  resizeCanvas(canvas);

  if (props.defaultUrl !== "") fromDataURL(props.defaultUrl)

  props.disabled ? state.sig.off() : state.sig.on()
};

const save = () => {
  state.sig.removeBlanks();
  create.value.disabled = false;
};

const imgBase64 = ref("");
const clear = () => {
  state.sig.clear();
  create.value.disabled = true;
  imgBase64.value = ''
};

const fromDataURL = (url) => {
  state.sig.fromDataURL(url);
};

const isEmpty = () => {
  return state.sig.isEmpty();
};

const undo = () => {
  let data = state.sig.toData();
  if (data) {
    data.pop();
    state.sig.fromData(data);
  }
};

onMounted(() => {
  create.value.disabled = true;
  state.uid = uuidv4();
  if (state.uid != '') {
    setTimeout(() => {
      draw();
    }, 1000);
  }
});

defineExpose({
  save,
  clear,
  isEmpty,
  undo,
  fromDataURL,
});

const createDrawSignature = () => {
  const signatureObj = {
    file: imgBase64.value,
    type: "Signature",
    category: "Draw",
  };

  savePrint(signatureObj);
  imgBase64.value = ''
  emit("close", true);
};
</script>

<style scoped>
canvas {
  width: 400px;
  height: 300px;
}

.grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
}

@media screen and (max-width: 991.5px) {
  canvas {
    width: 290px;
    height: 190px;
  }

  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
