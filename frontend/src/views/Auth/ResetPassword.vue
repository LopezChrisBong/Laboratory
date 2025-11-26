<template>
  <div>
    <v-container fluid fill-height class="content">
      <v-row align="center" justify="center">
        <v-col align="center" cols="12" md="6">
          <v-card max-width="500" class="rounded-card" align="start">
            <v-form ref="Formref" @submit.prevent>
              <v-row class="mx-5 pt-12">
                <v-col cols="12" class="pa-0 px-4 mb-2">
                  <div class="text-h6" align="center">
                    <strong>Forgot Password |</strong> Password Reset
                  </div>
                  <v-divider class="mt-2 mb-2"></v-divider>
                </v-col>
                <v-col
                  v-if="showEmail == true"
                  cols="12"
                  class="pa-0 px-4 mt-3"
                >
                  <v-text-field
                    color="blue"
                    class="font-size-14 rounded-lg"
                    v-model="email"
                    :rules="
                      showEmail == true
                        ? [formRules.required, formRules.email]
                        : []
                    "
                    label="Email address"
                    dense
                    required
                    outlined
                  ></v-text-field>
                </v-col>
                <v-col cols="12" class="mb-5">
                  <div class="d-flex justify-center" v-if="showEmail == true">
                    <v-btn
                      block
                      depressed
                      :color="$vuetify.theme.themes.light.submitBtns"
                      class="white--text py-2 font-size-15 rounded-lg"
                      :loading="isLoading"
                      @click="checkEmail()"
                      >Send new password to email</v-btn
                    >
                  </div>
                  <div class="d-flex justify-center" v-if="showPass == true">
                    <v-btn
                      block
                      depressed
                      :color="$vuetify.theme.themes.light.submitBtns"
                      class="white--text py-2 font-size-15 rounded-lg"
                      :loading="isLoading"
                      @click="changePass()"
                      >Reset Password</v-btn
                    >
                  </div>
                </v-col>
                <v-col cols="12" class="pa-0 px-4 mb-5">
                  <div class="d-flex justify-center pb-3 font-size-14">
                    Already have an account?
                    <router-link class="pl-2" to="/login"> Sign In</router-link>
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
export default {
  mounted() {
    this.OTPInputs();

    if (this.$store.state.email) {
      this.showEmail = false;
      this.showPass = false;
      this.showOTP = true;
    }
  },

  data: () => ({
    isLoading: false,
    user_id: "",
    email: "",
    password: "",
    confirm_pass: "",
    otp: "",
    showEmail: true,
    showOTP: false,
    showPass: false,
    show1: false,
    show2: false,
    fadeAwayMessage: {
      show: false,
      type: "success",
      header: "Successfully Added!",
      message: "",
      top: 10,
    },
  }),
  methods: {
    OTPInputs() {
      const inputs = document.querySelectorAll("#otp > *[id]");
      for (let i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener("keydown", function(event) {
          if (event.key === "Backspace") {
            inputs[i].value = "";
            if (i !== 0) inputs[i - 1].focus();
          } else {
            if (i === inputs.length - 1 && inputs[i].value !== "") {
              return true;
            } else if (event.keyCode > 47 && event.keyCode < 58) {
              inputs[i].value = event.key;
              if (i !== inputs.length - 1) inputs[i + 1].focus();
              event.preventDefault();
            } else if (event.keyCode > 64 && event.keyCode < 91) {
              inputs[i].value = String.fromCharCode(event.keyCode);
              if (i !== inputs.length - 1) inputs[i + 1].focus();
              event.preventDefault();
            }
          }
        });
      }
    },

    checkEmail() {
      if (this.$refs.Formref.validate()) {
        this.isLoading = true;
        this.axiosCall("/auth/sendNewPassword/" + this.email, "GET").then(
          (res) => {
            if (res.data.status == 200) {
              this.isLoading = false;
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = "success";
              this.fadeAwayMessage.message = res.data.msg;
              this.fadeAwayMessage.header = "System Message";
              setTimeout(() => {
                this.$router.push("/login");
              }, 1500);
            } else {
              this.isLoading = false;
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = "error";
              this.fadeAwayMessage.message = res.data.msg;
              this.fadeAwayMessage.header = "System Message";
            }
          }
        );
      }
    },
    // checkOTP() {
    //   let formData = { email: this.email, otp: this.otp };
    //   this.axiosCall("/auth/compareOTP", "POST", formData).then((res) => {
    //     if (res.data.status == 200) {
    //       this.isLoading = false;
    //       this.showEmail = false;
    //       this.showPass = true;
    //       this.showOTP = false;
    //       this.email = res.data.user;
    //     } else {
    //       this.isLoading = false;
    //       this.fadeAwayMessage.show = true;
    //       this.fadeAwayMessage.type = "error";
    //       this.fadeAwayMessage.message = "OTP not match";
    //       this.fadeAwayMessage.header = "System Message";
    //     }
    //   });
    // },
    changePass() {
      if (this.$refs.Formref.validate()) {
        this.isLoading = true;
        if (
          this.password &&
          this.confirm_pass &&
          this.password == this.confirm_pass
        ) {
          let formData = {
            email: this.$store.state.email,
            password: this.password,
          };
          this.axiosCall("/auth/resetPassword", "POST", formData).then(
            (res) => {
              if (res.data.status == 200) {
                this.$store.dispatch("setEmail", null);
                this.fadeAwayMessage.show = true;
                this.fadeAwayMessage.type = "success";
                this.fadeAwayMessage.message = "Password changed successfully";
                this.fadeAwayMessage.header = "System Message";
                this.isLoading = false;
                setTimeout(() => {
                  this.$router.push({ path: "/login" });
                }, 2000);
              } else {
                this.fadeAwayMessage.show = true;
                this.fadeAwayMessage.type = "error";
                this.fadeAwayMessage.message = "Error changing password";
                this.fadeAwayMessage.header = "System Message";
              }
            }
          );
        } else {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.message = "Password not match";
          this.fadeAwayMessage.header = "System Message";
        }
      }
    },
    handleOnComplete(value) {
      this.otp = value;
    },
    handleClearInput() {
      this.$refs.otpInput.clearInput();
    },
  },
};
</script>

<style scoped>
.otp-div {
  display: flex;
  justify-content: center;
}
.content {
  /* background: url("../../assets/img/new_bg.png"); */
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
</style>
