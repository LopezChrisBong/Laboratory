<template>
  <v-container fluid>
    <v-row class="my-4" align="center">
      <v-col cols="12" md="6" class="pa-0">
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
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="12" md="6" class="d-flex justify-space-between">
        <v-autocomplete
          v-model="selectedDoctor"
          class="rounded-lg"
          item-text="name"
          item-value="id"
          label="Select Doctor"
          color="#6DB249"
          :items="doctors"
        >
        </v-autocomplete>
        <v-btn
          class="white--text ml-2 mt-3 rounded-lg"
          color="#2196F3"
          @click="openDialogWithDoctor(), (update = false)"
          >Book Appointment</v-btn
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
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn icon @click="openDialog(item), (update = true)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon @click="cancelAppointment(item.id)">
            <v-icon color="red">mdi-delete</v-icon>
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

    <v-dialog v-model="dialog" max-width="500px" persistent>
      <v-card>
        <v-card-title>
          <span class="headline">
            {{ form.id ? "Edit" : "Book" }} Appointment
          </span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-autocomplete
              v-model="form.doctorId"
              class="rounded-lg"
              item-text="name"
              item-value="id"
              label="Select Doctor"
              color="#6DB249"
              :items="doctors"
            >
            </v-autocomplete>
            <v-autocomplete
              v-model="form.patientName"
              class="rounded-lg"
              item-text="name"
              item-value="patientID"
              label="Patient Name"
              color="#6DB249"
              :items="patientList"
            >
            </v-autocomplete>
            <v-text-field
              v-model="form.patientName"
              label="Patient ID"
              readonly
              required
            />
            <v-text-field
              v-model="form.date"
              label="Date"
              type="date"
              required
            />
            <v-select
              v-model="form.time"
              :items="hourOptions"
              label="Time"
              required
            ></v-select>
            <!-- <v-text-field
              v-model="form.time"
              label="Time"
              :items="hourOptions"
              type="time"
              min="05:00"
              max="23:00"
              step="3600"
              required
            /> -->
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="dialog = false">Cancel</v-btn>
          <v-btn color="blue" @click="saveAppointment" v-show="update == false"
            >Save</v-btn
          >
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
      update: false,
      selectedDoctor: null,
      doctors: [],
      appointments: [],
      form: {
        id: null,
        doctorId: null,
        patientName: "",
        date: "",
        time: "",
      },
      headers: [
        { text: "Doctor", value: "doctorId", align: "start" },
        { text: "Patient", value: "patientName", align: "center" },
        { text: "Date", value: "date", align: "center" },
        { text: "Time", value: "time", align: "center" },
        { text: "Actions", value: "actions", sortable: false, align: "end" },
      ],
      options: {},
      patientList: [],
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
    this.initialize(this.selectedDoctor);
    this.getAllDoctors();
    this.getAllPatient();
  },
  watch: {
    options: {
      handler() {
        this.initialize(this.selectedDoctor);
        console.log("Selected 2", this.selectedDoctor);
      },
      deep: true,
    },
    // "form.time": {
    //   handler(val) {
    //     if (val) {
    //       const [hour, minute] = val.split(":").map(Number);
    //       if (hour < 5 || hour > 23 || minute !== 0) {
    //         this.form.time = ""; // reset or show error
    //         alert(
    //           "Please select a time on the hour between 5:00 AM and 11:00 PM."
    //         );
    //       }
    //     }
    //   },
    //   immediate: false, // set to true if you want it to run on load
    // },
  },
  computed: {
    // filteredAppointments() {
    //   if (!this.selectedDoctor) return this.appointmentsWithDoctorName;
    //   return this.appointmentsWithDoctorName.filter(
    //     (appt) => appt.doctorId === this.selectedDoctor
    //   );
    // },
    // appointmentsWithDoctorName() {
    //   return this.appointments.map((appt) => {
    //     const doctor = this.doctors.find((d) => d.id === appt.doctorId);
    //     return {
    //       ...appt,
    //       doctorName: doctor ? doctor.name : "Unknown",
    //     };
    //   });
    // },
  },
  methods: {
    pagination(data) {
      this.paginationData = data;
    },
    initialize(doctorData) {
      this.loading = true;

      console.log("Selectedss", doctorData);
      // this.axiosCall(
      //   "/appointment/getBookedAppintment/" + doctorData,
      //   "GET"
      // ).then((res) => {
      //   if (res) {
      //     this.itemData = res.data;
      //     this.loading = true;
      //   }
      // });
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
      this.axiosCall("/appointment/getAllPatient/", "GET").then((res) => {
        if (res) {
          this.patientList = res.data;
        }
      });
    },

    changeSelected() {
      this.initialize(this.selectedDoctor);
    },
    openDialog(item = null) {
      if (item) {
        this.form = { ...item };
      } else {
        this.form = {
          id: null,
          doctorId: this.selectedDoctor,
          patientName: "",
          date: "",
          time: "",
        };
      }
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

    generateUUID() {
      return "xxxx-4xxx-yxxx-xxxx".replace(/[xy]/g, function(c) {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    },
    saveAppointment() {
      if (!this.form.patientName || !this.form.date || !this.form.time) {
        this.fadeAwayMessage.show = true;
        this.fadeAwayMessage.type = "error";
        this.fadeAwayMessage.header = "System Message";
        this.fadeAwayMessage.message = "Please fill-up all field!";
        return;
      }
      let data = {
        doctorID: JSON.parse(this.form.doctorId.id),
        patientID: this.form.patientName,
        date: this.form.date,
        time: this.form.time,
      };
      console.log(data);
      this.axiosCall("/appointment/bookAppointment", "POST", data).then(
        (res) => {
          if (res.data.status == 200) {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "success";
            this.fadeAwayMessage.header = "Successfully Updated";
            this.dialog = false;
            this.refresh();
            this.close();
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
      if (this.selectedDoctor == null) {
        this.fadeAwayMessage.show = true;
        this.fadeAwayMessage.type = "error";
        this.fadeAwayMessage.header = "System Message";
        this.fadeAwayMessage.message = "Please select a doctor first!";
      } else {
        this.form = {
          id: null,
          doctorId: this.selectedDoctor,
          patientName: "",
          date: "",
          time: "",
        };

        this.dialog = true;
      }
    },
  },
};
</script>
