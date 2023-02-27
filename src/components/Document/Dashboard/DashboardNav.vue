<template>
  <div class="main-menu menu-fixed menu-light menu-accordion menu-shadow">
    <div class="navbar-header">
      <ul class="nav navbar-nav flex-row">
        <li class="nav-item me-auto">
          <router-link class="navbar-brand" :to="{ name: 'Dashboard' }">
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
            <HomeIcon />
            <span class="menu-title text-truncate">Dashboard </span>
          </a>
        </li>

        <li class="nav-item has-sub sidebar-group-active" :class="{ open: !isDropdownOpen }">
          <a class="d-flex align-items-center" role="button" @click="openDropdown">
            <LayerIcon />
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
                <CheckIcon />
                <span class="menu-item text-truncate">Completed</span>
                <span class="badge badge-light-success rounded-pill ms-auto me-1">
                  {{ count?.completed ?? 0 }}</span>
              </a>
            </li>

            <li :class="{ active: isPage == 'Received' }">
              <a class="d-flex align-items-center" role="button" @click="page('Received')">
                <MailIcon />
                <span class="menu-item text-truncate">Received</span>
                <span class="badge badge-light-warning rounded-pill ms-auto me-1">
                  {{ count?.received ?? 0 }}</span>
              </a>
            </li>

            <li :class="{ active: isPage == 'Sent' }">
              <a class="d-flex align-items-center" role="button" @click="page('Sent')">
                <SendIcon />
                <span class="menu-item text-truncate">Sent</span>
                <span class="badge badge-light-warning rounded-pill ms-auto me-1">
                  {{ count?.sent ?? 0 }}</span>
              </a>
            </li>

            <li :class="{ active: isPage == 'New' }">
              <a class="d-flex align-items-center" role="button" @click="page('New')">
                <FolderIcon />
                <span class="menu-item text-truncate">Draft</span>
                <span class="badge badge-light-info rounded-pill ms-auto me-1">
                  {{ count?.draft ?? 0 }}</span>
              </a>
            </li>

            <li :class="{ active: isPage == 'Deleted' }">
              <a class="d-flex align-items-center" role="button" @click="page('Deleted')">
                <TrashIcon />
                <span class="menu-item text-truncate">Deleted Files</span>
                <span class="badge badge-light-danger rounded-pill ms-auto me-1">
                  {{ count?.deleted ?? 0 }}</span>
              </a>
            </li>

            <li>
              <a class="d-flex align-items-center" :href="redirectToSignLink + '?status=sign&qt=' + token">
                <LinkIcon />
                <span class="menu-item text-truncate">Sign link</span>
                <p title="Coming Soon" class="coming-soon badge rounded-pill badge-light-warning">
                  Coming Soon
                </p>
              </a>
              <!-- <a class="d-flex align-items-center" :href="redirectToSignLink + '?status=sign&qt=' + token">
                <LinkIcon />
                <span class="menu-item text-truncate">Sign link</span>
                <p title="Coming Soon" class="coming-soon badge rounded-pill badge-light-warning">
                  Coming Soon
                </p>
              </a> -->
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
import HomeIcon from "@/icons/HomeIcon.vue";
import LayerIcon from "@/icons/LayerIcon.vue";
import CheckIcon from "@/icons/CheckIcon.vue";
import MailIcon from "@/icons/MailIcon.vue";
import SendIcon from "@/icons/SendIcon.vue";
import FolderIcon from "@/icons/FolderIcon.vue";
import TrashIcon from "@/icons/TrashIcon.vue";
import LinkIcon from "@/icons/LinkIcon.vue";

import { ref, defineProps, watch, onMounted } from "vue";
import { dashboard } from "@/store/dashboard";

import { useGetters, useActions } from "vuex-composition-helpers/dist";
import { useRouter } from "vue-router";
const route = useRouter();

const { token, teams, statistics } = useGetters({
  token: "auth/token",
  teams: "team/teams",
  statistics: "document/statistics",
});

const { getTeams, getStatistics } = useActions({
  getTeams: "team/getTeams",
  getStatistics: "document/getStatistics",
});

defineProps({ open: Boolean });

function capitalizeFirstLetter(string = "") {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const redirectToUserDashboard = ref("");
const redirectToSignLink = ref("");
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

const isDropdownOpen = ref(false);
const openDropdown = () => (isDropdownOpen.value = !isDropdownOpen.value);

const page = (params) => {
  dashboard.value.setIsOpened(false);

  isPage.value = params != "" ? params : "New";
  dashboard.value.setStatus(isPage.value);
  route.push({ name: "Dashboard", query: { status: isPage.value.toLowerCase() } });
};

const numberOfEnvelopLeft = ref("");
const remainingEnvelops = (str, arr) => {
  let featuredArray = arr.find((feat) => feat?.name.toLowerCase()?.includes(str));
  const number = featuredArray?.limit_number - featuredArray?.executed;
  return number;
};

onMounted(() => {
  redirectToSignLink.value = process.env.VUE_APP_URL_SIGN_LINK;
  redirectToUserDashboard.value = process.env.VUE_APP_URL_AUTH_LIVE;
  uri.value = capitalizeFirstLetter(route.currentRoute.value.query.status);
  page(uri.value);

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
.coming-soon {
  display: inline-block;
  padding: 2px 5px;
  border-radius: 5px;
  font-size: 10px;
  font-weight: 700;
}

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
