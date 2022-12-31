<template>
  <div class="sidebar-left custom-md-none" :class="{ show: openSide }">
    <div class="sidebar">
      <div class="email-app-sidebar">
        <div class="email-app-menu">
          <div class="sidebar-menu-list sidebar-nav sticky shadow" style="width: 260px">
            <div class="list-group list-group-messages">
              <div class="list-group-item border-bottom">
                <h5 class="form-label">Coming Soon!</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.email-app-sidebar {
  background: transparent !important;
}

.list-group-item:hover {
  color: #6e6b7b !important;
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
