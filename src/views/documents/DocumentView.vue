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
        <router-link :to="{ name: 'document.edit', params: { document_id: uri } }" class="btn btn-sm btn-primary">
          Edit</router-link>
        <button class="btn btn-sm btn-primary ms-auto d-none" @click="finishModal = true">Finish</button>
      </div>
    </div>

    <div class="row">
      <div class="col-lg-9 mx-auto">
        <div class="card">
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
                <div class="email-info-dropup dropdown"><span role="button" class="font-small-3" style="color: #003bb3">
                    Participants:
                    <template v-if="!theDoc">
                      <span>
                        <span class="spinner-border spinner-border-sm"></span>
                        Loading...
                      </span>
                    </template>
                    <template v-else>
                      <span v-for="(participant, index) in theDoc.participants" :key="index">
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

          <div class="card-body mail-message-wrapper pt-2 border-top" v-for="(doc, index) in theDoc.documentUploads"
            :key="index">
            <RenderPDFDoc :file="doc.file_url" />
          </div>
        </div>
      </div>

      <div class="col-lg-3">
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

import { ref, onMounted, watch, computed } from "vue";
import moment from "moment";

import { useActions, useGetters } from "vuex-composition-helpers/dist";
import { useRouter } from "vue-router";
import RenderPDFDoc from "@/components/Document/Edit/Main/RenderPDFDoc.vue";
import { useToast } from "vue-toast-notification";

const toast = useToast();
const route = useRouter();

const { link, documentAuditTrail } = useGetters({
  profile: "auth/profile",
  link: "signLink/link",
  documentAuditTrail: "signLink/documentAuditTrail",
});

const { getLink, getAuditTrail, finishAnnotation } = useActions({
  getLink: "signLink/getLink",
  getAuditTrail: "signLink/getAuditTrail",
  finishAnnotation: "document/finishAnnotation",
});

const finishModal = ref(false);
const loading = ref(false);
const isLoading = ref(true);
const uri = ref("");
const theDoc = ref("");

const audited = ref([]);
const audit = computed(() => {
  let audit = documentAuditTrail.value.filter(str => {
    const longName = str.log_name.split(' ', 2);
    for (let i = 0; i < longName.length; i++) {
      longName[i] = longName[i].charAt(0).toUpperCase() + longName[i].slice(1);
      const participantName = longName.join(' ');

      const auditObj = {
        full_name: participantName,
        signed_date: createdAt(str.created_at),
        added_text: str.log_name,
      }
      return audited.value.push(auditObj)
    }
  })
  return audit
});

watch(
  () => link.value,
  (newLink, oldLink) => {
    if (newLink != oldLink) {
      theDoc.value = newLink;
    }
  },

  { deep: true }
);

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
  uri.value = route.currentRoute.value.params.document_id;
  getLink(uri.value);
  getAuditTrail(uri.value);
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

.scrollable {
  height: 72vh;
  overflow-y: auto;
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
