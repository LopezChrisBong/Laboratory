<template>
  <Line :chart-data="data" :options="options" />
</template>

<script>
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale);

export default {
  components: { Line },
  data() {
    return {
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
          "Sep",
          "Oct",
        ],
        datasets: [
          {
            label: "Admissions",
            backgroundColor: "rgba(255, 193, 7, 0.3)",
            borderColor: "#FFC107",
            data: [
              0,
              50000,
              120000,
              100000,
              110000,
              95000,
              105000,
              130000,
              150000,
              125000,
            ],
            fill: true,
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
