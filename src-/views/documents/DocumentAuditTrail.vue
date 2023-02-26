<template>
  <div v-if="isLoading" class="grid">
    <PreLoader />
  </div>
  <div v-else class="custom-mt">
    <div class="card p-2">
      <div class="d-flex justify-content-between align-items-center">
        <div class="m-0">
          <router-link :to="{ name: 'Dashboard' }" class="btn btn-sm btn-secondary me-1">
            &larr; Go back <span class="d-none d-lg-inline-block">to documents</span>
          </router-link>
          <router-link v-if="
            userDocument.entry_point == 'Docs' &&
            userDocument.allowed_seal_per_unit == null
          " :to="{ name: 'document.edit', params: { document_id: uri } }" class="btn btn-sm btn-primary">
            Edit</router-link>
        </div>
        <div class="d-action">
          <button class="btn btn-sm btn-outline-primary waves-effect mx-1" @click="exportHTMLToPDF"
            :disabled="isDownload">
            <template v-if="isDownload">
              <span class="spinner-border spinner-border-sm"></span>
              <span class="d-none d-md-block">
                Downloading
              </span>
            </template>
            <template v-else>
              <span class="d-md-none d-xs-block">
                <Icon icon="bx:download" style="font-size: 1rem" />
              </span>
              <span class="d-none d-md-block">Download</span>
            </template>
          </button>
          <button class="btn btn-sm btn-primary ms-auto" @click="finishModal = true">
            Finish
          </button>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-lg-8 mx-auto">
        <div class="card" :style="{ width: '860px' }">
          <div class="card-header email-detail-head">
            <div class="user-details d-flex justify-content-between align-items-center flex-wrap">
              <div class="mail-items">
                <h5 class="text-capitalize mb-0">
                  <template v-if="!theDoc">
                    <span>
                      <span class="spinner-border spinner-border-sm"></span>
                      Loading...
                    </span>
                  </template>
                  <template v-else>
                    {{ theDoc.title }}
                  </template>
                </h5>

                <div class="email-info-dropup dropdown">
                  <span role="button" class="font-small-3">
                    Participants:
                    <template v-if="!theDoc">
                      <span>
                        <span class="spinner-border spinner-border-sm"></span>
                        Loading...
                      </span>
                    </template>
                    <template v-else>
                      <span v-for="(participant, index) in theDoc.participants" :key="index" style="color: #003bb3">
                        {{ participant.user.first_name + ", " }}
                      </span>
                    </template>
                  </span>
                </div>
              </div>
            </div>
            <div class="mail-meta-item d-flex align-items-center">
              <template v-if="!theDoc">
                <span>
                  <span class="spinner-border spinner-border-sm"></span>
                  Loading...
                </span>
              </template>
              <template v-else>
                <small class="mail-date-time text-dark fw-normal">
                  {{ createdAt(theDoc.created_at) }}</small>
              </template>
            </div>
          </div>

          <div class="divider bg-light pb-1 m-0"></div>

          <div class="card-body bg-light mail-message-wrapper py-0">
            <div id="mainWrapper" class="mx-auto mb-2" :style="{ width: '815px' }">
              <RenderPage v-for="doc in sortedFile" :key="doc.id" :file="doc.file_url" @click="$emit('docId', doc.id)"
                @documentHeight="getHeight" :oldDoc="{ isOld: doc.isOldDoc }">
                <template #document-tools>
                  <template v-if="computedTools?.length != 0 && documentHeight">
                    <div v-for="tool in activeTaskFilter(computedTools, doc.id)" :key="tool.id" class="parent"
                      :style="{ height: documentHeight + 'px' }">
                      <ToolAnnotation @remove="remove" :tool="tool" comp="audit" :owner="{
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

      <div class="col-lg-4">
        <div class="card scrollable">
          <div class="card-header">
            <h4 class="card-title">Audit Trail</h4>
          </div>
          <div class="card-body">
            <template v-if="!theDoc">
              <div class="text-center">
                <span class="spinner-border spinner-border-sm"></span>
                Loading...
              </div>
            </template>
            <template v-else>
              <ul class="timeline" v-if="audit">
                <li class="timeline-item" v-for="(item, index) in audited" :key="index">
                  <template v-if="theDoc.status == 'New'">
                    <span class="timeline-point timeline-point-secondary timeline-point-indicator"></span>
                  </template>
                  <template v-else-if="theDoc.status == 'Sent'">
                    <span class="timeline-point timeline-point-primary timeline-point-indicator"></span>
                  </template>
                  <template v-else>
                    <span class="timeline-point timeline-point-success timeline-point-indicator"></span>
                  </template>
                  <div class="timeline-event">
                    <div class="mb-sm-0 mb-1">
                      <h6 class="text-dark text-capitalize">
                        {{ item.full_name }}
                      </h6>
                      <small class="timeline-event-time text-dark">
                        {{ item.signed_date }}</small>
                    </div>
                    <p>{{ item.added_text }}t</p>
                  </div>
                </li>
              </ul>
            </template>

            <div class="d-flex justify-content-end mt-4">
              <img src="@/assets/logo-dark.png" height="15" alt="ToNote Brand" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <ModalComp :show="finishModal" :size="'modal-sm'" @close="finishModal = false">
    <template #header>
      <h4 class="modal-title text-warning mb-0">
        <Icon icon="mdi:alert-circle-check-outline" style="margin-bottom: 3px" />
        Alert
      </h4>
    </template>

    <template #body>
      <p class="text-center">
        <i>Please confirm that all <br />
          participants are done editing.</i>
      </p>
    </template>

    <template #footer>
      <button class="btn btn-sm btn-primary" @click="confirmEdit" :disabled="loading">
        <span v-show="loading" class="spinner-border spinner-border-sm"></span>
        Confirm
      </button>
    </template>
</ModalComp>
</template>

<script setup>
import { Icon } from "@iconify/vue";
import PreLoader from "@/components/PreLoader.vue";
import ModalComp from "@/components/ModalComp.vue";
import ToolAnnotation from "@/components/Document/Edit/Tools/ToolAnnotation.vue";

import { ref, onMounted, watch, computed } from "vue";
import moment from "moment";
import jsPDF from "jspdf";
import html2pdf from "html2pdf.js";

import { useActions, useGetters } from "vuex-composition-helpers/dist";
import { useRouter } from "vue-router";
import RenderPage from "@/components/Document/Edit/Main/RenderPage.vue";
import { useToast } from "vue-toast-notification";

const toast = useToast();
const route = useRouter();

const { userDocument, workingTools, documentAuditTrail } = useGetters({
  profile: "auth/profile",
  userDocument: "document/userDocument",
  workingTools: "document/workingTools",
  documentAuditTrail: "document/documentAuditTrail",
});

const {
  getUserDocument,
  getTools,
  getAuditTrail,
  finishAnnotation,
  doneEditing,
} = useActions({
  getUserDocument: "document/getUserDocument",
  getAuditTrail: "document/getAuditTrail",
  getTools: "document/getTools",
  finishAnnotation: "document/finishAnnotation",
  doneEditing: "document/doneEditing",
});

const theTools = ref([]);
const documentHeight = ref(0);

const computedTools = computed(() => {
  return workingTools.value;
});

const activeTaskFilter = (tools, docUpId) => {
  let activeTasks = tools.filter((tool) => {
    return tool.document_upload_id === docUpId;
  });
  return activeTasks;
};

const getHeight = (event) => (documentHeight.value = event);

const finishModal = ref(false);
const loading = ref(false);
const isLoading = ref(true);
const uri = ref("");
const theDoc = ref("");

const audited = ref([]);
const audit = computed(() => {
  let audit = documentAuditTrail.value.filter((str) => {
    const longName = str.log_name.split(" ", 2);
    for (let i = 0; i < longName.length; i++) {
      longName[i] = longName[i].charAt(0).toUpperCase() + longName[i].slice(1);
      const participantName = longName.join(" ");

      const auditObj = {
        full_name: participantName,
        signed_date: createdAt(str.created_at),
        added_text: str.log_name,
      };
      return audited.value.push(auditObj);
    }
  });
  return audit;
});

watch(
  () => [userDocument.value, isLoading.value],
  ([newUserDoc, newTool], [oldUserDoc, oldTool]) => {
    if (newUserDoc != oldUserDoc) {
      theDoc.value = newUserDoc;
      if (
        theDoc.value.documentUploads.length > 0 &&
        theDoc.value.entry_point != "Docs" &&
        theDoc.value.status == "Completed"
      ) {
        return sortedDocumentUploads(theDoc.value);
      }
      sortedDocumentUploads(theDoc.value);
    }

    if (oldTool != newTool) theTools.value = workingTools.value;
  }
);

const confirmEdit = () => {
  loading.value = true;
  finishModal.value = false;

  finishAnnotation(uri.value);
  toast.success("Document annotation completed", {
    timeout: 5000,
    position: "top-right",
  });

  setTimeout(() => {
    loading.value = false;
    route.push({ name: "Dashboard", query: { status: "completed" } });
  }, 1000);
};

const createdAt = (dateParams) => {
  return moment(dateParams).format("MMM. Do, YYYY [at] h:mm:ss a");
};

const isDownload = ref(false);
const doneDataUrl = ref([]);
const exportHTMLToPDF = async (params) => {
  isDownload.value = true;
  const pages = document.getElementsByClassName("downloader");

  const opt = {
    margin: [0, 0, -2, 0],
    filename: userDocument.value.title,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { dpi: 192, letterRendering: true },
    jsPDF: { unit: "in", format: "letter", orientation: "portrait", compressPDF: true },
  };

  const doc = new jsPDF(opt.jsPDF);
  const pageSize = jsPDF.getPageSize(opt.jsPDF);

  doc.setProperties({
    title: userDocument.value.title,
    // subject: 'This is the subject',
    author: "ToNote",
    keywords: "To-Sign, e-signing, web 1.0",
    creator: "ToNote Technologies",
  });

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];

    if (params != "done") {
      const pageImage = await html2pdf().set(opt).from(page).outputImg();
      if (i != 0) doc.addPage();
      doc.addImage(
        pageImage.src,
        "jpeg",
        opt.margin[0],
        opt.margin[0],
        pageSize.width,
        pageSize.height
      );
    } else {
      await html2pdf()
        .set(opt)
        .from(page)
        .outputPdf()
        .then(function (pdf) {
          doneDataUrl.value.push("data:application/pdf;base64," + btoa(pdf));
        });
    }
  }

  if (params == "done") {
    if (pages.length === doneDataUrl.value.length) isDoneEdit();
    return;
  }

  const pdf = doc.save(opt.filename);
  if (pdf) isDownload.value = false;
  return pdf;
};

const isDoneEdit = () => {
  let dataObj = {
    document_id: uri.value,
    files: doneDataUrl.value,
  };
  doneEditing(dataObj);
};

// const confirmEdit = () => {
//   if (!userDocument.value.is_the_owner_of_document) {
//     exportHTMLToPDF('done');
//   } else {
//     window.location.href = redirectToUserDashboard.value + '/redirecting?qt=' + token.value;
//   }
// };

const files = ref([]);
const sortedFile = ref("");

function sortedDocumentUploads(params) {
  params.documentUploads?.filter((item) => {
    if (item.status == 'Processing' && item.number_ordering != null) {
      files.value.push({ id: item.id, file_url: item.file_url, number: item.number_ordering, isOldDoc: false });
    }
    if (item.status == 'Processing' && item.created_at.includes('2022')) {
      files.value.push({ id: item.id, file_url: item.file_url, isOldDoc: true });
    }
    files.value.sort((a, b) => (a.number > b.number ? 1 : -1));
  });
  sortedFile.value = files.value.sort((a, b) => (a.number > b.number ? 1 : -1));
}

onMounted(() => {
  uri.value = route.currentRoute.value.params.document_id;
  getUserDocument(uri.value);
  getAuditTrail(uri.value);
  getTools(uri.value);

  setTimeout(() => {
    isLoading.value = false;
  }, 1000);

  setTimeout(() => {
    if (window.Tawk_API) {
      window.Tawk_API.hideWidget();
    }
  }, 2000);
});
</script>

<style scoped>
.parent {
  width: 815px;
  position: absolute;
  user-select: none;
}

.grid {
  display: grid;
  place-items: center;
  height: 70vh;
  width: 100%;
}

.scrollable {
  height: 72vh;
  overflow-y: auto;
}

* {
  scrollbar-width: thin;
  scrollbar-color: #999 #eee;
}

*::-webkit-scrollbar {
  width: 12px;
}

*::-webkit-scrollbar-track {
  background: #eee;
}

*::-webkit-scrollbar-thumb {
  background-color: #999;
  border-radius: 20px;
  border: 3px solid #eee;
}

.custom-mt {
  margin-top: -15px !important;
  min-width: 390px;
}

@media screen and (max-width: 991.5px) {
  .custom-mt {
    margin-top: -40px !important;
  }
}
</style>
