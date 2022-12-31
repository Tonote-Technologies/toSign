<template>
  <div v-if="isLoading" class="grid">
    <PreLoader />
  </div>
  <div v-else class="custom-mt">
    <div class="card p-2">
      <div class="d-flex justify-content-between align-items-center">
        <div class="m-0">
          <router-link :to="{ name: 'Document' }" class="btn btn-sm btn-secondary me-1">
            &larr; Go back <span class="d-none d-lg-inline-block">to documents</span>
          </router-link>
        </div>
        <div class="text-center">
          <button class="btn btn-sm btn-primary waves-effect me-1" @click="exportPDF">
            Download
          </button>
          <button class="btn btn-sm btn-primary waves-effect">
            Share
          </button>
          <button class="btn btn-sm btn-primary ms-auto d-none" @click="finishModal = true">Finish</button>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-lg-9 mx-auto">
        <div class="card">
          <div class="card-header email-detail-head">
            <div class="user-details d-flex justify-content-between align-items-center flex-wrap">
              <div class="mail-items">
                <h5 class="text-capitalize mb-0">
                  <template v-if="!resPreview">
                    <span>
                      <span class="spinner-border spinner-border-sm"></span>
                      Loading...
                    </span>
                  </template>
                  <template v-else>
                    {{ resPreview.title }}
                  </template>

                </h5>
                <div class="email-info-dropup dropdown">
                  Response from:
                  <span class="font-small-3" style="color: #003bb3">
                    {{ resPreview.data.first_name + " " + resPreview.data.last_name }}
                  </span>
                </div>
              </div>
            </div>
            <div class="mail-meta-item d-flex align-items-center">
              <small class="mail-date-time text-dark fw-normal">
                {{ createdAt(resPreview.data.created_at) }}</small>
            </div>
          </div>

          <div class="card-body mail-message-wrapper pt-2 border-top" id="download_res_doc">
            <RenderPage :file="resPreview.data.file_url" />
          </div>
        </div>
      </div>

      <div class="col-lg-3 d-none">
        <div class="card">
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
              <ul class="timeline">
                <li class="timeline-item" v-for="(participant, index) in theDoc.participants" :key="index">
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
                    <div class="d-flex justify-content-between flex-sm-row flex-column mb-sm-0 mb-1">
                      <h6 class="text-dark text-capitalize">
                        {{ participant.user.first_name }}
                        {{ participant.user.last_name }} ({{ participant.role }})
                      </h6>
                      <span class="timeline-event-time text-dark">
                        {{ createdAt("2022-07-01 03:12:21") }}</span>
                    </div>
                    <p>Added text</p>
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
        <i>Please confirm that all <br /> participants are done editing.</i>
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
import PreLoader from "@/components/PreLoader.vue";
import ModalComp from "@/components/ModalComp.vue";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import { ref, onMounted } from "vue";
import moment from "moment";

import { useActions, useGetters } from "vuex-composition-helpers/dist";
import { useRouter } from "vue-router";
import RenderPage from "@/components/Document/Edit/Main/RenderPDFDoc.vue";
import { useToast } from "vue-toast-notification";

const toast = useToast();
const route = useRouter();

const { resPreview } = useGetters({
  resPreview: "signLink/resPreview",
});

const { finishAnnotation } = useActions({
  getLink: "signLink/getLink",
  finishAnnotation: "document/finishAnnotation",
});

const finishModal = ref(false);
const loading = ref(false);
const isLoading = ref(true);
const uri = ref("");
const theDoc = ref("");

const exportPDF = () => {
  const data = document.getElementById("download_res_doc");
  html2canvas(data).then((canvas) => {
    const imgWidth = 208;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight - 10;
    let position = 10;

    heightLeft -= pageHeight;

    const doc = new jsPDF("p", "mm");

    doc.addImage(canvas, "PNG", 0, position, imgWidth, imgHeight, "", "FAST");

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      doc.addPage();
      doc.addImage(canvas, "PNG", 0, position, imgWidth, imgHeight, "", "FAST");
      heightLeft -= pageHeight;
    }

    doc.save(resPreview.value.title + ".pdf");
  });
};

const confirmEdit = () => {
  loading.value = true;
  finishModal.value = false;

  finishAnnotation(uri.value)
  toast.success("Document annotation completed", { timeout: 5000, position: "top-right" });

  setTimeout(() => {
    loading.value = false
    route.push({ name: 'Document', query: { status: 'completed' } })
  }, 1000);
};

const createdAt = (dateParams) => {
  return moment(dateParams).format("MMM. Do, YYYY [at] h:mm:ss a");
};

onMounted(() => {
  setTimeout(() => { isLoading.value = false }, 1000);
});
</script>

<style scoped>
.grid {
  display: grid;
  place-items: center;
  height: 70vh;
  width: 100%;
}

.custom-mt {
  margin-top: -15px !important;
}

@media screen and (max-width: 991.5px) {
  .custom-mt {
    margin-top: -40px !important;
  }
}
</style>
