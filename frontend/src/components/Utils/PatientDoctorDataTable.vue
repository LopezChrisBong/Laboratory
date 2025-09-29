<template>
  <div>
    <v-row class="mx-2">
      <v-col cols="12" md="6" class="pa-0">
        <!-- <v-tabs v-model="activeTab" color="#2196F3" align-tabs="left">
          <v-tab v-for="tab in tabList" :key="tab.id" @click="changeTab(tab)">{{
            tab.name
          }}</v-tab>
        </v-tabs> -->
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="12" md="12" class="d-flex justify-space-between">
        <v-text-field
          v-model="search"
          outlined
          prepend-inner-icon="search"
          label="Search"
          single-line
          hide-details
          class="rounded-lg"
          color="#239FAB"
          dense
        ></v-text-field>
        <v-btn
          v-if="assignedModuleID == 3"
          class="white--text ml-2 rounded-lg"
          color="#2196F3"
          @click="add()"
        >
          <v-icon left> mdi-plus-box-outline </v-icon>
          Add New
        </v-btn>
      </v-col>
    </v-row>
    <v-card class="ma-5 dt-container" elevation="0" outlined>
      <v-data-table
        :headers="assignedModuleID == 3 ? headers : headers1"
        :items="data"
        :items-per-page="10"
        :search="search"
        :options.sync="options"
        :loading="loading"
        @pagination="pagination"
        hide-default-footer
      >
        <template v-slot:[`item.fname`]="{ item }">
          <p class="text-uppercase">
            {{ item.fname }} {{ item.mname }} {{ item.lname }}
          </p>
        </template>
        <template v-slot:[`item.status`]="{ item }">
          <v-chip
            :color="
              item.status == 0 ? 'orange' : item.status == 1 ? 'blue' : 'green'
            "
            dark
            small
          >
            <span>
              {{
                item.status == 0
                  ? "Pending"
                  : item.status == 1
                  ? "On-Going"
                  : item.status == 2
                  ? "Lab-Result Done"
                  : "Done"
              }}
            </span>
          </v-chip>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            class="ma-1 "
            x-small
            color="green"
            outlined
            @click="viewAll(item)"
          >
            <v-icon size="14">mdi-eye</v-icon>
          </v-btn>
          <!-- <v-btn
            class="ma-1 "
            x-small
            color="green"
            outlined
            @click="view(item)"
          >
            <v-icon size="14">mdi-eye</v-icon>
          </v-btn> -->
          <!-- 
            <v-btn
              class="ma-1 d-flex justify-center"
              x-small
              color="green"
              outlined
              @click="editMedicalInfo(item)"
              block
              v-if="userRoleID == 3"
            >
              <v-icon size="14" >mdi-note</v-icon>Medical
              Information
            </v-btn> -->

          <!-- <v-btn
            class="ma-1"
            x-small
            color="green"
            outlined
            @click="editMedicalInfo(item)"
            v-if="assignedModuleID != 2"
          >
            <v-icon size="14">mdi-medication-outline</v-icon>
          </v-btn>
          <v-btn
            class="ma-1"
            x-small
            color="green"
            outlined
            @click="patientAppointment(item)"
            v-if="assignedModuleID != 2"
          >
            <v-icon size="14">mdi-calendar</v-icon>
          </v-btn>
          <v-btn
            class="ma-1"
            x-small
            color="green"
            outlined
            @click="prescription(item)"
            v-if="assignedModuleID == 5"
          >
            <v-icon size="14">mdi-prescription</v-icon>
          </v-btn>

          <v-btn
            class="ma-1"
            x-small
            color="green"
            outlined
            @click="examinePatient(item)"
            v-if="assignedModuleID == 2"
          >
            <v-icon size="14">mdi-account-arrow-left</v-icon>
          </v-btn>

          <v-btn
            class="ma-1"
            x-small
            color="green"
            outlined
            @click="examinePatient(item)"
            v-if="assignedModuleID != 2"
          >
            <v-icon size="14">mdi-medical-bag</v-icon>
          </v-btn> -->

          <!-- 
            <v-btn
              class="ma-1 d-flex justify-center"
              x-small
              color="green"
              outlined
              @click="printItem(item)"
              block
              v-if="assignedModuleID == 3"
            >
              <v-icon size="14" >mdi-printer</v-icon> Print
            </v-btn> -->
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
    <v-dialog v-model="dialog" max-width="600px" persistent>
      <v-card class="rounded-lg elevation-3">
        <!-- Header -->
        <v-card-title class="d-flex align-center justify-space-between py-3">
          <span class="text-h6 font-weight-bold">Patient Options</span>
          <v-btn icon variant="text" color="red" @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <!-- Body -->
        <v-card-text>
          <v-container fluid>
            <v-row dense>
              <!-- Information -->
              <v-col cols="12" sm="6">
                <v-card
                  class="action-card text-center pa-4"
                  variant="outlined"
                  @click="view(patientItem)"
                >
                  <v-icon size="60" color="primary"
                    >mdi-file-cog-outline</v-icon
                  >
                  <div class="mt-2 text-subtitle-1 font-weight-medium">
                    Patient Information
                  </div>
                </v-card>
              </v-col>

              <!-- Medical Info -->
              <v-col cols="12" sm="6" v-if="userRoleID == 3">
                <v-card
                  class="action-card text-center pa-4"
                  variant="outlined"
                  @click="editMedicalInfo(patientItem)"
                >
                  <v-icon size="60" color="teal"
                    >mdi-file-image-plus-outline</v-icon
                  >
                  <div class="mt-2 text-subtitle-1 font-weight-medium">
                    Medical Records
                  </div>
                </v-card>
              </v-col>

              <!-- Prescription -->
              <v-col cols="12" sm="6" v-if="assignedModuleID != 2">
                <v-card
                  class="action-card text-center pa-4"
                  variant="outlined"
                  @click="prescription(patientItem)"
                >
                  <v-icon size="60" color="deep-purple">mdi-file-sign</v-icon>
                  <div class="mt-2 text-subtitle-1 font-weight-medium">
                    Prescription
                  </div>
                </v-card>
              </v-col>

              <!-- Examine -->
              <v-col cols="12" sm="6" v-if="assignedModuleID == 2">
                <v-card
                  class="action-card text-center pa-4"
                  variant="outlined"
                  @click="examinePatient(patientItem)"
                >
                  <v-icon size="60" color="orange"
                    >mdi-file-arrow-left-right</v-icon
                  >
                  <div class="mt-2 text-subtitle-1 font-weight-medium">
                    Laboratory
                  </div>
                </v-card>
              </v-col>

              <!-- Appointment -->
              <v-col cols="12" sm="6" v-if="assignedModuleID != 2">
                <v-card
                  class="action-card text-center pa-4"
                  variant="outlined"
                  @click="patientAppointment(patientItem)"
                >
                  <v-icon size="60" color="green">
                    mdi-file-chart-check-outline
                  </v-icon>
                  <div class="mt-2 text-subtitle-1 font-weight-medium">
                    Appointment
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>

    <AddPatientDialog :data="addPatient" :action="action" />
    <MedicalInformation :data="medicalInfo" />
    <ViewPatientAppointmentDialog :data="patientAppointement" />
    <ExaminePatientDialog :data="patientExamine" />
    <PrescriptionDialog :data="prescriptionData" />
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
    AddPatientDialog: () =>
      import("../../components/Dialogs/Forms/Patient/AddPatientDialog.vue"),
    MedicalInformation: () =>
      import(
        "../../components/Dialogs/Forms/Patient/ViewMedicalInformationDialog.vue"
      ),
    ViewPatientAppointmentDialog: () =>
      import(
        "../../components/Dialogs/Forms/Patient/ViewPatientAppointmentDialog.vue"
      ),
    ExaminePatientDialog: () =>
      import("../../components/Dialogs/Forms/Patient/ExaminePatientDialog.vue"),
    PrescriptionDialog: () =>
      import("../../components/Dialogs/Forms/Patient/PrescriptionDialog.vue"),
  },
  filters: {
    highlight: function(value, query) {
      return value.replace(
        new RegExp(query, ""),
        "<span class='blue'>" + query + "</span>"
      );
    },
  },
  data: () => ({
    search: "",
    deadline_date: null,
    resetDeadlineDialog: false,
    dialog: false,
    patientItem: [],
    patientAppointement: null,
    prescriptionData: null,
    patientExamine: null,
    medicalInfo: null,
    headers: [
      { text: "Name", value: "name" },
      { text: "Identification No.", value: "patientID" },
      { text: "Last Visit", value: "lastVisit" },
      { text: "Status", value: "status" },
      { text: "Next Visit", value: "nextVisit" },
      { text: "Recent Topic", value: "recentTopic" },
      { text: "Recent Doctor", value: "recentDoctor" },
      {
        text: "Action",
        value: "actions",
        align: "end",
        sortable: false,
        width: 60,
      },
    ],

    headers1: [
      { text: "Name", value: "name" },
      { text: "Identification No.", value: "patientID" },
      // { text: "Last Visit", value: "lastVisit" },
      // { text: "Status", value: "status" },
      // { text: "Next Visit", value: "nextVisit" },
      // { text: "Recent Topic", value: "recentTopic" },
      // { text: "Recent Doctor", value: "recentDoctor" },
      {
        text: "Action",
        value: "actions",
        align: "end",
        sortable: false,
        width: 60,
      },
    ],

    data: [],
    addPatient: null,
    perPageChoices: [
      { text: "5", value: 5 },
      { text: "10", value: 10 },
      { text: "20", value: 20 },
      { text: "50", value: 50 },
      { text: "100", value: 100 },
      { text: "250", value: 250 },
      { text: "500", value: 500 },
    ],
    // activeTab: { id: 1, name: "For Verification" },
    // tab: 1,
    // tabList: [
    //   { id: 1, name: "To Approve" },
    //   { id: 2, name: "Approved" },
    // ],
    totalCount: 0,
    deleteData: null,
    updateData: null,
    viewData: null,
    userRoleID: null,
    assignedModuleID: null,
    loading: false,
    options: {},
    action: null,
    tar_toID: null,
    paginationData: {},
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
    this.eventHub.$on("closeAddPatient", () => {
      this.dialog = false;
      this.initialize();
    });
    this.eventHub.$on("closeViewMedicalInformationDialog", () => {
      this.dialog = false;
      this.initialize();
    });
    this.eventHub.$on("closePatientLaboratoryDialog", () => {
      this.dialog = false;
      this.initialize();
    });
    this.eventHub.$on("closepatientAppointmentDialog", () => {
      this.dialog = false;
      this.initialize();
    });

    this.eventHub.$on("closeExamineDataDialog", () => {
      this.dialog = false;
      this.initialize();
    });
  },
  beforeDestroy() {
    this.eventHub.$off("closeAddPatient");
    this.eventHub.$off("closeViewMedicalInformationDialog");
    this.eventHub.$off("closePatientLaboratoryDialog");
    this.eventHub.$off("closepatientAppointmentDialog");
    this.eventHub.$off("closeExamineDataDialog");
  },

  watch: {
    options: {
      handler() {
        this.initialize();
      },
      deep: true,
    },
  },

  methods: {
    pagination(data) {
      this.paginationData = data;
    },
    prescription(item) {
      // console.log(item);
      this.prescriptionData = item;
    },

    // changeTab(tab) {
    //   this.activeTab = tab;
    //   this.initialize();
    //   this.tab = tab.id;
    // },

    initialize() {
      this.loading = true;
      this.userRoleID = this.$store.state.user.user.user_roleID;
      this.assignedModuleID = this.$store.state.user.user.assignedModuleID;
      if (this.assignedModuleID == 5) {
        this.axiosCall(
          "/appointment/getAllPatientForDoctor/" + this.$store.state.user.id,
          "GET"
        ).then((res) => {
          if (res) {
            this.data = res.data;
            this.loading = false;
          }
        });
      } else if (this.assignedModuleID == 2) {
        this.axiosCall(
          "/appointment/getAllPatientForMedtech/" + this.$store.state.user.id,
          "GET"
        ).then((res) => {
          if (res) {
            this.data = res.data;
            this.loading = false;
          }
        });
      }
    },

    editItem(item) {
      this.updateData = item;
      this.action = "View";
    },
    updateItem(item) {
      this.viewData = item;
      this.action = "Update";
    },
    add() {
      this.addPatient = { id: null };
      this.action = "Add";
    },
    view(item) {
      this.addPatient = item;
      this.action = "View";
    },
    viewAll(item) {
      this.patientItem = item;
      this.dialog = true;
    },
    editMedicalInfo(item) {
      this.medicalInfo = item;
    },

    patientAppointment(item) {
      // console.log(item);
      this.patientAppointement = item;
    },
    examinePatient(item) {
      this.patientExamine = item;
    },

    printItem(item) {
      const url =
        process.env.VUE_APP_SERVER +
        "/pdf-generator/printTravelOrder/" +
        item.id;
      window.open(url);
    },

    // confirmDelete() {
    //   this.axiosCall("/request-type/" + this.deleteData.id, "DELETE").then(
    //     () => {
    //       this.fadeAwayMessage.show = true;
    //       this.itemData = null;
    //       this.initialize();
    //     }
    //   );
    // },
  },
};
</script>
<style scoped>
.action-card {
  cursor: pointer;
  transition: 0.25s ease;
}
.action-card:hover {
  background-color: #f9f9f9;
  transform: translateY(-3px);
}
</style>
