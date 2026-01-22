<template>
  <v-app>
    <!-- Top Info Bar -->
    <!-- <v-app-bar height="36" flat color="primary" dark id="mainCover">
      <v-row class="px-6" align="center" no-gutters>
        <v-col cols="8" class="caption">
          ☎ (555) 123-4567 &nbsp; | &nbsp; Mon–Fri: 8:00 AM – 6:00 PM | Sat:
          9:00 AM – 2:00 PM
        </v-col>
        <v-col cols="4" class="caption text-right">
          Emergency Services Available
        </v-col>
      </v-row>
    </v-app-bar> -->

    <!-- Main Navbar -->
    <!-- <v-app-bar flat height="72" class="px-8">
      <v-row>
        <v-col cols="4"
          ><div class="d-flex align-left justify-center">
            <v-img
              src="../../assets/img/paragon logo website.png"
              max-width="36"
              class="mr-2"
            />
            <div>
              <div class="font-weight-bold">PARAGON</div>
              <div class="caption black--text">
                Diagnostics & Multi-Specialty Clinic
              </div>
            </div>
          </div></v-col
        >
        <v-col cols="4">
          <div class="d-flex jusctify-center">
            <v-btn @click="goToDiv(1)" text>Services</v-btn>
            <v-btn @click="goToDiv(2)" text>Specialties</v-btn>
            <v-btn @click="goToDiv(3)" text>Why Paragon</v-btn>
            <v-btn @click="goToDiv(4)" text>Contact</v-btn>
          </div></v-col
        >
        <v-col cols="4"
          ><div
            style="display: flex; justify-content: right; align-items: center"
          >
            <v-btn
              color="primary"
              class="ml-4"
              style="border-radius: 10px"
              dark
              @click="addAppointment()"
            >
              Book Appointment
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-app-bar> -->
    <!-- Top Info Bar (hide on mobile) -->
    <v-app-bar
      height="36"
      flat
      color="primary"
      dark
      id="mainCover"
      class="hidden-sm-and-down"
    >
      <v-row class="px-6" align="center" no-gutters>
        <v-col cols="8" class="caption">
          ☎ (555) 123-4567 &nbsp; | &nbsp; Mon–Fri: 8:00 AM – 6:00 PM | Sat:
          9:00 AM – 2:00 PM
        </v-col>
        <v-col cols="4" class="caption text-right">
          Emergency Services Available
        </v-col>
      </v-row>
    </v-app-bar>

    <!-- Main Navbar -->
    <v-app-bar
      :fixed="$vuetify.breakpoint.smAndDown"
      :app="$vuetify.breakpoint.smAndDown"
      flat
      height="72"
      class="px-4 px-md-12"
    >
      <!-- Mobile Menu Button -->
      <v-app-bar-nav-icon class="hidden-md-and-up" @click="drawer = true" />

      <!-- Logo -->
      <v-toolbar-title class="d-flex align-center">
        <v-img
          src="../../assets/img/paragon logo website.png"
          max-width="36"
          class="mr-2"
        />
        <div>
          <div class="font-weight-bold">PARAGON</div>
          <div class="caption hidden-sm-and-down">
            Diagnostics & Multi-Specialty Clinic
          </div>
        </div>
      </v-toolbar-title>

      <v-spacer />

      <!-- Desktop Navigation -->
      <div class="hidden-sm-and-down">
        <v-btn text @click="goToDiv(1)">Services</v-btn>
        <v-btn text @click="goToDiv(2)">Specialties</v-btn>
        <v-btn text @click="goToDiv(3)">Why Paragon</v-btn>
        <v-btn text @click="goToDiv(4)">Contact</v-btn>
      </div>

      <!-- Desktop CTA -->
      <v-btn
        class="ml-4 hidden-sm-and-down"
        color="primary"
        dark
        style="border-radius: 10px"
        @click="addAppointment"
      >
        Book Appointment
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      app
      color="#1976d2"
      dark
      width="280"
      height="100%"
    >
      <v-list dense>
        <v-list-item @click="goToDiv(1)">
          <v-list-item-title>Services</v-list-item-title>
        </v-list-item>

        <v-list-item @click="goToDiv(2)">
          <v-list-item-title>Specialties</v-list-item-title>
        </v-list-item>

        <v-list-item @click="goToDiv(3)">
          <v-list-item-title>Why Paragon</v-list-item-title>
        </v-list-item>

        <v-list-item @click="goToDiv(4)">
          <v-list-item-title>Contact</v-list-item-title>
        </v-list-item>

        <v-divider />

        <v-list-item @click="addAppointment">
          <v-list-item-title class="white--text font-weight-bold">
            Book Appointment
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <!-- HERO SECTION -->
      <v-container fluid class="py-16 px-10">
        <v-row align="center">
          <v-col cols="12" md="6">
            <v-chip outlined color="primary" class="mb-4">
              Trusted Healthcare Partner
            </v-chip>
            <h1
              class="display-1 font-weight-bold primary--text mb-4 pr-5 text-h2"
            >
              Comprehensive Diagnostics & Multi-Specialty Care
            </h1>
            <p class="body-1 grey--text text--darken-1 mb-6 pr-5 text-justify">
              Experience precision diagnostics and expert medical care in a
              modern, patient-centered environment. At Paragon, we combine
              advanced technology with compassionate healthcare professionals
              dedicated to your well-being.
            </p>
            <v-btn
              color="primary"
              large
              class="ma-2"
              style="width: 300px"
              dark
              @click="addAppointment()"
            >
              Schedule Appointment
            </v-btn>
            <v-btn
              outlined
              large
              class="ma-2"
              color="primary"
              @click="goToDiv(1)"
              style="width: 300px"
            >
              Our Services
            </v-btn>

            <div class="mt-8 mb-4">
              <v-divider></v-divider>
              <v-row class="mt-5">
                <v-col cols="4">
                  <div class="d-flex">
                    <v-icon color="#4FA3D1">mdi-shield-check-outline</v-icon>
                    <span style="color: #4fa3d1; font-weight: 500" class="ml-2"
                      >Certified</span
                    >
                  </div>
                  <div class="text-caption">
                    Liscenced Medical Professionals
                  </div>
                </v-col>
                <v-col cols="4">
                  <div class="d-flex">
                    <v-icon color="#4FA3D1"
                      >mdi-file-certificate-outline</v-icon
                    >
                    <span style="color: #4fa3d1; font-weight: 500" class="ml-2"
                      >Accurate</span
                    >
                  </div>
                  <div class="text-caption">
                    Precise Diagnostic Results
                  </div></v-col
                >
                <v-col cols="4">
                  <div class="d-flex">
                    <v-icon color="#4FA3D1">mdi-clock-outline</v-icon>
                    <span style="color: #4fa3d1; font-weight: 500" class="ml-2"
                      >Efficient</span
                    >
                  </div>
                  <div class="text-caption">Fast Report Delivery</div></v-col
                >
              </v-row>
            </div>
          </v-col>

          <v-col cols="12" md="6">
            <v-card
              elevation="10"
              class="rounded-xl"
              :img="require('../../assets/img/landingPage.jpg')"
              style="height: 300px; position: relative"
            >
              <!-- <v-img
                src="../../assets/img/landingPage.jpg"
                height=""
                cover
              ></v-img> -->
              <v-card
                class="pa-4"
                style="
                  position: absolute;
                  top: 0;
                  right: 0;
                  border-radius: 20px 20px 20px 20px;
                  width: 220px;
                  transform: translate(10%, -30%);
                "
                elevation="6"
              >
                <v-row>
                  <v-col cols="4" class="d-flex justify-center align-center">
                    <div
                      class="pa-2"
                      style="background-color: #e8f2f8; border-radius: 10px"
                    >
                      <v-icon color="#4FA3D1"
                        >mdi-file-certificate-outline</v-icon
                      >
                    </div>
                  </v-col>
                  <v-col cols="8">
                    <div class="align-center">
                      <span
                        class="primary--text"
                        style="font-size: 18px; font-weight: 500"
                      >
                        ISO Certified
                      </span>
                      <span style="font-size: 14px"> Quality Assured </span>
                    </div>
                  </v-col>
                </v-row>
              </v-card>
              <v-card
                class="pa-4"
                style="
                  position: absolute;
                  bottom: 0;
                  left: 0;
                  right: 0;
                  border-radius: 20px 20px 20px 20px;
                  width: 210px;
                  transform: translate(-15%, 50%);
                "
                elevation="6"
              >
                <v-row>
                  <v-col cols="4" class="d-flex justify-center align-center">
                    <div
                      class="pa-2"
                      style="
                        border-radius: 10px;
                        background: linear-gradient(135deg, #0f8edc, #1f5fa3);
                      "
                    >
                      <h3 style="color: white">10K+</h3>
                    </div>
                  </v-col>
                  <v-col cols="8">
                    <div>
                      <span class="text-caption">Trusted by</span><br />
                      <span class="primary--text" style="font-weight: 500"
                        >Happy Patients</span
                      >
                    </div>
                  </v-col>
                </v-row>
              </v-card>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <!-- SERVICES SECTION -->
      <v-container
        id="service"
        fluid
        class="py-16"
        style="padding: 14%; background-color: #f5f8fa"
      >
        <div class="text-center mb-12">
          <span class="overline primary--text">Our Services</span><br />
          <span class="primary--text" style="font-size: 35px; font-weight: 500">
            Diagnostic Excellence
          </span>
          <p class="grey--text text--darken-1 mt-2">
            Cutting-edge diagnostic services performed by experienced
            technicians using the latest medical technology
          </p>
        </div>

        <v-row justify="center">
          <v-col
            v-for="service in services"
            :key="service.title"
            cols="12"
            md="4"
          >
            <v-card class="pa-6" elevation="4" style="border-radius: 10px">
              <div
                class="pa-2"
                style="
                  background-color: #e8f2f8;
                  border-radius: 10px;
                  width: 50px;
                "
              >
                <v-icon large color="primary">{{ service.icon }}</v-icon>
              </div>

              <h3 class="subtitle-1 font-weight-bold mt-4 primary--text">
                {{ service.title }}
              </h3>
              <p class="body-2 grey--text text--darken-1 mt-2">
                {{ service.desc }}
              </p>
              <v-divider class="my-4"></v-divider>
              <span class="text-caption grey--text">COMMON TEST</span>
              <p class="caption primary--text">
                {{ service.tests }}
              </p>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <!--SPECIALTY-->
      <v-container id="specialty" fluid class="py-16" style="padding: 14%">
        <!-- Header -->
        <v-row justify="center" class="text-center mb-10">
          <v-col cols="12">
            <div class="text-overline primary--text mb-2">
              Medical Specialties
            </div>
            <h1
              class="font-weight-bold mb-3 primary--text"
              style="font-size: 34px"
            >
              Multi-Specialty Care
            </h1>
            <p class="subtitle-1 grey--text text--darken-1">
              Board-certified specialists providing expert care across multiple
              medical disciplines
            </p>
          </v-col>
        </v-row>

        <!-- Cards -->
        <v-row justify="center" dense>
          <v-col
            v-for="(specialty, index) in specialties"
            :key="index"
            cols="12"
            sm="6"
            md="4"
            class="mb-6"
          >
            <v-card outlined class="pa-4 h-100">
              <v-row no-gutters>
                <v-col cols="auto">
                  <div
                    class="pa-1"
                    style="
                      background: linear-gradient(135deg, #0f8edc, #1f5fa3);
                      border-radius: 10px;
                    "
                  >
                    <v-icon color="white" dark>{{ specialty.icon }}</v-icon>
                  </div>
                </v-col>

                <v-col class="pl-4">
                  <div class="font-weight-bold mb-1 primary--text">
                    {{ specialty.title }}
                  </div>
                  <div class="body-2 grey--text text--darken-1">
                    {{ specialty.description }}
                  </div>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>

        <!-- Footer Button -->
        <v-row justify="center" class="mt-8 text-center">
          <v-col cols="12">
            <p class="caption grey--text mb-4">
              All our specialists are board-certified with extensive clinical
              experience
            </p>
            <v-btn color="primary" rounded> View All Specialists </v-btn>
          </v-col>
        </v-row>
      </v-container>

      <!-- WHY PARAGON -->
      <v-container
        id="paragon"
        fluid
        class="py-16 white--text"
        style="
          background: linear-gradient(135deg, #0f8edc, #1f5fa3);
          padding: 14%;
        "
      >
        <div class="text-center mb-12">
          <span class="overline white--text">WHY CHOOSE US</span><br />
          <h2 class="headline font-weight-bold">What Sets Paragon Apart</h2>
          <p class="opacity-80 mt-2">
            Your health deserves nothing less than excellence
          </p>
        </div>

        <v-row justify="center">
          <v-col v-for="item in highlights" :key="item.title" cols="12" md="4">
            <v-card
              class="pa-6"
              elevation="6"
              style="background-color: #388ac8; height: 200px"
            >
              <div
                class="pa-2"
                style="
                  background-color: #5dade1;
                  border-radius: 10px;
                  width: 50px;
                "
              >
                <v-icon large color="white">{{ item.icon }}</v-icon>
              </div>

              <h3 class="subtitle-1 font-weight-bold mt-4 white--text">
                {{ item.title }}
              </h3>
              <p class="body-2 mt-2 white--text opacity-80">
                {{ item.desc }}
              </p>
            </v-card>
          </v-col>
        </v-row>

        <v-row class="text-center mt-12">
          <v-col cols="6" md="3">
            <h2 class="font-weight-bold">15+</h2>
            <p class="caption">Years of Excellence</p>
          </v-col>
          <v-col cols="6" md="3">
            <h2 class="font-weight-bold">10,000+</h2>
            <p class="caption">Patients Served</p>
          </v-col>
          <v-col cols="6" md="3">
            <h2 class="font-weight-bold">25+</h2>
            <p class="caption">Medical Specialists</p>
          </v-col>
          <v-col cols="6" md="3">
            <h2 class="font-weight-bold">98%</h2>
            <p class="caption">Satisfaction Rate</p>
          </v-col>
        </v-row>
      </v-container>

      <!-- PATIENT JOURNEY -->
      <v-container fluid class="py-16 grey lighten-5">
        <div class="text-center mb-12">
          <span class="overline primary--text">Patient Journey</span><br />
          <h2 class="font-weight-bold primary--text" style="font-size: 34px">
            Your Care Pathway
          </h2>
          <p class="grey--text text--darken-1 mt-2">
            A seamless, patient-centered experience from your first appointment
            to complete recovery
          </p>
        </div>

        <v-row justify="center" align="stretch">
          <v-col
            v-for="(step, index) in journey"
            :key="step.title"
            cols="12"
            md="2"
          >
            <v-card
              class="pa-6 text-center"
              elevation="3"
              style="border-radius: 10px; height: 260px"
            >
              <v-avatar size="56" color="primary" class="mb-4">
                <v-icon dark>{{ step.icon }}</v-icon>
              </v-avatar>

              <h3 class="subtitle-1 font-weight-bold primary--text">
                {{ step.title }}
              </h3>

              <p class="body-2 grey--text text--darken-1 mt-2">
                {{ step.desc }}
              </p>

              <div
                class="display-1 font-weight-bold grey--text text--lighten-2 mt-2"
              >
                {{ index + 1 }}
              </div>
            </v-card>
          </v-col>
        </v-row>

        <div class="text-center mt-12">
          <p class="grey--text text--darken-1 mb-4">
            Ready to begin your healthcare journey?
          </p>
          <v-btn color="primary" large rounded dark @click="addAppointment">
            Get Started Today
          </v-btn>
        </div>
      </v-container>

      <!-- CONTACT US -->
      <v-container
        id="contact"
        fluid
        class="py-16 white lighten-5"
        style="padding: 10%"
      >
        <div class="text-center mb-12">
          <span class="overline primary--text">CONTACT US</span><br />
          <h2 class="font-weight-bold primary--text" style="font-size: 34px">
            Visit Our Clinic
          </h2>
          <p class="grey--text text--darken-1 mt-2">
            Conveniently located and easily accessible with ample parking
            facilities
          </p>
        </div>

        <v-row justify="center" align="stretch">
          <v-col cols="12" md="6">
            <v-row no-gutters>
              <v-col cols="12">
                <div
                  class="pa-2"
                  style="
                    border-radius: 10px;
                    height: 160px;
                    display: flex;
                    align-items: right;
                    justify-content: right;
                  "
                >
                  <div
                    style="width: 330px; background-color: #f5f8fa"
                    class="pa-4"
                  >
                    <v-row>
                      <v-col cols="2">
                        <div
                          class="pt-2 text-center pa-2"
                          style="
                            background-color: white;
                            width: 40px;
                            border-radius: 10px;
                          "
                        >
                          <v-icon color="blue">mdi-map-marker-outline</v-icon>
                        </div>
                      </v-col>
                      <v-col cols="10">
                        <div class="pt-2">
                          <span class="primary--text" style="font-weight: 500"
                            >Clinic Address</span
                          ><br />
                          <span class="text-caption opacity-80"
                            >Bluz Building 2, Tadeco Road,</span
                          ><br />
                          <span class="text-caption opacity-80"
                            >Brgy. San Francisco,</span
                          ><br />
                          <span class="text-caption opacity-80"
                            >Panabo City, Philippines</span
                          >
                        </div>
                      </v-col>
                    </v-row>
                  </div>
                </div>
              </v-col>
              <v-col cols="12">
                <div
                  class="pa-2"
                  style="
                    border-radius: 10px;
                    height: 160px;
                    display: flex;
                    align-items: right;
                    justify-content: right;
                  "
                >
                  <div
                    style="width: 330px; background-color: #f5f8fa"
                    class="pa-4"
                  >
                    <v-row>
                      <v-col cols="2">
                        <div
                          class="pt-2 text-center pa-2"
                          style="
                            background-color: white;
                            width: 40px;
                            border-radius: 10px;
                          "
                        >
                          <v-icon color="blue">mdi-phone-outline</v-icon>
                        </div>
                      </v-col>
                      <v-col cols="10">
                        <div class="pt-2">
                          <span class="primary--text" style="font-weight: 500"
                            >Phone & Fax</span
                          ><br />
                          <span class="text-caption opacity-80"
                            >+63 898 9989 990</span
                          ><br />
                          <span class="text-caption opacity-80"
                            >Brgy. San Francisco,</span
                          ><br />
                          <span class="text-caption opacity-80"
                            >Panabo City, Philippines</span
                          >
                        </div>
                      </v-col>
                    </v-row>
                  </div>
                </div>
              </v-col>
              <v-col cols="12">
                <div
                  class="pa-2"
                  style="
                    border-radius: 10px;
                    height: 160px;
                    display: flex;
                    align-items: right;
                    justify-content: right;
                  "
                >
                  <div
                    style="width: 330px; background-color: #f5f8fa"
                    class="pa-4"
                  >
                    <v-row>
                      <v-col cols="2">
                        <div
                          class="pt-2 text-center pa-2"
                          style="
                            background-color: white;
                            width: 40px;
                            border-radius: 10px;
                          "
                        >
                          <v-icon color="blue">mdi-clock-outline</v-icon>
                        </div>
                      </v-col>
                      <v-col cols="10">
                        <div class="pt-2">
                          <span class="primary--text" style="font-weight: 500"
                            >Operating Hours</span
                          ><br />
                          <span class="text-caption opacity-80"
                            >Monday - Friday</span
                          >
                          <span class="text-caption opacity-80 px-4"
                            >8:00 AM -6:00 PM</span
                          >
                          <br />
                          <span class="text-caption opacity-80">Saturday</span
                          ><span class="text-caption opacity-80 px-4"
                            >9:00 AM - 2:00 PM</span
                          >
                          <br />
                          <span class="text-caption opacity-80">Sunday</span>
                          <span class="text-caption opacity-80 px-4"
                            >Closed</span
                          >
                        </div>
                      </v-col>
                    </v-row>
                  </div>
                </div>
              </v-col>
              <v-col cols="12">
                <div
                  class="pa-2"
                  style="
                    border-radius: 10px;
                    height: 160px;
                    display: flex;
                    align-items: right;
                    justify-content: right;
                  "
                >
                  <div
                    style="width: 330px; background-color: #f5f8fa"
                    class="pa-4"
                  >
                    <v-row>
                      <v-col cols="2">
                        <div
                          class="pt-2 text-center pa-2"
                          style="
                            background-color: white;
                            width: 40px;
                            border-radius: 10px;
                          "
                        >
                          <v-icon color="blue">mdi-email-outline</v-icon>
                        </div>
                      </v-col>
                      <v-col cols="10">
                        <div class="pt-2">
                          <span class="primary--text" style="font-weight: 500"
                            >Email Contact</span
                          ><br />
                          <div class="text-caption opacity-80">
                            General Inquiries:
                          </div>
                          <div class="text-caption primary--text mb-2">
                            paragon@gmail.com
                          </div>
                          <div class="text-caption opacity-80">
                            Appointments:
                          </div>
                          <div class="text-caption primary--text mb-2">
                            appointment@gmail.com
                          </div>
                        </div>
                      </v-col>
                    </v-row>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" md="6">
            <div
              class="pa-6 text-center"
              style="
                border-radius: 10px;
                height: 260px;
                background-color: #f5f8fa;
              "
            >
              <iframe
                width="100%"
                height="400"
                style="border: 0"
                loading="lazy"
                allowfullscreen
                src="https://www.google.com/maps?q=7.3094921,125.6786332&output=embed"
              ></iframe></div
          ></v-col>
        </v-row>

        <!-- <div class="text-center mt-12">
          <p class="grey--text text--darken-1 mb-4">
            Ready to begin your healthcare journey?
          </p>
          <v-btn color="primary" large rounded dark> Get Started Today </v-btn>
        </div> -->
      </v-container>

      <!-- FOOTER -->
      <v-footer padless color="primary">
        <v-container
          fluid
          class="white--text"
          style="padding-left: 10%; padding-right: 10%; padding-top: 40px"
        >
          <v-row>
            <!-- Brand -->
            <v-col cols="12" md="3">
              <div class="d-flex align-left justify-center mr-5 mb-5">
                <v-img
                  src="../../assets/img/paragon logo website.png"
                  max-width="36"
                  class="mr-2"
                  style="background-color: white; border-radius: 10px"
                />
                <div>
                  <div class="font-weight-bold">PARAGON</div>
                  <div class="caption white--text">
                    Diagnostics & Multi-Specialty Clinic
                  </div>
                </div>
              </div>
              <p class="text-caption opacity-80 mb-5">
                Your trusted partner for comprehensive diagnostics and
                multi-specialty medical care. Committed to excellence in
                healthcare.
              </p>

              <div class="mt-4">
                <v-btn icon color="white"><v-icon>mdi-facebook</v-icon></v-btn>
                <v-btn icon color="white"><v-icon>mdi-instagram</v-icon></v-btn>
                <v-btn icon color="white"><v-icon>mdi-twitter</v-icon></v-btn>
                <v-btn icon color="white"><v-icon>mdi-linkedin</v-icon></v-btn>
              </div>
            </v-col>

            <!-- Quick Links -->
            <v-col cols="12" md="3">
              <h4 class="subtitle-1 font-weight-bold mb-3">Quick Links</h4>
              <div class="caption">Diagnostic Services</div>
              <div class="caption">Medical Specialties</div>
              <div class="caption">About Paragon</div>
              <div class="caption">Contact Us</div>
              <div class="caption">Patient Portal</div>
              <div class="caption">Careers</div>
            </v-col>

            <!-- Services -->
            <v-col cols="12" md="3">
              <h4 class="subtitle-1 font-weight-bold mb-3">Our Services</h4>
              <div class="caption">Laboratory Services</div>
              <div class="caption">Digital X-Ray</div>
              <div class="caption">Ultrasound Imaging</div>
              <div class="caption">ECG & Cardiac Tests</div>
              <div class="caption">Fetal Monitoring (NST)</div>
              <div class="caption">Specialist Consultations</div>
            </v-col>

            <!-- Contact -->
            <v-col cols="12" md="3">
              <h4 class="subtitle-1 font-weight-bold mb-3">Contact Info</h4>
              <p class="caption">
                <v-icon small left>mdi-map-marker</v-icon>
                123 Medical Plaza, Suite 450<br />
                Healthcare District, City 12345
              </p>
              <p class="caption">
                <v-icon small left>mdi-phone</v-icon>
                (555) 123-4567
              </p>
              <p class="caption">
                <v-icon small left>mdi-email</v-icon>
                info@paragondiagnostics.com
              </p>
            </v-col>
          </v-row>

          <v-divider class="my-6" dark></v-divider>

          <v-row align="center">
            <v-col cols="12" md="6" class="caption">
              © 2026 Paragon Diagnostics & Multi-Specialty Clinic. All rights
              reserved.
            </v-col>
            <v-col cols="12" md="6" class="text-right caption">
              Privacy Policy &nbsp; | &nbsp; Terms of Service &nbsp; | &nbsp;
              HIPAA Compliance
            </v-col>
          </v-row>
        </v-container>
      </v-footer>
    </v-main>

    <!-- <PatientAppointment :data="mainData" :action="action" /> -->
    <v-btn fab fixed bottom right color="white" @click="goToDiv(5)">
      <v-icon>mdi-arrow-up</v-icon>
    </v-btn>
  </v-app>
</template>

<script>
export default {
  name: "ParagonDashboard",
  // components: {
  //   PatientAppointment: () => import("../Auth/PatientAppointment.vue"),
  // },
  data() {
    return {
      mainData: null,
      drawer: false,
      action: "Appointment",
      services: [
        {
          title: "Laboratory Services",
          desc: "Comprehensive blood work and diagnostic testing with precise results.",
          tests: "CBC, Lipid Profile, Thyroid Panel, HbA1c",
          icon: "mdi-flask-outline",
        },
        {
          title: "Digital X-Ray",
          desc: "Advanced digital radiography with minimal radiation exposure.",
          tests: "Chest, Spine, Joints, Abdomen",
          icon: "mdi-radiology-box",
        },
        {
          title: "Ultrasound",
          desc: "High-resolution imaging for accurate organ visualization.",
          tests: "Abdomen, Pelvis, Obstetric, Vascular",
          icon: "mdi-waveform",
        },
        {
          title: "Electrocardiogram",
          desc: "ECG testing assesses hearth rhythm, detects issiues, and track heart health.",
          tests: "Resting ECG, Stress Test",
          icon: "mdi-heart-pulse",
        },
        {
          title: "NST & Fetal Monitoring",
          desc: "Non-stress testing for comprehensive fetal health assessment during pregnancy.",
          tests: "NST, Biophysical Profile",
          icon: "mdi-face-man-outline",
        },
      ],
      specialties: [
        {
          title: "OB-GYN",
          icon: "mdi-baby-face-outline",
          description:
            "Comprehensive women's health services including prenatal care, family planning, and gynecological treatments",
        },
        {
          title: "Pediatrics",
          icon: "mdi-stethoscope",
          description:
            "Expert care for infants, children, and adolescents with focus on growth, development, and preventive health",
        },
        {
          title: "Family Medicine",
          icon: "mdi-account-group-outline",
          description:
            "Holistic primary care for all family members, from newborns to seniors, managing acute and chronic conditions",
        },
        {
          title: "Internal Medicine",
          icon: "mdi-heart-outline",
          description:
            "Specialized treatment of complex adult diseases, chronic illness management, and preventive care",
        },
        {
          title: "General Medicine",
          icon: "mdi-hospital-box-outline",
          description:
            "Primary care consultations for common illnesses, health screenings, and ongoing wellness management",
        },
        {
          title: "Surgery",
          icon: "mdi-medical-bag",
          description:
            "Skilled surgical procedures performed with precision using minimally invasive techniques when possible",
        },
        {
          title: "ENT",
          icon: "mdi-ear-hearing",
          description:
            "Specialized diagnosis and treatment of ear, nose, throat, and related head and neck conditions",
        },
      ],
      highlights: [
        {
          title: "Accurate & Reliable Diagnostics",
          desc: "State-of-the-art equipment with rigorous quality control.",
          icon: "mdi-shield-check",
        },
        {
          title: "Experienced Medical Team",
          desc: "Board-certified physicians and specialists.",
          icon: "mdi-account-group-outline",
        },
        {
          title: "Advanced Medical Technology",
          desc: "Latest diagnostic equipment and modern facilities.",
          icon: "mdi-flash-outline",
        },
        {
          title: "Patient-Centered Approach",
          desc: "Compassion care prioritizing your comfort, dignity, and individual healthcare needs",
          icon: "mdi-heart-outline",
        },
        {
          title: "Efficient Service Delivery",
          desc: "Streamlined process and quixk turnarround times to expedite your diagnosis and treatment.",
          icon: "mdi-clock-outline",
        },
        {
          title: "Quality Certifications",
          desc: "ISO Certified facility maintaining the highest standards of medical care and safety protocols.",
          icon: "mdi-file-certificate-outline",
        },
      ],
      journey: [
        {
          title: "Book Appointment",
          desc: "Schedule online or call us to reserve your preferred time slot.",
          icon: "mdi-calendar-check",
        },
        {
          title: "Visit Our Facility",
          desc: "Check in at our modern, comfortable clinic.",
          icon: "mdi-hospital-building",
        },
        {
          title: "Receive Care",
          desc: "Consultations and diagnostic tests with experts.",
          icon: "mdi-heart-pulse",
        },
        {
          title: "Get Results",
          desc: "Secure and accurate reports via portal or in person.",
          icon: "mdi-file-document-outline",
        },
        {
          title: "Follow-up Support",
          desc: "Personalized treatment plans and ongoing care.",
          icon: "mdi-account-heart-outline",
        },
      ],
    };
  },
  methods: {
    goToDiv(num) {
      this.drawer = false;
      if (num == 1) {
        document.getElementById("service").scrollIntoView({
          behavior: "smooth",
        });
      } else if (num == 2) {
        document.getElementById("specialty").scrollIntoView({
          behavior: "smooth",
        });
      } else if (num == 3) {
        document.getElementById("paragon").scrollIntoView({
          behavior: "smooth",
        });
      } else if (num == 4) {
        document.getElementById("contact").scrollIntoView({
          behavior: "smooth",
        });
      } else if (num == 5) {
        document.getElementById("mainCover").scrollIntoView({
          behavior: "smooth",
        });
      }
    },
    addAppointment() {
      // this.mainData = { id: null };
      this.$router.push("/patient-appointment");
    },
  },
};
</script>

<style scoped>
.rounded-xl {
  border-radius: 16px;
}
.opacity-80 {
  opacity: 0.8;
}
.mobile-drawer {
  height: 100vh !important;
}
</style>
