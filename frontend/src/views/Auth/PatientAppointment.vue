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
                  <v-col cols="12" md="2" sm="12" v-show="info == 1">
                    <v-text-field
                      label="Suffix"
                      v-model="form.suffix"
                      class="text-uppercase"
                      required
                      @input="toUppercase('suffix', $event)"
                    />
                  </v-col>
                  <v-col cols="12" md="4" sm="12" v-show="info == 1">
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
                  <!-- <v-col cols="12" md="6" sm="12" v-show="info == 1">
                    <v-text-field
                      label="Civil Status"
                      v-model="form.civil_status"
                      :rules="[formRules.required]"
                      class="text-uppercase"
                      required
                      @input="toUppercase('civil_status', $event)"
                    />
                  </v-col> -->
                  <v-col cols="12" md="6" sm="12" v-show="info == 1">
                    <v-select
                      label="Civil Status"
                      :items="statusList"
                      v-model="form.civil_status"
                      :rules="[(v) => !!v || 'Gender is required']"
                      required
                      class="text-uppercase"
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
                              {{ item.specialty }}
                            </v-btn>
                          </li>
                        </ul>
                      </v-col>
                      <v-col cols="12" md="7">
                        <v-card class="pa-2">
                          <v-card class="ma-1">
                            <v-card-title>
                              <span class="">Description:</span></v-card-title
                            >
                            <div
                              class="d-flex justify-center align-center"
                              style="text-align: justify;"
                            >
                              <p>
                                {{ clinicDecription.description }}
                              </p>
                            </div>
                          </v-card>
                          <v-card class="ma-1">
                            <v-card-title>
                              <p class="">Doctor/s Encharge:</p>
                            </v-card-title>
                            <div class="mb-2">
                              <ul class="pb-2">
                                <li
                                  v-for="item in clinicDecription.doctors"
                                  :key="item.id"
                                >
                                  Dr. {{ item.name }}
                                </li>
                              </ul>
                            </div>
                          </v-card>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-col>

                  <v-col cols="12" md="6" v-show="info == 3">
                    <div class="mt-8">
                      Select date and time:
                    </div></v-col
                  >
                  <v-col cols="12" md="6" v-show="info == 3">
                    <div class="mt-8">
                      Profile:
                    </div></v-col
                  >
                  <v-col cols="12" v-show="info == 3">
                    <v-row
                      v-if="
                        !clinicDecription.doctors ||
                          clinicDecription.specialty == 'Others'
                      "
                    >
                      <v-col cols="12" md="6" sm="12">
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
                      <v-col cols="12" md="6" sm="12">
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
                          :items="allTimes1"
                          class="rounded-lg"
                          color="#6DB249"
                        ></v-autocomplete>
                      </v-col>
                    </v-row>
                    <v-row v-else>
                      <v-col cols="12" md="6">
                        <v-autocomplete
                          v-model="doctors_date"
                          small-chips
                          deletable-chips
                          :rules="[(v) => !!v || 'required']"
                          label="Select Date"
                          item-value="id"
                          item-text="date"
                          @change="changeSchedule(doctors_date)"
                          :items="doctors_schedList"
                          class="rounded-lg"
                          color="#6DB249"
                        ></v-autocomplete>
                        <br />
                        <v-autocomplete
                          v-model="doctor_time"
                          small-chips
                          deletable-chips
                          :rules="[(v) => !!v || 'Time is required']"
                          label="Select Time"
                          :items="availableTimes"
                          class="rounded-lg"
                          color="#6DB249"
                        ></v-autocomplete>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-card class="pa-2">
                          <v-row>
                            <v-col
                              cols="12"
                              v-for="item in doc_profile"
                              :key="item.id"
                            >
                              <div>
                                <!-- <p>image {{ item.profile }}</p> -->
                                <v-img
                                  style="width: 200px; height: 150px;"
                                  :src="item.profile"
                                ></v-img>
                              </div>
                              <div>
                                <p>
                                  Name:<b> Dr. {{ item.name }}</b>
                                </p>
                              </div>
                              <div>
                                <p>Field of experties:</p>
                                <ul>
                                  <li
                                    v-for="items in item.specialization"
                                    :key="items.id"
                                  >
                                    {{ items.specialty }}
                                  </li>
                                </ul>
                              </div>
                            </v-col>
                          </v-row>
                        </v-card>
                      </v-col>
                    </v-row>
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

      <v-dialog v-model="confirmationDialog" max-width="450">
        <v-card>
          <!-- <v-card-title
            ><p style="text-align: center;">
              Thank you for your submission!
            </p></v-card-title
          > -->
          <div class="pt-4">
            <p style="text-align: center; font-size: 24px;">
              <b>Thank you for your submission!</b>
            </p>
          </div>
          <v-card-text>
            <v-row>
              <v-col cols="12" class="mb-1">
                <div>
                  <p style="text-align: center; font-size: 14px;" class="px-2">
                    Please take a screenshot of this confirmation receipt. You
                    will need to present it together with your valid ID when you
                    arrive at the clinic for validation
                  </p>
                </div>
              </v-col>

              <v-col cols="12" class="mb-1">
                <div>
                  <p style="text-align: center; font-size: 14px;" class="px-2">
                    For any question and concerns, feel free to message us on
                    our official facebook page,
                    <br />
                    <b>Paragon Diagnostics and Multi-speciality Clinic</b>
                  </p>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="red"
              class="mt-4 px-6"
              @click="confirmationDialog = false"
              >Cancel</v-btn
            >
            <v-spacer />
            <v-btn
              color="green darken-1"
              class="mt-4 px-6"
              @click="confirmBooking"
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
      doctors_time: null,
      doctors_date: null,
      doc_profile: [],
      doctor_time: null,
      doctors_schedList: [],
      doctors_schedList1: [],
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
        suffix: null,
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
      clinicList: [],
      selectedIndex: null,
      dataPackages: [],
      genderList: ["Male", "Female"],
      statusList: ["Single", "Married"],
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
      allTimes1: [
        "01:00 AM",
        "02:00 AM",
        "03:00 AM",
        "04:00 AM",
        "05:00 AM",
        "06:00 AM",
        "07:00 AM",
        "08:00 AM",
        "09:00 AM",
        "10:00 AM",
        "11:00 AM",
        "12:00 PM",
        "01:00 PM",
        "02:00 PM",
        "03:00 PM",
        "04:00 PM",
        "05:00 PM",
        "06:00 PM",
        "07:00 PM",
        "08:00 PM",
        "09:00 PM",
        "10:00 PM",
        "11:00 PM",
        "12:00 AM",
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
      if (!this.form.date) return this.allTimes1;

      const bookedTimes = this.bookings
        .filter((b) => b.date === this.form.date)
        .map((b) => b.time.trim());

      const uniqueBooked = [...new Set(bookedTimes)];

      const docSchedule = this.doc_profile.find(
        (d) => d.date === this.form.date
      );

      let doctorTimes = this.allTimes1;

      if (docSchedule) {
        const startIndex = this.allTimes1.indexOf(docSchedule.timeFrom);
        const endIndex = this.allTimes1.indexOf(docSchedule.timeTo);

        if (startIndex !== -1 && endIndex !== -1) {
          if (startIndex <= endIndex) {
            doctorTimes = this.allTimes1.slice(startIndex, endIndex + 1);
          } else {
            doctorTimes = [
              ...this.allTimes1.slice(startIndex),
              ...this.allTimes1.slice(0, endIndex + 1),
            ];
          }
        }
      }

      return doctorTimes.filter((time) => !uniqueBooked.includes(time));
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
    // "form.date": {
    //   immediate: true,
    //   handler(date) {
    //     if (date) this.fetchBookings(date);
    //   },
    // },
  },
  mounted() {
    // this.getAllSchedule();
    this.getAllServices();
    this.getAllPackages();
    this.getAllClinic();
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
        this.getAllDoctorsSchedule();
      }
    },
    toUppercase(field, value) {
      this.form[field] = value.toUpperCase();
    },
    alerts() {
      this.fadeAwayMessage.show = true;
      this.fadeAwayMessage.type = "error";
      this.fadeAwayMessage.header = "Please fill all field before booking!";
      this.info = 1;
      this.confirmationDialog = false;
      // alert("Please fill all field before booking!");
    },
    async fetchBookings(data) {
      try {
        this.axiosCall(
          "/appointment/getAllDoctorsAppointment/" + data[0].doctorID,
          "GET"
        ).then((res) => {
          for (let i = 0; i < res.data.length; i++) {
            this.bookings.push(res.data[i]);
          }
          console.log(" this.bookings.", this.bookings);
        });
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
      }
    },

    submitForm() {
      this.confirmationDialog = true;
    },
    changeSchedule(sched) {
      // console.log("wdadawdawd", sched);
      let newArr = [];
      for (let i = 0; i < this.doctors_schedList.length; i++) {
        if (this.doctors_schedList[i].id == sched) {
          newArr.push(this.doctors_schedList[i]);
        }
      }
      this.allTimes1 = this.getDoctorAvailableTimes(newArr[0]);
      this.form.date = newArr[0].oldDate;
      this.doc_profile = newArr;
      this.fetchBookings(newArr);
    },

    getDoctorAvailableTimes(schedule) {
      const normalizeTime = (str) => str.trim().toUpperCase();

      const startTime = normalizeTime(schedule.timeFrom);
      const endTime = normalizeTime(schedule.timeTo);

      const startIndex = this.allTimes1.indexOf(startTime);
      const endIndex = this.allTimes1.indexOf(endTime);

      if (startIndex === -1 || endIndex === -1) {
        return []; // if mismatch, return empty
      }

      if (startIndex <= endIndex) {
        // Normal case: e.g. 01:00 AM → 11:00 AM
        return this.allTimes1.slice(startIndex, endIndex + 1);
      } else {
        // Overnight case: e.g. 10:00 PM → 02:00 AM
        return [
          ...this.allTimes1.slice(startIndex),
          ...this.allTimes1.slice(0, endIndex + 1),
        ];
      }
    },
    // getAllSchedule() {
    //   this.axiosCall("/appointment/getAllSchedule/DataAppointment", "GET").then(
    //     (res) => {
    //       if (res) {
    //         this.bookings = res.data;
    //       }
    //     }
    //   );
    // },
    getAllServices() {
      this.axiosCall(
        "/services/getAllServicesForBooking/" + this.tab,
        "GET"
      ).then((res) => {
        if (res) {
          this.dataServices = res.data;
        }
      });
    },
    getAllPackages() {
      this.axiosCall("/services", "GET").then((res) => {
        if (res) {
          this.dataPackages = res.data;
        }
      });
    },

    getAllClinic() {
      this.axiosCall("/doctor-specialization/getAllClinic", "GET").then(
        (res) => {
          if (res) {
            let others = [
              {
                specialty: "Others",
                description: "No specific Clinic to visit!",
                doctors: [],
              },
            ];
            this.clinicList = res.data;
            Object.assign(this.clinicList, others);
            // this.clinicList.reverse();
            // // console.log("Clinic Data", this.clinicList);
          }
        }
      );
    },
    getAllDoctorsSchedule() {
      let docList;
      if (
        !this.clinicDecription.doctors ||
        this.clinicDecription.specialty == "Others"
      ) {
        docList = [];
      } else {
        docList = JSON.stringify(this.clinicDecription.doctors);
      }
      this.axiosCall(
        "/doctors-schedule/getAllDoctorsSched/" + docList,
        "GET"
      ).then((res) => {
        if (res) {
          // console.log(res.data);
          this.doctors_schedList1 = res.data;
          let data = res.data;
          Object.assign(data, { oldDate: null });

          for (let i = 0; i < data.length; i++) {
            data[i].oldDate = data[i].date;
            data[i].date =
              this.formatDate(data[i].date) +
              " From: " +
              data[i].timeFrom +
              " To: " +
              data[i].timeTo;

            data[i].profile = data[i].profile
              ? process.env.VUE_APP_SERVER +
                "/user-details/getProfileImg/" +
                data[i].profile
              : process.env.VUE_APP_SERVER +
                "/user-details/getProfileImg/img_avatar.png";
          }

          this.doctors_schedList = data;
        }
      });
    },
    confirmBooking() {
      let data = {
        f_name: this.form.f_name,
        l_name: this.form.l_name,
        suffix: this.form.suffix,
        m_name: this.form.m_name,
        age: this.form.age,
        civil_status: this.form.civil_status,
        occupation: this.form.occupation,
        gender: this.form.gender,
        contact_no: this.form.contact_no,
        b_date: this.form.b_date,
        address: this.form.address,
      };

      // console.log("Data Passed", data);

      this.axiosCall("/appointment/addPatient", "POST", data).then((res) => {
        // console.log(res.data.status, res.data.duplicate);
        let errorCode = res.data.duplicate;

        if (errorCode == true) {
          // alert("Duplicate Patient");
          this.axiosCall(
            "/appointment/checkPatient/dataExist/" +
              this.form.f_name +
              "/" +
              this.form.l_name,
            "GET"
          ).then((res) => {
            if (res) {
              // console.log("Patient", res.data);

              let data2 = {
                patientID: res.data.id,
                date:
                  this.clinicDecription.specialty == "Others" ||
                  !this.clinicDecription.doctors
                    ? this.form.date
                    : this.doc_profile[0].oldDate,
                time:
                  this.clinicDecription.specialty == "Others" ||
                  !this.clinicDecription.doctors
                    ? this.form.time
                    : this.doctor_time,
                clinic: this.clinicDecription.specialty
                  ? this.clinicDecription.specialty
                  : "",
                doctorID:
                  this.clinicDecription.specialty == "Others" ||
                  !this.clinicDecription.doctors
                    ? null
                    : this.doc_profile[0].doctorID,
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
            date:
              this.clinicDecription.specialty == "Others" ||
              !this.clinicDecription.doctors
                ? this.form.date
                : this.doc_profile[0].oldDate,
            time:
              this.clinicDecription.specialty == "Others" ||
              !this.clinicDecription.doctors
                ? this.form.time
                : this.doctor_time,
            clinic: this.clinicDecription.specialty
              ? this.clinicDecription.specialty
              : "",
            doctorID:
              this.clinicDecription.specialty == "Others" ||
              !this.clinicDecription.doctors
                ? null
                : this.doc_profile[0].doctorID,
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
        suffix: null,
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
      this.clinicDecription = [];
      this.doc_profile = null;
      this.doctor_time = null;
      this.doctors_date = null;
      this.doctors_schedList = [];
      this.doctors_schedList1 = [];
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
