<template>
  <div>
    <v-dialog v-model="dialog" eager persistent scrollable max-width="1000px">
      <v-card>
        <v-card-title dark class="dialog-header pt-5 pb-5 pl-6">
          <span>Medical Certificate of {{ data && data.name }}</span>
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
                <v-col cols="12" class="pt-2 px-4">
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
                        <v-icon small>mdi-prescription</v-icon>
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
          <v-btn color="red" outlined @click="cancelDelete()"> Close </v-btn>
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
      v-model="medicalCertificateDialog"
      eager
      scrollable
      max-width="600px"
      persistent
    >
      <v-card>
        <v-card-title dark class="dialog-header pt-5 pb-5 pl-6">
          <span>{{ action }} Diagnosis and Recommendation</span>
          <v-spacer></v-spacer>
          <v-btn
            icon
            dark
            @click="
              medicalCertificateDialog = false;
              resetForm();
            "
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text style="max-height: 700px" class="my-4">
          <!-- Patient Info -->
          <v-row class="mt-2">
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
            <v-col cols="12" class="">
              <div style="">DIAGNOSIS:</div>
              <vue-editor
                :disabled="action != 'Add'"
                style="width: 100%; height: 100px"
                v-model="diagnosis"
                :editorToolbar="customToolbar"
                class="mb-10"
              ></vue-editor>
            </v-col>
            <v-col cols="12" class="">
              <div style="">RECOMMENDATION:</div>
              <vue-editor
                :disabled="action != 'Add'"
                style="width: 100%; height: 100px"
                v-model="recommendation"
                :editorToolbar="customToolbar"
                class="mb-10"
              ></vue-editor>
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
              medicalCertificateDialog = false;
              resetForm();
            "
          >
            <v-icon>mdi-close-circle-outline</v-icon>
            Cancel
          </v-btn>
          <v-btn
            v-if="action == 'Add'"
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
      updateID: null,
      options: {},
      action: null,
      diagnosis: null,
      recommendation: null,
      customToolbar: [
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
      ],
      itemToDelete: null,
      confirmDialog: false,
      medicalCertificateDialog: false,
      fadeAwayMessage: {
        show: false,
        type: "success",
        header: "Successfully Added!",
        message: "",
        top: 10,
      },
      dialog: false,
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
    this.initialize();
  },

  methods: {
    initialize() {
      this.assignedModuleID = this.$store.state.user.user.assignedModuleID;
      let userID = this.$store.state.user.id;
      this.getAllPatientPrecription();
      console.log(userID);
    },

    getAllPatientPrecription() {
      this.loading = true;
      if (this.data) {
        this.axiosCall(
          "/medical-info/patientMedicalCertificate/" + this.data.patientID,
          "GET"
        ).then((res) => {
          if (res) {
            this.dataItem = res.data;
          }
          this.loading = false;
        });
      }
    },

    closeD() {
      this.eventHub.$emit("closeMedCertificateDialog", false);
      this.dialog = false;
    },

    accept() {
      if (
        this.diagnosis == null ||
        this.recommendation == null ||
        this.diagnosis == "" ||
        this.recommendation == ""
      ) {
        this.fadeAwayMessage.show = true;
        this.fadeAwayMessage.type = "error";
        this.fadeAwayMessage.header = "System message!";
        this.fadeAwayMessage.message =
          "Please fill all required field before saving, thank you.";
      } else {
        let userID = this.$store.state.user.id;
        let data = {
          patientID: this.data.patientID,
          doctorID: Number(userID),
          date: this.patient.date,
          diagnosis: this.diagnosis,
          recommendations: this.recommendation,
        };
        // console.log("love", data);

        this.axiosCall(
          "/medical-info/addMedicalCertificate",
          "POST",
          data
        ).then((res) => {
          if (res.data.status == 200) {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "success";
            this.fadeAwayMessage.header = "Successfully Updated";
            this.medicalCertificateDialog = false;
            this.initialize();
          } else {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = res.data.msg;
          }
        });
      }
    },

    resetForm() {
      this.patient.date = new Date().toLocaleDateString();
      this.patient.name = null;
      this.diagnosis = null;
      this.recommendation = null;
    },

    addPrescription() {
      this.action = "Add";
      this.medicalCertificateDialog = true;
    },
    view(item) {
      let userID = this.$store.state.user.id;
      if (userID == item.doctorID) {
        this.action = "Update";
      } else {
        this.action = "View";
      }
      this.updateID = item.id;
      this.patient.name = item.name;
      this.diagnosis = item.diagnosis;
      this.recommendation = item.recommendations;
      this.patient.date = item.date;
      this.medicalCertificateDialog = true;
    },
    print(item) {
      console.log(item);
      const url =
        process.env.VUE_APP_SERVER +
        "/pdf-generator/medicalCertificate/" +
        item.id;
      window.open(url);
    },
  },
};
</script>
