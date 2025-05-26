<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title style="margin:0 auto; width:250px">
        <div class="d-flex justify-center align-center">
          <v-img
            src="../../assets/img/paragon logo website.png"
            style="width: 2%;"
          ></v-img>
          <div v-if="$vuetify.breakpoint.smAndUp" align="center">
            <h1 style="color: black;">PARAGON</h1>
            <p style="color: black; margin-top: -15px; font-size: 11px;">
              Diagnostics And Multi-Specialty Clinic
            </p>
          </div>
        </div>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text @click="mainData = 1"
        ><RouterLink to="/landing-page" style="text-decoration: none;">
          <b style="color: black;">Home</b></RouterLink
        ></v-btn
      >
      <!-- <v-btn text
        ><RouterLink to="/patient-appointment" style="text-decoration: none;">
          <b style="color: black;">Appointment</b></RouterLink
        ></v-btn
      > -->
      <v-btn text @click="mainData = 2"> <b>Appointment</b></v-btn>

      <!-- <v-btn text
        ><RouterLink to="/login" style="text-decoration: none;">
          <b style="color: black;">Login</b></RouterLink
        ></v-btn
      > -->
    </v-app-bar>

    <v-main>
      <div v-if="mainData == 1">
        <v-carousel
          cycle
          :height="$vuetify.breakpoint.smAndUp ? '670' : '400'"
          hide-delimiter-background
          show-arrows-on-hover
          :show-arrows="false"
          style="margin-top: -60px;"
        >
          <v-carousel-item
            v-for="(item, i) in slides"
            :key="i"
            :src="$vuetify.breakpoint.smAndUp ? item.src : item.src2"
            reverse-transition="fade-transition"
            transition="fade-transition"
          >
            <v-row class="fill-height" align="center" justify="center">
              <v-col class="text-center white--text" cols="12">
                <h1 class="display-2 font-weight-bold" style="color: black;">
                  {{ item.title }}
                </h1>
                <p class="headline" style="color: blue;">{{ item.subtitle }}</p>
              </v-col>
              <v-col cols="12" class="d-flex  justify-center item-center">
                <!-- <v-btn color="blue" large>BOOK NOW!</v-btn> -->
              </v-col>
            </v-row>
          </v-carousel-item>
        </v-carousel>
        <v-container class="my-12">
          <h2 class="text-center mb-8">Our Features</h2>
          <v-row>
            <v-col cols="12" md="4" v-for="(feature, i) in features" :key="i">
              <v-card class="pa-4" outlined>
                <v-icon large color="primary">{{ feature.icon }}</v-icon>
                <h3 class="mt-2">{{ feature.title }}</h3>
                <p>{{ feature.description }}</p>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
        <v-container class="my-12">
          <h2 class="text-center mb-8">Contact Us</h2>
          <v-row>
            <v-col cols="12" md="6">
              <h2 class="mb-4">Get in Touch</h2>
              <p>
                If you have any questions or need assistance, feel free to
                contact us directly.
              </p>

              <v-list dense>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon color="primary">mdi-map-marker</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title
                      >2F Bluz Building, Tadeco Road, Brgy. San Francisco,
                      Panabo City</v-list-item-title
                    >
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-icon>
                    <v-icon color="primary">mdi-phone</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title
                      >0946-100-3260 | 0995-677-3287</v-list-item-title
                    >
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-icon>
                    <v-icon color="primary">mdi-email</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title
                      >paragondiagnostics.lab@gmail.com |
                      paragondiagnosticsmsc@gmail.com</v-list-item-title
                    >
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-icon>
                    <v-icon color="primary">mdi-clock</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title
                      >Monday - Sunday: 7am - 5pm</v-list-item-title
                    >
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-col>

            <v-col cols="12" md="6">
              <ContactForm />
            </v-col>
          </v-row>
        </v-container>
      </div>
      <PatientAppointment v-else style="margin-top: -30px;" />
    </v-main>

    <v-footer app padless>
      <v-col class="text-center py-4" cols="12">
        &copy; {{ new Date().getFullYear() }} — PARAGON. All rights reserved.
      </v-col>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  components: {
    PatientAppointment: () => import("../Auth/PatientAppointment.vue"),
  },
  data: () => ({
    mainData: 1,
    slides: [
      {
        src2: require("@/assets/img/mobile1.png"),
        src: require("@/assets/img/img1.png"),
        // title: "Welcome to PARAGON",
        // subtitle: "",
      },
      {
        src2: require("@/assets/img/mobile2.png"),
        src: require("@/assets/img/img2.png"),
        // title: "SAmple",
        // subtitle: "",
      },

      {
        src: require("@/assets/img/img3.png"),
        src2: require("@/assets/img/mobile3.png"),
        // title: "SAmple",
        // subtitle: "",
      },
    ],
    features: [
      {
        icon: "mdi-calendar-check",
        title: "Online Appointments",
        description: "Book appointments instantly from any device.",
      },
      {
        icon: "mdi-doctor",
        title: "Qualified Doctors",
        description: "Meet top-rated and experienced healthcare professionals.",
      },
      {
        icon: "mdi-shield-check",
        title: "Secure Records",
        description: "Your health data is encrypted and safe with us.",
      },
    ],

    valid: false,
    form: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  }),

  method: {},
};
</script>

<style scoped>
/* html {
  scroll-behavior: smooth;
} */
</style>
