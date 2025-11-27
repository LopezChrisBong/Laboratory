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
              style="max-width: 200px;"
            ></v-select>
            <v-autocomplete
              v-model="selectedSupplier"
              :items="suppliers"
              item-text="supplierName"
              item-value="supplierName"
              label="Filter by Supplier"
              dense
              outlined
              hide-details
              clearable
              class="shrink mr-2"
              style="max-width: 200px;"
              :loading="loadingSuppliers"
              @change="filterBySupplier"
            ></v-autocomplete>
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
                  <v-select
                    v-model="item.usageType"
                    :items="['Disposable', 'Reusable']"
                    label="Edit Kind of Usage"
                    single-line
                    :rules="[formRules.required]"
                  ></v-select>
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
              <!-- Quantity needed is editable -->
              <v-edit-dialog
                :return-value.sync="item.quantity_needed"
                @save="saveInlineItem(item)"
                large
                persistent
              >
                <div>{{ item.quantity_needed || 0 }}</div>
                <template v-slot:input>
                  <v-text-field
                    v-model.number="item.quantity_needed"
                    label="Edit Quantity Needed"
                    single-line
                    type="number"
                    min="0"
                    counter
                    :rules="[
                      formRules.number,
                      v => v >= 0 || 'Cannot be negative'
                    ]"
                  ></v-text-field>
                </template>
              </v-edit-dialog>
            </td>
            <td>
              <!-- Used quantity is editable only for Consumed transactions -->
              <v-edit-dialog
                v-if="selectedTransactionType === 'Consumed'"
                :return-value.sync="item.used_quantity"
                @save="saveInlineItem(item)"
                large
                persistent
              >
                <div>{{ item.used_quantity || 0 }}</div>
                <template v-slot:input>
                  <v-text-field
                    v-model.number="item.used_quantity"
                    label="Edit Used Quantity"
                    single-line
                    type="number"
                    min="0"
                    counter
                    :rules="[
                      formRules.number,
                      v => v >= 0 || 'Cannot be negative',
                      v => v <= (item.totalend_quantity || 0) || 'Cannot exceed available stock (' + (item.totalend_quantity || 0) + ')'
                    ]"
                  ></v-text-field>
                </template>
              </v-edit-dialog>
              <div v-else>{{ item.used_quantity || 0 }}</div>
            </td>
            <td>
              <!-- Added quantity is editable only for Resupply transactions -->
              <v-edit-dialog
                v-if="selectedTransactionType === 'Resupply'"
                :return-value.sync="item.added_quantity"
                @save="saveInlineItem(item)"
                large
                persistent
              >
                <div>{{ item.added_quantity || 0 }}</div>
                <template v-slot:input>
                  <v-text-field
                    v-model.number="item.added_quantity"
                    label="Edit Added Quantity"
                    single-line
                    type="number"
                    min="0"
                    counter
                    :rules="[
                      formRules.number,
                      v => v >= 0 || 'Cannot be negative'
                    ]"
                  ></v-text-field>
                </template>
              </v-edit-dialog>
              <div v-else>{{ item.added_quantity || 0 }}</div>
            </td>
            <td>
              <!-- Total end quantity is read-only (auto-calculated) -->
              <div>{{ item.totalend_quantity }}</div>
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
              <!-- Quantity status is automatically calculated, display only -->
              <v-chip
                :color="getQuantityStatusColor(item.quantity_status)"
                dark
                small
              >
                <span v-if="item.quantity_status === 'Consumed'">©</span>
                <span v-else>{{ item.quantity_status }}</span>
              </v-chip>
            </td>
            <td>
              <!-- Expiry status is automatically calculated, display only -->
              <v-chip
                :color="getExpiryStatusColor(item.expiry_status)"
                dark
                small
              >
                {{ item.expiry_status }}
              </v-chip>
            </td>
            <td>
              <v-icon 
                small 
                class="mr-2" 
                @click="viewTransactionHistory(item)"
                color="blue"
                title="View Transaction History"
              >
                mdi-history
              </v-icon>
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
                  :items="[
                    'PC',
                    'Pack',
                    'Container',
                    'Bottle',
                    'Roll',
                    'Bag',
                    'Box',
                    'Gallon',
                    'Liter',
                  ]"
                >
                </v-autocomplete>
              </v-col>
              <v-col cols="12">
                <v-autocomplete
                  v-model="editedItem.usageType"
                  :rules="[formRules.required]"
                  dense
                  outlined
                  label="Edit Kind of Usage"
                  class="rounded-lg"
                  color="#96CB5B"
                  :items="['Disposable', 'Reusable']"
                >
                </v-autocomplete>
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
                  :rules="[
                    formRules.required,
                    v => v >= 0 || 'Cannot be negative'
                  ]"
                  dense
                  outlined
                  required
                  label="Edit Starting Quantity"
                  class="rounded-lg"
                  color="blue"
                  type="number"
                  min="0"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-autocomplete
                  v-model="editedItem.supplier"
                  :rules="[formRules.required]"
                  dense
                  outlined
                  required
                  label="Supplier"
                  class="rounded-lg"
                  color="blue"
                  :items="suppliers"
                  item-text="supplierName"
                  item-value="supplierName"
                  :loading="loadingSuppliers"
                  no-data-text="No suppliers available"
                >
                </v-autocomplete>
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

    <TransactionHistoryDialog
      v-model="showTransactionHistory"
      :inventoryItemId="selectedItemId"
      :itemName="selectedItemName"
    />
  </v-container>
</template>

<script>
import axios from "axios";
import { debounce } from "lodash";
import TransactionHistoryDialog from "../Dialogs/TransactionHistoryDialog.vue";

export default {
  components: {
    TransactionHistoryDialog,
  },
  data() {
    // eslint-disable-line no-unused-vars
    return {
      search: "",
      dialog: false,
      selectedSection: "Hematology",
      selectedTransactionType: "Resupply", // Default to Resupply
      selectedSupplier: null, // Filter by supplier
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
        { text: "Quantity Needed", value: "quantity_needed" },
        { text: "Used Quantity", value: "used_quantity" },
        { text: "Added Quantity", value: "added_quantity" },
        { text: "Total End Quantity", value: "totalend_quantity" },
        { text: "Supplier", value: "supplier" },
        { text: "Quantity Status", value: "quantity_status" },
        { text: "Expiry Status", value: "expiry_status" },
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
        quantity_needed: 0,
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
        quantity_needed: 0,
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
      loadingSuppliers: false,
      itemData: [],
      suppliers: [],
      units: ["Bottle", "Box", "Piece", "Pack"],
      reorderStatuses: [
        "Sufficient",
        "Inadequate",
        "Lacking",
        "Nearly Expiry",
        "Expired",
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
      showTransactionHistory: false,
      selectedItemId: null,
      selectedItemName: "",
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
      this.getSuppliers();
      // const newItem = Object.assign({}, this.defaultItem);
      // newItem.section = this.selectedSection;
      // newItem.transactionType = this.selectedTransactionType;
      // this.itemData.unshift(newItem);
    },
    async getSuppliers() {
      this.loadingSuppliers = true;
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(process.env.VUE_APP_SERVER + "/supplier", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.suppliers = res.data || [];
      } catch (error) {
        console.error("Error fetching suppliers:", error);
        this.suppliers = [];
      } finally {
        this.loadingSuppliers = false;
      }
    },
    async filterBySupplier() {
      if (this.selectedSupplier) {
        this.loading = true;
        try {
          const res = await axios.get(
            process.env.VUE_APP_SERVER + "/inventory"
          );
          this.itemData = res.data
            .filter((item) => item.supplier === this.selectedSupplier)
            .reverse();
        } catch (error) {
          console.error("Error filtering inventory by supplier:", error);
          this.itemData = [];
        } finally {
          this.loading = false;
        }
      } else {
        // If no supplier selected, show all items
        this.getData();
      }
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
          quantity_needed: this.editedItem.quantity_needed || 0,
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
          reorder_status: "Sufficient", // Will be auto-calculated by backend
          section: this.selectedSection,
          transactionType: this.selectedTransactionType || null,
        };
        console.log(dataToSend);
        const token = localStorage.getItem("token");
        await axios.post(process.env.VUE_APP_SERVER + "/inventory", dataToSend, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
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
          const token = localStorage.getItem("token");
          const dataToSend = {
            itemName: item.itemName,
            brand: item.brand,
            unit: item.unit,
            usageType: item.usageType,
            lotNumber: item.lotNumber,
            expiry: item.expiry || null,
            quantity_needed: item.quantity_needed || 0,
            starting_quantity: item.starting_quantity || 0,
            used_quantity: item.used_quantity || 0, // Always include, it persists
            added_quantity: item.added_quantity || 0, // Always include
            supply_date:
              this.selectedTransactionType === "Resupply"
                ? item.supply_date || null
                : null,
            supplier: item.supplier,
            reorder_status: item.reorder_status, // Backend will recalculate
            section: item.section,
            transactionType: this.selectedTransactionType || null,
          };
          
          await axios.patch(
            process.env.VUE_APP_SERVER + `/inventory/${item.id}`,
            dataToSend,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          // Fetch updated item to get recalculated values
          const updatedItem = await axios.get(
            process.env.VUE_APP_SERVER + `/inventory/${item.id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          // Update the item in the table with new calculated values
          if (updatedItem.data) {
            Object.assign(item, updatedItem.data);
          }

          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "success";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = "Successfully Updated";
          
          // Refresh the entire table to ensure all values are in sync
          await this.getData();
        } catch (error) {
          console.error("Error updating inventory item:", error);
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "Error";
          this.fadeAwayMessage.message =
            error.response?.data?.message || "An error occurred";
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
            used_quantity: item.used_quantity || 0, // Always include
            added_quantity: item.added_quantity || 0, // Always include
            supply_date:
              this.selectedTransactionType === "Resupply"
                ? item.supply_date || null
                : null,
            supplier: item.supplier,
            reorder_status: item.reorder_status, // Backend will calculate
            section: this.selectedSection,
            transactionType: this.selectedTransactionType || null,
          };
          const token = localStorage.getItem("token");
          await axios.post(
            process.env.VUE_APP_SERVER + "/inventory",
            dataToSend,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
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
    viewTransactionHistory(item) {
      this.selectedItemId = item.id;
      this.selectedItemName = item.itemName;
      this.showTransactionHistory = true;
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
    getQuantityStatusColor(status) {
      switch (status) {
        case "Sufficient":
          return "green";
        case "Inadequate":
          return "orange";
        case "Lacking":
          return "orange darken-2";
        case "Consumed":
          return "grey";
        default:
          return "blue";
      }
    },
    getExpiryStatusColor(status) {
      switch (status) {
        case "Valid":
          return "green";
        case "Nearly Expiry":
          return "orange";
        case "Expired":
          return "red";
        case "N/A":
          return "grey lighten-1";
        default:
          return "blue";
      }
    },
    getStatusColor(status) {
      switch (status) {
        case "Sufficient":
          return "green";
        case "Inadequate":
          return "orange";
        case "Lacking":
          return "orange darken-2";
        case "Nearly Expiry":
          return "red lighten-1";
        case "Expired":
          return "red darken-2";
        case "Consumed":
          return "grey";
        default:
          return "blue";
      }
    },
  },
  mounted() {
    this.getData();
    this.getSuppliers();
  },
};
</script>

<style scoped>
.v-data-table {
  font-size: 14px;
}
</style>
