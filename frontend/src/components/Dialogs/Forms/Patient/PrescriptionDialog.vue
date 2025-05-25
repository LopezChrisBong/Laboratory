<template>
  <div>
    <v-dialog
      v-model="dialog"
      fullscreen
      eager
      persistent
      scrollable
      max-width="900px"
    >
      <v-card>
        <v-card-title dark class="dialog-header pt-5 pb-5 pl-6">
          <span>Patient Prescription Data Table</span>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="closeD()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text style="max-height: 700px" class="my-4">
          <v-card>
            <v-row>
              <v-col cols="8" class="flex-items mt-2">
                <!-- <div class="ml-2 text-body-1">
                  {{ data.title }}
                </div> -->
              </v-col>
              <v-spacer></v-spacer>
              <v-col cols="2" class="d-flex justify-end mt-2 mr-2">
                <v-btn
                  v-if="assignedModuleID == 5"
                  @click="addPrescription()"
                  class="white--text rounded-lg"
                  color="blue"
                >
                  Add
                </v-btn>
              </v-col>
              <v-col cols="12" class=" pt-2 px-4">
                <v-data-table
                  :headers="headers"
                  :items="dataItem"
                  :items-per-page="10"
                >
                  <template v-slot:[`item.index`]="{ index }">
                    {{ index + 1 }}
                  </template>
                  <template v-slot:[`item.lab_request`]="{ item }">
                    {{ item.lab_request == null ? "Doctor/Receptionist" : "" }}
                  </template>
                  <template v-slot:[`item.status`]="{ item }">
                    <v-chip
                      :color="item.status == 1 ? 'orange' : 'blue'"
                      dark
                      small
                    >
                      <span>{{
                        item.status == 1 ? "Pending" : "Done Examination"
                      }}</span>
                    </v-chip>
                  </template>
                  <template v-slot:[`item.action`]="{ item }">
                    <v-btn
                      x-small
                      class="mt-1"
                      @click="view(item)"
                      outlined
                      color="green"
                      block
                      ><v-icon small> mdi-eye</v-icon>View Examine</v-btn
                    >
                    <v-btn
                      v-if="assignedModuleID == 2"
                      x-small
                      class="mt-1"
                      @click="edit(item)"
                      outlined
                      color="blue"
                      block
                    >
                      <v-icon small> mdi-pencil</v-icon>Update Examine</v-btn
                    >
                    <v-btn
                      v-if="assignedModuleID == 5 && item.status == 2"
                      x-small
                      class="mt-1"
                      @click="editMedicalInfo(item)"
                      outlined
                      color="blue"
                      block
                    >
                      <v-icon small> mdi-pencil</v-icon>Add Medical Info
                    </v-btn>
                    <v-btn
                      x-small
                      class="mt-1"
                      @click="print(item)"
                      outlined
                      color="blue"
                      block
                    >
                      <v-icon small> mdi-printer</v-icon>Print
                    </v-btn>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
          </v-card>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="pa-5">
          <v-spacer></v-spacer>

          <v-btn color="red" outlined @click="closeD()">
            <v-icon>mdi-close-circle-outline</v-icon>
            Close
          </v-btn>

          <!-- <v-btn color="blue" class="white--text" @click="submitTarget()">
                <v-icon>mdi-check-circle</v-icon>
                Submit
              </v-btn> -->
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- delete dialog -->
    <v-dialog v-model="confirmDialog" persistent max-width="390">
      <v-card color="white">
        <div class="pa-4 #3a3b3a--text">
          <div class="text-h6 mb-1">WARNING!</div>
          <div class="text-body-1 mb-1">
            <p style="text-align: justify">
              <v-icon class="mt-n2" color="white">mdi-alert</v-icon> &nbsp; Are
              you sure you want to delete this information?<br /><br />
              Please note that
              <b>this action is irreversible.</b>
            </p>
          </div>
        </div>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" outlined @click="cancelDelete()">
            Close
          </v-btn>
          <v-btn
            :disabled="isButtonLoading"
            :loading="isButtonLoading"
            color="green"
            class="white--text"
            @click="confirmDelete()"
          >
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="prescriptionDialog" eager scrollable max-width="600px">
      <v-form ref="submitPrescription" @submit.prevent>
        <v-card>
          <v-card-title dark class="dialog-header pt-5 pb-5 pl-6">
            <span>{{ action }} Prescription</span>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="prescriptionDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text style="max-height: 700px" class="my-4">
            <v-container>
              <v-row>
                <v-col col="12" md="12">
                  <label for="finding">
                    <strong
                      ><h3>
                        Prescription
                      </h3></strong
                    ></label
                  >
                  <vue-editor
                    v-model="prescription_description"
                    :readonly="action == 'View'"
                    :editorToolbar="customToolbar"
                  ></vue-editor>
                </v-col>
                <!-- <v-col cols="12">
                  <v-text-field
                    label="Doctors Fee"
                    v-model="doctors_fee"
                    :rules="[formRules.required]"
                    class="text-uppercase"
                    type="number"
                    required
                  />
                </v-col> -->
              </v-row>
            </v-container>
          </v-card-text>
          <v-divider></v-divider>

          <v-card-actions class="pa-5">
            <v-spacer></v-spacer>
            <v-btn color="red" outlined @click="prescriptionDialog = false">
              <v-icon>mdi-close-circle-outline</v-icon>
              Cancel
            </v-btn>
            <!-- <v-btn
              :color="$vuetify.theme.themes.light.submitBtns"
              class="white--text"
              @click="accept()"
            >
              <v-icon>mdi-check-circle</v-icon>
              {{ action == "Verify" ? "Accept" : "Update" }}
            </v-btn> -->
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>

    <MedicalInformation :data="medicalData" :action="action" />

    <fade-away-message-component
      displayType="variation2"
      v-model="fadeAwayMessage.show"
      :message="fadeAwayMessage.message"
      :header="fadeAwayMessage.header"
      :top="fadeAwayMessage.top"
      :type="fadeAwayMessage.type"
    ></fade-away-message-component>
  </div>
</template>

<script>
import { VueEditor } from "vue2-editor";
export default {
  components: {
    MedicalInformation: () => import("./MedicalInformation.vue"),
    // viewStrategicOutcome: () => import("./ViewStrategicOutcome.vue"),
    VueEditor,
  },
  props: {
    data: null,
  },
  data() {
    return {
      service_description: "Red Blood Cell",
      input: [],
      input1: [],
      updateID: null,
      male_lower: 4.0,
      male_upper: 5.9,
      female_lower: 3.8,
      female_upper: 6.0,
      unit: "x 10⁶/L",
      remarks: "",
      options: {},
      strategicData: null,
      action: null,
      prescription_description: null,
      newPackageData: {},
      service: [],
      desc: null,
      customToolbar: [
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        // [{ list: "bullet" }],
      ],
      itemToDelete: null,
      confirmDialog: false,
      prescriptionDialog: false,
      fadeAwayMessage: {
        show: false,
        type: "success",
        header: "Successfully Added!",
        message: "",
        top: 10,
      },
      dialog: false,

      medicalData: null,
      id: null,
      isButtonLoading: false,
      assignedModuleID: null,
      dataItem: [],
      headers: [
        {
          text: "No.",
          value: "index",
          align: "start",
          valign: "start",
          width: 50,
          sortable: false,
        },

        {
          text: "Doctors Name",
          value: "Med_name",
          align: "start",
          valign: "start",
          sortable: false,
        },
        {
          text: "Presciption",
          value: "prescription",
          align: "start",
          valign: "start",
          sortable: false,
        },

        {
          text: "Action",
          value: "action",
          align: "center",
          valign: "center",
          width: 200,
        },
      ],
    };
  },

  watch: {
    data: {
      handler(data) {
        this.dialog = true;
        console.log("STRAT", data);
        this.id = data.id;
        this.tab = 1;
        this.initialize();
      },
      deep: true,
    },
    options: {
      handler() {
        this.initialize();
      },
      deep: true,
    },
  },
  mounted() {
    this.eventHub.$on("closeMedicalInformation", () => {
      this.initialize();
    });
  },

  beforeDestroy() {
    this.eventHub.$off("closeMedicalInformation");
  },

  methods: {
    initialize() {
      this.loading = true;
      this.assignedModuleID = this.$store.state.user.user.assignedModuleID;
      let userID = this.$store.state.user.id;
      console.log(userID);
      // alert(this.assignedModuleID);
    },
    submitResult() {
      console.log(this.input, this.input1, this.updateID);
      let data = {
        status: 2,
        updateID: this.updateID,
      };
      this.axiosCall(
        "/appointment/updatePatientStatus/" + this.id,
        "PATCH",
        data
      ).then((res) => {
        if (res.data.status == 201) {
          this.initialize();
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "success";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = res.data.msg;
          this.prescriptionDialog = false;
        } else if (res.data.status == 400) {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = res.data.msg;
        }
      });
    },

    closeD() {
      this.eventHub.$emit("closePrescrioptionDialog", false);
      this.dialog = false;
    },

    edit(item) {
      this.action = "Update";
      this.updateID = item.id;
      console.log(item);
      this.axiosCall(
        "/services/getAllServiceToUpdateResult/" + item.id,
        "GET"
      ).then((res) => {
        if (res) {
          console.log(res.data);
          this.service = res.data;
        }
      });
      this.prescriptionDialog = true;
    },
    view(item) {
      console.log(item);
      this.action = "View";
      this.updateID = item.id;
      console.log(item);
      this.axiosCall(
        "/services/getAllServiceToUpdateResult/" + item.id,
        "GET"
      ).then((res) => {
        if (res) {
          console.log(res.data);
          this.service = res.data;
        }
      });
      this.prescriptionDialog = true;
    },

    editMedicalInfo(item) {
      // alert(this.data.id);
      console.log(item);
      this.medicalData = { id: null, userIDd: this.data.id, data: item };
      this.action = "Add";
    },
    accept() {
      if (this.$refs.submitPrescription.validate()) {
        console.log("love");
      }
    },

    addPrescription() {
      this.action = "Add";
      this.prescriptionDialog = true;
    },
  },
};
</script>
<style scoped></style>
