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
              <v-col cols="12">
                <v-card class="pa-1">
                  <div class="d-flex justify-space-between align-center">
                    <div style="width: 90%;">
                      <h4>Monday</h4>
                      <h5>
                        Time: 7:00 am - 6:00 pm
                      </h5>
                    </div>
                    <div style="width: 10%;">
                      <button class="mr-1">
                        <v-icon center small color="#2196F3">
                          mdi-eye-outline
                        </v-icon>
                      </button>
                      <br />
                      <button class="mr-1">
                        <v-icon center small color="#2196F3">
                          mdi-pencil-outline
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
                <h2>Experty</h2>
              </div>
              <button
                class="white--text  d-flex justify-center rounded-lg"
                @click="addExperty('Add')"
              >
                <v-icon right color="#2196F3"> mdi-plus-box-outline </v-icon>
              </button>
            </div>

            <v-row class="pa-2">
              <v-col cols="12">
                <v-card class="pa-1">
                  <div class="d-flex justify-space-between align-center">
                    <div style="width: 90%;">
                      <h4>Radiology</h4>
                      <h5>
                        Description: sample description
                      </h5>
                    </div>
                    <div style="width: 10%;">
                      <button class="mr-1">
                        <v-icon center small color="#2196F3">
                          mdi-eye-outline
                        </v-icon>
                      </button>
                      <br />
                      <button class="mr-1">
                        <v-icon center small color="#2196F3">
                          mdi-pencil-outline
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
    <v-dialog v-model="scheduleDialog" max-width="400" persistent>
      <v-card>
        <v-card-title>Add Schedule</v-card-title>
        <v-card-text>
          <div>
            <v-row>
              <v-col cols="12">
                <!-- <v-text-field
                  v-model="doctor"
                  required
                  readonly
                  label="Doctor"
                  class="rounded-lg"
                  color="#6DB249"
                ></v-text-field> -->
                <v-autocomplete
                  v-model="day"
                  small-chips
                  deletable-chips
                  :rules="[(v) => !!v || 'Day is required']"
                  label="Day"
                  :items="daysList"
                  class="rounded-lg"
                  color="#6DB249"
                ></v-autocomplete>
                <!-- <v-autocomplete
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
                ></v-autocomplete> -->
              </v-col>
            </v-row>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="scheduleDialog = false" color="red" outlined class="">
            Cancel</v-btn
          >
          <v-btn
            class="white--text ml-2 rounded-lg d-flex justify-center"
            color="green darken-1"
            @click="submitSchedule()"
            >Submit</v-btn
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
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    day: null,
    time: null,
    scheduleDialog: false,
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
        this.tab = 1;
      },
      deep: true,
    },
  },
  methods: {
    //   initialize() {},
    addSchedule() {
      this.scheduleDialog = true;
    },
  },
};
</script>
