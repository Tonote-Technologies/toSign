<template>
  <button class="btn waves-effect waves-float waves-light" :class="[size, color]">
    <slot>Button</slot>
  </button>
</template>

<script setup>
import { defineProps } from "vue"
defineProps({
  size: { type: String, default: 'btn-md' },
  color: { type: String, default: 'btn-primary' },
})
</script>