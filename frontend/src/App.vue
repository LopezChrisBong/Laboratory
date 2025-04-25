<template>
  <v-fade-transition mode="out-in">
    <router-view v-if="$store.state.user || render" />
    <loading-screen v-else />
  </v-fade-transition>
</template>

<script>
export default {
  name: "App",
  components: {
    "loading-screen": () => import("./components/Utils/LoadingScreen.vue"),
  },
  data: () => ({
    render: false,
  }),
  created: function() {
    //VueX set this Vue Variable
    // this.$store.dispatch("setThisVue", this);
    // console.log("is Expired: " + this.$store.getters.isExpired);
    // console.log(this.$store.state.expiryDate);
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const token = urlParams.get("token");
    if (token) {
      localStorage.setItem("token", token);
      this.$store.commit("setExpiryDate");
      this.$router.push("/");
      location.reload();
    }

    if (this.$store.state.expiryDate < Date.now()) {
      this.$store.dispatch("setUser", null);
      this.$store.dispatch("setIsAuthenticated", 0);
      this.render = true;
      // this.$router.push("/");
      // setTimeout(() => {
      //   location.reload();
      // }, 100);
    } else {
      this.render = true;
      this.getUser();
    }
  },
  methods: {
    getUser() {
      if (this.$store.getters.getIsAuthenticated == 0) {
        if (localStorage.getItem("token")) {
          // let token = { token: localStorage.getItem("token") };
          this.axiosCall("/auth/current_user", "GET")
            .then((res) => {
              if (res.statusCode != 401) {
                let data = res.data.userdetail;

                this.$store.dispatch("setUser", data);
                this.$store.dispatch("setIsAuthenticated", 1);
                if (data.usertype.id == 1) {
                  this.$router.push("/admin/dashboard");
                } else if (data.usertype.id == 2) {
                  if (data.user.user_roleID == 5) {
                    this.$router.push("/superadmin/dashboard");
                  } else {
                    this.$router.push("/employee/dashboard");
                  }
                } else if (data.usertype.id == 3) {
                  this.$router.push("/security/dashboard");
                } else if (data.usertype.id == 4) {
                  this.$router.push("/auditor/dashboard");
                }
              } else {
                this.$store.dispatch("setUser", null);
                this.$store.dispatch("setIsAuthenticated", 0);
                setTimeout(() => {
                  location.reload();
                }, 500);
              }
            })
            .catch((error) => {
              console.log(error);
              this.render = true;
            });
        } else {
          this.render = true;
        }
      } else {
        this.axiosCall("/auth/current_user", "GET").then((res) => {
          // console.log(res.data);
          if (res.statusCode != 401) {
            let data = res.data.userdetail;
            this.$store.dispatch("setUser", data);
            this.$store.dispatch("setIsAuthenticated", 1);
          } else {
            this.$store.dispatch("setUser", null);
            this.$store.dispatch("setIsAuthenticated", 0);
            setTimeout(() => {
              location.reload();
            }, 500);
          }
        });
      }
    },
  },
};
</script>
<style>
/* SCROLL BAR CUSTOMIZE*/
/* width */
::-webkit-scrollbar {
  width: 8px;
}

/* Track */
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px rgb(206, 196, 196);
  border-radius: 5px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #9da19c;
  border-radius: 5px;
}
</style>
