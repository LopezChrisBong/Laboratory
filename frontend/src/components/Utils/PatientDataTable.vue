<template>
  <div>
    <v-row class="mx-2">
      <v-col cols="12" md="12" class="pa-0">
        <v-tabs
          v-model="activeTab"
          color="#2196F3"
          align-tabs="left"
          v-if="assignedModuleID == 3"
        >
          <v-tab v-for="tab in tabList" :key="tab.id" @click="changeTab(tab)"
            >{{ tab.name }}
          </v-tab>
        </v-tabs>
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
          <div class="">
            <v-btn
              class="ma-1 d-flex justify-start"
              x-small
              color="green"
              outlined
              @click="view(item)"
              block
            >
              <v-icon size="14" class="mr-1">mdi-eye</v-icon>Profile
            </v-btn>
            <!-- 
            <v-btn
              class="ma-1 d-flex justify-start"
              x-small
              color="green"
              outlined
              @click="editMedicalInfo(item)"
              block
              v-if="userRoleID == 3"
            >
              <v-icon size="14" class="mr-1">mdi-note</v-icon>Medical
              Information
            </v-btn> -->

            <v-btn
              class="ma-1 d-flex justify-start"
              x-small
              color="green"
              outlined
              @click="editMedicalInfo(item)"
              block
              v-if="assignedModuleID != 2"
            >
              <v-icon size="14" class="mr-1">mdi-note</v-icon>Medical
              Information
            </v-btn>
            <v-btn
              class="ma-1 d-flex justify-start"
              x-small
              color="green"
              outlined
              @click="patientAppointment(item)"
              block
              v-if="assignedModuleID != 2"
            >
              <v-icon size="14" class="mr-1">mdi-calendar</v-icon>Appointment
            </v-btn>

            <v-btn
              class="ma-1 d-flex justify-start"
              x-small
              color="green"
              outlined
              @click="examinePatient(item)"
              block
              v-if="assignedModuleID == 2"
            >
              <v-icon size="14" class="mr-1">mdi-account-arrow-left</v-icon
              >Examine
            </v-btn>
            <v-btn
              class="ma-1 d-flex justify-start"
              x-small
              color="green"
              outlined
              @click="laboratoryRequest(item)"
              block
              v-if="assignedModuleID == 3"
            >
              <v-icon size="14" class="mr-1">mdi-account-arrow-left</v-icon
              >Laboratory Request
            </v-btn>
            <v-btn
              class="ma-1 d-flex justify-start"
              x-small
              color="green"
              outlined
              @click="prescription(item)"
              block
              v-if="assignedModuleID != 2"
            >
              <v-icon size="14" class="mr-1">mdi-account-arrow-left</v-icon
              >Prescription
            </v-btn>

            <v-btn
              class="ma-1 d-flex justify-start"
              x-small
              color="green"
              outlined
              @click="examinePatient(item)"
              block
              v-if="assignedModuleID != 2 && assignedModuleID != 3"
            >
              <v-icon size="14" class="mr-1">mdi-mortar-pestle-plus</v-icon>Lab
              Result
            </v-btn>

            <!-- 
            <v-btn
              class="ma-1 d-flex justify-start"
              x-small
              color="green"
              outlined
              @click="printItem(item)"
              block
              v-if="assignedModuleID == 3"
            >
              <v-icon size="14" class="mr-1">mdi-printer</v-icon> Print
            </v-btn> -->
          </div>
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

    <AddPatientDialog :data="addPatient" :action="action" />
    <MedicalInformation :data="medicalInfo" />
    <ViewPatientAppointmentDialog :data="patientAppointement" />
    <ExaminePatientDialog :data="patientExamine" />
    <VIewPatientLabRequestDialog :data="patientLabRequestData" />
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

    VIewPatientLabRequestDialog: () =>
      import(
        "../../components/Dialogs/Forms/Patient/VIewPatientLabRequestDialog.vue"
      ),

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
    patientLabRequestData: null,
    patientAppointement: null,
    patientExamine: null,
    medicalInfo: null,
    dataPackages: [],
    prescriptionData: null,
    dataServices: [],
    selected: [],
    selectedPackage: [],
    headers: [
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

    activeTab: { id: 1, name: "Patients" },
    tab: 1,
    tabList: [
      { id: 1, name: "Patients" },
      { id: 2, name: "Pending Laboratory" },
      { id: 3, name: "Pending Checkup" },
      { id: 4, name: "Done" },
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
      this.initialize();
    });
    this.eventHub.$on("closeViewMedicalInformationDialog", () => {
      this.initialize();
    });
    this.eventHub.$on("closePatientLaboratoryDialog", () => {
      this.initialize();
    });
    this.eventHub.$on("closepatientAppointmentDialog", () => {
      this.initialize();
    });

    this.eventHub.$on("closeExamineDataDialog", () => {
      this.initialize();
    });

    this.eventHub.$on("closePrescrioptionDialog", () => {
      this.initialize();
    });
  },
  beforeDestroy() {
    this.eventHub.$off("closeAddPatient");
    this.eventHub.$off("closeViewMedicalInformationDialog");
    this.eventHub.$off("closePatientLaboratoryDialog");
    this.eventHub.$off("closepatientAppointmentDialog");
    this.eventHub.$off("closeExamineDataDialog");
    this.eventHub.$off("closePrescrioptionDialog");
  },

  watch: {
    options: {
      handler() {
        this.initialize();
        this.tab = 1;
      },
      deep: true,
    },
  },

  methods: {
    pagination(data) {
      this.paginationData = data;
    },

    changeTab(tab) {
      this.activeTab = tab;
      this.tab = tab.id;
      this.initialize();
    },

    initialize() {
      this.loading = true;
      this.getAllPackages();
      this.getAllServices();
      this.getAllPatients();
    },
    getAllPatients() {
      this.userRoleID = this.$store.state.user.user.user_roleID;
      this.assignedModuleID = this.$store.state.user.user.assignedModuleID;
      if (this.tab == 1) {
        if (
          this.assignedModuleID != 3 &&
          this.assignedModuleID != 1 &&
          this.assignedModuleID != 4
        ) {
          this.axiosCall(
            "/appointment/getAllPatientByRole/" + this.$store.state.user.id,
            "GET"
          ).then((res) => {
            if (res) {
              this.data = res.data;
              this.loading = false;
            }
          });
        } else {
          this.axiosCall("/appointment/getAllPatient/" + this.tab, "GET").then(
            (res) => {
              if (res) {
                this.data = res.data;
                this.loading = false;
              }
            }
          );
        }
      } else {
        this.axiosCall("/appointment/getAllPatient/" + this.tab, "GET").then(
          (res) => {
            if (res) {
              this.data = res.data;
              this.loading = false;
            }
          }
        );
      }
    },

    getAllServices() {
      this.axiosCall(
        "/services/getAllServicesForBooking/" + this.tab,
        "GET"
      ).then((res) => {
        if (res) {
          this.dataServices = res.data;
        }
      });
    },
    getAllPackages() {
      this.axiosCall("/services", "GET").then((res) => {
        if (res) {
          this.dataPackages = res.data;
        }
      });
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
    editMedicalInfo(item) {
      this.medicalInfo = item;
    },

    patientAppointment(item) {
      console.log(item);
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
    laboratoryRequest(item) {
      console.log(item);
      this.patientLabRequestData = item;
    },
    prescription(item) {
      console.log(item);
      this.prescriptionData = item;
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
