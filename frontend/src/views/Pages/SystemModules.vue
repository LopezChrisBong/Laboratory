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
              color="#2196F3"
              @click="addPosition()"
            >
              <v-icon left> mdi-plus-box-outline </v-icon>
              Add New Position
            </v-btn> -->
          <!-- </v-toolbar> -->
          <PositionDataTable :reloadTable="reload" />
        </v-col>
      </v-row>
    </v-card>

    <PositionDialog :data="typeData" :action="action" />
  </div>
</template>

<script>
export default {
  components: {
    PositionDataTable: () =>
      import("../../components/Utils/PositionDataTable.vue"),
    PositionDialog: () =>
      import("../../components/Dialogs/Forms/PositionDialog.vue"),
  },
  data: () => ({
    typeData: [],
    action: null,
    reload: false,
  }),
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
  methods: {
    refresh() {
      setTimeout(() => {
        this.reload = true;
      }, 500);
      this.reload = false;
    },
    addPosition() {
      this.typeData = [{ id: null }];
      this.action = "Add";
    },
  },
};
</script>

<style></style>
