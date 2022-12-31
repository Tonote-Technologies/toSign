<template>
  <div class="tool bg-white"
    :class="{ 'p-2 d-flex justify-content-between align-items-center gap-1 flex-wrap': mobile }"
    :style="[!mobile ? 'height: 100vh' : '']">
    <li class="btn blue" :class="{ 'rounded-circle d-flex justify-content-center align-items-center mb-0': mobile }"
      @click="selectTool({ toolId: 'textTool', tool_name: 'Textarea', })">
      <template v-if="!mobile">Text Area</template>
      <TextIcon />
    </li>

    <li class="btn blue" :class="{ 'rounded-circle d-flex justify-content-center align-items-center mb-0': mobile }"
      @click="selectTool({ toolId: 'signTool', tool_name: 'Signature', })">
      <template v-if="!mobile">Signature</template>
      <SignatureIcon />
    </li>

    <li class="btn blue" :class="{ 'rounded-circle d-flex justify-content-center align-items-center mb-0': mobile }"
      @click="selectTool({ toolId: 'photoTool', tool_name: 'Photo', })">
      <template v-if="!mobile">Image</template>
      <ImageIcon />
    </li>
  </div>
</template>

<script setup>
import { defineEmits, defineProps } from "vue";
import TextIcon from "@/icons/TextIcon.vue"
import SignatureIcon from "@/icons/SignatureIcon.vue"
import ImageIcon from "@/icons/ImageIcon.vue"

const emit = defineEmits(["bindTools"]);
defineProps({ mobile: { type: Boolean, default: false } })

const selectTool = (params) => {
  emit("bindTool", params);
};
</script>

<style scoped>
.tool {
  padding: 0.58rem 1.5rem !important;
}
</style>
