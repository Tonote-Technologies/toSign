<template>
  <div class="list-group-item list-group-item-action p-2" v-if="tool.role == 'Viewer'">
    <h5>You are to bear witness to this document.</h5>
    <p>Thank you!</p>
  </div>
  <div v-else>
    <div class="tool p-2 d-flex justify-content-between align-items-center gap-1 flex-wrap">
      <li class="btn rounded-circle d-flex justify-content-center align-items-center"
        :class="{ blue: tool.userEmail && tool.participants_count != 0 }" :data-user="tool.userId"
        :data-email="tool.userEmail" data-value="Textarea" @click="
          isSignerSelected({
            toolId: 'textTool',
            tool_name: 'Textarea',
            user_id: tool.userId,
            userEmail: tool.userEmail,
            count: tool.participants_count,
          })
        ">
        <TextIcon />
      </li>

      <li class="btn rounded-circle d-flex justify-content-center align-items-center"
        :class="{ blue: tool.userEmail && tool.participants_count != 0 }" :data-user="tool.userId"
        :data-email="tool.userEmail" data-value="Sign" @click="
          isSignerSelected({
            toolId: 'signTool',
            tool_name: 'Signature',
            user_id: tool.userId,
            userEmail: tool.userEmail,
            count: tool.participants_count,
          })
        ">
        <Icon icon="mdi:file-sign" style="font-size: 1.5rem" />
      </li>

      <li class="btn rounded-circle d-flex justify-content-center align-items-center"
        :class="{ blue: tool.userEmail && tool.participants_count != 0 }" :data-user="tool.userId"
        :data-email="tool.userEmail" data-value="Initial" @click="
          isSignerSelected({
            toolId: 'initialTool',
            tool_name: 'Initial',
            user_id: tool.userId,
            userEmail: tool.userEmail,
            count: tool.participants_count,
          })
        ">
        <InitialIcon />
      </li>

      <li class="btn d-none rounded-circle d-flex justify-content-center align-items-center"
        :class="{ blue: tool.userEmail && tool.participants_count != 0 }" :data-user="tool.userId"
        :data-email="tool.userEmail" data-value="Date" @click="
          isSignerSelected({
            toolId: 'dateTool',
            tool_name: 'Date',
            user_id: tool.userId,
            userEmail: tool.userEmail,
            count: tool.participants_count,
          })
        ">
        <DateIcon />
      </li>

      <template v-if="plan == 'Business'">
        <li class="btn rounded-circle d-flex justify-content-center align-items-center"
          :class="{ blue: tool.userEmail && tool.participants_count != 0 }" :data-user="tool.userId"
          :data-email="tool.userEmail" data-value="Seal" @click="
            isSignerSelected({
              toolId: 'sealTool',
              tool_name: 'Seal',
              user_id: tool.userId,
              userEmail: tool.userEmail,
              count: tool.participants_count,
            })
          ">
          <SealIcon />
        </li>

        <li class="btn rounded-circle d-flex justify-content-center align-items-center"
          :class="{ blue: tool.userEmail && tool.participants_count != 0 }" :data-user="tool.userId"
          :data-email="tool.userEmail" data-value="Stamp" @click="
            isSignerSelected({
              toolId: 'stampTool',
              tool_name: 'Stamp',
              user_id: tool.userId,
              userEmail: tool.userEmail,
              count: tool.participants_count,
            })
          ">
          <StampIcon />
        </li>
      </template>

      <li class="btn rounded-circle d-flex justify-content-center align-items-center"
        :class="{ blue: tool.userEmail && tool.participants_count != 0 }" :data-user="tool.userId"
        :data-email="tool.userEmail" data-value="Image" @click="
          isSignerSelected({
            toolId: 'photoTool',
            tool_name: 'Photo',
            user_id: tool.userId,
            userEmail: tool.userEmail,
            count: tool.participants_count,
          })
        ">
        <ImageIcon />
      </li>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue';
import TextIcon from '@/icons/TextIcon.vue';
import InitialIcon from '@/icons/InitialIcon.vue';
import DateIcon from '@/icons/DateIcon.vue';
import SealIcon from '@/icons/SealIcon.vue';
import StampIcon from '@/icons/StampIcon.vue';
import ImageIcon from '@/icons/ImageIcon.vue';
import { ref, defineProps, defineEmits, watch } from 'vue';
import { useGetters } from 'vuex-composition-helpers/dist';
import { useToast } from 'vue-toast-notification';
const toast = useToast();

const { teams } = useGetters({ teams: 'team/teams' });

const plan = ref('');

teams.value?.map((team) => {
  if (team.active === true) plan.value = team.subscription.plan.name;
});

const props = defineProps({ tool: Object });
const emit = defineEmits(['bindTools']);

const tool = ref({});
watch(
  () => props.tool,
  (toolObj) => (tool.value = toolObj)
);

const isSignerSelected = (params) => {
  if (params.userEmail == '' || params.userEmail == undefined || params.count == 0)
    return toast.error('Kindly select a signer!', {
      timeout: 5000,
      position: 'top-right',
    });

  emit('bindTool', params);
};
</script>

<style scoped>
.tool {
  padding: 0.58rem 1.5rem !important;
}
</style>
