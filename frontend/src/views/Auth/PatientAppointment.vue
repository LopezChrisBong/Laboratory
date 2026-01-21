<template>
  <div>
    <v-row class="top-bar px-6 elevation-1" align="center">
      <v-col
        cols="4"
        style="align-items: center; justify-content: center"
        class="mt-2"
      >
        <v-btn text small color="primary" @click="doHome">
          <v-icon left>mdi-arrow-left</v-icon>
          Back to Home
        </v-btn>
      </v-col>

      <v-col cols="4" class="text-left" v-if="$vuetify.breakpoint.smAndUp">
        <div class="d-flex align-left justify-center">
          <v-img
            src="../../assets/img/paragon logo website.png"
            max-width="36"
            class="mr-2"
          />
          <div>
            <div class="font-weight-bold">PARAGON</div>
            <div class="caption grey--text">
              Diagnostics & Multi-Specialty Clinic
            </div>
          </div>
        </div>
      </v-col>

      <v-col cols="4"></v-col>
    </v-row>
    <v-container class="content">
      <!-- TOP BAR -->

      <!--Stepper-->
      <v-row justify="center">
        <v-col cols="12" style="margin-top: 20px; padding: 18%" class="py-2">
          <v-stepper v-model="info" flat>
            <v-stepper-header>
              <v-stepper-step :complete="info > 1" step="1">
                Personal Info
              </v-stepper-step>
              <v-divider />
              <v-stepper-step :complete="info > 2" step="2">
                Schedule
              </v-stepper-step>
              <v-divider />
              <v-stepper-step :complete="info > 3" step="3">
                Review
              </v-stepper-step>
              <!-- <v-divider />
                        <v-stepper-step step="4"> Confirmation </v-stepper-step> -->
            </v-stepper-header>
          </v-stepper>
        </v-col>
      </v-row>
      <v-row align="center" justify="center">
        <v-col align="center" cols="12">
          <v-card
            max-width="800"
            class="rounded-card elevation-3"
            style="
              border-left: #6ac5fe 1px solid;
              border-top: #6ac5fe 1px solid;
            "
            align="start"
          >
            <v-card-title style="background-color: #0052a3" class="white--text">
              <div>
                <span class="ml-2 text-h5">
                  {{
                    info == 1
                      ? "Personal Information"
                      : info == 2
                      ? "Appointment Details"
                      : "Review"
                  }} </span
                ><br />
                <span class="ml-2 text-subtitle-1">
                  {{
                    info == 1
                      ? "Please confirm your personal details below."
                      : info == 2
                      ? "Select your preferred doctor and schedule."
                      : "Please review your appointment details."
                  }}
                </span>
              </div>
            </v-card-title>
            <v-form v-model="valid" @submit.prevent="confirmBooking">
              <v-card
                outlined
                class="scrollable-card pa-4 mb-8"
                max-height="90vh"
              >
                <v-row class="">
                  <v-col cols="12" md="3" sm="12" v-show="info == 1">
                    <v-text-field
                      outlined
                      filled
                      label="*First Name"
                      v-model="form.f_name"
                      dense
                      :rules="[formRules.required]"
                      class="text-uppercase"
                      @input="toUppercase('f_name', $event)"
                      required
                    />
                  </v-col>

                  <v-col cols="12" md="3" sm="12" v-show="info == 1">
                    <v-text-field
                      filled
                      outlined
                      label="Middle Name"
                      v-model="form.m_name"
                      class="text-uppercase"
                      dense
                      @input="toUppercase('m_name', $event)"
                    />
                  </v-col>
                  <v-col cols="12" md="3" sm="12" v-show="info == 1">
                    <v-text-field
                      filled
                      outlined
                      label="*Last Name"
                      v-model="form.l_name"
                      :rules="[formRules.required]"
                      class="text-uppercase"
                      dense
                      required
                      @input="toUppercase('l_name', $event)"
                    />
                  </v-col>
                  <v-col cols="12" md="3" sm="12" v-show="info == 1">
                    <v-text-field
                      filled
                      outlined
                      label="Suffix"
                      v-model="form.suffix"
                      class="text-uppercase"
                      dense
                      required
                      @input="toUppercase('suffix', $event)"
                    />
                  </v-col>
                  <v-col cols="12" md="6" sm="12" v-show="info == 1">
                    <v-text-field
                      filled
                      outlined
                      label="*Birth Date"
                      v-model="form.b_date"
                      :rules="[formRules.required]"
                      dense
                      required
                      type="date"
                      :max="BdaymaxDate"
                      class="text-uppercase"
                      @input="calculateAge(form.b_date)"
                    />
                  </v-col>
                  <v-col cols="12" md="6" sm="12" v-show="info == 1">
                    <v-text-field
                      filled
                      outlined
                      label="Age"
                      v-model="form.age"
                      :rules="[formRules.required]"
                      required
                      readonly
                      dense
                      type="number"
                      class="text-uppercase"
                    />
                  </v-col>

                  <v-col cols="12" md="3" sm="12" v-show="info == 1">
                    <v-select
                      outlined
                      filled
                      label="*Sex"
                      :items="genderList"
                      dense
                      v-model="form.gender"
                      :rules="[(v) => !!v || 'Gender is required']"
                      required
                      class="text-uppercase"
                    />
                  </v-col>
                  <v-col cols="12" md="3" sm="12" v-show="info == 1">
                    <v-text-field
                      filled
                      outlined
                      v-model="form.contact_no"
                      label="*Contact No."
                      color="#6DB249"
                      dense
                      type="text"
                      maxlength="11"
                      @keypress="onlyDigits"
                      @input="cleanDigits"
                      @change="getMobileNumber()"
                      :error-messages="numberError"
                      :rules="[contactNoRule]"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    :md="form.civil_status == 'Married' ? '6' : '3'"
                    sm="12"
                    v-show="info == 1"
                  >
                    <v-select
                      outlined
                      filled
                      label="*Civil Status"
                      :items="statusList"
                      dense
                      v-model="form.civil_status"
                      :rules="[(v) => !!v || 'Gender is required']"
                      required
                      class="text-uppercase"
                    />
                  </v-col>

                  <v-col
                    cols="12"
                    md="12"
                    sm="12"
                    v-if="form.civil_status == 'Married'"
                    v-show="info == 1"
                  >
                    <v-text-field
                      outlined
                      filled
                      v-model="form.spouse"
                      label="*Spouse"
                      color="#6DB249"
                      dense
                      :rules="[(v) => !!v || 'Spouse is required']"
                    ></v-text-field>
                  </v-col>

                  <v-col
                    cols="12"
                    :md="form.civil_status == 'Married' ? '4' : '3'"
                    sm="12"
                    v-show="info == 1"
                  >
                    <v-text-field
                      filled
                      outlined
                      label="*Occupation"
                      v-model="form.occupation"
                      :rules="[formRules.required]"
                      class="text-uppercase"
                      dense
                      required
                      @input="toUppercase('occupation', $event)"
                    />
                  </v-col>

                  <v-col cols="12" md="4" sm="12" v-show="info == 1">
                    <v-autocomplete
                      filled
                      outlined
                      v-model="form.region"
                      :rules="[formRules.required]"
                      dense
                      class="rounded-lg"
                      item-text="regionName"
                      item-value="code"
                      label="*Region"
                      color="#93CB5B"
                      :items="regionList"
                      @change="changeRegion()"
                    >
                    </v-autocomplete>
                  </v-col>
                  <v-col cols="12" md="4" sm="12" v-show="info == 1">
                    <v-autocomplete
                      filled
                      outlined
                      v-model="form.province"
                      :rules="[formRules.required]"
                      dense
                      class="rounded-lg"
                      item-text="name"
                      item-value="code"
                      label="*Province"
                      color="#93CB5B"
                      :items="provinceList"
                      @change="changeProvince()"
                    >
                    </v-autocomplete>
                  </v-col>
                  <v-col
                    cols="12"
                    :md="form.civil_status == 'Married' ? '6' : '4'"
                    sm="12"
                    v-show="info == 1"
                  >
                    <v-autocomplete
                      filled
                      outlined
                      v-model="form.city_muni"
                      :rules="[formRules.required]"
                      dense
                      class="rounded-lg"
                      item-text="name"
                      item-value="code"
                      label="*City/Municipality"
                      color="#93CB5B"
                      :items="city_muniList"
                      @change="changeCityMuni()"
                    >
                    </v-autocomplete>
                  </v-col>
                  <v-col cols="12" md="6" sm="12" v-show="info == 1">
                    <v-autocomplete
                      filled
                      outlined
                      v-model="form.baranggay"
                      :rules="[formRules.required]"
                      dense
                      class="rounded-lg"
                      item-text="name"
                      item-value="code"
                      label="*Barangay"
                      color="#93CB5B"
                      :items="baranggayList"
                    >
                    </v-autocomplete>
                  </v-col>
                  <v-col
                    cols="12"
                    :md="form.civil_status == 'Married' ? '12' : '6'"
                    sm="12"
                    v-show="info == 1"
                  >
                    <v-text-field
                      filled
                      outlined
                      label="*Street/Purok"
                      v-model="form.purok"
                      :rules="[formRules.required]"
                      class="text-uppercase"
                      required
                      dense
                      @input="toUppercase('address', $event)"
                    />
                  </v-col>
                  <v-col cols="12" v-show="info == 2">
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-autocomplete
                          v-model="selectedClinic"
                          :items="clinicList"
                          item-text="specialty"
                          item-value="id"
                          label="Select Clinic"
                          outlined
                          filled
                          dense
                          clearable
                          @change="onClinicChange"
                        />
                      </v-col>
                      <v-col cols="6">
                        <v-autocomplete
                          v-model="doctor_selected"
                          outlined
                          filled
                          dense
                          clearable
                          :rules="[(v) => !!v || 'required']"
                          label="Select Doctor"
                          item-value="id"
                          item-text="name"
                          @change="getDoctorsSchedules(doctor_selected)"
                          :items="clinicDecription.doctors"
                          class="rounded-lg"
                          color="#6DB249"
                        ></v-autocomplete>
                      </v-col>
                      <v-col cols="12" md="6">
                        <div>Select Date:</div>
                        <div
                          class="d-flex justify-center align-center date-picker-wrapper"
                        >
                          <v-date-picker
                            v-model="doctors_date"
                            year-icon="mdi-calendar-blank"
                            prev-icon="mdi-skip-previous"
                            next-icon="mdi-skip-next"
                            elevation="2"
                            :allowed-dates="dateRestriction"
                          ></v-date-picker>
                        </div>
                      </v-col>
                      <v-col cols="12" md="6">
                        <div>Select Time:</div>
                        <!-- {{ filteredTimes }} -->
                        <v-row no-gutters>
                          <v-col
                            cols="12"
                            md="4"
                            v-for="(
                              item, index
                            ) in clinicDecription.specialty == 'Others'
                              ? filteredTimes
                              : availableTimesUpdate"
                            :key="index"
                          >
                            <v-card
                              class="mx-2 my-2 pa-2 clinicButtons text-center"
                              :class="{ selected: selectedIndex === index }"
                              @click="selectTimeButton(index, item)"
                            >
                              {{ item }}
                            </v-card>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>

                    <!-- <v-row>
                      <v-col cols="12" md="5">
                        <ul style="list-style-type: none; padding: 0">
                          <li
                            v-for="(item, index) in clinicList"
                            :key="item.id"
                            style="margin-bottom: 8px"
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
                              style="text-align: justify"
                            >
                              <p>
                                {{ clinicDecription.description }}
                              </p>
                            </div>
                          </v-card>
                          <v-card class="ma-1">
                            <v-card-title>
                              <p class="">Doctor/s Incharge:</p>
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
                    </v-row> -->
                  </v-col>

                  <v-col cols="12" v-show="info == 3">
                    <v-card class="pa-6 rounded-xl email-card">
                      <!-- <div class="d-flex align-center mb-4">
                        <v-icon color="deep-purple-accent-4" size="36"
                          >mdi-email-outline</v-icon
                        >
                        <h2 class="ml-3 text-h6 font-weight-bold">
                          Appointment Confirmation
                        </h2>
                      </div> -->

                      <div class="email-content pa-4">
                        <p class="text-body-2 mb-4">
                          <strong>Subject:</strong> Submission of Appointment to
                          PARAGON
                        </p>

                        <p class="text-body-2 mb-4">Hi {{ form.f_name }},</p>

                        <p class="text-body-2 mb-4">
                          Thank you for booking with
                          <strong
                            >Paragon Diagnostics & Multi-Specialty
                            Clinic</strong
                          >! Here are your appointment details:
                        </p>

                        <p class="text-body-2">
                          <strong>Date:</strong>
                          {{ doctors_date || form.date }} <br />
                          <strong>Time:</strong> {{ doctor_time || form.time }}
                          <br />

                          <strong v-if="doc_profile.length"> Doctor: </strong>
                          <span v-for="d in doc_profile" :key="d.id">
                            {{ d.name }}
                          </span>
                          <br />

                          <strong
                            v-if="clinicDecription.specialty !== 'Others'"
                          >
                            Specialization:
                          </strong>
                          {{ clinicDecription.specialty }}
                        </p>

                        <p class="text-body-2 mt-4">
                          ⚠ Please make sure to
                          <strong>take a screenshot</strong> of this message and
                          present it along with a valid ID upon arrival.
                        </p>
                        <p class="text-body-2 mt-4">
                          After your submission is successful, an SMS
                          notification will be sent to your mobile number.
                          Please ensure that the number you entered is correct
                          and valid.
                        </p>

                        <p class="text-body-2 mt-4">
                          For questions or clarifications, message us on our
                          official Facebook page:
                          <strong
                            >Paragon Diagnostics and Multi-Specialty
                            Clinic</strong
                          >
                        </p>
                      </div>

                      <!-- <v-card-actions class="mt-4">
                        <v-spacer></v-spacer>
                        <v-btn
                          variant="text"
                          color="red"
                          @click="confirmationDialog = false"
                        >
                          Cancel
                        </v-btn>
                        <v-btn
                          color="deep-purple-accent-4"
                          @click="confirmBooking"
                        >
                          Confirm
                        </v-btn>
                      </v-card-actions> -->
                    </v-card>
                  </v-col>
                  <!--    <v-col cols="12" md="6" v-show="info == 3">
                    <div class="mt-8">Profile:</div></v-col
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
                        <v-autocomplete
                          v-model="form.time"
                          small-chips
                          deletable-chips
                          :rules="[(v) => !!v || 'Time is required']"
                          label="Select Time"
                          :items="filteredTimes"
                          class="rounded-lg"
                          color="#6DB249"
                        ></v-autocomplete>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-menu
                          v-model="menuDoctorDate"
                          :close-on-content-click="false"
                          transition="scale-transition"
                          offset-y
                          min-width="auto"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="doctors_date"
                              label="Select Date"
                              prepend-icon="mdi-calendar"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                              :rules="[(v) => !!v || 'required']"
                              class="rounded-lg"
                              color="#6DB249"
                            />
                          </template>

                          <v-date-picker
                            v-model="doctors_date"
                            color="green"
                            :allowed-dates="allowedDoctorDates"
                            @input="
                              menuDoctorDate = false;
                              changeDoctorList();
                            "
                          />
                        </v-menu>

                        <br />
                        <v-autocomplete
                          v-model="doctor_selected"
                          small-chips
                          deletable-chips
                          :rules="[(v) => !!v || 'required']"
                          label="Select Doctor"
                          item-value="id"
                          item-text="name"
                          @change="changeSchedule(doctor_selected)"
                          :items="doctors_data"
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
                    </v-row>
                    <v-row v-else>
                      <v-col cols="12" md="6">
                        <v-menu
                          v-model="menuDoctorDate"
                          :close-on-content-click="false"
                          transition="scale-transition"
                          offset-y
                          min-width="auto"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="doctors_date"
                              label="Select Date"
                              prepend-icon="mdi-calendar"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                              :rules="[(v) => !!v || 'required']"
                              class="rounded-lg"
                              color="#6DB249"
                            />
                          </template>

                          <v-date-picker
                            v-model="doctors_date"
                            color="green"
                            :allowed-dates="allowedDoctorDates"
                            @input="
                              menuDoctorDate = false;
                              changeDoctorList();
                            "
                          />
                        </v-menu>

                        <br />
                        <v-autocomplete
                          v-model="doctor_selected"
                          small-chips
                          deletable-chips
                          :rules="[(v) => !!v || 'required']"
                          label="Select Doctor"
                          item-value="id"
                          item-text="name"
                          @change="changeSchedule(doctor_selected)"
                          :items="doctors_data"
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
                                <v-img
                                  style="width: 200px; height: 150px"
                                  :src="item.profile"
                                  @error="onImageError(item)"
                                ></v-img>
                              </div>
                              <div>
                                <p>
                                  Name:<b> Dr. {{ item.name }}</b>
                                </p>
                              </div>
                              <div>
                                <p>Field of expertise:</p>
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
                  </v-col> -->
                </v-row>
                <!-- <v-card-actions>
              
                  <v-spacer />
                  <v-btn
                    v-if="info != 1"
                    color="primary"
                    class="mt-4"
                    @click="info == 2 ? (info = 1) : (info = 2)"
                  >
                    Back
                  </v-btn>
                  <v-btn
                    v-if="info == 3"
                    :disabled="loading"
                    :loading="loading"
                    color="primary"
                    class="mt-4"
                    @click="confirmBooking()"
                  >
                    Submit
                  </v-btn>
                  <v-btn
                    v-if="info != 3"
                    color="primary"
                    class="mt-4"
                    @click="validateAndNext"
                  >
                    Next
                  </v-btn>
                </v-card-actions> -->
                <div class="floating-actions">
                  <v-btn
                    v-if="info != 1"
                    color="white"
                    fab
                    small
                    @click="info == 2 ? (info = 1) : (info = 2)"
                  >
                    <v-icon>mdi-arrow-left</v-icon>
                  </v-btn>

                  <v-btn
                    v-if="info == 3"
                    color="white"
                    :disabled="loading"
                    :loading="loading"
                    fab
                    small
                    @click="confirmBooking"
                  >
                    <v-icon>mdi-check</v-icon>
                  </v-btn>

                  <v-btn
                    v-if="info != 3"
                    color="white"
                    fab
                    small
                    @click="validateAndNext"
                  >
                    <v-icon>mdi-arrow-right</v-icon>
                  </v-btn>
                </div>
              </v-card>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <!-- <v-dialog v-model="confirmationDialog" max-width="550" persistent>
      <v-card class="pa-6 rounded-xl email-card">
        <div class="d-flex align-center mb-4">
          <v-icon color="deep-purple-accent-4" size="36"
            >mdi-email-outline</v-icon
          >
          <h2 class="ml-3 text-h6 font-weight-bold">
            Appointment Confirmation
          </h2>
        </div>

        <div class="email-content pa-4">
          <p class="text-body-2 mb-4">
            <strong>Subject:</strong> Submission of Appointment to PARAGON
          </p>

          <p class="text-body-2 mb-4">Hi {{ form.f_name }},</p>

          <p class="text-body-2 mb-4">
            Thank you for booking with
            <strong>Paragon Diagnostics & Multi-Specialty Clinic</strong>! Here
            are your appointment details:
          </p>

          <p class="text-body-2">
            <strong>Date:</strong> {{ doctors_date || form.date }} <br />
            <strong>Time:</strong> {{ doctor_time || form.time }} <br />

            <strong v-if="doc_profile.length"> Doctor: </strong>
            <span v-for="d in doc_profile" :key="d.id">
              {{ d.name }}
            </span>
            <br />

            <strong v-if="clinicDecription.specialty !== 'Others'">
              Specialization:
            </strong>
            {{ clinicDecription.specialty }}
          </p>

          <p class="text-body-2 mt-4">
            ⚠ Please make sure to <strong>take a screenshot</strong> of this
            message and present it along with a valid ID upon arrival.
          </p>
          <p class="text-body-2 mt-4">
            After your submission is successful, an SMS notification will be
            sent to your mobile number. Please ensure that the number you
            entered is correct and valid.
          </p>

          <p class="text-body-2 mt-4">
            For questions or clarifications, message us on our official Facebook
            page:
            <strong>Paragon Diagnostics and Multi-Specialty Clinic</strong>
          </p>
        </div>

        <v-card-actions class="mt-4">
          <v-spacer></v-spacer>
          <v-btn variant="text" color="red" @click="confirmationDialog = false">
            Cancel
          </v-btn>
          <v-btn color="deep-purple-accent-4" @click="confirmBooking">
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog> -->
    <!--Footer-->
    <v-footer padless color="primary">
      <v-container
        fluid
        class="white--text"
        style="padding-left: 10%; padding-right: 10%; padding-top: 40px"
      >
        <v-row>
          <!-- Brand -->
          <v-col cols="12" md="3">
            <div class="d-flex align-left justify-center mr-5 mb-5">
              <v-img
                src="../../assets/img/paragon logo website.png"
                max-width="36"
                class="mr-2"
                style="background-color: white; border-radius: 10px"
              />
              <div>
                <div class="font-weight-bold">PARAGON</div>
                <div class="caption white--text">
                  Diagnostics & Multi-Specialty Clinic
                </div>
              </div>
            </div>
            <p class="text-caption opacity-80 mb-5">
              Your trusted partner for comprehensive diagnostics and
              multi-specialty medical care. Committed to excellence in
              healthcare.
            </p>

            <div class="mt-4">
              <v-btn icon color="white"><v-icon>mdi-facebook</v-icon></v-btn>
              <v-btn icon color="white"><v-icon>mdi-instagram</v-icon></v-btn>
              <v-btn icon color="white"><v-icon>mdi-twitter</v-icon></v-btn>
              <v-btn icon color="white"><v-icon>mdi-linkedin</v-icon></v-btn>
            </div>
          </v-col>

          <!-- Quick Links -->
          <v-col cols="12" md="3">
            <h4 class="subtitle-1 font-weight-bold mb-3">Quick Links</h4>
            <div class="caption">Diagnostic Services</div>
            <div class="caption">Medical Specialties</div>
            <div class="caption">About Paragon</div>
            <div class="caption">Contact Us</div>
            <div class="caption">Patient Portal</div>
            <div class="caption">Careers</div>
          </v-col>

          <!-- Services -->
          <v-col cols="12" md="3">
            <h4 class="subtitle-1 font-weight-bold mb-3">Our Services</h4>
            <div class="caption">Laboratory Services</div>
            <div class="caption">Digital X-Ray</div>
            <div class="caption">Ultrasound Imaging</div>
            <div class="caption">ECG & Cardiac Tests</div>
            <div class="caption">Fetal Monitoring (NST)</div>
            <div class="caption">Specialist Consultations</div>
          </v-col>

          <!-- Contact -->
          <v-col cols="12" md="3">
            <h4 class="subtitle-1 font-weight-bold mb-3">Contact Info</h4>
            <p class="caption">
              <v-icon small left>mdi-map-marker</v-icon>
              123 Medical Plaza, Suite 450<br />
              Healthcare District, City 12345
            </p>
            <p class="caption">
              <v-icon small left>mdi-phone</v-icon>
              (555) 123-4567
            </p>
            <p class="caption">
              <v-icon small left>mdi-email</v-icon>
              info@paragondiagnostics.com
            </p>
          </v-col>
        </v-row>

        <v-divider class="my-6" dark></v-divider>

        <v-row align="center">
          <v-col cols="12" md="6" class="caption">
            © 2026 Paragon Diagnostics & Multi-Specialty Clinic. All rights
            reserved.
          </v-col>
          <v-col cols="12" md="6" class="text-right caption">
            Privacy Policy &nbsp; | &nbsp; Terms of Service &nbsp; | &nbsp;
            HIPAA Compliance
          </v-col>
        </v-row>
      </v-container>
    </v-footer>
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
import axios from "axios";
export default {
  // props: {
  //   data: Object,
  //   action: String,
  // },
  data() {
    return {
      loading: false,
      allowedDateList: [],
      selectedClinic: null,
      selectedIndex: null,
      clinicDecription: [],
      allTotalServices: null,
      serviceTotalPrice: null,
      packageTotalPrice: null,
      doctors_date: null,
      menuDoctorDate: false,
      doc_profile: [],
      doctor_time: null,
      doctors_schedList: [],
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
      dialog: false,
      confirmationDialog: false,
      hasPendingAppointment: false,
      provinceList: [],
      city_muniList: [],
      numberChecking: false,
      numberError: "",
      form: {
        spouse: null,
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
        region: null,
        province: null,
        city_muni: null,
        baranggay: null,
        purok: null,
      },
      doctors_data: [],
      doctor_selected: null,
      scheduledTimeList: null,
      baranggayList: [],
      clinicList: [],
      envProcess: process.env.VUE_APP_SERVER,
      regionList: [],
      dataPackages: [],
      genderList: ["Male", "Female"],
      statusList: ["Single", "Married", "Widow"],
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
    //Updated/////////
    availableTimesUpdate() {
      if (!this.doctors_date) return [];

      const schedule = this.scheduledTimeList.find(
        (s) => s.date === this.doctors_date,
      );

      if (!schedule) return [];

      return this.generateTimeSlots(schedule.timeFrom, schedule.timeTo);
    },
    dateRestriction() {
      return this.clinicDecription.specialty !== "Others"
        ? this.allowedDates
        : null;
    },
    ////Updated/////////////////

    allowedDoctorDates() {
      const allowedDatesArray = this.doctors_schedList.map((item) => item.date);
      return (date) => allowedDatesArray.includes(date);
    },
    contactNoRule() {
      return (v) => {
        if (!v || v.length !== 11) return "Contact number must be 11 digits";
        if (!/^0/.test(v)) return "Contact number must start with 0.";
        return true;
      };
    },
    filteredTimes() {
      const now = new Date();
      const todayStr = now.toISOString().split("T")[0]; // "YYYY-MM-DD"

      // Convert time like "02:00 PM" → total minutes
      const timeToMinutes = (t) => {
        const [time, modifier] = t.split(" ");
        let [hours, minutes] = time.split(":").map(Number);
        if (modifier === "PM" && hours !== 12) hours += 12;
        if (modifier === "AM" && hours === 12) hours = 0;
        return hours * 60 + minutes;
      };

      if (this.form.date === todayStr) {
        const nowMinutes = now.getHours() * 60 + now.getMinutes();
        return this.allTimes1.filter((t) => timeToMinutes(t) > nowMinutes);
      }
      return this.allTimes1;
    },

    remainingTimes() {
      const now = new Date();
      const todayStr = now.toISOString().split("T")[0];
      const timeToMinutes = (t) => {
        const [time, modifier] = t.split(" ");
        let [hours, minutes] = time.split(":").map(Number);
        if (modifier === "PM" && hours !== 12) hours += 12;
        if (modifier === "AM" && hours === 12) hours = 0;
        return hours * 60 + minutes;
      };

      if (this.doctors_date === todayStr) {
        const nowMinutes = now.getHours() * 60 + now.getMinutes();
        return this.allTimes1.filter((t) => timeToMinutes(t) > nowMinutes);
      }
      return this.allTimes1;
    },
    availableTimes() {
      if (!this.doctor_selected) return this.remainingTimes;
      // console.log(this.doctor_selected);
      const timeToMinutes = (t) => {
        const [time, modifier] = t.split(" ");
        let [hours, minutes] = time.split(":").map(Number);
        if (modifier === "PM" && hours !== 12) hours += 12;
        if (modifier === "AM" && hours === 12) hours = 0;
        return hours * 60 + minutes;
      };

      const bookedTimes = this.bookings
        .filter((b) => b.date === this.doctors_date)
        .map((b) => b.time.trim());

      console.log("bookedTimes", bookedTimes);

      const uniqueBooked = [...new Set(bookedTimes)];

      const docSchedule = this.doc_profile.find(
        (d) => d.oldDate === this.doctors_date,
      );

      let doctorTimes = this.remainingTimes;

      if (docSchedule) {
        const start = timeToMinutes(docSchedule.timeFrom);
        const end = timeToMinutes(docSchedule.timeTo);

        doctorTimes = this.remainingTimes.filter((t) => {
          const minutes = timeToMinutes(t);
          return minutes >= start && minutes <= end;
        });
      }
      let newTime = doctorTimes.filter((time) => !uniqueBooked.includes(time));

      return newTime;
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
    BdaymaxDate() {
      return new Date().toISOString().split("T")[0];
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
    // data: {
    //   handler(data) {
    //     console.log(data);
    //     this.dialog = true;
    //   },
    // },
  },
  mounted() {
    // this.getAllSchedule();

    this.getAllServices();
    this.getAllPackages();
    this.getAllClinic();
    this.getRegion();
  },
  methods: {
    onClinicChange(clinicId) {
      const index = this.clinicList.findIndex((item) => item.id === clinicId);

      if (index !== -1) {
        // this.selectedIndex = index;
        // this.selectButton(index);
        this.clinicData(this.clinicList[index]);
      }
    },
    validateAndNext() {
      const {
        f_name,
        l_name,
        age,
        civil_status,
        gender,
        occupation,
        contact_no,
        b_date,
        region,
        province,
        city_muni,
        baranggay,
        purok,
        address,
      } = this.form;

      const contactValid =
        contact_no && contact_no.length === 11 && /^0/.test(contact_no);

      const allFieldsFilled =
        f_name &&
        l_name &&
        age &&
        civil_status &&
        gender &&
        occupation &&
        contactValid &&
        b_date &&
        region &&
        province &&
        city_muni &&
        baranggay &&
        purok &&
        address;

      const noPendingAppointment = !this.hasPendingAppointment;

      if (allFieldsFilled && noPendingAppointment) {
        this.next();
      } else {
        this.alerts("No Data!");
      }
    },

    onImageError(item) {
      item.profile =
        this.envProcess + "/user-details/getProfileImg/img_avatar.png";
    },
    changeDoctorList() {
      let newArr = [];
      for (let i = 0; i < this.doctors_schedList.length; i++) {
        if (this.doctors_schedList[i].date == this.doctors_date) {
          newArr.push(this.doctors_schedList[i].doctors);
        }
      }
      this.doctors_data = newArr[0];
    },
    selectTimeButton(index, item) {
      // console.log("selectButton", this.scheduledTimeList);
      this.doctor_time = item;
      this.selectedIndex = index;
    },
    selectButton(index) {
      // console.log("selectButton", index);
      this.selectedIndex = index;
    },
    clinicData(item) {
      // console.log("clinicData", item);
      this.clinicDecription = item;
    },
    next() {
      if (this.info == 1) {
        this.info = 2;
      } else if (this.info == 2) {
        this.info = 3;
        // this.getAllDoctorsSchedule();
      }
    },
    toUppercase(field, value) {
      this.form[field] = value.toUpperCase();
    },
    alerts() {
      let message = "";

      if (this.hasPendingAppointment) {
        message = "This mobile number already has a pending appointment.";
      } else if (
        !this.form.contact_no ||
        this.form.contact_no.length !== 11 ||
        !/^0/.test(this.form.contact_no)
      ) {
        message =
          "Please enter a valid 11-digit mobile number starting with 0.";
      } else {
        message = "Please fill out all required fields before booking!";
      }

      this.fadeAwayMessage.show = true;
      this.fadeAwayMessage.type = "error";
      this.fadeAwayMessage.message = message;
      this.fadeAwayMessage.header = "System Message";

      this.info = 1;
      this.confirmationDialog = false;
    },
    async getMobileNumber() {
      this.numberChecking = true;
      this.axiosCall(
        "/appointment/checkMobileNumber/" + this.form.contact_no,
        "GET",
      ).then((res) => {
        if (res) {
          if (res.data.hasPending == true) {
            this.numberError =
              "This number has pending appointment, please select another number";
            this.hasPendingAppointment = true;
          } else {
            this.numberError = "";
            this.hasPendingAppointment = false;
          }
          this.numberChecking = false;
        }
      });
    },
    async fetchBookings(data) {
      try {
        const res = await this.axiosCall(
          "/appointment/getAllDoctorsAppointment/" + data[0].doctorID,
          "GET",
        );

        this.bookings = res.data;
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
      }
    },

    submitForm() {
      this.confirmationDialog = true;
    },

    //Updated//////////////////////////
    parseTimeToMinutes(time) {
      // "08:00 AM" → minutes
      const [timePart, modifier] = time.split(" ");
      let [hours, minutes] = timePart.split(":").map(Number);

      if (modifier === "PM" && hours !== 12) hours += 12;
      if (modifier === "AM" && hours === 12) hours = 0;

      return hours * 60 + minutes;
    },

    minutesToTime(minutes) {
      let hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      const modifier = hours >= 12 ? "PM" : "AM";

      hours = hours % 12;
      if (hours === 0) hours = 12;

      return `${hours}:${mins.toString().padStart(2, "0")} ${modifier}`;
    },

    generateTimeSlots(from, to, interval = 60) {
      const start = this.parseTimeToMinutes(from);
      const end = this.parseTimeToMinutes(to) + 1;

      const slots = [];
      for (let m = start; m < end; m += interval) {
        slots.push(this.minutesToTime(m));
      }
      return slots;
    },

    allowedDates(date) {
      return this.allowedDateList.includes(date);
    },
    getDoctorsSchedules(doctorID) {
      // console.log(doctorID);
      this.axiosCall(
        "/doctors-schedule/getSpecificDoctorData/" + doctorID,
        "GET",
      ).then((res) => {
        if (res) {
          this.scheduledTimeList = res.data;
          this.allowedDateList = res.data.map((i) => i.date);
          // console.log(res.data);
        }
      });
    },
    //////////////////////////////////////////////

    changeSchedule(sched) {
      // console.log(sched);
      let newArr = this.doctors_data.filter((doc) => doc.id == sched);
      if (!newArr.length) return;
      // console.log("newArr", newArr);

      for (let i = 0; i < newArr.length; i++) {
        newArr[i].oldDate = newArr[i].date; // keep track of the schedule date
        const profileUrl =
          process.env.VUE_APP_SERVER +
          "/user-details/getProfileImg/" +
          newArr[i].profile;
        newArr[i].profile = newArr[i].profile
          ? profileUrl
          : process.env.VUE_APP_SERVER +
            "/user-details/getProfileImg/img_avatar.png";
        newArr[
          i
        ].displayDate = `${newArr[i].date} From: ${newArr[i].timeFrom} To: ${newArr[i].timeTo}`;
      }
      this.doc_profile = newArr;
      this.fetchBookings(newArr);
    },

    getDoctorAvailableTimes(schedule) {
      const timeToMinutes = (t) => {
        const [time, modifier] = t.split(" ");
        let [hours, minutes] = time.split(":").map(Number);
        if (modifier === "PM" && hours !== 12) hours += 12;
        if (modifier === "AM" && hours === 12) hours = 0;
        return hours * 60 + minutes;
      };

      const start = timeToMinutes(schedule.timeFrom);
      const end = timeToMinutes(schedule.timeTo);

      return this.allTimes1.filter((t) => {
        const minutes = timeToMinutes(t);
        return minutes >= start && minutes <= end;
      });
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
        "GET",
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
            const obj = res.data;

            const list = Object.keys(obj).map((key) => ({
              id: key,
              ...obj[key],
            }));
            this.clinicList = [...list];
            // let others = {
            //   id: 1000,
            //   specialty: "Others",
            //   description: "No specific Clinic to visit!",
            //   doctors: [],
            // };

            // this.clinicList = [...list, others];
          }
        },
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
        "GET",
      ).then((res) => {
        if (res) {
          // console.log(res.data);

          let data = res.data;

          this.doctors_schedList = data;
        }
      });
    },
    confirmBooking() {
      const baranggayData = this.baranggayList.find(
        (item) => item.code === this.form.baranggay,
      );
      const regionData = this.regionList.find(
        (item) => item.code === this.form.region,
      );
      const provinceData = this.provinceList.find(
        (item) => item.code === this.form.province,
      );
      const cityMuniData = this.city_muniList.find(
        (item) => item.code === this.form.city_muni,
      );

      this.form.address =
        regionData.regionName +
        " " +
        provinceData.name +
        " " +
        cityMuniData.name +
        " " +
        baranggayData.name +
        " " +
        this.form.purok;

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
        region: this.form.region,
        province: this.form.province,
        city_muni: this.form.city_muni,
        baranggay: this.form.baranggay,
        purok: this.form.purok,
        address: this.form.address,
        spouse: this.form.spouse,
      };

      // console.log("Data Passed", data);

      this.axiosCall("/appointment/addPatient", "POST", data).then((res) => {
        // console.log(res.data.status, res.data.duplicate);
        let errorCode = res.data.duplicate;
        this.loading = true;
        if (errorCode == true) {
          // alert("Duplicate Patient");
          this.axiosCall(
            "/appointment/checkPatient/dataExist/" +
              this.form.f_name +
              "/" +
              this.form.l_name,
            "GET",
          ).then((res) => {
            if (res.data) {
              // alert("3");
              // this.fadeAwayMessage.show = true;
              // this.fadeAwayMessage.type = "success";
              // this.fadeAwayMessage.header = "System Message";
              // this.fadeAwayMessage.message = "Succesfully saved!";
              let data2 = {
                patientID: res.data.id,
                date:
                  this.clinicDecription.specialty == "Others" ||
                  !this.clinicDecription.doctors
                    ? this.form.date
                    : this.doctors_date,
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
                    : this.doctor_selected,
                data: JSON.stringify(
                  Object.assign(
                    data,
                    { doctor: this.doc_profile },
                    {
                      date:
                        this.clinicDecription.specialty == "Others" ||
                        !this.clinicDecription.doctors
                          ? this.form.date
                          : this.doctors_date,
                    },
                    {
                      time:
                        this.clinicDecription.specialty == "Others" ||
                        !this.clinicDecription.doctors
                          ? this.form.time
                          : this.doctor_time,
                    },
                  ),
                ),
              };
              console.log(data2);
              this.axiosCall(
                "/appointment/bookAppointment",
                "POST",
                data2,
              ).then((res) => {
                if (res.data.status == 200) {
                  this.fadeAwayMessage.show = true;
                  this.fadeAwayMessage.type = "success";
                  this.fadeAwayMessage.header = "System Message";
                  this.fadeAwayMessage.message = "Succesfully saved!";
                  let notif_data = {
                    appointmentID: res.data.saveID,
                    title: "Patient Appointment",
                    message: "View patient appointment!",
                    route:
                      this.clinicDecription.specialty == "Others"
                        ? "/appointment"
                        : "/patient",
                    assignedID:
                      this.clinicDecription.specialty == "Others"
                        ? 1
                        : this.doctor_selected,
                  };
                  this.axiosCall("/notification", "POST", notif_data).then(
                    (res) => {
                      if (res.data.status == 200) {
                        this.loading = false;
                        this.fadeAwayMessage.show = true;
                        this.fadeAwayMessage.type = "success";
                        this.fadeAwayMessage.header = "System Message";
                        this.fadeAwayMessage.message = "Succesfully saved!";
                        this.confirmationDialog = false;

                        // this.info = 1;
                        this.resetForm();
                        setTimeout(() => {
                          this.$router.push("/");
                        }, 2000);
                      } else {
                        this.fadeAwayMessage.show = true;
                        this.fadeAwayMessage.type = "error";
                        this.fadeAwayMessage.message = res.data.message;
                        this.fadeAwayMessage.header = "System Message";
                      }
                    },
                  );
                } else if (res.data.status == 400) {
                  this.fadeAwayMessage.show = true;
                  this.fadeAwayMessage.type = "error";
                  this.fadeAwayMessage.header = "System Message";
                  this.fadeAwayMessage.message = res.data.msg;
                }
              });
            }
          });
        } else {
          // this.fadeAwayMessage.show = true;
          // this.fadeAwayMessage.type = "success";
          // this.fadeAwayMessage.header = "System Message";
          // this.fadeAwayMessage.message = "Succesfully saved!";
          let data2 = {
            patientID: res.data.id,
            date:
              this.clinicDecription.specialty == "Others" ||
              !this.clinicDecription.doctors
                ? this.form.date
                : this.doctors_date,
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
                : this.doctor_selected,
            data: JSON.stringify(
              Object.assign(
                data,
                { doctor: this.doc_profile },
                {
                  date:
                    this.clinicDecription.specialty == "Others" ||
                    !this.clinicDecription.doctors
                      ? this.form.date
                      : this.doctors_date,
                },
                {
                  time:
                    this.clinicDecription.specialty == "Others" ||
                    !this.clinicDecription.doctors
                      ? this.form.time
                      : this.doctor_time,
                },
              ),
            ),
          };
          this.axiosCall("/appointment/bookAppointment", "POST", data2).then(
            (res) => {
              if (res.data.status == 200) {
                this.fadeAwayMessage.show = true;
                this.fadeAwayMessage.type = "success";
                this.fadeAwayMessage.header = "System Message";
                this.fadeAwayMessage.message = "Succesfully saved!";
                let notif_data = {
                  appointmentID: res.data.saveID,
                  title: "Patient Appointment",
                  message: "View patient appointment!",
                  route:
                    this.clinicDecription.specialty == "Others"
                      ? "/appointment"
                      : "/patient",
                  assignedID:
                    this.clinicDecription.specialty == "Others"
                      ? 1
                      : this.doctor_selected,
                };
                this.axiosCall("/notification", "POST", notif_data).then(
                  (res) => {
                    if (res.data.status == 200) {
                      this.loading = false;
                      this.fadeAwayMessage.show = true;
                      this.fadeAwayMessage.type = "success";
                      this.fadeAwayMessage.header = "Successfully Saved";
                      this.fadeAwayMessage.message = "Succesfully saved!";
                      this.confirmationDialog = false;
                      // this.$router.push("/");
                      // this.info = 1;
                      this.resetForm();
                      setTimeout(() => {
                        this.$router.push("/");
                      }, 2000);
                    } else {
                      this.fadeAwayMessage.show = true;
                      this.fadeAwayMessage.type = "error";
                      this.fadeAwayMessage.message = res.data.message;
                      this.fadeAwayMessage.header = "System Message";
                    }
                  },
                );
              } else if (res.data.status == 400) {
                this.fadeAwayMessage.show = true;
                this.fadeAwayMessage.type = "error";
                this.fadeAwayMessage.header = "Successfully Saved!";
                this.fadeAwayMessage.message = res.data.msg;
              }
            },
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
        this.form.b_date = null;
        this.form.age = null;
        this.fadeAwayMessage.show = true;
        this.fadeAwayMessage.type = "error";
        this.fadeAwayMessage.header = "System Message";
        this.fadeAwayMessage.message = "Invalid Input. Check your date entry";
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
      this.selected = [];
    },
    changeTime() {
      this.doctors_date = null;
      this.doctor_selected = null;
      this.form.date = null;
      this.doc_profile = [];
      this.doctors_schedList = [];
      this.allTimes1 = [
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
      ];
    },
    getRegion() {
      axios.get("https://psgc.gitlab.io/api/regions.json").then((res) => {
        this.regionList = res.data;
      });
    },
    changeRegion() {
      axios
        .get(
          "https://psgc.gitlab.io/api/regions/" +
            this.form.region +
            "/provinces.json",
        )
        .then((res) => {
          this.provinceList = res.data;
        });
    },
    changeProvince() {
      axios
        .get(
          "https://psgc.gitlab.io/api/provinces/" +
            this.form.province +
            "/cities-municipalities.json",
        )
        .then((res) => {
          this.city_muniList = res.data;
        });
    },
    changeCityMuni() {
      axios
        .get(
          "https://psgc.gitlab.io/api/cities-municipalities/" +
            this.form.city_muni +
            "/barangays.json",
        )
        .then((res) => {
          // console.log(res.data);
          if (res.data) {
            this.baranggayList = res.data;
          } else {
            alert("No data");
          }
        });
    },
    // onlyDigits(event) {
    //   const char = String.fromCharCode(event.keyCode);
    //   if (!/[0-9]/.test(char)) {
    //     event.preventDefault();
    //   }
    // },
    onlyDigits(event) {
      if (!/^\d$/.test(event.key)) {
        event.preventDefault();
      }
    },
    cleanDigits(event) {
      event.target.value = event.target.value.replace(/\D/g, "");
    },
    closeD() {
      this.dialog = false;
    },
    doHome() {
      this.$router.push("/");
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
  background-color: #0052a3;
  color: white;
}
.clinicButtons:focus {
  background-color: #0052a3;
  color: white;
}

.selected {
  background-color: #0052a3 !important;
  color: white !important;
}

.email-card {
  background: white;
  border-radius: 14px !important;
}

.email-content {
  border-left: 4px solid #0052a3;
  background: #faf8ff;
  border-radius: 8px;
}
.top-bar {
  height: 80px;
  border-bottom: 1px solid #eee;
  background: white;
  position: relative;
}
.floating-actions {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 16px;
  z-index: 999;
}
.date-picker-wrapper {
  width: 320px; /* any size you want */
}
</style>
