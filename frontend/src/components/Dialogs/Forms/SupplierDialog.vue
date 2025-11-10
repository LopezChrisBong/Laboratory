<template>
  <div>
    <v-dialog v-model="dialog" scrollable max-width="600px">
      <v-card>
        <v-card-title dark class="dialog-header">
          <span v-if="action == 'Add'"> Add New Supplier</span>
          <span v-if="action == 'Update'"> Update Supplier</span>
          <v-spacer></v-spacer>
          <v-btn
            icon
            dark
            @click="
              closeDialog();
              dialog = false;
            "
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-col> </v-col>
        <v-card-text style="max-height: 700px">
          <v-form ref="Formref">
            <v-container>
              <v-row class="ml-2 mr-2">
                <v-col>
                  <v-text-field
                    v-model="supplierModel.supplierName"
                    :rules="[formRules.required]"
                    dense
                    outlined
                    label="Supplier Name"
                    required
                    class="rounded-lg"
                    color="blue"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions v-if="action == 'Add'" class="pa-5">
          <v-spacer></v-spacer>
          <v-btn
            color="red"
            outlined
            @click="
              closeDialog();
              dialog = false;
            "
          >
            <v-icon>mdi-close-circle-outline</v-icon>
            Cancel
          </v-btn>
          <v-btn color="#2196F3" class="white--text" @click="addSupplier()">
            <v-icon>mdi-check-circle</v-icon>
            Save Details
          </v-btn>
        </v-card-actions>

        <v-card-actions v-if="action == 'Update'" class="pa-5">
          <v-spacer></v-spacer>
          <v-btn
            color="red"
            outlined
            @click="
              closeDialog();
              dialog = false;
            "
          >
            <v-icon>mdi-close-circle-outline</v-icon>
            Cancel
          </v-btn>
          <v-btn color="#2196F3" class="white--text" @click="updateSupplier()">
            <v-icon>mdi-check-circle</v-icon>
            Update Details
          </v-btn>
        </v-card-actions>
      </v-card>
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
      supplierModel: {
        supplierName: null,
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
        if (data) {
          this.dialog = true;
          if (data.id != null) {
            this.supplierModel = data;
          }
        }
      },
      deep: true,
    },
  },
  methods: {
    addSupplier() {
      if (this.$refs.Formref.validate()) {
        this.axiosCall("/supplier", "POST", this.supplierModel).then((res) => {
          if (res) {
            this.dialog = false;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "success";
            this.fadeAwayMessage.header = "Successfully Added!";
            this.$refs.Formref.reset();
            this.closeDialog();
          }
        });
      }
    },
    updateSupplier() {
      if (this.$refs.Formref.validate()) {
        this.axiosCall(
          "/supplier/" + this.data.id,
          "PATCH",
          this.supplierModel
        ).then((res) => {
          if (res) {
            this.dialog = false;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "success";
            this.fadeAwayMessage.header = "Successfully Updated";
            this.closeDialog();
          }
        });
      }
    },
  },
};
</script>


