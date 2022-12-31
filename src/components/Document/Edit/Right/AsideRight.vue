<template>
  <div class="sidebar-left custom-md-none" :class="{ show: openSide }">
    <div class="sidebar">
      <div class="email-app-sidebar">
        <div class="email-app-menu">
          <div class="sidebar-menu-list sidebar-nav sticky shadow" style="width: 260px">
            <template v-if="profile?.id">
              <div class="list-group list-group-messages">
                <div class="list-group-item border-bottom">
                  <!-- <div class="d-flex justify-content-between align-items-center"> -->
                  <div>
                    Added Tool ({{ workingTools.length > 0 ? workingTools.length : 0 }})
                    <!-- </div> -->
                  </div>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="list-group-item border-bottom">
                <h5 class="form-label">Coming Soon!</h5>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useGetters } from "vuex-composition-helpers/dist";

const { profile, workingTools } = useGetters({
  profile: "auth/profile",
  link: "signLink/link",
  workingTools: "signLink/workingTools",
});

workingTools.value = computed(() => {
  return workingTools.value;
});
</script>

<style scoped>
.email-app-sidebar {
  background: transparent !important;
}

.list-group-item:hover {
  color: #6E6B7B !important;
}

.sidebar-nav.sticky {
  position: fixed !important;
  top: 165px;
  bottom: 0;
  background-color: #fff;
}

@media screen and (max-width: 1160px) {
  .custom-md-none {
    display: none;
  }
}
</style>
