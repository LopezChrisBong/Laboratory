<template>
  <div class="mx-2">
    <v-card class="mt-2">
      <v-row>
        <v-col cols="12">
          <v-toolbar flat class="rounded-xl mb-7">
            <v-toolbar-title
              ><strong>Supplier Management</strong></v-toolbar-title
            >
            <v-spacer></v-spacer>
            <v-btn
              class="white--text rounded-lg"
              color="#2196F3"
              @click="addSupplier()"
            >
              <v-icon left> mdi-plus-box-outline </v-icon>
              Add New Supplier
            </v-btn>
          </v-toolbar>
          <SupplierDataTable />
        </v-col>
      </v-row>
    </v-card>

    <SupplierDialog :data="supplierData" :action="action" />
  </div>
</template>

<script>
export default {
  name: "Supplier",
  components: {
    SupplierDataTable: () =>
      import("../../components/Utils/SupplierDataTable.vue"),
    SupplierDialog: () =>
      import("../../components/Dialogs/Forms/SupplierDialog.vue"),
  },
  data: () => ({
    supplierData: [],
    action: null,
  }),
  created() {
    if (this.$store.state.expiryDate < Date.now()) {
      this.$store.dispatch("setUser", null);
      this.$store.dispatch("setIsAuthenticated", 0);
      this.render = true;
      this.$router.push("/");
    }
  },
  methods: {
    addSupplier() {
      this.supplierData = [{ id: null }];
      this.action = "Add";
    },
  },
};
</script>

<style></style>
