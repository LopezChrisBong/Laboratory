<template>
  <div>
    <v-dialog
      v-model="dialog"
      eager
      persistent
      scrollable
      max-width="1000px"
      fullscreen
    >
      <v-card>
        <v-card-title dark class="dialog-header pt-5 pb-5 pl-6">
          <span>Patient Examination Data Table of {{ data && data.name }}</span>
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
              <v-col cols="12" class="pt-2 px-4">
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
                  <template v-slot:[`item.services`]="{ item }">
                    <div>
                      <v-chip
                        v-for="element in item.services_availed"
                        :key="element.id"
                      >
                        {{ element.service_description }}
                      </v-chip>
                    </div>
                  </template>

                  <template v-slot:[`item.packages`]="{ item }">
                    <v-chip
                      v-for="element in item.packages_availed"
                      :key="element.id"
                    >
                      {{ element.description }}
                    </v-chip>
                  </template>
                  <template v-slot:[`item.status`]="{ item }">
                    <v-chip
                      :color="
                        item.status == 0
                          ? 'orange'
                          : item.status == 1
                          ? 'green'
                          : 'blue'
                      "
                      dark
                      small
                    >
                      <span>{{
                        item.status == 0
                          ? "For Payment"
                          : item.status == 1
                          ? "Paid"
                          : "Done Examination"
                      }}</span>
                    </v-chip>
                  </template>
                  <template v-slot:[`item.action`]="{ item }">
                    <v-btn
                      v-if="assignedModuleID == 2"
                      x-small
                      class="mt-1"
                      @click="edit(item)"
                      outlined
                      color="blue"
                      block
                    >
                      <v-icon small
                        >{{ !item.attachment ? "mdi-pencil" : "mdi-eye" }}
                      </v-icon>
                      {{
                        !item.attachment
                          ? "Upload Lab Reult"
                          : "View Lab Result"
                      }}</v-btn
                    >
                    <!-- <v-btn
                      v-if="assignedModuleID == 2"
                      x-small
                      class="mt-1"
                      @click="availed(item)"
                      outlined
                      color="green"
                      block
                      ><v-icon small> mdi-eye</v-icon>Availed Laboratory</v-btn
                    > -->
                    <v-btn
                      v-if="assignedModuleID == 5 && item.attachment"
                      x-small
                      class="mt-1"
                      @click="edit(item)"
                      outlined
                      color="green"
                      block
                      ><v-icon small> mdi-eye</v-icon>View Lab Result</v-btn
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
    <v-dialog v-model="laboratoryAvailedDialog" max-width="800" persistent>
      <v-card>
        <v-card-title>Services</v-card-title>
        <v-card-text>
          <div>
            <v-row>
              <v-col cols="12" md="6" class="pa-0">
                <v-tabs v-model="activeTab" color="#2196F3" align-tabs="left">
                  <v-tab
                    v-for="tab in tabList"
                    :key="tab.id"
                    @change="changeTab(tab)"
                    >{{ tab.name }}</v-tab
                  >
                </v-tabs>
              </v-col>
              <!--Laboratory Services Area-->
              <v-col cols="12" v-if="tab == 1">
                <v-row>
                  <v-col
                    cols="12"
                    :md="item.data.length <= 0 ? 3 : 12"
                    sm="12"
                    v-for="item in dataServices"
                    :key="item.id"
                    class="my-1 mx-1"
                    style="border: 1px solid black; border-radius: 10px"
                  >
                    <div
                      v-if="item.data.length <= 0"
                      class="d-flex justify-center align-center"
                    >
                      <div>
                        <v-checkbox
                          v-model="selected"
                          :readonly="action != 'Pay' ? true : false"
                          :label="item.description"
                          :value="item.id"
                        ></v-checkbox>
                      </div>
                      <div class="mx-2">&#8369;{{ item.price }}</div>
                    </div>
                    <div v-if="item.data.length > 0" class="">
                      <strong> {{ item.description }}</strong>
                      <v-row>
                        <v-col
                          cols="3"
                          v-for="items in item.data"
                          :key="items.id"
                        >
                          <div class="d-flex justify-center align-center">
                            <div>
                              <v-checkbox
                                v-model="selected"
                                :label="items.description"
                                :value="items.id"
                                :readonly="action != 'Pay' ? true : false"
                              ></v-checkbox>
                            </div>
                            <div class="mx-2">&#8369;{{ items.price }}</div>
                          </div>
                        </v-col>
                      </v-row>
                    </div>
                  </v-col>
                </v-row>
              </v-col>
              <!-- :rules="[(v) => !!v || 'Service is required']" -->
              <!--Imaging Services Area-->

              <v-col cols="12" v-if="tab == 2">
                <v-row>
                  <v-col
                    cols="12"
                    :md="item.data.length <= 0 ? 3 : 12"
                    sm="12"
                    v-for="item in dataServices"
                    :key="item.id"
                    class="my-1 mx-1"
                    style="border: 1px solid black; border-radius: 10px"
                  >
                    <div
                      v-if="item.data.length <= 0"
                      class="d-flex justify-center align-center"
                    >
                      <div>
                        <v-checkbox
                          v-model="selected"
                          :label="item.description"
                          :value="item.id"
                          :readonly="action != 'Pay' ? true : false"
                        ></v-checkbox>
                      </div>
                      <div class="mx-2">&#8369;{{ item.price }}</div>
                    </div>
                    <div v-if="item.data.length > 0" class="">
                      <strong>{{ item.description }}</strong>
                      <v-row>
                        <v-col
                          cols="3"
                          v-for="items in item.data"
                          :key="items.id"
                        >
                          <div class="d-flex justify-center align-center">
                            <div>
                              <v-checkbox
                                v-model="selected"
                                :label="items.description"
                                :value="items.id"
                                :readonly="action != 'Pay' ? true : false"
                              ></v-checkbox>
                            </div>
                            <div class="mx-2">&#8369;{{ items.price }}</div>
                          </div>
                        </v-col>
                      </v-row>
                    </div>
                  </v-col>
                </v-row>
              </v-col>

              <!--Package Services Area-->

              <v-col cols="12" v-if="tab == 3">
                <v-row>
                  <v-col
                    cols="12"
                    md="6"
                    sm="12"
                    v-for="item in dataPackages"
                    :key="item.id"
                    style="border: 1px solid black; border-radius: 10px"
                  >
                    <div class="d-flex justify-center align-center">
                      <div>
                        <v-checkbox
                          v-model="selectedPackage"
                          :label="item.description"
                          :value="item.id"
                          :readonly="action != 'Pay' ? true : false"
                        ></v-checkbox>
                      </div>
                      <div class="mx-2">&#8369;{{ item.price }}</div>
                      <br />
                    </div>
                    <div class="mb-2">
                      <strong style="font-size: 14px">List of Service:</strong>
                    </div>
                    <v-row>
                      <v-col
                        cols="4"
                        class="pa-2"
                        v-for="items in JSON.parse(item.assign_mods)"
                        :key="items.id"
                      >
                        <span style="font-size: 20px">
                          <strong>&#x2022;</strong></span
                        >
                        <v-chip
                          small
                          class="pa-2"
                          color="blue"
                          text-color="white"
                        >
                          {{ items.service_description }}
                        </v-chip>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="laboratoryAvailedDialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="laboratoryDialog"
      :fullscreen="currentFileUrl ? true : false"
      :max-width="currentFileUrl ? '2000px' : '600px'"
    >
      <v-card outlined class="pa-4">
        <v-card-title>
          {{ !currentFileUrl ? "Upload" : "View" }} Attachment

          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            @click="submitFile"
            :loading="loading"
            small
            v-if="!currentFileUrl"
          >
            Save
          </v-btn>
          <v-btn
            color="red"
            class="white--text"
            @click="
              laboratoryDialog = false;
              currentFileUrl = null;
            "
            small
            v-if="currentFileUrl"
          >
            close
          </v-btn>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text>
          <!-- File Picker -->
          <!-- <v-file-input
            v-if="!currentFileUrl"
            v-model="selectedFile"
            label="Choose attachment"
            outlined
            dense
            accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx"
            prepend-icon="mdi-paperclip"
          ></v-file-input> -->
          <v-file-input
            v-if="!currentFileUrl"
            :key="fileInputKey"
            v-model="selectedFile"
            label="Choose attachment"
            outlined
            dense
            accept=".pdf"
            prepend-icon="mdi-paperclip"
            @change="selectedFileChange"
          />

          <!-- Preview existing file -->
          <div v-if="currentFileUrl" class="mt-4">
            <strong>Uploaded File:</strong>
            <a
              v-if="booleanPDF == 0"
              :href="currentFileUrlDownload"
              download
              style="
                border: 1px solid black;
                padding: 3px 5px;
                display: inline-block;
                cursor: pointer;
                border-radius: 20px;
                margin-left: 1rem;
                margin-bottom: 1rem;
              "
            >
              Download
            </a>
            <br />
            <!-- <a :href="currentFileUrl" target="_blank">{{ currentFileName }}</a> -->
            <iframe
              v-if="booleanPDF == 1"
              width="100%"
              height="600"
              :src="currentFileUrlDownload"
              title="LIS Reports"
            ></iframe>
            <!-- <iframe
              v-if="booleanPDF == 0"
              width="100%"
              height="600"
              :src="currentFileUrl"
              title="LIS Reports"
            ></iframe> -->
            <iframe
              v-if="booleanPDF == 0"
              width="100%"
              height="600"
              src="https://docs.google.com/spreadsheets/d/1Yb3lOvrlONVzwG8OH7Wp_P4NbPXqIAABTAr9doKeQww/edit?usp=sharing"
              title="LIS Reports"
            ></iframe>
          </div>
        </v-card-text>
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
export default {
  components: {},
  props: {
    data: null,
  },
  data() {
    return {
      dataPackages: [],
      activeTab: { id: 1, name: "Laboratory" },
      tab: 1,
      tabList: [
        { id: 1, name: "Laboratory" },
        { id: 2, name: "Imaging" },
        { id: 3, name: "Packages" },
      ],
      updateID: null,
      action: null,
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
      booleanPDF: 0,
      currentFileUrlDownload: null,
      medicalData: null,
      id: null,
      isButtonLoading: false,
      assignedModuleID: null,
      oldSelected: [],
      selected: [],
      oldSelectedPackage: [],
      selectedPackage: [],
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
        // {
        //   text: "Liscence No.",
        //   value: "liscence_no",
        //   align: "start",
        //   valign: "start",
        //   sortable: false,
        // },
        {
          text: "Laboratory Request",
          value: "services",
          align: "center",
          valign: "start",
          sortable: false,
        },
        {
          text: "Packages Availed",
          value: "packages",
          align: "center",
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
      fileInputKey: 0,
      selectedFile: null,
      currentFileUrl: null,
      currentFileName: null,
      loading: false,
      dataServices: [],
      laboratoryAvailedDialog: false,
    };
  },
  // created() {
  //   this.loadExistingFile();
  // },
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
  mounted() {},
  computed: {
    filteredServices() {
      return (item) => {
        if (!item?.services_availed) return [];

        const seen = new Set();

        return item.services_availed
          .filter((s) => s.service_description)
          .filter((s) => {
            if (seen.has(s.service_description)) return false;
            seen.add(s.service_description);
            return true;
          });
      };
    },

    filteredPackages() {
      return (item) => {
        if (!item?.packages_availed) return [];

        const seen = new Set();

        return item.packages_availed
          .filter((p) => p.description)
          .filter((p) => {
            if (seen.has(p.description)) return false;
            seen.add(p.description);
            return true;
          });
      };
    },
  },

  methods: {
    selectedFileChange(file) {
      if (!file) return;

      if (file.type !== "application/pdf") {
        alert("Invalid file. Please upload a PDF.");

        this.selectedFile = null;

        this.fileInputKey++;

        return;
      }

      console.log("Valid PDF!");
    },
    initialize() {
      this.loading = true;
      this.assignedModuleID = this.$store.state.user.user.assignedModuleID;
      let userID = this.$store.state.user.id;
      this.getAllServices();
      this.getAllPackages();
      if (this.assignedModuleID == 2) {
        this.axiosCall(
          "/appointment/getAssignedBookedAppointment/Medtech/" +
            userID +
            "/" +
            this.data.patientID,
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
            this.data.patientID,
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
    getAllServices() {
      this.axiosCall(
        "/services/getAllServicesForBooking/" + this.tab,
        "GET"
      ).then((res) => {
        if (res) {
          this.dataServices = res.data;
          // console.log("LOVED", res.data);
        }
      });
    },
    getAllPackages() {
      this.axiosCall("/services", "GET").then((res) => {
        if (res) {
          // console.log("Pakes", res.data);
          this.dataPackages = res.data;
        }
      });
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
      this.laboratoryDialog = false;
      // this.data = null;
      // this.currentFileName = null;
      // this.currentFileUrl = null;
    },
    edit(item) {
      this.action = "Update";
      this.updateID = item.id;
      this.loadExistingFile(item.attachment);
      this.laboratoryDialog = true;
    },
    availed(item) {
      console.log(item);
      this.selected = JSON.parse(item.sa_service_list);
      this.selectedPackage = JSON.parse(item.sa_package_list);
      this.laboratoryAvailedDialog = true;
    },
    // view(item) {
    //   // console.log(item);
    //   this.action = "View";
    //   this.updateID = item.id;
    //   this.loadExistingFile(item.attachment);
    //   this.laboratoryDialog = true;
    // },
    async loadExistingFile(attachment) {
      try {
        if (attachment) {
          this.getFileDownload(attachment);

          const baseUrl =
            process.env.VUE_APP_SERVER +
            "/appointment/view/attachment/" +
            attachment;

          const ext = attachment.split(".").pop().toLowerCase();
          const officeExt = ["xls", "xlsx", "doc", "docx", "ppt", "pptx"];
          if (officeExt.includes(ext)) {
            this.currentFileUrl =
              "https://view.officeapps.live.com/op/embed.aspx?src=" +
              encodeURIComponent(baseUrl);
          } else {
            this.currentFileUrl = baseUrl;
          }

          this.currentFileName = attachment;
          const isPdf = attachment.toLowerCase().endsWith(".pdf");
          this.booleanPDF = isPdf ? 1 : 0;
        }
      } catch (err) {
        console.error("Error fetching file:", err);
      }
    },
    async getFileDownload(attachment) {
      try {
        if (attachment) {
          this.currentFileUrlDownload =
            process.env.VUE_APP_SERVER +
            "/appointment/view/attachment/" +
            attachment;
        }
      } catch (err) {
        console.error("Error fetching file:", err);
      }
    },

    async submitFile() {
      if (!this.selectedFile) {
        this.$emit("notify", "Please select a file.");
        return;
      }
      let userID = this.$store.state.user.id;
      let data = {
        patientID: this.data.id,
        medtechID: userID,
        updateID: this.updateID,
      };
      console.log(data);
      const formData = new FormData();
      formData.append("file", this.selectedFile);
      formData.append("body", JSON.stringify(data));

      try {
        this.loading = true;
        let res = await this.axiosCall(
          "/appointment/upload",
          "POST",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        this.$emit("notify", "File uploaded successfully!");
        this.currentFileUrl =
          process.env.VUE_APP_SERVER +
          "/appointment/view/attachment/" +
          res.data.filePath;
        this.currentFileName = res.data.originalName;
        this.selectedFile = null;
        this.initialize();
        this.laboratoryDialog = false;
        this.fadeAwayMessage.show = true;
        this.fadeAwayMessage.type = "success";
        this.fadeAwayMessage.header = "System Message";
        this.fadeAwayMessage.message = "Submitted successfully!";
        this.closeD();
      } catch (err) {
        console.error("Upload failed:", err);
        this.$emit("notify", "Upload failed.");
      } finally {
        this.loading = false;
      }
    },
    changeTab(tab) {
      this.activeTab = tab;
      this.tab = tab.id;
      this.getAllServices();
      this.getAllPackages();
    },
  },
};
</script>
<style scoped></style>
