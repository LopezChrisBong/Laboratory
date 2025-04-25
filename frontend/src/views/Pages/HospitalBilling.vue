<template>
  <div class="mx-2">
    <v-card class="mt-2">
      <v-row>
        <v-col cols="12">
          <!-- <v-toolbar flat class="rounded-xl mb-7">
                    <v-toolbar-title
                      ><strong class="text-gray-100">{{
                        $route.meta.title
                      }}</strong></v-toolbar-title
                    >
                    <v-spacer></v-spacer> -->
          <!-- <v-btn
                      class="white--text rounded-lg"
                      color="#239FAB"
                      @click="addOffice()"
                    >
                      <v-icon left> mdi-plus-box-outline </v-icon>
                      Add New Office
                    </v-btn> -->
          <!-- </v-toolbar> -->
          <HospitalBillingDataTable />
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
export default {
  components: {
    HospitalBillingDataTable: () =>
      import("../../components/Utils/HospitalBillingDataTable.vue"),
  },
  created() {
    // console.log("created");
    if (this.$store.state.expiryDate < Date.now()) {
      this.$store.dispatch("setUser", null);
      this.$store.dispatch("setIsAuthenticated", 0);
      this.render = true;
      this.$router.push("/");
      // location.reload();
    }
  },
  data: () => ({
    typeData: [],
    action: null,
  }),
  methods: {
    addOffice() {
      this.typeData = [{ id: null }];
      this.action = "Add";
    },
  },
};
</script>

<style></style>
