<template>
  <div class="mt-8">
    <v-container fluid fill-height class="content">
      <v-row align="center" justify="center">
        <v-col align="center" cols="12" md="10" sm="6">
          <v-card
            max-width="1000"
            class="rounded-card pa-4"
            style="
              border-left: #6ac5fe 1px solid;
              border-top: #6ac5fe 1px solid;
            "
            align="start"
          >
            <v-card-title
              >{{ info == 1 ? "Patient Information" : "Book a Schedule" }}

              <v-spacer></v-spacer>
              <span style="font-size: 12px; color: blue">
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
                      @input="toUppercase('l_name', $event)"
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
                      label="Sex"
                      :items="genderList"
                      v-model="form.gender"
                      :rules="[(v) => !!v || 'Sex is required']"
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
                </v-row>
                <v-card-actions>
                  <v-spacer />

                  <v-btn color="primary" class="mt-4" type="submit">
                    Submit
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-form>
          </v-card>
        </v-col>
      </v-row>

      <!-- <v-dialog v-model="confirmationDialog" max-width="450">
        <v-card>
           <v-card-title
            ><p style="text-align: center;">
              Thank you for your submission!
            </p></v-card-title
          > 
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
      </v-dialog> -->
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
      this.fadeAwayMessage.show = true;
      this.fadeAwayMessage.type = "error";
      this.fadeAwayMessage.header = "Please fill all field before booking!";
      this.info = 1;
      this.confirmationDialog = false;
      // alert("Please fill all field before booking!");
    },
    async fetchBookings(date) {
      console.log(date);
      // console.log(this.bookings);
      // try {
      //   this.axiosCall("/appointment/booking", "POST", date).then((res) => {
      //     this.bookings = res.data;
      //   });
      // } catch (err) {
      //   console.error("Failed to fetch bookings:", err);
      // }
    },
    // submitForm() {
    //   this.confirmationDialog = true;
    // },
    getAllSchedule() {
      this.axiosCall("/appointment/getAllSchedule/DataAppointment", "GET").then(
        (res) => {
          if (res) {
            // console.log("scheduled", res.data);
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
    submitForm() {
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
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "Patient Already Exist";
        } else {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "success";
          this.fadeAwayMessage.header = "Successfully Saved";
          this.info = 1;
          this.resetForm();
          this.dialog;
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
