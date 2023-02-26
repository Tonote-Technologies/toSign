<template>
  <div class="tool bg-white" style="height: 100vh">
    <li class="btn" @click="
      isSignerSelected({
        active: tool.active,
        userEmail: tool.userEmail,
        color: tool.color,
        isOld: tool.isOld,
        toolId: 'textTool',
        tool_name: 'Textarea',
      })
    " :style="{
  border:
    '2px solid ' +
    (tool.color?.owner && tool.userEmail != ''
      ? '#28C76F !important'
      : !tool.active
        ? '#333'
        : tool.color?.code + '!important'),
}">
      Text Area
      <TextIcon />
    </li>

    <li class="btn" @click="
      isSignerSelected({
        active: tool.active,
        userEmail: tool.userEmail,
        color: tool.color,
        isOld: tool.isOld,
        toolId: 'signTool',
        tool_name: 'Signature',
      })
    " :style="{
  border:
    '2px solid ' +
    (tool.color?.owner && tool.userEmail != ''
      ? '#28C76F !important'
      : !tool.active
        ? '#333'
        : tool.color?.code + '!important'),
}">
      Signature
      <Icon icon="mdi:file-sign" style="font-size: 1.5rem" />
    </li>

    <li class="btn" @click="
      isSignerSelected({
        active: tool.active,
        userEmail: tool.userEmail,
        color: tool.color,
        isOld: tool.isOld,
        toolId: 'initialTool',
        tool_name: 'Initial',
      })
    " :style="{
  border:
    '2px solid ' +
    (tool.color?.owner && tool.userEmail != ''
      ? '#28C76F !important'
      : !tool.active
        ? '#333'
        : tool.color?.code + '!important'),
}">
      Initial
      <InitialIcon />
    </li>

    <li class="btn d-none" @click="
      isSignerSelected({
        active: tool.active,
        userEmail: tool.userEmail,
        color: tool.color,
        isOld: tool.isOld,
        toolId: 'dateTool',
        tool_name: 'Date',
      })
    " :style="{
  border:
    '2px solid ' +
    (tool.color?.owner && tool.userEmail != ''
      ? '#28C76F !important'
      : !tool.active
        ? '#333'
        : tool.color?.code + '!important'),
}">
      Date Signed
      <DateIcon />
    </li>

    <template v-if="plan == 'Business'">
      <li class="btn" @click="
        isSignerSelected({
          active: tool.active,
          userEmail: tool.userEmail,
          color: tool.color,
          isOld: tool.isOld,
          toolId: 'sealTool',
          tool_name: 'Seal',
        })
      " :style="{
  border:
    '2px solid ' +
    (tool.color?.owner && tool.userEmail != ''
      ? '#28C76F !important'
      : !tool.active
        ? '#333'
        : tool.color?.code + '!important'),
}">
        Seal
        <SealIcon />
      </li>

      <li class="btn" @click="
        isSignerSelected({
          active: tool.active,
          userEmail: tool.userEmail,
          color: tool.color,
          isOld: tool.isOld,
          toolId: 'stampTool',
          tool_name: 'Stamp',
        })
      " :style="{
  border:
    '2px solid ' +
    (tool.color?.owner && tool.userEmail != ''
      ? '#28C76F !important'
      : !tool.active
        ? '#333'
        : tool.color?.code + '!important'),
}">
        Stamp
        <StampIcon />
      </li>
    </template>

    <li class="btn" @click="
      isSignerSelected({
        active: tool.active,
        userEmail: tool.userEmail,
        color: tool.color,
        isOld: tool.isOld,
        toolId: 'photoTool',
        tool_name: 'Photo',
      })
    " :style="{
  border:
    '2px solid ' +
    (tool.color?.owner && tool.userEmail != ''
      ? '#28C76F !important'
      : !tool.active
        ? '#333'
        : tool.color?.code + '!important'),
}">
      Image
      <ImageIcon />
    </li>
</div>
</template>

<script setup>
import { Icon } from "@iconify/vue";
import TextIcon from "@/icons/TextIcon.vue";
import InitialIcon from "@/icons/InitialIcon.vue";
import DateIcon from "@/icons/DateIcon.vue";
import SealIcon from "@/icons/SealIcon.vue";
import StampIcon from "@/icons/StampIcon.vue";
import ImageIcon from "@/icons/ImageIcon.vue";

import { ref, defineProps, defineEmits, watch } from "vue";
import { useGetters } from "vuex-composition-helpers/dist";
import { useToast } from "vue-toast-notification";
const toast = useToast();

const { teams } = useGetters({ teams: "team/teams" });

const plan = ref("");

teams.value.map((team) => {
  if (team.active === true) return (plan.value = team.subscription.plan.name);
});

const props = defineProps({ tool: Object, owner: Object });
const emit = defineEmits(["bindTools"]);

const tool = ref({});
watch(
  () => props.tool,
  (toolObj) => {
    if (toolObj) {
      tool.value = toolObj;
    }
  }
);

const isSignerSelected = (params) => {
  if (params.userEmail == "" || params.color == null || !params.active)
    return toast.error("Kindly select a signer!", {
      timeout: 5000,
      position: "top-right",
    });

  emit("bindTool", params);
};
</script>

<style scoped>
.tool {
  padding: 0.58rem 1.5rem !important;
}
</style>
