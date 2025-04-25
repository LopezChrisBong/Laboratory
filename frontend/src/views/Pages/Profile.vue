<template>
  <div class="mx-2">
    <v-card class="mt-2 pt-2 pb-8">
      <v-row style="border-radius: 10px" class="elevation-4 mx-6 mt-6">
        <!-- <v-card class="card-style rounded-xl"> -->
        <v-col cols="12" md="12" v-if="readonly == false">
          <v-img align="center">
            <v-row align="center" class="fill-height">
              <v-col align-self="start" cols="12">
                <v-avatar
                  class="mt-1 mb-1"
                  size="185"
                  style="border: 2px solid; border-color: #a9a9a9"
                >
                  <v-img
                    :src="!isSelecting ? data.profile_img : previewImg"
                  ></v-img>

                  <v-btn
                    variant="outlined"
                    v-if="!readonly"
                    color="blue"
                    style="border-radius: 100%"
                    height="40px"
                    width="40px"
                    dark
                    x-small
                    absolute
                    bottom
                    right
                    @click="handleFileImport()"
                  >
                    <v-icon> mdi-image-edit-outline</v-icon>
                  </v-btn>
                </v-avatar>
                <v-file-input
                  @change="onFileChanged()"
                  id="fileUpload"
                  hide-input
                  accept="image/png, image/jpeg, image/jpg"
                  class="d-none"
                ></v-file-input>

                <v-divider class="ml-5 mr-5"></v-divider>
                <span>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title class="text-body-2 font-weight-bold">
                        {{
                          data.mname
                            ? data.suffix
                              ? data.fname +
                                " " +
                                data.mname[0] +
                                ". " +
                                data.lname +
                                " " +
                                data.suffix
                              : data.fname + " " + data.lname
                            : data.fname + " " + data.lname
                        }}
                      </v-list-item-title>
                      <v-list-item-subtitle class="text-caption">{{
                        $store.state.user.usertype.description
                      }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </span>
              </v-col>
            </v-row>
          </v-img>
        </v-col>
        <v-col
          cols="12"
          md="12"
          style="border-left: 1px solid; border-color: #e8dfdf"
        >
          <div>
            <v-tabs
              v-model="tab"
              color="blue"
              show-arrows
              grow
              background-color="transparent"
            >
              <v-tab v-for="item in items" :key="item">
                {{ item }}
              </v-tab>
            </v-tabs>
            <v-divider class="ml-2 mr-2"></v-divider>
          </div>
          <v-tabs-items v-model="tab">
            <v-tab-item>
              <v-container class="mt-10">
                <v-form ref="personalInfo" @submit.prevent>
                  <v-row class="ml-2 mr-2 mt-1">
                    <v-col cols="6" md="6">
                      <v-text-field
                        :rules="[formRules.required]"
                        v-model="data.fname"
                        :readonly="readonly"
                        dense
                        required
                        label="First Name"
                        color="blue"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6" md="6">
                      <v-text-field
                        v-model="data.mname"
                        :readonly="readonly"
                        dense
                        required
                        label="Middle Name"
                        color="blue"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6" md="6">
                      <v-text-field
                        v-model="data.lname"
                        :rules="[formRules.required]"
                        :readonly="readonly"
                        dense
                        label="Last Name"
                        required
                        color="blue"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6" md="6">
                      <v-text-field
                        v-model="data.suffix"
                        :readonly="readonly"
                        label="Suffix"
                        dense
                        color="blue"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6" md="6">
                      <v-text-field
                        v-model="data.sex"
                        :readonly="readonly"
                        label="Sex"
                        dense
                        color="blue"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6" md="6">
                      <v-text-field
                        v-model="data.mobile_no"
                        :readonly="readonly"
                        label="Mobile Number"
                        dense
                        color="blue"
                        type="number"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6" sm="6" v-if="readonly == false">
                      <v-menu
                        ref="menu"
                        :close-on-content-click="false"
                        :return-value.sync="data.hired"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                        :readonly="readonly"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            dense
                            v-model="data.hired"
                            :readonly="readonly"
                            chips
                            small-chips
                            color="blue"
                            label="Date Hired"
                            v-bind="attrs"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          color="blue"
                          v-model="data.hired"
                          no-title
                          scrollable
                          :readonly="readonly"
                        >
                          <v-spacer></v-spacer>

                          <v-btn
                            text
                            color="blue"
                            @click="$refs.menu.save(data.hired)"
                          >
                            OK
                          </v-btn>
                        </v-date-picker>
                      </v-menu>
                    </v-col>
                  </v-row>
                </v-form>
                <v-card-actions v-if="readonly == true" class="pa-5">
                  <v-spacer></v-spacer>
                  <v-row
                    align="center"
                    :justify="$vuetify.breakpoint.smAndDown ? 'center' : 'end'"
                  >
                    <v-col cols="auto"
                      ><v-btn
                        color="blue"
                        class="white--text"
                        @click="readonly = false"
                      >
                        Edit
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card-actions>

                <v-card-actions v-if="readonly == false" class="pa-5">
                  <v-spacer></v-spacer>
                  <v-btn
                    color="red"
                    outlined
                    @click="
                      readonly = true;
                      isSelecting = false;
                      selectFile = null;
                    "
                  >
                    <v-icon>mdi-close-circle-outline</v-icon>
                    Cancel
                  </v-btn>
                  <v-btn
                    color="blue"
                    class="white--text"
                    @click="updateProfile()"
                  >
                    <v-icon>mdi-check-circle</v-icon>
                    Save
                  </v-btn>
                </v-card-actions>
              </v-container>
            </v-tab-item>
            <v-tab-item>
              <v-container class="mt-10">
                <v-form ref="loginInfo" @submit.prevent>
                  <v-row class="ml-2 mr-2 mt-1">
                    <v-col cols="12">
                      <v-text-field
                        placeholder="************"
                        class="font-size-14"
                        color="#93CB5B"
                        dense
                        :disabled="credentialReadonly"
                        v-model="oldPass"
                        :append-icon="showOldPass ? 'mdi-eye' : 'mdi-eye-off'"
                        :rules="[formRules.required]"
                        :type="showOldPass ? 'text' : 'password'"
                        name="input-10-1"
                        label="Old Password"
                        @click:append="showOldPass = !showOldPass"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        placeholder="************"
                        class="font-size-14"
                        color="#93CB5B"
                        dense
                        :disabled="credentialReadonly"
                        v-model="password"
                        :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                        :rules="[formRules.required, formRules.password]"
                        :type="show1 ? 'text' : 'password'"
                        name="input-10-1"
                        label="New Password"
                        @click:append="show1 = !show1"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        placeholder="************"
                        class="font-size-14"
                        color="#93CB5B"
                        :disabled="credentialReadonly"
                        dense
                        v-model="confirmPassword"
                        :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                        :rules="[
                          formRules.required,
                          formRules.confirmPassword(confirmPassword, password),
                        ]"
                        :type="show2 ? 'text' : 'password'"
                        name="input-10-1"
                        label="Confirm Password"
                        @click:append="show2 = !show2"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-card-actions
                    v-if="credentialReadonly == true"
                    class="pa-5"
                  >
                    <v-spacer></v-spacer>
                    <v-btn
                      color="blue"
                      class="white--text"
                      @click="credentialReadonly = false"
                    >
                      <v-icon>mdi-pencil</v-icon>
                      Edit
                    </v-btn>
                  </v-card-actions>
                  <v-card-actions
                    v-if="credentialReadonly == false"
                    class="pa-5"
                  >
                    <v-spacer></v-spacer>
                    <v-btn
                      color="red"
                      outlined
                      @click="credentialReadonly = true"
                    >
                      <v-icon>mdi-close-circle-outline</v-icon>
                      Cancel
                    </v-btn>
                    <v-btn
                      color="blue"
                      class="white--text"
                      @click="updateCredential()"
                    >
                      <v-icon>mdi-check-circle</v-icon>
                      Save
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-container>
            </v-tab-item>
          </v-tabs-items>
        </v-col>
        <!-- </v-card> -->
      </v-row>
      <!-- <TeacherSubjectAddingDialog
        :data="taggingData"
        :action="action"
        :filter="filter"
        :toAdd="toAdd"
      /> -->
    </v-card>
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
  components: {
    // TeacherSubjectAddingDialog: () =>
    //   import("../../components/Dialogs/Forms/TeacherSubjectAddingDialog.vue"),
  },
  data() {
    return {
      toAdd: null,
      action: null,
      taggingData: null,
      isSelecting: false,
      selectFile: null,
      previewImg: null,
      tagGrade: null,
      tab: null,
      // items: ["Personal Information", "Login Info"],
      items: ["Personal Information"],
      totalYears: null,
      filter: null,
      data: {
        id: null,
        name: null,
        fname: null,
        mname: null,
        lname: null,
        suffix: null,
        sex: null,
        mobile_no: null,
        profile_img: null,
        hired: null,
        education: null,
        status: null,
      },
      oldPass: null,
      password: null,
      confirmPassword: null,
      showOldPass: false,
      show1: false,
      show2: false,
      fadeAwayMessage: {
        show: false,
        type: "success",
        header: "System Message!",
        message: "",
        top: 10,
      },
      readonly: true,
      credentialReadonly: true,
    };
  },
  mounted() {
    this.eventHub.$on("closedDataGradeSubjects", () => {
      this.initialize();
    });
  },
  beforeDestroy() {
    this.eventHub.$off("closedDataGradeSubjects");
  },

  computed: {
    filterYear() {
      return this.$store.getters.getFilterSelected;
    },

    watch: {
      // options: {
      //   handler() {
      //     this.initialize();
      //   },
      //   deep: true,
      // },
      filterYear: {
        handler(newData, oldData) {
          if (oldData != newData) {
            this.initialize();
          }
        },
        deep: true,
      },
    },
  },

  methods: {
    addGrade_Subject(item) {
      let filter = this.$store.getters.getFilterSelected;
      this.taggingData = item;
      this.action = "View";
      this.filter = filter;
      this.toAdd;
    },

    totalYearService() {
      let d = new Date();
      let yr = d.getFullYear();
      // const year = this.data.hired.getFullYear();
      const yearService = (date) => {
        const [years, months, day] = date.split("-").map(Number);
        console.log(months, day);
        return years;
      };

      // Convert both times to minutes
      const yearFrom = yearService(this.data.hired);
      // const currentDate = timeToMinutes(endTime);

      // Calculate the difference in minutes
      const differenceYear = yr - yearFrom;

      // Convert minutes to hours (decimal format)
      // const difference = differenceYear / 12;

      this.totalYears = differenceYear;
    },
    initialize() {
      this.axiosCall("/user-details/getPersonalInfo", "GET").then((res) => {
        if (res.data) {
          this.data.id = res.data.id;
          this.data.name = res.data.lname + ", " + res.data.fname;
          this.data.fname = res.data.fname;
          this.data.mname = res.data.mname;
          this.data.lname = res.data.lname;
          this.data.suffix = res.data.suffix;
          this.data.hired = res.data.hired;
          this.data.education = res.data.education;
          this.data.sex = res.data.sex;
          this.data.status = res.data.status;
          this.data.mobile_no = res.data.mobile_no;
          this.data.profile_img = res.data.profile_img
            ? process.env.VUE_APP_SERVER +
              "/user-details/getProfileImg/" +
              res.data.profile_img
            : process.env.VUE_APP_SERVER +
              "/user-details/getProfileImg/img_avatar.png";
          this.totalYearService();
        }
      });
    },

    updateCredential() {
      if (this.$refs.loginInfo.validate()) {
        let data = {
          old_password: this.oldPass,
          new_password: this.password,
        };
        this.axiosCall("/auth/changePass", "POST", data).then((res) => {
          if (res.data.status == 200) {
            this.fadeAwayMessage.message = res.data.msg;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "success";
            this.password = null;
            this.confirmPassword = null;
            this.credentialReadonly = true;
          } else if (res.data.status == 400) {
            this.fadeAwayMessage.message = res.data.msg;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.show = true;
          }
        });
      }
    },

    updateProfile() {
      if (this.$refs.personalInfo.validate()) {
        const fd = new FormData();
        this.axiosCall("/user-details/updateUser", "POST", this.data).then(
          (res) => {
            if (res.data.status == 200) {
              if (this.selectFile) {
                fd.append("file", this.selectFile);
                this.axiosCall("/user-details/uploadimage", "POST", fd).then(
                  (resp) => {
                    if (resp.data.status == 200) {
                      this.initialize();
                      this.fadeAwayMessage.message = resp.data.msg;
                      this.fadeAwayMessage.show = true;
                      this.readonly = true;
                      this.$emit("reloadProfile");
                    } else if (resp.data.status == 400) {
                      this.initialize();
                      this.fadeAwayMessage.message = resp.data.msg;
                      this.fadeAwayMessage.show = true;
                      this.readonly = true;
                    }
                  }
                );
              } else {
                this.initialize();
                this.fadeAwayMessage.message = res.data.msg;
                this.fadeAwayMessage.show = true;
                this.readonly = true;
              }
            } else if (res.data.status == 400) {
              this.initialize();
              this.fadeAwayMessage.message = res.data.msg;
              this.fadeAwayMessage.show = true;
              this.readonly = true;
            }
          }
        );
      }
    },

    handleFileImport() {
      let fileUpload = document.getElementById("fileUpload");
      if (fileUpload != null) {
        fileUpload.click();
      }
    },
    onFileChanged() {
      const uploadedimg = document.getElementById("fileUpload").files[0];
      this.selectFile = uploadedimg;

      this.previewImg = URL.createObjectURL(uploadedimg);
      this.isSelecting = true;
    },
  },
  created() {
    this.initialize();
    this.totalYearService();
    // console.log("created");
    if (this.$store.state.expiryDate < Date.now()) {
      this.$store.dispatch("setUser", null);
      this.$store.dispatch("setIsAuthenticated", 0);
      this.render = true;
      this.$router.push("/");
      // location.reload();
    }
  },
};
</script>
<style scoped>
.profile-row {
  border-radius: 15px !important;
}
.profile-left-panel {
  background-color: #f1f7ff;
}
.profile-right-panel {
  background-color: #ffffff;
}
</style>
