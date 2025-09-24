<template>
  <v-container fluid>
    <!-- Toolbar -->
    <v-row align="center" justify="space-between" class="mb-4">
      <v-col cols="12" sm="6" class="d-flex align-center">
        <h3 class="mr-3">My Calendar</h3>
        <v-btn-toggle v-model="type" mandatory>
          <v-btn small value="month">Month</v-btn>
          <v-btn small value="week">Week</v-btn>
          <v-btn small value="day">Day</v-btn>
        </v-btn-toggle>
      </v-col>

      <v-col cols="12" sm="6" class="text-right">
        <v-btn icon @click="prev">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <v-btn icon @click="next">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
        <span class="mx-2 font-weight-bold">{{ currentTitle }}</span>
        <!-- <v-btn color="primary" dark small @click="openDialog">
          <v-icon left>mdi-plus</v-icon>
          Add New
        </v-btn> -->
      </v-col>
    </v-row>

    <!-- Calendar -->
    <v-sheet height="700">
      <v-calendar
        ref="calendar"
        v-model="focus"
        :events="events"
        :event-color="getEventColor"
        :type="type"
        color="primary"
      ></v-calendar>
    </v-sheet>

    <!-- Add Event Dialog -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Add Event</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-text-field v-model="newEvent.name" label="Event Name" />
            <v-text-field
              v-model="newEvent.start"
              label="Start (YYYY-MM-DD HH:mm)"
            />
            <v-text-field
              v-model="newEvent.end"
              label="End (YYYY-MM-DD HH:mm)"
            />
            <v-select
              v-model="newEvent.color"
              :items="colors"
              label="Color"
              item-text="name"
              item-value="value"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="dialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="saveEvent">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    type: "month",
    focus: new Date().toISOString().substr(0, 10),
    dialog: false,
    currentMonth: new Date(),
    events: [],
    newEvent: {
      name: "",
      start: "",
      end: "",
      color: "blue",
    },
    colors: [
      { name: "Blue", value: "blue" },
      { name: "Green", value: "green" },
      { name: "Orange", value: "orange" },
      { name: "Red", value: "red" },
      { name: "Purple", value: "purple" },
    ],
  }),
  mounted() {
    this.initialize();
  },
  computed: {
    currentTitle() {
      if (!this.focus) return "";

      const date = new Date(this.focus);

      if (this.type === "month") {
        // Example: "September 2025"
        return date.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        });
      }

      if (this.type === "week") {
        // Show week range (Mon - Sun)
        const start = new Date(date);
        start.setDate(date.getDate() - date.getDay() + 1); // Monday
        const end = new Date(start);
        end.setDate(start.getDate() + 6); // Sunday
        return (
          start.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }) +
          " - " +
          end.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        );
      }

      if (this.type === "day") {
        // Example: "Sep 24, 2025"
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
      }
      return "";
    },
  },

  methods: {
    initialize() {
      this.getAllAppointment();
    },
    getAllAppointment() {
      let userID = this.$store.state.user.id;
      this.axiosCall(
        "/appointment/getAllDoctorsAppointment/" + userID,
        "GET"
      ).then((res) => {
        if (res) {
          console.log("Schedule", res.data);
          this.events = res.data;
        }
      });
    },
    next() {
      this.$refs.calendar.next();
    },
    prev() {
      this.$refs.calendar.prev();
    },
    getEventColor(event) {
      return event.color || "primary";
    },
    openDialog() {
      this.dialog = true;
    },
    saveEvent() {
      if (this.newEvent.name && this.newEvent.start && this.newEvent.end) {
        this.events.push({ ...this.newEvent });
        this.newEvent = { name: "", start: "", end: "", color: "blue" };
        this.dialog = false;
      }
    },
  },
};
</script>

<style scoped>
.v-calendar {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}
</style>
