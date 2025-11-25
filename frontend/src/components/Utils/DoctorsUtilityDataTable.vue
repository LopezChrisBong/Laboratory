<template>
  <div>
    <v-row>
      <!-- Schedule Area -->
      <v-col cols="12" md="6">
        <v-card class="ma-2 dt-container" elevation="0" outlined>
          <div class="pa-2">
            <div
              class="d-flex justify-space-between align-center pa-2"
              style="border-bottom: 1px solid #2196F3;"
            >
              <div>
                <h2>Schedule</h2>
              </div>

              <button
                class="white--text  d-flex justify-center rounded-lg"
                @click="addSchedule()"
              >
                <v-icon right color="#2196F3"> mdi-plus-box-outline </v-icon>
              </button>
            </div>

            <v-row class="pa-2">
              <v-col cols="12" v-for="item in dataSchedule" :key="item.id">
                <v-card class="pa-1">
                  <div class="d-flex justify-space-between align-center">
                    <div style="width: 90%;">
                      <h4>{{ formatDate(item.date) }}</h4>
                      <h5>
                        {{ item.day }}
                      </h5>
                      <h6>Time: {{ item.timeFrom }} - {{ item.timeTo }}</h6>
                    </div>
                    <div style="width: 10%;">
                      <!-- <button class="mr-1" @click="viewSchedule(item)">
                        <v-icon center small color="green">
                          mdi-eye-outline
                        </v-icon>
                      </button>
                      <br /> -->
                      <button class="mr-1" @click="editSchedule(item)">
                        <v-icon center small color="#2196F3">
                          mdi-pencil-outline
                        </v-icon>
                      </button>
                      <br />
                      <button class="mr-1" @click="deleteSchedule(item)">
                        <v-icon center small color="red">
                          mdi-trash-can-outline
                        </v-icon>
                      </button>
                    </div>
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </div>
        </v-card>
      </v-col>

      <!-- Experties Area -->
      <v-col cols="12" md="6">
        <v-card class="ma-2 dt-container" elevation="0" outlined>
          <div class="pa-2">
            <div
              class="d-flex justify-space-between align-center pa-2"
              style="border-bottom: 1px solid #2196F3;"
            >
              <div>
                <h2>Specialization</h2>
              </div>
              <button
                class="white--text  d-flex justify-center rounded-lg"
                @click="addExperty()"
              >
                <v-icon right color="#2196F3"> mdi-plus-box-outline </v-icon>
              </button>
            </div>

            <v-row class="pa-2">
              <v-col cols="12" v-for="item in dataSpecialty" :key="item.id">
                <v-card class="pa-1">
                  <div class="d-flex justify-space-between align-center">
                    <div style="width: 90%;">
                      <h4>{{ item.specialty }}</h4>
                      <h5>Description: {{ item.specialty_description }}</h5>
                    </div>
                    <div style="width: 10%;">
                      <!-- <button class="mr-1" @click="viewExperty(item)">
                        <v-icon center small color="#2196F3">
                          mdi-eye-outline
                        </v-icon>
                      </button>
                      <br /> -->
                      <button class="mr-1" @click="editExperty(item)">
                        <v-icon center small color="#2196F3">
                          mdi-pencil-outline
                        </v-icon>
                      </button>
                      <br />
                      <button class="mr-1" @click="deleteExperty(item)">
                        <v-icon center small color="red">
                          mdi-trash-can-outline
                        </v-icon>
                      </button>
                    </div>
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </div>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="scheduleDialog" max-width="800" persistent>
      <v-card>
        <v-card-title>{{ action }} Schedule</v-card-title>
        <v-card-text>
          <div>
            <v-form ref="addSchedule">
              <v-row>
                <v-col cols="12" v-if="action == 'Add'">
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
                        label="Pick dates"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        :value="
                          dates.length
                            ? dates.length + ' dates selected'
                            : 'Select dates'
                        "
                        :rules="[
                          (v) => (dates && dates.length > 0) || 'required',
                        ]"
                      />
                    </template>

                    <v-date-picker
                      v-model="dates"
                      :min="minDate"
                      :max="maxDate"
                      multiple
                      :allowed-dates="allowedDates"
                      @input="onDatePicked"
                    />
                  </v-menu>

                  <!-- Show chips outside the text field -->
                  <v-chip-group v-if="dates.length" multiple class="mt-2">
                    <v-chip
                      v-for="(d, index) in dates"
                      :key="index"
                      close
                      @click:close="removeDate(index)"
                    >
                      {{ new Date(d).toLocaleDateString() }}
                    </v-chip>
                  </v-chip-group>
                </v-col>

                <!-- <v-col cols="12">
                  <v-text-field
                    v-model="day"
                    required
                    readonly
                    label="Day"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-text-field>
                </v-col> -->
                <v-col cols="12">
                  <v-autocomplete
                    v-model="timeFrom"
                    small-chips
                    deletable-chips
                    :rules="[(v) => !!v || 'time from is required']"
                    label="from:"
                    :items="allTimes"
                    :readonly="action == 'View'"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12">
                  <v-autocomplete
                    v-model="timeTo"
                    small-chips
                    deletable-chips
                    :rules="[(v) => !!v || 'time to is required']"
                    label="to:"
                    :items="allTimes"
                    :readonly="action == 'View'"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-autocomplete>
                </v-col>
              </v-row>
            </v-form>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="resetForm()" color="red" outlined class="">
            Cancel</v-btn
          >
          <v-btn
            v-if="action != 'View'"
            class="white--text ml-2 rounded-lg d-flex justify-center"
            color="blue darken-1"
            @click="action == 'Add' ? submitSchedule() : updateSchedule()"
            >{{ action == "Add" ? "Submit" : "Update" }}</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="specialtyDialog" max-width="600" persistent>
      <v-card>
        <v-card-title>{{ action }} Specialty</v-card-title>
        <v-card-text>
          <div>
            <v-form ref="addSpecialty">
              <v-row>
                <v-col cols="12">
                  <v-autocomplete
                    v-model="experty"
                    small-chips
                    deletable-chips
                    :rules="[(v) => !!v || 'required']"
                    label="Specialty"
                    item-text="name"
                    :items="specialtyList"
                    :readonly="action == 'View'"
                    @change="expDesc(experty)"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="specialtyDescription"
                    required
                    readonly
                    label="Description"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="resetForm()" color="red" outlined class="">
            Cancel</v-btn
          >
          <v-btn
            v-if="action != 'View'"
            class="white--text ml-2 rounded-lg d-flex justify-center"
            color="blue darken-1"
            @click="action == 'Add' ? submitSpecialty() : updateSpecialty()"
            >{{ action == "Add" ? "Submit" : "Update" }}</v-btn
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
  data: () => ({
    data: null,
    daysList: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    specialtyDescription: null,
    day: null,
    timeFrom: null,
    timeTo: null,
    dates: [],
    disabledDates: [],
    menu: false,
    scheduleDialog: false,
    specialtyDialog: false,
    experty: null,
    specialtyList: [
      { name: "Cardiology", description: "Heart and blood vessels" },
      { name: "Dermatology", description: "Skin, hair, and nails" },
      {
        name: "Endocrinology",
        description: "Hormones and glands (e.g., diabetes, thyroid)",
      },
      {
        name: "Gastroenterology",
        description: "Digestive system (stomach, intestines, liver)",
      },
      { name: "Hematology", description: "Blood disorders" },
      {
        name: "Infectious Disease",
        description: "Complex infections, HIV, etc.",
      },
      { name: "Nephrology", description: "Kidneys and urinary system" },
      { name: "Neurology", description: "Brain, nerves, and spinal cord" },
      { name: "Oncology", description: "Cancer treatment" },
      { name: "Pulmonology", description: "	Lungs and respiratory system" },
      {
        name: "Rheumatology",
        description: "Joints, arthritis, autoimmune diseases",
      },
      { name: "Pediatrics", description: "Infants, children, and adolescents" },
      {
        name: "Obstetrics & Gynecology (OB-GYN)",
        description: "Women's reproductive health, pregnancy",
      },
      {
        name: "General Surgery",
        description: "Surgical procedures on organs/tissues",
      },
      {
        name: "Orthopedics",
        description: "Bones, muscles, joints",
      },
      {
        name: "Ophthalmology",
        description: "Eyes and vision",
      },
      {
        name: "Otolaryngology (ENT)",
        description: "Ears, nose, and throat",
      },
      {
        name: "Psychiatry",
        description: "Mental health and emotional disorders",
      },
      {
        name: "Urology",
        description: "Urinary tract and male reproductive system",
      },
      {
        name: "Internal Medicine",
        description: "Adult general care and complex illnesses",
      },
      {
        name: "Family Medicine",
        description: "General health across all ages",
      },
      {
        name: "Radiology",
        description: "Medical imaging (X-rays, CT, MRI)",
      },
      {
        name: "Pathology",
        description: "Diagnosis via lab tests and tissue analysis",
      },
      {
        name: "Anesthesiology",
        description: "Pain control during surgery and procedures",
      },
      {
        name: "Emergency Medicine",
        description: "Acute care in emergencies",
      },
    ],
    allTimes: [
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
    dataSchedule: [],
    dataSpecialty: [],
    updateID: null,
    dataExperties: [],
    action: null,
    fadeAwayMessage: {
      show: false,
      type: "success",
      header: "Successfully Deleted!",
      message: "",
      top: 10,
    },
  }),
  watch: {
    options: {
      handler() {
        this.initialize();
        // this.tab = 1;
      },
      deep: true,
    },
  },
  mounted() {
    this.initialize();
  },
  computed: {
    formattedDates() {
      if (!this.dates || this.dates.length === 0) return "";
      // Sort dates and format them
      return this.dates
        .slice()
        .sort()
        .map((date) => new Date(date).toLocaleDateString())
        .join(", ");
    },
    minDate() {
      const today = new Date();
      today.setDate(today.getDate() + 1); // Tomorrow
      return today.toISOString().substr(0, 10);
    },
    maxDate() {
      const today = new Date();
      today.setMonth(today.getMonth() + 12);
      return today.toISOString().substr(0, 10);
    },
  },
  methods: {
    initialize() {
      this.getAllSchedule();
      this.getAllSpecialty();
    },
    getAllSchedule() {
      let userRoleID = this.$store.state.user.id;

      this.axiosCall(
        "/doctors-schedule/getMySchedule/" + userRoleID,
        "GET"
      ).then((res) => {
        if (res) {
          this.dataSchedule = res.data;

          this.disabledDates = res.data.map((item) => item.date);

          console.log("Disabled dates:", this.disabledDates);
        }
      });
    },

    getAllSpecialty() {
      let userRoleID = this.$store.state.user.id;
      this.axiosCall(
        "/doctor-specialization/getMyScpecialty/" + userRoleID,
        "GET"
      ).then((res) => {
        if (res) {
          this.dataSpecialty = res.data;
        }
      });
    },
    addSchedule() {
      this.action = "Add";
      this.scheduleDialog = true;
    },
    addExperty() {
      this.action = "Add";
      this.specialtyDialog = true;
    },
    viewSchedule(item) {
      // console.log(item);
      this.action = "View";
      this.dates = item.date;
      this.day = item.day;
      this.timeFrom = item.timeFrom;
      this.timeTo = item.timeTo;
      this.scheduleDialog = true;
    },
    viewExperty(item) {
      // console.log(item);
      this.action = "View";
      this.experty = item.specialty;
      this.specialtyDescription = item.specialty_description;
      this.specialtyDialog = true;
    },
    editExperty(item) {
      // console.log(item);
      this.action = "Update";
      this.experty = item.specialty;
      this.specialtyDescription = item.specialty_description;
      this.updateID = item.id;
      this.specialtyDialog = true;
    },
    editSchedule(item) {
      // console.log(item);
      this.action = "Update";
      this.dates = item.date;
      this.day = item.day;
      this.timeFrom = item.timeFrom;
      this.timeTo = item.timeTo;
      this.updateID = item.id;
      this.scheduleDialog = true;
    },
    onDatePicked(value) {
      console.log(value);
      this.dates = value;
      // // this.menu = false;
      // this.checkDay();
    },
    removeDate(index) {
      this.dates.splice(index, 1);
    },
    checkDay(item) {
      const selected = new Date(item);
      const day = selected.getDay();
      if (day === 1) {
        return "Monday";
      } else if (day === 2) {
        return "Tuesday";
      } else if (day === 3) {
        return "Wednesday";
      } else if (day === 4) {
        return "Thursday";
      } else if (day === 5) {
        return "Friday";
      } else if (day === 6) {
        return "Saturday";
      } else if (day === 0) {
        return "Sunday";
      }
      return;
    },
    allowedDates(date) {
      return !this.disabledDates.includes(date);
    },
    submitSchedule() {
      if (this.$refs.addSchedule.validate()) {
        let userRoleID = this.$store.state.user.id;
        for (let i = 0; i < this.dates.length; i++) {
          let data = {
            doctorID: userRoleID,
            date: this.dates[i],
            day: this.checkDay(this.dates[i]),
            timeFrom: this.timeFrom,
            timeTo: this.timeTo,
          };
          console.log(data);
          this.axiosCall("/doctors-schedule", "POST", data).then((res) => {
            if (res.data.status == 200) {
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = "success";
              this.fadeAwayMessage.header = "Successfully Saved";
              this.scheduleDialog = false;
              this.resetForm();
              this.initialize();
            } else if (res.data.status == 400) {
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = "error";
              this.fadeAwayMessage.header = res.data.msg;
            }
          });
        }
      }
    },
    submitSpecialty() {
      if (this.$refs.addSpecialty.validate()) {
        let userRoleID = this.$store.state.user.id;
        let data = {
          doctorID: userRoleID,
          specialty: this.experty,
          specialty_description: this.specialtyDescription,
        };
        // console.log(data);

        this.axiosCall("/doctor-specialization", "POST", data).then((res) => {
          if (res.data.status == 200) {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "success";
            this.fadeAwayMessage.header = "Successfully Saved";
            this.scheduleDialog = false;
            this.resetForm();
            this.initialize();
          } else if (res.data.status == 400) {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = res.data.msg;
          }
        });
      }
    },
    updateSchedule() {
      if (this.$refs.addSchedule.validate()) {
        let data = {
          timeFrom: this.timeFrom,
          timeTo: this.timeTo,
        };

        this.axiosCall(
          "/doctors-schedule/" + this.updateID,
          "PATCH",
          data
        ).then((res) => {
          if (res.data.status == 201) {
            this.initialize();
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "success";
            this.fadeAwayMessage.header = "Successfully Updated";
            this.scheduleDialog = false;
            this.resetForm();
          } else if (res.data.status == 400) {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = res.data.msg;
          }
        });
      }
    },
    updateSpecialty() {
      if (this.$refs.addSpecialty.validate()) {
        // let userRoleID = this.$store.state.user.id;
        let data = {
          specialty: this.experty,
          specialty_description: this.specialtyDescription,
        };
        // console.log(data);

        this.axiosCall(
          "/doctor-specialization/" + this.updateID,
          "PATCH",
          data
        ).then((res) => {
          if (res.data.status == 201) {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "success";
            this.fadeAwayMessage.header = "Successfully Updated";
            this.scheduleDialog = false;
            this.initialize();
            this.resetForm();
          } else if (res.data.status == 400) {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = res.data.msg;
          }
        });
      }
    },
    deleteSchedule(item) {
      // // console.log(item);
      this.axiosCall("/doctors-schedule/" + item.id, "DELETE").then((res) => {
        if (res.data.status == 200) {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "success";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = res.data.msg;
          this.initialize();
        } else if (res.data.status == 400) {
          this.confirmDialog = false;
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = res.data.msg;
        }
      });
    },
    deleteExperty(item) {
      this.axiosCall("/doctor-specialization/" + item.id, "DELETE").then(
        (res) => {
          if (res.data.status == 200) {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "success";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
            this.initialize();
          } else if (res.data.status == 400) {
            this.confirmDialog = false;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
          }
        }
      );
    },
    expDesc(experty) {
      for (let i = 0; i < this.specialtyList.length; i++) {
        if (experty == this.specialtyList[i].name) {
          this.specialtyDescription = this.specialtyList[i].description;
        }
      }
      // // console.log(this.specialtyDescription);
    },
    resetForm() {
      this.scheduleDialog = false;
      this.specialtyDialog = false;
      this.day = null;
      this.dates = [];
      this.timeFrom = null;
      this.timeTo = null;
      this.updateID = null;
      this.specialtyDescription = null;
      this.experty = null;
      this.getAllSchedule();
    },
  },
};
</script>
