<template>
  <v-dialog v-model="dialog" scrollable max-width="1000px">
    <v-card>
      <v-card-title dark class="dialog-header">
        <span>Transaction History - {{ itemName }}</span>
        <v-spacer></v-spacer>
        <v-btn icon dark @click="closeDialog()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text style="max-height: 600px" class="pa-4">
        <v-row class="mb-3">
          <v-col cols="12" md="5">
            <v-text-field
              v-model="search"
              outlined
              dense
              prepend-inner-icon="mdi-magnify"
              label="Search transactions"
              clearable
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="5">
            <v-select
              v-model="filterType"
              :items="transactionTypes"
              label="Filter by type"
              outlined
              dense
              clearable
              hide-details
              @change="filterTransactions"
            ></v-select>
          </v-col>
          <v-col cols="12" md="2">
            <v-btn
              class="white--text ml-2 rounded-lg"
              color="#2196F3"
              @click="report()"
            >
              <v-icon left> mdi-printer </v-icon>
              Report
            </v-btn></v-col
          >
        </v-row>

        <v-data-table
          :headers="headers"
          :items="filteredTransactions"
          :search="search"
          :loading="loading"
          class="elevation-1"
          :items-per-page="10"
        >
          <template v-slot:[`item.transaction_date`]="{ item }">
            {{ formatDate(item.transaction_date) }}
          </template>

          <template v-slot:[`item.transactionType`]="{ item }">
            <v-chip
              :color="item.transactionType === 'Resupply' ? 'green' : 'orange'"
              dark
              small
            >
              {{ item.transactionType }}
            </v-chip>
          </template>

          <template v-slot:[`item.quantity`]="{ item }">
            <span
              :class="
                item.transactionType === 'Resupply'
                  ? 'green--text'
                  : 'orange--text'
              "
            >
              {{ item.transactionType === "Resupply" ? "+" : "-"
              }}{{ item.quantity }}
            </span>
          </template>

          <template v-slot:[`item.stockChange`]="{ item }">
            <span> {{ item.previousStock }} → {{ item.newStock }} </span>
          </template>
        </v-data-table>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="closeDialog()"> Close </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    value: Boolean,
    inventoryItemId: Number,
    itemName: String,
  },
  data() {
    return {
      dialog: false,
      loading: false,
      search: "",
      filterType: null,
      transactions: [],
      filteredTransactions: [],
      headers: [
        { text: "Date", value: "transaction_date", sortable: true },
        { text: "Type", value: "transactionType", sortable: true },
        { text: "Quantity", value: "quantity", sortable: true },
        { text: "Stock Change", value: "stockChange", sortable: false },
        { text: "Supplier", value: "supplier", sortable: true },
        { text: "Lot Number", value: "lotNumber", sortable: true },
        { text: "Brand", value: "brand", sortable: true },
        { text: "Performed By", value: "performedBy", sortable: true },
        { text: "Notes", value: "notes", sortable: false },
      ],
      transactionTypes: ["Resupply", "Consumed"],
    };
  },
  watch: {
    value(val) {
      this.dialog = val;
      if (val && this.inventoryItemId) {
        this.fetchTransactions();
      }
    },
    dialog(val) {
      this.$emit("input", val);
    },
  },
  methods: {
    async fetchTransactions() {
      this.loading = true;
      try {
        const res = await this.axiosCall(
          `/inventory-transaction/item/${this.inventoryItemId}`,
          "GET",
          null,
          true
        );
        this.transactions = res.data || [];
        this.filteredTransactions = this.transactions;
      } catch (error) {
        console.error("Error fetching transactions:", error);
        this.transactions = [];
        this.filteredTransactions = [];
      } finally {
        this.loading = false;
      }
    },
    filterTransactions() {
      if (this.filterType) {
        this.filteredTransactions = this.transactions.filter(
          (t) => t.transactionType === this.filterType
        );
      } else {
        this.filteredTransactions = this.transactions;
      }
    },
    formatDate(date) {
      if (!date) return "";
      return new Date(date).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
    closeDialog() {
      this.dialog = false;
      this.search = "";
      this.filterType = null;
      this.transactions = [];
      this.filteredTransactions = [];
    },
    report() {
      console.log(this.inventoryItemId);
      const url =
        process.env.VUE_APP_SERVER +
        "/pdf-generator/inventoryTransactionPerItem/" +
        this.inventoryItemId;
      window.open(url);
    },
  },
};
</script>

<style scoped>
.dialog-header {
  background-color: #2196f3;
  color: white;
}
</style>
