<script>
import { Pie } from "vue-chartjs";

export default {
  extends: Pie,

  data: () => ({
    datas: [],
    label: [],
  }),
  watch: {
    data: {
      handler() {
        this.renderCharts();
      },
      deep: true,
    },
  },
  mounted() {
    this.graphChart();
  },
  methods: {
    graphChart() {
      console.log("PIEDATA");
      this.renderChart(
        {
          labels: ["2025", "2026", "2027", "2028", "2029"],
          datasets: [
            {
              backgroundColor: [
                "#ff33e9",
                "orange",
                "#99ff33",
                "#33afff",
                "yellow",
              ],
              colors: ["white", "white", "white", "white", "white"],
              data: [12, 21, 23, 12, 12],
            },
          ],
        },

        {
          tooltips: {
            enabled: false,
          },
          responsive: true,
          maintainAspectRatio: false,
          legend: {
            display: true,
            // position: "right",
            // align: "center",
          },
          // pieceLabel: {
          //   render: "label",
          //   arc: true,
          //   fontColor: "#000",
          //   position: "inside",
          // },
          chartOptions: {
            responsive: true,
            animation: {
              duration: 800,
              easing: "easeOutQuart",
            },
          },
          scales: {
            y: {
              beginAtZero: true,
            },
          },
          plugins: {
            datalabels: {
              color: "gray", //['white', "red"]
              font: {
                weight: "bold",
                size: 14,
              },
              anchor: "end",
              align: "start",
            },
          },
        }
      );
    },
  },
};
</script>
