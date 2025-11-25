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
                          ? "Pending"
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
                      {{ !item.attachment ? "Upload" : "View" }}</v-btn
                    >
                    <v-btn
                      v-if="assignedModuleID == 5 && item.attachment"
                      x-small
                      class="mt-1"
                      @click="edit(item)"
                      outlined
                      color="green"
                      block
                      ><v-icon small> mdi-eye</v-icon>View</v-btn
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

    <v-dialog
      v-model="laboratoryDialog"
      :max-width="currentFileUrl ? '1000px' : '600px'"
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
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text>
          <!-- File Picker -->
          <v-file-input
            v-if="!currentFileUrl"
            v-model="selectedFile"
            label="Choose attachment"
            outlined
            dense
            accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx"
            prepend-icon="mdi-paperclip"
          ></v-file-input>

          <!-- Preview existing file -->
          <div v-if="currentFileUrl" class="mt-4">
            <strong>Uploaded File:</strong>
            <a
              :href="currentFileUrlDownload"
              download
              style="border: 1px solid black; padding: 3px 5px; display: inline-block; cursor: pointer; border-radius: 20px; margin-left: 1rem; margin-bottom: 1rem;"
            >
              Download
            </a>
            <br />
            <!-- <a :href="currentFileUrl" target="_blank">{{ currentFileName }}</a> -->
            <!-- <iframe
              v-if="currentFileUrl"
              width="100%"
              height="600"
              :src="currentFileUrl"
              title="LIS Reports"
            ></iframe> -->
            <iframe
              v-if="currentFileUrl"
              width="100%"
              height="600"
              src="https://docs.google.com/spreadsheets/d/1Yb3lOvrlONVzwG8OH7Wp_P4NbPXqIAABTAr9doKeQww/edit?usp=sharing"
              title="LIS Reports"
            ></iframe>

            {{ currentFileUrl }}
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
      currentFileUrlDownload: null,
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
      selectedFile: null, // new file selected
      currentFileUrl: null, // existing file URL from server
      currentFileName: null, // existing file name
      loading: false,
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
          const ext = attachment
            .split(".")
            .pop()
            .toLowerCase();

          // File types that need Office Viewer (cannot be viewed by browser)
          const officeExt = ["xls", "xlsx", "doc", "docx", "ppt", "pptx"];

          if (officeExt.includes(ext)) {
            // Wrap URL with Office viewer
            this.currentFileUrl =
              "https://view.officeapps.live.com/op/embed.aspx?src=" +
              encodeURIComponent(baseUrl);
          } else {
            // Normal files (pdf/images/videos) can load directly
            this.currentFileUrl = baseUrl;
          }

          this.currentFileName = attachment;
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
        this.closeD();
      } catch (err) {
        console.error("Upload failed:", err);
        this.$emit("notify", "Upload failed.");
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
<style scoped></style>
