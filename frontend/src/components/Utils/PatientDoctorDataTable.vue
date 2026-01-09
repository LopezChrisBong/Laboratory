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
          class="white--text ml-2 rounded-lg"
          v-if="assignedModuleID == 2"
          color="#2196F3"
          @click="report()"
        >
          <v-icon left> mdi-eye </v-icon>
          Report
        </v-btn>
      </v-col>
    </v-row>
    <v-card class="ma-5 dt-container" elevation="0" outlined>
      <v-data-table
        :headers="assignedModuleID != 5 ? headers : headers1"
        :items="data"
        :items-per-page="10"
        :search="search"
        :options.sync="options"
        :loading="loading"
        @pagination="pagination"
        hide-default-footer
      >
        <template v-slot:[`item.name`]="{ item }">
          <p class="text-uppercase">
            {{ item.name }}
          </p>
        </template>
        <template v-slot:[`item.date`]="{ item }">
          {{ formatDate(item.date) }} {{ item.time }}
        </template>
        <template v-slot:[`item.created_at`]="{ item }">
          {{ formatDateTime(item.updated_at) }}
        </template>

        <template v-slot:[`item.services`]="{ item }">
          <v-chip v-for="element in filteredServices(item)" :key="element.id">
            {{ element.description }}
          </v-chip>
        </template>

        <template v-slot:[`item.packages`]="{ item }">
          <v-chip v-for="element in filteredPackages(item)" :key="element.id">
            {{ element.description }}
          </v-chip>
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
                  ? "Lab-request Done"
                  : "Done"
              }}
            </span>
          </v-chip>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            class="ma-1"
            x-small
            color="green"
            outlined
            @click="viewAll(item)"
          >
            <v-icon size="14">mdi-eye</v-icon>
          </v-btn>
          <!-- <v-btn
            class="ma-1"
            x-small
            color="green"
            outlined
            @click="medicalCertificate(item)"
          >
            <v-icon size="14">mdi-file-certificate</v-icon>
          </v-btn> -->

          <!-- <v-btn
            class="ma-1 d-flex justify-center"
            x-small
            color="green"
            outlined
            @click="editMedicalInfo(item)"
            block
            v-if="userRoleID == 3"
          >
            <v-icon size="14">mdi-note</v-icon>
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
          <v-btn
            icon
            variant="text"
            color="red"
            @click="
              dialog = false;
              initialize();
            "
          >
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
              <!-- Appointment -->
              <v-col cols="12" md="6" sm="12" v-if="assignedModuleID != 2">
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

              <v-col cols="12" md="6" sm="12" v-if="assignedModuleID != 2">
                <v-card
                  class="action-card text-center pa-4"
                  variant="outlined"
                  @click="medicalCertificate(patientItem)"
                >
                  <v-icon size="60">mdi-file-certificate</v-icon>
                  <div class="mt-2 text-subtitle-1 font-weight-medium">
                    Medical Certificate
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
              <v-col
                cols="12"
                sm="6"
                v-if="assignedModuleID == 2 || assignedModuleID == 5"
              >
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
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- Report Dialog -->
    <v-dialog v-model="reportDialog" persistent scrollable max-width="1200">
      <v-card style="max-height: 80vh; overflow-y: auto">
        <v-toolbar flat color="primary" dark dense height="56">
          <v-toolbar-title>Patient Reports</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="reportDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text>
          <v-row>
            <v-col cols="12" md="4">
              <v-select
                v-model="reportType"
                :items="['Weekly', 'Monthly', 'Yearly']"
                label="Select Report Type"
                @change="reportSelection()"
              ></v-select>
            </v-col>

            <v-col cols="12" md="4">
              <v-menu
                v-model="menu"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
              >
                <template #activator="{ on, attrs }">
                  <v-text-field
                    v-model="selectedDate"
                    label="Select Date"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="selectedDate"
                  @input="menu = false"
                  @change="reportSelection()"
                ></v-date-picker>
              </v-menu>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-card class="pa-4">
                <h3>{{ reportType }} Report for {{ formattedDate }}</h3>
                <v-divider class="my-2"></v-divider>

                <v-row>
                  <v-col cols="12" md="4">
                    <v-card outlined class="pa-2">
                      <div class="text-h6">Total Patients</div>
                      <div class="text-h4">{{ filteredData.length }}</div>
                    </v-card>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-card outlined class="pa-2">
                      <div class="text-h6">Total Services</div>
                      <div class="text-h4">{{ totalServices }}</div>
                    </v-card>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-card outlined class="pa-2">
                      <div class="text-h6">Total Packages</div>
                      <div class="text-h4">{{ totalPackages }}</div>
                    </v-card>
                  </v-col>
                </v-row>

                <v-data-table
                  :headers="headersReport"
                  :items="filteredData"
                  class="mt-4"
                >
                  <template #item.services="{ item }">
                    <span v-if="item.availed_services">{{
                      item.availed_services.length
                    }}</span>
                  </template>
                  <template #item.packages="{ item }">
                    <span v-if="item.availed_packages">{{
                      item.availed_packages.length
                    }}</span>
                  </template>
                  <template v-slot:[`item.services`]="{ item }">
                    <v-chip
                      v-for="element in filteredServices(item)"
                      :key="element.id"
                      small
                    >
                      {{ element.description }}
                    </v-chip>
                  </template>

                  <template v-slot:[`item.packages`]="{ item }">
                    <v-chip
                      small
                      v-for="element in filteredPackages(item)"
                      :key="element.id"
                    >
                      {{ element.description }}
                    </v-chip>
                  </template>
                  <template #item.created_at="{ item }">
                    {{ formatDate(item.created_at) }}
                  </template>
                </v-data-table>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>

    <AddPatientDialog :data="addPatient" :action="action" />
    <MedicalInformation :data="medicalInfo" />
    <ViewPatientAppointmentDialog :data="patientAppointement" />
    <ExaminePatientDialog :data="patientExamine" />
    <PrescriptionDialog :data="prescriptionData" />
    <ViewMedicalCertificateDialog :data="medicalCert" />

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
import moment from "moment";
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
    ViewMedicalCertificateDialog: () =>
      import(
        "../../components/Dialogs/Forms/Patient/ViewMedicalCertificateDialog.vue"
      ),
  },
  filters: {
    highlight: function (value, query) {
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
    medicalCert: null,
    headers: [
      { text: "Patient ID", value: "pID" },
      { text: "Name", value: "name" },

      { text: "Latest Laboratory Request", value: "services", align: "center" },
      { text: "Packages Availed", value: "packages", align: "center" },
      { text: "Date/Time", value: "created_at", align: "center" },
      { text: "Status", value: "status", align: "center" },

      {
        text: "Action",
        value: "actions",
        align: "end",
        sortable: false,
        width: 60,
      },
    ],

    headers1: [
      { text: "Patient ID", value: "pID" },
      { text: "Name", value: "name" },
      { text: "Date", value: "date", align: "center" },
      { text: "Doctor Name", value: "doctor_name", align: "center" },
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
    reportDialog: false,
    reportType: "Weekly",
    selectedDate: moment().format("YYYY-MM-DD"),
    menu: false,
    patients: [], // your patient data
    headersReport: [
      { text: "Name", value: "name" },
      { text: "Age", value: "age" },
      { text: "Gender", value: "gender" },
      { text: "Services", value: "services" },
      { text: "Packages", value: "packages" },
      { text: "Created At", value: "created_at" },
    ],
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
      const storedItem = localStorage.getItem("PatientData");
      this.patientItem = storedItem ? JSON.parse(storedItem) : null;
      this.initialize();
    });

    this.eventHub.$on("closeMedCertificateDialog", () => {
      const storedItem = localStorage.getItem("PatientData");
      this.patientItem = storedItem ? JSON.parse(storedItem) : null;
      this.initialize();
    });
    this.eventHub.$on("closePrescrioptionDialog", () => {
      const storedItem = localStorage.getItem("PatientData");
      this.patientItem = storedItem ? JSON.parse(storedItem) : null;
      this.initialize();
    });

    this.eventHub.$on("closeViewMedicalInformationDialog", () => {
      const storedItem = localStorage.getItem("PatientData");
      this.patientItem = storedItem ? JSON.parse(storedItem) : null;
      this.initialize();
    });
    this.eventHub.$on("closePatientLaboratoryDialog", () => {
      const storedItem = localStorage.getItem("PatientData");
      this.patientItem = storedItem ? JSON.parse(storedItem) : null;
      this.initialize();
    });
    this.eventHub.$on("closepatientAppointmentDialog", () => {
      const storedItem = localStorage.getItem("PatientData");
      this.patientItem = storedItem ? JSON.parse(storedItem) : null;
      this.initialize();
    });

    this.eventHub.$on("closeExamineDataDialog", () => {
      const storedItem = localStorage.getItem("PatientData");
      this.patientItem = storedItem ? JSON.parse(storedItem) : null;
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
    this.eventHub.$off("closeMedCertificateDialog");
  },

  watch: {
    options: {
      handler() {
        this.initialize();
      },
      deep: true,
    },
  },
  computed: {
    filteredServices() {
      return (item) => {
        if (!item?.availed_services) return [];

        const seen = new Set();

        return item.availed_services
          .filter((s) => s.description) // remove null/empty
          .filter((s) => {
            if (seen.has(s.description)) return false; // skip duplicates
            seen.add(s.description);
            return true;
          });
      };
    },

    filteredPackages() {
      return (item) => {
        if (!item?.availed_packages) return [];

        const seen = new Set();

        return item.availed_packages
          .filter((p) => p.description)
          .filter((p) => {
            if (seen.has(p.description)) return false;
            seen.add(p.description);
            return true;
          });
      };
    },
    formattedDate() {
      return moment(this.selectedDate).format("MMMM DD, YYYY");
    },
    filteredData() {
      const start = moment(this.selectedDate);
      let end;
      if (this.reportType === "Weekly") {
        start.startOf("week");
        end = moment(start).endOf("week");
      } else if (this.reportType === "Monthly") {
        start.startOf("month");
        end = moment(start).endOf("month");
      } else if (this.reportType === "Yearly") {
        start.startOf("year");
        end = moment(start).endOf("year");
      }

      return this.data.filter((p) => {
        const created = moment(p.created_at);
        return created.isBetween(start, end, undefined, "[]");
      });
    },
    totalServices() {
      return this.filteredData.reduce((sum, p) => {
        return sum + (p.availed_services ? p.availed_services.length : 0);
      }, 0);
    },
    totalPackages() {
      return this.filteredData.reduce((sum, p) => {
        return sum + (p.availed_packages ? p.availed_packages.length : 0);
      }, 0);
    },
  },
  methods: {
    formatDate(date) {
      return moment(date).format("MMM DD, YYYY hh:mm A");
    },
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
      localStorage.setItem("PatientData", JSON.stringify(item));
      this.patientItem = item;
      this.dialog = true;
    },
    editMedicalInfo(item) {
      this.medicalInfo = item;
    },

    patientAppointment(item) {
      this.patientAppointement = item;
    },
    examinePatient(item) {
      this.patientExamine = item;
    },
    report() {
      console.log("reprot");
      this.reportDialog = true;
    },
    // printItem(item) {
    //   const url =
    //     process.env.VUE_APP_SERVER +
    //     "/pdf-generator/printTravelOrder/" +
    //     item.id;
    //   window.open(url);
    // },

    // confirmDelete() {
    //   this.axiosCall("/request-type/" + this.deleteData.id, "DELETE").then(
    //     () => {
    //       this.fadeAwayMessage.show = true;
    //       this.itemData = null;
    //       this.initialize();
    //     }
    //   );
    // },
    reportSelection() {
      console.log("filteredData", this.filteredData);
    },
    medicalCertificate(item) {
      console.log(item);
      this.medicalCert = item;
    },
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
