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
          <span>Lab Request</span>
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
                  @click="labRequest()"
                  class="white--text rounded-lg"
                  color="blue"
                >
                  Add Request
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
                  <template v-slot:[`item.status`]="{ item }">
                    <v-chip
                      :color="item.status == 0 ? 'orange' : 'blue'"
                      dark
                      small
                    >
                      <span>{{
                        item.status == 0 ? "Pending" : "Fully Paid"
                      }}</span>
                    </v-chip>
                  </template>
                  <template v-slot:[`item.medtech_name`]="{ item }">
                    <span> {{ item.medtech_name }}</span> <br />
                    <span v-if="item.medtech_name">
                      Liscence No.
                      <u>{{ item.liscence_no }}</u></span
                    >
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
                      v-if="item.status == 0"
                      class="mt-1"
                      @click="edit(item)"
                      outlined
                      color="blue"
                      block
                      >Update</v-btn
                    >
                    <v-btn
                      x-small
                      v-if="item.status == 0"
                      class="mt-1"
                      @click="payLabTest(1, item)"
                      outlined
                      color="blue"
                      block
                      >Pay</v-btn
                    >
                    <!-- <v-btn
                      x-small
                      class="mt-1"
                      @click="assignDoctor(item)"
                      outlined
                      color="orange"
                      block
                      >Assign Doctor</v-btn
                    > -->
                    <v-btn
                      x-small
                      class="mt-1"
                      @click="assignMedtech(item)"
                      outlined
                      color="orange"
                      block
                      >Assign Med-Tech</v-btn
                    >
                    <v-btn
                      x-small
                      class="mt-1"
                      @click="payLabTest(2, item)"
                      outlined
                      color="red"
                      block
                      >print</v-btn
                    >

                    <v-btn
                      x-small
                      class="mt-1"
                      @click="deleteItem(item)"
                      outlined
                      color="red"
                      block
                      >Delete</v-btn
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
                          :disabled="action == 'Pay' ? true : false"
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
                                :disabled="action == 'Pay' ? true : false"
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
                          :disabled="action == 'Pay' ? true : false"
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
                                :disabled="action == 'Pay' ? true : false"
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
                    style="border: 1px solid black; border-radius: 10px;"
                  >
                    <div class="d-flex justify-center align-center">
                      <div>
                        <v-checkbox
                          v-model="selectedPackage"
                          :label="item.description"
                          :value="item.id"
                          :disabled="action == 'Pay' ? true : false"
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
          <v-btn v-if="action == 'Update'" text @click="updateLabRequest()">
            Update
          </v-btn>
          <v-btn v-if="action == 'Add'" text @click="addLabRequest()">
            Add
          </v-btn>
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

    <v-dialog v-model="confirmationDialog" max-width="600">
      <v-card>
        <v-card-title>{{
          action == "Pay" ? "Confirm Payment" : "Print Receipt"
        }}</v-card-title>
        <v-card-text>
          <label> <strong>Services Availed:</strong></label>
          <ul>
            <li v-for="item in selected" :key="item.id">
              <div class="d-flex justify-space-between">
                <div>
                  {{ item.service_description }}
                </div>
                <div>
                  {{ "₱" + item.service_price }}
                </div>
              </div>
            </li>
          </ul>
          <br />
          <label> <strong>Package Availed:</strong></label>
          <ul>
            <li v-for="item in selectedPackage" :key="item.id">
              <div class="d-flex justify-space-between">
                <div>
                  {{ item.description }}
                </div>
                <div>
                  {{ "  ₱" + item.price }}
                </div>
              </div>
            </li>
          </ul>
          <br />
          <div class="d-flex justify-space-between">
            <div>
              <strong>Total: </strong>
            </div>
            <div>
              <strong> ₱{{ totalPrice }}</strong>
            </div>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="confirmationDialog = false">Cancel</v-btn>
          <v-btn
            v-if="action == 'Pay'"
            color="green darken-1"
            text
            @click="submitServicePayment()"
            >Confirm</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="assignAppointmentDialog" max-width="400" persistent>
      <v-card>
        <v-card-title>Assign {{ assignPerson }}</v-card-title>
        <v-card-text>
          <div>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-if="action == 'View'"
                  v-model="doctor"
                  required
                  readonly
                  label="Doctor"
                  class="rounded-lg"
                  color="#6DB249"
                ></v-text-field>
                <v-autocomplete
                  v-else-if="assignPerson == 'Doctor'"
                  v-model="doctor"
                  small-chips
                  deletable-chips
                  :rules="[(v) => !!v || 'Doctor is required']"
                  label="Doctor"
                  item-text="name"
                  item-value="id"
                  :items="doctorList"
                  class="rounded-lg"
                  color="#6DB249"
                ></v-autocomplete>
                <v-autocomplete
                  v-else-if="assignPerson == 'Med-Tech'"
                  v-model="medtech"
                  small-chips
                  deletable-chips
                  :rules="[(v) => !!v || 'Med-Tech is required']"
                  label="Med-Tech"
                  item-text="name"
                  item-value="id"
                  :items="medtechList"
                  class="rounded-lg"
                  color="#6DB249"
                ></v-autocomplete>
              </v-col>
            </v-row>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="assignAppointmentDialog = false">Cancel</v-btn>
          <v-btn
            v-if="action != 'View'"
            color="green darken-1"
            text
            @click="assignPerson == 'Doctor' ? updateDoctor() : updateMedTech()"
            >{{
              assignPerson == "Doctor" ? "Update Doctor" : "Update Med-Tech"
            }}</v-btn
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
      assignPerson: null,
      options: {},
      oldSelected: [],
      selected: [],
      oldSelectedPackage: [],
      selectedPackage: [],
      updateID: null,
      strategicData: null,
      action: null,
      menu: false,
      date: null,
      time: null,
      desc: null,
      itemToDelete: null,
      laboratoryDialog: false,
      confirmDialog: false,
      confirmationDialog: false,
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
      assignAppointmentDialog: false,
      dataItem: [],
      bookings: [],
      dataServices: [],
      dataPackages: [],
      medtech: null,
      doctor: null,
      medtechList: [],
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
          text: "Status",
          value: "status",
          align: "center",
          valign: "center",
          sortable: false,
        },

        // {
        //   text: "Doctor",
        //   value: "doctor_name",
        //   align: "center",
        //   valign: "center",
        //   sortable: false,
        // },

        {
          text: "Med-Tech",
          value: "medtech_name",
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
    // availableTimes() {
    //   if (!this.date) return this.allTimes;
    //   const bookedTimes = this.bookings
    //     .filter((b) => b.date === this.date)
    //     .map((b) => b.time);
    //   return this.allTimes.filter((time) => !bookedTimes.includes(time));
    // },
    // minDate() {
    //   const today = new Date();
    //   today.setMonth(today.getMonth());
    //   return today.toISOString().substr(0, 10);
    // },
    // maxDate() {
    //   const today = new Date();
    //   today.setMonth(today.getMonth() + 1);
    //   return today.toISOString().substr(0, 10);
    // },
    totalPrice() {
      let data = this.selected
        .reduce((sum, item) => sum + parseFloat(item.service_price || 0), 0)
        .toFixed(2);
      let data1 = this.selectedPackage
        .reduce((sum, item) => sum + parseFloat(item.price || 0), 0)
        .toFixed(2);
      let newData = parseFloat(data) + parseFloat(data1);
      // this.serviceTotalPrice = data;
      return newData;
    },
  },

  watch: {
    data: {
      handler(data) {
        this.dialog = true;
        console.log("STRAT", data);
        if (data.doctorID) {
          this.doctor = data.doctorID.toString();
        } else {
          this.doctor = null;
        }

        if (data.medtechID) {
          this.medtech = data.medtechID.toString();
        } else {
          this.medtech = null;
        }
        this.id = data.id;
        this.initialize();
        // alert(data.id);
        this.tab = 1;
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
      //   this.getAllSchedule();
      this.getAllServices();
      this.getAllPackages();
      this.getAllDoctors();
      this.getAllMedtech();
      this.axiosCall("/services/getAllLabRequest/List/" + this.id, "GET").then(
        (res) => {
          if (res) {
            // alert(res.data.data);
            console.log("Data", res.data.data);
            this.dataItem = res.data;
            this.loading = false;
          }
        }
      );
    },
    getAllDoctors() {
      this.axiosCall("/appointment/findAllDoctors", "GET").then((res) => {
        let data = res.data;

        for (let i = 0; i < data.length; i++) {
          data[i].name = this.toTitleCase(data[i].name);
        }
        console.log("Doctors", data);

        // if (this.data.doctorID == null) {
        //   this.doctor = data[0];
        // }
        this.doctorList = data;
      });
    },
    getAllMedtech() {
      this.axiosCall("/appointment/findAllMedtech", "GET").then((res) => {
        let data = res.data;

        for (let i = 0; i < data.length; i++) {
          data[i].name = this.toTitleCase(data[i].name);
        }
        console.log("Medtech", data);
        // if (this.data.medtechID == null) {
        //   this.medtech = data[0];
        // }
        this.medtechList = data;
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

    getAllPackages() {
      this.axiosCall("/services", "GET").then((res) => {
        if (res) {
          console.log("Pakes", res.data);
          this.dataPackages = res.data;
        }
      });
    },

    changeTab(tab) {
      this.activeTab = tab;
      this.tab = tab.id;
      this.getAllServices();
      this.getAllPackages();
    },

    resetForm() {
      this.laboratoryDialog = false;
      this.selected = [];
      this.selectedPackage = [];
      this.date = null;
      this.time = null;
    },

    closeD() {
      this.eventHub.$emit("closepatientAppointmentDialog", false);
      this.dataItem = [];
      this.action = null;

      this.assignPerson = null;
      this.dialog = false;
    },

    edit(item) {
      this.updateID = item.id;
      console.log(item);
      this.laboratoryDialog = true;
      this.selected = JSON.parse(item.service_list);
      this.selectedPackage = JSON.parse(item.package_list);
      this.action = "Update";
    },
    view(item) {
      console.log(item);
      this.laboratoryDialog = true;
      this.selected = JSON.parse(item.service_list);
      this.selectedPackage = JSON.parse(item.package_list);
      this.action = "View";
    },
    confirmPayment() {
      this.confirmationDialog = true;
    },
    labRequest() {
      this.laboratoryDialog = true;
      this.action = "Add";
    },
    payLabTest(num, item) {
      if (num == 1) {
        this.action = "Pay";
      } else if (num == 2) {
        this.action = "Print";
      }
      console.log(item);
      if (item.service_list == null || item.package_list == null) {
        alert("Please select Lab-Request first!");
      } else {
        this.updateID = item.id;
        //   this.selected = JSON.parse(item.service);
        // this.selectedPackage = JSON.parse(item.service_package);
        let data = {
          service_list: item.service_list,
          package_list: item.package_list,
        };
        console.log(data);

        this.axiosCall(
          "/services/pay-items/" + JSON.stringify(data) + "",
          "GET"
        ).then((res) => {
          if (res) {
            console.log("items paid", res.data.new_service);
            this.selected = res.data.new_service;
            this.selectedPackage = res.data.new_package;
          }
        });

        this.confirmationDialog = true;
      }
    },
    submitServicePayment() {
      let data = {
        status: 1,
        patientID: this.id,
      };
      this.axiosCall(
        "/appointment/updateAppointmentStatus/" + this.updateID,
        "PATCH",
        data
      ).then((res) => {
        if (res.data.status == 201) {
          // alert("updated");
          this.initialize();
          this.updateID = null;
          this.oldSelected = [];
          this.selected = [];
          this.oldSelectedPackage = [];
          this.selectedPackage = [];
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "success";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = res.data.msg;
          this.confirmationDialog = false;
          this.resetForm();
        } else if (res.data.status == 400) {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = res.data.msg;
        }
      });
    },
    deleteItem(item) {
      console.log(item);
      alert("Delete function is to be discussed for the PARAGON");
      // this.axiosCall("/appointment/" + item.id, "DELETE").then((res) => {
      //   if (res.data.status == 200) {
      //     this.fadeAwayMessage.show = true;
      //     this.fadeAwayMessage.type = "success";
      //     this.fadeAwayMessage.header = "System Message";
      //     this.fadeAwayMessage.message = res.data.msg;
      //     this.initialize();
      //   } else if (res.data.status == 400) {
      //     this.confirmDialog = false;
      //     this.fadeAwayMessage.show = true;
      //     this.fadeAwayMessage.type = "error";
      //     this.fadeAwayMessage.header = "System Message";
      //     this.fadeAwayMessage.message = res.data.msg;
      //   }
      // });
    },

    addLabRequest() {
      console.log(
        "selected",
        this.selected,
        "Selected Packages",
        this.selectedPackage
      );

      let data = {
        patientID: this.id,
        service_list: JSON.stringify(this.selected),
        package_list: JSON.stringify(this.selectedPackage),
      };
      this.axiosCall("/services/createServiceAppointment/", "POST", data).then(
        (res) => {
          if (res.data.status == 200) {
            // alert("updated");
            this.initialize();
            this.updateID = null;
            this.oldSelected = [];
            this.selected = [];
            this.oldSelectedPackage = [];
            this.selectedPackage = [];
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "success";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
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
    assignDoctor(item) {
      console.log(item);
      this.updateID = item.id;
      this.assignAppointmentDialog = true;
      this.action = "Update";
      this.assignPerson = "Doctor";
    },
    assignMedtech(item) {
      console.log(item);
      this.updateID = item.id;
      this.assignAppointmentDialog = true;
      this.action = "Update";
      this.assignPerson = "Med-Tech";
    },
    updateLabRequest() {
      this.confirmDialog = true;
    },

    updateDoctor() {
      console.log(this.doctor);
      let data = {
        patientID: this.id,
        doctorID: JSON.parse(this.doctor),
        // appointmentID: this.updateID,
        labID: this.updateID,
      };
      console.log(data);

      this.axiosCall("/appointment/addPatient/Doctor", "POST", data).then(
        (res) => {
          if (res.data.status == 200) {
            // alert("updated");
            this.initialize();
            this.updateID = null;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "success";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
            this.assignAppointmentDialog = false;
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

    updateMedTech() {
      console.log(this.medtech);
      let data = {
        patientID: this.id,
        medtechID: JSON.parse(this.medtech),
        // appointmentID: this.updateID,
        labID: this.updateID,
      };
      console.log(data);

      this.axiosCall("/appointment/addPatient/Medtech", "POST", data).then(
        (res) => {
          if (res.data.status == 200) {
            // alert("updated");
            let notif_data = {
              patientID: this.id,
              title: "Patient Appointment",
              message: "You Have Appoitnment",
              route: "/patient",
              assignedID: JSON.parse(this.medtech),
            };
            this.axiosCall("/notification", "POST", notif_data).then((res) => {
              if (res.data.status == 200) {
                this.initialize();
                this.updateID = null;
                this.fadeAwayMessage.show = true;
                this.fadeAwayMessage.type = "success";
                this.fadeAwayMessage.header = "System Message";
                this.fadeAwayMessage.message = res.data.msg;
                this.assignAppointmentDialog = false;
                this.resetForm();
              }
            });
          } else if (res.data.status == 400) {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
          }
        }
      );
    },

    confirmUpdateService() {
      let data = {
        patientID: this.id,
        service_list: JSON.stringify(this.selected),
        package_list: JSON.stringify(this.selectedPackage),
      };
      console.log(data);
      this.axiosCall(
        "/services/updateServiceAppointment/" + this.updateID,
        "PATCH",
        data
      ).then((res) => {
        if (res.data.status == 201) {
          // alert("updated");
          this.initialize();
          this.updateID = null;
          this.oldSelected = [];
          this.selected = [];
          this.oldSelectedPackage = [];
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
  },
};
</script>
<style scoped></style>
