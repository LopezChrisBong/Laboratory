<template>
  <div>
    <v-dialog v-model="dialog" eager persistent scrollable max-width="1000px">
      <v-card>
        <v-card-title dark class="dialog-header pt-5 pb-5 pl-6">
          <span>Patient Examination Data Table</span>
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
                <!-- <v-btn
                  @click="AddFunction()"
                  class="white--text rounded-lg"
                  color="blue"
                >
                  Add
                </v-btn> -->
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
                      :color="item.status == 0 ? 'orange' : 'blue'"
                      dark
                      small
                    >
                      <span>{{
                        item.status == 0 ? "Pending" : "Done Examination"
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

    <v-dialog v-model="laboratoryDialog" fullscreen>
      <v-card>
        <v-card-title>Laboratory Result</v-card-title>
        <v-card-text>
          <v-simple-table dense class="text-caption">
            <thead>
              <tr>
                <th class="text-left">Test</th>
                <th class="text-left">Result</th>
                <th class="text-center" colspan="2">Reference Range (Male)</th>
                <th class="text-center" colspan="2">
                  Reference Range (Female)
                </th>
                <th class="text-left">Unit</th>
                <th class="text-left">Remarks</th>
              </tr>
              <tr>
                <th></th>
                <th></th>
                <th>Lower</th>
                <th>Upper</th>
                <th>Lower</th>
                <th>Upper</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in service" :key="index">
                <td>{{ item.service_description }}</td>

                <!-- Input field for result -->
                <td>
                  <v-text-field
                    v-model="input[index]"
                    dense
                    hide-details
                    :readonly="action == 'View' ? true : false"
                    outlined
                    class="ma-0 pa-0"
                    style="max-width: 100px"
                  />
                </td>

                <!-- Static reference values (replace with dynamic data if available) -->
                <td>{{ item.male_lower || "-" }} 33</td>
                <td>{{ item.male_upper || "-" }} 33</td>
                <td>{{ item.female_lower || "-" }} 33</td>
                <td>{{ item.female_upper || "-" }} 33</td>
                <td>{{ item.unit || "-" }}</td>
                <td>
                  <v-text-field
                    dense
                    hide-details
                    :readonly="action == 'View' ? true : false"
                    outlined
                    class="ma-0 pa-0"
                    style="max-width: 150px"
                  ></v-text-field>
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn text @click="laboratoryDialog = false">Close</v-btn>
          <v-btn text @click="submitResult()" v-if="action == 'Update'"
            >Submit</v-btn
          >
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
export default {
  components: {
    MedicalInformation: () => import("./MedicalInformation.vue"),
    // viewStrategicOutcome: () => import("./ViewStrategicOutcome.vue"),
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
      newPackageData: {},
      service: [],
      desc: null,
      itemToDelete: null,
      confirmDialog: false,
      laboratoryDialog: false,
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
          text: "Liscence No.",
          value: "liscence_no",
          align: "start",
          valign: "start",
          sortable: false,
        },
        {
          text: "Medtech",
          value: "Med_name",
          align: "start",
          valign: "start",
          sortable: false,
        },
        {
          text: "Status",
          value: "status",
          align: "center",
          valign: "center",
          sortable: false,
        },

        {
          text: "Action",
          value: "action",
          align: "center",
          valign: "center",
          width: 90,
        },
      ],
    };
  },

  watch: {
    data: {
      handler(data) {
        this.dialog = true;
        // console.log("STRAT", data);
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
      // console.log(userID);
      // alert(this.assignedModuleID);
      if (this.assignedModuleID == 2) {
        this.axiosCall(
          "/appointment/getAssignedBookedAppointment/Medtech/" +
            userID +
            "/" +
            this.data.id,
          "GET"
        ).then((res) => {
          if (res) {
            // console.log(res.data);
            this.dataItem = res.data;
            this.loading = false;
          }
        });
      } else if (this.assignedModuleID == 5) {
        this.axiosCall(
          "/appointment/getAssignedBookedAppointment/Doctor/" +
            userID +
            "/" +
            this.data.id,
          "GET"
        ).then((res) => {
          if (res) {
            // console.log(res.data);
            this.dataItem = res.data;
            this.loading = false;
          }
        });
      }
    },
    submitResult() {
      // console.log(this.input, this.input1, this.updateID);
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
          this.laboratoryDialog = false;
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "success";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = res.data.msg;
        } else if (res.data.status == 400) {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = res.data.msg;
        }
      });
    },

    closeD() {
      this.eventHub.$emit("closeExamineDataDialog", false);
      this.dialog = false;
    },

    edit(item) {
      this.action = "Update";
      this.updateID = item.id;
      // console.log(item);
      this.axiosCall(
        "/services/getAllServiceToUpdateResult/" + item.id,
        "GET"
      ).then((res) => {
        if (res) {
          // console.log(res.data);
          this.service = res.data;
        }
      });
      this.laboratoryDialog = true;
    },
    view(item) {
      // console.log(item);
      this.action = "View";
      this.updateID = item.id;
      // console.log(item);
      this.axiosCall(
        "/services/getAllServiceToUpdateResult/" + item.id,
        "GET"
      ).then((res) => {
        if (res) {
          // console.log(res.data);
          this.service = res.data;
        }
      });
      this.laboratoryDialog = true;
    },

    editMedicalInfo(item) {
      // alert(this.data.id);
      // console.log(item);
      this.medicalData = { id: null, userIDd: this.data.id, data: item };
      this.action = "Add";
    },
  },
};
</script>
<style scoped></style>
