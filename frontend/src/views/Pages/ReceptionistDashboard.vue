<template>
  <v-app>
    <v-container fluid>
      <!-- Top Stats -->
      <v-row>
        <v-col v-for="stat in stats" :key="stat.title" cols="12" md="4">
          <v-card>
            <v-card-text
              class="d-flex flex-column align-center justify-center text-center"
            >
              <v-icon size="40">{{ stat.icon }}</v-icon>
              <h3>{{ stat.value }}</h3>
              <p>{{ stat.title }}</p>
              <!-- <span :class="stat.trend >= 0 ? 'green--text' : 'red--text'">
                {{ stat.trend >= 0 ? "+" : "" }}{{ stat.trend }}%
              </span> -->
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Patients Overview + Calendar -->
      <v-row>
        <!-- Chart -->
        <v-col cols="12" md="8">
          <v-card>
            <v-card-title class="d-flex align-center justify-space-between">
              Patients Overview

              <!-- Year selector -->
              <v-select
                v-model="selectedYear"
                :items="yearOptions"
                label="Select Year"
                dense
                outlined
                style="max-width: 150px"
                @change="getTotalOverview"
              ></v-select>
            </v-card-title>

            <v-card-text>
              <canvas id="patients-chart" height="300"></canvas>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Calendar -->
        <v-col cols="12" md="4">
          <v-card>
            <v-card-title>Calendar</v-card-title>
            <v-card-text>
              <v-date-picker
                v-model="selectedDate"
                :min="minDate"
                color="primary"
                style="height: auto"
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
      selectedYear: new Date().getFullYear(),
      yearOptions: this.generateYears(),
      totalAppointment: [],
      totalLaboratory: [],
      chartInstance: null,
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
      ],
      headers: [
        { text: "Name", value: "name" },
        { text: "Identification No.", value: "patientID" },
        { text: "Contact No.", value: "contact_no" },
        { text: "Age", value: "age" },
      ],
      patients: [],
    };
  },

  mounted() {
    this.getAllPatient();
    this.getTotalPatient();
    this.getTotalOverview();
  },

  methods: {
    addPatient() {
      // Implement patient addition logic
      alert("Add patient clicked");
    },
    chartData() {
      const ctx = document.getElementById("patients-chart").getContext("2d");

      if (this.chartInstance) {
        this.chartInstance.destroy(); // destroy old chart before redrawing
      }

      this.chartInstance = new Chart(ctx, {
        type: "bar",
        data: {
          labels: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sept",
            "Oct",
            "Nov",
            "Dec",
          ],
          datasets: [
            {
              label: "Total Appointment",
              backgroundColor: "#1976d2",
              data: this.totalAppointment,
            },
            {
              label: "Total Lab Request",
              backgroundColor: "#64b5f6",
              data: this.totalLaboratory,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        },
      });
    },
    generateYears() {
      const current = new Date().getFullYear();
      const years = [];
      for (let y = current; y >= current - 5; y--) {
        years.push(y);
      }
      return years;
    },

    getAllPatient() {
      this.loading = true;
      this.axiosCall("/appointment/getAllPatient/" + 1, "GET").then((res) => {
        if (res) {
          this.patients = Array.isArray(res.data) ? res.data : [];
          this.loading = false;
        }
      });
    },
    getTotalPatient() {
      this.axiosCall(
        "/appointment/getAllAppointmentDashboard/DashboardData",
        "GET",
      ).then((res) => {
        if (res) {
          //   console.log("lslsl", res.data);
          this.stats[0].value = res.data.totalPatient.length;
          this.stats[1].value = res.data.totalPatient30Days.length;
          this.stats[2].value = res.data.totalDoctors.length;
          //   this.stats[3].value = res.data.totalPatient.length;
        }
      });
    },

    async getTotalOverview() {
      this.axiosCall(
        "/appointment/getAllOverview/patientOverview/" + this.selectedYear,
        "GET",
      ).then((res) => {
        if (res) {
          this.totalAppointment = res.data.totalAppointment.map(Number);
          this.totalLaboratory = res.data.totalLaboratory.map(Number);
          this.chartData();
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
