<template>
  <div>
    <v-row class="mx-2">
      <v-col cols="12" md="5" class="pa-0">
        <v-tabs v-model="activeTab" color="#2196F3" align-tabs="left">
          <v-tab v-for="tab in tabList" :key="tab.id" @click="changeTab(tab)">{{
            tab.name
          }}</v-tab>
        </v-tabs>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="12" md="3">
        <v-text-field
          v-model="search"
          outlined
          prepend-inner-icon="search"
          label="Search"
          single-line
          hide-details
          class="rounded-lg"
          color="#2196F3"
          dense
        ></v-text-field>
      </v-col>
    </v-row>
    <v-card class="ma-5 dt-container" elevation="0" outlined>
      <v-data-table
        :headers="headers"
        :items="data"
        :items-per-page="10"
        :search="search"
        :options.sync="options"
        :loading="loading"
        @pagination="pagination"
        hide-default-footer
      >
        <template v-slot:[`item.fname`]="{ item }">
          {{ item.fname }} {{ item.lname }}
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            x-small
            color="blue"
            outlined
            @click="editItem(item)"
            class="mx-2"
          >
            <v-icon size="14">{{
              tab == 1 ? "mdi-pencil-outline" : "mdi-eye"
            }}</v-icon>
            {{ tab == 1 ? "Verify" : "View" }}
          </v-btn>

          <v-btn
            x-small
            color="red"
            outlined
            :class="tab == 2 ? 'd-none' : ''"
            @click="deleteItem(item)"
          >
            <v-icon size="14">mdi-delete-off</v-icon>Delete
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
    <v-row class="mb-2 mx-5" align="center">
      <v-col cols="auto" class="mr-auto text-truncate flex-items" no-gutters>
        <span class="px-2">Show</span>
        <span>
          <v-select
            dense
            outlined
            color="#2196F3"
            hide-details
            :value="options.itemsPerPage"
            style="max-width: 90px"
            class="rounded-lg"
            @change="options.itemsPerPage = parseInt($event, 10)"
            :items="perPageChoices"
          >
          </v-select>
        </span>
        <span class="px-2"> Entries </span>
      </v-col>

      <v-col cols="auto" class="mr-auto text-truncate" no-gutters>
        Showing {{ paginationData.pageStart + 1 }} to
        {{ paginationData.pageStop }} of
        {{ paginationData.itemsLength }} entries
      </v-col>
      <v-col cols="auto">
        <v-pagination
          v-model="options.page"
          class="rounded-lg"
          :total-visible="7"
          :color="$vuetify.theme.themes.light.submitBtns"
          :length="paginationData.pageCount"
        >
        </v-pagination>
      </v-col>
    </v-row>

    <AccountVerificationDialog :data="updateData" :action="action" />

    <v-dialog v-model="dialogConfirmDelete" max-width="500">
      <v-card>
        <v-card-title class="text-h5"> Confirmation </v-card-title>

        <v-card-text style="font-size: 17px">
          Are you sure you want to delete this item ?
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="teal darken-3"
            outlined
            @click="dialogConfirmDelete = false"
          >
            Cancel
          </v-btn>

          <v-btn
            :color="$vuetify.theme.themes.light.submitBtns"
            class="white--text"
            @click="
              confirmDelete();
              dialogConfirmDelete = false;
            "
          >
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <fade-away-message-component
      displayType="variation2"
      v-model="fadeAwayMessage.show"
      :message="fadeAwayMessage.message"
      :header="fadeAwayMessage.header"
      :top="fadeAwayMessage.top"
      :type="fadeAwayMessage.type"
    ></fade-away-message-component>
  </div>
</template>
<script>
export default {
  components: {
    AccountVerificationDialog: () =>
      import("../../components/Dialogs/Forms/AccountVerificationDialog.vue"),
  },
  data: () => ({
    search: "",
    headers: [
      { text: "Name", value: "name", align: "start" },
      {
        text: "Actions",
        value: "actions",
        align: "center",
        sortable: false,
        width: 200,
      },
    ],
    data: [],
    verified: [],
    perPageChoices: [
      { text: "5", value: 5 },
      { text: "10", value: 10 },
      { text: "20", value: 20 },
      { text: "50", value: 50 },
      { text: "100", value: 100 },
      { text: "250", value: 250 },
      { text: "500", value: 500 },
    ],
    activeTab: { id: 1, name: "For Verification" },
    tab: 1,
    tabList: [
      { id: 1, name: "For Verification" },
      { id: 2, name: "Verified" },
    ],
    totalCount: 0,
    deleteData: null,
    updateData: null,
    loading: false,
    options: {},
    action: null,
    paginationData: {},
    formdata: [],
    work_dates_menu: false,
    dialogConfirmDelete: false,
    fadeAwayMessage: {
      show: false,
      type: "success",
      header: "Successfully Deleted!",
      message: "",
      top: 10,
    },
  }),

  mounted() {
    this.eventHub.$on("closeAccountsVerificationDialog", () => {
      if (this.tab == 1) {
        this.initialize();
      } else if (this.tab == 2) {
        this.getVerifiedUsers();
      }
    });
  },
  beforeDestroy() {
    this.eventHub.$off("closeAccountsVerificationDialog");
  },

  watch: {
    options: {
      handler() {
        if (this.tab == 1) {
          this.initialize();
        } else if (this.tab == 2) {
          this.getVerifiedUsers();
        }
      },
      deep: true,
    },
  },

  methods: {
    pagination(data) {
      this.paginationData = data;
    },

    initialize() {
      this.loading = true;
      this.tab = 1;
      this.activeTab = { id: 1, name: "For Verification" };
      this.axiosCall("/user-details/getAllUsersToVerify", "GET").then((res) => {
        if (res) {
          // // console.log(res.data);
          let data = res.data;
          data.forEach((element, i) => {
            data[i].name = this.toTitleCase(element.name);
          });

          this.data = data;
          this.loading = false;
        }
      });
    },

    getVerifiedUsers() {
      this.loading = true;

      this.axiosCall("/user-details/getAllVerifiedUser", "GET").then((res) => {
        if (res) {
          let data = res.data;
          data.forEach((element, i) => {
            data[i].name = this.toTitleCase(element.name);
          });
          this.data = data;
          this.loading = false;
        }
      });
    },

    changeTab(tab) {
      this.activeTab = tab;

      if (tab.id == 1) {
        this.initialize();
        this.tab = tab.id;
      } else if (tab.id == 2) {
        this.getVerifiedUsers();
        this.tab = tab.id;
      }
    },

    deleteItem(item) {
      this.dialogConfirmDelete = true;
      this.deleteData = item;
    },

    editItem(item) {
      this.updateData = [{ id: null }];
      setTimeout(() => {
        this.updateData = item;
        this.action = this.tab == 1 ? "Verify" : "Update";
      }, 100);
    },

    confirmDelete() {
      this.axiosCall("/user-details/" + this.deleteData.id, "DELETE").then(
        (res) => {
          console.log(res.data);
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "success";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = "Account deleted successfully!";
          this.initialize();
        }
      );
    },
  },
};
</script>
