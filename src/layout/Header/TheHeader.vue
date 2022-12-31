<template>
  <nav v-if="dashboard.token != null" style="height: 70px"
    class="header-navbar navbar-expand-lg navbar navbar-fixed align-items-center navbar-shadow navbar-brand-center"
    data-nav="brand-center">
    <div class="navbar-header d-lg-block d-none">
      <ul class="nav navbar-nav">
        <li class="nav-item">
          <router-link :to="{ name: 'Document' }" class="navbar-brand me-0">
            <img src="@/assets/logo-dark.png" alt="ToNote" height="26" />
          </router-link>
        </li>
      </ul>
    </div>

    <div class="navbar-container d-flex justify-content-between align-items-center content">
      <div class="bookmark-wrapper d-flex align-items-center">
        <ul class="nav navbar-nav bookmark-icons">
          <li class="nav-item">
            <a role="button" class="text-primary fw-bold" @click='$router.go(-1)'>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                class="feather feather-chevron-left font-medium-4" style="height: 2rem !important">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
              <span class="visually-hidden"></span>
              Back
            </a>
          </li>
        </ul>
      </div>

      <div class="d-lg-none d-md-block text-center">
        <router-link :to="{ name: 'Document' }" class="navbar-brand me-0">
          <img src="@/assets/logo-dark.png" alt="ToNote" height="20" />
        </router-link>
      </div>

      <ul v-if="isVerifyPage || dashboard.token != null || token != null" class="nav navbar-nav align-items-center">
        <li class="nav-item dropdown dropdown-user">
          <a class="nav-link dropdown-toggle dropdown-user-link" id="dropdown-user" href="#" data-bs-toggle="dropdown"
            aria-haspopup="true" aria-expanded="false">
            <template v-if="profile?.first_name == undefined">
              <span class="spinner-border spinner-border-sm"></span>
              Loading...
            </template>
            <template v-else>
              <div class="user-nav d-lg-flex d-none">
                <span class="user-name fw-bolder text-capitalize">{{ fullName }}</span>
                <span v-show="plan" class="user-status text-capitalize">{{ plan }} plan</span>
              </div>
            </template>
            <span class="avatar" :class="{ 'ms-1': profile?.first_name == undefined }">
              <template v-if="plan == 'Business' && image != null">
                <span class="img d-flex align-items-center justify-content-center">
                  <img class="round" :src="image" alt="avatar" height="40" width="40" />
                </span>
                <span class="avatar-status-online"></span>
              </template>
              <template v-else>
                <span class="avatar justify-content-center align-items-center" style="width: 40px; height: 40px">
                  {{ profile?.initials }}
                </span>
                <span class="avatar-status-online"></span>
              </template>
            </span>
          </a>

          <div class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdown-user" data-bs-popper="none">
            <div class="dropdown-item d-flex flex-column justify-content-center align-items-center">
              <span class="avatar h6">
                <template v-if="plan == 'Business' && image != null">
                  <span class="img d-flex align-items-center justify-content-center">
                    <img class="round" :src="image" alt="avatar" height="40" width="40" />
                  </span>
                </template>
                <template v-else>
                  <div class="avatar bg-light-white avatar-lg">
                    <span class="avatar-content">
                      {{ profile?.initials }}
                    </span>
                  </div>
                </template>
              </span>
              <h5 class="text-capitalize">{{ fullName }}</h5>
              <span>{{ profile?.email }}</span>
            </div>

            <div class="dropdown-divider"></div>

            <div v-if="plan" class="dropdown-item d-flex justify-content-center align-items-center">
              <span class="avatar">
                <template v-if="plan == 'Business' && image != null">
                  <span class="img d-flex align-items-center justify-content-center">
                    <img class="round" :src="image" alt="avatar" height="40" width="40" />
                  </span>
                  <span class="avatar-status-online"></span>
                </template>
                <template v-else>
                  <div class="avatar bg-light-white">
                    <span class="avatar-content">
                      {{ profile?.initials }}
                    </span>
                  </div>
                  <span class="avatar-status-online"></span>
                </template>
              </span>
              <div class="ms-1">
                <h5 class="mb-0 text-capitalize">{{ fullName }}</h5>
                <span>{{ plan }}</span> plan
              </div>
            </div>

            <div v-show="plan" class="dropdown-divider"></div>

            <a class="dropdown-item text-center" role="button" @click="logout">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                class="feather feather-power me-50">
                <path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path>
                <line x1="12" y1="2" x2="12" y2="12"></line>
              </svg>
              Logout</a>
          </div>
        </li>
      </ul>
    </div>
  </nav>
  <SignHeader v-else />
</template>

<script setup>
import SignHeader from "./SignHeader.vue";
import { dashboard } from "@/store/dashboard";
import { ref, computed, onMounted, watch, onUpdated } from "vue";

import { useGetters, useActions } from "vuex-composition-helpers/dist";

const { token, profile, teams } = useGetters({
  token: "auth/token",
  profile: "auth/profile",
  teams: "team/teams",
});

const { logoutUser } = useActions({
  logoutUser: "auth/logoutUser",
});

const image = ref("");
const firstName = ref("");
const lastName = ref("");
const plan = ref("");
const redirectToUserDashboard = ref("");
const isVerifyPage = ref(false);
const isDevelopment = ref(false);

watch(
  () => dashboard.value.token,
  (newToken) => {
    if (newToken) {
      isVerifyPage.value = true;

      if (teams.value?.length > 0) {
        plan.value = teams.value[0].subscription.plan.name;
      }

      // teams.value?.map((team) => {
      //   if (team.active === true) {
      //     plan.value = team.subscription?.plan?.name;
      //   }
      // });
    }
  }
);

const fullName = computed({
  get() {
    return profile.value?.first_name + " " + profile.value?.last_name;
  },
  set(newValue) {
    [firstName.value, lastName.value] = newValue.split(" ");
  },
});

const logout = () => {
  logoutUser({ token: token.value });
};

onUpdated(() => {
  if (teams.value.length > 0) {
    plan.value = teams.value[0].subscription.plan.name;
    image.value = teams.value[0].image;
  }
});

onMounted(() => {
  isDevelopment.value = process.env.NODE_ENV == 'development' ? true : false
  redirectToUserDashboard.value = process.env.VUE_APP_URL_AUTH_LIVE;
});
</script>

<style scoped>
.dropdown-item.active,
.dropdown-item:active {
  color: #003bb3 !important;
  background-color: #fff;
}

.dropdown-toggle::after,
.dropup .dropdown-toggle::after {
  content: none;
}

.header-navbar .navbar-container ul.navbar-nav li.dropdown-user .dropdown-menu {
  width: auto !important;
}

@media screen and (max-width: 767.98px) {
  .header-navbar .navbar-container .show~.dropdown-menu.left {
    right: auto !important;
    left: auto !important;
  }

  .header-navbar .navbar-container .show~.dropdown-menu {
    right: 8px !important;
    left: 20px !important;
    width: auto !important;
  }

  .horizontal-layout .header-navbar .navbar-container {
    padding-left: 1rem !important;
    padding-right: 1rem !important;
  }

  .navbar-nav .nav-link {
    padding-right: 0px !important;
    padding-left: 0px !important;
  }
}
</style>
