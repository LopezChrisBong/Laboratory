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
          class="white--text ml-2 rounded-lg d-flex justify-center"
          color="#2196F3"
          @click="add()"
        >
          <v-icon left> mdi-plus-box-outline </v-icon>
          <v-icon left> mdi-account-injury </v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-card class="ma-5 dt-container" elevation="0" outlined>
      <v-data-table
        :headers="
          assignedModuleID == 3 && tab != 2
            ? headers
            : assignedModuleID == 5
            ? headers2
            : headers1
        "
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
        <template v-slot:[`item.date`]="{ item }">
          {{ formatDate(item.date) }} {{ item.time }}
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
          <div class="d-flex">
            <v-btn
              class="ma-1 d-flex justify-center"
              x-small
              color="green"
              outlined
              v-if="userRoleID != 3 && tab != 3"
              @click="view(item)"
            >
              <v-icon size="14" class="mr-1">mdi-pencil</v-icon>
            </v-btn>

            <v-btn
              class="ma-1 d-flex justify-center"
              x-small
              color="green"
              outlined
              v-if="userRoleID == 3"
              @click="viewPatient(item)"
            >
              <v-icon size="14" class="mr-1">mdi-eye</v-icon>View
            </v-btn>
            <v-btn
              class="ma-1 d-flex justify-center align-center"
              v-if="userRoleID == 3"
              @click="confirmDialogOpen(item)"
              x-small
              color="green"
              outlined
            >
              <v-icon size="14" class="mr-1">mdi-check-decagram</v-icon>Done
              Check-up
            </v-btn>
            <v-btn
              class="ma-1 d-flex justify-center"
              x-small
              color="red"
              outlined
              v-if="userRoleID == 3"
              @click="cancelPatient(item)"
            >
              <v-icon size="14" class="mr-1">mdi-timer-cancel</v-icon
              >Re-Schedule
            </v-btn>

            <!-- <v-btn
              class="ma-1 d-flex justify-center"
              x-small
              color="green"
              outlined
              @click="editMedicalInfo(item)"
              v-if="userRoleID == 3"
            >
              <v-icon size="14" class="mr-1">mdi-hospital-building</v-icon>
            </v-btn> -->

            <!-- <v-btn
              class="ma-1 d-flex justify-center"
              x-small
              color="green"
              outlined
              @click="editMedicalInfo(item)"
              block
              v-if="assignedModuleID != 2"
            >
              <v-icon size="14" class="mr-1">mdi-medication-outline</v-icon>
            </v-btn> -->
            <!-- <v-btn
              class="ma-1 d-flex justify-center"
              x-small
              color="green"
              outlined
              @click="patientAppointment(item)"
              block
              v-if="assignedModuleID != 2"
            >
              <v-icon size="14" class="mr-1">mdi-calendar</v-icon>
            </v-btn> -->

            <v-btn
              class="ma-1 d-flex justify-center"
              x-small
              color="green"
              outlined
              @click="examinePatient(item)"
              v-if="assignedModuleID == 2"
            >
              <v-icon size="14" class="mr-1">mdi-account-arrow-left</v-icon>
            </v-btn>
            <v-btn
              class="ma-1 d-flex justify-center"
              x-small
              color="green"
              outlined
              @click="laboratoryRequest(item)"
              v-if="assignedModuleID == 3"
            >
              <v-icon size="14" class="mr-1">mdi-account-arrow-left</v-icon>
            </v-btn>

            <!-- <v-btn
              class="ma-1 d-flex justify-center"
              x-small
              color="green"
              outlined
              @click="prescription(item)"
              v-if="assignedModuleID == 5"
            >
              <v-icon size="14" class="mr-1">mdi-prescription</v-icon>
            </v-btn> -->

            <!-- <v-btn
              class="ma-1 d-flex justify-center"
              x-small
              color="green"
              outlined
              @click="examinePatient(item)"
              v-if="assignedModuleID != 2 && assignedModuleID != 3"
            >
              <v-icon size="14" class="mr-1">mdi-medical-bag</v-icon>
            </v-btn> -->

            <!-- <v-btn
              class="ma-1 d-flex justify-center"
              x-small
              color="green"
              outlined
              @click="dialog = true"
              block
            >
              <v-icon size="14" class="mr-1">mdi-eye</v-icon>
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

    <v-dialog v-model="dialog" max-width="600px" persistent>
      <v-card class="rounded-lg elevation-3">
        <!-- Header -->
        <v-card-title class="d-flex align-center justify-space-between py-3">
          <span class="text-h6 font-weight-bold">Patient Actions</span>
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
                  <v-icon size="60" color="deep-purple">
                    mdi-file-sign
                  </v-icon>
                  <div class="mt-2 text-subtitle-1 font-weight-medium">
                    Prescription
                  </div>
                </v-card>
              </v-col>

              <!-- Examine -->
              <v-col cols="12" sm="6" v-if="assignedModuleID != 2">
                <v-card
                  class="action-card text-center pa-4"
                  variant="outlined"
                  @click="examinePatient(patientItem)"
                >
                  <v-icon size="60" color="orange"
                    >mdi-file-arrow-left-right</v-icon
                  >
                  <div class="mt-2 text-subtitle-1 font-weight-medium">
                    Laboratory Result
                  </div>
                </v-card>
              </v-col>
              <!-- Laboratory -->
              <v-col cols="12" sm="12" v-if="assignedModuleID != 2">
                <v-card
                  class="action-card text-center pa-4"
                  variant="outlined"
                  @click="laboratoryRequest(patientItem)"
                >
                  <v-icon size="60" color="orange"
                    >mdi-account-arrow-left</v-icon
                  >
                  <div class="mt-2 text-subtitle-1 font-weight-medium">
                    Laboratory/Ultrasound Request
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogConfirmDone" max-width="480" persistent>
      <v-card class="pa-2">
        <v-card-title class="text-h6 font-weight-bold">
          Confirm Completion
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class="pt-4 pb-6" style="font-size: 16px;">
          <v-row>
            <v-col cols="12" class="text-center">
              <v-icon size="60" color="teal-darken-2" class="mb-3"
                >mdi-check-circle</v-icon
              >

              <p class="text-body-1">
                Are you sure you want to mark this check-up as
                <strong>completed</strong>?
              </p>

              <p class="text-body-2 text-grey-darken-1 mt-2">
                This action will finalize the record and cannot be undone.
              </p>

              <p class="text-caption text-red mt-3">
                ⚠ Please note: this action is irreversible and cannot be undone.
              </p>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            variant="tonal"
            color="grey-darken-1"
            @click="dialogConfirmDone = false"
          >
            Cancel
          </v-btn>

          <v-btn
            :color="$vuetify.theme.themes.light.submitBtns"
            class="white--text"
            @click="
              () => {
                confirmDialog();
                dialogConfirmDone = false;
              }
            "
          >
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="cancelDialog" max-width="700" persistent>
      <v-card>
        <v-card-title class="text-h6">
          Please select another date to re-schedule the canceled appointment
        </v-card-title>

        <v-card-text style="font-size: 17px">
          <v-row>
            <v-col cols="12" md="6"
              >Appointment date: <b>{{ canceledData.date }}</b></v-col
            >
            <v-col cols="12" md="6"
              >Appointment time: <b>{{ canceledData.time }}</b></v-col
            >
            <v-col cols="12" md="6">
              <v-menu
                ref="menu"
                v-model="menu"
                :close-on-content-click="false"
                transition="scale-transition"
                :nudge-right="40"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="cancelDate"
                    label="Please update new appointment date"
                    prepend-icon="mdi-calendar"
                    readonly
                    dense
                    v-bind="attrs"
                    class="rounded-lg"
                    outlined
                    v-on="on"
                  />
                </template>
                <v-date-picker
                  v-model="cancelDate"
                  :min="minDate"
                  :max="maxDate"
                  @change="menu = false"
                />
              </v-menu>
            </v-col>
            <v-col cols="12" md="6">
              <v-autocomplete
                v-model="cancelTime"
                small-chips
                :rules="[(v) => !!v || 'Time is required']"
                label="Select Time"
                :items="filteredTimes"
                dense
                outlined
                class="rounded-lg"
                color="#6DB249"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="cancelRemarks"
                :rules="[formRules.required]"
                dense
                outlined
                required
                type="text"
                label="Remarks"
                class="rounded-lg"
                color="blue"
                counter="100"
                maxlength="100"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="teal darken-3" outlined @click="cancelDialog = false">
            Cancel
          </v-btn>

          <v-btn
            :color="$vuetify.theme.themes.light.submitBtns"
            class="white--text"
            :disabled="
              cancelRemarks != null && cancelDate != null && cancelTime != null
                ? false
                : true
            "
            @click="
              confirmCancelAppointment();
              dialogConfirmDone = false;
            "
          >
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <AddPatientDialog :data="addPatient" :action="action" />
    <MedicalInformation :data="medicalInfo" />
    <ViewPatientAppointmentDialog :data="patientAppointement" />
    <ExaminePatientDialog :data="patientExamine" />
    <VIewPatientLabRequestDialog :data="patientLabRequestData" :tabulet="tab" />
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
    dialog: false,
    menu: false,
    cancelDialog: false,
    cancelDate: null,
    cancelTime: null,
    service_fee: null,
    cancelRemarks: null,
    patientItem: [],
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
      { text: "Date", value: "date" },
      { text: "Specialization", value: "clinic" },
      // { text: "Status", value: "status" },
      // { text: "Next Visit", value: "nextVisit" },
      // { text: "Recent Topic", value: "recentTopic" },
      { text: "Recent Doctor", value: "doctor_name" },
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
      // { text: "Identification No.", value: "patientID" },
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
    headers2: [
      { text: "Name", value: "name" },
      { text: "Date", value: "date" },
      // { text: "Time", value: "time" },
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
      // { id: 4, name: "Done" },
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

    totalCount: 0,
    canceledData: [],
    checkupData: null,
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
    dialogConfirmDone: false,
    allTimes: [
      "12:00 AM",
      "01:00 AM",
      "02:00 AM",
      "03:00 AM",
      "04:00 AM",
      "05:00 AM",
      "06:00 AM",
      "07:00 AM",
      "08:00 AM",
      "09:00 AM",
      "10:00 AM",
      "11:00 AM",
      "12:00 PM",
      "01:00 PM",
      "02:00 PM",
      "03:00 PM",
      "04:00 PM",
      "05:00 PM",
      "06:00 PM",
      "07:00 PM",
      "08:00 PM",
      "09:00 PM",
      "10:00 PM",
      "11:00 PM",
    ],

    fadeAwayMessage: {
      show: false,
      type: "success",
      header: "Successfully Deleted!",
      message: "",
      top: 10,
    },
  }),
  computed: {
    filteredTimes() {
      const now = new Date();
      const todayStr = now.toISOString().split("T")[0]; // "YYYY-MM-DD"

      // Convert time like "02:00 PM" → total minutes
      const timeToMinutes = (t) => {
        const [time, modifier] = t.split(" ");
        let [hours, minutes] = time.split(":").map(Number);
        if (modifier === "PM" && hours !== 12) hours += 12;
        if (modifier === "AM" && hours === 12) hours = 0;
        return hours * 60 + minutes;
      };

      if (this.cancelDate === todayStr) {
        const nowMinutes = now.getHours() * 60 + now.getMinutes();
        return this.allTimes.filter((t) => timeToMinutes(t) > nowMinutes);
      }
      return this.allTimes;
    },
    // minDate() {
    //   const today = new Date();
    //   today.setMonth(today.getMonth());
    //   return today.toISOString().substr(0, 10);
    // },
    minDate() {
      return this.canceledData?.date ?? new Date().toISOString().substr(0, 10);
    },
    maxDate() {
      const today = new Date();
      today.setMonth(today.getMonth() + 4);
      return today.toISOString().substr(0, 10);
    },
  },

  mounted() {
    this.eventHub.$on("closePrescrioptionDialog", () => {
      const storedItem = localStorage.getItem("PatientData");
      this.patientItem = storedItem ? JSON.parse(storedItem) : null;
      // this.initialize();
    });

    this.eventHub.$on("closeAddPatient", () => {
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
    cancelPatient(item) {
      this.cancelDate = null;
      this.cancelTime = null;
      this.cancelRemarks = null;
      this.canceledData = item;
      this.cancelDialog = true;
    },
    pagination(data) {
      this.paginationData = data;
    },

    changeTab(tab) {
      this.activeTab = tab;
      this.tab = tab.id;
      this.initialize();
    },

    initialize() {
      this.getAllPatients();
      this.getAllPackages();
      this.getAllServices();
    },
    confirmDialogOpen(item) {
      this.checkupData = item;
      this.dialogConfirmDone = true;
      console.log(item);
    },
    confirmDialog() {
      let data = {
        status: 3,
      };
      this.axiosCall(
        "/appointment/confirmAppointment/" + this.checkupData.appointmentID,
        "PATCH",
        data
      ).then((res) => {
        if (res.data.status == 200) {
          // let newData = {
          //   patientId: this.checkupData.id,
          //   amount: this.service_fee,
          // };
          // this.axiosCall("/payment", "POST", newData).then((res) => {
          //   console.log(res.data);
          //   if (res.data.status == 200) {
          this.initialize();
          this.updateID = null;
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "success";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = res.data.msg;
          // setTimeout(() => {
          //   location.reload();
          // }, 1000);
          //   } else {
          //     this.fadeAwayMessage.show = true;
          //     this.fadeAwayMessage.type = "error";
          //     this.fadeAwayMessage.header = "System Message";
          //     this.fadeAwayMessage.message = res.data.msg;
          //   }
          // });
        } else {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = res.data.msg;
        }
      });
    },
    confirmCancelAppointment() {
      if (this.cancelRemarks != "") {
        let data = {
          date: this.cancelDate,
          time: this.cancelTime,
          // remarks: this.cancelRemarks,
        };
        console.log(data);
        this.axiosCall(
          "/appointment/confirmAppointment/" + this.canceledData.appointmentID,
          "PATCH",
          data
        ).then((res) => {
          if (res.data.status == 200) {
            this.initialize();
            this.updateID = null;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "success";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
            this.cancelDialog = false;
            this.cancelDate = null;
            this.cancelTime = null;
            this.cancelRemarks = null;
            // setTimeout(() => {
            //   location.reload();
            // }, 1000);
          } else {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
          }
        });
      } else {
        this.fadeAwayMessage.show = true;
        this.fadeAwayMessage.type = "error";
        this.fadeAwayMessage.header = "System Message";
        this.fadeAwayMessage.message = "Please fill-up the remarks field!";
      }
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
          // alert("updated");
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
    viewPatient(item) {
      localStorage.setItem("PatientData", JSON.stringify(item));
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
    laboratoryRequest(item) {
      // console.log(item);
      this.patientLabRequestData = item;
    },
    prescription(item) {
      // console.log(item);
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
<style scoped>
.action-card {
  cursor: pointer;
  transition: 0.2s ease;
}
.action-card:hover {
  background-color: #f5f5f5;
  transform: translateY(-3px);
}
</style>
