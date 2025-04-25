<template>
  <div>
    <v-container fluid fill-height class="content">
      <v-row align="center" justify="center">
        <v-col align="center" cols="12" md="6">
          <v-card max-width="600" class="rounded-card">
            <div style="margin:0 auto; width:25%" class="pa-2">
              <v-img src="../../assets/img/img_avatar.png"></v-img>
            </div>
            <div class="justify-center pa-4">
              <h3 style="color: #0e2b62; width: 100%" class="mb-1">
                You have successfully registered your account on
                <span style="color: #0e2b62">LIFE</span>
              </h3>
              <p
                class="text-caption text-gray-100"
                style="width: 85%; font-size: 10px"
              >
                Please contact admin to verify your registered account!
              </p>
            </div>

            <div>
              <!-- <img width="200" src="../../assets/img/review.png" /> -->
              <p style="font-size: 12px" class="text-gray-100">
                This page will close automatically in
                <span class="text-green-blue">{{ timerCounts }}s</span>
              </p>
            </div>

            <v-col cols="12" class="pa-0">
              <div
                class="
                  d-flex
                  justify-center
                  pt-8
                  pb-3
                  text-caption text-gray-100
                "
              >
                <!-- Already have an account?
                 <router-link class="pl-2" to="/login"> Sign In</router-link> -->
              </div>
            </v-col>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  watch: {
    timerCounts: {
      handler(value) {
        if (value > 0) {
          setTimeout(() => {
            this.timerCounts--;
          }, 1000);
        } else {
          this.$router.push("/login");
        }
      },
      immediate: true, // This ensures the watcher is triggered upon creation
    },
  },
  data: () => ({
    timerCounts: 20,
  }),

  methods: {},
};
</script>

<style scoped>
.content {
  background: url("../../assets/img/laboratorybg.png");
  /* background-color: #2196F3; */
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
</style>
