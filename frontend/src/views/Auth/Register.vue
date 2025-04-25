<template>
  <div>
    <v-container fluid fill-height class="content">
      <v-row align="center" justify="center">
        <v-col
          align="center"
          cols="12"
          md="6"
          sm="12"
          class="hidden-sm-and-down"
          ><v-card
            max-width="730"
            height="600"
            style="background: rgba(0,0,0,0.3);"
            class="d-flex justify-center align-center"
          >
            <div align="center">
              <div style="margin:0 auto; width:30%" class="pa-2">
                <v-img src="../../assets/img/logolaboratory.jpg"></v-img>
              </div>
              <div>
                <h2><strong> Welcome to COMPANY NAME</strong></h2>
              </div>
              <div>
                <v-card-text>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Voluptatibus, nemo molestias. <br />Vel praesentium laborum
                  architecto quia beatae sed, eaque quasi.
                </v-card-text>
              </div>
            </div>
          </v-card></v-col
        >
        <v-col align="center" cols="12" md="6">
          <v-card
            max-width="800"
            class="rounded-card"
            :class="['fadeIn', { showsFade: showsFade }]"
          >
            <div class="justify-center pa-4">
              <h3 style="color: #0e2b62">
                Create your <span style="color: #0e2b62">Account</span>
              </h3>
            </div>

            <v-form ref="Step1Formref" v-show="step.id == 1">
              <v-row class="mx-5 pt-4">
                <v-col cols="12" class="pa-0 px-4">
                  <v-text-field
                    outlined
                    color="#93CB5B"
                    dense
                    class="font-size-14"
                    v-model="firstname"
                    :rules="[formRules.required]"
                    label="Firstname"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" class="pa-0 px-4">
                  <v-text-field
                    outlined
                    color="#93CB5B"
                    dense
                    class="font-size-14"
                    v-model="middlename"
                    label="Middlename"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" class="pa-0 px-4">
                  <v-text-field
                    class="font-size-14"
                    color="#93CB5B"
                    v-model="lastname"
                    outlined
                    dense
                    :rules="[formRules.required]"
                    label="Surname"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" class="pa-0 px-4">
                  <v-text-field
                    outlined
                    dense
                    color="#93CB5B"
                    class="font-size-14"
                    v-model="suffix"
                    label="Suffix"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" class="pa-0 px-4 mt-2">
                  <v-text-field
                    outlined
                    dense
                    class="font-size-14"
                    v-model="email"
                    :rules="[formRules.required, formRules.email]"
                    label="Email address"
                    color="#93CB5B"
                    required
                    @change="checkEmail()"
                    :error-messages="emailError"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" class="pa-0 px-4 mt-2">
                  <v-text-field
                    class="font-size-14"
                    color="#93CB5B"
                    outlined
                    dense
                    v-model="password"
                    :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="[formRules.required, formRules.password]"
                    :type="show1 ? 'text' : 'password'"
                    name="input-10-1"
                    label="Password"
                    @click:append="show1 = !show1"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" class="pa-0 px-4 mt-2">
                  <v-text-field
                    class="font-size-14"
                    outlined
                    color="#93CB5B"
                    dense
                    v-model="confirmPassword"
                    :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="[
                      formRules.required,
                      formRules.confirmPassword(confirmPassword, password),
                    ]"
                    :type="show2 ? 'text' : 'password'"
                    name="input-10-1"
                    label="Confirm Password"
                    @click:append="show2 = !show2"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" class="pa-0 px-4">
                  <v-btn
                    :loading="isLoading"
                    @click="register()"
                    block
                    depressed
                    :color="$vuetify.theme.themes.light.submitBtns"
                    class="white--text py-5 font-size-14 rounded-lg"
                    >Register</v-btn
                  >
                </v-col>
              </v-row>
            </v-form>
            <v-col cols="12" class="pa-0">
              <div
                class="d-flex justify-center pt-8 pb-3 text-caption text-gray-100"
              >
                Already have an account?
                <router-link class="pl-2" to="/login"> Sign In</router-link>
              </div>
            </v-col>
          </v-card>
        </v-col>
      </v-row>
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
  name: "Register",
  mounted() {
    // this.OTPInput();
    setTimeout(() => {
      this.showsFade = true;
    }, 100);
    if (this.$store.state.user) {
      this.deleteToken();
      this.$store.dispatch("setUser", null);
      this.$store.dispatch("setEmail", null);
      this.$store.dispatch("setIsAuthenticated", 0);
      setTimeout(function() {
        location.reload();
      }, 0);
    }
    // if (this.$store.getters.getEmail) {
    //   this.step = { id: 4, name: "Otp Confirmation" };
    //   this.email = this.$store.getters.getEmail;
    // }
  },

  data: () => ({
    otp: null,
    timerCounts: 1,
    animated: false,
    termsDialog: true,
    showsFade: false,
    schoolLevel: null,
    isAgreed: null,
    step: { id: 1, name: "Personal Information" },
    isLoading: false,
    firstname: "",
    middlename: "",
    lastname: "",
    suffix: "",
    email: "",
    password: "",
    confirmPassword: "",
    positionID: null,
    instituteID: null,
    empStatusID: null,
    designationID: null,
    officeID: null,
    officeList: [],
    instituteList: [],
    designationList: [],
    positionList: [],
    empStatusList: [],
    schoolLevelList: [
      { id: 1, description: "Elementary" },
      { id: 2, description: "High School" },
    ],

    show1: false,
    show2: false,
    emailError: "",
    emailChecking: false,
    isEmailVerifying: false,
    enableOTPBtn: false,
    fadeAwayMessage: {
      show: false,
      type: "success",
      header: "Successfully Added!",
      message: "",
      top: 10,
    },
  }),
  beforeUnmount() {
    document.getElementById("first").value = "";
    document.getElementById("second").value = "";
    document.getElementById("third").value = "";
    document.getElementById("fourth").value = "";
    document.getElementById("fifth").value = "";
    document.getElementById("sixth").value = "";
  },
  methods: {
    agree() {
      this.termsDialog = false;
    },
    disagree() {
      this.$router.push("/");
    },
    // next() {
    //   if (this.step.id == 1) {
    //     if (this.$refs.Step1Formref.validate()) {
    //       this.step = { id: 2, name: "Account Information" };
    //     }
    //   }
    // },

    checkEmail() {
      this.emailChecking = true;
      this.axiosCall("/auth/checkEmailIfExist/" + this.email, "GET").then(
        (res) => {
          console.log(res.data);
          if (res.data) {
            this.emailError = "Email Already Exist!";
          } else {
            this.emailError = "";
          }
          this.emailChecking = false;
        }
      );
    },
    register() {
      // if (this.$refs.Step2Formref.validate())
      if (this.$refs.Step1Formref.validate()) {
        this.isLoading = true;
        let data = {
          fname: this.firstname,
          mname: this.middlename,
          lname: this.lastname,
          suffix: this.suffix,
          email: this.email,
          password: this.password,
        };

        this.axiosCall("/auth/registerUser", "POST", data).then((res) => {
          if (res.data.status == 201) {
            this.isLoading = false;
            this.$store.dispatch("setEmail", this.email);
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "success";
            this.fadeAwayMessage.message = res.data.message;
            this.fadeAwayMessage.header = "System Message";
            this.$router.push("/login");
          } else {
            this.isLoading = false;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.message = res.data.message;
            this.fadeAwayMessage.header = "System Message";
            this.animated = true;
          }
        });
      }
    },
  },
};
</script>

<style scoped>
.content {
  /* background-color: #2196F3; */
  background: url("../../assets/img/laboratorybg.png");
  background-position: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-position: center;
  background-repeat: no-repeat;
  background-size: 100vw 100vh;
}
.title {
  color: #fff;
  font-size: 35px !important;
  position: relative;
  font-weight: bold;
}
.title .underline {
  display: flex;
  justify-content: center;
  margin-top: 15px;
}
.title .underline .u1 {
  background: #fff;
  width: 40%;
  height: 5px;
  margin: 0 5px;
}
.title .underline .u2 {
  background: #fff;
  width: 5%;
  height: 5px;
  margin: 0 5px;
}
.lp-img {
  -webkit-filter: drop-shadow(5px 5px 5px rgba(0, 0, 0, 0.09));
  filter: drop-shadow(5px 5px 5px rgba(0, 0, 0, 0.09));
  border-radius: 50%;
  background: #fff;
}
.rounded-card {
  border-radius: 10px;
}
/* OTP */
#first,
#second,
#third,
#fourth,
#fifth,
#sixth {
  border: 2px solid;
  border-color: blue;
  width: 50px;
  height: 50px;
  border-radius: 10px;
  margin-right: 2px;
  margin-left: 2px;
  font-size: 28px;
  text-align: center;
}

.fadeIn {
  opacity: 0;
  transform: translate3d(50px, 0, 0);
  transition: 0.5s all ease-in-out;
}
.fadeIn.showsFade {
  opacity: 1;
  transform: translate3d(0, 0, 0);
}
</style>
