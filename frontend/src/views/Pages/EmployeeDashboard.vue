<template>
  <div>
    <div v-if="this.$store.state.user.user.user_roleID == 3">
      <v-container fluid>
        <!-- <v-row>
      <v-col cols="12" md="6">
        <v-tabs v-model="tab" background-color="transparent" grow>
          <v-tab>Appointment ({{ appointment }})</v-tab>
          <v-tab>Messages (0)</v-tab>
          <v-tab>Tasks in Templates (5)</v-tab>
        </v-tabs>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="search"
          outlined
          color="green"
          append-icon="mdi-magnify"
          dense
          hide-details
          label="Search"
          solo
          flat
          class="ml-4"
        />
      </v-col>
    </v-row> -->

        <!-- Calendar Toolbar -->
        <v-toolbar flat>
          <v-btn icon @click="prev">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>

          <v-toolbar-title>{{ monthTitle }}</v-toolbar-title>

          <v-btn icon @click="next">
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>

          <v-spacer></v-spacer>

          <v-btn outlined @click="today">Today</v-btn>
        </v-toolbar>

        <!-- Calendar View -->
        <v-sheet height="650">
          <v-calendar
            ref="calendar"
            v-model="focus"
            color="primary"
            type="month"
            :events="events"
            event-color="getEventColor"
            @click:event="showEventDetails"
          >
            <template v-slot:event="{ event }">
              <!-- <div class="event-chip-wrapper">
                <v-chip small :color="event.color" dark>
                  {{ event.name }}
                </v-chip>
              </div> -->
              <div
                style="height: 60px; overflow-y: auto; border: 1px solid red; position: relative;"
              >
                <div v-for="i in event" :key="i">
                  {{ event.name }}
                </div>
              </div>
            </template>
          </v-calendar>
        </v-sheet>

        <!-- Dialog -->
        <v-dialog v-model="dialog" max-width="500px">
          <v-card>
            <v-card-title class="headline">{{
              selectedEvent.name
            }}</v-card-title>
            <v-card-text>
              <p><strong>Date:</strong> {{ selectedEvent.start }}</p>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text @click="dialog = false">Close</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </div>
    <div v-else-if="this.$store.state.user.user.user_roleID == 2">
      <v-container fluid>
        <v-row>
          <v-col cols="12" md="4">
            <v-card class="pa-4" color="blue lighten-4">
              <v-icon large>mdi-calendar-check</v-icon>
              <div class="text-h6 mt-2">Appointments</div>
              <div class="text-subtitle-1">{{ appointments.length }}</div>
            </v-card>
          </v-col>

          <v-col cols="12" md="4">
            <v-card class="pa-4" color="red lighten-4">
              <v-icon large>mdi-basket-off</v-icon>
              <div class="text-h6 mt-2">Low Stock Items</div>
              <div class="text-subtitle-1">{{ lowStocks.length }}</div>
            </v-card>
          </v-col>

          <v-col cols="12" md="4">
            <v-card class="pa-4" color="green lighten-4">
              <v-icon large>mdi-account-multiple</v-icon>
              <div class="text-h6 mt-2">Recent Patients</div>
              <div class="text-subtitle-1">{{ recentPatients.length }}</div>
            </v-card>
          </v-col>
        </v-row>
        <v-row class="mt-6">
          <v-col cols="12">
            <h3 class="text-h5 font-weight-medium mb-2">Quick Shortcuts</h3>
            <v-row>
              <v-col
                cols="6"
                md="3"
                v-for="action in shortcuts"
                :key="action.title"
              >
                <v-btn
                  :to="action.route"
                  color="primary"
                  block
                  class="pa-6"
                  rounded
                  elevation="2"
                >
                  <v-icon large class="mb-2">{{ action.icon }}</v-icon>
                  {{ action.title }}
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row class="mt-6">
          <v-col cols="12">
            <h3 class="text-h5 font-weight-medium mb-2">
              Reminders & Notifications
            </h3>
            <v-list two-line>
              <v-list-item
                v-for="(notif, i) in notifications"
                :key="i"
                :color="notif.read ? '' : 'red lighten-5'"
                @click="goToNotification(notif)"
              >
                <v-list-item-content>
                  <v-list-item-title :class="{ 'text-red': !notif.read }">
                    {{ notif.title }}
                  </v-list-item-title>
                  <v-list-item-subtitle>{{ notif.date }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script>
import moment from "moment"; // or use native Date

export default {
  data() {
    return {
      appointments: [
        { id: 1, patient: "John Doe", time: "9:00 AM" },
        { id: 2, patient: "Jane Smith", time: "10:30 AM" },
      ],
      lowStocks: [
        { name: "Gloves", quantity: 3 },
        { name: "Syringes", quantity: 2 },
      ],
      recentPatients: [
        { name: "Emily", date: "2025-04-18" },
        { name: "Mark", date: "2025-04-17" },
      ],
      shortcuts: [
        {
          title: "New Appointment",
          icon: "mdi-calendar-plus",
          route: "/appointments/new",
        },
        {
          title: "Patient Records",
          icon: "mdi-folder-account",
          route: "/patients",
        },
        { title: "Inventory", icon: "mdi-warehouse", route: "/inventory" },
        { title: "Reports", icon: "mdi-chart-bar", route: "/reports" },
      ],
      notifications: [
        {
          title: "Reminder: Appointment at 10AM",
          date: "Today",
          read: false,
          route: "/appointments",
        },
        {
          title: "Stock alert: Syringes",
          date: "Yesterday",
          read: true,
          route: "/inventory",
        },
      ],
      selectedView: "All Email Calendar",
      tab: 0,
      search: "",
      appointment: null,

      years: Array.from({ length: 10 }, (_, i) => 2020 + i),
      focus: moment().format("YYYY-MM-DD"),
      dialog: false,
      selectedEvent: {},
      events: [
        {
          name: "A Teraphy for patient Jhon Doe",
          start: "2025-05-16",
          color: "purple",
        },
        {
          name: "b Teraphy for patient Jhon Doe",
          start: "2025-05-16",
          color: "purple",
        },
        {
          name: "c Teraphy for patient Jhon Doe",
          start: "2025-05-16",
          color: "purple",
        },
        {
          name: "d Teraphy for patient Jhon Doe",
          start: "2025-05-16",
          color: "purple",
        },
        {
          name: "Laboratory for patient Jhon Doe",
          start: "2025-05-25",
          color: "green",
        },
        {
          name: "X-ray for patient Jhon Doe",
          start: "2025-05-27",
          color: "orange",
        },
        {
          name: "CBC for patient Jhon Doe",
          start: "2025-05-29",
          color: "lime",
        },
      ],
    };
  },
  mounted() {
    this.appointment = this.events.length;
    // alert(this.$store.state.user.user.assignedModuleID);
  },
  computed: {
    monthTitle() {
      return moment(this.focus).format("MMMM YYYY");
    },
  },
  methods: {
    goToNotification(notif) {
      notif.read = true;
      if (notif.route) {
        this.$router.push(notif.route);
      }
    },
    getEventColor(event) {
      return event.color || "blue";
    },
    showEventDetails({ event }) {
      this.selectedEvent = event;
      this.dialog = true;
    },
    prev() {
      this.focus = moment(this.focus)
        .subtract(1, "month")
        .format("YYYY-MM-DD");
    },
    next() {
      this.focus = moment(this.focus)
        .add(1, "month")
        .format("YYYY-MM-DD");
    },
    today() {
      this.focus = moment().format("YYYY-MM-DD");
    },
  },
};
</script>
<style scoped>
.text-red {
  color: red !important;
}
.event-chip-wrapper {
  max-height: 60px; /* limit height of each day's event container */
  overflow-y: auto;
  position: relative;
  margin: 2px 0;
}
</style>
<!-- style="position: fixed; height: 50px; overflow-y: auto;" -->
