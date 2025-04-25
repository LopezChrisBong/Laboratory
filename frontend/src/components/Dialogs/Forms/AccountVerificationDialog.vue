<template>
  <div>
    <v-dialog v-model="dialog" eager scrollable max-width="600px">
      <v-form ref="UserVerifyFormref" @submit.prevent>
        <v-card>
          <v-card-title dark class="dialog-header pt-5 pb-5 pl-6">
            <span>{{ action }} User</span>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="closeD()">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text style="max-height: 700px" class="my-4">
            <v-container>
              <v-row>
                <v-col cols="12" v-if="userId == 3">
                  <v-autocomplete
                    v-model="verifyModel.usertypeID"
                    :rules="userId == 3 ? [formRules.required] : []"
                    dense
                    class="rounded-lg"
                    item-text="description"
                    item-value="id"
                    label="User type"
                    color="#93CB5B"
                    :items="usertypeList"
                  >
                  </v-autocomplete>
                </v-col>
                <v-col cols="12">
                  <v-autocomplete
                    v-model="verifyModel.user_roleID"
                    dense
                    :rules="[formRules.required]"
                    class="rounded-lg"
                    item-text="description"
                    item-value="id"
                    label="User role"
                    color="#93CB5B"
                    :items="userRoleList"
                  >
                  </v-autocomplete>
                </v-col>

                <v-col cols="12" v-if="userId == 3">
                  <v-autocomplete
                    v-model="verifyModel.assignedModuleID"
                    :rules="userId == 3 ? [formRules.required] : []"
                    dense
                    class="rounded-lg"
                    item-text="description"
                    item-value="id"
                    label="Modules to assign"
                    color="#93CB5B"
                    :items="assignedModulesList"
                  >
                  </v-autocomplete>
                </v-col>

                <!-- <v-col cols="12" v-if="userId == 3">
                  <v-autocomplete
                    v-model="verifyModel.newStatus"
                    :rules="userId == 3 ? [formRules.required] : []"
                    dense
                    class="rounded-lg"
                    item-text="description"
                    item-value="id"
                    label="School Level"
                    color="#93CB5B"
                    :items="statusList"
                  >
                  </v-autocomplete>
                </v-col> -->
              </v-row>
            </v-container>
          </v-card-text>
          <v-divider></v-divider>

          <v-card-actions class="pa-5">
            <v-spacer></v-spacer>
            <v-btn color="red" outlined @click="closeD()">
              <v-icon>mdi-close-circle-outline</v-icon>
              Cancel
            </v-btn>
            <v-btn
              :color="$vuetify.theme.themes.light.submitBtns"
              class="white--text"
              @click="accept()"
            >
              <v-icon>mdi-check-circle</v-icon>
              {{ action == "Verify" ? "Accept" : "Update" }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>

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
  props: {
    data: null,
    action: null,
  },
  data() {
    return {
      dialog: false,

      statusList: [
        { id: 1, description: "Elementary" },
        { id: 2, description: "High School" },
      ],
      verifyModel: {
        id: null,
        userID: null,
        name: null,
        empID: null,
        date_hired: null,
        usertypeID: null,
        assignedModuleID: null,
        user_roleID: null,
        newStatus: null,
      },
      userRoleList: [],
      usertypeList: [],
      assignedModulesList: [],
      fadeAwayMessage: {
        show: false,
        type: "success",
        header: "Successfully Added!",
        message: "",
        top: 10,
      },
    };
  },
  watch: {
    data: {
      handler(data) {
        this.dialog = true;
        this.initialize();
        this.$refs.UserVerifyFormref.resetValidation();
        if (data.id) {
          console.log("Love", data);
          this.verifyModel.id = data.id;
          this.verifyModel.userID = data.user_id;
          this.verifyModel.name = data.name;
          this.verifyModel.empID = data.emp_empID;
          this.verifyModel.usertypeID = data.user_usertypeID.toString();
          this.verifyModel.user_roleID = data.user_user_roleID;
          this.verifyModel.assignedModuleID = data.user_assignedModuleID;
          this.verifyModel.newStatus = data.status;
          // this.verifyModel.date_hired = data.emp_date_hired;
        }
      },
      deep: true,
    },
  },
  methods: {
    initialize() {
      this.userId = this.$store.state.user.id;
      this.getUserType();
      this.getAssignedModules();
      this.getUseRoles();
    },
    getUserType() {
      this.axiosCall("/user-type/getAllUsertype", "GET").then((res) => {
        if (res.data) {
          console.log("UserList", res.data);
          this.usertypeList = res.data;
        }
      });
    },
    closeD() {
      this.eventHub.$emit("closeAccountsVerificationDialog", true);
      this.dialog = false;
    },
    accept() {
      if (this.$refs.UserVerifyFormref.validate()) {
        let data = {
          id: this.verifyModel.id,
          userID: this.verifyModel.userID,
          positionID: this.verifyModel.positionID,
          // empID: this.verifyModel.empID,
          // date_hired: this.verifyModel.date_hired,
          // officeID: this.verifyModel.officeID,
          // designationID: this.verifyModel.designationID,
          // empStatusID: this.verifyModel.empStatusID,
          usertypeID: this.verifyModel.usertypeID,
          user_roleID: this.verifyModel.user_roleID,
          assignedModuleID: this.verifyModel.assignedModuleID,
          status: this.verifyModel.newStatus,
          update_type: this.action == "Verify" ? 1 : 2,
        };

        this.axiosCall("/user-details/updateVerifiedUser", "POST", data).then(
          (res) => {
            if (res.data.status == 200) {
              this.dialog = false;
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = "success";
              this.fadeAwayMessage.header = "System Message";
              this.fadeAwayMessage.message = res.data.msg;
              this.closeD();
            } else if (res.data.status == 400) {
              this.dialog = false;
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = "error";
              this.fadeAwayMessage.header = "System Message";
              this.fadeAwayMessage.message = res.data.msg;
              this.$refs.PositionFormref.reset();
              this.closeD();
            }
          }
        );
      }
    },

    getAssignedModules() {
      this.axiosCall("/assigned-modules", "GET").then((res) => {
        this.assignedModulesList = res.data;
      });
    },
    getUseRoles() {
      this.axiosCall("/user-role", "GET").then((res) => {
        this.userRoleList = res.data;
      });
    },
  },
};
</script>
