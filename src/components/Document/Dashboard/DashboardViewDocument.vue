<template>
  <div class="card bg-light">
    <div class="card-header bg-white">
      <div class="user-details d-flex justify-content-between align-items-center flex-wrap">
        <div class="mail-items">
          <template v-if="!theDoc">
            <span>
              <span class="spinner-border spinner-border-sm"></span>
              Loading...
            </span>
          </template>
          <template v-else>
            <h5 class="text-capitalize mb-0">{{ theDoc.title }}</h5>
            <div class="email-info-dropup dropdown fw-normal">
              <span role="button" class="dropdown-toggle font-small-3 text-muted" id="card_top01"
                data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Participants: ({{ theDoc.participants_count }})
              </span>
              <div class="dropdown-menu" aria-labelledby="card_top01">
                <table class="table table-hover fw-normal">
                  <tbody>
                    <tr v-for="(signer, index) in theDoc.participants" :key="index">
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
        <template v-if="!theDoc">
          <span>
            <span class="spinner-border spinner-border-sm"></span>
            Loading...
          </span>
        </template>
        <template v-else>
          <small class="mail-date-time text-muted">
            {{ dateTime(theDoc.created_at) }}
          </small>
        </template>
      </div>
    </div>

    <div class="divider bg-light pb-1 m-0"></div>

    <div class="card-body mail-message py-0">
      <div class="row">
        <div class="col-md-10 mx-auto">
          <div v-for="(doc, index) in sortedFile" class="mb-1" :key="index">
            <RenderPage :file="doc.file_url" :oldDoc="{ isOld: doc.isOldDoc }" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import RenderPage from "@/components/Document/Edit/Main/RenderPage.vue";
import { ref, defineProps, watch } from 'vue'
import moment from "moment";

const props = defineProps({ docs: Object });
const theDoc = ref('')

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

watch(
  () => props.docs,
  (newDocs, oldDocs) => {
    if (newDocs != oldDocs) {
      theDoc.value = newDocs;
      if (
        theDoc.value.documentUploads.length > 0 &&
        theDoc.value.entry_point != "Docs" &&
        theDoc.value.status == "Completed"
      ) {
        return sortedDocumentUploads(theDoc.value);
      }
      sortedDocumentUploads(theDoc.value);
    }
  }
);

const dateTime = (value) => {
  return moment(value).format("Do MMM YYYY, HH:mm A");
};
</script>

<style scoped></style>