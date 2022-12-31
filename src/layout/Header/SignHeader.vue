<template>
  <nav style="height: 70px"
    class="header-navbar navbar-expand-lg navbar navbar-fixed align-items-center navbar-shadow navbar-brand-center"
    data-nav="brand-center">
    <div class="navbar-header d-lg-block d-none">
      <ul class="nav navbar-nav">
        <li class="nav-item">
          <div class="navbar-brand me-0">
            <img src="@/assets/logo-dark.png" alt="ToNote" height="26" />
          </div>
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
        <div class="navbar-brand me-0">
          <img src="@/assets/logo-dark.png" alt="ToNote" height="20" />
        </div>
      </div>

      <ul class="nav navbar-nav align-items-center">
        <li class="nav-item dropdown dropdown-user">
          <div class="nav-link" id="dropdown-user">
            <span class="avatar" :class="{ 'ms-1': profile?.first_name == undefined }">
              <span class="avatar justify-content-center align-items-center" style="width: 40px; height: 40px">
                {{ profile?.initials }}
              </span>
              <span class="avatar-status-online"></span>
            </span>
          </div>

          <!-- <div class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdown-user" data-bs-popper="none">
            <a class="dropdown-item text-center" role="button" @click="logout">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                class="feather feather-power me-50">
                <path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path>
                <line x1="12" y1="2" x2="12" y2="12"></line>
              </svg>
              Logout</a>
          </div> -->
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { dashboard } from "@/store/dashboard";
import { ref, onMounted, watch } from "vue";

import { useGetters } from "vuex-composition-helpers/dist";

const { profile } = useGetters({
  token: "auth/token",
  profile: "auth/profile",
});

// const { logoutUser } = useActions({
//   logoutUser: "auth/logoutUser",
// });

// const firstName = ref("");
// const lastName = ref("");
const redirectToUserDashboard = ref("");
const isVerifyPage = ref(false);
const isDevelopment = ref(false);

watch(
  () => dashboard.value.token,
  (newToken) => {
    if (newToken) {
      isVerifyPage.value = true;

      // teams.value?.map((team) => {
      //   if (team.active === true) {
      //     plan.value = team.subscription?.plan?.name;
      //   }
      // });
    }
  }
);

// const fullName = computed({
//   get() {
//     return profile.value?.first_name + " " + profile.value?.last_name;
//   },
//   set(newValue) {
//     [firstName.value, lastName.value] = newValue.split(" ");
//   },
// });

// const logout = () => {
//   logoutUser({ token: token.value });
// };

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
