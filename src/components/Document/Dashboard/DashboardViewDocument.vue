<template>
  <div class="card bg-light">
    <div class="card-header bg-white">
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

    <div class="divider bg-light pb-1 m-0"></div>

    <div class="card-body mail-message py-0">
      <div v-for="(doc, index) in sortedFile" class="mb-1" :key="index">
        <RenderPage :file="doc.file_url" :comp="sortedFile.length <= 1 ? 'audit' : ''" />
      </div>
    </div>
  </div>
</template>

<script setup>
import RenderPage from "@/components/Document/Edit/Main/RenderPage.vue";
import { ref, defineProps, watch } from 'vue'
import moment from "moment";

const props = defineProps({ docs: Object });
const theDocs = ref('')

const files = ref([]);
const sortedFile = ref('');
watch(
  () => props.docs,
  (newDocs, oldDocs) => {
    if (newDocs != oldDocs) {
      theDocs.value = newDocs;
      theDocs.value.documentUploads.filter((item) => {
        // if (item.number_ordering == null)
        if (item.status == 'Processing')
          files.value.push({
            id: item.id,
            file_url: item.file_url,
            number: item.number_ordering,
          });
      });
      sortedFile.value = files.value.sort((a, b) => (a.number > b.number ? 1 : -1));
    }
  }
);

const dateTime = (value) => {
  return moment(value).format("Do MMM YYYY, HH:mm A");
};
</script>

<style scoped>

</style>