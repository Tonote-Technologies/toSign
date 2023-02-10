<template>
  <div class="sidebar-left">
    <div class="sidebar">
      <div class="sidebar-content email-app-sidebar">
        <div class="email-app-menu">
          <div class="sidebar-menu-list ps ps--active-y">
            <div class="list-group list-group-messages">

              <template v-if="userDocument.is_the_owner_of_document === true">
                <div class="list-group-item">
                  <div class="d-flex justify-content-between align-items-center">
                    <label class="form-label" for="select-signer" style="flex:200px">Select a signer</label>
                    <AddSelfToSignatories :mobile="true" />
                  </div>
                  <select class="form-select select2" @change="selectSigner" v-model="signerEmail" id="select-signer">
                    <option value="">Select Signer</option>
                    <option v-for="(signer, index) in filteredParticipant" :key="index" :data-email="signer.user.email"
                      :value="signer.user.email">
                      {{ signer.user.first_name }} {{ signer.user.last_name }}
                    </option>
                  </select>
                </div>
              </template>
              <template v-else>
                <div class="list-group-item border-bottom">
                  <label class="form-label">Current participant</label>
                  <p class="mb-0">
                    {{ profile.first_name }} {{ profile.last_name }}
                    <span class="badge bg-warning">{{ role }}</span>
                  </p>
                </div>
              </template>

              <div v-show="!hasRole" class="text-center mt-5 mt-custom">
                <span class="spinner-border spinner-border-sm"></span>
                Loading...
              </div>
              <div v-show="hasRole">
                <ToolKitsMobile :tool="toolKit" @bindTool="addMouseMoveListener" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <ModalComp :show="addParticipantModal" :footer="false" @close="closeParticipantModal">
    <template #header>
      <h5 class="modal-title">Add participants</h5>
    </template>

    <template #body>
      <AddSigner @close="closeParticipantModal" />
    </template>
  </ModalComp>
</template>

<script setup>
import ModalComp from "@/components/ModalComp.vue";
import AddSelfToSignatories from "@/components/Document/Edit/Left/AddSelfToSignatories.vue";
import AddSigner from "@/components/Document/Edit/Left/AddSigner.vue";
import ToolKitsMobile from "@/components/Document/Edit/Mobile/ToolKitsMobile.vue";

import { ref, onMounted, defineProps, defineEmits, watch, onUpdated } from "vue";
import { useGetters, useActions } from "vuex-composition-helpers/dist";

import "jquery/dist/jquery.min";
import $ from "jquery";

const { profile, userDocument } = useGetters({
  profile: "auth/profile",
  userDocument: "document/userDocument",
});

const { resourceTools } = useActions({ resourceTools: "document/resourceTools" });

/* ------- // *** Props from views\documents\DocumentEdit.vue (PARENT) ------ */
const props = defineProps({ chunkFileId: String, isOpen: Boolean });
const emit = defineEmits(['close'])
const watchFileId = ref("");

watch(
  () => [userDocument.value, props.chunkFileId, props.isOpen],
  ([newUserDoc, newChunkF, newOpen]) => {
    if (newChunkF) { watchFileId.value = newChunkF }

    if (newUserDoc) {
      filteredParticipant.value = newUserDoc.participants.filter((r) => r.role != "Viewer");
    }

    if (newOpen) { addParticipantModal.value = newOpen }

  },
  { deep: true }
);

const addParticipantModal = ref(false);
const filteredParticipant = ref("");
const hasRole = ref(false);
const role = ref("");
const signerEmail = ref("");
const participantId = ref("");

const tempStorage = ref(null);
const tool_class = ref("");
const tool_id = ref("");
const toolKit = ref({});
const tempData = ref(false);

const closeParticipantModal = () => {
  addParticipantModal.value = false
  emit('close', true)
}

const selectSigner = () => {
  const participantArray = filteredParticipant.value;

  participantArray.map((params) => {
    if (params.user.email == signerEmail.value) {
      participantId.value = params.user.id;
    }
  });

  toolKit.value = {
    userEmail: signerEmail.value,
    userId: participantId.value,
  };
};

const addMouseMoveListener = (params) => {
  tempData.value = true;

  let count = 1;
  tempStorage.value = params;

  $(document).bind("click", function (e) {
    count = count + 1;
    tool_id.value = count;

    $("." + params.toolId).attr("id", count);
    $("." + params.toolId).css({
      left: e.pageX,
      top: e.pageY,
    });
  });
};

$(document).on("click", "#mainWrapper", function (e) {
  if (tempStorage.value == null) return;
  $("#" + tool_id.value).css("display", "none");
  removeMouseMoveListener();

  let offset = $(this).offset();

  let x = e.pageX - offset.left - 50;
  let y = e.pageY - offset.top - 30

  const toolName = tempStorage.value.tool_name;

  if (toolName == "Sign" || toolName == "Initial") {
    tool_class.value = "tool-box tool-style main-element";
  } else if (toolName == "Textarea" || toolName == "Date") {
    tool_class.value = "main-element";
  } else if (toolName == "Photo") {
    tool_class.value = "main-element photo-style";
  } else {
    tool_class.value = "tool-box main-element";
  }

  let saveTools = {
    document_upload_id: watchFileId.value,
    user_id: participantId.value == "" ? profile.value.id : participantId.value,
    tool_name: toolName,
    tool_class: tool_class.value,
    tool_width: toolName == "Textarea" ? "120" : "100",
    tool_height: toolName == "Textarea" ? "25" : "40",
    tool_pos_top: y.toString(),
    tool_pos_left: x.toString(),
    category: toolName == "Textarea" ? "Type" : "",
    type: toolName == "Textarea" ? "Text" : "",
    value: "",
  };

  if (tempData.value === true) {
    resourceTools(saveTools);
    tempData.value = false;
  }
});

function removeMouseMoveListener() {
  $(document).unbind("mousemove");
}

onUpdated(() => {
  if (userDocument.value?.participants_count > 0) {
    userDocument.value?.participants.map((participant) => {
      if (participant?.user?.id == profile.value?.id) role.value = participant.role;
    });
  }
});

onMounted(() => {
  setTimeout(() => {
    hasRole.value = true
    toolKit.value = {
      participants_count: userDocument.value.participants_count,
      userEmail: profile.value.email,
      userId: profile.value.id,
      role: role.value,
    };
  }, 1000);

});
</script>

<style scoped>
.btn.custom {
  padding: 0.786rem 0.5rem !important;
}

.sidebar-nav.sticky {
  top: 160px;
}

@media screen and (max-width: 991.5px) {
  .mt-custom {
    margin: 1rem 0 !important;
  }
}
</style>
