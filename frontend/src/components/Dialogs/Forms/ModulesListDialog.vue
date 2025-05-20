<template>
  <div>
    <v-dialog v-model="dialog" eager scrollable max-width="600px">
      <v-form ref="ModulesListFormref" @submit.prevent>
        <v-card>
          <v-card-title dark class="dialog-header pt-5 pb-5 pl-6">
            <span>{{ action }} Module</span>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="closeD()">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text style="max-height: 700px" class="my-4">
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    :rules="[formRules.required]"
                    outlined
                    dense
                    required
                    v-model="title"
                    label="Title"
                    class="rounded-lg"
                    color="blue"
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    :rules="[formRules.required]"
                    outlined
                    dense
                    required
                    v-model="icon"
                    label="Icon"
                    class="rounded-lg"
                    color="blue"
                  ></v-text-field>
                </v-col>

                <v-col cols="6" class="pt-0">
                  <h1 class="text-body-1">Icon preview:</h1>
                </v-col>
                <v-col cols="6" class="pt-0">
                  <v-icon>{{ icon }}</v-icon>
                </v-col>

                <v-col cols="12">
                  <v-autocomplete
                    v-model="isParent"
                    dense
                    outlined
                    :rules="[formRules.required]"
                    class="rounded-lg"
                    item-text="name"
                    item-value="id"
                    label="Is Parent Route"
                    color="blue"
                    :items="isParentList"
                  >
                  </v-autocomplete>
                </v-col>

                <v-col cols="12" v-if="isParent == 'No'">
                  <v-text-field
                    :rules="isParent == 'No' ? [formRules.required] : []"
                    outlined
                    dense
                    required
                    v-model="route"
                    label="Route"
                    class="rounded-lg"
                    color="blue"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" v-if="isParent == 'No'">
                  <v-autocomplete
                    v-model="parentID"
                    dense
                    outlined
                    class="rounded-lg"
                    item-text="title"
                    item-value="id"
                    label="Parent Module"
                    color="blue"
                    :items="parentModuleList"
                  >
                  </v-autocomplete>
                </v-col>
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
              v-if="action == 'Add'"
              color="#2196F3"
              class="white--text"
              @click="add()"
            >
              <v-icon>mdi-check-circle</v-icon>
              Add
            </v-btn>

            <v-btn
              v-if="action == 'Update'"
              color="#2196F3"
              class="white--text"
              @click="update()"
            >
              <v-icon>mdi-check-circle</v-icon>
              Update
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
    data: Object,
    action: String,
  },
  data() {
    return {
      dialog: false,

      id: null,
      title: null,
      icon: null,
      route: null,
      parentID: null,
      isParent: null,
      parentModuleList: [],
      isParentList: ["Yes", "No"],

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
        this.$refs.ModulesListFormref.resetValidation();
        // console.log(data);
        if (data.id) {
          this.id = data.id;
          this.title = data.title;
          this.icon = data.icon;
          this.route = data.route;
          this.parentID = data.parentID;
          this.isParent = data.isParent == 1 ? "Yes" : "No";
        } else {
          this.id = null;
          this.title = null;
          this.icon = null;
          this.route = null;
          this.parentID = null;
          this.isParent = null;
        }
      },
      deep: true,
    },
  },
  methods: {
    initialize() {
      this.getParentModules();
    },
    getUserType() {
      this.axiosCall("/user-type/getAllUsertype", "GET").then((res) => {
        if (res.data) {
          this.usertypeList = res.data;
        }
      });
    },
    closeD() {
      this.eventHub.$emit("closeModulesListDialog", false);
      this.dialog = false;
    },
    add() {
      if (this.$refs.ModulesListFormref.validate()) {
        let data = {
          id: this.id,
          title: this.title,
          icon: this.icon,
          route: this.route,
          parentID: this.parentID,
          isParent: this.isParent == "Yes" ? true : false,
        };

        this.axiosCall("/sys-modules", "POST", data).then((res) => {
          if (res.data.status == 201) {
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
        });
      }
    },

    update() {
      if (this.$refs.ModulesListFormref.validate()) {
        let data = {
          title: this.title,
          icon: this.icon,
          route: this.route,
          parentID: this.parentID,
          isParent: this.isParent == "Yes" ? true : false,
        };

        this.axiosCall("/sys-modules/" + this.id, "PATCH", data).then((res) => {
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
        });
      }
    },

    getParentModules() {
      this.axiosCall("/sys-modules/getParentModules", "GET").then((res) => {
        this.parentModuleList = res.data;
      });
    },
    getPositions() {
      this.axiosCall("/positions", "GET").then((res) => {
        this.positionList = res.data;
      });
    },
    getDesignations() {
      this.axiosCall("/designations", "GET").then((res) => {
        this.designationList = res.data;
      });
    },
    getEmpStatus() {
      this.axiosCall("/employment-status", "GET").then((res) => {
        this.empStatusList = res.data;
      });
    },
    getInstitutes() {
      this.axiosCall("/institutes", "GET").then((res) => {
        this.instituteList = res.data;
      });
    },
    getUseRoles() {
      this.axiosCall("/user-role", "GET").then((res) => {
        this.userRoleList = res.data;
      });
    },
    getAssignedModules() {
      this.axiosCall("/assigned-modules", "GET").then((res) => {
        this.assignedModulesList = res.data;
      });
    },
  },
};
</script>
