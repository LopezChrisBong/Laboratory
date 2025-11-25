<template>
  <v-container fluid class="pa-6 dashboard">
    <!--Invoice-->
    <v-row>
      <v-col cols="12" md="4">
        <v-card>
          <v-card-text
            class="d-flex flex-column align-center justify-center text-center"
            ><div class="d-flex align-center justify-center">
              <v-icon size="40">mdi-currency-php</v-icon>
              <h1>{{ computeDaily }}</h1>
            </div>
            <div class="d-flex align-center">
              <div>Total Income of the Day</div>
              <div class="mt-2 mx-2">
                <v-menu
                  v-model="menuDate"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template #activator="{ on, attrs }">
                    <v-text-field
                      dense
                      v-model="selectedDate"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>

                  <v-date-picker
                    v-model="selectedDate"
                    @input="getDailyIncome()"
                    color="primary"
                  ></v-date-picker>
                </v-menu>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card>
          <v-card-text class="d-flex flex-column align-center justify-center">
            <div class="d-flex align-center justify-center">
              <v-icon size="40">mdi-currency-php</v-icon>
              <h1>{{ computeMonthly }}</h1>
            </div>
            <div class="d-flex align-center">
              <div class="d-flex justify-start">
                Total Income of this Month:
              </div>
              <div class="d-flex">
                <v-autocomplete
                  v-model="selectedMonth"
                  dense
                  @change="getMonthIncome()"
                  class="rounded-lg"
                  color="#93CB5B"
                  :items="monthArr"
                >
                </v-autocomplete>
                <v-autocomplete
                  v-model="selectedYear"
                  @change="getMonthIncome()"
                  dense
                  class="rounded-lg"
                  color="#93CB5B"
                  :items="yrArr"
                >
                </v-autocomplete>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card>
          <v-card-text class="d-flex flex-column align-center justify-center">
            <div class="d-flex align-center justify-center">
              <v-icon size="40">mdi-currency-php</v-icon>
              <h1>{{ computeYearly }}</h1>
            </div>

            <div class="d-flex align-center">
              <div class="d-flex justify-start">Total Income of Year:</div>
              <div class="d-flex mt-2 mx-2">
                <v-autocomplete
                  v-model="selectedYear1"
                  @change="getYearlyIncome()"
                  dense
                  class="rounded-lg"
                  color="#93CB5B"
                  :items="yrArr"
                >
                </v-autocomplete>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6">
        <canvas id="monthlyChart"></canvas>
      </v-col>
      <v-col cols="6">
        <canvas id="yearlyChart"></canvas>
      </v-col>
    </v-row>

    <fade-away-message-component
      displayType="variation2"
      v-model="fadeAwayMessage.show"
      :message="fadeAwayMessage.message"
      :header="fadeAwayMessage.header"
      :top="fadeAwayMessage.top"
      :type="fadeAwayMessage.type"
    ></fade-away-message-component>
  </v-container>
</template>

<script>
import Chart from "chart.js";
export default {
  name: "CashierDashboard",
  data() {
    return {
      dialog: false,
      tabIncome: 0,
      dailyData: [],
      monthlyData: [],
      yearlyData: [],
      dailyChart: null,
      monthlyChart: null,
      menuDate: false,
      selectedDate: new Date().toISOString().substr(0, 10),
      dailyTotal: 0,
      dailyTransactions: 0,
      peakHour: null,
      peakHourAmount: 0,
      yearlyChart: null,
      patientHeaders: [
        { text: "Name", value: "name", align: "start" },
        { text: "Total Amount", value: "total_amount", align: "center" },
        { text: "Total Payments", value: "total_payments", align: "center" },
        { text: "Action", value: "action", align: "end" },
      ],

      patientHeaders2: [
        { text: "Name", value: "name", align: "start" },
        { text: "Invoice #", value: "invoice_no", align: "center" },
        { text: "Total Amount", value: "total_amount", align: "center" },
        { text: "Action", value: "action", align: "end" },
      ],
      patients: [],
      dialogConfirmDone: false,
      loading: true,
      invoice_income: [],
      search: "",
      date: null,
      payPatient: [],
      fadeAwayMessage: {
        show: false,
        type: "success",
        header: "Successfully Added!",
        message: "",
        top: 10,
      },
      currentMonthIndex: null,
      currentYear: null,

      selectedDiscount: null,
      discountList: [
        { id: 1, description: "Senior Citizen", percentage: 20 },
        { id: 2, description: "PWD", percentage: 20 },
        { id: 3, description: "Employee", percentage: 50 },
      ],
      activeTab: { id: 1, name: "Pending" },
      tab: 1,
      tabList: [
        { id: 1, name: "Pending" },
        { id: 2, name: "Fully Paid" },
      ],
      monthArr: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      yrArr: [],
      selectedMonth: null,
      monthIncome: [],
      selectedYear: null,
      yearIncome: [],
      selectedYear1: null,
    };
  },
  mounted() {
    let d = new Date();
    for (let i = d.getFullYear(); i >= 2024; i--) {
      this.yrArr.push(i);
    }
    this.selectedYear = d.getFullYear();
    this.selectedYear1 = d.getFullYear();
    this.selectedMonth = this.monthArr[d.getMonth()];
    this.getMonthIncome();
    this.getYearlyIncome();
    this.fetchIncomeData();
    this.initialize();
  },
  computed: {
    discountAmount() {
      if (!this.selectedDiscount) return 0;

      const discount = this.discountList.find(
        (d) => d.id === this.selectedDiscount
      );

      if (!discount) return 0;

      return (this.payPatient.total_amount * discount.percentage) / 100;
    },
    totalAmount() {
      return this.payPatient.total_amount - this.discountAmount;
    },

    computeDaily() {
      let amount = 0;
      if (this.dailyData.length > 0) {
        for (let i = 0; i < this.dailyData.length; i++) {
          amount += this.dailyData[i].amount;
        }
      }
      return this.formatNumberValue(amount, 2);
    },
    computeMonthly() {
      let amount = 0;
      if (this.monthIncome.length > 0) {
        for (let i = 0; i < this.monthIncome.length; i++) {
          amount += this.monthIncome[i].amount;
        }
      }

      return this.formatNumberValue(amount, 2);
    },
    computeYearly() {
      let amount = 0;
      if (this.yearIncome.length > 0) {
        for (let i = 0; i < this.yearIncome.length; i++) {
          amount += this.yearIncome[i].amount;
        }
      }

      return this.formatNumberValue(amount, 2);
    },
  },
  methods: {
    updateDailyDate() {
      this.menuDate = false;
      this.fetchIncomeData(); // refetch data for selected day
      this.$nextTick(() => {
        this.renderDailyChart();
      });
    },
    changeTab(tab) {
      this.activeTab = tab;
      this.tab = tab.id;
      this.initialize();
    },
    changeIncome() {
      this.$nextTick(() => {
        setTimeout(() => {
          this.fetchIncomeData();

          if (this.tabIncome === 0) {
            this.renderDailyChart();
          } else if (this.tabIncome === 1) {
            this.renderMonthlyChart();
          } else if (this.tabIncome === 2) {
            this.renderYearlyChart();
          }
        }, 150);
      });
    },
    openIncome() {
      this.dialog = true;
      this.$nextTick(() => {
        setTimeout(() => {
          this.loadCharts();
        }, 200);
      });
    },
    async loadCharts() {
      await this.fetchIncomeData();
      this.renderDailyChart();
      this.renderMonthlyChart();
      this.renderYearlyChart();
    },

    getDailyIncome() {
      const params = {
        date: this.selectedDate, // send selected date to backend
      };

      this.axiosCall("/payment/getDailyIncome", "GET", params).then((res) => {
        if (res) {
          console.log("daily", res.data);
          this.dailyData = res.data;
        }
      });
    },

    getMonthIncome() {
      const params = {
        month: this.selectedMonth,
        year: this.selectedYear,
      };

      this.axiosCall("/payment/getMonthlyIncome", "GET", params).then((res) => {
        if (res) {
          console.log("month", res.data);
          this.monthIncome = res.data;
        }
      });
    },

    getYearlyIncome() {
      const params = {
        year: this.selectedYear1,
      };

      this.axiosCall("/payment/getYearlyIncome", "GET", params).then((res) => {
        if (res) {
          console.log("month", res.data);
          this.yearIncome = res.data;
        }
      });
    },

    async fetchIncomeData() {
      const params = {
        date: this.selectedDate, // send selected date to backend
      };

      this.axiosCall("/payment/getAnalyticsIncome", "GET", params).then(
        (res) => {
          if (res) {
            console.log("daily", res.data);
            // this.monthlyData = res.data.monthlyData;
            // this.yearlyData = res.data.yearlyData;
            this.renderMonthlyChart(res.data.monthlyData);
            this.renderYearlyChart(res.data.yearlyData);
          }
        }
      );
    },
    renderDailyChart() {
      const ctx = document.getElementById("dailyChart");
      if (this.dailyChart) this.dailyChart.destroy();

      this.dailyChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: this.dailyData.map((item) => item.day),
          datasets: [
            {
              label: "Daily Income",
              data: this.dailyData.map((item) => item.amount),
              fill: false,
              borderColor: "blue",
              tension: 0.3,
            },
          ],
        },
      });
    },

    renderMonthlyChart(mnthData) {
      const ctx = document.getElementById("monthlyChart");
      if (this.monthlyChart) this.monthlyChart.destroy();

      // ✅ Create array of 12 months initialized to 0
      const monthlyArray = new Array(12).fill(0);

      // ✅ Fill the array with your data
      // this.monthlyData.forEach((item) => {
      //   monthlyArray[item.month] = item.amount;
      // });
      mnthData.forEach((item) => {
        monthlyArray[item.month] = item.amount;
      });

      this.monthlyChart = new Chart(ctx, {
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
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
          datasets: [
            {
              label: "Monthly Income",
              data: monthlyArray, // ✅ Correct data format
              backgroundColor: "orange",
            },
          ],
        },
      });
    },

    renderYearlyChart(yrData) {
      console.log("YT", yrData);
      const ctx = document.getElementById("yearlyChart");
      if (this.yearlyChart) this.yearlyChart.destroy();

      // this.yearlyData = this.yearlyData.map((item) => ({
      //   year: Number(item.year ?? item.YEAR),
      //   amount: Number(item.amount ?? item.AMOUNT),
      // }));
      yrData = yrData.map((item) => ({
        year: Number(item.year ?? item.YEAR),
        amount: Number(item.amount ?? item.AMOUNT),
      }));

      // const years = this.yearlyData.map((i) => Number(i.year));
      const years = yrData.map((i) => Number(i.year));

      const currentYear = Math.max(...years);

      const yearRange = [
        currentYear - 4,
        currentYear - 3,
        currentYear - 2,
        currentYear - 1,
        currentYear,
      ];

      // const yearlyArray = yearRange.map((y) => {
      //   const match = this.yearlyData.find((item) => Number(item.year) === y);
      //   return match ? Number(match.amount) : 0;
      // });

      const yearlyArray = yearRange.map((y) => {
        const match = yrData.find((item) => Number(item.year) === y);
        return match ? Number(match.amount) : 0;
      });

      this.yearlyChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: ["Year -4", "Year -3", "Year -2", "Last Year", "This Year"],
          datasets: [
            {
              label: "Yearly Income",
              data: yearlyArray,
              borderColor: "green",
              fill: false,
            },
          ],
        },
      });
    },
    getIncomeInvoice() {
      const currentDate = new Date();
      this.currentYear = currentDate.getFullYear();
      const currentMonthIndex = currentDate.getMonth();
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      this.currentMonthIndex = monthNames[currentMonthIndex];
      this.axiosCall("/payment/getIncomeInvoice/", "GET").then((res) => {
        if (res) {
          this.invoice_income = res.data;
        }
      });
    },

    initialize() {
      this.getIncomeInvoice();
      if (this.tab == 1) {
        this.loading = true;
        this.axiosCall("/payment/findAllPendingPayment/", "GET").then((res) => {
          if (res) {
            this.patients = res.data;
            this.loading = false;
          }
        });
      } else {
        this.loading = true;
        this.axiosCall("/payment/fullyPaid/", "GET").then((res) => {
          if (res) {
            this.patients = res.data;
            this.loading = false;
          }
        });
      }
    },
    editItem(item) {
      console.log(item);
      this.updateID = item.patientId;
      this.axiosCall(
        "/payment/findOnePatientPayment/" + item.patientId,
        "GET"
      ).then((res) => {
        if (res) {
          this.payPatient = res.data[0];
          this.loading = false;
          this.dialogConfirmDone = true;
          this.date = new Date().toLocaleDateString();
        }
      });
    },
    invoice() {
      let data = {
        patientId: this.updateID,
        discount_amount: this.discountAmount,
        total_amount: this.totalAmount,
        amount: this.payPatient.total_amount,
        discount_type: this.selectedDiscount,
        invoice_no: this.payPatient.invoice_no,
        payedId: JSON.stringify(this.payPatient.paymentIds),
      };
      this.axiosCall("/payment/invoice", "POST", data).then((res) => {
        setTimeout(() => {
          this.print(res.data.saveData);
        }, 1100);
        if (res.data.status == 200) {
          let newData = {
            status: 1,
          };
          for (let i = 0; i < this.payPatient.paymentIds.length; i++) {
            console.log(this.payPatient.paymentIds[i]);
            this.axiosCall(
              "/payment/" + this.payPatient.paymentIds[i],
              "PATCH",
              newData
            ).then((res) => {
              if (res.data.status == 200) {
                this.fadeAwayMessage.show = true;
                this.fadeAwayMessage.type = "success";
                this.fadeAwayMessage.header = "Payment Confirmed";
                this.fadeAwayMessage.message = res.data.msg;
                this.initialize();
                this.dialogConfirmDone = false;
              } else if (res.data.status == 400) {
                this.fadeAwayMessage.show = true;
                this.fadeAwayMessage.type = "error";
                this.fadeAwayMessage.header = "System Message";
                this.fadeAwayMessage.message = res.data.msg;
              }
            });
          }
        } else if (res.data.status == 400) {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = res.data.msg;
        }
      });
    },
    print(item) {
      console.log(item);
      const url =
        process.env.VUE_APP_SERVER + "/pdf-generator/invoice/" + item.id;
      window.open(url);
    },
  },
};
</script>

<style scoped>
.dashboard {
  background-color: #fafafa;
}
.best-doctor {
  color: white;
  border-radius: 12px;
}
.v-card {
  border-radius: 12px !important;
}
</style>
