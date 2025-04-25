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
                <h2><strong> Welcome to PARAGON</strong></h2>
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
            max-width="730"
            class="rounded-card"
            :class="['fadeIn', { show: show }]"
            align="start"
          >
            <v-form ref="Formref">
              <v-row class="mx-5 pt-6">
                <v-col cols="12" class="pa-0 mb-2">
                  <div
                    color="#123E4D"
                    align="center"
                    :class="
                      $vuetify.breakpoint.smAndDown ? 'text-h6' : 'text-h5'
                    "
                  >
                    <b>Laboratory Information System</b>
                  </div>
                  <!-- <div
                    color="#123E4D"
                    align="center"
                    :class="
                      $vuetify.breakpoint.smAndDown ? 'text-h6' : 'text-h5'
                    "
                  >
                    <b> Loading and Enrollment System</b>
                  </div> -->
                  <div style="margin:0 auto; width:45%" class="pa-2">
                    <v-img src="../../assets/img/Paragon Logo.png"></v-img>
                  </div>
                </v-col>
                <v-col cols="12" class="pa-0 px-4">
                  <v-text-field
                    color="#93CB5B"
                    class="font-size-14 rounded-lg"
                    v-model="email"
                    :rules="[formRules.required, formRules.email]"
                    label="Email address"
                    required
                    dense
                    outlined
                    @keyup.enter="dologin()"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" class="pa-0 px-4 mt-n2">
                  <v-text-field
                    color="#93CB5B"
                    class="font-size-14 rounded-lg "
                    v-model="password"
                    :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="[formRules.required]"
                    :type="show1 ? 'text' : 'password'"
                    name="input-10-1"
                    dense
                    label="Password"
                    outlined
                    @keyup.enter="dologin()"
                    @click:append="show1 = !show1"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" class="pa-0 px-4 mt-n2">
                  <div class="d-flex justify-center ">
                    <v-btn
                      block
                      :color="$vuetify.theme.themes.light.submitBtns"
                      class="white--text font-size-14 rounded-lg"
                      :loading="isLoading"
                      @click="dologin()"
                      >Sign In</v-btn
                    >
                  </div>
                </v-col>

                <v-col cols="12" class="mt-5 ">
                  <div
                    style="font-size:14px; "
                    class="d-flex justify-center  text-gray-100"
                  >
                    Don't have an account yet?
                    <!-- <b
                      style="color: #4597E8"
                      @click="doRegister()"
                      class="registerLink ml-2"
                      >Register Now</b
                    > -->
                    <router-link class="pl-2" to="/register">
                      Register Now!</router-link
                    >
                  </div>
                </v-col>
              </v-row>
            </v-form>
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
        setTimeout(function() {
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
            console.log(res.data);
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
    doRegister() {
      this.$router.push("/register");
    },
    doEnroll() {
      this.$router.push("/student-enroll");
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
.registerLink:hover {
  cursor: pointer;
  text-decoration: underline;
}
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
  line-height: 40px;
}
.title .underline {
  display: flex;
  justify-content: center;
  margin-top: 15px;
}
.title .underline .u1 {
  background: #fff;
  width: 70%;
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
  border-radius: 20px;
}
.fadeIn {
  opacity: 0;
  transform: translate3d(100px, 0, 0);
  transition: 0.5s all ease-in-out;
}
.fadeIn.show {
  opacity: 1;
  transform: translate3d(0, 0, 0);
}
</style>
