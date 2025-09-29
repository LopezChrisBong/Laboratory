<template>
  <v-container fluid>
    <v-row class="my-4" align="center">
      <v-col cols="12" md="6" class="pa-0">
        <v-text-field
          v-model="search"
          outlined
          prepend-inner-icon="search"
          label="Search"
          single-line
          hide-details
          class="rounded-lg px-2"
          color="#239FAB"
          dense
        ></v-text-field>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="12" md="6" class="d-flex justify-space-between">
        <v-select
          v-model="selectedSection"
          :items="sections"
          @change="changeSelected()"
          label="Select Lab Section"
        ></v-select>
        <v-btn
          class="white--text ml-2 mt-3 rounded-lg"
          color="#2196F3"
          @click="add('Add')"
        >
          <v-icon left> mdi-plus-box-outline </v-icon>
          Add Item
        </v-btn>
      </v-col>
    </v-row>
    <v-card class="ma-5 dt-container" elevation="0" outlined>
      <v-data-table
        :headers="headers"
        :items="itemData"
        :items-per-page="10"
        :search="search"
        :options.sync="options"
        :loading="loading"
        @pagination="pagination"
        hide-default-footer
      >
        <template v-slot:[`item.reorderStatus`]="{ item }">
          <v-chip :color="getStatusColor(item.reorderStatus)" dark small>
            <span v-if="item.reorderStatus === 'Consumed'">©</span>
            <span v-else>{{ item.reorderStatus }}</span>
          </v-chip>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <div class="">
            <v-btn
              class="ma-1"
              x-small
              color="green"
              outlined
              @click="update(item)"
            >
              <v-icon size="14" class="mr-1">mdi-pencil</v-icon> Update
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>
    <v-row class="mb-2 mx-5" align="center">
      <v-col cols="auto" class="mr-auto text-truncate flex-items" no-gutters>
        <span class="px-2">Show</span>
        <span>
          <v-select
            dense
            outlined
            color="#2196F3"
            hide-details
            :value="options.itemsPerPage"
            style="max-width: 90px"
            class="rounded-lg"
            @change="options.itemsPerPage = parseInt($event, 10)"
            :items="perPageChoices"
          >
          </v-select>
        </span>
        <span class="px-2"> Entries </span>
      </v-col>

      <v-col cols="auto" class="mr-auto text-truncate" no-gutters>
        Showing {{ paginationData.pageStart + 1 }} to
        {{ paginationData.pageStop }} of
        {{ paginationData.itemsLength }} entries
      </v-col>
      <v-col cols="auto">
        <v-pagination
          v-model="options.page"
          class="rounded-lg"
          :total-visible="7"
          :color="$vuetify.theme.themes.light.submitBtns"
          :length="paginationData.pageCount"
        >
        </v-pagination>
      </v-col>
    </v-row>
    <v-dialog v-model="dialog" max-width="600px" persistent eager scrollable>
      <v-card>
        <v-card-title dark class="dialog-header pt-5 pb-5 pl-6">
          <span>{{ action }} Item</span>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="cancel()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-text-field
              v-model="form.itemName"
              :rules="[formRules.required]"
              label="Item Name"
            ></v-text-field>
            <v-text-field
              v-model="form.quantity"
              :rules="[formRules.required]"
              label="Quantity"
              type="number"
            ></v-text-field>
            <v-select
              v-model="form.brand"
              :rules="[formRules.required]"
              :items="brands"
              label="Brand"
            ></v-select>
            <v-select
              v-model="form.unit"
              :rules="[formRules.required]"
              :items="units"
              label="Unit"
            ></v-select>
            <v-text-field
              v-model="form.usage"
              :rules="[formRules.required]"
              label="Kind of Usage"
            ></v-text-field>
            <v-text-field
              v-model="form.lotNumber"
              :rules="[formRules.required]"
              label="Lot Number"
            ></v-text-field>
            <v-text-field
              v-model="form.expiry"
              :rules="[formRules.required]"
              label="Expiry"
              type="date"
            ></v-text-field>
            <v-text-field
              v-model="form.startingQty"
              :rules="[formRules.required]"
              label="Starting Quantity"
              type="number"
            ></v-text-field>
            <v-text-field
              v-model="form.usedQty"
              :rules="[formRules.required]"
              label="Used Quantity"
              type="number"
            ></v-text-field>
            <v-text-field
              v-model="form.addedQty"
              :rules="[formRules.required]"
              label="Added Quantity"
              type="number"
            ></v-text-field>
            <v-text-field
              v-model="form.supplyDate"
              :rules="[formRules.required]"
              label="Supply Date"
              type="date"
            ></v-text-field>
            <v-text-field
              v-model="form.endingQty"
              :rules="[formRules.required]"
              label="Ending Quantity"
              type="number"
            ></v-text-field>
            <v-text-field
              v-model="form.supplier"
              :rules="[formRules.required]"
              label="Supplier"
            ></v-text-field>
            <v-select
              v-model="form.reorderStatus"
              :rules="[formRules.required]"
              :items="reorderStatuses"
              label="Reorder Status"
            ></v-select>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" outlined @click="cancel()">Cancel</v-btn>
          <v-btn
            color="blue"
            outlined
            @click="action == 'Add' ? saveItem() : updateItem()"
            >{{ action == "Add" ? "Save" : "Update" }}</v-btn
          >
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
      :timeout="3000"
    ></fade-away-message-component>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      search: "",
      dialog: false,
      selectedSection: "Hematology",
      sections: [
        "Hematology",
        "Chemistry",
        "Microbiology",
        "Clinical Microscopy",
        "Immunology – Serology",
      ],
      headers: [
        { text: "Item Name", value: "itemName" },
        { text: "Quantity", value: "quantity" },
        { text: "Expiry", value: "expiry" },
        { text: "Brand", value: "brand" },
        { text: "Reorder Status", value: "reorderStatus" },
        { text: "Action", value: "actions", align: "end", width: 200 },
      ],
      items: [],
      form: {
        itemName: "",
        quantity: 0,
        brand: "",
        unit: "",
        usage: "Disposable",
        lotNumber: "",
        expiry: "",
        startingQty: 0,
        usedQty: 0,
        addedQty: 0,
        supplyDate: "",
        endingQty: 0,
        supplier: "",
        reorderStatus: "",
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
      paginationData: {},
      perPageChoices: [
        { text: "5", value: 5 },
        { text: "10", value: 10 },
        { text: "20", value: 20 },
        { text: "50", value: 50 },
        { text: "100", value: 100 },
        { text: "250", value: 250 },
        { text: "500", value: 500 },
      ],
      itemData: [],
      updateID: null,
      action: null,
      units: ["Bottle", "Box", "Piece", "Pack"],
      reorderStatuses: [
        "Sufficient",
        "Inadequate",
        "Lacking",
        "Near Expiry",
        "Consumed",
      ],
      fadeAwayMessage: {
        show: false,
        type: "success",
        header: "Successfully Added!",
        message: "",
        top: 10,
      },
    };
  },

  watch: {
    options: {
      handler() {
        this.initialize(this.selectedSection);
      },
      deep: true,
    },
  },

  methods: {
    generateUUID() {
      return "xxxx-4xxx-yxxx-xxxx".replace(/[xy]/g, function(c) {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    },
    pagination(data) {
      this.paginationData = data;
    },
    saveItem() {
      if (!this.$refs.form.validate()) return;
      let data = {
        // id: this.generateUUID(),
        itemName: this.form.itemName,
        quantity: this.form.quantity,
        brand: this.form.brand,
        unit: this.form.unit,
        usageType: this.form.usage,
        lotNumber: this.form.lotNumber,
        expiry: this.form.expiry,
        starting_quantity: this.form.startingQty,
        used_quantity: this.form.usedQty,
        added_quantity: this.form.addedQty,
        supply_date: this.form.supplyDate,
        totalend_quantity: this.form.endingQty,
        supplier: this.form.supplier,
        reorderStatus: this.form.reorderStatus,
        // uncomment if confirmed
        // section: this.form.section,
        // selectedSection: this.selectedSection,
      };
      axios
        .post(process.env.VUE_APP_SERVER + "/inventory", data)
        .then((res) => {
          console.log(res.data);
          // // console.log("succesfull");

          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "success";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = "Successfully Added";
          this.initialize(this.selectedSection);
          this.dialog = false;
          this.resetForm();
        });

      // // console.log(data);
      // let existingData =
      //   JSON.parse(localStorage.getItem("inventoryData")) || [];
      // existingData.push(data);
      // localStorage.setItem("inventoryData", JSON.stringify(existingData));
      // //   this.items.push({ ...this.form, section: this.selectedSection });
    },
    add() {
      this.dialog = true;
      this.action = "Add";
    },
    cancel() {
      this.dialog = false;
      this.updateID = null;
      this.resetForm();
    },
    update(item) {
      console.log(item);
      this.dialog = true;
      this.action = "Update";
      this.form.itemName = item.itemName;
      this.form.quantity = item.totalend_quantity;
      this.form.brand = item.brand;
      this.form.unit = item.unit;
      this.form.usage = item.usageType;
      this.form.lotNumber = item.lotNumber;
      this.form.expiry = item.expiry;
      this.form.startingQty = item.starting_quantity;
      this.form.usedQty = item.used_quantity;
      this.form.addedQty = item.added_quantity;
      this.form.supplyDate = item.supplyDate;
      this.form.endingQty = item.totalend_quantity;
      this.form.supplier = item.supplier;
      this.form.reorderStatus = item.reorder_status;
      this.form.section = item.section;
      this.updateID = item.id;
      // 
      axios
      .get(
        process.env.VUE_APP_SERVER + "/inventory"  
      )
      .then((res) => {
        // alert(res.data.itemName)
        console.log(res.data);
      });
    },
    updateItem() {
      if (!this.$refs.form.validate()) return;
      let id = this.updateID;
      let data = {
        itemName: this.form.itemName,
        quantity: this.form.quantity,
        brand: this.form.brand,
        unit: this.form.unit,
        usage: this.form.usage,
        lotNumber: this.form.lotNumber,
        expiry: this.form.expiry,
        startingQty: this.form.startingQty,
        usedQty: this.form.usedQty,
        addedQty: this.form.addedQty,
        supplyDate: this.form.supplyDate,
        endingQty: this.form.endingQty,
        supplier: this.form.supplier,
        reorderStatus: this.form.reorderStatus,
        section: this.form.section,
        selectedSection: this.selectedSection,
      };

      let existingData =
        JSON.parse(localStorage.getItem("inventoryData")) || [];

      let index = existingData.findIndex((item) => item.id === id);
      // console.log("Data", data, existingData, "Index:", index, "id", id);
      if (index !== -1) {
        Object.assign(existingData[index], data);
      } else {
        existingData.push(data);
      }

      localStorage.setItem("inventoryData", JSON.stringify(existingData));
      this.fadeAwayMessage.show = true;
      this.fadeAwayMessage.type = "success";
      this.fadeAwayMessage.header = "System Message";
      this.fadeAwayMessage.message = "Successfully Updated";
      this.updateID = null;
      this.initialize(this.selectedSection);
      this.dialog = false;
      this.resetForm();
    },
    changeSelected() {
      this.initialize(this.selectedSection);
    },

    initialize(section) {
      this.loading = true;
      // console.log("Selected Section:", section);

      let inventoryData = JSON.parse(localStorage.getItem("inventoryData"));

      if (!inventoryData) {
        this.itemData = [];
        this.loading = false;
      } else {
        // console.log("inventoryData:", inventoryData);
        this.itemData = inventoryData
          .filter((entry) => entry.selectedSection === section)
          .reverse();
        this.loading = false;
      }
    },
    getData() {
      axios.get(process.env.VUE_APP_SERVER + "/inventory").then((res) => {
        // // console.log(res.data);
        this.itemData = res.data;
      });
    },
    resetForm() {
      this.form = {
        itemName: "",
        quantity: 0,
        brand: "",
        unit: "",
        usage: "Disposable",
        lotNumber: "",
        expiry: "",
        startingQty: 0,
        usedQty: 0,
        addedQty: 0,
        supplyDate: "",
        endingQty: 0,
        supplier: "",
        reorderStatus: "",
        section: "",
      };
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
