<template>
  <div class="pa-4">
    <v-row>
      <v-col cols="12">
        <v-card class="rounded-xl shadow-sm pa-4">
          <div class="d-flex justify-space-between align-center mb-4">
            <h2 class="text-h5 font-weight-bold" style="color:#1565C0;">
              Specialization
            </h2>

            <v-btn
              v-if="dataSpecialty.length === 0"
              color="primary"
              variant="tonal"
              class="rounded-lg"
              @click="addExperty()"
              size="small"
            >
              <v-icon>mdi-plus-box-outline</v-icon>
            </v-btn>
          </div>

          <div v-if="dataSpecialty.length === 0" class="text-center text-grey">
            <v-icon size="40" class="mb-2">mdi-stethoscope</v-icon>
            <div>No specialization added</div>
          </div>

          <v-card
            v-for="item in dataSpecialty"
            :key="item.id"
            class="rounded-lg mb-3 pa-3 hover-card"
          >
            <div class="d-flex justify-space-between">
              <div style="width: 80%;">
                <div class="text-h6 font-weight-bold">{{ item.specialty }}</div>
                <div class="text-caption">{{ item.specialty_description }}</div>
              </div>

              <div class="text-right">
                <v-btn icon variant="text" @click="editExperty(item)">
                  <v-icon color="primary">mdi-pencil-outline</v-icon>
                </v-btn>

                <v-btn icon variant="text" @click="deleteExperty(item)">
                  <v-icon color="red">mdi-trash-can-outline</v-icon>
                </v-btn>
              </div>
            </div>
          </v-card>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-card class="rounded-xl shadow-sm pa-4">
          <div class="d-flex justify-space-between align-center mb-4">
            <h2 class="text-h5 font-weight-bold" style="color:#1565C0;">
              Schedule
            </h2>

            <v-btn
              color="primary"
              variant="tonal"
              class="rounded-lg"
              @click="addSchedule()"
              size="small"
            >
              <v-icon>mdi-plus-box-outline</v-icon>
            </v-btn>
          </div>

          <div v-if="dataSchedule.length === 0" class="text-center text-grey">
            <v-icon size="40" class="mb-2">mdi-calendar-blank</v-icon>
            <div>No schedule added</div>
          </div>

          <v-row>
            <v-col
              v-for="item in dataSchedule"
              :key="item.id"
              cols="12"
              sm="6"
              md="3"
            >
              <v-card class="rounded-lg mb-3 pa-3 hover-card">
                <div class="d-flex justify-space-between">
                  <div style="width: 80%;">
                    <div class="text-h6 font-weight-bold">
                      {{ formatDate(item.date) }}
                    </div>
                    <div class="text-body-2">{{ item.day }}</div>
                    <div class="text-caption">
                      Time: {{ item.timeFrom }} - {{ item.timeTo }}
                    </div>
                  </div>

                  <div class="text-right">
                    <v-btn icon variant="text" @click="editSchedule(item)">
                      <v-icon color="primary">mdi-pencil-outline</v-icon>
                    </v-btn>

                    <v-btn icon variant="text" @click="deleteSchedule(item)">
                      <v-icon color="red">mdi-trash-can-outline</v-icon>
                    </v-btn>
                  </div>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="scheduleDialog" max-width="600" persistent>
      <v-card class="rounded-xl">
        <v-card-title class="text-h6 font-weight-bold">
          {{ action }} Schedule
        </v-card-title>

        <v-card-text>
          <v-form ref="addSchedule">
            <v-row>
              <v-col cols="12" v-if="action === 'Add'">
                <v-menu
                  v-model="menu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-bind="attrs"
                      v-on="on"
                      label="Pick Dates"
                      prepend-icon="mdi-calendar"
                      readonly
                      :value="
                        dates.length
                          ? dates.length + ' dates selected'
                          : 'Select Dates'
                      "
                      :rules="[(v) => dates.length > 0 || 'Required']"
                    />
                  </template>

                  <v-date-picker
                    v-model="dates"
                    multiple
                    :min="minDate"
                    :max="maxDate"
                    :allowed-dates="allowedDates"
                  />
                </v-menu>

                <v-chip-group v-if="dates.length" multiple column class="mt-2">
                  <v-chip
                    v-for="(d, i) in dates"
                    :key="i"
                    closable
                    @click:close="removeDate(i)"
                  >
                    {{ new Date(d).toLocaleDateString() }}
                  </v-chip>
                </v-chip-group>
              </v-col>

              <v-col cols="12">
                <v-autocomplete
                  v-model="timeFrom"
                  label="From"
                  :items="allTimes"
                  :rules="[(v) => !!v || 'Required']"
                />
              </v-col>

              <v-col cols="12">
                <v-autocomplete
                  v-model="timeTo"
                  label="To"
                  :items="allTimes"
                  :rules="[(v) => !!v || 'Required']"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn variant="outlined" color="red" @click="resetForm()"
            >Cancel</v-btn
          >

          <v-btn
            v-if="action !== 'View'"
            color="primary"
            class="rounded-lg"
            @click="action === 'Add' ? submitSchedule() : updateSchedule()"
          >
            {{ action === "Add" ? "Submit" : "Update" }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="specialtyDialog" max-width="600" persistent>
      <v-card class="rounded-xl">
        <v-card-title class="text-h6 font-weight-bold">
          {{ action }} Specialty
        </v-card-title>

        <v-card-text>
          <v-form ref="addSpecialty">
            <v-row>
              <v-col cols="12">
                <v-autocomplete
                  v-model="experty"
                  label="Specialty"
                  item-text="name"
                  :items="specialtyList"
                  :rules="[(v) => !!v || 'Required']"
                  @change="expDesc(experty)"
                />
              </v-col>

              <v-col cols="12">
                <v-text-field
                  v-model="specialtyDescription"
                  label="Description"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn variant="outlined" color="red" @click="resetForm()"
            >Cancel</v-btn
          >

          <v-btn
            v-if="action !== 'View'"
            color="primary"
            class="rounded-lg"
            @click="action === 'Add' ? submitSpecialty() : updateSpecialty()"
          >
            {{ action === "Add" ? "Submit" : "Update" }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
      return this.dates
        .slice()
        .sort()
        .map((date) => new Date(date).toLocaleDateString())
        .join(", ");
    },
    minDate() {
      const today = new Date();
      today.setDate(today.getDate() + 1);
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
      this.action = "View";
      this.dates = item.date;
      this.day = item.day;
      this.timeFrom = item.timeFrom;
      this.timeTo = item.timeTo;
      this.scheduleDialog = true;
    },
    viewExperty(item) {
      this.action = "View";
      this.experty = item.specialty;
      this.specialtyDescription = item.specialty_description;
      this.specialtyDialog = true;
    },
    editExperty(item) {
      this.action = "Update";
      this.experty = item.specialty;
      this.specialtyDescription = item.specialty_description;
      this.updateID = item.id;
      this.specialtyDialog = true;
    },
    editSchedule(item) {
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

<style scoped>
.hover-card {
  transition: 0.2s ease;
}
.hover-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
}
</style>
