<template>
  <div class="app-content content">
    <div class="content-wrapper container-xxl p-0">
      <div class="content-body">
        <div class="card">
          <div class="card-datatable table-responsive" v-if="!isHidden">
            <div class="d-flex justify-content-between align-items-center header-actions text-nowrap mx-1 row mt-75">
              <div class="col-sm-12 col-lg-12">
                <div v-if="dashboard.status != 'Sign'" class="card-header d-flex justify-content-lg-between py-1 p-0">
                  <h4 class="card-title text-capitalize">{{ dashboard.status }} Files</h4>

                  <a :href="redirectToESign + '/document/upload?qt=' + token" class="btn btn-sm btn-primary"
                    v-show="dashboard.status != 'Deleted'">
                    Sign a Document
                  </a>
                </div>
                <div v-else class="card-header d-flex justify-content-lg-between py-1 p-0">
                  <h4 class="card-title">Sign Link</h4>

                  <router-link :to="{ name: 'document.upload' }" class="btn btn-sm btn-primary"
                    v-show="dashboard.status != 'Deleted'">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                      class="feather feather-plus">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Create New Link
                  </router-link>
                </div>

                <div class="bg-light p-1 mb-2">
                  <div class="row">
                    <div class="col-lg-6 col-md-6 col-sm-12 my-auto custom-sm" v-show="hasMultipleSelection">
                      <template v-if="dashboard.status == 'Deleted'">
                        <button type="button" class="btn btn-sm btn-primary waves-effect waves-float waves-light me-1"
                          @click="deleteDocument('restore', '')">
                          Restore
                        </button>
                        <button type="button" class="btn btn-sm btn-outline-danger"
                          @click="deleteDocument('delete', '')">
                          Permanently Delete
                        </button>
                      </template>
                      <template v-else>
                        <button type="button" class="btn btn-sm btn-primary" @click="deleteDocument('delete', '')">
                          Delete
                        </button>
                      </template>
                    </div>

                    <div class="col-lg-6 col-md-12 col-12 mt-sm-2 mt-lg-0 d-none">
                      <div class="clearfix">
                        <div class="float-lg-end">
                          <div class="mb-1 row">
                            <label for="colFormLabelLg" class="col-sm-3 col-form-label-lg">Filter</label>
                            <div class="col-sm-9">
                              <select class="form-select form-select-lg" id="selectLarge">
                                <option selected="">All</option>
                                <option value="1">Files</option>
                                <option value="2">Folder</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="closed" class="text-center">
                <div class="my-4">
                  <span class="spinner-border spinner-border-sm"></span> Loading...
                </div>
              </div>
              <div class="my-auto" v-else>
                <template v-if="dashboard.status != 'Sign'">
                  <table class="table table-borderless mb-5" role="grid" :id="theId">
                    <thead>
                      <tr role="row">
                        <th rowspan="1" colspan="1" style="width: 0px" aria-label="">
                          <input type="checkbox" @click="checkAll" v-model="isCheckAll" class="form-check-input" />
                        </th>
                        <th rowspan="1" colspan="1" style="width: 258px" aria-label="Name">
                          Name
                        </th>
                        <th rowspan="1" colspan="1" style="width: 348px" aria-label="Assigned To">
                          Record
                        </th>
                        <th class="sorting" tabindex="0" rowspan="1" colspan="1" style="width: 227px"
                          aria-label="Created Date: activate to sort column ascending">
                          Last updated
                        </th>
                        <th rowspan="1" colspan="1" style="width: 115px" aria-label="Actions">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <template v-if="filtered.length > 0">
                        <tr class="even" v-for="(doc, index) in filtered" :key="index">
                          <td class="control" tabindex="0">
                            <input type="checkbox" v-model="docIds" @change="updateCheckAll" :value="doc.id"
                              class="form-check-input" />
                          </td>
                          <td>
                            <template v-if="dashboard.status == 'Deleted'">
                              <img src="@/assets/doc.png" class="me-1" alt="file-icon" height="15" />
                              <span class="ml-1">{{ doc.title }}</span>
                            </template>
                            <template v-else>
                              <a role="button" @click="
                                getDocument({
                                  id: doc.id,
                                  status: dashboard.status,
                                  isView: true,
                                })
                              ">
                                <img src="@/assets/doc.png" class="me-1" alt="file-icon" height="15" />
                                <span class="ml-1">{{ doc.title }}</span>
                              </a>
                            </template>
                          </td>
                          <td>
                            <span class="badge rounded-pill badge-light-primary">
                              {{ doc.participants_count }} Participant(s)
                            </span>
                          </td>

                          <td>{{ dateTime(doc.updated_at) }}</td>

                          <td>
                            <div class="dropdown">
                              <button type="button"
                                class="btn btn-sm dropdown-toggle hide-arrow py-0 waves-effect waves-float waves-light"
                                data-bs-toggle="dropdown" aria-expanded="false">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                                  fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                  stroke-linejoin="round" class="feather feather-more-vertical">
                                  <circle cx="12" cy="12" r="1"></circle>
                                  <circle cx="12" cy="5" r="1"></circle>
                                  <circle cx="12" cy="19" r="1"></circle>
                                </svg>
                              </button>
                              <div class="dropdown-menu dropdown-menu-end">
                                <template v-if="dashboard.status != 'Deleted'">
                                  <a class="dropdown-item" role="button" @click="
                                    getDocument({
                                      id: doc.id,
                                      status: dashboard.status,
                                      isView: true,
                                    })
                                  ">
                                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor"
                                      stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"
                                      class="feather me-50">
                                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                      <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                    <span>View</span>
                                  </a>
                                  <a class="dropdown-item" role="button" @click="
                                    getDocument({
                                      id: doc.id,
                                      status: dashboard.status,
                                      isEdit: true,
                                    })
                                  ">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                                      fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                      stroke-linejoin="round" class="feather feather-edit-2 me-50">
                                      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                                    </svg>
                                    <span>Edit</span>
                                  </a>
                                </template>
                                <template v-else>
                                  <a class="dropdown-item" href="#" @click="deleteDocument('restore', doc.id)">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                                      fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                      stroke-linejoin="round" class="feather feather-rotate-ccw me-50">
                                      <polyline points="1 4 1 10 7 10"></polyline>
                                      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
                                    </svg>
                                    <span>Restore</span>
                                  </a>
                                </template>
                                <a class="dropdown-item" href="#" @click="deleteDocument('delete', doc.id)">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" class="feather feather-trash me-50">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path
                                      d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2">
                                    </path>
                                  </svg>
                                  <span>Delete</span>
                                </a>
                              </div>
                            </div>
                          </td>
                        </tr>
                      </template>
                      <template v-else>
                        <tr class="even text-center">
                          <td colspan="5" class="pt-3">
                            <i>No Items Found in
                              {{ dashboard.status == "Deleted" ? "Trash" : dashboard.status }}</i>
                          </td>
                        </tr>
                      </template>
                    </tbody>
                  </table>
                </template>
                <template v-else>
                  <DashboardSignLink @showDeleteButton="showButton" :key="signLinkKey" />
                </template>
              </div>
            </div>
          </div>

          <div v-else>
            <div class="row my-2">
              <div class="col-12">
                <div class="d-flex justify-content-between px-2">
                  <button class="btn btn-sm btn-secondary me-1" @click="isHidden = !isHidden">
                    &larr; Back
                  </button>
                  <a :href="redirectToESign + '?qt=' + token + '&di=' + editId + '&ed=1'"
                    class="btn btn-sm btn-primary">Edit</a>
                </div>

                <DashboardViewDocument :docs="theDoc" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <ModalComp :show="isDeleteOrRestore" :size="'modal-sm'" @close="isDeleteOrRestore = false">
    <template #header>
      <h4 class="modal-title text-danger">Alert</h4>
    </template>

    <template #body>
      <h3 class="text-center">Are you sure?</h3>
      <template v-if="dashboard.status == 'Deleted' && action != 'restore'">
        <p class="text-center"><i>You won't be able to undo this!</i></p>
      </template>
    </template>

    <template #footer>
      <button type="button" class="btn btn-sm btn-primary d-block ms-auto" :class="{ disabled: loading }"
        @click="proceedToDelete">
        <span v-show="loading" class="spinner-border spinner-border-sm"></span>
        <span>Proceed</span>
      </button>
    </template>
  </ModalComp>

  <ModalComp :show="folderModal" :size="'modal-sm'" @close="folderModal = false">
    <template #header>
      <h4 class="modal-title mb-0">New Folder</h4>
    </template>

    <template #body>
      <input type="text" class="form-control" placeholder="New folder" />
    </template>

    <template #footer>
      <button type="button" class="btn btn-primary me-1 waves-effect waves-float waves-light" data-bs-dismiss="modal">
        Create
      </button>
    </template>
  </ModalComp>
</template>

<script setup>
import ModalComp from "@/components/ModalComp.vue";
import moment from "moment";

import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-bs5";
import $ from "jquery";

import { onMounted, onUpdated, ref, watch } from "vue";
import { useActions, useGetters } from "vuex-composition-helpers/dist";
import { dashboard } from "@/store/dashboard";

import { useRouter } from "vue-router";
import { useToast } from "vue-toast-notification";
import DashboardViewDocument from "./DashboardViewDocument.vue";
import DashboardSignLink from "./DashboardSignLink.vue";

const toast = useToast();
const route = useRouter();

const signLinkKey = ref(0);
const redirectToESign = ref("");
const hasMultipleSelection = ref(false);
const isHidden = ref(false);
const loading = ref(false);
const isLoading = ref(false);
const isDeleteOrRestore = ref(false);
const isCheckAll = ref(false);
const docIds = ref([]);
const docObj = ref([]);
const folderModal = ref(false);
const theDoc = ref("");
const closed = ref(false);
const filtered = ref("");

const { token, documentsByStatus, userDocument } = useGetters({
  token: "auth/token",
  documentsByStatus: "document/documentsByStatus",
  receivedDocuments: "document/ReceivedDocuments",
  userDocument: "document/userDocument",
});

const {
  getUserDocuments,
  getUserDocument,
  removeDocument,
  retrieveDocument,
  getUserPrints,
  getUserDocumentByStatus,
  getReceivedDocuments,
  getDeletedDocuments,
} = useActions({
  getUserDocuments: "document/getUserDocuments",
  getUserDocument: "document/getUserDocument",
  removeDocument: "document/removeDocument",
  retrieveDocument: "document/retrieveDocument",
  getUserDocumentByStatus: "document/getUserDocumentByStatus",
  getReceivedDocuments: "document/getReceivedDocuments",
  getDeletedDocuments: "document/getDeletedDocuments",
  getUserPrints: "print/getUserPrints",
});

watch(
  () => [userDocument.value, documentsByStatus.value, dashboard.value.status],
  ([newUserDoc, newDocStatus, newStatus], [oldUserDoc, oldDocStatus, oldStatus]) => {
    if (newUserDoc != oldUserDoc) {
      theDoc.value = newUserDoc;
    }

    reRender()
    closed.value = true;
    if (newDocStatus != oldDocStatus) {
      closed.value = true;
      setTimeout(() => {
        closed.value = false;
      }, 300);
      filtered.value = newDocStatus;
    }
    setTimeout(() => {
      closed.value = false;
    }, 1000);

    if (newStatus != oldStatus) {
      isCheckAll.value = hasMultipleSelection.value = isHidden.value = false;
      docIds.value = [];

      if (!["Received", "Deleted"].includes(newStatus)) {
        return getUserDocumentByStatus(newStatus);
      }
      if (newStatus == "Received") {
        return getReceivedDocuments(token.value);
      }
      if (newStatus == "Deleted") {
        return getDeletedDocuments(token.value);
      }
    }
  }
);

const reRender = () => {
  signLinkKey.value += 1;
};

const showButton = (params) => {
  hasMultipleSelection.value = params.show
  docIds.value = params.signLinkDocIds
  if (params.showModal) {
    action.value = 'delete'
    isDeleteOrRestore.value = params?.showModal
  }
}

const editId = ref("");
const getDocument = (params) => {
  getUserDocument(params.id);

  if (params.isView && params.status == "Sent") {
    return route.push({ name: "document.audit", params: { document_id: params.id } });
  }

  if (params.isEdit === true) {
    return (window.location.href =
      redirectToESign.value + "?qt=" + token.value + "&di=" + params.id + "&ed=1");
  }

  isLoading.value = isHidden.value = true;
  editId.value = params.id;
  setTimeout(() => (isLoading.value = false), 2000);
};

const checkAll = () => {
  isCheckAll.value = !isCheckAll.value;
  docIds.value = [];
  if (isCheckAll.value) {
    for (const key in documentsByStatus.value) {
      docIds.value.push(documentsByStatus.value[key].id);
    }
  }

  hasMultipleSelection.value = docIds.value.length > 0 ? true : false;
};

const updateCheckAll = () => {
  hasMultipleSelection.value = docIds.value.length - 1 >= 0 ? true : false;
  isCheckAll.value = (docIds.value.length == documentsByStatus.value.length) ? true : false
};

const action = ref("");
const deleteDocument = (params, id) => {
  if (id != "") {
    docIds.value = [id];
  }
  if (docIds.value.length == 0) {
    return toast.error("Select a file to delete", {
      timeout: 5000,
      position: "top-right",
    });
  }

  action.value = params;
  isDeleteOrRestore.value = true;
};

const proceedToDelete = () => {
  loading.value = true;
  docObj.value = [];
  const isPermanent = route.currentRoute.value.query.status == "deleted" ? true : false;
  for (const key in docIds.value) {
    docObj.value.push({ document_id: docIds.value[key], permanent_delete: isPermanent });
  }

  action.value == "delete"
    ? removeDocument({ documents: docObj.value })
    : retrieveDocument({ documents: docObj.value });

  docIds.value = [];

  hasMultipleSelection.value = isCheckAll.value = false;
  isDeleteOrRestore.value = loading.value = false;
  setTimeout(() => {
    getUserDocuments(token.value);
  }, 1000);
};

const dateTime = (value) => {
  return moment(value).format("Do MMM YYYY, hh:mm A");
};

const theId = ref("");
onUpdated(() => {
  redirectToESign.value = process.env.VUE_APP_URL_E_SIGN;
  theId.value = dashboard.value.status;
  setTimeout(() => {
    if ($.fn.dataTable.isDataTable("#" + theId.value)) {
      $("#" + theId.value).DataTable();
    } else {
      if (filtered.value.length > 0) {
        $("#" + theId.value).DataTable({
          columnDefs: [{ orderable: false, targets: [0, 4] }],
          aaSorting: [],
          lengthMenu: [
            [5, 10, 25, 50, -1],
            [5, 10, 25, 50, "All"],
          ],
          pageLength: 5,
        });
      }
    }
  }, 100);
});

onMounted(() => {
  getUserPrints(token.value);
  getUserDocumentByStatus(dashboard.value.status);
});
</script>

<style scoped>
.loader {
  display: grid;
  place-items: center;
  height: 70vh;
  width: 100%;
}

.content-body {
  padding-bottom: 50px;
}

.table> :not(caption)>*>* {
  padding: 0.72rem 1rem !important;
}

* {
  scrollbar-width: thin;
  scrollbar-color: #999 #eee;
}

/* Works on Chrome, Edge, and Safari */
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

@media screen and (max-width: 991.5px) {
  .custom-sm {
    margin-bottom: 8px !important;
  }
}
</style>
