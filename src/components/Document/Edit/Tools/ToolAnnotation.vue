<!-- eslint-disable vue/no-mutating-props -->
<template>
  <Vue3DraggableResizable v-if="sign64 == null" :key="tool.id" :initH="tool.tool_name != 'Photo' ? 30 : 100"
    :initW="Number(tool.tool_width)" :x="Number(tool.tool_pos_left)" :y="Number(tool.tool_pos_top)" v-model:x="x"
    v-model:y="y" :parent="true" :draggable="profile?.id" :resizable="false" @drag-end="dragEnd($event, tool)"
    class="image-area" :handles="['tl', 'tr', 'bl', 'br']" :class="tool.tool_class">

    <div @click="getUserId(tool)">
      <div v-if="tool.tool_name == 'Photo'">
        <img src="@/assets/noimage.png" class="img-fluid" alt="Preview" />
      </div>
      <div v-if="tool.tool_name == 'Textarea'">
        <input type="text" v-model="tool.value" class="textareaTool w-100 h-100" :data-id="tool.id"
          @blur="textInput($event.target, x, y)" placeholder="Input text here" required
          style="border: none; outline: none" />
      </div>
      <div v-if="tool.tool_name == 'Signature'"
        class="bg-fill w-100 h-100 d-flex justify-content-center align-items-center">
        {{ tool.tool_name }}
      </div>
    </div>

    <span class="drag-me">
      <span title="Drag" class="btn btn-xs btn-secondary rounded-0 movement">
        <MoveIcon />
      </span>

      <span v-if="profile?.id" title="Remove" class="btn btn-xs btn-secondary rounded-0 remove"
        @click="remove({ id: tool.id, can_delete: tool.can_delete_tool })">
        <DeleteIcon />
      </span>
    </span>
  </Vue3DraggableResizable>
  <Vue3DraggableResizable v-else :initH="Number(tool.tool_height)" :initW="Number(tool.tool_width)" :minW="70"
    :minH="30" :x="Number(tool.tool_pos_left)" :y="Number(tool.tool_pos_top)" :parent="true" v-model:x="x" v-model:y="y"
    v-model:h="h" v-model:w="w" :draggable="profile?.id" :resizable="profile?.id" @drag-end="dragEnd($event, tool)"
    @resize-end="resizeEnd(tool, w, h)" class="image-area" :handles="['tl', 'tr', 'bl', 'br']"
    class-name-active="active-class" class-name-dragging="dragging-class" class-name-handle="handle-class"
    class-name-resizing="resizing-class" @dblclick="
      getUserId(tool)
    ">

    <input v-if="tool.tool_name == 'Textarea'" type="text" v-model="tool.value" class="textareaTool w-100 h-100"
      :data-id="tool.id" @blur="textInput($event.target, x, y)" placeholder="Input text here" required
      style="border: none; outline: none" />

    <template v-else>
      <div class="grid" v-if="isToolLoading.id == tool.id && isToolLoading.active">
        <span class="spinner-border" role="status"></span>
      </div>
      <img v-else :src="tool.value" @contextmenu.prevent="false" class="w-100 h-100" style="object-fit: scale-down" />
    </template>

    <span class="drag-me">
      <span title="Drag" class="btn btn-xs btn-secondary rounded-0 movement">
        <MoveIcon />
      </span>

      <span title="Edit" class="btn btn-xs btn-secondary rounded-0 edit" @click="getUserId(tool)">
        <EditIcon />
      </span>

      <span v-if="profile?.id" title="Remove" class="btn btn-xs btn-secondary rounded-0 remove"
        @click="remove({ id: tool.id })">
        <DeleteIcon />
      </span>
    </span>
  </Vue3DraggableResizable>

  <Teleport to="body">
    <ModalComp :show="affixModal" :footer="false" @close="affixModal = false">
      <template #header>
        <h4 class="modal-title">Create your signature</h4>
      </template>

      <template #body>
        <LeftTabWrapper>
          <LeftTabList title="Draw">
            <SignaturePad @close="swapModal" />
          </LeftTabList>

          <LeftTabList title="Select">
            <SignatureSelectFull @close="swapModal" />
          </LeftTabList>

          <LeftTabList title="Initial">
            <SignatureSelectInitial @close="swapModal" />
          </LeftTabList>

          <LeftTabList title="Upload">
            <div class="row">
              <div class="col-md-12 mx-auto position-relative">
                <SignatureUpload @close="swapModal" />
              </div>
            </div>
          </LeftTabList>
        </LeftTabWrapper>
        <div class="row">
          <div class="col-md-10 ms-auto mt-2">
            <p class="fw-normal">
              By clicking create, I agree that all signatures, marks or initials created
              here are as valid as my hand written signature to the extent allowed by law.
            </p>
          </div>
        </div>
      </template>
    </ModalComp>
  </Teleport>

  <Teleport to="body">
    <ModalComp :show="signatureListModal" :footer="false" :size="'modal-sm'" @close="signatureListModal = false">
      <template #header>
        <h4 class="modal-title">Signature box</h4>
      </template>

      <template #body>
        <SignatureList @selectedSignature="savePrint" />
      </template>
    </ModalComp>
  </Teleport>

  <Teleport to="body">
    <ModalComp :show="uploadImage" :footer="false" :size="'modal-md'" @close="uploadImage = false">
      <template #header>
        <h4 class="modal-title">Image management</h4>
      </template>

      <template #body>
        <PassportPhotograph @close="uploadImage = false" @selectedPassport="savePrint" />
      </template>
    </ModalComp>
  </Teleport>
</template>

<script setup>
import ModalComp from "@/components/ModalComp.vue";
import SignaturePad from "@/components/Signature/SignaturePad.vue";
import SignatureSelectFull from "@/components/Signature/SignatureTextFull.vue";
import SignatureSelectInitial from "@/components/Signature/SignatureTextInitial.vue";
import SignatureUpload from "@/components/Signature/SignatureUpload.vue";
import SignatureList from "@/components/Signature/SignatureList.vue";
import LeftTabList from "@/components/Tab/TabLeftNav/LeftTabList.vue";
import LeftTabWrapper from "@/components/Tab/TabLeftNav/LeftTabWrapper.vue";
import PassportPhotograph from "@/components/Passport/PassportPhotograph.vue";
import MoveIcon from "@/icons/MoveIcon.vue"
import EditIcon from "@/icons/EditIcon.vue"
import DeleteIcon from "@/icons/DeleteIcon.vue"

import { useDragResizeComposable } from '@/composables/useDragResize';

import { ref, defineProps, defineEmits, watch } from "vue";
import { useActions, useGetters } from "vuex-composition-helpers/dist";

const { dragEnd, resizeEnd } = useDragResizeComposable()

const props = defineProps({ tool: Object, owner: Object });

const { link, profile, isToolLoading } = useGetters({
  profile: "auth/profile",
  isToolLoading: "signLink/isToolLoading",
  link: "signLink/link",
});

const { editTools } = useActions({
  editTools: "signLink/editTools",
});

const sign64 = ref(props.tool.value)
watch(() => props.tool.value,
  (newTool) => {
    if (newTool) {
      sign64.value = newTool
    }
  })

const x = ref(Number(props.tool.tool_pos_left));
const y = ref(Number(props.tool.tool_pos_top));
const w = ref(Number(props.tool.tool_width));
const h = ref(Number(props.tool.tool_height));

const affixModal = ref(false);
const signatureListModal = ref(false);
const initialModal = ref(false);
const uploadImage = ref(false);
const toolId = ref(null);

const swapModal = () => {
  affixModal.value = false
  signatureListModal.value = true
}

const getUserId = (params) => {
  console.log('params', params)
  if (params.tool_name == "Initial") initialModal.value = true;
  if (params.tool_name == "Signature") affixModal.value = true;
  if (params.tool_name == "Photo") uploadImage.value = true;

  toolId.value = params.id;
};

const textInput = (e) => {
  editTools({
    id: e.dataset.id,
    payload: {
      document_id: props.tool?.document_id,
      document_upload_id: props.tool.document_upload_id,
      tool_pos_left: x.value.toString(),
      tool_pos_top: y.value.toString(),
      value: e.value,
    }
  });
};

const savePrint = (params) => {
  if (params.category == "Draw") {
    params.tool_width = "100";
    params.tool_height = "50";
  } else if (params.category == "Type") {
    params.tool_width = "150";
    params.tool_height = "40";
  } else if (params.category == "Initial") {
    params.tool_width = "80";
    params.tool_height = "40";
  } else if (params.tool_name == "Signature" && params.category == "Upload") {
    params.tool_width = "100";
    params.tool_height = "62";
  }

  const dataObj = {
    document_id: props.tool?.document_id ?? link.value.id,
    document_upload_id: props.tool?.document_upload_id,
    id: props.tool?.id,
    signed: false,
    tool_class: params.tool_name == 'Photo' ? 'main-element photo-style' : "tool-box main-element",
    tool_height: params.tool_height,
    tool_name: params.tool_name,
    tool_pos_left: props.tool.tool_pos_left,
    tool_pos_top: props.tool.tool_pos_top,
    tool_width: params.tool_width,
    value: params.value,
  }

  if (profile.value?.id != undefined) {
    console.log('dataObj', dataObj)
    editTools({ id: toolId.value, payload: dataObj });
  } else {
    editTools({ id: toolId.value, payload: dataObj });
  }
  affixModal.value = signatureListModal.value = uploadImage.value = false
};

const emit = defineEmits(["remove"]);
const remove = (params) => {
  emit("remove", params);
};

</script>

<style scoped>
.z-indexed {
  z-index: 1;
}

.grid {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
}

.spinner-border {
  width: 1rem;
  height: 1rem;
  font-size: 12px;
}
</style>
