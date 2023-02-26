<template>
  <div class="list-group-item list-group-item-action border-bottom" :class="{ 'is-mobile': mobile }">
    <div class="form-check form-check-primary form-switch">
      <label :class="[mobile ? 'form-label' : 'form-check-label']">
        <input type="checkbox" @change="addMe({ userId: profile.id })" v-model="isDelete" :checked="isDelete"
          class="form-check-input" />
        I want to sign
      </label>
    </div>
  </div>

  <Teleport to="body">
    <ModalComp :show="removeSelfModal" :size="'modal-sm'" @close="removeSelfModal = false">
      <template #header>
        <h4 class="text-danger mb-0">
          <Icon icon="eva:alert-triangle-outline" style="margin-bottom: 3px" />
          Alert
        </h4>
      </template>
      <template #body>
        <h5 class="modal-title text-center">
          Are you sure you want to remove this signer ?
        </h5>
        <p class="fw-normal text-center">
          This will remove all tools added in the signer's name
        </p>
      </template>
      <template #footer>
        <div class="d-flex justify-content-end align-items-center">
          <button class="btn btn-outline-danger" @click="removeSelf">Yes Remove</button>
        </div>
      </template>
    </ModalComp>
  </Teleport>
</template>

<script setup>
import { Icon } from "@iconify/vue";
import ModalComp from "@/components/ModalComp.vue";

import { ref, onMounted, defineProps } from "vue";

import { useGetters, useActions } from "vuex-composition-helpers/dist";

const { profile, userDocument } = useGetters({
  profile: "auth/profile",
  userDocument: "document/userDocument",
});

const { removeParticipant, addSelf } = useActions({
  addSelf: "document/addSelf",
  removeParticipant: "document/removeParticipant",
});

defineProps({ mobile: { default: false } });

const isDelete = ref(false);
const removeSelfModal = ref(false);
const participantId = ref(null);

const addMe = (uId) => {
  const participantArray = userDocument.value.participants;

  if (isDelete.value === true) return addSelf(userDocument.value.id);

  participantArray.map((params) => {
    if (params.user.id == uId.userId) {
      participantId.value = params.id;
      isDelete.value = params.iAddedMyselfToDocument;
    }
  });
  removeSelfModal.value = true;
};

const removeSelf = () => {
  removeParticipant(participantId.value);
  removeSelfModal.value = isDelete.value = false;
};

onMounted(() => {
  if (userDocument.value.participants == undefined) return;
  userDocument.value.participants.map((params) => {
    if (params.user.id == profile.value.id)
      return (isDelete.value = params.iAddedMyselfToDocument);
  });
});
</script>

<style scoped>
.is-mobile {
  display: flex;
  justify-content: end;
  align-items: center;
  padding: 0;
  border: 0;
  border-bottom: 0 !important;
  text-align: right;
  background: #fff;
}

.is-mobile .form-check {
  min-height: auto;
  padding: 0;
}

.is-mobile .form-switch .form-check-input {
  height: 1.285rem;
}

.is-mobile .form-switch .form-check-input {
  width: 2rem;
  margin-left: 0;
  margin-right: 8px;
}
</style>
