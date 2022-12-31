<template>
  <div class="sidebar-left">
    <div class="sidebar">
      <div class="email-app-sidebar">
        <div class="email-app-menu">
          <div class="sidebar-menu-list sidebar-nav sticky shadow" style="width: 260px">
            <div class="list-group list-group-messages">
              <template v-if="profile?.id">
                <div class="list-group-item border-bottom">
                  Tool Management
                </div>
                <div v-show="!hasRole" class="text-center mt-5">
                  <span class="spinner-border spinner-border-sm"></span>
                  Loading...
                </div>
                <div class="mt-1" v-if="hasRole">
                  <ToolKits @bindTool="addMouseMoveListener" />
                </div>
              </template>
              <template v-else>
                <div class="list-group-item border-bottom">
                  <label class="form-label">Welcome!</label>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="tool-box textTool" id="textTool">
    <input aria-invalid="false" type="text" class="v-textareaTool w-100" value="" />
  </div>

  <div class="tool-box tool-style signTool" id="signTool">
    <div class="element">Sign<i data-feather="arrow-down-right"></i></div>
  </div>

  <div class="tool-box tool-style initialTool" id="initialTool">
    <div class="element">Initial<i data-feather="arrow-down-right"></i></div>
  </div>

  <div class="tool-box tool-style stampTool" id="stampTool">
    <div class="element">Stamp<i data-feather="arrow-down-right"></i></div>
  </div>

  <div class="tool-box tool-style sealTool" id="sealTool">
    <div class="element">Seal<i data-feather="arrow-down-right"></i></div>
  </div>

  <div class="tool-box dateTool" id="dateTool">
    <div class="element">Date<i data-feather="arrow-down-right"></i></div>
  </div>

  <div class="tool-box tool-style photoTool" id="photoTool">
    <div class="element">Image<i data-feather="arrow-down-right"></i></div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps, watch } from "vue";
import { useGetters, useActions } from "vuex-composition-helpers/dist";

import "jquery/dist/jquery.min";
import $ from "jquery";

import ToolKits from "@/components/Document/Edit/Tools/ToolKits.vue";

const { profile } = useGetters({
  profile: "auth/profile",
});

const { resourceTools } = useActions({
  resourceTools: "signLink/resourceTools",
});

/* ------- // *** Props from views\documents\DocumentEdit.vue (PARENT) ------ */
const props = defineProps({ chunkFileId: String, isOpen: Boolean });

const watchFileId = ref("");

watch(
  () => props.chunkFileId,
  (newChunkF) => {
    watchFileId.value = newChunkF;
  }
);

const hasRole = ref(false);

const tempStorage = ref(null);
const tool_class = ref("");
const tool_id = ref("");
const tempData = ref(false);

const participantId = ref("");

const addMouseMoveListener = (params) => {
  tempData.value = true;
  let count = 1;
  tempStorage.value = params;
  $(document).bind("mousemove", function (e) {
    count = count + 1;
    tool_id.value = count;
    $("." + params.toolId).attr("id", count);
    $("." + params.toolId).css({
      display: "block",
      left: e.pageX + 2,
      top: e.pageY - 1,
    });
  });
};

$(document).on("click", "#mainWrapper", function (e) {
  if (tempStorage.value == null) return;
  $("#" + tool_id.value).css("display", "none");
  removeMouseMoveListener();

  let posX = $(this).offset().left;
  let posY = $(this).offset().top;
  let x = e.pageX - posX + 2;
  let y = e.pageY - posY - 5;

  const toolName = tempStorage.value.tool_name;
  if (toolName == "Sign" || toolName == "Initial") {
    tool_class.value = "tool-box tool-style main-element";
  } else if (toolName == "Textarea" || toolName == "Date") {
    tool_class.value = "main-element";
  } else if (toolName == "Photo") {
    tool_class.value = "main-element";
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

onMounted(() => {
  setTimeout(() => {
    hasRole.value = true;
  }, 1000);
});
</script>

<style scoped>
.list-group-item:hover {
  color: #6E6B7B !important;
}

.email-app-sidebar {
  background: transparent !important;
}

.sidebar-nav.sticky {
  position: fixed !important;
  top: 165px;
  bottom: 0;
  background-color: #fff;
}

.btn.custom {
  padding: 0.786rem 0.5rem !important;
}

::-webkit-scrollbar {
  width: 3px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
