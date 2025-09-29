<template>
  <div>
    <v-dialog v-model="dialog" eager persistent scrollable max-width="1000px">
      <v-card>
        <v-card-title dark class="dialog-header pt-5 pb-5 pl-6">
          <span>Patient Prescription Data Table</span>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="closeD()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text style="max-height: 700px" class="my-4">
          <v-container>
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
                    :loading="loading"
                  >
                    <template v-slot:[`item.index`]="{ index }">
                      {{ index + 1 }}
                    </template>
                    <template v-slot:[`item.date`]="{ item }">
                      {{ formatDate(item.date) }}
                    </template>
                    <template v-slot:[`item.action`]="{ item }">
                      <v-btn
                        x-small
                        class="mt-1 mx-2"
                        @click="view(item)"
                        outlined
                        color="green"
                      >
                        <v-icon small>mdi-eye</v-icon>
                      </v-btn>
                      <v-btn
                        x-small
                        class="mt-1 mx-2"
                        @click="print(item)"
                        outlined
                        color="green"
                      >
                        <v-icon small>mdi-printer</v-icon>
                      </v-btn>
                    </template>
                  </v-data-table>
                </v-col>
              </v-row>
            </v-card>
          </v-container>
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

    <v-dialog
      v-model="prescriptionDialog"
      eager
      scrollable
      max-width="600px"
      persistent
    >
      <v-card>
        <v-card-title dark class="dialog-header pt-5 pb-5 pl-6">
          <span>{{ action }} Prescription</span>
          <v-spacer></v-spacer>
          <v-btn
            icon
            dark
            @click="
              prescriptionDialog = false;
              resetForm();
            "
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text style="max-height: 700px" class="my-4">
          <!-- Header -->
          <v-row class="align-center">
            <v-col cols="12" class="text-center">
              <h3 class="font-weight-bold mb-0">PARAGON</h3>
              <h4 class="mb-0">MULTISPECIALTY CLINIC</h4>
              <div class="text-caption">
                1F Bluz Building 2, Tadeco Road, Brgy. San Francisco, Panabo
                City <br />
                📞 0946-100-3260 | Mon–Sat 8:00am–5:00pm
              </div>
              <v-divider class="my-3"></v-divider>
            </v-col>
          </v-row>

          <!-- Patient Info -->
          <v-row>
            <v-col cols="8">
              <v-text-field
                v-model="patient.name"
                label="Name"
                readonly
                dense
                hide-details
                outlined
              />
            </v-col>
            <v-col cols="4">
              <v-text-field
                v-model="patient.age"
                label="Age/Status"
                dense
                readonly
                hide-details
                outlined
              />
            </v-col>
            <v-col cols="8">
              <v-text-field
                v-model="patient.address"
                label="Address"
                dense
                readonly
                hide-details
                outlined
              />
            </v-col>
            <v-col cols="4">
              <v-text-field
                v-model="patient.date"
                label="Date"
                dense
                readonly
                hide-details
                outlined
              />
            </v-col>
          </v-row>

          <!-- RX Section -->
          <v-row>
            <v-col cols="12" class="d-flex">
              <div class="display-1 font-weight-bold mr-4">℞</div>

              <vue-editor
                v-if="action == 'Update' || action == 'Add'"
                style="width: 100%;"
                v-model="prescription"
                :editorToolbar="customToolbar"
                class="mb-10"
              ></vue-editor>
              <v-textarea
                v-else
                outlined
                readonly
                name="input-7-4"
                label="Outlined textarea"
                value="The Woodman set to work at once, and so sharp was his axe that the tree was soon chopped nearly through."
              ></v-textarea>
            </v-col>
          </v-row>

          <!-- Footer -->
          <v-row class="mt-6">
            <v-col cols="8">
              <!-- <v-text-field
                  v-model="nextVisit"
                  label="Your Next Visit is on:"
                  dense
                  hide-details
                  outlined
                /> -->
              <div class="text-caption">
                Your Next Visit is on:__________________
              </div>
            </v-col>
            <v-col cols="4" class="text-right">
              <div class="text-caption">
                License No: ______________
              </div>
              <div class="text-caption">
                PTR No: _____________
              </div>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>

        <v-card-actions class="pa-5">
          <v-spacer></v-spacer>
          <v-btn
            color="red"
            outlined
            @click="
              prescriptionDialog = false;
              resetForm();
            "
          >
            <v-icon>mdi-close-circle-outline</v-icon>
            Cancel
          </v-btn>
          <v-btn
            :color="$vuetify.theme.themes.light.submitBtns"
            class="white--text"
            @click="action == 'Add' ? accept() : update()"
          >
            <v-icon>mdi-check-circle</v-icon>
            {{ action == "Add" ? "Save" : "Update" }}
          </v-btn>
        </v-card-actions>
      </v-card>
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
    VueEditor,
  },
  props: {
    data: null,
  },
  data() {
    return {
      patient: {
        name: "",
        age: "",
        address: "",
        date: new Date().toLocaleDateString(),
      },
      nextVisit: "",
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
      prescription: null,
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
      loading: false,
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
          value: "doctor_name",
          align: "start",
          valign: "start",
          sortable: false,
        },
        {
          text: "Date",
          value: "date",
          align: "center",
          valign: "center",
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
        this.id = data.id;
        this.patient.name = data.name;
        this.patient.age = data.age + "/" + data.civil_status;
        this.patient.address = data.address;
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
      this.assignedModuleID = this.$store.state.user.user.assignedModuleID;
      let userID = this.$store.state.user.id;
      this.getAllPatientPrecription();
      console.log(userID);
      // alert(this.assignedModuleID);
    },

    getAllPatientPrecription() {
      this.loading = true;
      this.axiosCall(
        "/patient/getAllPatientPrecription/" + this.data.id,
        "GET"
      ).then((res) => {
        if (res) {
          this.dataItem = res.data;
        }
        this.loading = false;
      });
    },

    closeD() {
      this.eventHub.$emit("closePrescrioptionDialog", false);
      this.dialog = false;
    },

    accept() {
      if (this.prescription == null) {
        this.fadeAwayMessage.show = true;
        this.fadeAwayMessage.type = "error";
        this.fadeAwayMessage.header =
          "Please add prescription before save, thank you.";
      } else {
        let userID = this.$store.state.user.id;
        let data = {
          patientID: this.data.id,
          doctorID: Number(userID),
          description: this.prescription,
          age: this.patient.age,
          date: this.patient.date,
          name: this.patient.name,
          address: this.patient.address,
        };
        console.log("love", data);

        this.axiosCall("/patient/addPrescription", "POST", data).then((res) => {
          if (res.data.status == 200) {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "success";
            this.fadeAwayMessage.header = "Successfully Updated";
            this.prescriptionDialog = false;
            this.initialize();
          } else {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = res.data.msg;
          }
        });
      }
    },
    update() {
      if (this.prescription == null) {
        this.fadeAwayMessage.show = true;
        this.fadeAwayMessage.type = "error";
        this.fadeAwayMessage.header =
          "Please add prescription before save, thank you.";
      } else {
        let userID = this.$store.state.user.id;
        let data = {
          patientID: this.data.id,
          doctorID: Number(userID),
          description: this.prescription,
          age: this.patient.age,
          date: this.patient.date,
          name: this.patient.name,
          address: this.patient.address,
        };
        console.log("love", data);
        this.axiosCall("/patient/" + this.updateID, "PATCH", data).then(
          (res) => {
            if (res.data.status == 201) {
              // alert("updated");
              this.initialize();
              this.updateID = null;
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = "success";
              this.fadeAwayMessage.header = "System Message";
              this.fadeAwayMessage.message = res.data.msg;

              this.prescriptionDialog = false;
            } else {
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = "error";
              this.fadeAwayMessage.header = "System Message";
              this.fadeAwayMessage.message = res.data.msg;
            }
          }
        );
      }
    },
    resetForm() {
      this.patient.date = new Date().toLocaleDateString();
      this.prescription = null;
    },

    addPrescription() {
      this.action = "Add";
      this.prescriptionDialog = true;
    },
    view(item) {
      let userID = this.$store.state.user.id;
      if (userID == item.doctorID) {
        this.action = "Update";
      } else {
        this.action = "View";
      }
      // alert(this.action);
      this.updateID = item.id;
      this.patient.name = item.name;
      this.patient.address = item.address;
      this.patient.date = item.date;
      this.patient.age = item.age;
      this.prescription = item.description;
      this.prescriptionDialog = true;
    },

    print(item) {
      console.log(item);
      const url =
        process.env.VUE_APP_SERVER + "/pdf-generator/prescription/" + item.id;
      window.open(url);
    },
  },
};
</script>
