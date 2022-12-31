<template>
  <nav
    class="header-navbar navbar navbar-expand-lg align-items-center floating-nav navbar-light navbar-shadow container-xxl">
    <div class="navbar-container d-flex content">
      <div class="bookmark-wrapper d-flex align-items-center">
        <ul class="nav navbar-nav d-xl-none">
          <li class="nav-item">
            <a class="nav-link" role="button" @click="dashboard.setIsOpened(true)">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                class="feather feather-menu ficon">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg></a>
          </li>
        </ul>
        <ul class="nav navbar-nav bookmark-icons d-none">
          <li class="nav-item d-none d-lg-block"><a class="nav-link" role="button" data-bs-toggle="tooltip"
              data-bs-placement="bottom" title="Calendar">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                class="feather feather-calendar ficon">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg></a></li>
        </ul>

      </div>
      <ul class="nav navbar-nav align-items-center ms-auto">
        <li class="nav-item dropdown dropdown-user">
          <a class="nav-link dropdown-toggle dropdown-user-link" id="dropdown-user" href="#" data-bs-toggle="dropdown"
            aria-haspopup="true" aria-expanded="false">
            <div class="user-nav d-sm-flex d-none">
              <span class="user-name fw-bolder">{{ fullName }}</span>
              <span class="user-status text-capitalize">{{ plan }} plan</span>
            </div>
            <span class="avatar">
              <template v-if="plan == 'Business' && image != null">
                <span class="img d-flex align-items-center justify-content-center">
                  <img class="round" :src="image" alt="avatar" height="40" width="40" />
                </span>
                <span class="avatar-status-online"></span>
              </template>
              <template v-else>
                <span class="avatar justify-content-center align-items-center" style="width:40px;height:40px;">
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
              <h5>{{ fullName }}</h5>
              <span>{{ profile?.email }}</span>
            </div>

            <div class="dropdown-divider"></div>

            <div class="dropdown-item d-flex justify-content-center align-items-center">
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
                <h5 class="mb-0">{{ fullName }}</h5>
                <span>{{ plan }}</span> plan
              </div>
            </div>

            <div class="dropdown-divider"></div>

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
import { onMounted, ref } from "vue";

import { useActions, useGetters } from "vuex-composition-helpers/dist";

const fullName = ref('')
const plan = ref('')
const image = ref('')

const { token, profile, teams } = useGetters({
  token: "auth/token",
  profile: "auth/profile",
  teams: "team/teams",
});

const { logoutUser } = useActions({ logoutUser: "auth/logoutUser" });

fullName.value = profile.value?.first_name + " " + profile.value?.last_name

const logout = () => { logoutUser({ token: token.value }) };

onMounted(() => {
  setTimeout(() => {
    teams.value.map((team) => {
      image.value = team?.image;
      if (team.active === true) {
        plan.value = team.subscription.plan.name;
      }
    });
  }, 1000);
});
</script>

<style scoped>
.header-navbar .navbar-container ul.navbar-nav li.dropdown-user .dropdown-menu {
  width: auto !important;
}

@media screen and (max-width: 767.98px) {
  .header-navbar .navbar-container .show~.dropdown-menu {
    left: auto !important;
  }
}
</style>