<template>
  <div>
    <v-dialog v-model="dialog" eager scrollable max-width="600px">
      <v-form ref="ChildFormref" @submit.prevent>
        <v-card>
          <v-card-title dark class="dialog-header pt-5 pb-5 pl-6">
            <span v-if="action == 'Add'"> Add children</span>
            <span v-if="action == 'Update'"> Update children</span>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="dialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-col> </v-col>
          <v-card-text style="max-height: 700px" class="my-2">
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="childModel.name"
                    :rules="[formRules.required]"
                    dense
                    outlined
                    label="Name"
                    required
                    class="rounded-lg"
                    color="blue"
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-menu
                    ref="menu"
                    :close-on-content-click="false"
                    :return-value.sync="childModel.bdate"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        outlined
                        dense
                        v-model="childModel.bdate"
                        :rules="[formRules.required]"
                        chips
                        small-chips
                        color="blue"
                        label="Date of Birth"
                        readonly
                        hint="MM/DD/YYYY format"
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="childModel.bdate"
                      no-title
                      color="blue"
                      scrollable
                    >
                      <v-spacer></v-spacer>

                      <v-btn
                        text
                        color="blue"
                        @click="$refs.menu.save(childModel.bdate)"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions v-if="action == 'Add'" class="pa-5">
            <v-spacer></v-spacer>
            <v-btn color="red" outlined @click="dialog = false">
              <v-icon>mdi-close-circle-outline</v-icon>
              Cancel
            </v-btn>
            <v-btn
              :color="$vuetify.theme.themes.light.submitBtns"
              class="white--text"
              @click="addChild()"
            >
              <v-icon>mdi-check-circle</v-icon>
              Save Details
            </v-btn>
          </v-card-actions>

          <v-card-actions v-if="action == 'Update'" class="pa-5">
            <v-spacer></v-spacer>
            <v-btn color="red" outlined @click="dialog = false">
              <v-icon>mdi-close-circle-outline</v-icon>
              Cancel
            </v-btn>
            <v-btn
              :color="$vuetify.theme.themes.light.submitBtns"
              class="white--text"
              @click="updateChild()"
            >
              <v-icon>mdi-check-circle</v-icon>
              Update Details
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
      childModel: {
        name: null,
        bdate: null,
      },
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
        this.$refs.ChildFormref.resetValidation();
        this.childModel = data;
      },
      deep: true,
    },
  },
  methods: {
    closeD() {
      // this.$refs.ChildFormref.resetValidation();
      this.dialog = false;
    },
    addChild() {
      if (this.$refs.ChildFormref.validate()) {
        this.$emit("addChild", this.childModel);
        this.closeD();
      }
    },
    updateChild() {
      if (this.$refs.ChildFormref.validate()) {
        this.$emit("updateChild", this.childModel);
        this.closeD();
      }
    },
  },
};
</script>
