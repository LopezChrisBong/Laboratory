<template>
  <div>
    <v-dialog
      fullscreen
      v-model="dialog"
      persistent
      eager
      scrollable
      max-width="900px"
    >
      <v-form ref="MedicalInformation" @submit.prevent>
        <v-card>
          <v-card-title dark class="dialog-header pt-5 pb-5 pl-6">
            <span> {{ action }} Medical Information </span>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="closeD()">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text style="max-height: 700px" class="my-4">
            <v-container>
              <v-row>
                <v-col cols="12" class="">
                  <v-tabs v-model="activeTab" color="blue" align-tabs="left">
                    <v-tab
                      v-for="tab in tabList"
                      :key="tab.id"
                      @change="changeTab(tab)"
                      >{{ tab.name }}</v-tab
                    >
                  </v-tabs>
                </v-col>
              </v-row>
              <v-row v-show="tab == 1">
                <v-col cols="4">
                  <v-text-field
                    label="First Name"
                    v-model="f_name"
                    readonly
                    outlined
                    dense
                    disabled
                  ></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-text-field
                    label="Middle Name"
                    v-model="m_name"
                    readonly
                    outlined
                    dense
                    disabled
                  ></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-text-field
                    label="Last Name"
                    v-model="l_name"
                    readonly
                    outlined
                    dense
                    disabled
                  ></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-text-field
                    label="Suffix"
                    v-model="suffix"
                    readonly
                    disabled
                    outlined
                    dense
                  ></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-text-field
                    label="Sex"
                    v-model="gender"
                    readonly
                    outlined
                    disabled
                    dense
                  ></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-text-field
                    label="Civil Status"
                    v-model="civil_status"
                    readonly
                    outlined
                    dense
                    disabled
                  ></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-text-field
                    label="Birth Date"
                    v-model="b_date"
                    readonly
                    outlined
                    dense
                    disabled
                  ></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-text-field
                    label="Age"
                    v-model="age"
                    readonly
                    outlined
                    disabled
                    dense
                  ></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-text-field
                    label="Contact Number"
                    v-model="contact_number"
                    readonly
                    disabled
                    outlined
                    dense
                  ></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-text-field
                    label="Occupation"
                    v-model="occupation"
                    readonly
                    outlined
                    disabled
                    dense
                  ></v-text-field>
                  <v-text-field
                    label="Spouse"
                    v-model="spouse"
                    readonly
                    outlined
                    disabled
                    dense
                  ></v-text-field>
                </v-col>
                <v-col cols="8">
                  <v-textarea
                    label="Address"
                    v-model="address"
                    readonly
                    outlined
                    disabled
                    dense
                  ></v-textarea>
                </v-col>
              </v-row>
              <v-row v-show="tab == 2">
                <v-col cols="6" md="6">
                  <v-menu
                    ref="menu"
                    :close-on-content-click="false"
                    :return-value.sync="date"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        outlined
                        dense
                        v-model="date"
                        :rules="[formRules.required]"
                        chips
                        color="blue"
                        small-chips
                        label="Date*"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      color="blue"
                      v-model="date"
                      no-title
                      scrollable
                      :readonly="action == 'View'"
                    >
                      <v-spacer></v-spacer>

                      <v-btn text color="blue" @click="$refs.menu.save(date)">
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>

                <v-col cols="6" md="6">
                  <v-text-field
                    outlined
                    dense
                    v-model="docName"
                    chips
                    color="blue"
                    small-chips
                    label="Attending Physician"
                    readonly
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-row>
                    <!-- Pregnant Checkbox -->
                    <v-col cols="12" md="6">
                      <v-checkbox
                        v-model="pregnant"
                        :readonly="action === 'View'"
                        :disabled="!date"
                        true-value="1"
                        false-value="0"
                        label="Patient is Pregnant"
                        @change="changeMedical()"
                      />
                    </v-col>

                    <!-- Hint when disabled -->
                    <v-col
                      cols="12"
                      md="6"
                      class="d-flex justify-center align-center"
                    >
                      <small
                        v-if="!pregnant && !date"
                        class="text-caption text-grey"
                      >
                        ( Please select a date to enable pregnancy fields )
                      </small>
                    </v-col>
                  </v-row>

                  <!-- GTPAL Section -->
                  <v-expand-transition v-if="pregnant == true">
                    <v-row class="mt-2">
                      <v-col cols="12" md="12">
                        <v-sheet class="pa-4 rounded-lg elevation-1">
                          <div class="d-flex flex-wrap align-center">
                            <v-row>
                              <v-col cols="12" md="2">
                                <!-- G -->
                                <v-select
                                  v-model="Gnumber"
                                  :items="numberList"
                                  :rules="[formRules.required]"
                                  label="G*"
                                  dense
                                  outlined
                                  hide-details
                                  class="numberStyle mx-1"
                                />
                              </v-col>
                              <v-col cols="12" md="2">
                                <!-- P -->
                                <v-select
                                  v-model="Pnumber"
                                  :items="numberList"
                                  :rules="[formRules.required]"
                                  label="P*"
                                  dense
                                  outlined
                                  hide-details
                                  class="numberStyle mx-1"
                                />
                              </v-col>
                              <v-col cols="12" md="3"></v-col>
                              <v-col cols="12" md="1">
                                <!-- TPAL inside [ ] -->
                                <!-- <span class="mx-2">[</span> -->
                                <v-select
                                  v-model="Tnumber"
                                  :items="numberList2"
                                  label="T"
                                  dense
                                  outlined
                                  hide-details
                                  class="numberStyle mx-1"
                                />
                              </v-col>
                              <v-col cols="12" md="1">
                                <v-select
                                  v-model="PAnumber"
                                  :items="numberList2"
                                  label="P"
                                  dense
                                  outlined
                                  hide-details
                                  class="numberStyle mx-1"
                              /></v-col>
                              <v-col cols="12" md="1">
                                <v-select
                                  v-model="Anumber"
                                  :items="numberList2"
                                  label="A"
                                  dense
                                  outlined
                                  hide-details
                                  class="numberStyle mx-1"
                                />
                              </v-col>
                              <v-col cols="12" md="1">
                                <v-select
                                  v-model="Lnumber"
                                  :items="numberList2"
                                  label="L"
                                  dense
                                  outlined
                                  hide-details
                                  class="numberStyle mx-1"
                                />
                              </v-col>
                            </v-row>

                            <!-- <span class="mx-2">]</span> -->
                          </div>
                        </v-sheet>
                      </v-col>
                    </v-row>
                  </v-expand-transition>
                </v-col>
                <!-- <v-col cols="12" md="6" v-if="pregnant == false">
                  <v-menu
                    ref="menu1"
                    :close-on-content-click="false"
                    :return-value.sync="admitted"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        outlined
                        dense
                        v-model="admitted"
                        :rules="[formRules.required]"
                        chips
                        color="blue"
                        small-chips
                        label="Admitted "
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      color="blue"
                      v-model="admitted"
                      no-title
                      scrollable
                      :readonly="action == 'View'"
                    >
                      <v-spacer></v-spacer>

                      <v-btn
                        text
                        color="blue"
                        @click="$refs.menu1.save(admitted)"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>

                <v-col cols="12" md="6" v-if="pregnant == false">
                  <v-menu
                    ref="menu2"
                    :close-on-content-click="false"
                    :return-value.sync="discharge"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        outlined
                        dense
                        v-model="discharge"
                        :rules="[formRules.required]"
                        chips
                        color="blue"
                        small-chips
                        label="Discharge"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      color="blue"
                      v-model="discharge"
                      no-title
                      scrollable
                      :readonly="action == 'View'"
                    >
                      <v-spacer></v-spacer>

                      <v-btn
                        text
                        color="blue"
                        @click="$refs.menu2.save(discharge)"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col> -->

                <v-col cols="12" md="6" v-if="pregnant == true">
                  <v-menu
                    ref="menstrual"
                    :close-on-content-click="false"
                    :return-value.sync="menstrual"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        outlined
                        dense
                        v-model="menstrual"
                        chips
                        color="blue"
                        small-chips
                        label="Last Menstrual Date"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      color="blue"
                      v-model="menstrual"
                      no-title
                      scrollable
                      :readonly="action == 'View'"
                    >
                      <v-spacer></v-spacer>

                      <v-btn
                        text
                        color="blue"
                        @click="$refs.menstrual.save(menstrual)"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12" md="6" v-if="pregnant == true">
                  <v-menu
                    ref="menu3"
                    :close-on-content-click="false"
                    :return-value.sync="deliveryDate"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        outlined
                        dense
                        v-model="deliveryDate"
                        :rules="[formRules.required]"
                        chips
                        color="blue"
                        small-chips
                        label="Expected Delivery Date*"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      color="blue"
                      v-model="deliveryDate"
                      no-title
                      scrollable
                      :readonly="action == 'View'"
                    >
                      <v-spacer></v-spacer>

                      <v-btn
                        text
                        color="blue"
                        @click="$refs.menu3.save(deliveryDate)"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>

                <v-col cols="12" md="6" v-if="pregnant == true">
                  <v-text-field
                    v-model="prevPreg"
                    :readonly="action == 'View'"
                    dense
                    outlined
                    required
                    label="Number of Previous Pregnancies"
                    class="rounded-lg"
                    color="blue"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6" v-if="pregnant == true">
                  <v-text-field
                    v-model="liveBirths"
                    :readonly="action == 'View'"
                    dense
                    outlined
                    required
                    label="Number of Live Births"
                    class="rounded-lg"
                    color="blue"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6" v-if="pregnant == true">
                  <v-menu
                    ref="dateDelivered"
                    :close-on-content-click="false"
                    :return-value.sync="dateDelivered"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        outlined
                        dense
                        v-model="dateDelivered"
                        chips
                        color="blue"
                        small-chips
                        label="Date of Last Delivery"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      color="blue"
                      v-model="dateDelivered"
                      no-title
                      scrollable
                      :readonly="action == 'View'"
                    >
                      <v-spacer></v-spacer>

                      <v-btn
                        text
                        color="blue"
                        @click="$refs.dateDelivered.save(dateDelivered)"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>

                  <v-autocomplete
                    dense
                    outlined
                    :readonly="action == 'Add' ? false : true"
                    v-model="referred_by"
                    class="rounded-lg"
                    item-text="name"
                    item-value="id"
                    label="Referred By"
                    color="#93CB5B"
                    :items="docList"
                  >
                  </v-autocomplete>
                </v-col>
                <v-col cols="12" md="6" v-if="pregnant == true">
                  <div class="pa-2 rounded-lg" style="border: 1px solid #aaa">
                    <div class="text-caption">
                      Method of Previous Deliveries
                    </div>
                    <v-radio-group
                      v-model="deliveryMethod"
                      row
                      :rules="[formRules.required]"
                    >
                      <v-radio
                        label="Normal"
                        value="Normal"
                        :disabled="action == 'Add' ? false : true"
                      ></v-radio>
                      <v-radio
                        label="CS"
                        value="CS"
                        :disabled="action == 'Add' ? false : true"
                      ></v-radio>
                    </v-radio-group>
                  </div>
                </v-col>
                <v-col cols="12" md="4" v-if="pregnant == true">
                  <v-text-field
                    v-model="weight"
                    :readonly="action == 'View'"
                    :rules="[formRules.required]"
                    dense
                    outlined
                    required
                    label="Weight*"
                    class="rounded-lg"
                    color="blue"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="4" v-if="pregnant == true">
                  <v-text-field
                    v-model="bp"
                    :readonly="action == 'View'"
                    :rules="[formRules.required]"
                    dense
                    outlined
                    required
                    label="Blood Pressure*"
                    class="rounded-lg"
                    color="blue"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4" v-if="pregnant == true">
                  <v-text-field
                    v-model="am"
                    :readonly="action == 'View'"
                    :rules="[formRules.required]"
                    dense
                    outlined
                    required
                    label="Abdominal Measurement*"
                    class="rounded-lg"
                    color="blue"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="12" sm="12" v-if="pregnant == true">
                  <label for="Complain">
                    <strong><h3>Complain</h3></strong></label
                  >
                  <vue-editor
                    v-model="complain"
                    :disabled="action == 'View' ? true : false"
                    :editorToolbar="customToolbar"
                  ></vue-editor>
                </v-col>

                <v-col cols="12" md="12" sm="12">
                  <label for="finding">
                    <strong><h3>Finding</h3></strong></label
                  >
                  <vue-editor
                    v-model="finding"
                    :disabled="action == 'View' ? true : false"
                    :editorToolbar="customToolbar"
                  ></vue-editor>
                </v-col>
                <v-col cols="12" md="12" sm="12">
                  <label for="finding">
                    <strong> <h3>Treatment</h3></strong></label
                  >

                  <vue-editor
                    v-model="treatment"
                    :disabled="action == 'View' ? true : false"
                    :editorToolbar="customToolbar"
                  ></vue-editor>
                </v-col>

                <v-col cols="12" md="12" sm="12" v-if="pregnant == true">
                  <label for="finding">
                    <strong><h3>Assessment</h3></strong></label
                  >
                  <vue-editor
                    v-model="remarks"
                    :disabled="action == 'View' ? true : false"
                    :editorToolbar="customToolbar"
                  ></vue-editor>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-divider></v-divider>

          <v-card-actions class="pa-5">
            <v-spacer></v-spacer>
            <v-btn color="red" outlined @click="closeD()">
              <v-icon>mdi-close-circle-outline</v-icon>
              Cancel
            </v-btn>

            <v-btn
              v-if="action == 'Add'"
              color="blue"
              class="white--text"
              @click="add()"
            >
              <v-icon>mdi-check-circle</v-icon>
              Add
            </v-btn>

            <v-btn
              v-if="action == 'Update'"
              color="blue"
              class="white--text"
              @click="update()"
            >
              <v-icon>mdi-check-circle</v-icon>
              Update
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>

    <fade-away-message-component
      displayType="variation2"
      v-model="fadeAwayMessage.show"
      :message="fadeAwayMessage.message"
      :header="fadeAwayMessage.header"
      :top="fadeAwayMessage.top"
      :type="fadeAwayMessage.type"
      :timeout="3000"
    ></fade-away-message-component>
  </div>
</template>

<script>
import { VueEditor } from "vue2-editor";
export default {
  components: {
    VueEditor,
  },
  props: {
    data: null,
    action: null,
  },
  data() {
    return {
      f_name: null,
      m_name: null,
      l_name: null,
      suffix: null,
      b_date: null,
      age: null,
      contact_number: null,
      gender: null,
      address: null,
      civil_status: null,
      occupation: null,
      spouse: null,
      docName: null,
      finding: null,
      treatment: null,
      menstrual: null,
      dateDelivered: null,
      deliveryDate: null,
      prevPreg: null,
      Gnumber: null,
      Pnumber: null,
      PAnumber: null,
      Lnumber: null,
      complain: null,
      Tnumber: null,
      Anumber: null,
      liveBirths: null,
      deliveryMethod: null,
      referred_by: null,
      weight: null,
      discharge: null,
      admitted: null,
      bp: null,
      am: null,
      remarks: null,
      date: null,
      customToolbar: [
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        // [{ list: "bullet" }],
      ],
      updateID: null,
      pregnant: false,
      dialog: false,
      numberList: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
      numberList2: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
      yearSelection: [],
      fadeAwayMessage: {
        show: false,
        type: "success",
        header: "Successfully Added!",
        message: "",
        top: 10,
      },
      activeTab: { id: 1, name: "Personal Information" },
      tab: 1,
      tabList: [
        { id: 1, name: "Personal Information" },
        { id: 2, name: "Medical Record" },
      ],
      docList: [],
    };
  },

  computed: {},
  watch: {
    data: {
      handler(data) {
        this.dialog = true;
        this.getAllDoctor();
        this.activeTab = { id: 1, name: "Personal Information" };
        this.tab = 1;
        this.id = data.id;
        console.log("DATA", data.personal_details);
        if (data.personal_details) {
          console.log("DRE");
          this.f_name = data.personal_details.f_name;
          this.m_name = data.personal_details.m_name;
          this.l_name = data.personal_details.l_name;
          this.suffix = data.personal_details.suffix;
          this.b_date = data.personal_details.b_date;
          // this.age = data.personal_details.age;
          this.contact_number = data.personal_details.contact_number;
          this.gender = data.personal_details.gender;
          this.address = data.personal_details.address;
          // this.civil_status = data.personal_details.civil_status;
          // this.occupation = data.personal_details.occupation;
          // this.spouse = data.personal_details.spouse;
        } else {
          console.log("DRE121");
        }
        this.getDoctor(this.$store.state.user.id, data);

        if (data.id) {
          this.initialize();
          this.pregnant = data.pregnant;
          this.finding = data.finding;
          this.treatment = data.treatment;
          this.menstrual = data.menstrual;
          this.dateDelivered = data.dateDelivered;
          this.deliveryDate = data.deliveryDate;
          this.prevPreg = data.prevPreg;
          this.liveBirths = data.liveBirths;
          this.deliveryMethod = data.deliveryMethod;
          this.discharge = data.discharge;
          this.admitted = data.admitted;
          this.weight = data.weight;
          this.bp = data.bp;
          this.am = data.am;
          this.remarks = data.remarks;
          this.date = data.date;
          this.complain = data.complain;
          this.Gnumber = data.Gnumber;
          this.Pnumber = data.Pnumber;
          this.PAnumber = data.PAnumber;
          this.Lnumber = data.Lnumber;
          this.Tnumber = data.Tnumber;
          this.Anumber = data.Anumber;
          console.log(
            "AGE",
            this.calculateAge(data.personal_details.b_date, data.created_at)
          );
          this.age = data.age
            ? data.age
            : this.calculateAge(data.personal_details.b_date, data.created_at);
          this.civil_status = data.personal_details.civil_status;
          this.spouse = data.personal_details.spouse;
        } else {
          // if (this.$refs.MedicalInformation) {
          //   this.$refs.MedicalInformation.reset();
          // }
          this.initialize();
          this.age = this.calculateAge(data.personal_details.b_date, "now");
          this.civil_status = data.personal_details.civil_status;
          this.spouse = data.personal_details.spouse;
          this.finding = null;
          this.treatment = null;
          this.menstrual = null;
          this.dateDelivered = null;
          this.deliveryDate = null;
          this.prevPreg = null;
          this.liveBirths = null;
          this.deliveryMethod = null;
          this.weight = null;
          this.bp = null;
          this.am = null;
          this.remarks = null;
          this.date = null;
          this.pregnant = false;
          this.Gnumber = null;
          this.Pnumber = null;
          this.PAnumber = null;
          this.Lnumber = null;
          this.Tnumber = null;
          this.Anumber = null;
        }
      },
      deep: true,
    },
  },

  methods: {
    changeTab(tab) {
      this.activeTab = tab;
      this.tab = tab.id;
    },
    initialize() {
      this.changeMedical();
      // console.log(this.pregnant);
      this.genderList = [
        { id: 1, description: "Male" },
        { id: 2, description: "Female" },
      ];
    },
    changeMedical() {
      if (this.pregnant) {
        // Do something when checked
        console.log("Patient marked as pregnant");
      } else {
        // Do something when unchecked
        console.log("Patient unmarked as pregnant");
      }
    },

    calculateAge(bdate, yearTo) {
      let d = yearTo.split("T")[0];
      var dob = new Date(bdate);
      var dTo = yearTo == "now" ? new Date() : new Date(d);

      var dob1 = new Date(dob.getFullYear(), dob.getMonth(), dob.getDate());
      var dTo1 = new Date(dTo.getFullYear(), dTo.getMonth(), dTo.getDate());

      let age = dTo1.getFullYear() - dob1.getFullYear();
      const monthDifference = dTo1.getMonth() - dob1.getMonth();

      if (
        monthDifference < 0 ||
        (monthDifference === 0 && dTo1.getDate() < dob1.getDate())
      ) {
        age--;
      }
      console.log("AGE", age);
      return age;
    },
    getDoctor(docID, data) {
      this.axiosCall("/user-details/getAllVerifiedUser", "GET").then((res) => {
        if (!data.id) {
          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].id == docID) {
              this.docName = res.data[i].name;
            }
          }
        } else {
          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].id == data.doctorID) {
              this.docName = res.data[i].name;
            }
          }
        }
      });
    },

    getAllDoctor() {
      this.axiosCall("/user-details/doctors", "GET").then((res) => {
        this.docList = res.data;
      });
    },

    add() {
      let userID = this.$store.state.user.id;
      let data = {
        patientID:
          this.data.userIDd == null ? this.data.data.id : this.data.userIDd,
        doctorID: userID,
        appointmentID: this.data.data.appointmentID,
        finding: this.finding,
        treatment: this.treatment,
        menstrual: this.menstrual,
        dateDelivered: this.dateDelivered,
        deliveryDate: this.deliveryDate,
        prevPreg: this.prevPreg,
        liveBirths: this.liveBirths,
        deliveryMethod: this.deliveryMethod,
        weight: this.weight,
        bp: this.bp,
        am: this.am,
        remarks: this.remarks,
        date: this.date,
        pregnant: this.pregnant,
        Tnumber: this.Tnumber,
        Pnumber: this.Pnumber,
        PAnumber: this.PAnumber,
        Lnumber: this.Lnumber,
        Anumber: this.Anumber,
        Gnumber: this.Gnumber,
        discharge: this.discharge,
        admitted: this.admitted,
        complain: this.complain,
        age: this.age,
        spouse: this.spouse,
        civil_status: this.civil_status,
        referred_by: this.referred_by,
      };

      console.log(data);

      this.axiosCall("/medical-info/addMedicalInfo", "POST", data).then(
        (res) => {
          if (res.data.status == 200) {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "success";
            this.fadeAwayMessage.header = "Successfully Updated";
            this.dialog = false;
            this.closeD();
          } else if (res.data.status == 400) {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = res.data.msg;
          }
        }
      );
    },

    update() {
      let data = {
        id: this.data.id,
        finding: this.finding,
        treatment: this.treatment,
        menstrual: this.menstrual,
        dateDelivered: this.dateDelivered,
        deliveryDate: this.deliveryDate,
        prevPreg: this.prevPreg,
        liveBirths: this.liveBirths,
        deliveryMethod: this.deliveryMethod,
        weight: this.weight,
        bp: this.bp,
        am: this.am,
        remarks: this.remarks,
        date: this.date,
        pregnant: this.pregnant,
        discharge: this.discharge,
        admitted: this.admitted,
        complain: this.complain,
      };
      console.log(data);
      // let existingData =
      //   JSON.parse(localStorage.getItem("patientMedicalInfo")) || [];

      // let index = existingData.findIndex((item) => item.id === data.id);
      // // console.log(index);
      // if (index !== -1) {
      //   Object.assign(existingData[index], data);
      // } else {
      //   existingData.push(data);
      // }
      // localStorage.setItem("patientMedicalInfo", JSON.stringify(existingData));
      // this.fadeAwayMessage.show = true;
      // this.fadeAwayMessage.type = "success";
      // this.fadeAwayMessage.header = "System Message";
      // this.fadeAwayMessage.message = "Successfully Updated";
      // this.closeD();
    },

    // generateUUID() {
    //   return "xxxx-4xxx-yxxx-xxxx".replace(/[xy]/g, function(c) {
    //     const r = (Math.random() * 16) | 0;
    //     const v = c === "x" ? r : (r & 0x3) | 0x8;
    //     return v.toString(16);
    //   });
    // },
    closeD() {
      this.eventHub.$emit("closeMedicalInformation", false);
      this.dialog = false;
    },
  },
};
</script>
<style scoped>
.numberStyle {
  width: 100%;
}
</style>
