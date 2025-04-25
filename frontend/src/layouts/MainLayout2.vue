<template>
  <v-app>
    <Navbar
      :reloadImg="reloadImg"
      :screenSmall="mini"
      v-on:closeNav="mini = false"
    />
  </v-app>
</template>

<script>
import Navbar from "../components/Navbar/Navbar2.vue";
export default {
  name: "App",
  components: {
    Navbar,
  },
  data() {
    return {
      drawer: true, // State for the sidebar
    };
  },
};
</script>

<style>
/* Add additional styling if needed */
</style>
