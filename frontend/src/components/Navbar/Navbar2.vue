<template>
  <v-app>
    <!-- Top Bar -->
    <v-app-bar app color="#0e2b62" dark>
      <v-toolbar-title>
        <!-- <v-icon class="mr-2">mdi-account</v-icon> -->
        <v-btn
          v-if="$vuetify.breakpoint.smAndDown"
          icon
          @click="sidebarOpen = !sidebarOpen"
        >
          <v-icon>mdi-menu</v-icon>
        </v-btn>
        <!-- {{
          $vuetify.breakpoint.smAndUp ? "Laboratory Information System" : "LIS"
        }} -->
        <div
          class="d-flex justify-center align-center"
          style="margin:0 auto; width:250px"
          v-if="$vuetify.breakpoint.smAndUp"
        >
          <v-img
            src="../../assets/img/paragon logo website.png"
            style="width: 2%;"
          ></v-img>
          <div v-if="$vuetify.breakpoint.smAndUp" align="center">
            <h1 style="color: white;">PARAGON</h1>
            <p style="color: white; margin-top: -15px; font-size: 11px;">
              Diagnostics And Multi-Specialty Clinic
            </p>
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
          <v-list>
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
                </v-list-item-title>
                <v-list-item-subtitle
                  >{{ notif.date }}
                  {{ notif.read == true ? "" : "(1)" }}</v-list-item-subtitle
                >
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
          <v-chip v-on="on" color="#0e2b62" class="rounded-lg d-flex py-2">
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
            <v-icon right class="px-2"> mdi-chevron-down </v-icon>
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

    <!-- Sidebar -->
    <v-navigation-drawer
      app
      v-model="sidebarOpen"
      :temporary="$vuetify.breakpoint.smAndDown"
      class="pa-3"
      v-if="$vuetify.breakpoint.smAndDown"
    >
      <v-list nav dense class="sidebar mt-2">
        <v-list-item>
          <v-list-item-avatar>
            <v-avatar>
              <img :src="profImg" max-width="60" />
            </v-avatar>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="text-uppercase">
              <!-- {{ $store.state.user.fname }} -->
              {{ $store.state.user.lname }}</v-list-item-title
            >
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
      </v-list>
    </v-navigation-drawer>

    <!-- Layout with Sidebar and Content -->
    <v-main>
      <v-container fluid>
        <v-row>
          <!-- Sidebar -->
          <v-col
            :cols="$vuetify.breakpoint.smAndUp ? '2' : '0'"
            class="pa-3"
            style="border-right: 1px solid #ddd; position: fixed;"
            v-if="$vuetify.breakpoint.smAndUp"
          >
            <v-list nav dense class="sidebar mt-2">
              <v-list-item>
                <v-list-item-avatar>
                  <v-avatar>
                    <img :src="profImg" max-width="60" />
                  </v-avatar>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title class="text-uppercase">
                    <!-- {{ $store.state.user.fname }} -->
                    {{ $store.state.user.lname }}</v-list-item-title
                  >
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
                <v-list-item-title>{{ notif.title }}</v-list-item-title>
                <v-list-item-subtitle
                  >{{ notif.date }} {{ notif.read }}</v-list-item-subtitle
                >
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
      notifications: [
        {
          title: "New lab result uploaded",
          date: "April 19, 2025",
          read: false,
          route: "/reports/123",
        },
        {
          title: "Sample received",
          date: "April 18, 2025",
          read: true,
          route: "/reports/123",
        },
        {
          title: "Patient report ready",
          date: "April 18, 2025",
          read: false,
          route: "/reports/123",
        },
      ],
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
    if (this.$vuetify.breakpoint.xs) {
      this.drawer = false;
      this.mini = false;
    }
  },

  methods: {
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
  color: #3a3b3a !important;
}

.sidebar .v-list-item--active .v-list-item__icon i {
  color: #3a3b3a !important;
}

.v-list-group--active .man {
  color: #3a3b3a !important;
}

.sidebar .v-list-item--active {
  background-color: #3597e7 !important;
  color: #3a3b3a !important;
}
.sidebar .v-list-group--active {
  background-color: #3597e7 !important;
  border-radius: 5px;

  color: #3a3b3a !important;
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
