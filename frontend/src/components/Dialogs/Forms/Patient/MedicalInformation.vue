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
                <v-col cols="12" md="6">
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
                        label="Date"
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
                <v-col cols="12">
                  <v-row>
                    <!-- Pregnant Checkbox -->
                    <v-col cols="12" md="6" v-if="action != 'View'">
                      <v-checkbox
                        v-model="pregnant"
                        :readonly="action === 'View'"
                        :disabled="!date"
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
                                  label="G"
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
                                  label="P"
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
                        label="Expected Delivery Date"
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
                    v-model="weight"
                    :readonly="action == 'View'"
                    :rules="[formRules.required]"
                    dense
                    outlined
                    required
                    label="Weight"
                    class="rounded-lg"
                    color="blue"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6" v-if="pregnant == true">
                  <v-text-field
                    v-model="bp"
                    :readonly="action == 'View'"
                    :rules="[formRules.required]"
                    dense
                    outlined
                    required
                    label="Blood Pressure"
                    class="rounded-lg"
                    color="blue"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6" v-if="pregnant == true">
                  <v-text-field
                    v-model="am"
                    :readonly="action == 'View'"
                    :rules="[formRules.required]"
                    dense
                    outlined
                    required
                    label="Abdominal Measurement"
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
                    :readonly="action == 'View'"
                    :editorToolbar="customToolbar"
                  ></vue-editor>
                </v-col>

                <v-col cols="12" md="12" sm="12">
                  <label for="finding">
                    <strong
                      ><h3>
                        Finding
                      </h3></strong
                    ></label
                  >
                  <vue-editor
                    v-model="finding"
                    :readonly="action == 'View'"
                    :editorToolbar="customToolbar"
                  ></vue-editor>
                </v-col>
                <v-col cols="12" md="12" sm="12">
                  <label for="finding">
                    <strong> <h3>Treatment</h3></strong></label
                  >

                  <vue-editor
                    v-model="treatment"
                    :readonly="action == 'View'"
                    :editorToolbar="customToolbar"
                  ></vue-editor>
                </v-col>

                <v-col cols="12" md="12" sm="12" v-if="pregnant == true">
                  <label for="finding">
                    <strong><h3>Assessment</h3></strong></label
                  >
                  <vue-editor
                    v-model="remarks"
                    :readonly="action == 'View'"
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
    };
  },

  computed: {},
  watch: {
    data: {
      handler(data) {
        this.dialog = true;
        console.log("View Data", data);

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
        } else {
          if (this.$refs.MedicalInformation) {
            this.$refs.MedicalInformation.reset();
          }
          this.initialize();
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
    add() {
      let userID = this.$store.state.user.user.usertypeID;
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
