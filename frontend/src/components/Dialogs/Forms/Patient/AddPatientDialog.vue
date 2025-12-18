<template>
  <div>
    <v-dialog v-model="dialog" persistent eager scrollable max-width="1000px">
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
                    :readonly="assignedModuleID != 3"
                    required
                    label="*First Name"
                    class="rounded-lg"
                    color="blue"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="mname"
                    dense
                    :readonly="assignedModuleID != 3"
                    outlined
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
                    :readonly="assignedModuleID != 3"
                    required
                    label="*Last Name"
                    class="rounded-lg"
                    color="blue"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="2">
                  <v-text-field
                    v-model="suffix"
                    dense
                    outlined
                    :readonly="assignedModuleID != 3"
                    required
                    label="Suffix"
                    class="rounded-lg"
                    color="blue"
                  ></v-text-field>
                </v-col>
                <!-- <v-col cols="4">
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
                        label="*Date of Birth"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        @input="calculateAge(bdate)"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      color="blue"
                      v-model="bdate"
                      no-title
                      scrollable
                      @input="calculateAge"
                    >
                      <v-spacer></v-spacer>

                      <v-btn text color="blue" @click="$refs.menu.save(bdate)">
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col> -->
                <v-col cols="12" md="4" sm="12">
                  <v-text-field
                    label="*Birth Date"
                    v-model="bdate"
                    :readonly="assignedModuleID != 3"
                    :rules="[formRules.required]"
                    required
                    type="date"
                    dense
                    outlined
                    class="text-uppercase rounded-lg"
                    @input="calculateAge(bdate)"
                  />
                </v-col>
                <v-col cols="12" md="3">
                  <v-text-field
                    v-model="age"
                    type="number"
                    :rules="[formRules.required]"
                    dense
                    outlined
                    required
                    label="*Age"
                    :readonly="assignedModuleID != 3"
                    class="rounded-lg"
                    color="blue"
                  ></v-text-field> </v-col
                ><v-col cols="12" md="3">
                  <v-autocomplete
                    v-model="gender"
                    :rules="[formRules.required]"
                    dense
                    outlined
                    :readonly="assignedModuleID != 3"
                    label="*Sex"
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
                    label="*Contact No."
                    color="#6DB249"
                    type="text"
                    :readonly="assignedModuleID != 3"
                    maxlength="11"
                    dense
                    outlined
                    class="rounded-lg"
                    @keypress="onlyDigits"
                    @input="cleanDigits"
                    :rules="[contactNoRule]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <!-- <v-text-field
                    v-model="cstatus"
                    :rules="[formRules.required]"
                    dense
                    outlined
                    required
                    label="Civil Status"
                    class="rounded-lg"
                    color="blue"
                  ></v-text-field> -->
                  <v-autocomplete
                    v-model="cstatus"
                    :rules="[formRules.required]"
                    dense
                    outlined
                    :readonly="assignedModuleID != 3"
                    label="*Civil Status"
                    class="rounded-lg"
                    item-text="description"
                    item-value="description"
                    color="#96CB5B"
                    :items="[
                      { id: 1, description: 'Single' },
                      { id: 2, description: 'Married' },
                      { id: 3, description: 'Wiidow' },
                    ]"
                  >
                  </v-autocomplete>
                </v-col>
                <v-col cols="12" md="12" v-if="cstatus == 'Married'">
                  <v-text-field
                    v-model="spouse"
                    :rules="[formRules.required]"
                    dense
                    outlined
                    :readonly="assignedModuleID != 3"
                    required
                    label="*Spouse"
                    class="rounded-lg"
                    color="blue"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" :md="action == 'Add' ? '6' : '12'">
                  <v-text-field
                    v-model="occupation"
                    :rules="[formRules.required]"
                    dense
                    outlined
                    :readonly="assignedModuleID != 3"
                    required
                    label="*Occupation"
                    class="rounded-lg"
                    color="blue"
                  ></v-text-field>
                </v-col>
                <v-col v-if="action != 'Add'" cols="12" md="12" sm="12">
                  <v-text-field
                    label="*Address"
                    v-model="address"
                    :rules="[formRules.required]"
                    class="text-uppercase rounded-lg"
                    dense
                    outlined
                    :readonly="assignedModuleID != 3"
                    required
                  />
                </v-col>

                <v-col cols="12" md="6" v-if="action == 'Add'">
                  <!-- <v-text-field
                      label="*Address"
                      v-model="form.address"
                      :rules="[formRules.required]"
                      class="text-uppercase"
                      required
                      @input="toUppercase('address', $event)"
                    /> -->
                  <v-autocomplete
                    v-model="region"
                    :rules="[formRules.required]"
                    dense
                    class="rounded-lg"
                    outlined
                    :readonly="assignedModuleID != 3"
                    item-text="regionName"
                    item-value="code"
                    label="*Region"
                    color="#93CB5B"
                    :items="regionList"
                    @change="changeRegion()"
                  >
                  </v-autocomplete>
                </v-col>
                <v-col cols="12" md="6" v-if="action == 'Add'">
                  <v-autocomplete
                    v-model="province"
                    :rules="[formRules.required]"
                    dense
                    class="rounded-lg"
                    item-text="name"
                    item-value="code"
                    label="*Province"
                    :readonly="assignedModuleID != 3"
                    outlined
                    color="#93CB5B"
                    :items="provinceList"
                    @change="changeProvince()"
                  >
                  </v-autocomplete>
                </v-col>
                <v-col cols="12" md="6" v-if="action == 'Add'">
                  <v-autocomplete
                    v-model="city_muni"
                    :rules="[formRules.required]"
                    dense
                    class="rounded-lg"
                    item-text="name"
                    outlined
                    item-value="code"
                    label="*City/Municipality"
                    :readonly="assignedModuleID != 3"
                    color="#93CB5B"
                    :items="city_muniList"
                    @change="changeCityMuni()"
                  >
                  </v-autocomplete>
                </v-col>
                <v-col cols="12" md="6" v-if="action == 'Add'">
                  <v-autocomplete
                    v-model="baranggay"
                    :rules="[formRules.required]"
                    dense
                    :readonly="assignedModuleID != 3"
                    class="rounded-lg"
                    item-text="name"
                    item-value="code"
                    outlined
                    label="*Baranggay"
                    color="#93CB5B"
                    :items="baranggayList"
                  >
                  </v-autocomplete>
                </v-col>
                <v-col cols="12" md="6" v-if="action == 'Add'">
                  <v-text-field
                    label="*Street/Purok"
                    v-model="purok"
                    :rules="[formRules.required]"
                    outlined
                    class="text-uppercase rounded-lg"
                    required
                    :readonly="assignedModuleID != 3"
                    dense
                  />
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
              v-if="action == 'Add' && assignedModuleID == 3"
              @click="add('ADD')"
            >
              <v-icon>mdi-check-circle</v-icon>
              Add
            </v-btn>
            <v-btn
              color="blue"
              class="white--text"
              v-if="action == 'View' && assignedModuleID == 3"
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
import axios from "axios";
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
      assignedModuleID: null,
      region: null,
      regionList: [],
      province: null,
      provinceList: [],
      city_muni: null,
      purok: null,
      city_muniList: [],
      baranggay: null,
      baranggayList: [],
      dialog: false,
      bdate: null,
      medicalDate: null,
      spouse: null,
      genderList: [],
      gender: null,
      suffix: null,
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

  computed: {
    contactNoRule() {
      return (v) => {
        if (!v || v.length !== 11) return "Contact number must be 11 digits";
        if (!/^0/.test(v)) return "Contact number must start with 0.";
        return true;
      };
    },
  },
  watch: {
    data: {
      handler(data) {
        this.dialog = true;
        console.log("View Data", data);

        if (data.id) {
          this.initialize();
          this.fname = data.f_name;
          this.suffix = data.suffix;
          this.lname = data.l_name;
          this.mname = data.m_name;
          this.gender = data.gender;
          this.address = data.address;
          this.number = data.contact_no;
          this.age = data.age;
          this.cstatus = data.civil_status;
          this.occupation = data.occupation;
          this.bdate = data.b_date;
          this.region = data.region.toString();
          this.province = data.province.toString();
          this.city_muni = data.city_muni.toString();
          this.baranggay = data.baranggay.toString();
          this.purok = data.purok;
          this.spouse = data.spouse;
        } else {
          this.$refs.AddPatient.reset();
          this.initialize();
          this.fname = null;
          this.suffix = null;
          this.lname = null;
          this.mname = null;
          this.gender = null;
          this.address = null;
          this.number = null;
          this.age = null;
          this.occupation = null;
          this.bdate = null;
          this.spouse = null;
        }
      },
      deep: true,
    },
  },

  methods: {
    initialize() {
      this.getRegion();
      this.assignedModuleID = this.$store.state.user.user.assignedModuleID;
      this.genderList = [
        { id: 1, description: "Male" },
        { id: 2, description: "Female" },
      ];
    },
    calculateAge(birthDate) {
      if (!birthDate) return;

      const currentDate = new Date();
      const date = new Date(birthDate);

      if (date > currentDate) {
        this.bdate = null;
        this.age = null;
        alert("Invalid Date of Birth");
        return; // <-- You missed this
      }

      const diffTime = currentDate - date;
      const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      this.age = Math.floor(totalDays / 365.25);
    },
    add(type) {
      if (type == "ADD") {
        if (this.$refs.AddPatient.validate()) {
          const baranggayData = this.baranggayList.find(
            (item) => item.code === this.baranggay
          );
          const regionData = this.regionList.find(
            (item) => item.code === this.region
          );
          const provinceData = this.provinceList.find(
            (item) => item.code === this.province
          );
          const cityMuniData = this.city_muniList.find(
            (item) => item.code === this.city_muni
          );
          this.address =
            regionData.regionName +
            " " +
            provinceData.name +
            " " +
            cityMuniData.name +
            " " +
            baranggayData.name +
            " " +
            this.purok;
          let data = {
            f_name: this.fname,
            suffix: this.suffix,
            l_name: this.lname,
            m_name: this.mname,
            age: this.age,
            civil_status: this.cstatus,
            gender: this.gender,
            address: this.address,
            contact_no: this.number,
            occupation: this.occupation,
            b_date: this.bdate,
            region: this.region,
            province: this.province,
            city_muni: this.city_muni,
            baranggay: this.baranggay,
            purok: this.purok,
            spouse: this.spouse,
          };
          // console.log(data);
          this.axiosCall("/appointment/addPatient", "POST", data).then(
            (res) => {
              let errorCode = res.data.duplicate;
              if (errorCode == true) {
                this.fadeAwayMessage.show = true;
                this.fadeAwayMessage.type = "error";
                this.fadeAwayMessage.header = "Patient Already Exist!";
              } else {
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
            }
          );
        } else {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "Please fill all field before saving!";
        }
      } else if (type == "UPDATE") {
        // alert(this.data.id);
        if (this.$refs.AddPatient.validate()) {
          let data = {
            f_name: this.fname,
            suffix: this.suffix,
            l_name: this.lname,
            m_name: this.mname,
            age: this.age,
            civil_status: this.cstatus,
            gender: this.gender,
            address: this.address,
            contact_no: this.number,
            occupation: this.occupation,
            b_date: this.bdate,
            spouse: this.spouse,
            //   pregnant: this.pregnant,
          };
          this.axiosCall(
            "/appointment/updatePatientInfo/" + this.data.id,
            "PATCH",
            data
          ).then((res) => {
            if (res.data.status == 201) {
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = "success";
              this.fadeAwayMessage.header = "System Message";
              this.fadeAwayMessage.message = "Successfully Updated";
              this.closeD();
            } else if (res.data.status == 400) {
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = "error";
              this.fadeAwayMessage.header = res.data.msg;
            }
          });
        } else {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "Please fill all field before saving!";
        }
      }
    },
    generateUUID() {
      return "xxxx-4xxx-yxxx-xxxx".replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    },
    closeD() {
      this.eventHub.$emit("closeAddPatient", false);
      this.dialog = false;
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
            this.region +
            "/provinces.json"
        )
        .then((res) => {
          this.provinceList = res.data;
        });
    },
    changeProvince() {
      axios
        .get(
          "https://psgc.gitlab.io/api/provinces/" +
            this.province +
            "/cities-municipalities.json"
        )
        .then((res) => {
          this.city_muniList = res.data;
        });
    },
    changeCityMuni() {
      axios
        .get(
          "https://psgc.gitlab.io/api/municipalities/" +
            this.city_muni +
            "/barangays.json"
        )
        .then((res) => {
          this.baranggayList = res.data;
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
  },
};
</script>
