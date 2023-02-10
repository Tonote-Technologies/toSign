import { ref } from "vue";

export const dashboard = ref({
  token: null,
  status: 'New',
  isOpened: false,

  setToken(value) { this.token = value },
  setStatus(value) { this.status = value },
  setIsOpened(value) { this.isOpened = value },
})