<template>
  <div class="row">
    <div class="col-md-2 px-0">
      <div :class="{ tabs_light: mode === 'light', tabs_dark: mode === 'dark' }">
        <ul class="tabs_header">
          <li v-for="(title, index) in tabTitles" :key="index" @click="selectedTitle = title" class="tab text-center"
            :class="{ tab__selected: title == selectedTitle }">
            {{ title }}
          </li>
        </ul>
      </div>
    </div>

    <div class="col-md-10">
      <slot />
    </div>
  </div>
</template>

<script>
import { ref, provide } from "vue";

export default {
  props: {
    mode: {
      type: String,
      default: "light",
    },
  },
  setup(props, { slots }) {
    const tabTitles = ref(slots.default().map((tab) => tab.props.title));

    const selectedTitle = ref(tabTitles.value[0]);

    provide("selectedTitle", selectedTitle);
    return { selectedTitle, tabTitles };
  },
};
</script>

<style scoped>
ul.tabs_header {
  display: flex;
  flex-direction: column;
  list-style: none;
  margin: 0;
  padding: 0;
}

ul.tabs_header>li {
  padding: 10px 5px;
  border-radius: 5px;
  display: inline-block;
  /* margin-right: 10px; */
  cursor: pointer;
  transition: 0.4s all ease-out;
}

ul.tabs_header>li.tab__selected {
  font-weight: bold;
  border-radius: 5px;
}

.tab {
  margin-bottom: 10px;
}

.tabs_light .tab {
  background-color: #fff;
}

.tabs_light li {
  text-transform: capitalize;
}

.tabs_light li.tab__selected {
  background-color: #003bb3;
  color: #fff;
}

.tabs_dark .tab {
  background-color: #555;
  color: #eee;
}

.tabs_dark li {
  background-color: #ddd;
  color: #aaa;
}

.tabs_dark li.tab__selected {
  background-color: #003bb3;
  color: #fff;
}

@media screen and (max-width: 767px) {
  ul.tabs_header {
    flex-direction: row;
  }

  ul.tabs_header>li {
    padding: 10px 15px;
    margin-right: 5px;
    margin-left: 8px;
  }
}
</style>
