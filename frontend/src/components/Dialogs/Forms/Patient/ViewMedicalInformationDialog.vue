<template>
  <div>
    <v-dialog v-model="dialog" eager persistent scrollable max-width="1000px">
      <v-card>
        <v-card-title dark class="dialog-header pt-5 pb-5 pl-6">
          <span>Medical Information</span>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="closeD()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text style="max-height: 700px" class="my-4">
          <v-card>
            <v-row>
              <v-col cols="" class="flex-items ">
                <!-- <v-btn
                  @click="AddFunction()"
                  class="white--text rounded-lg"
                  color="blue"
                  v-if="userRoleID == 3"
                >
                  Add
                </v-btn> -->
              </v-col>
              <v-spacer></v-spacer>
              <v-col cols="2" class="d-flex justify-end mt-2 mr-2">
                <v-btn
                  @click="AddFunction()"
                  class="white--text rounded-lg"
                  color="blue"
                  v-if="userRoleID == 3"
                >
                  Add
                </v-btn>
              </v-col>
              <v-col cols="12" class=" pt-2 px-4">
                <v-data-table
                  :headers="userRoleID == 3 ? headers : headers1"
                  :items="dataItem"
                  :items-per-page="10"
                >
                  <template v-slot:[`item.index`]="{ index }">
                    {{ index + 1 }}.
                  </template>
                  <template v-slot:[`item.pregnant`]="{ item }">
                    {{
                      item.pregnant != "0"
                        ? " PREGNANCY MEDICATION"
                        : "NORMAL/USUAL MEDICATION"
                    }}.
                  </template>

                  <template v-slot:[`item.finding`]="{ item }">
                    <div v-html="item.finding"></div>
                  </template>

                  <template v-slot:[`item.treatment`]="{ item }">
                    <div v-html="item.treatment"></div>
                  </template>

                  <template v-slot:[`item.action`]="{ item }">
                    <v-btn
                      x-small
                      class="mt-1"
                      @click="view(item)"
                      outlined
                      color="green"
                      >View</v-btn
                    >
                    <v-btn
                      x-small
                      class="mt-1 mx-2"
                      @click="print(item)"
                      outlined
                      color="blue"
                      >Print</v-btn
                    >
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
      options: {},
      strategicData: null,
      action: null,
      desc: null,
      itemToDelete: null,
      confirmDialog: false,
      fadeAwayMessage: {
        show: false,
        type: "success",
        header: "Successfully Added!",
        message: "",
        top: 10,
      },

      dialog: false,
      loading: false,
      userRoleID: null,

      medicalData: null,
      id: null,
      isButtonLoading: false,
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
          text: "Medication",
          value: "pregnant",
          align: "start",
          valign: "start",
          sortable: false,
        },

        {
          text: "Finding",
          value: "finding",
          align: "start",
          valign: "center",
          sortable: false,
        },

        {
          text: "Treatment",
          value: "treatment",
          align: "start",
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

      headers1: [
        {
          text: "No.",
          value: "index",
          align: "start",
          valign: "start",
          width: 50,
          sortable: false,
        },
        {
          text: "Pregnant",
          value: "pregnant",
          align: "start",
          valign: "start",
          sortable: false,
        },

        {
          text: "Finding",
          value: "finding",
          align: "start",
          valign: "center",
          sortable: false,
        },

        {
          text: "Treatment",
          value: "treatment",
          align: "start",
          valign: "center",
          sortable: false,
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
      // this.dataItem = [{ pregnant: "0" }];
      this.getAllPatientMedicalInfo();
      this.userRoleID = this.$store.state.user.user.user_roleID;
    },
    getAllPatientMedicalInfo() {
      this.loading = true;
      this.axiosCall(
        "/medical-info/patientMedicalInfo/" + this.data.id,
        "GET"
      ).then((res) => {
        if (res) {
          // console.log("Get Data", res.data);
          this.dataItem = res.data;
        } else {
          this.dataItem = null;
        }
        this.loading = false;
      });
    },
    closeD() {
      this.eventHub.$emit("closeViewMedicalInformationDialog", false);
      this.dialog = false;
    },

    edit(item) {
      // console.log(item);
      this.medicalData = item;
      this.action = "Update";
    },
    view(item) {
      // console.log(item);
      this.medicalData = item;
      this.action = "View";
    },

    AddFunction() {
      this.medicalData = { id: null, data: this.data };
      this.action = "Add";
    },

    print(item) {
      console.log(item);
      const url =
        process.env.VUE_APP_SERVER +
        "/pdf-generator/patientMedicalRecord/" +
        item.id;
      window.open(url);
    },
  },
};
</script>
<style scoped></style>
