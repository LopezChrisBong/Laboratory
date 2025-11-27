<template>
  <div>
    <v-dialog v-model="dialog" eager persistent scrollable max-width="1000px">
      <v-card>
        <v-card-title dark class="dialog-header pt-5 pb-5 pl-6">
          <span>Appointment</span>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="closeD()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text style="max-height: 700px" class="my-4">
          <v-card>
            <v-row>
              <v-col cols="8" class="flex-items mt-2">
                <!-- <div class="ml-2 text-body-1">
                  {{ data.title }}
                </div> -->
              </v-col>
              <v-spacer></v-spacer>
              <v-col
                cols="2"
                class="d-flex justify-end mt-2 mr-2"
                v-if="addAppointmentData"
              >
                <v-btn
                  @click="AddAppointment()"
                  class="white--text rounded-lg"
                  color="blue"
                >
                  Add
                </v-btn>
              </v-col>
              <v-col cols="12" class=" pt-2 px-4">
                <v-data-table
                  :headers="headers"
                  :items="dataItem"
                  :items-per-page="10"
                >
                  <template v-slot:[`item.index`]="{ index }">
                    {{ index + 1 }}.
                  </template>
                  <template v-slot:[`item.date`]="{ item }">
                    {{ formatDate(item.date) }}
                  </template>

                  <template v-slot:[`item.status`]="{ item }">
                    <v-chip
                      :color="
                        item.status == 0
                          ? 'orange'
                          : item.status == 1
                          ? 'orange'
                          : 'blue'
                      "
                      dark
                      small
                    >
                      <span>{{
                        item.status == 0
                          ? "For Confirmation"
                          : item.status == 1
                          ? "Pending"
                          : "Done"
                      }}</span>
                    </v-chip>
                  </template>
                  <template v-slot:[`item.action`]="{ item }">
                    <!-- <v-btn
                      x-small
                      class="mt-1"
                      @click="view(item)"
                      outlined
                      color="green"
                      block
                      >View</v-btn
                    > -->
                    <v-btn
                      x-small
                      class="mt-1"
                      @click="edit(item)"
                      outlined
                      color="blue"
                      v-if="item.status == 0"
                      >View</v-btn
                    >
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
          </v-card>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="pa-5">
          <v-spacer></v-spacer>

          <v-btn color="red" outlined @click="closeD()">
            <v-icon>mdi-close-circle-outline</v-icon>
            Close
          </v-btn>

          <!-- <v-btn color="blue" class="white--text" @click="submitTarget()">
                <v-icon>mdi-check-circle</v-icon>
                Submit
              </v-btn> -->
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="addAppointmentDialog" max-width="1000px" persistent>
      <v-card>
        <v-card-title>
          <span class="headline">
            {{ form.id ? "Edit" : "Book" }} Appointment
          </span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid">
            <v-col cols="12" v-show="info == 1">
              <v-row>
                <v-col cols="12" md="5">
                  <ul style="list-style-type: none; padding: 0;">
                    <li
                      v-for="(item, index) in clinicList"
                      :key="item.id || index"
                      style="margin-bottom: 8px;"
                      :class="{ selected: selectedIndex === index }"
                    >
                      <v-btn
                        class="clinicButtons"
                        :class="{ selected: selectedIndex === index }"
                        @click="
                          selectButton(index);
                          clinicData(item);
                        "
                      >
                        {{ item.specialty }}
                      </v-btn>
                    </li>
                  </ul>
                </v-col>
                <v-col cols="12" md="7">
                  <v-card class="pa-2">
                    <v-card class="ma-1">
                      <v-card-title>
                        <span class="">Description:</span></v-card-title
                      >
                      <div
                        class="d-flex justify-center align-center"
                        style="text-align: justify;"
                      >
                        <p>
                          {{ clinicDecription.description }}
                        </p>
                      </div>
                    </v-card>
                    <v-card class="ma-1">
                      <v-card-title>
                        <p class="">Doctor/s Incharge:</p>
                      </v-card-title>
                      <div class="mb-2">
                        <ul class="pb-2">
                          <li
                            v-for="item in clinicDecription.doctors"
                            :key="item.id"
                          >
                            Dr. {{ item.name }}
                          </li>
                        </ul>
                      </div>
                    </v-card>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>

            <v-col cols="12" v-show="info == 2">
              <v-row
                v-if="
                  !clinicDecription.doctors ||
                    clinicDecription.specialty == 'Others' ||
                    assignModule == 5
                "
              >
                <v-col cols="12" md="4" sm="12">
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
                        v-model="form.date"
                        label="Pick a date"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      />
                    </template>
                    <v-date-picker
                      v-model="form.date"
                      :min="minDate"
                      :max="maxDate"
                      @change="menu = false"
                    />
                  </v-menu>
                </v-col>
                <v-col cols="12" md="4" sm="12">
                  <v-autocomplete
                    v-model="form.time"
                    small-chips
                    deletable-chips
                    :rules="[(v) => !!v || 'Time is required']"
                    label="Select Time"
                    :items="allTimes"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" md="4" v-if="action == 'Add'">
                  <v-autocomplete
                    v-model="patient"
                    small-chips
                    deletable-chips
                    :rules="[(v) => !!v || 'required']"
                    label="Select Patient"
                    item-value="id"
                    item-text="name"
                    :items="patientList"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-autocomplete
                ></v-col>
              </v-row>
              <v-row v-else>
                <v-col cols="12" md="12">
                  <div class="d-flex">
                    <v-autocomplete
                      v-model="doctors_date"
                      style="width: 100px;"
                      small-chips
                      deletable-chips
                      :rules="[(v) => !!v || 'required']"
                      label="Select Date"
                      item-value="id"
                      item-text="date"
                      @change="changeSchedule(doctors_date)"
                      :items="doctors_schedList"
                      class="rounded-lg mx-10"
                      color="#6DB249"
                    ></v-autocomplete>
                    <v-autocomplete
                      v-model="doctor_time"
                      small-chips
                      style="width: 100px;"
                      deletable-chips
                      :rules="[(v) => !!v || 'Time is required']"
                      label="Select Time"
                      :items="allTimes1"
                      class="rounded-lg"
                      color="#6DB249"
                    ></v-autocomplete>

                    <v-autocomplete
                      v-if="action == 'Add'"
                      v-model="patient"
                      small-chips
                      style="width: 100px;"
                      deletable-chips
                      :rules="[(v) => !!v || 'required']"
                      label="Select Patient"
                      item-value="id"
                      item-text="name"
                      :items="patientList"
                      class="rounded-lg"
                      color="#6DB249"
                    ></v-autocomplete>
                  </div>
                </v-col>
                <!-- <v-col cols="12" md="6">
                  <v-card class="pa-2">
                    <v-row>
                      <v-col
                        cols="12"
                        v-for="item in doc_profile"
                        :key="item.id"
                      >
                        <div>
                          <v-img
                            style="width: 200px; height: 150px;"
                            :src="item.profile"
                          ></v-img>
                        </div>
                        <div>
                          <p>
                            Name:<b> Dr. {{ item.name }}</b>
                          </p>
                        </div>
                        <div>
                          <p>Field of experties:</p>
                          <ul>
                            <li
                              v-for="items in item.specialization"
                              :key="items.id"
                            >
                              {{ items.specialty }}
                            </li>
                          </ul>
                        </div>
                      </v-col>
                    </v-row>
                  </v-card>
                </v-col> -->
              </v-row>
            </v-col>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="red"
            outlined
            class="mt-4"
            @click="(addAppointmentDialog = false), resetForm()"
          >
            Cancel
          </v-btn>
          <v-btn
            v-if="info != 1"
            :disabled="valid"
            color="primary"
            class="mt-4"
            @click="info = 1"
          >
            Return
          </v-btn>
          <v-btn
            v-if="info == 2"
            :disabled="!valid"
            color="primary"
            class="mt-4"
            type="submit"
            @click="saveAppointment()"
          >
            Submit
          </v-btn>
          <v-btn v-if="info == 1" color="primary" class="mt-4" @click="next()">
            Next
          </v-btn>
          <!-- <v-btn color="blue" @click="saveAppointment" v-show="update == false"
            >Save</v-btn
          > -->
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
  components: {},
  props: {
    data: null,
  },
  data() {
    return {
      options: {},
      updateID: null,
      action: null,
      menu: false,
      labID: null,
      date: null,
      time: null,
      desc: null,
      itemToDelete: null,
      addAppointmentDialog: false,
      fadeAwayMessage: {
        show: false,
        type: "success",
        header: "Successfully Added!",
        message: "",
        top: 10,
      },
      dialog: false,
      medicalData: null,
      id: null,
      userRoleID: null,
      isButtonLoading: false,
      assignAppointmentDialog: false,
      addAppointmentData: false,
      dataItem: [],
      bookings: [],
      dataServices: [],
      dataPackages: [],
      medtech: null,
      medtechList: [],
      headers: [
        {
          text: "No.",
          value: "index",
          align: "start",
          valign: "start",
          width: 50,
          sortable: false,
        },
        {
          text: "Date Scheduled",
          value: "date",
          align: "start",
          valign: "start",
          sortable: false,
        },

        {
          text: "Time",
          value: "time",
          align: "center",
          valign: "center",
          sortable: false,
        },

        {
          text: "Status",
          value: "status",
          align: "end",
          valign: "end",
          sortable: false,
        },
      ],
      doctorID: null,
      clinicList: [],
      doc_profile: [],
      doctors_schedList: [],
      doctors_schedList1: [],
      update: false,
      valid: false,
      patient: null,
      selectedDoctor: null,
      doctors: [],
      selectedIndex: null,
      info: 1,
      appointments: [],
      doctors_date: null,
      doctor_time: null,
      form: {
        id: null,
        doctorId: null,
        patientName: "",
        date: "",
        time: "",
      },

      patientList: [],
      clinicDecription: [],
      hourOptions: [
        "05:00",
        "06:00",
        "07:00",
        "08:00",
        "09:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
        "18:00",
        "19:00",
        "20:00",
        "21:00",
        "22:00",
        "23:00",
      ],
      allTimes: [
        "07:00 AM",
        "08:00 AM",
        "09:00 AM",
        "10:00 AM",
        "11:00 AM",
        "01:00 PM",
        "02:00 PM",
        "03:00 PM",
        "04:00 PM",
      ],
      allTimes1: [
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
        "12:00 AM",
      ],
      assignModule: null,
      search: "",
      loading: false,
      paginationData: {},
      perPageChoices: [
        { text: "5", value: 5 },
        { text: "10", value: 10 },
        { text: "20", value: 20 },
        { text: "50", value: 50 },
        { text: "100", value: 100 },
        { text: "250", value: 250 },
        { text: "500", value: 500 },
      ],
      itemData: [],
    };
  },

  computed: {
    minDate() {
      const today = new Date();
      today.setMonth(today.getMonth());
      return today.toISOString().substr(0, 10);
    },
    maxDate() {
      const today = new Date();
      today.setMonth(today.getMonth() + 12);
      return today.toISOString().substr(0, 10);
    },
  },

  watch: {
    data: {
      handler(data) {
        this.dialog = true;
        // console.log("STRAT", data);
        if (data.doctorID) {
          this.doctor = data.doctorID.toString();
        } else {
          this.doctor = null;
        }

        if (data.medtechID) {
          this.medtech = data.medtechID.toString();
        } else {
          this.medtech = null;
        }

        this.id = data.id;
        this.initialize();
        // alert(data.id);
        this.tab = 1;
      },
      deep: true,
    },
    options: {
      handler() {
        this.initialize();
      },
      deep: true,
    },
  },
  mounted() {
    this.assignModule = this.$store.state.user.user.assignedModuleID;
    this.doctorID = this.$store.state.user.id;
  },

  beforeDestroy() {},

  methods: {
    initialize() {
      this.loading = true;
      this.getAllDoctors();
      this.getAllClinic();
      this.userRoleID = this.$store.state.user.user.user_roleID;

      this.axiosCall(
        "/appointment/getBookedAppointment/" + this.id,
        "GET"
      ).then((res) => {
        if (res) {
          // console.log("Data", res.data);
          const hasOne = res.data.some((item) => item.status === 1);
          if (hasOne) {
            this.addAppointmentData = false;
          } else {
            this.addAppointmentData = true;
          }
          this.dataItem = res.data;
          this.loading = false;
        }
      });
    },
    next() {
      if (this.info == 1) {
        this.info = 2;
        this.getAllDoctorsSchedule();
      }
    },

    getAllDoctorsSchedule() {
      let docList;
      if (
        !this.clinicDecription.doctors ||
        this.clinicDecription.specialty == "Others"
      ) {
        docList = [];
      } else {
        docList = JSON.stringify(this.clinicDecription.doctors);
      }
      this.axiosCall(
        "/doctors-schedule/getAllDoctorsSched/" + docList,
        "GET"
      ).then((res) => {
        if (res) {
          // console.log(res.data);
          let data = res.data;
          Object.assign(data, { oldDate: null });
          this.doctors_schedList1 = res.data;
          for (let i = 0; i < data.length; i++) {
            data[i].oldDate = data[i].date;
            data[i].date =
              this.formatDate(data[i].date) +
              " From: " +
              data[i].timeFrom +
              " To: " +
              data[i].timeTo;

            data[i].profile = data[i].profile
              ? process.env.VUE_APP_SERVER +
                "/user-details/getProfileImg/" +
                data[i].profile
              : process.env.VUE_APP_SERVER +
                "/user-details/getProfileImg/img_avatar.png";
          }

          this.doctors_schedList = data;
        }
      });
    },
    clinicData(item) {
      // console.log(item);
      this.clinicDecription = item;
    },
    selectButton(index) {
      this.selectedIndex = index;
    },
    getAllDoctors() {
      this.axiosCall("/appointment/findAllDoctors", "GET").then((res) => {
        let data = res.data;

        for (let i = 0; i < data.length; i++) {
          data[i].name = this.toTitleCase(data[i].name);
        }
        // console.log("Doctors", data);

        // if (this.data.doctorID == null) {
        //   this.doctor = data[0];
        // }
        this.doctorList = data;
      });
    },
    changeSchedule(sched) {
      let newArr = [];
      for (let i = 0; i < this.doctors_schedList1.length; i++) {
        if (this.doctors_schedList1[i].id == sched) {
          newArr.push(this.doctors_schedList1[i]);
        }
      }

      this.doc_profile = newArr;
      // console.log("Scdad", this.doc_profile);
    },
    saveAppointment() {
      let data = {
        patientID: this.data.id,
        status: 1,
        date: this.form.date,
        time: this.form.time,
        clinic: this.clinicDecription.specialty
          ? this.clinicDecription.specialty
          : "",
        doctorID: this.doctorID,
      };
      console.log(data);

      this.axiosCall("/appointment/bookAppointment", "POST", data).then(
        (res) => {
          if (res.data.status == 200) {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "success";
            this.fadeAwayMessage.header = "Successfully Updated";
            this.dialog = false;
            this.addAppointmentDialog = false;
            this.initialize();
          } else if (res.data.status == 400) {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = res.data.msg;
          }
        }
      );
    },

    updateAppointment() {
      let data = {
        date:
          this.clinicDecription.specialty == "Others" ||
          !this.clinicDecription.doctors
            ? this.form.date
            : this.doc_profile[0].oldDate,
        time:
          this.clinicDecription.specialty == "Others" ||
          !this.clinicDecription.doctors
            ? this.form.time
            : this.doctor_time,
        clinic: this.clinicDecription.specialty
          ? this.clinicDecription.specialty
          : "",
        doctorID:
          this.clinicDecription.specialty == "Others" ||
          !this.clinicDecription.doctors
            ? null
            : this.doc_profile[0].doctorID,
      };
      // console.log(data, this.updateID);
      this.axiosCall("/appointment/" + this.updateID, "PATCH", data).then(
        (res) => {
          if (res.data.status == 201) {
            // alert("updated");
            this.initialize();
            this.updateID = null;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "success";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;

            this.dialog = false;
            this.resetForm();
          } else if (res.data.status == 400) {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
          }
        }
      );
    },

    changeTab(tab) {
      this.activeTab = tab;
      this.tab = tab.id;
    },
    confirmSubmitService() {
      this.confirmDialog = true;
    },
    doctorsFee(item) {
      console.log(item);
      this.doctorFeeDialog = true;
    },
    confirmUpdateService() {
      let data = {
        patientID: this.id,
        appointmentID: this.updateID,
        service_list: JSON.stringify(this.selected),
        package_list: JSON.stringify(this.selectedPackage),
      };
      // console.log(data);
      this.axiosCall(
        "/services/updateServiceAppointment/" + this.updateID,
        "PATCH",
        data
      ).then((res) => {
        if (res.data.status == 201 && res.data.status == 200) {
          // alert("updated");
          this.initialize();
          this.updateID = null;
          this.oldSelected = [];
          this.selected = [];
          this.oldSelectedPackage = [];
          this.selectedPackage = [];
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "success";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = res.data.msg;
          this.addAppointmentDialog = false;
          this.confirmDialog = false;
          this.resetForm();
        } else if (res.data.status == 400) {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = res.data.msg;
        } else {
          this.initialize();
          this.updateID = null;
          this.oldSelected = [];
          this.selected = [];
          this.oldSelectedPackage = [];
          this.selectedPackage = [];
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "success";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = res.data.msg;
          this.addAppointmentDialog = false;
          this.confirmDialog = false;
          this.resetForm();
        }
      });
    },

    resetForm() {
      this.addAppointmentDialog = false;
      this.laboratoryDialog = false;
      this.date = null;
      this.time = null;
      this.clinicDecription = [];
      this.doc_profile = null;
      this.doctor_time = null;
      this.doctors_date = null;
      this.doctors_schedList = [];
      this.doctors_schedList1 = [];
      this.selected = [];
      this.info = 1;
    },
    closeD() {
      this.eventHub.$emit("closepatientAppointmentDialog", false);
      this.activeTab = { id: 1, name: "Laboratory" };
      this.tab = 1;
      this.dataItem = [];
      this.dialog = false;
    },

    edit(item) {
      // console.log(item);
      this.addAppointmentDialog = true;
      this.clinic = parseInt(item.clinic);
      this.date = item.date;
      this.time = item.time;
      this.updateID = item.id;
      this.action = "Update";
    },
    view(item) {
      // console.log(item);
      this.addAppointmentDialog = true;
      this.clinic = parseInt(item.clinic);
      this.date = item.date;
      this.time = item.time;
      this.action = "View";
    },

    AddAppointment() {
      this.addAppointmentDialog = true;
    },
    getAllClinic() {
      let userID = this.$store.state.user.id;
      console.log(userID);
      this.axiosCall(
        "/doctor-specialization/getAllDoctorClinic/" + userID,
        "GET"
      ).then((res) => {
        if (res) {
          let others = [
            {
              specialty: "Others",
              description: "No specific Clinic to visit!",
              doctors: [],
            },
          ];
          this.clinicList = res.data;
          Object.assign(this.clinicList, others);
          // this.clinicList.reverse();
          // // console.log("Clinic Data", this.clinicList);
        }
      });
    },
  },
};
</script>
<style scoped>
:hover.clinicButtons {
  background-color: green;
  color: white;
}
.clinicButtons:focus {
  background-color: green;
  color: white;
}

.selected {
  background-color: #0d6933 !important;
  color: white !important;
}
</style>
