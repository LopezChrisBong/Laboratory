<template>
  <v-container fluid>
    <v-row>
      <!-- LEFT PANEL: Booking Appointment -->
      <v-col cols="12" md="6" v-if="assignModule == 1">
        <v-card outlined>
          <v-card-title>
            Users Logs
          </v-card-title>

          <v-row>
            <v-col>
              <v-data-table
                :headers="headers"
                :items="userLogs"
                :items-per-page="5"
                class="elevation-1"
              >
                <template v-slot:item.created_at="{ item }">
                  {{ formatDate(item.created_at) }}
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" v-if="assignModule == 1">
        <v-card outlined>
          <v-card-title>
            Entry Logs
          </v-card-title>

          <v-row>
            <v-col>
              <v-data-table
                :headers="entryHeaders"
                :items="entryLogs"
                :items-per-page="5"
                class="elevation-1"
              >
                <template v-slot:item.created_at="{ item }">
                  {{ formatDate(item.created_at) }}
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col cols="12">
        <ReceptionistDashboard />
      </v-col>
      <!-- MIDDLE PANEL: Doctor List -->
      <v-col cols="12" md="12">
        <v-card outlined>
          <v-card-title>
            Doctor List
            <v-spacer></v-spacer>
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
          </v-card-title>

          <v-divider></v-divider>

          <v-container>
            <v-row>
              <v-col
                v-for="doctor in filteredDoctors"
                :key="doctor.id"
                cols="12"
                sm="4"
              >
                <v-card outlined>
                  <v-card-text class="text-center">
                    <v-avatar size="150" class="mb-2">
                      <v-img :src="doctor.profile"></v-img>
                    </v-avatar>

                    <div class="font-weight-medium">{{ doctor.name }}</div>
                  </v-card-text>

                  <v-card-actions class="pa-2">
                    <v-btn color="primary" @click="appointmentDoctor(doctor)"
                      >Appointment</v-btn
                    >
                    <v-spacer></v-spacer>
                    <v-btn
                      color="green"
                      class="white--text"
                      @click="selectDoctor(doctor)"
                      >Detail</v-btn
                    >
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>

      <!-- Doctor Details Dialog -->
      <v-dialog v-model="dialog" persistent max-width="400px">
        <v-card v-if="selectedDoctor">
          <v-card-title class="headline justify-center">
            DOCTOR DETAILS
          </v-card-title>

          <v-card-text class="text-center">
            <v-avatar size="120" class="mb-3">
              <v-img :src="selectedDoctor.profile"></v-img>
            </v-avatar>
            <div class="title">{{ selectedDoctor.name }}</div>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-text>
            <strong>Specialty:</strong>
            <div class="grey--text d-flex flex-wrap justify-left mb-3">
              <v-chip
                v-for="items in selectedDoctor.specialization"
                :key="items.id"
                small
                outlined
                color="primary"
                class="ma-1"
              >
                {{ items.specialty }}
              </v-chip>
            </div>

            <strong>Schedule:</strong>
            <div class="grey--text d-flex flex-wrap justify-left">
              <v-chip
                v-for="items in selectedDoctor.schedules"
                :key="items.id"
                small
                outlined
                color="primary"
                class="ma-1"
              >
                {{ items.schedule }}
              </v-chip>
            </div>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions class="justify-end">
            <v-btn
              text
              color="red"
              @click="
                dialog = false;
                selectedDoctor = null;
              "
              >Close</v-btn
            >
          </v-card-actions>
        </v-card>
        <v-card v-else-if="doctorAppointment">
          <v-card-title class="headline justify-center">
            DOCTOR APPOINTMENT
          </v-card-title>

          <v-card-text class="text-center">
            <v-avatar size="120" class="mb-3">
              <v-img :src="doctorAppointment.profile"></v-img>
            </v-avatar>
            <div class="title">{{ doctorAppointment.name }}</div>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-text>
            <strong>Appointment:</strong>

            <v-data-table
              v-if="appointmentData && appointmentData.length"
              :headers="appointmentHeaders"
              :items="appointmentData"
              class="elevation-1"
              dense
              fixed-header
              height="200px"
            >
              <!-- Format Start -->
              <template v-slot:item.start="{ item }">
                <v-chip small outlined :color="item.color" dark>
                  {{ formatDate(item.start) }}
                </v-chip>
              </template>
            </v-data-table>

            <div v-else class="grey--text d-flex flex-wrap justify-left mb-3">
              <v-chip color="red" outlined small class="ma-1">
                No appointment found.
              </v-chip>
            </div>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions class="justify-end">
            <v-btn
              text
              color="red"
              @click="
                dialog = false;
                doctorAppointment = null;
                appointmentData = null;
              "
              >Close</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </v-container>
</template>

<script>
export default {
  components: {
    ReceptionistDashboard: () => import("../Pages/ReceptionistDashboard.vue"),
  },
  data() {
    return {
      selectedDate: new Date().toISOString().substr(0, 10),
      selectedTime: null,
      patientConcerns: "",
      assignModule: null,
      search: "",
      dialog: false,
      entryLogs: [],
      userLogs: [],
      action: null,
      doctors: [],
      appointmentData: null,
      selectedDoctor: null,
      doctorAppointment: null,
      appointmentHeaders: [
        { text: "Patient", value: "name", align: "start", sortable: false },
        { text: "Date", value: "start", align: "end", sortable: false },
      ],
      entryHeaders: [
        { text: "action", value: "action", align: "start", sortable: false },
        {
          text: "description",
          value: "description",
          align: "center",
          sortable: false,
        },
        { text: "Date", value: "created_at", align: "end", sortable: false },
      ],
      headers: [
        { text: "User name", value: "email", align: "start", sortable: false },
        { text: "Logs", value: "created_at", align: "center", sortable: false },
      ],
      timeSlots: [
        { time: "08:00 AM", disabled: false },
        { time: "09:00 AM", disabled: false },
        { time: "10:00 AM", disabled: false },
        { time: "11:00 AM", disabled: true },
        { time: "12:30 PM", disabled: false },
        { time: "01:30 PM", disabled: false },
        { time: "02:30 PM", disabled: false },
        { time: "03:30 PM", disabled: false },
        { time: "04:30 PM", disabled: false },
        { time: "05:30 PM", disabled: false },
      ],
    };
  },
  mounted() {
    this.assignModule = this.$store.state.user.user.assignedModuleID;
    this.initialize();
  },
  computed: {
    formattedDate() {
      return new Date(this.selectedDate).toDateString();
    },
    filteredDoctors() {
      if (!this.search) return this.doctors;
      return this.doctors.filter((d) =>
        d.name.toLowerCase().includes(this.search.toLowerCase())
      );
    },
  },
  methods: {
    selectDoctor(doctor) {
      this.selectedDoctor = doctor;
      this.dialog = true;
      this.action = "Detail";
    },
    appointmentDoctor(doctor) {
      this.doctorAppointment = doctor;
      this.getAllAppointment(doctor.doctorID);
      this.dialog = true;
      this.action = "Appointment";
    },
    getAllAppointment(id) {
      this.axiosCall("/appointment/getAllDoctorsAppointment/" + id, "GET").then(
        (res) => {
          if (res) {
            console.log("Schedule", res.data);
            this.appointmentData = res.data;
          }
        }
      );
    },
    getAllLogs() {
      this.axiosCall("/auth/getAllUserLogs/", "GET").then((res) => {
        if (res) {
          this.userLogs = res.data;
        }
      });
    },

    getAllEntryLogs() {
      this.axiosCall("/auth/getAllEntryLogs/", "GET").then((res) => {
        if (res) {
          this.entryLogs = res.data;
        }
      });
    },
    initialize() {
      this.getAllDoctors();
      this.getAllLogs();
      this.getAllEntryLogs();
    },
    getAllDoctors() {
      this.axiosCall("/doctors-schedule/getAllDoctorsDashboard", "GET").then(
        (res) => {
          if (res) {
            // console.log(res.data);
            let data = res.data;
            Object.assign(data, { oldDate: null });
            // this.doctors_schedList1 = res.data;
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

            this.doctors = data;
          }
        }
      );
    },
  },
};
</script>
