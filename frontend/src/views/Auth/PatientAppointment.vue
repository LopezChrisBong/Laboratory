<template>
  <div>
    <v-container fluid fill-height class="content">
      <v-row align="center" justify="center">
        <v-col align="center" cols="12" md="10" sm="6">
          <v-card
            max-width="1000"
            class="rounded-card pa-4"
            style=" border-left: #6ac5fe 1px solid; border-top: #6ac5fe 1px solid;"
            align="start"
          >
            <v-card-title
              >{{ info == 1 ? "Patient Information" : "Book a Schedule" }}

              <v-spacer></v-spacer>
              <span style="font-size: 12px; color: blue;">
                (please type N/A if Not Applicable)</span
              >
            </v-card-title>
            <v-form v-model="valid" @submit.prevent="submitForm">
              <v-col cols="12" md="5" class="pa-0" v-if="info == 2">
                <!-- <v-tabs v-model="activeTab" color="#2196F3" align-tabs="left">
                  <v-tab
                    v-for="tab in tabList"
                    :key="tab.id"
                    @click="changeTab(tab)"
                    >{{ tab.name }}</v-tab
                  >
                </v-tabs> -->
              </v-col>
              <v-card outlined class="scrollable-card pa-4" max-height="90vh">
                <v-row class="">
                  <v-col cols="12" md="4" sm="12" v-show="info == 1">
                    <v-text-field
                      label="First Name"
                      v-model="form.f_name"
                      :rules="[formRules.required]"
                      class="text-uppercase"
                      @input="toUppercase('f_name', $event)"
                      required
                    />
                  </v-col>

                  <v-col cols="12" md="4" sm="12" v-show="info == 1">
                    <v-text-field
                      label="Middle Name"
                      v-model="form.m_name"
                      class="text-uppercase"
                      @input="toUppercase('m_name', $event)"
                    />
                  </v-col>
                  <v-col cols="12" md="4" sm="12" v-show="info == 1">
                    <v-text-field
                      label="Last Name"
                      v-model="form.l_name"
                      :rules="[formRules.required]"
                      class="text-uppercase"
                      required
                      @input="toUppercase('l_name', $event)"
                    />
                  </v-col>
                  <v-col cols="12" md="6" sm="12" v-show="info == 1">
                    <v-text-field
                      label="Birth Date"
                      v-model="form.b_date"
                      :rules="[formRules.required]"
                      required
                      type="date"
                      class="text-uppercase"
                      @input="calculateAge(form.b_date)"
                    />
                  </v-col>
                  <v-col cols="12" md="6" sm="12" v-show="info == 1">
                    <v-text-field
                      label="Age"
                      v-model="form.age"
                      :rules="[formRules.required]"
                      required
                      readonly
                      type="number"
                      class="text-uppercase"
                    />
                  </v-col>
                  <v-col cols="12" md="6" sm="12" v-show="info == 1">
                    <v-text-field
                      label="Civil Status"
                      v-model="form.civil_status"
                      :rules="[formRules.required]"
                      class="text-uppercase"
                      required
                      @input="toUppercase('civil_status', $event)"
                    />
                  </v-col>
                  <v-col cols="12" md="6" sm="12" v-show="info == 1">
                    <v-text-field
                      label="Occupation"
                      v-model="form.occupation"
                      :rules="[formRules.required]"
                      class="text-uppercase"
                      required
                      @input="toUppercase('occupation', $event)"
                    />
                  </v-col>

                  <v-col cols="12" md="6" sm="12" v-show="info == 1">
                    <v-select
                      label="Gender"
                      :items="genderList"
                      v-model="form.gender"
                      :rules="[(v) => !!v || 'Gender is required']"
                      required
                      class="text-uppercase"
                    />
                  </v-col>
                  <v-col cols="12" md="6" sm="12" v-show="info == 1">
                    <v-text-field
                      label="Contact No."
                      v-model="form.contact_no"
                      :rules="[formRules.required]"
                      required
                      type="number"
                      class="text-uppercase"
                    />
                  </v-col>

                  <v-col cols="12" md="12" sm="12" v-show="info == 1">
                    <v-text-field
                      label="Address"
                      v-model="form.address"
                      :rules="[formRules.required]"
                      class="text-uppercase"
                      required
                      @input="toUppercase('address', $event)"
                    />
                  </v-col>
                  <!--Laboratory Services Area-->
                  <!-- <v-col cols="12" v-if="tab == 1">
                    <v-row>
                      <v-col
                        cols="12"
                        :md="item.data.length <= 0 ? 3 : 12"
                        sm="12"
                        v-show="info == 2"
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
                              :value="item"
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
                                    :value="item"
                                  ></v-checkbox>
                                </div>
                                <div class="mx-2">&#8369;{{ item.price }}</div>
                              </div>
                            </v-col>
                          </v-row>
                        </div>
                      </v-col>
                    </v-row>
                  </v-col> -->
                  <!-- :rules="[(v) => !!v || 'Service is required']" -->
                  <!--Imaging Services Area-->

                  <!-- <v-col cols="12" v-if="tab == 2">
                    <v-row>
                      <v-col
                        cols="12"
                        :md="item.data.length <= 0 ? 3 : 12"
                        sm="12"
                        v-show="info == 2"
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
                              :value="item"
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
                                    :value="item"
                                  ></v-checkbox>
                                </div>
                                <div class="mx-2">&#8369;{{ item.price }}</div>
                              </div>
                            </v-col>
                          </v-row>
                        </div>
                      </v-col>
                    </v-row>
                  </v-col> -->

                  <!--Package Services Area-->

                  <!-- <v-col cols="12" v-if="tab == 3">
                    <v-row>
                      <v-col
                        cols="12"
                        md="6"
                        sm="12"
                        v-show="info == 2"
                        v-for="item in dataPackages"
                        :key="item"
                        style="border: 1px solid black; border-radius: 10px;"
                      >
                        <div class="d-flex justify-center align-center">
                          <div>
                            <v-checkbox
                              v-model="selectedPackage"
                              :label="item.description"
                              :value="item"
                            ></v-checkbox>
                          </div>
                          <div class="mx-2">&#8369;{{ item.price }}</div>
                          <br />
                        </div>
                        <div class="mb-2">
                          <strong style="font-size: 14px;"
                            >List of Service:</strong
                          >
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
                  </v-col> -->
                  <v-col cols="12" v-show="info == 2">
                    <div>
                      <p style="font-size: 24px;">
                        Please select the Clinic to Visit
                      </p>
                    </div>
                  </v-col>

                  <v-col cols="12" v-show="info == 2">
                    <v-row>
                      <v-col cols="12" md="5">
                        <ul style="list-style-type: none; padding: 0;">
                          <li
                            v-for="(item, index) in clinicList"
                            :key="item.id || index"
                            style="margin-bottom: 8px;"
                            :class="{ selected: selectedIndex === index }"
                          >
                            <v-btn
                              class="clinicButtons"
                              block
                              :class="{ selected: selectedIndex === index }"
                              @click="
                                selectButton(index);
                                clinicData(item);
                              "
                            >
                              {{ item.name }}
                            </v-btn>
                          </li>
                        </ul>
                      </v-col>
                      <v-col cols="12" md="7">
                        <div
                          class="d-flex justify-center align-center"
                          style="text-align: justify;"
                        >
                          <p>
                            {{ clinicDecription.description }}
                          </p>
                        </div>
                      </v-col>
                    </v-row>
                  </v-col>

                  <v-col cols="12" v-show="info == 3">
                    <div class="mt-8">
                      Select date and time:
                    </div></v-col
                  >

                  <v-col cols="12" md="6" sm="12" v-show="info == 3">
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
                          v-model="form.date"
                          label="Pick a date"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        />
                      </template>
                      <v-date-picker
                        v-model="form.date"
                        :min="minDate"
                        :max="maxDate"
                        @change="menu = false"
                      />
                    </v-menu>
                  </v-col>
                  <v-col cols="12" md="6" sm="12" v-show="info == 3">
                    <!-- <v-select
                      label="Select Time"
                      :items="availableTimes"
                      v-model="form.time"
                      :rules="[(v) => !!v || 'Time is required']"
                      required
                    /> -->

                    <v-autocomplete
                      v-model="form.time"
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
                <v-card-actions>
                  <v-spacer />
                  <v-btn
                    v-if="info != 1"
                    :disabled="valid"
                    color="primary"
                    class="mt-4"
                    @click="info == 2 ? (info = 1) : (info = 2)"
                  >
                    Return
                  </v-btn>
                  <v-btn
                    v-if="info == 3"
                    :disabled="!valid"
                    color="primary"
                    class="mt-4"
                    type="submit"
                  >
                    Submit
                  </v-btn>
                  <v-btn
                    v-if="info != 3"
                    color="primary"
                    class="mt-4"
                    @click="
                      form.f_name &&
                      form.l_name &&
                      form.age &&
                      form.civil_status &&
                      form.gender &&
                      form.occupation &&
                      form.contact_no &&
                      form.b_date &&
                      form.address != null
                        ? next()
                        : alerts()
                    "
                  >
                    Next
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-form>
          </v-card>
        </v-col>
      </v-row>

      <v-dialog v-model="confirmationDialog" max-width="600">
        <v-card>
          <v-card-title>Confirm Booking</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <p>
                  <strong>Name:</strong>
                  {{
                    form.m_name != null
                      ? form.f_name + " " + form.m_name + " " + form.l_name
                      : form.f_name + " " + " " + form.l_name
                  }}
                </p>
              </v-col>
              <v-col cols="12">
                <label for="">Schedule:</label>
                <br />
                <p style="font-size: 24px;">
                  {{ formatDate(form.date) + " " + formatTime(form.time) }}
                </p>
              </v-col>
            </v-row>
            <p>
              <strong>Clinic to Visit:</strong><br />
              <span style="font-size: 24px;"> {{ clinicDecription.name }}</span>
            </p>
            <v-row style="background-color: #eff1f3; border-radius: 20px;">
              <v-col cols="12" class="mb-1">
                <div style="border: 1px solid black; border-radius: 20px;">
                  <p style="text-align: justify; font-size: 12px;" class="pa-2">
                    <strong>Note:</strong>
                    <!-- <span style=" color: blue;">
                Kindly take a screenshot or photo before confirming, to serve as
                proof of your appointment.</span
              > -->
                    <span style=" color: blue;">
                      Please take a screenshot of this confirmation receipt. You
                      will need to present it when you arrive at the clinic for
                      verification. Present a valid ID uppon arrival.
                    </span>
                  </p>
                </div>
              </v-col>
              <v-col cols="12" class="mb-1">
                <div style="border: 1px solid black; border-radius: 20px;">
                  <p style="text-align: justify; font-size: 12px;" class="pa-2">
                    <strong>Info:</strong>
                    <span style=" color: blue;">
                      For any questions or concerns, feel free to message us on
                      our official Facebook page,
                      <a href="https://www.facebook.com/paragondiagnostics"
                        >Paragon Diagnostics and Multi-Specialty Clinic</a
                      >
                    </span>
                  </p>
                </div>
              </v-col>
            </v-row>
            <!-- <label> <strong>Services Availed: </strong></label>
            <ul>
              <li v-for="item in selected" :key="item.id">
                <div class="d-flex justify-space-between">
                  <div>
                    {{ item.description }}
                  </div>
                  <div>
                    {{ "₱" + item.price }}
                  </div>
                </div>
              </li>
            </ul>
            <br /> -->
            <!-- <label> <strong>Package Availed: </strong></label>
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
            </div> -->
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn text @click="confirmationDialog = false">Cancel</v-btn>
            <v-btn color="green darken-1" text @click="confirmBooking"
              >Confirm</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
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
  data() {
    return {
      clinicDecription: [],
      allTotalServices: null,
      serviceTotalPrice: null,
      packageTotalPrice: null,
      activeTab: { id: 1, name: "Laboratory" },
      tab: 1,
      tabList: [
        { id: 1, name: "Laboratory" },
        { id: 2, name: "Imaging" },
        { id: 3, name: "Packages" },
      ],
      selected: [],
      selectedPackage: [],
      valid: false,
      info: 1,
      menu: false,
      confirmationDialog: false,
      form: {
        f_name: null,
        l_name: null,
        m_name: null,
        age: null,
        civil_status: null,
        occupation: null,
        gender: null,
        contact_no: null,
        b_date: null,
        address: null,
        date: null,
        time: null,
      },
      clinicList: [
        { id: 1, name: "Pediatrician ", description: "1Sample description" },
        {
          id: 2,
          name: "Obstetrician-Gynecologist ",
          description: "2Sample description",
        },
        { id: 3, name: "General Surgery ", description: "3Sample description" },
        { id: 4, name: "Family Medicine ", description: "4Sample description" },
        {
          id: 5,
          name: "Internal Medicine ",
          description: "5Sample description",
        },
        { id: 6, name: "Ent-Head/Neck  ", description: "6Sample description" },
        { id: 7, name: "Surgeon ", description: "7Sample description" },
        { id: 8, name: "General  ", description: "8Sample description" },
        {
          id: 9,
          name: "Physician/Occupation ",
          description: "9Sample description",
        },
        { id: 10, name: "al Medicine ", description: "10Sample description" },
        { id: 11, name: "Pathologist ", description: "11Sample description" },
        { id: 12, name: "Radiologist ", description: "12Sample description" },
      ],
      selectedIndex: null,
      dataPackages: [],
      genderList: ["Male", "Female"],
      Laboratory_services: [],
      Imaging_services: [],
      Package_services: [],
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
      dataServices: [],
      bookings: [],
      fadeAwayMessage: {
        show: false,
        type: "success",
        header: "Successfully Deleted!",
        message: "",
        top: 10,
      },
    };
  },
  computed: {
    availableTimes() {
      if (!this.form.date) return this.allTimes;
      const bookedTimes = this.bookings
        .filter((b) => b.date === this.form.date)
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

    totalPrice() {
      let data = this.selected
        .reduce((sum, item) => sum + parseFloat(item.price || 0), 0)
        .toFixed(2);

      let data1 = this.selectedPackage
        .reduce((sum, item) => sum + parseFloat(item.price || 0), 0)
        .toFixed(2);
      let newData = parseFloat(data) + parseFloat(data1);
      // this.serviceTotalPrice = data;
      return newData;
    },

    // totalPricePackage() {
    //   let data = this.selectedPackage
    //     .reduce((sum, item) => sum + parseFloat(item.price || 0), 0)
    //     .toFixed(2);
    //   // this.packageTotalPrice = data;
    //   return data;
    // },
  },
  watch: {
    "form.date": {
      immediate: true,
      handler(date) {
        if (date) this.fetchBookings(date);
      },
    },
  },
  mounted() {
    this.getAllSchedule();
    this.getAllServices();
    this.getAllPackages();
  },
  methods: {
    selectButton(index) {
      this.selectedIndex = index;
    },
    clinicData(item) {
      this.clinicDecription = item;
    },
    next() {
      if (this.info == 1) {
        this.info = 2;
      } else if (this.info == 2) {
        this.info = 3;
      }
    },
    toUppercase(field, value) {
      this.form[field] = value.toUpperCase();
    },
    alerts() {
      alert("Please fill all field before booking!");
    },
    async fetchBookings(date) {
      console.log(date);
      console.log(this.bookings);
      // try {
      //   this.axiosCall("/appointment/booking", "POST", date).then((res) => {
      //     this.bookings = res.data;
      //   });
      // } catch (err) {
      //   console.error("Failed to fetch bookings:", err);
      // }
    },
    submitForm() {
      this.confirmationDialog = true;
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
    confirmBooking() {
      let data = {
        f_name: this.form.f_name,
        l_name: this.form.l_name,
        m_name: this.form.m_name,
        age: this.form.age,
        civil_status: this.form.civil_status,
        occupation: this.form.occupation,
        gender: this.form.gender,
        contact_no: this.form.contact_no,
        b_date: this.form.b_date,
        address: this.form.address,
      };

      console.log("Data Passed", data);

      this.axiosCall("/appointment/addPatient", "POST", data).then((res) => {
        console.log(res.data.status, res.data.duplicate);
        let errorCode = res.data.duplicate;

        if (errorCode == true) {
          alert("Duplicate Patient");
          this.axiosCall(
            "/appointment/checkPatient/dataExist/" +
              this.form.f_name +
              "/" +
              this.form.l_name,
            "GET"
          ).then((res) => {
            if (res) {
              console.log("Patient", res.data);

              let data2 = {
                patientID: res.data.id,
                date: this.form.date,
                time: this.form.time,
                clinic: JSON.stringify(this.clinicDecription.id),
              };

              this.axiosCall(
                "/appointment/bookAppointment",
                "POST",
                data2
              ).then((res) => {
                if (res.data.status == 200) {
                  this.fadeAwayMessage.show = true;
                  this.fadeAwayMessage.type = "success";
                  this.fadeAwayMessage.header = "Successfully Saved";
                  this.info = 1;
                  this.confirmationDialog = false;
                  this.resetForm();
                } else if (res.data.status == 400) {
                  this.fadeAwayMessage.show = true;
                  this.fadeAwayMessage.type = "error";
                  this.fadeAwayMessage.header = res.data.msg;
                }
              });
            }
          });
        } else {
          let data2 = {
            patientID: res.data.id,
            date: this.form.date,
            time: this.form.time,
            clinic: JSON.stringify(this.clinicDecription.id),
          };

          this.axiosCall("/appointment/bookAppointment", "POST", data2).then(
            (res) => {
              if (res.data.status == 200) {
                this.fadeAwayMessage.show = true;
                this.fadeAwayMessage.type = "success";
                this.fadeAwayMessage.header = "Successfully Saved";
                this.info = 1;
                this.confirmationDialog = false;
                this.resetForm();
              } else if (res.data.status == 400) {
                this.fadeAwayMessage.show = true;
                this.fadeAwayMessage.type = "error";
                this.fadeAwayMessage.header = res.data.msg;
              }
            }
          );

          // this.fadeAwayMessage.show = true;
          // this.fadeAwayMessage.type = "success";
          // this.fadeAwayMessage.header = "Successfully Saved!";
          // this.dialog = false;
        }
      });
    },
    calculateAge(birthDate) {
      if (!birthDate) return;

      const currentDate = new Date();
      if (new Date(birthDate) > currentDate) {
        this.birthDate = null;
        this.form.age = null;
        alert("Invalid Date of Birth");
      }

      const diffTime = currentDate - new Date(birthDate);
      const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      this.form.age = Math.floor(totalDays / 365.25);
      // this.months = Math.floor((totalDays % 365.25) / 30.4375);
      // this.days = Math.floor((totalDays % 365.25) % 30.4375);
    },

    changeTab(tab) {
      this.activeTab = tab;
      this.tab = tab.id;
      this.getAllServices();
      this.getAllPackages();
    },
    resetForm() {
      this.form = {
        f_name: null,
        l_name: null,
        m_name: null,
        age: null,
        civil_status: null,
        occupation: null,
        gender: null,
        contact_no: null,
        b_date: null,
        address: null,
        date: null,
        time: null,
      };
      this.selected = [];
    },
  },
};
</script>
<style scoped>
.v-card-title {
  font-weight: bold;
}

.scrollable-card {
  overflow-y: auto;
}
.text-uppercase input {
  text-transform: uppercase;
}
:hover.clinicButtons {
  background-color: green;
  color: white;
}
.clinicButtons:focus {
  background-color: green;
  color: white;
}

.selected {
  background-color: #0d6933 !important;
  color: white !important;
}
</style>
