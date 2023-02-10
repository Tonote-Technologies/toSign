<template>
  <nav v-if="isVerifyPage || dashboard.token != null || token != null" style="height: 70px"
    class="header-navbar navbar-expand-lg navbar navbar-fixed align-items-center navbar-shadow navbar-brand-center"
    data-nav="brand-center">
    <div class="navbar-header d-lg-block d-none">
      <ul class="nav navbar-nav">
        <li class="nav-item">
          <template v-if="role != 'Viewer'">
            <router-link :to="{ name: 'Dashboard' }" class="navbar-brand me-0">
              <img src="@/assets/logo-dark.png" alt="ToNote" height="26" />
            </router-link>
          </template>
          <template v-else>
            <a href="#!" class="navbar-brand me-0">
              <img src="@/assets/logo-dark.png" alt="ToNote" height="26" />
            </a>
          </template>
        </li>
      </ul>
    </div>

    <div class="navbar-container d-flex justify-content-between align-items-center content">
      <div class="bookmark-wrapper d-flex align-items-center">
        <ul class="nav navbar-nav bookmark-icons" v-if="role != 'Viewer'">
          <li class="nav-item">
            <a role="button" class="dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="true">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                class="feather feather-home ficon" style="font-size: 22px">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              <span class="visually-hidden"></span>
            </a>

            <div class="dropdown-menu dropdown-menu-start left" data-popper-placement="bottom-start">
              <a class="dropdown-item" :href="redirectToUserDashboard + '/redirecting?qt=' + token">
                Dashboard</a>
              <router-link :to="{ name: 'Dashboard' }" class="dropdown-item">My Documents</router-link>
            </div>
          </li>
        </ul>
      </div>

      <div class="d-lg-none d-md-block text-center">
        <template v-if="role != 'Viewer'">
          <router-link :to="{ name: 'Dashboard' }" class="navbar-brand me-0">
            <img src="@/assets/logo-dark.png" alt="ToNote" height="20" />
          </router-link>
        </template>
        <template v-else>
          <a href="#!" class="navbar-brand me-0">
            <img src="@/assets/logo-dark.png" alt="ToNote" height="20" />
          </a>
        </template>
      </div>

      <ul class="nav navbar-nav align-items-center">
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

            <div v-if="plan" class="dropdown-divider"></div>

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
</template>

<script setup>
import { dashboard } from "@/store/dashboard";
import { ref, computed, onMounted, watch, onUpdated } from "vue";

import { useGetters, useActions } from "vuex-composition-helpers/dist";

const { token, profile, teamLoader, teams, userDocument } = useGetters({
  token: "auth/token",
  profile: "auth/profile",
  teamLoader: "team/teamLoader",
  teams: "team/teams",
  userDocument: "document/userDocument",
});

const { logoutUser } = useActions({
  logoutUser: "auth/logoutUser",
});

const role = ref("");
const image = ref("");
const firstName = ref("");
const lastName = ref("");
const plan = ref("");
const redirectToUserDashboard = ref("");
const isVerifyPage = ref(false);

watch(
  () => [dashboard.value.token, teamLoader.value],
  ([newToken, newTeam], [oldToken, oldTeam]) => {
    if (newToken != oldToken) {
      isVerifyPage.value = true;
    }

    if (newTeam != oldTeam) {
      plan.value = teams.value[0].subscription.plan.name;
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
  // teams.value?.map((team) => {
  //   image.value = team?.image;
  //   if (team.active === true) {
  //     plan.value = team?.subscription?.plan?.name;
  //   }
  // });

  setTimeout(() => {
    if (userDocument.value?.participants_count > 0) {
      userDocument.value?.participants.map((participant) => {
        if (participant?.user?.id == profile.value?.id) {
          role.value = participant.role;
        }
      });
    }
  }, 2500);
});

onMounted(() => {
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
