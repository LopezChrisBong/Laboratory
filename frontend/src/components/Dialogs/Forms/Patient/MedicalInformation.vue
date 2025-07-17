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
                <v-col cols="12" md="12">
                  <v-checkbox
                    :readonly="action == 'View'"
                    v-model="pregnant"
                    label="Check if the patient is pregnant"
                    @onchange="changeMedical()"
                  ></v-checkbox>
                </v-col>
                <v-col cols="6">
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

                <v-col cols="12" md="6" v-if="pregnant == true">
                  <v-text-field
                    v-model="menstrual"
                    :readonly="action == 'View'"
                    :rules="[formRules.required]"
                    dense
                    outlined
                    required
                    label="Last Menstrual Period"
                    class="rounded-lg"
                    color="blue"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6" v-if="pregnant == true">
                  <v-text-field
                    v-model="deliveryDate"
                    :readonly="action == 'View'"
                    :rules="[formRules.required]"
                    dense
                    outlined
                    required
                    label="Expected Delivery Date"
                    class="rounded-lg"
                    color="blue"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6" v-if="pregnant == true">
                  <v-text-field
                    v-model="prevPreg"
                    :readonly="action == 'View'"
                    :rules="[formRules.required]"
                    dense
                    outlined
                    required
                    label="No. of Previous Pregnancies"
                    class="rounded-lg"
                    color="blue"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6" v-if="pregnant == true">
                  <v-text-field
                    v-model="liveBirths"
                    :readonly="action == 'View'"
                    :rules="[formRules.required]"
                    dense
                    outlined
                    required
                    label="No. of Live Births"
                    class="rounded-lg"
                    color="blue"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6" v-if="pregnant == true">
                  <v-text-field
                    v-model="dateDelivered"
                    :readonly="action == 'View'"
                    :rules="[formRules.required]"
                    dense
                    outlined
                    required
                    label="Date of Last Delivery"
                    class="rounded-lg"
                    color="blue"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6" v-if="pregnant == true">
                  <v-text-field
                    v-model="deliveryMethod"
                    :readonly="action == 'View'"
                    :rules="[formRules.required]"
                    dense
                    outlined
                    required
                    label="Method of Previous Delivery"
                    class="rounded-lg"
                    color="blue"
                  ></v-text-field>
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

                <v-col col="12" md="12" v-if="pregnant == true">
                  <label for="finding">
                    <strong><h3>Remarks</h3></strong></label
                  >
                  <vue-editor
                    v-model="remarks"
                    :readonly="action == 'View'"
                    :editorToolbar="customToolbar"
                  ></vue-editor>
                </v-col>

                <v-col col="12" md="12" v-if="pregnant == false">
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
                <v-col col="12" md="12" v-if="pregnant == false">
                  <label for="finding">
                    <strong> <h3>Treatment</h3></strong></label
                  >

                  <vue-editor
                    v-model="treatment"
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
      liveBirths: null,
      deliveryMethod: null,
      weight: null,
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
          this.weight = data.weight;
          this.bp = data.bp;
          this.am = data.am;
          this.remarks = data.remarks;
          this.date = data.date;
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
        }
      },
      deep: true,
    },
  },

  methods: {
    initialize() {
      this.changeMedical();
      console.log(this.pregnant);
      this.genderList = [
        { id: 1, description: "Male" },
        { id: 2, description: "Female" },
      ];
    },
    changeMedical() {
      this.pregnant = true;
    },

    add() {
      let data = {
        patientID:
          this.data.userIDd == null ? this.data.data.id : this.data.userIDd,
        doctorID:
          this.data.data.doctorID != null ? this.data.data.doctorID : null,
        appointmentID: this.data.data.id != null ? this.data.data.id : null,
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
      };

      console.log(data, this.data.data.doctorID);

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
      };
      console.log(data);
      // let existingData =
      //   JSON.parse(localStorage.getItem("patientMedicalInfo")) || [];

      // let index = existingData.findIndex((item) => item.id === data.id);
      // console.log(index);
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
      // alert("LIvcew");
      this.eventHub.$emit("closeMedicalInformation", false);
      this.dialog = false;
    },
  },
};
</script>
