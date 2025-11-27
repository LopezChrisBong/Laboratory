<template>
  <v-app>
    <v-app-bar app dense>
      <v-app-bar-nav-icon
        v-if="$vuetify.breakpoint.xsOnly"
        @click="drawer = !drawer"
      ></v-app-bar-nav-icon>

      <v-toolbar-title class="d-flex align-center">
        <v-img
          src="../../assets/img/paragon logo website.png"
          max-width="35"
          class="mr-2"
        ></v-img>
        <div v-if="$vuetify.breakpoint.smAndDown">PARAGON</div>

        <div v-if="$vuetify.breakpoint.smAndUp">
          <h2 class="mb-0" style="color:black; font-size:20px;">PARAGON</h2>
          <p class="ma-0" style="color:black; margin-top:-5px; font-size:12px;">
            Diagnostics And Multi-Specialty Clinic
          </p>
        </div>
      </v-toolbar-title>

      <v-spacer></v-spacer>
      <div v-if="$vuetify.breakpoint.smAndUp">
        <v-btn text @click="mainData = 1">
          <RouterLink to="/landing-page" style="text-decoration:none;">
            <b style="color:black;">Home</b>
          </RouterLink>
        </v-btn>

        <v-btn text @click="mainData = 2">
          <b style="color:black;">Appointment</b>
        </v-btn>
      </div>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app temporary>
      <v-list>
        <v-list-item @click="mainData = 1">
          <RouterLink to="/landing-page" style="text-decoration:none;">
            <v-list-item-title>Home</v-list-item-title>
          </RouterLink>
        </v-list-item>

        <v-list-item @click="mainData = 2">
          <v-list-item-title>Appointment</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

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
    drawer: false,
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
