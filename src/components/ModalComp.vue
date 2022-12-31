<template>
  <Transition name="modal">
    <div v-if="show" class="modal-mask">
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" :class="size">
        <div class="modal-content">
          <div class="modal-header">
            <slot name="header">default header</slot>
            <button v-if="closeBtn != false" type="button" class="btn-close" @click="$emit('close')"></button>
          </div>

          <div class="modal-body">
            <slot name="body">default body</slot>
          </div>

          <div class="modal-footer" v-if="footer">
            <slot name="footer">
              <span @click="$emit('close')"></span>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { defineProps } from "vue";
defineProps({
  show: Boolean,
  closeBtn: { type: Boolean, default: true },
  footer: { type: Boolean, default: true },
  size: { type: String, default: "modal-lg" },
});
</script>

<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity 0.3s ease;
}

.modal-dialog-scrollable .modal-content {
  overflow: visible;
}

.modal-header {
  background-color: #f8f8f8;
}

.btn-close {
  padding: 0.8rem !important;
  box-shadow: 0 5px 20px 0 rgb(34 41 47 / 10%);
  border-radius: 0.357rem;
  background-color: #fff;
  opacity: 1;
  -webkit-transition: all 0.23s ease 0.1s;
  transition: all 0.23s ease 0.1s;
  position: relative;
  -webkit-transform: translate(18px, -10px);
  -ms-transform: translate(18px, -10px);
  transform: translate(18px, -10px);
}

.btn-close:hover {
  opacity: 1;
  outline: 0;
  -webkit-transform: translate(15px, -2px);
  -ms-transform: translate(15px, -2px);
  transform: translate(15px, -2px);
  box-shadow: none;
}

.modal-enter-from {
  opacity: 0;
}

.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
