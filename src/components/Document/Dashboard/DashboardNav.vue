<template>
  <div class="main-menu menu-fixed menu-light menu-accordion menu-shadow">
    <div class="navbar-header">
      <ul class="nav navbar-nav flex-row">
        <li class="nav-item me-auto">
          <router-link class="navbar-brand" :to="{ name: 'Document' }">
            <span class="brand-logo">
              <img src="@/assets/logo-dark.png" width="150" />
            </span>
            <!-- <h2 class="brand-text">ToNote</h2> -->
          </router-link>
        </li>
        <li @click="dashboard.setIsOpened(false)" class="nav-item nav-toggle">
          <a class="nav-link modern-nav-toggle pe-0" data-bs-toggle="collapse">
            <i class="d-block d-xl-none text-primary toggle-icon font-medium-4" data-feather="x"></i>
            <!-- <i class="d-none d-xl-block collapse-toggle-icon font-medium-4 text-primary" data-feather="disc"
              data-ticon="disc"></i> -->
          </a>
        </li>
      </ul>
    </div>

    <div class="main-menu-content">
      <ul class="navigation navigation-main" id="main-menu-navigation" data-menu="menu-navigation">
        <li class="nav-item mt-2">
          <a class="d-flex align-items-center" :href="redirectToUserDashboard + '/redirecting?qt=' + token">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              class="feather feather-home" data-v-af43c274="">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            <span class="menu-title text-truncate">Dashboard </span></a>
        </li>

        <li class="nav-item has-sub sidebar-group-active open">
          <a class="d-flex align-items-center" role="button">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              class="feather feather-layers" data-v-af43c274="">
              <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
              <polyline points="2 17 12 22 22 17"></polyline>
              <polyline points="2 12 12 17 22 12"></polyline>
            </svg>
            <span class="menu-title text-truncate">My Documents</span>
          </a>
          <ul class="menu-content">
            <li class="d-none" :class="{ active: isPage == 'Files' }">
              <a class="d-flex align-items-center" role="button" @click="page('Files')">
                <i data-feather="folder-plus"></i>
                <span class="menu-item text-truncate">My Files</span>
              </a>
            </li>
            <li :class="{ active: isPage == 'Completed' }">
              <a class="d-flex align-items-center" role="button" @click="page('Completed')">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                  class="feather feather-check-circle">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <span class="menu-item text-truncate">Completed</span>
                <span class="badge badge-light-success rounded-pill ms-auto me-1">
                  {{ count?.completed ?? 0 }}</span>
              </a>
            </li>

            <li :class="{ active: isPage == 'Received' }">
              <a class="d-flex align-items-center" role="button" @click="page('Received')">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                  class="feather feather-mail" data-v-af43c274="">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <span class="menu-item text-truncate">Received</span>
                <span class="badge badge-light-warning rounded-pill ms-auto me-1">
                  {{ count?.received ?? 0 }}</span>
              </a>
            </li>

            <li :class="{ active: isPage == 'Sent' }">
              <a class="d-flex align-items-center" role="button" @click="page('Sent')">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                  class="feather feather-send" data-v-af43c274="">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
                <span class="menu-item text-truncate">Sent</span>
                <span class="badge badge-light-warning rounded-pill ms-auto me-1">
                  {{ count?.sent ?? 0 }}</span>
              </a>
            </li>

            <li :class="{ active: isPage == 'New' }">
              <a class="d-flex align-items-center" role="button" @click="page('New')">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                  class="feather feather-folder-plus" data-v-af43c274="">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                  <line x1="12" y1="11" x2="12" y2="17"></line>
                  <line x1="9" y1="14" x2="15" y2="14"></line>
                </svg>
                <span class="menu-item text-truncate">Draft</span>
                <span class="badge badge-light-info rounded-pill ms-auto me-1">
                  {{ count?.draft ?? 0 }}</span>
              </a>
            </li>

            <li :class="{ active: isPage == 'Deleted' }">
              <a class="d-flex align-items-center" role="button" @click="page('Deleted')">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                  class="feather feather-trash" data-v-af43c274="">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
                <span class="menu-item text-truncate">Deleted Files</span>
                <span class="badge badge-light-danger rounded-pill ms-auto me-1">
                  {{ count?.deleted ?? 0 }}</span>
              </a>
            </li>

            <li :class="{ active: isPage == 'Sign' }">
              <a class="d-flex align-items-center" role="button" @click="page('Sign')">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                  class="feather feather-link">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                </svg>
                <span class="menu-item text-truncate">Sign link</span>
                <span class="badge badge-light-success rounded-pill ms-auto me-1">
                  {{ links?.length ?? 0 }}</span>
              </a>
            </li>
          </ul>
        </li>

        <li class="nav-item d-none">
          <a class="d-flex align-items-center" href="#!">
            <i data-feather="file-text"></i><span class="menu-title text-truncate"> My Request</span></a>
        </li>
      </ul>

      <hr />

      <div class="help-box help-box-light text-center">
        <a href="javascript: void(0);" class="float-end close-btn text-body"><i class="mdi mdi-close"></i></a>
        <div class="text-center">
          <img src="@/assets/help-icon.svg" height="90" alt="Helper Icon Image" />
        </div>
        <h5 class="mt-3" style="font-size: 0.9rem">
          Your current plan is <span class="text-primary fw-bolder">{{ plan }}</span>
        </h5>
        <hr />

        <div style="font-size: 0.9rem">Sends remaining: {{ numberOfEnvelopLeft }}</div>

        <template v-if="plan != 'Business'">
          <hr />

          <div style="font-size: 0.9rem">
            <p class="mb-2">
              Upgrade to <span class="text-primary fw-bolder">Pro</span> to share more
              documents.
            </p>
            <div class="text-center">
              <a :href="upgradeUserAccount" class="btn btn-primary btn-sm">Upgrade</a>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, watch, onMounted } from "vue";
import { dashboard } from "@/store/dashboard";

import { useGetters, useActions } from "vuex-composition-helpers/dist";
import { useRouter } from "vue-router";
const route = useRouter();

const { token, teams, statistics, links } = useGetters({
  token: "auth/token",
  teams: "team/teams",
  statistics: "document/statistics",
  links: "signLink/links",
});

const { getTeams, getStatistics, getLinks } = useActions({
  getTeams: "team/getTeams",
  getStatistics: "document/getStatistics",
  getLinks: "signLink/getLinks",
});

defineProps({ open: Boolean });

function capitalizeFirstLetter(string = "") {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const redirectToUserDashboard = ref("");
const count = ref("");
const isPage = ref("");
const plan = ref("");
const upgradeUserAccount = ref("");
const uri = ref("");

watch(
  () => statistics.value,
  (newDoc) => {
    count.value = newDoc;
  }
);

const page = (params) => {
  isPage.value = params != "" ? params : "sign";
  dashboard.value.setStatus(isPage.value);
  route.push({ name: "Document", query: { status: isPage.value.toLowerCase() } });
};

const numberOfEnvelopLeft = ref("");
const remainingEnvelops = (str, arr) => {
  let featuredArray = arr.find((feat) => feat?.name.toLowerCase()?.includes(str));
  const number = featuredArray?.limit_number - featuredArray?.executed;
  return number;
};

onMounted(() => {
  redirectToUserDashboard.value = process.env.VUE_APP_URL_AUTH_LIVE;
  uri.value = capitalizeFirstLetter(route.currentRoute.value.query.status);
  page(uri.value ? uri.value : 'Sign');

  getLinks()
  getTeams(token.value);
  getStatistics(token.value);

  upgradeUserAccount.value =
    process.env.NODE_ENV != "development"
      ? process.env.VUE_APP_URL_USER_UPGRADE_LIVE
      : process.env.VUE_APP_URL_USER_UPGRADE_LOCAL;

  setTimeout(() => {
    if (teams.value.length > 0) {
      plan.value = teams.value[0].subscription.plan.name;
    }

    teams.value.map((team) => {
      if (team.active === true) {
        let hasPlan = team.subscription.plan;
        // plan.value = hasPlan.name;
        numberOfEnvelopLeft.value = remainingEnvelops("envelops", hasPlan.features);
      }
    });
  }, 2000);
});
</script>

<style scoped>
.main-menu .navbar-header .navbar-brand .brand-logo img {
  max-width: 100%;
  width: auto;
}

.main-menu .navbar-header .navbar-brand {
  margin-top: 1rem;
}

.main-menu-content {
  overflow-y: scroll;
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
</style>
