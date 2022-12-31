<template>
  <router-view v-slot="{ Component }">
    <transition-page>
      <component :is="Component" />
    </transition-page>
  </router-view>
</template>

<script>
export default {
  name: "App",

  mounted() {
    (function () {
      const propertyId = process.env.VUE_APP_TAWK_PROPERTY_ID;
      const widgetId = process.env.VUE_APP_TAWK_WIDGET_ID;
      const s1 = document.createElement("script"),
        s0 = document.getElementsByTagName("script")[0];
      s1.async = true;
      s1.src = "https://embed.tawk.to/" + propertyId + "/" + widgetId;
      s1.charset = "UTF-8";
      s1.setAttribute("crossorigin", "*");
      s0.parentNode.insertBefore(s1, s0);
    })();
  },
};
</script>

<style>

</style>
