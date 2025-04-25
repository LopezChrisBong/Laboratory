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
        <v-select
          v-model="selectedDoctor"
          :items="doctors"
          label="Select Doctor"
          @change="changeSelected()"
        />
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
            <v-select
              v-model="form.doctorId"
              :items="doctors"
              item-title="name"
              item-value="id"
              label="Doctor"
              required
            />
            <v-text-field
              v-model="form.patientName"
              label="Patient Name"
              required
            />
            <v-text-field
              v-model="form.date"
              label="Date"
              type="date"
              required
            />
            <v-text-field
              v-model="form.time"
              label="Time"
              type="time"
              required
            />
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
      selectedDoctor: "Doctor 1",
      doctors: ["Doctor 1", "Doctor 2", "Doctor 3"],
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
  watch: {
    options: {
      handler() {
        this.initialize(this.selectedDoctor);
      },
      deep: true,
    },
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

      let appointmentData = JSON.parse(localStorage.getItem("appointmentData"));
      console.log("Selected doctor:", appointmentData);

      if (!appointmentData) {
        this.itemData = [];
        this.loading = false;
      } else {
        console.log("appointmentData:", appointmentData);
        this.itemData = appointmentData
          .filter((entry) => entry.doctorId === doctorData)
          .reverse();
        this.loading = false;
      }
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

      // if (this.form.id) {
      //   const index = this.appointments.findIndex((a) => a.id === this.form.id);
      //   if (index !== -1) this.appointments[index] = { ...this.form };
      // } else {
      //   this.form.id = Date.now();
      //   this.appointments.push({ ...this.form });
      // }
      let data = {
        id: this.generateUUID(),
        doctorId: this.form.doctorId,
        patientName: this.form.patientName,
        date: this.form.date,
        time: this.form.time,
      };
      let existingData =
        JSON.parse(localStorage.getItem("appointmentData")) || [];
      existingData.push(data);
      localStorage.setItem("appointmentData", JSON.stringify(existingData));
      //   this.items.push({ ...this.form, section: this.selectedSection });
      this.fadeAwayMessage.show = true;
      this.fadeAwayMessage.type = "success";
      this.fadeAwayMessage.header = "System Message";
      this.fadeAwayMessage.message = "Successfully Added";
      this.initialize(this.selectedDoctor);
      this.dialog = false;
      this.refresh();
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
