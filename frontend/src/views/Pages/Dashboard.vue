<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="4">
        <v-card class="pa-4" color="blue lighten-4">
          <v-card-title>Total Tests</v-card-title>
          <v-card-text><h2>120</h2></v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card class="pa-4" color="green lighten-4">
          <v-card-title>Patients</v-card-title>
          <v-card-text><h2>87</h2></v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card class="pa-4" color="red lighten-4">
          <v-card-title>Pending Results</v-card-title>
          <v-card-text><h2>33</h2></v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <v-card class="pa-4">
          <v-card-title>Monthly Test Volume</v-card-title>
          <line-chart />
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="pa-4">
          <v-card-title>Test Type Distribution</v-card-title>
          <doughnut-chart />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import LineChart from "../../components/Charts/LineChart.vue";
import DoughnutChart from "../../components/Charts/PieChart.vue";
export default {
  components: {
    LineChart,
    DoughnutChart,
  },
  data: () => ({
    mini: false,
    upcoming_bdays: [],
    hasUpcomingBday: false,
    head_data: {},
    dispatchWorks: null,
    cancelledWorks: null,
    completedWorks: null,
    maleCnt: 0,
    femaleCnt: 0,
    maleFemale: {},
    datas: {},
    TeachingNonTeaching: {},
    label: [],
    top_clients: [],
    enrollData: null,
    verifyData: null,
    today: null,
    activeCalendar: null,
    tracked: {},
    teaching: null,
    nonTeaching: null,
    isCalendarFocus: false,
    bdays: [],
    colors: ["#1867c0", "#fb8c00", "#000000"],
    category: ["Development", "Meetings", "Slacking"],
    data: [30, 12, 58, 44, 12, 46, 89, 67],
    categories: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    title: "Test chart",
    sideText: "Some data",
    color: ["#2D9CDB"],
  }),
  computed: {
    // convert the list of events into a map of lists keyed by date
    eventsMap() {
      const map = {};
      this.events.forEach((e) => (map[e.date] = map[e.date] || []).push(e));
      return map;
    },
  },
  methods: {
    initialize() {
      this.getTeachingNonTeachingCount();
      this.getMaleFemaleCount();
    },

    getDayOnDate() {
      if (this.selectedDay) {
        let d = this.selectedDay.substr(8, 2);
        return parseInt(d);
      }
    },

    getBday(event, date) {
      this.isCalendarFocus = true;
      this.selectedDay = date;
      this.bdays = event;
      console.log(event, date);
    },

    open(event) {
      alert(event.title);
    },

    getMaleFemaleCount() {
      this.axiosCall("/user-details/getMaleFemaleCount", "GET").then(
        (res) => {
          console.log(res.data.female);
          if (res.data) {
            this.maleCnt = res.data.male;
            this.femaleCnt = res.data.female;
            this.maleFemale = {
              label: ["Male", "Female"],
              data: [res.data.male, res.data.female],
            };
          }
        },
        (error) => {
          console.log(error);
        }
      );
    },

    getTeachingNonTeachingCount() {
      this.axiosCall("/user-details/getTeachingNon", "GET").then(
        (res) => {
          if (res.data) {
            this.nonTeaching = res.data.nonTeaching;
            this.teaching = res.data.teaching;
            this.TeachingNonTeaching = {
              label: ["Non-Teaching", "Teaching"],
              data: [res.data.nonTeaching, res.data.teaching],
            };
          }
        },
        (error) => {
          console.log(error);
        }
      );
    },
  },
  created() {
    if (this.$store.state.expiryDate < Date.now()) {
      this.$store.dispatch("setUser", null);
      this.$store.dispatch("setIsAuthenticated", 0);
      this.render = true;
      this.$router.push("/");
      // location.reload();
    }
  },

  mounted() {
    this.initialize();
  },
};
</script>
