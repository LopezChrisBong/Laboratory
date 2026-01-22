<template>
  <v-app>
    <!-- Top Bar -->
    <v-app-bar app color="white" dark elevation="3">
      <v-toolbar-title>
        <!-- <v-icon class="mr-2">mdi-account</v-icon> -->
        <v-btn
          v-if="$vuetify.breakpoint.smAndDown"
          icon
          @click="sidebarOpen = !sidebarOpen"
        >
          <v-icon color="black">mdi-menu</v-icon>
        </v-btn>
        <!-- {{
          $vuetify.breakpoint.smAndUp ? "Laboratory Information System" : "LIS"
        }} -->
        <div
          class="d-flex justify-center align-center"
          style="margin: 0 auto; width: 250px"
          v-if="$vuetify.breakpoint.smAndUp"
        >
          <v-img
            src="../../assets/img/paragon logo website.png"
            style="width: 2%"
          ></v-img>
          <div v-if="$vuetify.breakpoint.smAndUp" align="center">
            <h1 style="color: black">PARAGON</h1>
            <p style="color: black; margin-top: -15px; font-size: 11px">
              Diagnostics And Multi-Specialty Clinic
            </p>
          </div>
        </div>
      </v-toolbar-title>
      <div style="color: #3979b7" v-if="$vuetify.breakpoint.smAndDown">
        <div>
          {{ $store.state.user.fname.charAt(0) }}. {{ $store.state.user.lname }}
        </div>
        <div style="font-size: 10px">
          {{ assignedModule.description }}
        </div>
      </div>
      <v-spacer></v-spacer>
      <v-menu
        v-model="menu"
        offset-y
        transition="fade-transition"
        :close-on-content-click="false"
      >
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-badge
              :content="unreadCount"
              :value="hasUnread"
              color="red"
              overlap
            >
              <v-icon :color="hasUnread ? 'red' : '#3979b7'">
                {{ hasUnread ? "mdi-bell-ring" : "mdi-bell-outline" }}
              </v-icon>
            </v-badge>
          </v-btn>
        </template>

        <v-card width="380" class="rounded-lg">
          <!-- HEADER -->
          <div class="d-flex justify-space-between align-center px-4 py-3">
            <h3 class="text-h6 font-weight-bold m-0">Notifications</h3>
            <v-btn text small color="primary" @click="markAllAsRead">
              Mark all as read
            </v-btn>
          </div>

          <!-- UNREAD / READ TABS -->
          <v-tabs
            v-model="tab"
            background-color="transparent"
            color="primary"
            slider-color="primary"
            grow
            class="px-2"
          >
            <v-tab>Unread</v-tab>
            <v-tab>Read</v-tab>
          </v-tabs>

          <v-divider></v-divider>

          <v-tabs-items v-model="tab">
            <!-- UNREAD TAB -->
            <v-tab-item>
              <div style="max-height: 350px; overflow-y: auto">
                <v-list two-line>
                  <v-list-item
                    v-for="(notif, i) in unreadNotifications"
                    :key="'unread-' + i"
                    class="py-3 blue lighten-5"
                    @click="openNotification(notif)"
                  >
                    <!-- <v-list-item-avatar size="45">
                      <img :src="notif.avatar" />
                    </v-list-item-avatar> -->

                    <v-list-item-content>
                      <v-list-item-title>
                        <strong>{{ notif.name }}</strong
                        ><br />
                        <span class="grey--text"> {{ notif.message }}</span>
                      </v-list-item-title>

                      <v-list-item-subtitle>
                        {{ formatDateTime(notif.created_at) }}
                      </v-list-item-subtitle>
                    </v-list-item-content>

                    <!-- <v-list-item-action v-if="notif.type === 'request'">
                      <div class="d-flex flex-column">
                        <v-btn small color="primary" class="mb-1">Accept</v-btn>
                        <v-btn small outlined>Deny</v-btn>
                      </div>
                    </v-list-item-action> -->
                  </v-list-item>

                  <v-list-item v-if="unreadNotifications.length === 0">
                    <v-list-item-content class="text-center grey--text">
                      No unread notifications.
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </div>
            </v-tab-item>

            <!-- READ TAB -->
            <v-tab-item>
              <div style="max-height: 350px; overflow-y: auto">
                <v-list two-line>
                  <v-list-item
                    v-for="(notif, i) in readNotifications"
                    :key="'read-' + i"
                    class="py-3"
                    @click="openNotification(notif)"
                  >
                    <!-- <v-list-item-avatar size="45">
                      <img
                        :src="
                          notif.sex == 'Male'
                            ? 'https://randomuser.me/api/portraits/men/2.jpg'
                            : 'https://randomuser.me/api/portraits/women/3.jpg'
                        "
                      />
                    </v-list-item-avatar> -->

                    <v-list-item-content>
                      <v-list-item-title>
                        <strong>{{ notif.name }}</strong
                        ><br />
                        <span class="grey--text"> {{ notif.message }}</span>
                      </v-list-item-title>

                      <v-list-item-subtitle>
                        {{ formatDateTime(notif.created_at) }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>

                  <v-list-item v-if="readNotifications.length === 0">
                    <v-list-item-content class="text-center grey--text">
                      No read notifications.
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </div>
            </v-tab-item>
          </v-tabs-items>

          <v-divider></v-divider>

          <v-card-actions>
            <v-btn
              block
              color="primary"
              text
              @click="showAllNotifDialog = true"
            >
              View All Notifications
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>

      <v-menu>
        <template v-slot:activator="{ on }">
          <v-chip v-on="on" color="white" class="rounded-lg d-flex py-2">
            <div
              style="color: #3979b7"
              class="text-right"
              v-if="$vuetify.breakpoint.smAndUp"
            >
              <div>
                {{ $store.state.user.fname.charAt(0) }}.
                {{ $store.state.user.lname }}
              </div>
              <div style="font-size: 10px">
                {{ assignedModule.description }}
              </div>
            </div>
            <div class="ml-4">
              <v-avatar left :size="$vuetify.breakpoint.smAndUp ? 200 : 200">
                <img :src="profImg" max-width="200" />
              </v-avatar>
            </div>

            <!-- <span
              class="text-uppercase"
              v-show="$vuetify.breakpoint.smAndUp"
              style="width: 130px; text-align: center ;"
              >
              <strong>
                <v-icon size="30" right class="mx-3">
                  mdi-account-arrow-right
                </v-icon>
              </strong>
              {{ $store.state.user.fname }}
            </span> -->
            <!-- <v-icon
              v-show="$vuetify.breakpoint.smAndDown"
              size="30"
              right
              class="mx-1"
              >mdi-account-arrow-right</v-icon
            > -->
            <!-- <v-icon right color="white" class="px-2"> mdi-chevron-down </v-icon> -->
          </v-chip>
        </template>
        <!-- <v-card width="240">
          <v-list color="#2196F3">
            <v-list-item>
              <v-list-item-avatar>
                <img :src="profImg" max-width="60" />
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title class="white--text"
                  >{{ $store.state.user.fname }}
                  {{
                    $store.state.user.lname.charAt(0).toUpperCase()
                  }}.</v-list-item-title
                >
                <v-list-item-subtitle class="white--text"
                  >{{ $store.state.user.usertype.description }} /
                  {{ getMyRole($store.state.user.user.user_roleID) }}
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn icon @click="menu = false">
                  <v-icon class="white--text">mdi-close-circle</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>
          <v-list>
            <v-list-item @click="logout()">
              <v-list-item-action>
                <v-icon>mdi-logout</v-icon>
              </v-list-item-action>
              <v-list-item-subtitle
                ><strong>Sign Out </strong></v-list-item-subtitle
              >
            </v-list-item>
          </v-list>
        </v-card> -->
      </v-menu>
    </v-app-bar>

    <!-- Sidebar -->
    <v-navigation-drawer
      app
      v-model="sidebarOpen"
      :temporary="$vuetify.breakpoint.smAndDown"
      class="pa-3"
      v-if="$vuetify.breakpoint.smAndDown"
      height="100%"
    >
      <v-list nav dense class="sidebar mt-2">
        <v-list-item>
          <!-- <v-list-item-avatar>
            <v-avatar>
              <img :src="profImg" max-width="60" />
            </v-avatar>
          </v-list-item-avatar> -->
          <v-list-item-content>
            <v-list-item-title class="text-uppercase">
              <!-- {{ $store.state.user.fname }} -->
              <!-- {{ $store.state.user.lname }} -->
              {{ assignedModule.description }}<br /><span
                style="font-size: 10px"
              >
                <strong class="text-gray-100">{{
                  $route.meta.title
                }}</strong></span
              >
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <div v-for="(link, i) in links" :key="i" style="background: white">
          <v-list-item
            v-if="!link.subLink"
            :key="link.title"
            router
            :to="'/' + userType + link.route"
            color="#808191"
          >
            <v-list-item-icon>
              <v-icon>{{ link.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ link.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-group v-else :key="link" color="#3a3b3a" :value="false">
            <v-icon slot="prependIcon">{{ link.icon }}</v-icon>
            <template v-slot:activator>
              <v-list-item-title>{{ link.title }}</v-list-item-title>
            </template>
            <div class="sub-item">
              <v-list-item
                v-for="sublink in link.subLink"
                router
                :to="'/' + userType + sublink.route"
                :key="sublink.title"
                color="#808191"
              >
                <v-list-item-icon>
                  <!-- <v-icon class="">{{ sublink.icon }}</v-icon> -->
                </v-list-item-icon>
                <v-list-item-title class="">{{
                  sublink.title
                }}</v-list-item-title>
              </v-list-item>
            </div>
          </v-list-group>
        </div>

        <!-- Hardcoded Supplier Menu for Admin Only -->
        <!-- <div>
           <v-list-item
            :to="'/' + userType + '/supplier'"
            router
            class="rounded-lg mx-2"
          > 
          <v-list-item @click="logoutDialog = true">
            <v-list-item-icon>
              <v-icon color="red">mdi-logout</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Logout</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </div>-->
        <div class="mt-2">
          <v-divider></v-divider>
          <v-btn
            color="red"
            text
            block
            @click="logoutDialog = true"
            class="justify-start"
            ><v-icon color="red">mdi-logout</v-icon> Logout</v-btn
          >
        </div>
      </v-list>
    </v-navigation-drawer>

    <!-- Layout with Sidebar and Content -->
    <v-main>
      <v-container fluid>
        <v-row>
          <!-- Sidebar -->
          <v-col
            v-if="$vuetify.breakpoint.smAndUp"
            :cols="2"
            class="pa-3"
            style="position: fixed; height: 100vh; border-right: 1px solid #ddd"
          >
            <v-list nav dense class="sidebar">
              <v-list-item>
                <!-- <v-list-item-avatar>
                  <v-avatar>
                    <img :src="profImg" max-width="60" />
                  </v-avatar>
                </v-list-item-avatar> -->
                <v-list-item-content>
                  <v-list-item-title class="text-uppercase">
                    <!-- {{ $store.state.user.fname }} -->
                    <!-- {{ $store.state.user.lname }} -->
                    {{ assignedModule.description }}<br /><span
                      style="font-size: 10px"
                    >
                      <strong class="text-gray-100">{{
                        $route.meta.title
                      }}</strong></span
                    >
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-divider></v-divider>

              <div
                v-for="(link, i) in links"
                :key="i"
                style="background: white"
              >
                <v-list-item
                  v-if="!link.subLink"
                  :key="link.title"
                  router
                  :to="'/' + userType + link.route"
                  color="#808191"
                >
                  <v-list-item-icon>
                    <v-icon>{{ link.icon }}</v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title>{{ link.title }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>

                <v-list-group v-else :key="link" color="#3a3b3a" :value="false">
                  <v-icon slot="prependIcon">{{ link.icon }}</v-icon>
                  <template v-slot:activator>
                    <v-list-item-title>{{ link.title }}</v-list-item-title>
                  </template>
                  <div class="sub-item">
                    <v-list-item
                      v-for="sublink in link.subLink"
                      router
                      :to="'/' + userType + sublink.route"
                      :key="sublink.title"
                      color="#808191"
                    >
                      <v-list-item-icon>
                        <!-- <v-icon class="">{{ sublink.icon }}</v-icon> -->
                      </v-list-item-icon>
                      <v-list-item-title class="">{{
                        sublink.title
                      }}</v-list-item-title>
                    </v-list-item>
                  </div>
                </v-list-group>
              </div>

              <!-- Hardcoded Supplier Menu for Admin Only -->
              <!-- <div>
                 <v-list-item
            :to="'/' + userType + '/supplier'"
            router
            class="rounded-lg mx-2"
          > 
                <v-divider></v-divider>
                <v-list-item @click="logoutDialog = true">
                  <v-list-item-icon>
                    <v-icon>mdi-logout</v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title>Logout</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </div>-->
              <div class="mt-2">
                <v-divider></v-divider>
                <v-btn
                  color="red"
                  text
                  block
                  @click="logoutDialog = true"
                  class="justify-start"
                  ><v-icon color="red">mdi-logout</v-icon> Logout</v-btn
                >
              </div>
            </v-list>
          </v-col>
        </v-row>
        <v-row>
          <!-- Feed -->
          <v-col
            :cols="$vuetify.breakpoint.smAndUp ? '2' : '0'"
            class="pa-3"
            v-if="$vuetify.breakpoint.smAndUp"
          >
          </v-col>
          <v-col :cols="$vuetify.breakpoint.smAndUp ? '10' : '12'" class="pa-3">
            <div class="fill-height pb-6" style="background-color: white">
              <div class="d-flex justify-space-between py-4 px-4">
                <!-- <strong class="text-gray-100">{{ $route.meta.title }}</strong> -->
              </div>
              <router-view v-on:reloadProfile="loadImg" />
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <v-dialog
      v-model="showAllNotifDialog"
      max-width="520"
      transition="dialog-bottom-transition"
    >
      <v-card class="rounded-lg">
        <v-card-title class="py-4 d-flex align-center">
          <v-icon color="primary" class="mr-2">mdi-bell</v-icon>
          <span class="text-h6 font-weight-bold">All Notifications</span>
          <v-spacer></v-spacer>

          <v-btn icon @click="showAllNotifDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class="py-0">
          <div style="max-height: 420px; overflow-y: auto">
            <v-list two-line>
              <v-list-item
                v-for="(notif, index) in notifications"
                :key="index"
                :class="notif.read ? 'grey lighten-5' : 'blue lighten-5'"
                class="rounded-lg mb-2"
              >
                <v-list-item-avatar class="mr-3" size="40">
                  <v-icon :color="notif.read ? 'grey' : 'primary'">
                    {{ notif.read ? "mdi-email-open" : "mdi-email" }}
                  </v-icon>
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title class="font-weight-medium">
                    {{ notif.title }}
                  </v-list-item-title>

                  <v-list-item-subtitle class="grey--text caption mt-1">
                    {{ formatDateTime(notif.created_at) }}
                  </v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-action>
                  <v-chip
                    small
                    :color="notif.read ? 'grey' : 'primary'"
                    text-color="white"
                    label
                    @click="openNotification(notif)"
                  >
                    {{ notif.read ? "Read" : "New" }}
                  </v-chip>
                </v-list-item-action>
              </v-list-item>

              <div
                v-if="notifications.length === 0"
                class="text-center grey--text py-6"
              >
                No notifications found.
              </div>
            </v-list>
          </div>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="py-3">
          <v-btn block color="primary" text @click="showAllNotifDialog = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Logout Dialog -->
    <v-dialog v-model="logoutDialog" max-width="420" persistent>
      <v-card class="rounded-lg">
        <!-- Header -->
        <v-card-title class="headline d-flex align-center">
          <v-icon color="red" class="mr-2">mdi-logout</v-icon>
          Confirm Logout
        </v-card-title>

        <v-divider></v-divider>

        <!-- Content -->
        <v-card-text class="text-center py-6">
          <p class="mb-2">Are you sure you want to log out?</p>
          <span class="grey--text text--darken-1">
            You will need to log in again to continue.
          </span>
        </v-card-text>

        <v-divider></v-divider>

        <!-- Actions -->
        <v-card-actions class="px-4 py-3">
          <v-spacer></v-spacer>

          <v-btn text color="grey" @click="logoutDialog = false">
            Cancel
          </v-btn>

          <v-btn color="red" dark @click="logout()"> Logout </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
export default {
  props: ["screenSmall", "reloadImg"],
  watch: {
    screenSmall: {
      handler(val) {
        this.drawer = val;
        this.mini = false;
      },
    },
    reloadImg: {
      handler() {
        // this.loadImg();
      },
    },
  },
  data() {
    return {
      search: "",
      drawer: true,
      mini: false,
      profImg: null,
      mobile: false,
      logoutDialog: false,
      isActiveOIC: false,
      userRoleList: [],
      links: [],
      menu: false,
      userType: null,
      tab: 0,
      notif_cnt: 0,
      showAllNotifDialog: false,
      interval: null,
      loading: false,
      assignedModule: [],
      options: [],
      schooYearList: [],
      notifications: [],
      sidebarOpen: true,
    };
  },
  computed: {
    unreadCount() {
      return this.notifications.filter((n) => !n.read).length;
    },
    hasUnread() {
      return this.unreadCount > 0;
    },
    unreadNotifications() {
      return this.notifications.filter((n) => !n.read);
    },
    readNotifications() {
      return this.notifications.filter((n) => n.read);
    },
  },

  mounted() {
    this.initialize();
    if (this.$vuetify.breakpoint.xs) {
      this.drawer = false;
      this.mini = false;
    }
  },

  methods: {
    initialize() {
      this.loadImg();
      this.getAllNotifications();
      this.getAssignedModules();
    },
    openNotification(notif) {
      // Example handler – you can route or open a dialog
      notif.read = true;
      // console.log("Open notification:", notif);
      if (notif.route) {
        this.$router.push(notif.route);
      }
    },
    getMyRole(id) {
      var role;
      for (let i = 0; i < this.userRoleList.length; i++) {
        if (parseInt(this.userRoleList[i].id) == parseInt(id)) {
          role = this.userRoleList[i].description;
        }
      }
      return role;
    },

    openMobileNav() {
      this.drawer = true;
    },
    loadImg() {
      this.axiosCall("/user-details/getUserProfileImg", "GET").then((res) => {
        this.profImg =
          process.env.VUE_APP_SERVER +
          "/user-details/getProfileImg/" +
          res.data.profile_img;
      });
    },
    toProfile() {
      var usertype = this.$store.state.user.usertype.description;
      if (this.$store.state.user.user.user_roleID == 5) {
        this.$router.push("/superadmin/profile");
      } else {
        this.$router.push("/" + usertype.toLowerCase() + "/profile");
      }
    },
    getCurrentDate() {
      const cur_date = new Date();
      const month = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const day = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      return (
        day[cur_date.getDay()] +
        ", " +
        month[cur_date.getMonth()] +
        " " +
        cur_date.getDate() +
        "; " +
        this.formatAMPM(cur_date)
      );
    },
    formatAMPM(date) {
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var ampm = hours >= 12 ? "pm" : "am";
      hours = hours % 12;
      hours = hours ? hours : 12;
      minutes = minutes < 10 ? "0" + minutes : minutes;
      var strTime = hours + ":" + minutes + " " + ampm;
      return strTime;
    },

    closeNav() {
      this.drawer = false;

      this.$emit("closeNav");
    },

    loadMenu(userType, userRole) {
      this.axiosCall("/assigned-modules/getMyAssignedModules/my", "GET").then(
        (resp) => {
          this.links = JSON.parse(resp.data.assign_mods);
          switch (userType) {
            case 1:
              this.userType = "admin";

              break;
            case 2:
              if (userRole == 5) {
                this.userType = "superadmin";
              } else {
                this.userType = "employee";
              }
              break;
            case 3:
              this.userType = "security";

              break;
            case 4:
              this.userType = "auditor";

              break;
          }
        },
      );
    },
    markAllAsRead() {
      if (!Array.isArray(this.readList)) this.readList = [];
      if (!Array.isArray(this.unreadList)) this.unreadList = [];

      // let assignedModule = this.$store.state.user.user.assignedModuleID;
      let userID = this.$store.state.user.id;

      this.axiosCall("/notification/mark-all-read/" + userID, "PATCH", {
        read: true,
      }).then((res) => {
        console.log(res);

        // this.menu = false;
        this.unreadCount = 0;
        this.unreadList = [];
        this.hasUnread = false;
        this.getAllNotifications();

        // if (assignedModule == 3) {
        //   this.$router.push("/" + this.userType + "/appointment");
        // } else {
        //   this.$router.push("/" + this.userType + "/patient");
        // }
      });
    },
    getAllNotifications() {
      let assignedModule = this.$store.state.user.user.assignedModuleID;
      if (assignedModule == 3) {
        this.axiosCall(
          "/notification/getAllReceptionist/Notification",
          "GET",
        ).then((res) => {
          this.notifications = res.data;
        });
      } else {
        let userID = this.$store.state.user.id;
        this.axiosCall(
          "/notification/getAllNotifications/" + userID,
          "GET",
        ).then((res) => {
          this.notifications = res.data;
        });
      }
    },
    getAssignedModules() {
      this.axiosCall(
        "/assigned-modules/" + this.$store.state.user.user.assignedModuleID,
        "GET",
      ).then((res) => {
        console.log("getAssignedModulessss", res.data);
        this.assignedModule = res.data;
      });
    },
  },
  beforeDestroy() {
    // prevent memory leak
    clearInterval(this.interval);
  },

  created: function () {
    // this.getMyAssignedModules();
    let userType = this.$store.state.user.user.usertypeID;

    let userrole = this.$store.state.user.user.user_roleID;
    // this.getMyDesignation();
    this.loadMenu(userType, userrole);

    // this.interval = setInterval(() => {
    //   this.getMyNotifs();
    // }, 180000);
  },
};
</script>

<style scoped>
.modal_content {
  padding: 5px 0 5px 0;
}
.modal_header {
  background-color: #2196f3;
  padding: 5px;
}
.notifDiv {
  position: sticky;
  top: 0;
  z-index: 50;
  background-color: #2196f3;
  color: white;
  flex: auto;
  justify-content: space-between;
}
.showAllNotifDiv {
  position: sticky;
  bottom: 0;
  cursor: pointer;
}
.showAllNotif {
  margin: 0;
  font-size: 12px;
  background-color: #2196f3;
  padding: 10px;
  text-align: center;
  max-height: 55vh;
  color: white;
}
.unopened {
  /* top right bottom left */
  margin: 10px;
  /* border-bottom: 0.5px solid #cbcec7; */
  border-radius: 10px;
  background-color: #1882d8;
}
.unopened:hover {
  background-color: #d8ff8f;
}
.opened {
  /* top right bottom left */
  margin: 10px;
  border: 0.5px solid #0fb2b8;
  border-radius: 10px;
}
.opened:hover {
  background-color: #d8ff8f;
}
::v-deep .v-toolbar__content {
  padding: 8px !important;
}
.v-list-item__icon {
  color: gray !important;
}
.sidebar .v-list-item {
  border-radius: 5px;
  /* margin-left: 10px; */
  color: gray;
}

.notifBadgeYellow {
  background-color: rgba(255, 255, 34, 0.5);
  /* border: 1px solid rgb(255, 217, 0); */
  padding: 3px;
  border-radius: 4px;
  font-size: 10px;
  color: rgb(140, 140, 14);
  margin: 0px 0px 0px 5px;
}

.notifBadgePurple {
  background-color: rgba(255, 138, 255, 0.5);
  /* border: 1px solid rgb(255, 217, 0); */
  padding: 3px;
  border-radius: 4px;
  font-size: 10px;
  color: purple;
  margin: 0px 0px 0px 5px;
}

.notifBadgeBlue {
  background-color: rgba(138, 210, 255, 0.5);
  /* border: 1px solid rgb(255, 217, 0); */
  padding: 3px;
  border-radius: 4px;
  font-size: 10px;
  color: rgb(0, 75, 128);
  margin: 0px 0px 0px 5px;
}

.notifBadgeGreen {
  background-color: rgba(157, 255, 138, 0.5);
  /* border: 1px solid rgb(255, 217, 0); */
  padding: 3px;
  border-radius: 4px;
  font-size: 10px;
  color: rgb(21, 128, 0);
  margin: 0px 0px 0px 5px;
}

.sidebar .v-list-item:hover {
  /* background-color: rgba(255, 247, 247, 0.949);
  color: black; */
  border-radius: 5px;
  transition: 0.5s;
}

.sidebar .v-list-item--active .v-list-item__title {
  color: #0052a3 !important;
}

.sidebar .v-list-item--active .v-list-item__icon i {
  color: #0052a3 !important;
}

.v-list-group--active .man {
  color: #3a3b3a !important;
}

.sidebar .v-list-item--active {
  background-color: #e8f2f8 !important;
  color: #ffffff !important;
}
.sidebar .v-list-group--active {
  background-color: #e8f2f8 !important;
  border-radius: 5px;

  color: #ffffff !important;
}

.sidebar div .sub-item .v-list-item {
  background-color: rgb(255, 255, 255) !important;
}

.sidebar div .sub-item .v-list-item .v-list-item__title {
  color: #3a3b3a !important;
}
.sidebar div .sub-item .v-list-item .v-list-item__icon i {
  color: #3a3b3a !important;
}

.sidebar div .sub-item .v-list-item--active {
  background-color: #76ccee !important;
  color: #3a3b3a !important;
}

.active_grp {
  background-color: white;
}

.nav-drawer .item-title {
  font-style: normal;
  font-weight: 500;
  line-height: 21px;
}
.v-subheader {
  border-bottom: 1px solid #cdcbd0;
  color: green;
}
.notif_msg {
  font-size: 10px;
}
.v-application--is-ltr
  .v-list--dense.v-list--nav
  .v-list-group--no-action
  > .v-list-group__items
  > .v-list-item {
  padding: 0 8;
}
.sub-item {
  border-radius: 5px;
  background: white;
}

.v-list-item__title {
  color: black !important;
}

.v-list-item__icon i {
  color: rgb(0, 0, 0) !important;
}

/* 
.v-list-group {
  color: white !important;
} */

.v-hover {
  border-color: grey !important;
}
.v-list-group .v-list-group--active {
  color: #3a3b3a !important;
}
::v-deep .v-list-group i {
  color: rgb(0, 0, 0) !important;
}

::v-deep .v-list-group--active i {
  color: #3a3b3a !important;
}
.text-red {
  color: red !important;
  font-weight: bold;
}
/* .v-list-group__header__append-icon {
  display: none !important;
} */
</style>
