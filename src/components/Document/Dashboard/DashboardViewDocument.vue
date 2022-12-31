<template>
  <div class="card">
    <div class="card-header">
      <div class="user-details d-flex justify-content-between align-items-center flex-wrap">
        <div class="mail-items">
          <template v-if="!theDocs">
            <span>
              <span class="spinner-border spinner-border-sm"></span>
              Loading...
            </span>
          </template>
          <template v-else>
            <h5 class="text-capitalize mb-0">{{ theDocs.title }}</h5>
            <div class="email-info-dropup dropdown fw-normal">
              <span role="button" class="dropdown-toggle font-small-3 text-muted" id="card_top01"
                data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Participants: ({{ theDocs.participants_count }})
              </span>
              <div class="dropdown-menu" aria-labelledby="card_top01">
                <table class="table table-hover fw-normal">
                  <tbody>
                    <tr v-for="(signer, index) in theDocs.participants" :key="index">
                      <td>{{ ++index }}.</td>
                      <td>{{ signer.user.first_name }}</td>
                      <td>{{ signer.user.email }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </template>
        </div>
      </div>

      <div class="mail-meta-item d-flex align-items-center">
        <template v-if="!theDocs">
          <span>
            <span class="spinner-border spinner-border-sm"></span>
            Loading...
          </span>
        </template>
        <template v-else>
          <small class="mail-date-time text-muted">
            {{ dateTime(theDocs.created_at) }}
          </small>
        </template>
      </div>
    </div>

    <div class="card-body mail-message">
      <div v-for="(doc, index) in theDocs.documentUploads" class="mb-1" :key="index">
        <RenderPage :file="doc.file_url" />
      </div>
    </div>
  </div>
</template>

<script setup>
import RenderPage from "@/components/Document/Edit/Main/RenderPDFDoc.vue";
import { ref, defineProps, watch } from 'vue'
import moment from "moment";

const props = defineProps({ docs: Object });
const theDocs = ref('')

watch(
  () => props.docs,
  (newDocs, oldDocs) => {
    if (newDocs != oldDocs) {
      theDocs.value = newDocs;
    }
  }
);

const dateTime = (value) => {
  return moment(value).format("Do MMM YYYY, HH:mm A");
};
</script>

<style scoped>

</style>