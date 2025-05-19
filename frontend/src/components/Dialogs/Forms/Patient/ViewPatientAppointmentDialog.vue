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
          <span>Apointment</span>
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
                  @click="AddAppointment()"
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
                    {{ index + 1 }}.
                  </template>
                  <template v-slot:[`item.date`]="{ item }">
                    {{ formatDate(item.date) }}
                  </template>
                  <template v-slot:[`item.status`]="{ item }">
                    {{ item.status == 0 ? "Pending" : "Done" }}
                  </template>
                  <template v-slot:[`item.action`]="{ item }">
                    <v-btn
                      x-small
                      class="mt-1"
                      @click="view(item)"
                      outlined
                      color="green"
                      block
                      >View</v-btn
                    >
                    <v-btn
                      x-small
                      class="mt-1"
                      @click="edit(item)"
                      outlined
                      color="blue"
                      block
                      >Update</v-btn
                    >

                    <v-btn
                      x-small
                      class="mt-1"
                      @click="labRequest(item)"
                      outlined
                      color="blue"
                      block
                      >Services</v-btn
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

    <!-- <MedicalInformation :data="medicalData" :action="action" /> -->
    <v-dialog v-model="addAppointmentDialog" max-width="400" persistent>
      <v-card>
        <v-card-title>Add Appointment</v-card-title>
        <v-card-text>
          <div>
            <v-row>
              <v-col cols="12">
                <v-menu
                  ref="menu"
                  v-model="menu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  :nudge-right="40"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="date"
                      label="Pick a date"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    />
                  </template>
                  <v-date-picker
                    v-model="date"
                    :readonly="action == 'View' ? true : false"
                    :min="minDate"
                    :max="maxDate"
                    @change="menu = false"
                  />
                </v-menu>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-if="action == 'View'"
                  v-model="time"
                  required
                  readonly
                  label="Time"
                  class="rounded-lg"
                  color="#6DB249"
                ></v-text-field>
                <v-autocomplete
                  v-else
                  v-model="time"
                  small-chips
                  deletable-chips
                  :rules="[(v) => !!v || 'Time is required']"
                  label="Select Time"
                  :items="availableTimes"
                  class="rounded-lg"
                  color="#6DB249"
                ></v-autocomplete>
              </v-col>
            </v-row>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="resetForm()">Cancel</v-btn>
          <v-btn
            v-if="action != 'View'"
            color="green darken-1"
            text
            @click="action == 'Update' ? updateAppointment() : confirmBooking()"
            >{{ action == "Update" ? "Update" : "Confirm" }}</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="laboratoryDialog" max-width="800" persistent>
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
                    @click="changeTab(tab)"
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
                    style="border: 1px solid black; border-radius: 10px;"
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
                        ></v-checkbox>
                      </div>
                      <div class="mx-2">&#8369;{{ item.price }}</div>
                    </div>
                    <div v-if="item.data.length > 0" class="">
                      <strong> {{ item.description }}</strong>
                      <v-row>
                        <v-col
                          cols="3"
                          v-for="item in item.data"
                          :key="item.id"
                        >
                          <div class="d-flex justify-center align-center">
                            <div>
                              <v-checkbox
                                v-model="selected"
                                :label="item.description"
                                :value="item.id"
                              ></v-checkbox>
                            </div>
                            <div class="mx-2">&#8369;{{ item.price }}</div>
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
                    style="border: 1px solid black; border-radius: 10px;"
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
                        ></v-checkbox>
                      </div>
                      <div class="mx-2">&#8369;{{ item.price }}</div>
                    </div>
                    <div v-if="item.data.length > 0" class="">
                      <strong>{{ item.description }}</strong>
                      <v-row>
                        <v-col
                          cols="3"
                          v-for="item in item.data"
                          :key="item.id"
                        >
                          <div class="d-flex justify-center align-center">
                            <div>
                              <v-checkbox
                                v-model="selected"
                                :label="item.description"
                                :value="item.id"
                              ></v-checkbox>
                            </div>
                            <div class="mx-2">&#8369;{{ item.price }}</div>
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
                    :key="item"
                    style="border: 1px solid black; border-radius: 10px;"
                  >
                    <div class="d-flex justify-center align-center">
                      <div>
                        <v-checkbox
                          v-model="selectedPackage"
                          :label="item.description"
                          :value="item.id"
                        ></v-checkbox>
                      </div>
                      <div class="mx-2">&#8369;{{ item.price }}</div>
                      <br />
                    </div>
                    <div class="mb-2">
                      <strong style="font-size: 14px;">List of Service:</strong>
                    </div>
                    <v-row>
                      <v-col
                        cols="4"
                        class="pa-2"
                        v-for="items in JSON.parse(item.assign_mods)"
                        :key="items.id"
                      >
                        <span style="font-size: 20px;">
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
          <v-btn text @click="resetForm()">Cancel</v-btn>
          <v-btn text @click="confirmSubmitService()">Confirm</v-btn>
          <!-- <v-btn
            v-if="action != 'View'"
            color="green darken-1"
            text
            @click="action == 'Update' ? updateAppointment() : confirmBooking()"
            >{{ action == "Update" ? "Update" : "Confirm" }}</v-btn
          > -->
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="confirmDialog" persistent max-width="390">
      <v-card color="white">
        <div class="pa-4 #3a3b3a--text">
          <div class="text-h6 mb-1">Update Service Warning!</div>
          <div class="text-body-1 mb-1">
            Are you sure you want to update service?
          </div>
        </div>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" outlined @click="confirmDialog = false">
            Close
          </v-btn>
          <v-btn
            :disabled="isButtonLoading"
            :loading="isButtonLoading"
            color="green"
            class="white--text"
            @click="confirmUpdateService()"
          >
            Confirm
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
export default {
  components: {
    // MedicalInformation: () => import("./MedicalInformation.vue"),
    // viewStrategicOutcome: () => import("./ViewStrategicOutcome.vue"),
  },
  props: {
    data: null,
  },
  data() {
    return {
      activeTab: { id: 1, name: "Laboratory" },
      tab: 1,
      tabList: [
        { id: 1, name: "Laboratory" },
        { id: 2, name: "Imaging" },
        { id: 3, name: "Packages" },
      ],
      options: {},
      selected: [],
      selectedPackage: [],
      updateID: null,
      strategicData: null,
      action: null,
      menu: false,
      date: null,
      time: null,
      desc: null,
      itemToDelete: null,
      addAppointmentDialog: false,
      laboratoryDialog: false,
      confirmDialog: false,
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
      dataItem: [],
      bookings: [],
      dataServices: [],
      dataPackages: [],
      allTimes: [
        "07:00 AM",
        "08:00 AM",
        "09:00 AM",
        "10:00 AM",
        "11:00 AM",
        "01:00 PM",
        "02:00 PM",
        "03:00 PM",
        "04:00 PM",
      ],
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
          text: "Date Scheduled",
          value: "date",
          align: "start",
          valign: "start",
          sortable: false,
        },

        {
          text: "Time",
          value: "time",
          align: "center",
          valign: "center",
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
          width: 200,
        },
      ],
    };
  },

  computed: {
    availableTimes() {
      if (!this.date) return this.allTimes;
      const bookedTimes = this.bookings
        .filter((b) => b.date === this.date)
        .map((b) => b.time);
      return this.allTimes.filter((time) => !bookedTimes.includes(time));
    },
    minDate() {
      const today = new Date();
      today.setMonth(today.getMonth());
      return today.toISOString().substr(0, 10);
    },
    maxDate() {
      const today = new Date();
      today.setMonth(today.getMonth() + 1);
      return today.toISOString().substr(0, 10);
    },
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
      this.getAllSchedule();
      this.getAllServices();
      this.getAllPackages();
      this.axiosCall(
        "/appointment/getBookedAppointment/" + this.id,
        "GET"
      ).then((res) => {
        if (res) {
          this.dataItem = res.data;
          this.loading = false;
        }
      });
    },
    getAllServices() {
      this.axiosCall(
        "/services/getAllServicesForBooking/" + this.tab,
        "GET"
      ).then((res) => {
        if (res) {
          this.dataServices = res.data;
          console.log("LOVED", res.data);
        }
      });
    },
    getAllSchedule() {
      this.axiosCall("/appointment/getAllSchedule/DataAppointment", "GET").then(
        (res) => {
          if (res) {
            console.log("scheduled", res.data);
            this.bookings = res.data;
          }
        }
      );
    },
    getAllPackages() {
      this.axiosCall("/services", "GET").then((res) => {
        if (res) {
          console.log("Pakes", res.data);
          this.dataPackages = res.data;
        }
      });
    },
    updateAppointment() {
      let data = {
        date: this.date,
        time: this.time,
      };
      this.axiosCall("/appointment/" + this.updateID, "PATCH", data).then(
        (res) => {
          if (res.data.status == 201) {
            // alert("updated");
            this.initialize();
            this.updateID = null;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "success";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;

            this.addAppointmentDialog = false;
            this.resetForm();
          } else if (res.data.status == 400) {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
          }
        }
      );
    },

    confirmBooking() {
      let data = {
        patientID: this.id,
        date: this.date,
        time: this.time,
      };

      this.axiosCall("/appointment/bookAppointment", "POST", data).then(
        (res) => {
          if (res.data.status == 200) {
            alert("updated");
            this.initialize();
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "success";
            this.fadeAwayMessage.header = "Successfully Saved";
            this.addAppointmentDialog = false;
            this.resetForm();
          } else if (res.data.status == 400) {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = res.data.msg;
          }
        }
      );
    },
    changeTab(tab) {
      this.activeTab = tab;
      this.tab = tab.id;
      this.getAllServices();
      this.getAllPackages();
    },
    confirmSubmitService() {
      this.confirmDialog = true;
    },
    confirmUpdateService() {
      console.log(
        "selected",
        this.selected,
        "Selected Packages",
        this.selectedPackage
      );

      let data = {
        service: JSON.stringify(this.selected),
        service_package: JSON.stringify(this.selectedPackage),
      };
      this.axiosCall(
        "/appointment/updateServices/" + this.updateID,
        "PATCH",
        data
      ).then((res) => {
        if (res.data.status == 201) {
          // alert("updated");
          this.initialize();
          this.updateID = null;
          this.selected = [];
          this.selectedPackage = [];
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "success";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = res.data.msg;
          this.addAppointmentDialog = false;
          this.confirmDialog = false;
          this.resetForm();
        } else if (res.data.status == 400) {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = res.data.msg;
        }
      });
    },

    resetForm() {
      this.addAppointmentDialog = false;
      this.laboratoryDialog = false;
      this.date = null;
      this.time = null;
    },

    closeD() {
      this.eventHub.$emit("closeViewMedicalInformationDialog", false);
      this.dialog = false;
    },

    edit(item) {
      console.log(item);
      this.addAppointmentDialog = true;
      this.date = item.date;
      this.time = item.time;
      this.updateID = item.id;
      this.action = "Update";
    },
    view(item) {
      console.log(item);
      this.addAppointmentDialog = true;
      this.date = item.date;
      this.time = item.time;
      this.action = "View";
    },
    labRequest(item) {
      console.log(item);
      this.updateID = item.id;
      if (item.service != null) {
        this.selected = JSON.parse(item.service).map((service) => service.id);
      } else {
        this.selected = [];
      }
      if (item.service_package != null) {
        this.selectedPackage = JSON.parse(item.service_package).map(
          (service_package) => service_package.id
        );
      } else {
        this.selectedPackage = [];
      }

      this.laboratoryDialog = true;
      //   const serviceList = JSON.parse(item.service); // [{ id: 1, ... }]
      //   const matchedItems = [];

      //   this.dataServices.forEach((service) => {
      //     if (service.data.length > 0) {
      //       service.data.forEach((child) => {
      //         if (serviceList.some((s) => s.id === child.id)) {
      //           matchedItems.push(child);
      //         }
      //       });
      //     } else {
      //       if (serviceList.some((s) => s.id === service.id)) {
      //         matchedItems.push(service);
      //       }
      //     }
      //   });

      //   this.selected = matchedItems;
    },

    AddAppointment() {
      this.addAppointmentDialog = true;
    },
  },
};
</script>
<style scoped></style>
