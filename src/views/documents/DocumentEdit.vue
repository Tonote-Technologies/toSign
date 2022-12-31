<template>
  <div class="card rounded-0 mb-0 p-1 d-lg-none d-sm-block d-md-block custom-position">
    <ul class="nav d-flex justify-content-between align-items-center" v-show="hasRole">
      <!-- signature tool  -->
      <li class="nav-item d-none">
        <div class="btn-group">
          <button class="extra__button waves-effect waves-float btn-secondary me-1" @click="plusBtn">
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"
              stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              <line x1="11" y1="8" x2="11" y2="14"></line>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
          </button>
          <button class="extra__button waves-effect waves-float btn-secondary" @click="minusBtn">
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"
              stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
          </button>
        </div>
      </li>
      <!-- more buttons dropdown  -->
      <li class="nav-item">
        <div class="btn-group">
          <button type="button" class="extra__button waves-effect waves-float waves-light" data-bs-toggle="dropdown"
            aria-expanded="true">
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"
              stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1">
              <circle cx="12" cy="12" r="1"></circle>
              <circle cx="12" cy="5" r="1"></circle>
              <circle cx="12" cy="19" r="1"></circle>
            </svg>
          </button>
          <div class="dropdown-menu dropdown-menu-end" data-popper-placement="bottom-start">
            <!-- <div class="dropdown-divider"></div> -->
            <a class="dropdown-item btn d-flex align-items-center" role="button" @click="addParticipantModal = true">
              <Icon icon="akar-icons:plus" class="me-1" />
              Add participants
            </a>

            <a class="dropdown-item btn d-flex align-items-center" role="button" @click="editSignerModal = true">
              <Icon icon="ep:view" class="me-1" />
              Manage signers
            </a>
            <a class="dropdown-item btn d-flex align-items-center" role="button" @click="exportPDF">
              <Icon icon="bx:download" class="me-1" />
              Download
            </a>

            <div class="dropdown-divider"></div>

            <a @click="affixModal = true" class="dropdown-item" role="button" id="viewSignature">My Signature</a>
          </div>
        </div>
      </li>
      <!-- other buttons  -->
      <li class="nav-item border-0">
        <button class="btn btn-sm btn-primary me-1" @click="doneModal = true">
          Finish
        </button>

        <button class="btn btn-sm btn-primary" @click="createModal = true">Share</button>
      </li>
    </ul>
  </div>

  <nav class="header-navbar navbar navbar-expand-lg floating-nav navbar-shadow container-xxl" style="z-index: 102">
    <div class="navbar-container d-flex justify-content-between content">
      <div class="bookmark-wrapper d-flex align-items-center">
        <ul class="nav navbar-nav d-xl-none">
          <li class="nav-item d-none">
            <a class="nav-link menu-toggle" href="#"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" class="feather feather-menu ficon">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg></a>
          </li>
        </ul>
        <ul class="nav navbar-nav bookmark-icons" v-show="hasRole">
          <li class="nav-item d-none d-sm-block">
            <div class="btn-group">
              <button type="button" class="btn btn-primary btn-sm waves-effect waves-float waves-light">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                  class="feather feather-settings spinner">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path
                    d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z">
                  </path>
                </svg>
                Signature tools
              </button>
              <button type="button"
                class="btn btn-outline-primary btn-sm dropdown-toggle dropdown-toggle-split waves-effect waves-float waves-light"
                data-bs-toggle="dropdown" aria-expanded="true">
                <span class="visually-hidden"></span>
              </button>
              <div class="dropdown-menu dropdown-menu-end" data-popper-placement="bottom-start">
                <a @click="affixModal = true" class="dropdown-item" href="#" id="viewSignature">My Signature</a>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <ul class="nav navbar-nav align-items-center">
        <li class="nav-item d-none d-sm-block">
          <a class="nav-link nav-link-style">
            <button class="btn btn-sm btn-outline-primary waves-effect" @click="exportPDF">
              Download
            </button></a>
        </li>
        <li class="nav-item" v-if="canCancel">
          <a class="nav-link nav-link-style">
            <button class="btn btn-sm btn-outline-primary waves-effect" @click="cancel">
              Cancel
            </button>
          </a>
        </li>
        <li class="nav-item d-none d-sm-block">
          <a class="nav-link nav-link-style">
            <button class="btn btn-sm btn-primary waves-effect waves-float waves-light" @click="createModal = true"
              style="margin-right: 5px">
              Create Link
            </button>
          </a>
        </li>
      </ul>
    </div>
  </nav>

  <div class="content-area-wrapper container-xxl p-0 mt-5 overflow-x-scroll border-0"
    style="position:static !important">
    <AsideLeft :chunkFileId="pageId" :isOpen="editSignerModal" @close="editSignerModal = false" />
    <MainContent @docId="getDocId" @open="open" />
    <AsideRight />
  </div>

  <div class="fixed-bottom bg-white shadow-lg custom-sm">
    <AsideBottom :chunkFileId="pageId" :isOpen="addParticipantModal" @close="addParticipantModal = false" />
  </div>

  <ModalComp :show="createModal" :size="'modal-md'" :footer="false" @close="createModal = false">
    <template #header>
      <h5 class="modal-title">Created Link</h5>
    </template>

    <template #body>
      <p class="text-center">Kindly find the generated link below</p>

      <div class="mb-2">
        <p class="text-center" style="font-size: 10px">
          <code class="text-center">{{ linkUrl + '/to-sign/' + uri }}</code>
        </p>
        <button type="button" class="btn btn-sm btn-outline-dark waves-effect d-block mx-auto"
          v-clipboard:copy="linkUrl + '/to-sign/' + uri" v-clipboard:success="onCopy" v-clipboard:error="onError">
          Copy link
        </button>
      </div>

      <div class="modal-footer pb-0 pe-0">
        <button type="button" class="btn btn-sm btn-primary" @click="done">Done</button>
      </div>
    </template>
  </ModalComp>

  <ModalComp :show="openNotificationModal" :size="'modal-sm'" :closeBtn="false">
    <template #header>
      <h4 class="modal-title text-success mb-0">
        <Icon icon="mdi:alert-circle-check-outline" style="margin-bottom: 3px" />
        Alert
      </h4>
    </template>

    <template #body>
      <div class="row">
        <div class="col-md-12">
          <h5 class="text-center"><i>Document sent successfully</i></h5>
        </div>
        <div class="col-md-6 d-none">
          <div style="display: grid; place-items: center; height: 100%">
            <div class="fw-normal">
              <img src="@/assets/logo-dark.png" width="150" class="mb-2" alt="Logo" />
              <h4 class="modal-title fw-bold mb-2">Awesome!</h4>
              <p class="modal-text fw-normal">
                You document has successfully been sent to your signatories.
              </p>
            </div>
          </div>
        </div>
        <div class="col-md-6 d-none">
          <div class="card mb-0">
            <div class="card-header bg-primary justify-content-center">
              <h5 class="card-title fw-bold text-light">How was your experience?</h5>
            </div>
            <div class="card-body">
              <p class="card-subtitle fw-bold my-1">
                Do you have any thought you'd like to share?
              </p>
              <textarea class="form-control mb-2" rows="4"></textarea>
              <p class="card-subtitle fw-bold my-1">
                Your feedbacks are very important to us, it gives us the opportunity to
                serve you better.
              </p>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <button class="btn btn-sm btn-primary" @click="closeNotification">Done</button>
    </template>
  </ModalComp>

  <ModalComp :show="affixModal" :footer="false" :size="'modal-sm'" @close="affixModal = false">
    <template #header>
      <h4 class="modal-title">My Signatures</h4>
    </template>

    <template #body>
      <div class="row">
        <div class="col-md-4 ms-auto">
          <button @click="updateModal" class="float-end btn btn-outline-secondary btn-sm waves-effect"
            id="updateSignature">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              class="feather feather-edit">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            Update
          </button>
        </div>
      </div>

      <div class="divider"></div>

      <SignatureList @selectedSignature="savePrint" />
    </template>
  </ModalComp>

  <ModalComp :show="updateSignatureModal" :footer="false" @close="updateSignatureModal = false">
    <template #header>
      <h4 class="modal-title">Update your signature</h4>
    </template>

    <template #body>
      <LeftTabWrapper>
        <LeftTabList title="Draw">
          <SignaturePad @close="updateSignatureModal = false" />
        </LeftTabList>

        <LeftTabList title="Select">
          <SignatureSelectFull @close="updateSignatureModal = false" />
        </LeftTabList>

        <LeftTabList title="Initial">
          <SignatureSelectInitial @close="updateSignatureModal = false" />
        </LeftTabList>

        <LeftTabList title="Upload">
          <div class="row">
            <div class="col-md-12 mx-auto position-relative">
              <SignatureUpload @close="updateSignatureModal = false" />
            </div>
          </div>
        </LeftTabList>
      </LeftTabWrapper>
      <div class="row">
        <div class="col-md-10 ms-auto mt-2">
          <p class="fw-normal">
            By clicking create, I agree that all signatures, marks or initials created
            here are as valid as my hand written signature to the extent allowed by law.
          </p>
        </div>
      </div>
    </template>
  </ModalComp>

  <ModalComp :show="cancelModal" :size="'modal-sm'" @close="cancelModal = false">
    <template #header>
      <h4 class="modal-title text-danger mb-0">
        <Icon icon="eva:alert-triangle-outline" style="margin-bottom: 3px" />
        Alert
      </h4>
    </template>

    <template #body>
      <h3 class="text-center">Are you sure?</h3>
      <p class="text-center"><i>Any changes will not be saved!</i></p>
    </template>

    <template #footer>
      <button class="btn btn-sm btn-primary" @click="deletePermanently">
        <span v-show="loading" class="spinner-border spinner-border-sm"></span>
        Proceed
      </button>
    </template>
  </ModalComp>

  <ModalComp :show="doneModal" :size="'modal-sm'" @close="doneModal = false">
    <template #header>
      <h4 class="modal-title text-danger mb-0">
        <Icon icon="eva:alert-triangle-outline" style="margin-bottom: 3px" />
        Alert
      </h4>
    </template>

    <template #body>
      <p class="text-center"><i>Please confirm that you are done signing.</i></p>
    </template>

    <template #footer>
      <button class="btn btn-sm btn-primary" @click="confirmEdit">
        <span v-show="loading" class="spinner-border spinner-border-sm"></span>
        Confirm
      </button>
    </template>
  </ModalComp>

  <ModalComp :show="OTPFlag?.guest" :size="'modal-sm'" :footer="false" :closeBtn="false">
    <template #header>
      <h4 class="modal-title text-warning mb-0">
        <Icon icon="icomoon-free:notification" style="margin-bottom: 3px" />
        Information
      </h4>
    </template>

    <template #body>
      <p>Hi {{ profile.first_name }},</p>
      <p>Welcome to ToNote.</p>
      <p>
        For the most secure e-signature, simply create a password and you can proceed to
        sign your document.
      </p>
      <p>Thanks!</p>

      <UserResetPassword />
    </template>
  </ModalComp>
</template>

<script setup>
import { Icon } from "@iconify/vue";
import ModalComp from "@/components/ModalComp.vue";
import UserResetPassword from "@/components/Auth/UserResetPassword.vue";
import AsideLeft from "@/components/Document/Edit/Left/AsideLeft.vue";
import AsideRight from "@/components/Document/Edit/Right/AsideRight.vue";
import MainContent from "@/components/Document/Edit/Main/MainContent.vue";

import AsideBottom from "@/components/Document/Edit/Mobile/AsideBottom.vue";

// // import MailToParticipant from "@/components/Document/Edit/MailToParticipant.vue";

import LeftTabWrapper from "@/components/Tab/TabLeftNav/LeftTabWrapper.vue";
import LeftTabList from "@/components/Tab/TabLeftNav/LeftTabList.vue";

import SignatureList from "@/components/Signature/SignatureList.vue";
import SignaturePad from "@/components/Signature/SignaturePad.vue";

import SignatureSelectFull from "@/components/Signature/SignatureTextFull.vue";
import SignatureUpload from "@/components/Signature/SignatureUpload.vue";
import SignatureSelectInitial from "@/components/Signature/SignatureTextInitial.vue";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import { ref, onMounted, watch, onUnmounted } from "vue";

import { useGetters, useActions } from "vuex-composition-helpers/dist";
import { useRouter } from "vue-router";
import { useToast } from "vue-toast-notification";
import { dashboard } from "@/store/dashboard";

import "jquery/dist/jquery.min";
import $ from "jquery";

const toast = useToast();
const route = useRouter();

const { token, profile, teams, link, isOpenModal, canCancel, OTPFlag } = useGetters({
  token: "auth/token",
  profile: "auth/profile",
  OTPFlag: "auth/OTPFlag",
  teams: "team/teams",
  link: "signLink/link",
  canCancel: "signLink/canCancel",
  isOpenModal: "signLink/isOpenModal",
});

const {
  removeNotification,
  getLink,
  getTools,
  removeCancel,
  removeDocument,
  getUserPrints,
  doneEditing,
} = useActions({
  doneEditing: "signLink/doneEditing",
  removeNotification: "signLink/removeNotification",
  getLink: "signLink/getLink",
  removeCancel: "signLink/removeCancel",
  removeDocument: "signLink/removeDocument",
  getTools: "signLink/getTools",
  getUserPrints: "print/getUserPrints",
});

const redirectToUserDashboard = ref("");
const addParticipantModal = ref(false);
const editSignerModal = ref(false);
const openNotificationModal = ref(isOpenModal.value);
const isOpen = ref(false);
const pageId = ref("");
const doneModal = ref(false);
const cancelModal = ref(false);
const doneDataUrl = ref("");
const createModal = ref(false);
const affixModal = ref(false);
const updateSignatureModal = ref(false);
const loading = ref(false);
const plan = ref(null);
const hasRole = ref(false);
const uri = ref("");

const currIEZoom = ref(100);

const plusBtn = () => {
  let step = 20;
  currIEZoom.value += step;
  $(".zum").css("zoom", " " + currIEZoom.value + "%");
};

const minusBtn = () => {
  let step = 20;
  currIEZoom.value -= step;
  $(".zum").css("zoom", " " + currIEZoom.value + "%");
};

watch(
  () => isOpenModal.value,
  (isOpen) => {
    if (isOpen) {
      openNotificationModal.value = isOpen;
    }
  }
);

const message = "Copied to clipboard!";
const onCopy = () => {
  return toast.default(message, {
    timeout: 5000,
    position: "top-right",
  });
};
const onError = (e) => {
  alert("Failed to copy texts", e);
};

const open = (params) => {
  isOpen.value = params;
};

const cancel = () => {
  cancelModal.value = true;
};

const deletePermanently = () => {
  removeDocument({ documents: [{ document_id: uri.value, permanent_delete: true }] });
  route.push({ name: "Document" });
};

const getDocId = (params) => {
  pageId.value = params;
};

const closeNotification = () => {
  removeNotification(false);
  window.location.href = redirectToUserDashboard.value + "/redirecting?qt=" + token.value;
};

const updateModal = () => {
  affixModal.value = false;
  updateSignatureModal.value = true;
};

const exportPDF = (params) => {
  const data = document.getElementById("mainWrapper");
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

    if (params == "done") {
      doneDataUrl.value = canvas.toDataURL();
      doneModal.value = false;

      if (doneDataUrl.value != '') {
        isDoneEdit();
      }

      toast.success("Document edited successfully", {
        timeout: 5000,
        position: "top-right",
      });

      return
    }

    doc.save(link.value.title + ".pdf");
  });
};

const done = () => {
  route.push({ name: 'Document', query: { status: 'sign' } })
};

const isDoneEdit = () => {
  let dataObj = {
    document_id: uri.value,
    files: [doneDataUrl.value],
  };
  doneEditing(dataObj);

  window.location.href = redirectToUserDashboard.value + "/redirecting?qt=" + token.value;
};

// const sharedDocument = () => {
//   // exportPDF("done");

//   loading.value = true;

//   setTimeout(() => {
//     // isDoneEdit();
//     loading.value = false;
//     createModal.value = false;
//   }, 3000);
// };

const confirmEdit = () => {
  // isDoneEdit();
  window.location.href =
    redirectToUserDashboard.value + "/redirecting?qt=" + token.value;

  doneModal.value = false;
  toast.success("Document edited successfully", { timeout: 5000, position: "top-right" });
  window.location.href = redirectToUserDashboard.value + "/redirecting?qt=" + token.value;
};

const linkUrl = ref("");
onMounted(() => {
  redirectToUserDashboard.value = process.env.VUE_APP_URL_AUTH_LIVE;
  uri.value = route.currentRoute.value.params.document_id;
  getLink(uri.value)

  linkUrl.value =
    process.env.NODE_ENV === "development"
      ? process.env.VUE_APP_URL_AUTH_LOCAL
      : process.env.VUE_APP_URL_SIGN_LINK;

  getTools(uri.value);

  if (token.value == null) return;
  if (token.value != "" || token.value != null) {
    hasRole.value = true;
    dashboard.value.setToken(token.value);
    getUserPrints(token.value);

    if (teams.value.length > 0) {
      plan.value = teams.value[0].subscription.plan.name;
    }
  }

  setTimeout(() => {
    if (window.Tawk_API) {
      window.Tawk_API.hideWidget();
    }
  }, 2000);
});

onUnmounted(() => {
  removeCancel();
});
</script>

<style scoped>
.overflow-x-scroll {
  overflow-x: scroll !important;
}

.custom-position {
  position: fixed;
  top: 70px;
  left: 0;
  width: 100%;
  height: 60px;
  z-index: 101;
}

.extra__button {
  padding: 1rem 0.5rem;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background-color: #dbe7ff;
  border: none;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
}

.header-navbar.floating-nav {
  top: 75px;
}

.dropdown-toggle::after,
.dropup .dropdown-toggle::after {
  vertical-align: 0 !important;
  height: 7px !important;
}

.btn-outline-primary:hover:not(.disabled):not(:disabled) {
  background-color: #003bb3;
  color: #fff;
}

.hover-remove.dropdown-item:focus,
.hover-remove.dropdown-item:hover {
  color: #000;
  background-color: #fff;
}

.dropdown-menu .hover-remove.dropdown-item {
  cursor: default;
}

.is-center {
  transform: translate3d(-45px, 34px, 0px) !important;
}

.custom-sm {
  display: none;
}

.coming-soon {
  display: inline-block;
  padding: 2px 5px;
  border-radius: 5px;
  font-size: 10px;
  font-weight: 700;
}

::-webkit-scrollbar {
  width: 2px;
  height: 2px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

@media screen and (max-width: 991.5px) {
  .header-navbar {
    display: none !important;
  }

  .custom-sm {
    display: block;
  }

  .content-area-wrapper {
    margin-top: 1em !important;
    margin-bottom: 7rem !important;
  }
}
</style>
