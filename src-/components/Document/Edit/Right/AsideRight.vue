<template>
  <div class="sidebar-left custom-md-none">
    <div class="sidebar">
      <div class="email-app-sidebar">
        <div class="email-app-menu">
          <div class="sidebar-menu-list sidebar-nav sticky shadow" style="width: 260px">
            <div class="list-group list-group-messages">
              <div class="list-group-item list-group-item-action border-bottom">
                Tool Management
              </div>

              <div class="list-group-item list-group-item-action border-bottom">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    Added Tool ({{ workingTools.length > 0 ? workingTools.length : 0 }})
                  </div>
                </div>
              </div>

              <div class="list-group-item list-group-item-action border-bottom">
                <p>Signers ({{ userDocument.participants_count }})</p>

                <div class="avatar-group">
                  <div v-for="(init, index) in userDocument.participants" data-popup="tooltip-custom"
                    data-bs-placement="top" :title="init.user.first_name + ' ' + init.user.last_name"
                    class="avatar pull-up" :data-bs-original-title="init.user.first_name" :data-id="init.id"
                    :key="index">
                    <div class="avatar-content text-uppercase" :style="{
                      backgroundColor: init.ownerDocument
                        ? '#28C76F!important'
                        : colorCode[index] + '!important',
                    }">
                      {{
                        getFirstLetters(init.user.first_name + " " + init.user.last_name)
                      }}
                    </div>
                  </div>
                </div>
              </div>

              <div role="button" class="list-group-item list-group-item-action border-bottom"
                @click="editSignerModal = true">
                <span class="isHover">View all signers <span>&rightarrow;</span></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <ModalComp :show="editSignerModal" :footer="false" @close="closeSignerModal">
    <template #header>
      <template v-if="userDocument.is_the_owner_of_document === true">
        <h5 class="modal-title">Edit participants</h5>
      </template>
      <template v-else>
        <h5 class="modal-title">Participants</h5>
      </template>
    </template>

    <template #body>
      <form @submit.prevent="onEditParticipant">
        <div id="addSignerErrorMsg" class="text-center text-danger"></div>
        <div class="row gx-1" v-for="(participant, index) in participants" :key="index">
          <div class="col-md-3 col-12">
            <label class="form-label" for="first-name">First Name</label>
            <div class="input-group mb-1">
              <span class="input-group-text p-0" :style="{
                border:
                  '1px solid' +
                  (participant.ownerDocument ? '#28C76F' : colorCode[index]),
                color: participant.ownerDocument ? '#28C76F' : colorCode[index],
              }">
                <Icon icon="ri:grid-fill" />
              </span>
              <input :readonly="!userDocument.is_the_owner_of_document" type="text" name="first_name"
                v-model="participant.user.first_name" class="form-control form-control-sm" :style="{
                  border:
                    '1px solid' +
                    (participant.ownerDocument ? '#28C76F' : colorCode[index]),
                }" />
            </div>
          </div>
          <div class="col-md-3 col-12">
            <label class="form-label" for="last-name-column">Last Name</label>
            <div class="input-group mb-1">
              <span class="input-group-text p-0" :style="{
                border:
                  '1px solid' +
                  (participant.ownerDocument ? '#28C76F' : colorCode[index]),
                color: participant.ownerDocument ? '#28C76F' : colorCode[index],
              }">
                <Icon icon="ri:grid-fill" />
              </span>
              <input :readonly="!userDocument.is_the_owner_of_document" type="text" name="last_name"
                v-model="participant.user.last_name" class="form-control form-control-sm" :style="{
                  border:
                    '1px solid' +
                    (participant.ownerDocument ? '#28C76F' : colorCode[index]),
                }" />
            </div>
          </div>
          <div class="col-md-3 col-12">
            <label class="form-label" for="email-id-column">Email</label>
            <div class="input-group mb-1">
              <span class="input-group-text p-0" :style="{
                border:
                  '1px solid' +
                  (participant.ownerDocument ? '#28C76F' : colorCode[index]),
                color: participant.ownerDocument ? '#28C76F' : colorCode[index],
              }">
                <Icon icon="ri:grid-fill" />
              </span>
              <input :readonly="!userDocument.is_the_owner_of_document" type="email" name="email"
                v-model="participant.user.email" class="form-control form-control-sm" :style="{
                  border:
                    '1px solid' +
                    (participant.ownerDocument ? '#28C76F' : colorCode[index]),
                }" />
            </div>
          </div>
          <div class="col-md-3 col-12">
            <label class="form-label" for="role-column">Role</label>
            <div class="input-group mb-1">
              <span class="input-group-text p-0" :style="{
                border:
                  '1px solid' +
                  (participant.ownerDocument ? '#28C76F' : colorCode[index]),
                color: participant.ownerDocument ? '#28C76F' : colorCode[index],
              }">
                <Icon icon="ri:grid-fill" />
              </span>
              <select name="role" :disabled="!userDocument.is_the_owner_of_document" v-model="participant.role"
                class="form-select form-control-sm" :style="{
                  border:
                    '1px solid' +
                    (participant.ownerDocument ? '#28C76F' : colorCode[index]),
                }" required>
                <option value="">select role</option>
                <option :selected="participant.role == 'Signer' ? true : false">
                  Signer
                </option>
                <option :selected="participant.role == 'Viewer' ? true : false">
                  Viewer
                </option>
              </select>
            </div>
          </div>

          <template v-if="userDocument.is_the_owner_of_document === true">
            <div class="col-md-12">
              <small role="button" style="font-size: small" class="text-danger" @click="remove(participant.id)">
                Remove
              </small>
            </div>
          </template>
          <hr />
        </div>

        <div class="row">
          <div class="col-12">
            <button v-if="userDocument.is_the_owner_of_document === true" type="submit"
              class="btn btn-sm btn-primary waves-effect waves-float waves-light d-block ms-auto">
              Update
            </button>
          </div>
        </div>
      </form>
    </template>
  </ModalComp>

  <ModalComp :show="removeParticipantModal" :size="'modal-sm'" @close="removeParticipantModal = false">
    <template #header>
      <h4 class="text-danger mb-0">
        <Icon icon="eva:alert-triangle-outline" style="margin-bottom: 3px" />
        Alert
      </h4>
    </template>
    <template #body>
      <h5 class="modal-title text-center">
        Are you sure you want to remove this signer?
      </h5>
      <p class="fw-normal text-center">
        This will remove all tools added in the signer's name
      </p>
    </template>
    <template #footer>
      <div class="d-flex justify-content-end align-items-center">
        <button class="btn btn-sm btn-outline-danger" @click="deleteParticipant">
          Yes Remove
        </button>
      </div>
    </template>
  </ModalComp>
</template>

<script setup>
import { Icon } from "@iconify/vue";
import ModalComp from "@/components/ModalComp.vue";

import { computed, onMounted, ref, defineEmits, defineProps, watch } from "vue";
import { useGetters, useActions } from "vuex-composition-helpers/dist";

const { userDocument, profile, workingTools } = useGetters({
  profile: "auth/profile",
  userDocument: "document/userDocument",
  workingTools: "document/workingTools",
});

const { removeParticipant, editParticipant } = useActions({
  removeParticipant: "document/removeParticipant",
  editParticipant: "document/editParticipant",
});

workingTools.value = computed(() => {
  return workingTools.value;
});

const props = defineProps({ isOpen: Boolean });
const emit = defineEmits(["close"]);

const isOwner = ref(false);
const removeParticipantModal = ref(false);
const editSignerModal = ref(false);
const fullName = ref("");
const participantId = ref("");
const nameInitials = ref("");
const initialObj = ref([]);
const participants = ref(null);

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

watch(
  () => [userDocument.value.participants, props.isOpen],
  ([newUserDoc, newOpen]) => {
    if (newUserDoc) participants.value = newUserDoc;
    if (newOpen) editSignerModal.value = newOpen;
  }
);

const closeSignerModal = () => {
  editSignerModal.value = false;
  emit("close", true);
};

const getFirstLetters = (str) => {
  const firstLetters = str
    .split(" ")
    .map((word) => word[0])
    .join("");

  return firstLetters;
};

const onEditParticipant = () => {
  let formObj = [];
  participants.value.map((obj) => {
    formObj.push({
      document_id: userDocument.value.id,
      document_participant_id: obj.id,
      first_name: obj.user.first_name,
      last_name: obj.user.last_name,
      email: obj.user.email,
      phone: obj.user.phone,
      role: obj.role,
    });
  });

  editParticipant(formObj);
  editSignerModal.value = false;
  emit("close", true);
};

const remove = (params) => {
  removeParticipantModal.value = true;
  participantId.value = params;
};

const deleteParticipant = () => {
  removeParticipant(participantId.value);
  removeParticipantModal.value = false;
};

onMounted(() => {
  initialObj.value = [];
  if (participants.value == undefined) return;
  participants.value.map((params) => {
    fullName.value = params.user.first_name + " " + params.user.last_name;
    nameInitials.value = getFirstLetters(fullName.value);
    initialObj.value.push({
      id: params.id,
      initials: nameInitials.value,
      fullName: fullName.value,
    });
  });

  if (
    userDocument.value.participants != undefined ||
    userDocument.value.participants.length > 0
  ) {
    userDocument.value.participants.map((participant) => {
      if (participant.user.id === profile.value.id)
        return (isOwner.value = participant.ownerDocument);
    });
  }
});
</script>

<style scoped>
.email-app-sidebar {
  background: transparent !important;
}

.sidebar-nav.sticky {
  position: fixed !important;
  top: 165px;
  bottom: 0;
  background-color: #fff;
}

.isHover {
  background-image: linear-gradient(to right, #003bb3, #003bb3 50%, #000 50%);
  background-size: 200% 100%;
  background-position: -100%;
  display: inline-block;
  padding: 5px 0;
  position: relative;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  transition: all 0.3s ease-in-out;
}

.isHover:before {
  content: "";
  position: absolute;
  width: 100%;
  height: 2px;
  border-radius: 4px;
  background-color: #003bb3;
  bottom: 0;
  left: 0;
  transform-origin: right;
  transform: scaleX(0);
  transition: transform 0.3s ease-in-out;
}

.isHover:hover {
  background-position: 0;
}

.isHover:hover::before {
  transform-origin: left;
  transform: scaleX(1);
}

/* .email-application .content-area-wrapper .sidebar .email-app-sidebar {
  width: 225px !important;
} */

@media screen and (max-width: 1160px) {
  .custom-md-none {
    display: none;
  }
}
</style>
