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
      <v-form ref="AddPatient" @submit.prevent>
        <v-card>
          <v-card-title dark class="dialog-header pt-5 pb-5 pl-6">
            <span>{{ action }} Patient</span>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="closeD()">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text style="max-height: 700px" class="my-4">
            <v-container>
              <v-row>
                <!-- <v-col cols="12" md="12">
                  <v-checkbox
                    v-model="pregnant"
                    label="Check if the patient is pregnant"
                  ></v-checkbox>
                </v-col> -->
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="fname"
                    :rules="[formRules.required]"
                    dense
                    outlined
                    required
                    label="First Name"
                    class="rounded-lg"
                    color="blue"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="mname"
                    :rules="[formRules.required]"
                    dense
                    outlined
                    required
                    label="Middle Name"
                    class="rounded-lg"
                    color="blue"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="lname"
                    :rules="[formRules.required]"
                    dense
                    outlined
                    required
                    label="Last Name"
                    class="rounded-lg"
                    color="blue"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="age"
                    :rules="[formRules.required]"
                    dense
                    outlined
                    required
                    label="Age"
                    class="rounded-lg"
                    color="blue"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="cstatus"
                    :rules="[formRules.required]"
                    dense
                    outlined
                    required
                    label="Civil Status"
                    class="rounded-lg"
                    color="blue"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                  <v-autocomplete
                    v-model="gender"
                    :rules="[formRules.required]"
                    dense
                    outlined
                    label="Gender"
                    class="rounded-lg"
                    item-text="description"
                    item-value="description"
                    color="#96CB5B"
                    :items="genderList"
                  >
                  </v-autocomplete>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="number"
                    :rules="[formRules.required]"
                    dense
                    outlined
                    required
                    label="Contanct Number"
                    class="rounded-lg"
                    color="blue"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="occupation"
                    :rules="[formRules.required]"
                    dense
                    outlined
                    required
                    label="Occupation"
                    class="rounded-lg"
                    color="blue"
                  ></v-text-field>
                </v-col>

                <v-col cols="6">
                  <v-menu
                    ref="menu"
                    :close-on-content-click="false"
                    :return-value.sync="bdate"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        outlined
                        dense
                        v-model="bdate"
                        :rules="[formRules.required]"
                        chips
                        color="blue"
                        small-chips
                        label="Date of Birth"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      color="blue"
                      v-model="bdate"
                      no-title
                      scrollable
                    >
                      <v-spacer></v-spacer>

                      <v-btn text color="blue" @click="$refs.menu.save(bdate)">
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>

                <v-col cols="12" md="12">
                  <v-text-field
                    v-model="address"
                    :rules="[formRules.required]"
                    dense
                    outlined
                    required
                    label="Address"
                    class="rounded-lg"
                    color="blue"
                  ></v-text-field>
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
              color="blue"
              class="white--text"
              v-if="action == 'Add'"
              @click="add('ADD')"
            >
              <v-icon>mdi-check-circle</v-icon>
              Add
            </v-btn>
            <v-btn
              color="blue"
              class="white--text"
              v-if="action == 'View'"
              @click="add('UPDATE')"
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
export default {
  components: {},
  props: {
    data: Object,
    action: String,
  },
  data() {
    return {
      updateID: null,
      //   pregnant: false,
      dialog: false,
      bdate: null,
      medicalDate: null,
      genderList: [],
      gender: null,
      fname: null,
      lname: null,
      mname: null,
      age: null,
      cstatus: null,
      number: null,
      occupation: null,
      address: null,
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
          this.fname = data.f_name;
          this.lname = data.l_name;
          this.mname = data.m_name;
          this.gender = data.gender;
          this.address = data.address;
          this.number = data.contact_no;
          this.age = data.age;
          this.cstatus = data.civil_status;
          this.occupation = data.occupation;
          this.bdate = data.b_date;
        } else {
          this.$refs.AddPatient.reset();
          this.initialize();
          this.fname = null;
          this.lname = null;
          this.mname = null;
          this.gender = null;
          this.address = null;
          this.number = null;
          this.age = null;
          this.occupation = null;
          this.bdate = null;
        }
      },
      deep: true,
    },
  },

  methods: {
    initialize() {
      this.genderList = [
        { id: 1, description: "Male" },
        { id: 2, description: "Female" },
      ];
    },

    add(type) {
      if (type == "ADD") {
        let data = {
          f_name: this.fname,
          l_name: this.lname,
          m_name: this.mname,
          age: this.age,
          civil_status: this.cstatus,
          gender: this.gender,
          address: this.address,
          contact_no: this.number,
          occupation: this.occupation,
          b_date: this.bdate,
        };
        this.axiosCall("/appointment/addPatient", "POST", data).then((res) => {
          if (res.data.status == 200) {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "success";
            this.fadeAwayMessage.header = "Successfully Updated";
            this.dialog = false;
            this.close();
          } else if (res.data.status == 400) {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = res.data.msg;
          }
        });
      } else if (type == "UPDATE") {
        // alert("UPDATED");

        let data = {
          fname: this.fname,
          lname: this.lname,
          mname: this.mname,
          age: this.age,
          cstatus: this.cstatus,
          gender: this.gender,
          address: this.address,
          number: this.number,
          occupation: this.occupation,
          bdate: this.bdate,
          //   pregnant: this.pregnant,
        };
        let existingData =
          JSON.parse(localStorage.getItem("patientData")) || [];

        let index = existingData.findIndex((item) => item.id === data.id);

        if (index !== -1) {
          Object.assign(existingData[index], data);
        } else {
          existingData.push(data);
        }
        localStorage.setItem("patientData", JSON.stringify(existingData));
        this.fadeAwayMessage.show = true;
        this.fadeAwayMessage.type = "success";
        this.fadeAwayMessage.header = "System Message";
        this.fadeAwayMessage.message = "Successfully Updated";
        this.closeD();
      }
    },
    generateUUID() {
      return "xxxx-4xxx-yxxx-xxxx".replace(/[xy]/g, function(c) {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    },
    closeD() {
      this.eventHub.$emit("closeAddPatient", false);
      this.dialog = false;
    },
  },
};
</script>
