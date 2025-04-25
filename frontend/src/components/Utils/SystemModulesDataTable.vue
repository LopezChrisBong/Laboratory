<template>
  <div>
    <v-row class="mx-2">
      <v-col cols="12" md="6"> </v-col>
      <v-spacer></v-spacer>
      <!-- <v-col cols="12" md="6" class="d-flex justify-space-between">
        <v-text-field
          v-model="search"
          outlined
          prepend-inner-icon="search"
          label="Search"
          single-line
          hide-details
          class="rounded-lg"
          color="blue"
          dense
        ></v-text-field>
        <v-btn
          class="white--text ml-2 rounded-lg"
          color="#2196F3"
          @click="addOffice()"
        >
          <v-icon left> mdi-plus-box-outline </v-icon>
          Add New Office
        </v-btn>
      </v-col> -->
    </v-row>
    <v-row>
      <v-col cols="4" class="pa-2">
        <v-card style="card-style">
          <v-data-table
            :headers="headers"
            :items="data"
            :items-per-page="20"
            hide-default-footer
          >
            <!-- <template v-slot:[`item.actions`]="{ item }">
          <v-btn small color="grey" icon @click="editItem(item)">
            <v-icon>mdi-pencil-outline</v-icon>
          </v-btn>

         
        </template> -->
          </v-data-table>
        </v-card>
      </v-col>
      <v-col cols="4" class="pa-2">
        <v-card style="card-style">
          <v-data-table
            :headers="headers1"
            :items="data"
            :items-per-page="20"
            hide-default-footer
          >
            <!-- <template v-slot:[`item.actions`]="{ item }">
          <v-btn small color="grey" icon @click="editItem(item)">
            <v-icon>mdi-pencil-outline</v-icon>
          </v-btn>

         
        </template> -->
          </v-data-table>
        </v-card></v-col
      >
      <v-col cols="4" class="pa-2">
        <v-card style="card-style">
          <v-data-table
            :headers="headers2"
            :items="data"
            :items-per-page="20"
            hide-default-footer
          >
            <!-- <template v-slot:[`item.actions`]="{ item }">
          <v-btn small color="grey" icon @click="editItem(item)">
            <v-icon>mdi-pencil-outline</v-icon>
          </v-btn>

         
        </template> -->
          </v-data-table>
        </v-card></v-col
      >
    </v-row>

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
            color="teal darken-3"
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
import draggable from "vuedraggable";
export default {
  components: {
    draggable,
  },

  data: () => ({
    list1: [{ name: "Drag Me!" }],
    list2: [{ name: "Drag Me Too!" }],
    search: "",
    headers: [
      { text: "Name", value: "name", align: "start" },
      {
        text: "Actions",
        value: "actions",
        align: "right",
      },
    ],
    headers1: [
      { text: "Modules", value: "name", align: "start" },
      {
        text: "Actions",
        value: "actions",
        align: "right",
      },
    ],
    headers2: [
      { text: "Sub-modules", value: "name", align: "start" },
      {
        text: "Actions",
        value: "actions",
        align: "right",
      },
    ],
    data: [],
    perPageChoices: [
      { text: "5", value: 5 },
      { text: "10", value: 10 },
      { text: "20", value: 20 },
      { text: "50", value: 50 },
      { text: "100", value: 100 },
      { text: "250", value: 250 },
      { text: "500", value: 500 },
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
  watch: {
    options: {
      handler() {
        this.initialize();
      },
      deep: true,
    },
  },
  mounted() {
    this.eventHub.$on("closeOfficeDialog", () => {
      this.initialize();
    });
  },
  beforeDestroy() {
    this.eventHub.$off("closeOfficeDialog");
  },
  methods: {
    pagination(data) {
      this.paginationData = data;
    },
    initialize() {
      this.loading = true;
      this.axiosCall("/offices", "GET").then((res) => {
        if (res) {
          this.data = res.data;
          this.loading = false;
        }
      });
    },
    addOffice() {
      this.updateData = [{ id: null }];
      this.action = "Add";
    },
    deleteItem(item) {
      this.dialogConfirmDelete = true;
      this.deleteData = item;
    },
    editItem(item) {
      this.updateData = item;
      this.action = "Update";
    },
    confirmDelete() {
      this.axiosCall("/request-type/" + this.deleteData.id, "DELETE").then(
        () => {
          this.fadeAwayMessage.show = true;
          this.itemData = null;
          this.initialize();
        }
      );
    },
  },
};
</script>
