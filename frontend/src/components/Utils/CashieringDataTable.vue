<template>
  <v-container class="pa-6" max-width="800">
    <v-card>
      <v-card-title class="text-h5">Cashiering</v-card-title>
      <v-card-text>
        <v-row class="mt-6" dense>
          <v-col cols="12" md="6" class="pa-0">
            <v-tabs v-model="activeTab" color="#2196F3" align-tabs="left">
              <v-tab
                v-for="tab in tabList"
                :key="tab.id"
                @click="changeTab(tab)"
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
                <template v-slot:[`item.created_at`]="{ item }">
                  {{ formatDate(item.created_at) }}
                </template>
                <template v-slot:[`item.service_availed`]="{ item }">
                  <div
                    class="text-caption"
                    v-for="(i, idx) in item.services_availed"
                    :key="idx"
                  >
                    {{ i }}
                  </div>
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
      </v-card-text>
    </v-card>

    <v-dialog v-model="dialogConfirmDone" max-width="800" persistent>
      <v-form ref="billing_form">
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
              style="justify-items: right; align-items: right"
            >
              <v-img
                src="../../assets/img/Paragon Logo.png"
                :style="
                  $vuetify.breakpoint.smAndUp ? 'width: 60%' : 'width:20%'
                "
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
              <tr style="background-color: #003366; color: white">
                <!-- <th class="text-left">QTY</th> -->
                <th class="text-left white--text">Description</th>
                <th class="text-right white--text">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, i) in payPatient.labData" :key="i">
                <!-- <td>1</td> -->
                <td>{{ item.service_description }}</td>
                <td class="text-right">
                  ₱
                  {{ formatNumberValue(item.service_price, 2) }}
                </td>
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
                    <td class="text-right">
                      ₱
                      {{ formatNumberValue(payPatient.total_amount, 2) }}
                    </td>
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
                    <td class="text-right">
                      ₱ -{{ formatNumberValue(discountAmount, 2) }}
                    </td>
                  </tr>
                  <tr>
                    <td>Payment Method</td>
                    <td align="right">
                      <div
                        style="cursor: pointer"
                        v-if="paymentMethod"
                        @click="
                          showPaymentMethodDialog = !showPaymentMethodDialog
                        "
                      >
                        {{ paymentMethod ? paymentMethod : "" }}
                      </div>

                      <v-btn icon v-if="!paymentMethod"
                        ><v-icon
                          color="blue"
                          @click="
                            showPaymentMethodDialog = !showPaymentMethodDialog
                          "
                          >mdi-menu</v-icon
                        >
                      </v-btn>
                    </td>
                  </tr>
                  <tr v-if="paymentMethod && paymentMethod != 'Cash'">
                    <td>Reference Number</td>
                    <td>
                      <v-text-field
                        v-model="reference_number"
                        :rules="
                          paymentMethod != 'Cash' ? [formRules.required] : []
                        "
                        single-line
                        color="#239FAB"
                        class="my-right-aligned-field"
                        dense
                      ></v-text-field>
                    </td>
                  </tr>
                  <tr v-if="paymentMethod">
                    <td>Amount Paid</td>
                    <td class="d-flex align-center">
                      ₱
                      <v-text-field
                        :rules="[formRules.required]"
                        v-model="amount_paid"
                        single-line
                        type="number"
                        color="#239FAB"
                        class="my-right-aligned-field"
                        dense
                      ></v-text-field>
                    </td>
                  </tr>

                  <tr style="font-weight: bold; color: #003366">
                    <td>Total (Php)</td>
                    <td class="text-right">
                      ₱
                      {{ formatNumberValue(totalAmount, 2) }}
                    </td>
                  </tr>
                  <tr style="font-weight: bold; color: #003366">
                    <td>Change (Php)</td>
                    <td class="text-right">₱ {{ getAmountChange }}</td>
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
      </v-form>
    </v-dialog>

    <v-dialog v-model="showPaymentMethodDialog" max-width="800">
      <v-card class="pa-2">
        <v-card-title>Select Payment Method</v-card-title>
        <v-card-text>
          <div class="d-flex justify-space-around">
            <div>
              <img
                @click="
                  paymentMethod = 'Gcash';
                  showPaymentMethodDialog = false;
                "
                class="img_size"
                src="../../assets//img//gcash-logo.png"
                alt="Gcash"
              />
            </div>
            <div>
              <img
                @click="
                  paymentMethod = 'Maya';
                  showPaymentMethodDialog = false;
                "
                class="img_size"
                src="../../assets//img/maya-icon.png"
                alt="Maya"
              />
            </div>
            <div>
              <img
                @click="
                  paymentMethod = 'Cash';
                  showPaymentMethodDialog = false;
                "
                class="img_size"
                src="../../assets//img/cash-icon.png"
                alt="Cash"
              />
            </div>
          </div>
        </v-card-text>
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
  data() {
    return {
      paymentMethod: null,
      showPaymentMethodDialog: false,
      patientHeaders: [
        { text: "Name", value: "name", align: "start" },
        { text: "Service Availed", value: "service_availed", align: "center" },
        { text: "Total Amount", value: "total_amount", align: "center" },
        { text: "Date", value: "created_at", align: "center" },
        { text: "Action", value: "action", align: "end" },
      ],

      patientHeaders2: [
        { text: "Name", value: "name", align: "start" },
        { text: "Invoice #", value: "invoice_no", align: "center" },
        { text: "Service Availed", value: "service_availed", align: "center" },
        { text: "Total Amount", value: "total_amount", align: "center" },
        { text: "Date", value: "created_at", align: "center" },
        { text: "Action", value: "action", align: "end" },
      ],

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
      patients: [],
      dialogConfirmDone: false,
      loading: true,
      invoice_income: [],
      search: "",
      date: null,
      payPatient: [],
      options: null,
      reference_number: null,
      amount_paid: null,
      fadeAwayMessage: {
        show: false,
        type: "success",
        header: "Successfully Added!",
        message: "",
        top: 10,
      },
    };
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
    getAmountChange() {
      let change = 0;
      if (this.amount_paid) {
        console.log(this.discountAmount);
        change = this.amount_paid - this.totalAmount;
      }

      return this.formatNumberValue(change, 2);
    },

    totalAmount() {
      return this.payPatient.total_amount - this.discountAmount;
    },
  },
  mounted() {
    // this.eventHub.$on("closePaymentDialog", () => {
    this.initialize();
    // });
  },
  beforeDestroy() {
    this.eventHub.$off("closePaymentDialog");
  },
  methods: {
    initialize() {
      if (this.tab == 1) {
        this.loading = true;
        this.axiosCall("/payment/findAllPendingPayment/", "GET").then((res) => {
          if (res) {
            console.log("PAT", res.data);
            this.patients = res.data;
            this.loading = false;
          }
        });
      } else {
        this.loading = true;
        this.axiosCall("/payment/fullyPaid/", "GET").then((res) => {
          if (res) {
            console.log("PAT1", res.data);
            this.patients = res.data;
            this.loading = false;
          }
        });
      }
    },

    changeTab(tab) {
      this.activeTab = tab;
      this.tab = tab.id;
      this.initialize();
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
      console.log("PYAMENT", this.paymentMethod);
      if (this.paymentMethod != null) {
        if (this.getAmountChange >= 0) {
          if (this.$refs.billing_form.validate()) {
            let data = {
              patientId: this.updateID,
              discount_amount: this.discountAmount,
              total_amount: this.totalAmount,
              amount: this.payPatient.total_amount,
              discount_type: this.selectedDiscount,
              invoice_no: this.payPatient.invoice_no,
              payedId: JSON.stringify(this.payPatient.paymentIds),
              amount_paid: this.amount_paid,
              paymentMethod: this.paymentMethod,
              change: this.getAmountChange,
              reference_number:
                this.paymentMethod && this.paymentMethod != "Cash"
                  ? this.reference_number
                  : null,
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
                      let notif_data = {
                        patientID: this.id,
                        title: "Patient Appointment",
                        message: "You Have Appoitnment",
                        route: "/patient",
                        assignedID: 12,
                      };
                      this.axiosCall("/notification", "POST", notif_data).then(
                        (res) => {
                          if (res.data.status == 200) {
                            this.fadeAwayMessage.show = true;
                            this.fadeAwayMessage.type = "success";
                            this.fadeAwayMessage.header = "Payment Confirmed";
                            this.fadeAwayMessage.message = res.data.msg;
                            this.initialize();
                            this.dialogConfirmDone = false;
                          }
                        }
                      );
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
          }
        } else {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = "Insufficient amount paid!";
        }
      } else {
        this.fadeAwayMessage.show = true;
        this.fadeAwayMessage.type = "error";
        this.fadeAwayMessage.header = "System Message";
        this.fadeAwayMessage.message = "Please select payment method first!";
      }
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
.img_size {
  height: 100px;
  width: 100px;
  cursor: pointer;
}
.my-right-aligned-field ::v-deep .v-text-field__slot input {
  text-align: right;
  font-size: 14px;
}
</style>
