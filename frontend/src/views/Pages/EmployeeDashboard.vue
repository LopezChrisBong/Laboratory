<template>
  <v-container fluid>
    <v-row>
      <!-- <v-col>
        <h2 class="text-h4 font-weight-bold mb-4">Dashboard</h2>
      </v-col> -->
    </v-row>

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
</template>

<script>
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
    };
  },
  methods: {
    goToNotification(notif) {
      notif.read = true;
      if (notif.route) {
        this.$router.push(notif.route);
      }
    },
  },
};
</script>

<style scoped>
.text-red {
  color: red !important;
}
</style>
