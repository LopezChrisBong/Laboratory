<template>
  <v-container fluid fill-height class="login-page">
    <!-- TOP BAR -->
    <v-row class="top-bar px-6" align="center">
      <v-col cols="4">
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

    <!-- LOGIN CARD -->
    <v-row align="center" justify="center" class="fill-height">
      <v-col cols="12" sm="8" md="4">
        <v-card class="pa-8 login-card" elevation="6">
          <div class="text-center mb-6">
            <h2 class="font-weight-bold">Sign in</h2>
            <p class="caption grey--text">
              Enter your credentials to access your account
            </p>
          </div>

          <v-form ref="Formref">
            <!-- USER TYPE -->
            <!-- <v-select
              v-model="userType"
              :items="userTypes"
              label="User Type"
              outlined
              dense
              class="mb-3"
              required
            /> -->

            <!-- EMAIL -->
            <v-text-field
              v-model="email"
              label="Email address"
              outlined
              dense
              @keyup.enter="dologin()"
              :rules="[formRules.required, formRules.email]"
              class="mb-3"
            />

            <!-- PASSWORD -->
            <v-text-field
              v-model="password"
              :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show1 ? 'text' : 'password'"
              label="Password"
              outlined
              dense
              @keyup.enter="dologin()"
              :rules="[formRules.required]"
              @click:append="show1 = !show1"
              class="mb-2"
            />

            <!-- REMEMBER ME -->
            <v-checkbox
              v-model="rememberMe"
              label="Remember me"
              dense
              class="mt-0"
            />

            <!-- SIGN IN -->
            <v-btn
              block
              color="primary"
              class="white--text mt-4"
              height="44"
              :loading="isLoading"
              @click="dologin"
            >
              Sign In
            </v-btn>

            <!-- LINKS -->
            <div class="text-center mt-6 caption">
              Doesn’t have an account?
              <router-link
                to="/register"
                class="primary--text font-weight-bold"
              >
                Register
              </router-link>
            </div>

            <div class="text-center mt-2 caption">
              <router-link to="/" class="primary--text">
                Back to Home
              </router-link>
            </div>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// import axios from "axios";
export default {
  name: "login",

  mounted() {
    setTimeout(() => {
      this.show = true;
    }, 100);
    this.getSchoolYear();
    if (this.$store.state.user) {
      if (!this.$store.state.user.usertype.id) {
        //this.deleteToken();
        setTimeout(function () {
          location.reload();
        }, 0);
      }
    }
  },
  methods: {
    dologin() {
      if (this.$refs.Formref.validate()) {
        this.isLoading = true;
        let data = {
          email: this.email,
          password: this.password,
        };
        this.axiosCall("/auth/login", "POST", data).then((res) => {
          this.isLoading = false;
          if (
            res.data.status == 200 ||
            res.data.status == 201 ||
            res.data.status == 202
          ) {
            // console.log(res.data);
            localStorage.setItem("token", res.data.token);
            this.$store.commit("setExpiryDate");
            location.reload();
            // setTimeout(() => {
            //   axios({
            //     method: "GET",
            //     url: process.env.VUE_APP_SERVER + "/employee/my-details",

            //     headers: { Authorization: `Bearer ${res.data.token}` },
            //   }).then((resp) => {
            //     this.$store.dispatch("setEmp", resp.data);
            // }, 500);
          } else {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.message = res.data.message;
            this.fadeAwayMessage.header = "System Message";
          }
        });
      }
    },

    doAppointment() {
      this.$router.push("/patient-appointment");
    },
    doHome() {
      this.$router.push("/");
    },
    doRegister() {
      this.$router.push("/register");
    },

    doForgotPassword() {
      this.$router.push("/forgot-pw");
    },
  },
  data: () => ({
    isLoading: false,
    email: "",
    password: "",
    show1: false,
    show: false,
    laboratory: null,
    show2: false,
    fadeAwayMessage: {
      show: false,
      type: "success",
      header: "Successfully Added!",
      message: "",
      top: 10,
    },
  }),
};
</script>

<style scoped>
.login-page {
  background: #f9fafc;
}

.top-bar {
  height: 64px;
  border-bottom: 1px solid #eee;
  background: white;
  position: relative;
}

.login-card {
  border-radius: 14px;
}

.v-input--selection-controls {
  margin-top: 0;
}
</style>
