<template>
  <div class="content-right border-0">
    <div @click="$emit('open', (openSide = true))" class="d-none sidebar-toggle d-block d-lg-none ms-1 my-1">
      <MenuIcon />
    </div>

    <div class="content-body">
      <div class="body-content-overlay" :class="{ show: dashboard.isOpened }" @click="dashboard.setIsOpened(false)">
      </div>
      <div class="email-app-list">
        <div class="email-user-list">
          <div class="card shadow-none bg-light">
            <div class="card-body shadow-none px-1">
              <p>Title: {{ theDoc.title }}</p>
              <div id="mainWrapper" class="mx-auto" :style="{ width: '815px' }">
                <RenderPage v-for="doc in sortedFile" :key="doc.id" :file="doc.file_url" @click="$emit('docId', doc.id)"
                  @pageId="getPageId" @documentHeight="getHeight">
                  <template #document-tools>
                    <template v-if="theTools?.length != 0 && documentHeight">
                      <div v-for="tool in activeTaskFilter(theTools, doc.id)" :key="tool.id" class="parent"
                        :style="{ height: documentHeight + 'px' }">
                        <ToolAnnotation @remove="remove" :tool="tool" :owner="{
                          isOwner: theDoc.is_the_owner_of_document,
                          name: theDoc.document_owner,
                        }" />
                      </div>
                    </template>
                  </template>
                </RenderPage>
              </div>
            </div>
          </div>
        </div>

        <div class="ps__rail-y" style="top: 0px; height: 100px; right: 0px">
          <div class="ps__thumb-y" tabindex="0" style="top: 0px; height: 100px"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { dashboard } from "@/store/dashboard";
import ToolAnnotation from "@/components/Document/Edit/Tools/ToolAnnotation.vue";
import RenderPage from "./RenderPage.vue";
import MenuIcon from "@/icons/MenuIcon.vue";

import { ref, onMounted, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { useGetters, useActions } from "vuex-composition-helpers/dist";

const router = useRouter();

const { userDocument, workingTools, isLoading } = useGetters({
  workingTools: "document/workingTools",
  userDocument: "document/userDocument",
  isLoading: "document/isLoading",
});

const { getUserDocument, getTools, removeTool } = useActions({
  getUserDocument: "document/getUserDocument",
  getTools: "document/getTools",
  removeTool: "document/removeTool",
});

const openSide = ref(false);
const theDoc = ref("");
const theTools = ref([]);
const documentHeight = ref(0);

const activeTaskFilter = (tools, docUpId) => {
  let activeTasks = tools.filter((tool) => {
    return tool.document_upload_id === docUpId;
  });
  return activeTasks;
};

watch(
  () => [userDocument.value, isLoading.value],
  ([newDoc, newTool], [oldDoc, oldTool]) => {
    if (oldDoc != newDoc) {
      theDoc.value = newDoc;
    }

    if (oldTool != newTool) theTools.value = workingTools.value;
  },
  { deep: true }
);

const getHeight = (event) => (documentHeight.value = event);

const remove = (params) => removeTool(params);

const sortedFile = computed(() => {
  const files = [];
  userDocument.value?.documentUploads?.filter((item) => {
    // if (item.status == 'Processing') {
    if (item.status == "Processing" && item.number_ordering != null) {
      files.push({ id: item.id, file_url: item.file_url, number: item.number_ordering });
    }
    files.sort((a, b) => (a.number > b.number ? 1 : -1));
  });
  return files;
});

const uri = ref("");
onMounted(() => {
  uri.value = router.currentRoute.value.params.document_id;
  getUserDocument(uri.value);
  getTools(uri.value);
});
</script>

<style scoped>
.parent {
  width: 815px;
  position: absolute;
  user-select: none;
}

.email-application .content-area-wrapper .email-user-list {
  height: auto;
}

.custom-box {
  width: 28px;
  height: 28px;
}
</style>
