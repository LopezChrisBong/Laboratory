<template>
  <v-app>
    <!-- App Bar -->
    <v-app-bar app color="white" dark>
      <v-app-bar-nav-icon
        color="black"
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <v-toolbar-title style="margin:0 auto; width:250px">
        <div class="d-flex justify-center align-center">
          <v-img
            v-if="$vuetify.breakpoint.smAndUp"
            src="../../assets/img/paragon logo website.png"
            style="width: 2%;"
          ></v-img>

          <div v-if="$vuetify.breakpoint.smAndUp" align="center">
            <h1 style="color: black;">PARAGON</h1>
            <p style="color: black; margin-top: -15px; font-size: 11px;">
              Diagnostics And Multi-Specialty Clinic
            </p>
          </div>
          <div v-else>
            <h4>PARAGON</h4>
          </div>
        </div>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-badge
              :content="unreadCount"
              :value="hasUnread"
              color="red"
              overlap
              offset-x="50"
              offset-y="25"
            >
              <!-- <template #badge>
                <span v-if="hasUnread" class="text-white text-caption">
                  {{ unreadCount > 99 ? "99+" : unreadCount }}
                </span>
              </template> -->

              <v-btn icon @click="menu = !menu">
                <v-icon :color="hasUnread ? 'red' : 'black'">
                  {{ hasUnread ? "mdi-bell-ring" : "mdi-bell-outline" }}
                </v-icon>
              </v-btn>
            </v-badge>
          </v-btn>
        </template>
        <v-card width="300">
          <v-list v-if="notifications.legnth != []">
            <v-list-item
              v-for="(notif, index) in notifications"
              :key="index"
              @click="openNotification(notif)"
            >
              <v-list-item-content>
                <v-list-item-title
                  :style="{ color: notif.read ? 'inherit' : 'red' }"
                >
                  {{ notif.title }}
                  <!-- {{ notif.read == true ? "(read)" : "(unread)" }} -->
                  <v-icon size="large" color="teal-darken-2">{{
                    notif.read == true ? "mdi-email-open" : "mdi-email"
                  }}</v-icon>
                </v-list-item-title>
                <v-list-item-subtitle
                  >{{ formatDate(notif.created_at) }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-list v-else>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-subtitle>
                  No data found!
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn text color="primary" @click="showAllNotifDialog = true">
              View All Notifications
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
      <v-menu>
        <template v-slot:activator="{ on }">
          <v-chip v-on="on" color="#3386ff" class="rounded-lg d-flex py-2">
            <v-avatar left :size="$vuetify.breakpoint.smAndUp ? 100 : 100">
              <img :src="profImg" max-width="100" />
            </v-avatar>
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
            <v-icon
              v-show="$vuetify.breakpoint.smAndDown"
              size="30"
              right
              class="mx-1"
              >mdi-account-arrow-right</v-icon
            >
            <v-icon right color="white" class="px-2"> mdi-chevron-down </v-icon>
          </v-chip>
        </template>
        <v-card width="240">
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
            <!-- <v-list-item @click="toProfile()">
              <v-list-item-action>
                <v-icon>mdi-account</v-icon>
              </v-list-item-action>
              <v-list-item-subtitle
                ><strong>Profile</strong></v-list-item-subtitle
              >
            </v-list-item> -->
            <v-list-item @click="logout()">
              <v-list-item-action>
                <v-icon>mdi-logout</v-icon>
              </v-list-item-action>
              <v-list-item-subtitle
                ><strong>Sign Out </strong></v-list-item-subtitle
              >
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>
    </v-app-bar>

    <!-- Navigation Drawer -->
    <!-- Navigation Drawer -->
    <v-navigation-drawer
      class="sidebar"
      color="#1C2536"
      app
      dark
      v-model="drawer"
      width="280"
    >
      <v-list dense class="mt-2">
        <!-- Create New Button -->
        <!-- <v-list-item class="px-4">
          <v-btn block color="#3B82F6" dark>
            <v-icon left>mdi-plus</v-icon>
            Create New...
          </v-btn>
        </v-list-item> -->

        <!-- Logo -->
        <div v-if="$vuetify.breakpoint.smAndUp">
          <v-row>
            <v-col
              cols="12"
              md="4"
              style="justify-items: right; align-items: right: ;;"
            >
              <v-img
                src="../../assets/img/paragon logo website.png"
                style="width: 60%;  "
              ></v-img>
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="m-0"
              style="justify-items: left; align-items: center;"
            >
              <div class="mt-2">
                <h2>PARAGON</h2>
              </div>
            </v-col>
          </v-row>
        </div>
        <div v-if="$vuetify.breakpoint.smAndDown" class="d-flex align-center">
          <div style="width: 30%;" class="ml-5">
            <v-img
              src="../../assets/img/paragon logo website.png"
              style="width: 90%;  "
            ></v-img>
          </div>
          <div>
            <h2>PARAGON</h2>
          </div>
        </div>

        <!-- List Items -->
        <div v-for="(link, i) in links" :key="i">
          <!-- Section Titles -->
          <v-subheader
            v-if="link.section"
            class="text-uppercase font-weight-bold white--text text--disabled"
          >
            {{ link.section }}
          </v-subheader>

          <!-- Single Item -->
          <v-list-item
            :to="'/' + userType + link.route"
            v-if="!link.subLink"
            :key="link.title"
            router
            class="rounded-lg mx-2"
            active-class="active-link"
          >
            <v-list-item-icon>
              <v-icon>{{ link.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ link.title }}</v-list-item-title>
            </v-list-item-content>

            <!-- Badge Count or Dot -->
            <v-list-item-action v-if="link.badge">
              <v-chip
                v-if="link.badge !== true"
                small
                color="#334155"
                text-color="white"
                >{{ link.badge }}</v-chip
              >
              <v-badge
                v-else
                color="red"
                dot
                offset-x="10"
                offset-y="10"
              ></v-badge>
            </v-list-item-action>
          </v-list-item>

          <!-- Grouped Items -->
          <v-list-group
            v-else
            color="#3a3b3a"
            no-action
            :value="false"
            class="mx-2"
            :key="link.title"
          >
            <template v-slot:activator>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon>{{ link.icon }}</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ link.title }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>

            <v-list-item
              v-for="sublink in link.subLink"
              :key="sublink.title"
              router
              :to="'/' + userType + sublink.route"
              class="pl-10"
            >
              <v-list-item-icon>
                <v-icon v-if="sublink.icon">{{ sublink.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-title>{{ sublink.title }}</v-list-item-title>
            </v-list-item>
          </v-list-group>
        </div>

        <!-- Hardcoded Supplier Menu for Admin Only -->
        <div v-if="userType === 'admin'">
          <v-list-item
            :to="'/' + userType + '/supplier'"
            router
            class="rounded-lg mx-2"
            active-class="active-link"
          >
            <v-list-item-icon>
              <v-icon>mdi-truck-delivery</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Supplier</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </div>
      </v-list>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main>
      <v-container fluid>
        <v-row>
          <!-- Feed -->
          <v-col class="pa-3">
            <div class=" fill-height pb-6" style="background-color:white; ">
              <div class="d-flex justify-space-between py-4 px-4  ">
                <strong class="text-gray-100">{{ $route.meta.title }}</strong>
              </div>
              <router-view v-on:reloadProfile="loadImg" />
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <v-dialog v-model="showAllNotifDialog" max-width="500">
      <v-card>
        <v-card-title class="headline">All Notifications</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-list dense>
            <v-list-item v-for="(notif, index) in notifications" :key="index">
              <v-list-item-content>
                <v-list-item-title
                  >{{ notif.title }}
                  <!-- {{
                    notif.read == true ? "(read)" : "(unread)"
                  }} -->
                </v-list-item-title>
                <v-list-item-subtitle
                  >{{ formatDate(notif.created_at) }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" text @click="showAllNotifDialog = false"
            >Close</v-btn
          >
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
        this.loadImg();
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
      isActiveOIC: false,
      userRoleList: [],
      links: [],
      userType: null,
      notif_cnt: 0,
      showAllNotifDialog: false,
      interval: null,
      loading: false,
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
  },

  mounted() {
    this.initialize();
  },

  methods: {
    initialize() {
      this.getAllNotifications();
    },
    openNotification(notif) {
      notif.read = true;
      let data = {
        read: true,
      };
      this.axiosCall("/notification/" + notif.id, "PATCH", data).then((res) => {
        console.log(res);
        if (notif.route) {
          // this.$router.push(notif.route);
          this.$router.push("/" + this.userType + notif.route);
        }
      });
      // Example handler – you can route or open a dialog

      //   // console.log("Open notification:", notif);
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
    getAllNotifications() {
      let assignedModule = this.$store.state.user.user.assignedModuleID;

      if (assignedModule == 3) {
        this.axiosCall(
          "/notification/getAllReceptionist/Notification",
          "GET"
        ).then((res) => {
          this.notifications = res.data;
        });
      } else {
        let userID = this.$store.state.user.id;
        this.axiosCall(
          "/notification/getAllNotifications/" + userID,
          "GET"
        ).then((res) => {
          this.notifications = res.data;
        });
      }
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
        }
      );
    },
  },
  beforeDestroy() {
    // prevent memory leak
    clearInterval(this.interval);
  },

  created: function() {
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
body {
  background-color: #f9f9f9;
  margin: 0;
  padding: 0;
}

.sidebar .v-list-item--active {
  background-color: #e4fbff !important;
  color: #000000 !important;
}

.sidebar .v-list-group--active {
  background-color: #111ed8 !important;
  border-radius: 5px;
  color: #ffffff !important;
}
.sidebar .v-list-group .v-list-item--active {
  background-color: #e4fbff !important;
  border-radius: 5px;
  color: #000000 !important;
}
</style>
