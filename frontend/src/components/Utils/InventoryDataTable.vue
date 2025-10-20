<template>
  <v-container fluid>
    <v-row class="my-4" align="center">
      <v-col cols="12" md="6" class="pa-3">
        <v-text-field
          v-model="search"
          outlined
          prepend-inner-icon="search"
          label="Search by Item Name"
          single-line
          hide-details
          class="rounded-lg px-2"
          color="#239FAB"
          dense
          @input="searchInventory"
        ></v-text-field>
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
    <v-card class="ma-5 dt-container" elevation="0" outlined>
      <v-data-table
        :headers="headers"
        :items="itemData"
        :items-per-page="10"
        :search="search"
        :options.sync="options"
        :loading="loading"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Inventory Items</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-select
              v-model="selectedTransactionType"
              :items="transactionTypes"
              label="Select Transaction Type"
              dense
              outlined
              hide-details
              class="shrink mr-2"
            ></v-select>
            <v-btn color="primary" dark class="mb-2" @click="addNewItem">
              New Item
            </v-btn>
          </v-toolbar>
        </template>
        <template v-slot:item="{ item }">
          <tr>
            <td>
              <v-edit-dialog
                :return-value.sync="item.itemName"
                @save="saveInlineItem(item)"
                large
                persistent
              >
                <div>{{ item.itemName }}</div>
                <template v-slot:input>
                  <v-text-field
                    v-model="item.itemName"
                    label="Edit Item Name"
                    single-line
                    counter
                    autofocus
                    :rules="[formRules.required]"
                  ></v-text-field>
                </template>
              </v-edit-dialog>
            </td>
            <td>
              <v-edit-dialog
                :return-value.sync="item.brand"
                @save="saveInlineItem(item)"
                large
                persistent
              >
                <div>{{ item.brand }}</div>
                <template v-slot:input>
                  <v-select
                    v-model="item.brand"
                    :items="brands"
                    label="Edit Brand"
                    single-line
                    :rules="[formRules.required]"
                  ></v-select>
                </template>
              </v-edit-dialog>
            </td>
            <td>
              <v-edit-dialog
                :return-value.sync="item.unit"
                @save="saveInlineItem(item)"
                large
                persistent
              >
                <div>{{ item.unit }}</div>
                <template v-slot:input>
                  <v-select
                    v-model="item.unit"
                    :items="units"
                    label="Edit Unit"
                    single-line
                    :rules="[formRules.required]"
                  ></v-select>
                </template>
              </v-edit-dialog>
            </td>
            <td>
              <v-edit-dialog
                :return-value.sync="item.usageType"
                @save="saveInlineItem(item)"
                large
                persistent
              >
                <div>{{ item.usageType }}</div>
                <template v-slot:input>
                  <v-text-field
                    v-model="item.usageType"
                    label="Edit Kind of Usage"
                    single-line
                    counter
                    :rules="[formRules.required]"
                  ></v-text-field>
                </template>
              </v-edit-dialog>
            </td>
            <td>
              <v-edit-dialog
                :return-value.sync="item.lotNumber"
                @save="saveInlineItem(item)"
                large
                persistent
              >
                <div>{{ item.lotNumber }}</div>
                <template v-slot:input>
                  <v-text-field
                    v-model="item.lotNumber"
                    label="Edit Lot Number"
                    single-line
                    counter
                    :rules="[formRules.required]"
                  ></v-text-field>
                </template>
              </v-edit-dialog>
            </td>
            <td>
              <v-edit-dialog
                :return-value.sync="item.expiry"
                @save="saveInlineItem(item)"
                large
                persistent
              >
                <div>{{ item.expiry ? item.expiry.substring(0, 10) : "" }}</div>
                <template v-slot:input>
                  <v-text-field
                    v-model="item.expiry"
                    label="Edit Expiry Date"
                    single-line
                    type="date"
                    counter
                    :rules="[formRules.required]"
                  ></v-text-field>
                </template>
              </v-edit-dialog>
            </td>
            <td>
              <v-edit-dialog
                :return-value.sync="item.starting_quantity"
                @save="saveInlineItem(item)"
                large
                persistent
              >
                <div>{{ item.starting_quantity }}</div>
                <template v-slot:input>
                  <v-text-field
                    v-model.number="item.starting_quantity"
                    label="Edit Starting Quantity"
                    single-line
                    type="number"
                    counter
                    :rules="[formRules.required, formRules.number]"
                  ></v-text-field>
                </template>
              </v-edit-dialog>
            </td>
            <td>
              <v-edit-dialog
                v-if="selectedTransactionType === 'Consumed'"
                :return-value.sync="item.used_quantity"
                @save="saveInlineItem(item)"
                large
                persistent
              >
                <div>{{ item.used_quantity }}</div>
                <template v-slot:input>
                  <v-text-field
                    v-model.number="item.used_quantity"
                    label="Edit Used Quantity"
                    single-line
                    type="number"
                    counter
                    :rules="[formRules.required, formRules.number]"
                  ></v-text-field>
                </template>
              </v-edit-dialog>
            </td>
            <td>
              <v-edit-dialog
                v-if="selectedTransactionType === 'Resupply'"
                :return-value.sync="item.added_quantity"
                @save="saveInlineItem(item)"
                large
                persistent
              >
                <div>{{ item.added_quantity }}</div>
                <template v-slot:input>
                  <v-text-field
                    v-model.number="item.added_quantity"
                    label="Edit Added Quantity"
                    single-line
                    type="number"
                    counter
                    :rules="[formRules.required, formRules.number]"
                  ></v-text-field>
                </template>
              </v-edit-dialog>
            </td>
            <td>
              <v-edit-dialog
                :return-value.sync="item.totalend_quantity"
                @save="saveInlineItem(item)"
                large
                persistent
              >
                <div>{{ item.totalend_quantity }}</div>
                <template v-slot:input>
                  <v-text-field
                    v-model.number="item.totalend_quantity"
                    label="Edit Total End Quantity"
                    single-line
                    type="number"
                    counter
                    :rules="[formRules.required, formRules.number]"
                  ></v-text-field>
                </template>
              </v-edit-dialog>
            </td>
            <td>
              <v-edit-dialog
                :return-value.sync="item.supplier"
                @save="saveInlineItem(item)"
                large
                persistent
              >
                <div>{{ item.supplier }}</div>
                <template v-slot:input>
                  <v-text-field
                    v-model="item.supplier"
                    label="Edit Supplier"
                    single-line
                    counter
                    :rules="[formRules.required]"
                  ></v-text-field>
                </template>
              </v-edit-dialog>
            </td>
            <td>
              <v-edit-dialog
                v-if="selectedTransactionType === 'Resupply'"
                :return-value.sync="item.supply_date"
                @save="saveInlineItem(item)"
                large
                persistent
              >
                <div>
                  {{
                    item.supply_date ? item.supply_date.substring(0, 10) : ""
                  }}
                </div>
                <template v-slot:input>
                  <v-text-field
                    v-model="item.supply_date"
                    label="Edit Supply Date"
                    single-line
                    type="date"
                    counter
                    :rules="[formRules.required]"
                  ></v-text-field>
                </template>
              </v-edit-dialog>
            </td>
            <td>
              <v-edit-dialog
                v-if="selectedTransactionType === 'Consumed'"
                :return-value.sync="item.transaction_date"
                @save="saveInlineItem(item)"
                large
                persistent
              >
                <div>
                  {{
                    item.transaction_date
                      ? item.transaction_date.substring(0, 10)
                      : ""
                  }}
                </div>
                <template v-slot:input>
                  <v-text-field
                    v-model="item.transaction_date"
                    label="Edit Transaction Date"
                    single-line
                    type="date"
                    counter
                    :rules="[formRules.required]"
                  ></v-text-field>
                </template>
              </v-edit-dialog>
            </td>
            <td>
              <v-edit-dialog
                :return-value.sync="item.reorder_status"
                @save="saveInlineItem(item)"
                large
                persistent
              >
                <div>
                  <v-chip
                    :color="getStatusColor(item.reorder_status)"
                    dark
                    small
                  >
                    <span v-if="item.reorder_status === 'Consumed'">©</span>
                    <span v-else>{{ item.reorder_status }}</span>
                  </v-chip>
                </div>
                <template v-slot:input>
                  <v-select
                    v-model="item.reorder_status"
                    :items="reorderStatuses"
                    label="Edit Reorder Status"
                    single-line
                    :rules="[formRules.required]"
                  ></v-select>
                </template>
              </v-edit-dialog>
            </td>
            <td>
              <v-icon small class="mr-2" @click="deleteItem(item)">
                mdi-delete
              </v-icon>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
    <fade-away-message-component
      displayType="variation2"
      v-model="fadeAwayMessage.show"
      :message="fadeAwayMessage.message"
      :header="fadeAwayMessage.header"
      :top="fadeAwayMessage.top"
      :type="fadeAwayMessage.type"
      :timeout="3000"
    ></fade-away-message-component>

    <v-dialog v-model="dialog" persistent eager scrollable max-width="500">
      <v-card>
        <v-card-title dark class="dialog-header pt-5 pb-5 pl-6">
          <span>Add Item</span>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="closeD()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text style="max-height: 700px" class="my-4">
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="editedItem.itemName"
                  :rules="[formRules.required]"
                  dense
                  outlined
                  required
                  label="Item Name"
                  class="rounded-lg"
                  color="blue"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-autocomplete
                  v-model="editedItem.brand"
                  :rules="[formRules.required]"
                  dense
                  outlined
                  label="Edit Brand"
                  class="rounded-lg"
                  color="#96CB5B"
                  :items="brands"
                >
                </v-autocomplete>
              </v-col>
              <v-col cols="12">
                <v-autocomplete
                  v-model="editedItem.unit"
                  :rules="[formRules.required]"
                  dense
                  outlined
                  label="Edit Unit"
                  class="rounded-lg"
                  color="#96CB5B"
                  :items="brands"
                >
                </v-autocomplete>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="editedItem.usageType"
                  :rules="[formRules.required]"
                  dense
                  outlined
                  required
                  label="Edit Kind of Usage"
                  class="rounded-lg"
                  color="blue"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="editedItem.lotNumber"
                  :rules="[formRules.required]"
                  dense
                  outlined
                  required
                  type="number"
                  label="Edit Lot Number"
                  class="rounded-lg"
                  color="blue"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="editedItem.expiry"
                  :rules="[formRules.required]"
                  dense
                  outlined
                  type="date"
                  label="Edit Expiry Date"
                  required
                  class="rounded-lg"
                  color="blue"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model.number="editedItem.starting_quantity"
                  :rules="[formRules.required]"
                  dense
                  outlined
                  required
                  label="Edit Starting Quantity"
                  class="rounded-lg"
                  color="blue"
                  type="number"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="editedItem.supplier"
                  :rules="[formRules.required]"
                  dense
                  outlined
                  required
                  label="Suplier"
                  class="rounded-lg"
                  color="blue"
                  type="number"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-5">
          <v-spacer></v-spacer>
          <v-btn color="red" outlined @click="closeD()">
            <v-icon>mdi-close-circle-outline</v-icon>
            Cancel
          </v-btn>
          <v-btn color="blue" class="white--text" @click="add()">
            <v-icon>mdi-check-circle</v-icon>
            Add
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title class="headline">Confirm Delete</v-card-title>
        <v-card-text>Are you sure you want to delete this item?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="cancelDelete">No</v-btn>
          <v-btn color="red darken-1" text @click="confirmDelete">Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from "axios";
import { debounce } from "lodash";

export default {
  data() {
    // eslint-disable-line no-unused-vars
    return {
      search: "",
      dialog: false,
      selectedSection: "Hematology",
      selectedTransactionType: "Resupply", // Default to Resupply
      sections: [
        "Hematology",
        "Chemistry",
        "Microbiology",
        "Clinical Microscopy",
        "Immunology – Serology",
      ],
      headers: [
        { text: "Item Name", value: "itemName" },
        { text: "Brand", value: "brand" },
        { text: "Unit", value: "unit" },
        { text: "Usage Type", value: "usageType" },
        { text: "Lot Number", value: "lotNumber" },
        { text: "Expiry", value: "expiry" },
        { text: "Starting Quantity", value: "starting_quantity" },
        { text: "Used Quantity", value: "used_quantity" },
        { text: "Added Quantity", value: "added_quantity" },
        { text: "Total End Quantity", value: "totalend_quantity" },
        { text: "Supplier", value: "supplier" },
        { text: "Supply Date", value: "supply_date" },
        // { text: "Transaction Type", value: "transactionType" },
        { text: "Transaction Date", value: "transaction_date" },
        { text: "Reorder Status", value: "reorder_status" },
        { text: "Actions", value: "actions", sortable: false },
      ],
      items: [],
      editedItem: {
        itemName: "",
        brand: "",
        unit: "",
        usageType: "",
        lotNumber: "",
        expiry: "",
        starting_quantity: 0,
        used_quantity: 0,
        added_quantity: 0,
        supply_date: "",
        supplier: "",
        reorder_status: "",
        section: "",
      },
      defaultItem: {
        itemName: "",
        brand: "",
        unit: "",
        usageType: "",
        lotNumber: "",
        expiry: "",
        starting_quantity: 0,
        used_quantity: 0,
        added_quantity: 0,
        supply_date: "",
        supplier: "",
        reorder_status: "",
        section: "",
      },
      brands: [
        "Mindray",
        "Biosino",
        "Epiclone",
        "Kron Dx",
        "Diamond Dx Inc.",
        "Medic Dx",
        "AR Lab",
        "Euro Lab",
        "Rightsign",
        "Bioline",
        "Rapiquick",
        "Advan",
        "Fine Care",
      ],
      options: {},
      loading: false,
      itemData: [],
      units: ["Bottle", "Box", "Piece", "Pack"],
      reorderStatuses: [
        "Sufficient",
        "Inadequate",
        "Lacking",
        "Near Expiry",
        "Consumed",
      ],
      transactionTypes: ["Resupply", "Consumed"],
      formRules: {
        required: (value) => !!value || "Required.",
        number: (value) =>
          (!isNaN(parseFloat(value)) && isFinite(value)) || "Must be a number.",
      },
      fadeAwayMessage: {
        show: false,
        type: "success",
        header: "Successfully Added!",
        message: "",
        top: 10,
      },
      deleteDialog: false,
      itemToDelete: null,
    };
  },

  watch: {
    options: {
      handler() {
        this.getData();
      },
      deep: true,
    },
  },

  methods: {
    closeD() {
      this.dialog = false;
    },
    searchInventory: debounce(async function(event) {
      const name = event.target.value;
      if (name) {
        try {
          const res = await axios.get(
            process.env.VUE_APP_SERVER + `/inventory/name/${name}`
          );
          this.itemData = res.data ? [res.data] : [];
        } catch (error) {
          console.error("Error searching inventory by name:", error);
          this.itemData = [];
        }
      } else {
        this.getData();
      }
    }, 500),

    addNewItem() {
      this.dialog = true;
      // const newItem = Object.assign({}, this.defaultItem);
      // newItem.section = this.selectedSection;
      // newItem.transactionType = this.selectedTransactionType;
      // this.itemData.unshift(newItem);
    },
    async add() {
      try {
        const dataToSend = {
          itemName: this.editedItem.itemName,
          brand: this.editedItem.brand,
          unit: this.editedItem.unit,
          usageType: this.editedItem.usageType,
          lotNumber: this.editedItem.lotNumber,
          expiry: this.editedItem.expiry || null,
          starting_quantity: this.editedItem.starting_quantity || 0,
          used_quantity:
            this.selectedTransactionType === "Consumed"
              ? this.editedItem.used_quantity || 0
              : 0,
          added_quantity:
            this.selectedTransactionType === "Resupply"
              ? this.editedItem.added_quantity || 0
              : 0,
          supply_date:
            this.selectedTransactionType === "Resupply"
              ? this.editedItem.supply_date || null
              : null,
          supplier: this.editedItem.supplier,
          reorder_status: "Sufficient",
          section: this.selectedSection,
          transactionType: this.selectedTransactionType || null,
          transaction_date:
            this.selectedTransactionType === "Consumed"
              ? this.editedItem.transaction_date || null
              : null,
        };
        console.log(dataToSend);
        await axios.post(process.env.VUE_APP_SERVER + "/inventory", dataToSend);
        this.fadeAwayMessage.show = true;
        this.fadeAwayMessage.type = "success";
        this.fadeAwayMessage.header = "System Message";
        this.fadeAwayMessage.message = "Successfully Added";
        this.getData();
        this.closeD();
      } catch (error) {
        console.error("Error adding inventory item:", error);
        this.fadeAwayMessage.show = true;
        this.fadeAwayMessage.type = "error";
        this.fadeAwayMessage.header = "Error";
        this.fadeAwayMessage.message =
          error.response.data.message || "An error occurred";
        this.itemData.shift(); // Remove the new item row on error
      }
    },
    async saveInlineItem(item) {
      if (item.id) {
        // Existing item, update
        try {
          const dataToSend = {
            itemName: item.itemName,
            brand: item.brand,
            unit: item.unit,
            usageType: item.usageType,
            lotNumber: item.lotNumber,
            expiry: item.expiry || null,
            starting_quantity: item.starting_quantity || 0,
            used_quantity:
              this.selectedTransactionType === "Consumed"
                ? item.used_quantity || 0
                : 0,
            added_quantity:
              this.selectedTransactionType === "Resupply"
                ? item.added_quantity || 0
                : 0,
            supply_date:
              this.selectedTransactionType === "Resupply"
                ? item.supply_date || null
                : null,
            supplier: item.supplier,
            reorder_status: item.reorder_status,
            section: item.section,
            transactionType: this.selectedTransactionType || null,
            transaction_date:
              this.selectedTransactionType === "Consumed"
                ? item.transaction_date || null
                : null,
          };
          await axios.patch(
            process.env.VUE_APP_SERVER + `/inventory/${item.id}`,
            dataToSend
          );
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "success";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = "Successfully Updated";
          this.getData();
        } catch (error) {
          console.error("Error updating inventory item:", error);
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "Error";
          this.fadeAwayMessage.message =
            error.response.data.message || "An error occurred";
          this.getData(); // Revert to original data on error
        }
      } else {
        // New item, create
        try {
          const dataToSend = {
            itemName: item.itemName,
            brand: item.brand,
            unit: item.unit,
            usageType: item.usageType,
            lotNumber: item.lotNumber,
            expiry: item.expiry || null,
            starting_quantity: item.starting_quantity || 0,
            used_quantity:
              this.selectedTransactionType === "Consumed"
                ? item.used_quantity || 0
                : 0,
            added_quantity:
              this.selectedTransactionType === "Resupply"
                ? item.added_quantity || 0
                : 0,
            supply_date:
              this.selectedTransactionType === "Resupply"
                ? item.supply_date || null
                : null,
            supplier: item.supplier,
            reorder_status: item.reorder_status,
            section: this.selectedSection,
            transactionType: this.selectedTransactionType || null,
            transaction_date:
              this.selectedTransactionType === "Consumed"
                ? item.transaction_date || null
                : null,
          };
          await axios.post(
            process.env.VUE_APP_SERVER + "/inventory",
            dataToSend
          );
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "success";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = "Successfully Added";
          this.getData();
        } catch (error) {
          console.error("Error adding inventory item:", error);
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "Error";
          this.fadeAwayMessage.message =
            error.response.data.message || "An error occurred";
          this.itemData.shift(); // Remove the new item row on error
        }
      }
    },
    async deleteItem(item) {
      this.itemToDelete = item;
      this.deleteDialog = true;
    },
    async confirmDelete() {
      if (this.itemToDelete) {
        try {
          await axios.delete(
            process.env.VUE_APP_SERVER + `/inventory/${this.itemToDelete.id}`
          );
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "success";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = "Successfully Deleted";
          this.getData();
        } catch (error) {
          console.error("Error deleting inventory item:", error);
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "Error";
          this.fadeAwayMessage.message =
            error.response.data.message || "An error occurred";
        } finally {
          this.cancelDelete();
        }
      }
    },
    cancelDelete() {
      this.deleteDialog = false;
      this.itemToDelete = null;
    },
    changeSelected() {
      this.getData();
    },

    async getData() {
      this.loading = true;
      try {
        const res = await axios.get(process.env.VUE_APP_SERVER + "/inventory");
        this.itemData = res.data.reverse();
      } catch (error) {
        console.error("Error fetching inventory data:", error);
        this.itemData = [];
      } finally {
        this.loading = false;
      }
    },

    resetForm() {
      this.editedItem = Object.assign({}, this.defaultItem);
    },
    getStatusColor(status) {
      switch (status) {
        case "Sufficient":
          return "green";
        case "Inadequate":
          return "purple";
        case "Lacking":
          return "red";
        case "Near Expiry":
          return "red";
        case "Consumed":
          return "grey";
        default:
          return "blue";
      }
    },
  },
  mounted() {
    this.getData();
  },
};
</script>

<style scoped>
.v-data-table {
  font-size: 14px;
}
</style>
