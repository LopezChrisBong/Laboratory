<template>
  <div class="mx-2">
    <v-card class="mt-2">
      <v-row>
        <v-col cols="12">
          <InventoryDataTable />
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
export default {
  components: {
    InventoryDataTable: () =>
      import("../../components/Utils/InventoryDataTable.vue"),
  },
  created() {
    // // console.log("created");
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
