<template>
  <v-container fluid class="pa-6 dashboard">
    <!-- Appointment Request & Recent Patients -->
    <v-row class="mt-6" dense>
      <v-col cols="12" md="6" class="pa-0">
        <v-tabs v-model="activeTab" color="#2196F3" align-tabs="left">
          <v-tab v-for="tab in tabList" :key="tab.id" @click="changeTab(tab)"
            >{{ tab.name }}
          </v-tab>
        </v-tabs>
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="search"
          outlined
          prepend-inner-icon="search"
          label="Search"
          single-line
          hide-details
          class="rounded-lg"
          color="#239FAB"
          dense
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="12">
        <v-card class="pa-4 rounded-lg elevation-2">
          <!-- <h3 class="font-weight-medium mb-3">Pending Payment</h3> -->
          <v-data-table
            :headers="tab == 1 ? patientHeaders : patientHeaders2"
            :items="patients"
            :options.sync="options"
            dense
            :search="search"
            :loading="loading"
          >
            <template v-slot:[`item.status`]="{ item }">
              <v-chip
                :color="
                  item.status === 'Outpatient'
                    ? 'green lighten-4'
                    : 'red lighten-4'
                "
                text-color="black"
                small
              >
                {{ item.status }}
              </v-chip>
            </template>
            <template v-slot:[`item.action`]="{ item }">
              <v-btn
                small
                color="grey"
                icon
                @click="editItem(item)"
                v-if="tab == 1"
              >
                <v-icon>mdi-account-cash</v-icon>
              </v-btn>
              <v-btn
                small
                color="blue"
                icon
                @click="print(item)"
                v-if="tab == 2"
              >
                <v-icon>mdi-printer-outline</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="dialogConfirmDone" max-width="800">
      <v-card class="pa-6">
        <!-- Header -->
        <v-row>
          <v-col cols="8">
            <div class="text-h6 font-weight-bold">
              PARAGON Diagnostics And Multi-Specialty Clinic
            </div>
            <div>Bluz Building 2, Tadeco Road,</div>
            <div>Brgy. San Francisco, Panabo, Philippines</div>
          </v-col>

          <v-col
            cols="12"
            md="4"
            style="justify-items: right; align-items: right;"
          >
            <v-img
              src="../../assets/img/Paragon Logo.png"
              :style="$vuetify.breakpoint.smAndUp ? 'width: 60%' : 'width:20%'"
            ></v-img>
          </v-col>
        </v-row>

        <v-divider class="my-4"></v-divider>

        <div
          class="text-center text-h5 font-weight-bold mb-6 blue--text text--darken-3"
        >
          MEDICAL INVOICE
        </div>

        <!-- Invoice Info -->
        <v-row>
          <v-col cols="6">
            <div class="font-weight-bold blue--text text--darken-3 mb-1">
              Bill To
            </div>
            <div>{{ payPatient.name }}</div>
          </v-col>

          <v-col cols="6" class="text-right">
            <div><strong>Invoice #:</strong> {{ payPatient.invoice_no }}</div>
            <div><strong>Invoice date:</strong> {{ date }}</div>
          </v-col>
        </v-row>

        <!-- Service Table -->
        <v-simple-table class="mt-6">
          <thead>
            <tr style="background-color:#003366; color:white">
              <!-- <th class="text-left">QTY</th> -->
              <th class="text-left white--text">Description</th>
              <th class="text-right white--text">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, i) in payPatient.labData" :key="i">
              <!-- <td>1</td> -->
              <td>{{ item.service_description }}</td>
              <td class="text-right">{{ item.service_price }}</td>
            </tr>
          </tbody>
        </v-simple-table>

        <!-- Totals -->
        <v-row class="justify-end mt-4">
          <v-col cols="12" sm="6">
            <v-simple-table dense>
              <tbody>
                <tr>
                  <td>Subtotal</td>
                  <td class="text-right">{{ payPatient.total_amount }}</td>
                </tr>
                <tr>
                  <td>Discount</td>
                  <td class="text-right">
                    <v-autocomplete
                      v-model="selectedDiscount"
                      small-chips
                      deletable-chips
                      dense
                      class="rounded-lg"
                      item-text="description"
                      item-value="id"
                      label=""
                      color="#93CB5B"
                      :items="discountList"
                    >
                    </v-autocomplete>
                  </td>
                </tr>
                <tr>
                  <td>Discount Amount</td>
                  <td class="text-right">-{{ discountAmount }}</td>
                </tr>
                <tr style="font-weight:bold; color:#003366">
                  <td>Total (Php)</td>
                  <td class="text-right">{{ totalAmount }}</td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-col>
        </v-row>

        <v-divider class="my-4"></v-divider>

        <!-- Terms -->
        <div class="blue--text text--darken-3 font-weight-bold">
          Terms and Conditions
        </div>
        <div>Please make checks payable to: PARAGON</div>

        <!-- Actions -->
        <v-card-actions class="mt-6">
          <v-spacer></v-spacer>
          <v-btn color="grey" outlined @click="dialogConfirmDone = false"
            >Close</v-btn
          >
          <v-btn color="primary" dark @click="invoice()">Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
export default {
  name: "CashierDashboard",
  data() {
    return {
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
    };
  },
  mounted() {
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
  },
  methods: {
    changeTab(tab) {
      this.activeTab = tab;
      this.tab = tab.id;
      this.initialize();
    },
    initialize() {
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
