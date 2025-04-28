<template>
  <v-container class="pa-6" max-width="800">
    <v-card>
      <v-card-title class="text-h5">Hospital Billing Interface</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="form.patientName"
              label="Patient Name"
              outlined
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="form.patientId"
              label="Patient ID"
              outlined
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="form.service"
              label="Service"
              outlined
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model.number="form.amount"
              label="Amount"
              type="number"
              outlined
            ></v-text-field>
          </v-col>
        </v-row>
        <v-btn @click="addBillingItem" color="primary" class="mt-4"
          >Add Item</v-btn
        >

        <v-divider class="my-6"></v-divider>

        <v-card-subtitle class="text-h6">Billing Items</v-card-subtitle>
        <v-simple-table>
          <thead>
            <tr>
              <th>Service</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in billingItems" :key="index">
              <td>{{ item.service }}</td>
              <td>{{ item.amount }}</td>
              <td>
                <v-btn icon @click="removeBillingItem(index)" color="red">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </td>
            </tr>
          </tbody>
        </v-simple-table>

        <div class="text-right mt-4 text-subtitle-1 font-weight-bold">
          Total: ${{ totalAmount }}
        </div>
      </v-card-text>
    </v-card>
    <v-btn fab color="primary" dark fixed bottom right @click="handleClick">
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      form: {
        patientName: "",
        patientId: "",
        service: "",
        amount: 0,
      },
      billingItems: [],
    };
  },
  computed: {
    totalAmount() {
      return this.billingItems.reduce((total, item) => total + item.amount, 0);
    },
  },
  methods: {
    handleClick() {
      alert("Added successfully");
      // You can open a form, navigate, etc.
    },
    addBillingItem() {
      alert("Added Item");
      // if (this.form.service && this.form.amount > 0) {
      //   this.billingItems.push({
      //     service: this.form.service,
      //     amount: this.form.amount,
      //   });
      //   this.form.service = "";
      //   this.form.amount = 0;
      // }
    },
    removeBillingItem(index) {
      this.billingItems.splice(index, 1);
    },
  },
};
</script>

<style scoped></style>
