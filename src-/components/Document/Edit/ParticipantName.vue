<template>
  <div class="name-style fw-normal" v-for="(participant, index) in userDocument.participants" :key="index">
    <template v-if="userId === participant.user.id">
      {{ participant.user.first_name }}
    </template>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref } from "vue";
import { createNamespacedHelpers } from "vuex-composition-helpers/dist";

const { useGetters } = createNamespacedHelpers("document");
const { userDocument } = useGetters(["userDocument"]);

const props = defineProps({ userId: String });
const emit = defineEmits(["code"]);

const colorCode = ref([
  "#fff100",
  "#ff8c00",
  "#e81123",
  "#ec008c",
  "#68217a",
  "#00188f",
  "#00bcf2",
  "#00b294",
  "#009e49",
  "#bad80a",
]);

const codeArray = ref(null);
userDocument.value.participants.map((part, index) => {
  if (props.userId === part.user.id) {
    return (codeArray.value = {
      userId: part.user.id,
      name: part.user.first_name,
      code: colorCode.value[index],
    });
  }
});

emit("code", codeArray.value);
</script>

<style scoped>

</style>
