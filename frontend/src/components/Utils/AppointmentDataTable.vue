<template>
  <v-container fluid>
    <v-row class="my-4" align="center">
      <!-- <v-autocomplete
          v-model="selectedDoctor"
          class="rounded-lg"
          item-text="name"
          item-value="id"
          label="Select Doctor"
          color="#6DB249"
          :items="doctors"
        >
        </v-autocomplete> -->
      <v-spacer></v-spacer>
      <v-col cols="12" md="12" class="d-flex justify-space-between">
        <v-text-field
          v-model="search"
          outlined
          prepend-inner-icon="search"
          label="Search"
          single-line
          hide-details
          class="rounded-lg px-2"
          color="#239FAB"
          dense
        ></v-text-field>
        <v-btn
          class="white--text ml-2  rounded-lg"
          color="#2196F3"
          @click="openDialogWithDoctor(), (update = false)"
          ><v-icon left> mdi-plus-box-outline </v-icon></v-btn
        >
      </v-col>
    </v-row>
    <v-card class="ma-5 dt-container" elevation="0" outlined>
      <v-data-table
        :headers="headers"
        :items="itemData"
        class="elevation-1"
        :items-per-page="10"
        :search="search"
        :options.sync="options"
        :loading="loading"
        @pagination="pagination"
        hide-default-footer
      >
        <template v-slot:[`item.date`]="{ item }">
          {{ formatDate(item.date) }}
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn icon @click="openDialog(item), (update = true)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <!-- <v-btn icon @click="cancelAppointment(item.id)">
            <v-icon color="red">mdi-delete</v-icon>
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

    <v-dialog v-model="dialog" max-width="1000px" persistent>
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
                        block
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
                        <p class="">Doctor/s Encharge:</p>
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
                    clinicDecription.specialty == 'Others'
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
                <v-col cols="12" md="6">
                  <v-autocomplete
                    v-model="doctors_date"
                    small-chips
                    deletable-chips
                    :rules="[(v) => !!v || 'required']"
                    label="Select Date"
                    item-value="id"
                    item-text="date"
                    @change="changeSchedule(doctors_date)"
                    :items="doctors_schedList"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-autocomplete>
                  <br />
                  <v-autocomplete
                    v-model="doctor_time"
                    small-chips
                    deletable-chips
                    :rules="[(v) => !!v || 'Time is required']"
                    label="Select Time"
                    :items="allTimes1"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-autocomplete>
                  <br />

                  <v-autocomplete
                    v-if="action == 'Add'"
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
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" md="6">
                  <v-card class="pa-2">
                    <v-row>
                      <v-col
                        cols="12"
                        v-for="item in doc_profile"
                        :key="item.id"
                      >
                        <div>
                          <!-- <p>image {{ item.profile }}</p> -->
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
                </v-col>
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
            @click="(dialog = false), resetForm()"
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
            @click="action == 'Add' ? saveAppointment() : updateAppointment()"
          >
            {{ action == "Add" ? "Submit" : "Update" }}
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
      :timeout="3000"
    ></fade-away-message-component>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      dialog: false,
      clinicList: [],
      doc_profile: [],
      doctors_schedList: [],
      doctors_schedList1: [],
      update: false,
      valid: false,
      menu: false,
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
      headers: [
        { text: "Name", value: "name", align: "start" },
        { text: "PatientID", value: "unique_patientID", align: "center" },
        { text: "Date", value: "date", align: "center" },
        { text: "Time", value: "time", align: "center" },
        { text: "Actions", value: "actions", sortable: false, align: "end" },
      ],
      options: {},
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
      updateID: null,
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
      action: null,
      fadeAwayMessage: {
        show: false,
        type: "success",
        header: "Successfully Added!",
        message: "",
        top: 10,
      },
    };
  },
  mounted() {
    this.initialize();
    this.getAllDoctors();
    this.getAllPatient();
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
    minDate() {
      const today = new Date();
      today.setMonth(today.getMonth());
      return today.toISOString().substr(0, 10);
    },
    maxDate() {
      const today = new Date();
      today.setMonth(today.getMonth() + 1);
      return today.toISOString().substr(0, 10);
    },
  },
  methods: {
    initialize() {
      this.getAllClinic();
      this.getAllAppointment();
    },
    alerts() {
      this.fadeAwayMessage.show = true;
      this.fadeAwayMessage.type = "error";
      this.fadeAwayMessage.header = "Please select clinic for booking!";
      this.info = 1;
      this.confirmationDialog = false;
      // alert("Please fill all field before booking!");
    },
    pagination(data) {
      this.paginationData = data;
    },
    clinicData(item) {
      console.log(item);
      this.clinicDecription = item;
    },
    selectButton(index) {
      this.selectedIndex = index;
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
          console.log(res.data);
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
    changeSchedule(sched) {
      let newArr = [];
      for (let i = 0; i < this.doctors_schedList1.length; i++) {
        if (this.doctors_schedList1[i].id == sched) {
          newArr.push(this.doctors_schedList1[i]);
        }
      }

      this.doc_profile = newArr;
      console.log("Scdad", this.doc_profile);
    },
    getAllAppointment() {
      this.loading = true;

      this.axiosCall(
        "/appointment/getAllScheduleAppointment/AllAppointment",
        "GET"
      ).then((res) => {
        if (res) {
          this.itemData = res.data;
          this.loading = false;
        }
      });
    },
    getAllDoctors() {
      this.axiosCall("/appointment/findAllDoctors", "GET").then((res) => {
        let data = res.data;

        for (let i = 0; i < data.length; i++) {
          data[i].name = this.toTitleCase(data[i].name);
        }
        console.log("Doctors", data);
        this.selectedDoctor = data[0];
        this.doctors = data;
      });
    },

    getAllPatient() {
      this.axiosCall("/appointment/getAllPatient/" + 1, "GET").then((res) => {
        if (res) {
          this.patientList = res.data;
        }
      });
    },
    getAllClinic() {
      this.axiosCall("/doctor-specialization/getAllClinic", "GET").then(
        (res) => {
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
            // console.log("Clinic Data", this.clinicList);
          }
        }
      );
    },

    changeSelected() {
      this.initialize(this.selectedDoctor);
    },
    openDialog(item) {
      this.axiosCall(
        "/doctor-specialization/getSpecificClinic/" + item.clinic,
        "GET"
      ).then((res) => {
        this.clinicDecription = res.data;
        // console.log("description", res.data);
      });
      this.action = "Update";
      this.selectedIndex = item.clinic;
      console.log(item);
      this.updateID = item.id;
      this.dialog = true;
    },

    refresh() {
      this.form = {
        id: null,
        doctorId: null,
        patientName: "",
        date: "",
        time: "",
      };
    },

    saveAppointment() {
      let data = {
        patientID: this.patient,
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
      console.log(data);

      this.axiosCall("/appointment/bookAppointment", "POST", data).then(
        (res) => {
          if (res.data.status == 200) {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "success";
            this.fadeAwayMessage.header = "Successfully Updated";
            this.dialog = false;
            this.resetForm();
            this.close();
            this.initialize();
          } else if (res.data.status == 400) {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = res.data.msg;
          }
        }
      );
    },
    cancelAppointment(id) {
      // this.appointments = this.appointments.filter((a) => a.id !== id);
      alert("delete optional id:" + id);
    },
    openDialogWithDoctor() {
      // if (this.selectedDoctor == null) {
      //   this.fadeAwayMessage.show = true;
      //   this.fadeAwayMessage.type = "error";
      //   this.fadeAwayMessage.header = "System Message";
      //   this.fadeAwayMessage.message = "Please select a doctor first!";
      // } else {
      //   this.form = {
      //     id: null,
      //     doctorId: this.selectedDoctor,
      //     patientName: "",
      //     date: "",
      //     time: "",
      //   };
      // }
      this.action = "Add";
      this.dialog = true;
    },
    resetForm() {
      this.clinicDecription = [];
      this.doc_profile = null;
      this.doctor_time = null;
      this.doctors_date = null;
      this.doctors_schedList = [];
      this.doctors_schedList1 = [];
      this.selected = [];
      this.info = 1;
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
      console.log(data, this.updateID);
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
