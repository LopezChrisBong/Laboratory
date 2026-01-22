<template>
  <v-app>
    <!-- App Bar -->
    <v-app-bar app color="white" dark>
      <v-app-bar-nav-icon
        color="black"
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <v-toolbar-title style="margin: 0 auto; width: 250px">
        <div class="d-flex justify-center align-center">
          <v-img
            v-if="$vuetify.breakpoint.smAndUp"
            src="../../assets/img/paragon logo website.png"
            style="width: 2%"
          ></v-img>

          <div v-if="$vuetify.breakpoint.smAndUp" align="center">
            <h1 style="color: black">PARAGON</h1>
            <p style="color: black; margin-top: -15px; font-size: 11px">
              Diagnostics And Multi-Specialty Clinic
            </p>
          </div>
          <div v-else>
            <h4>PARAGON</h4>
          </div>
        </div>
      </v-toolbar-title>

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
              <v-icon :color="hasUnread ? 'red' : 'black'">
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
              style="justify-items: right; align-items: right"
            >
              <v-img
                src="../../assets/img/paragon logo website.png"
                style="width: 60%"
              ></v-img>
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="m-0"
              style="justify-items: left; align-items: center"
            >
              <div class="mt-2">
                <h2>PARAGON</h2>
              </div>
            </v-col>
          </v-row>
        </div>
        <div v-if="$vuetify.breakpoint.smAndDown" class="d-flex align-center">
          <div style="width: 30%" class="ml-5">
            <v-img
              src="../../assets/img/paragon logo website.png"
              style="width: 90%"
            ></v-img>
          </div>
          <div>
            <h2>PARAGON</h2>
          </div>
        </div>

        <div v-for="(link, i) in links" :key="i">
          <v-subheader
            v-if="link.section"
            class="text-uppercase font-weight-bold white--text text--disabled"
          >
            {{ link.section }}
          </v-subheader>
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
        <!-- <div v-if="userType === 'admin'">
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
        </div> -->
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container fluid>
        <v-row>
          <v-col class="pa-3">
            <div class="fill-height pb-6" style="background-color: white">
              <div class="d-flex justify-space-between py-4 px-4">
                <strong class="text-gray-100">{{ $route.meta.title }}</strong>
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
    // reloadImg: {
    //   handler() {
    //     // this.loadImg();
    //   },
    // },
  },
  data() {
    return {
      search: "",
      drawer: true,
      mini: false,
      profImg: null,
      mobile: false,
      isActiveOIC: false,
      tab: 0,
      userRoleList: [],
      links: [],
      userType: null,
      notif_cnt: 0,
      showAllNotifDialog: false,
      interval: null,
      loading: false,
      options: [],
      schooYearList: [],
      menu: false,
      notifications: [],
      sidebarOpen: true,
      readList: [],
      unreadList: [],
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
          this.showAllNotifDialog = false;
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

    // markAllAsRead() {
    //   // Move all unread to read
    //   let assignedModule = this.$store.state.user.user.assignedModuleID;
    //   this.readList.unshift(
    //     ...this.unreadList.map((n) => ({ ...n, read: true }))
    //   );
    //   this.unreadList = [];

    //   // Update badge
    //   this.unreadCount = 0;
    //   this.hasUnread = false;

    //   this.axiosCall("/notification/mark-all-read", "PATCH", {
    //     read: true,
    //   }).then((res) => {
    //     console.log(res);
    //     if (assignedModule == 3) {
    //       this.$router.push("/appointment");
    //     } else {
    //       this.$router.push("/patient");
    //     }
    //   });
    // },
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
