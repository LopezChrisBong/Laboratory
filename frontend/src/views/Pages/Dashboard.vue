<template>
  <v-app>
    <v-container fluid>
      <!-- Top Stats -->
      <v-row>
        <v-col v-for="stat in stats" :key="stat.title" cols="12" md="3">
          <v-card>
            <v-card-text
              class="d-flex flex-column align-center justify-center text-center"
            >
              <v-icon size="40">{{ stat.icon }}</v-icon>
              <h3>{{ stat.value }}</h3>
              <p>{{ stat.title }}</p>
              <span :class="stat.trend >= 0 ? 'green--text' : 'red--text'">
                {{ stat.trend >= 0 ? "+" : "" }}{{ stat.trend }}%
              </span>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Patients Overview + Calendar -->
      <v-row>
        <v-col cols="12" md="8">
          <v-card>
            <v-card-title>Patients overview</v-card-title>
            <v-card-text>
              <canvas id="patients-chart" height="300"></canvas>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card>
            <v-card-title>Calendar</v-card-title>
            <v-card-text>
              <v-date-picker
                v-model="selectedDate"
                :min="minDate"
                color="primary"
              ></v-date-picker>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Patients Table -->
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title>
              <span>Patients</span>
              <v-spacer></v-spacer>
              <!-- <v-btn color="primary" @click="addPatient">Add patient</v-btn> -->
            </v-card-title>
            <v-data-table
              :headers="headers"
              :items="patients"
              :loading="loading"
              class="elevation-1"
            >
              <template v-slot:[`item.status`]="{ item }">
                <v-chip
                  :color="
                    item.status == 0
                      ? 'orange'
                      : item.status == 1
                      ? 'blue'
                      : 'green'
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
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
// import LineChartVue from "../../components/Charts/LineChart.vue";
import Chart from "chart.js";
// import Chart from "vue-chartjs";
export default {
  // components: {
  //   LineChartVue,
  // },
  data() {
    return {
      selectedDate: new Date().toISOString().substr(0, 10),
      minDate: "2023-01-01",
      loading: false,
      stats: [
        {
          title: "Total patients",
          value: "123K",
          trend: 23.5,
          icon: "mdi-account-group",
        },
        {
          title: "Last 30 days patients",
          value: "2.53K",
          trend: 4.5,
          icon: "mdi-account-clock",
        },
        {
          title: "Total doctors",
          value: "88",
          trend: -3.5,
          icon: "mdi-doctor",
        },
        {
          title: "Last month cost",
          value: "$22.5K",
          trend: 0.8,
          icon: "mdi-currency-usd",
        },
      ],
      headers: [
        { text: "Name", value: "name" },
        { text: "Identification No.", value: "patientID" },
        // { text: "Last Visit", value: "lastVisit" },
        { text: "Status", value: "status" },
        // { text: "Next Visit", value: "nextVisit" },
        // { text: "Recent Topic", value: "recentTopic" },
        // { text: "Recent Doctor", value: "recentDoctor" },
      ],
      patients: [
        // {
        //   name: "Courtney Henry",
        //   id: "21789057",
        //   lastVisit: "Jan 20, 2020",
        //   status: "Active",
        //   nextVisit: "Jan 24, 2020",
        //   recentTopic: "Radiology",
        //   recentDoctor: "Dr M. Wagner",
        // },
        // {
        //   name: "Leslie Alexander",
        //   id: "37890606",
        //   lastVisit: "Jan 20, 2020",
        //   status: "Active",
        //   nextVisit: "Feb 1, 2020",
        //   recentTopic: "Pediatrics",
        //   recentDoctor: "Dr R. Green",
        // },
      ],
    };
  },

  mounted() {
    this.chartData();
    this.getAllPatient();
  },

  methods: {
    addPatient() {
      // Implement patient addition logic
      alert("Add patient clicked");
    },
    chartData() {
      const ctx = document.getElementById("patients-chart").getContext("2d");
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
          datasets: [
            {
              label: "Medical patients",
              backgroundColor: "#1976d2",
              data: [1000, 1700, 2500, 3200, 3000, 2200, 1500, 2300],
            },
            {
              label: "Appointed patients",
              backgroundColor: "#64b5f6",
              data: [600, 1100, 1900, 2300, 1780, 1900, 1200, 1900],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          legend: {
            position: "top",
          },
          tooltips: {
            mode: "index",
            intersect: false,
          },
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                  max: 4000,
                },
              },
            ],
          },
        },
      });
    },
    getAllPatient() {
      this.loading = true;
      this.axiosCall("/appointment/getAllPatient/" + 1, "GET").then((res) => {
        if (res) {
          this.patients = res.data;
          this.loading = false;
        }
      });
    },
  },
};
</script>

<style>
.green--text {
  color: green;
}
.red--text {
  color: red;
}
</style>
