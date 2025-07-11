<template>
  <Bar :chart-data="data" :options="options" />
</template>

<script>
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Legend, Tooltip);

export default {
  components: { Bar },
  data() {
    return {
      data: {
        labels: ["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"],
        datasets: [
          {
            label: "Out Patients",
            backgroundColor: "#3f51b5",
            data: [40, 50, 60, 55, 60, 70, 65, 75, 68],
          },
          {
            label: "In Patients",
            backgroundColor: "#e53935",
            data: [80, 90, 95, 90, 100, 110, 105, 115, 95],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    };
  },
};
</script>
