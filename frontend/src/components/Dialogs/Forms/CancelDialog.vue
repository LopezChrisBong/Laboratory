<template>
<div>
   <v-dialog
      v-model="dialog"
      max-width="500px"
      persistent
    >
      <v-card>
        <v-card-title  dark class="dialog-header">
        <span>Cancel Task</span>
        <v-spacer></v-spacer>
       <v-btn
            icon
            dark
            @click="closeDialog();"
        >
            <v-icon>mdi-close</v-icon>
        </v-btn>
          </v-card-title>
        <v-card-text>

<v-form ref="Formref">
        <v-container>
            <v-row>
                <v-col>
                  <v-textarea
                    v-model="formdata.remarks"
                    :rules="[formRules.required]"
                    dense
                    outlined
                    required
                    class="rounded-lg mt-5"
                    color="#239FAB"
                    label="Remarks"
                    ></v-textarea>
                </v-col>
            </v-row>
    </v-container>
</v-form>   

      </v-card-text>
      <v-divider></v-divider>
    <v-card-actions class="pa-5">
            <v-spacer></v-spacer>
          <v-btn
            color="red"
            outlined
            @click="closeDialog();"
          >
          <v-icon>mdi-close-circle-outline</v-icon>
            Cancel
          </v-btn>
          <v-btn
            color="#239FAB"
            class="white--text"
            @click="cancelTask()"
          >
          <v-icon>mdi-check-circle</v-icon>
            Confirm
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
        data: null
    },
    data () {
      return {
        dialog: false,
        formdata:{
        },
        remarks: null,
        fadeAwayMessage: {
        show: false,
        type: "success",
        header: "Successfully Added!",
        message: "",
        top: 10,
        },
      }
    },
    watch: {
      data: {
        handler (data) {
        if(data){
            this.dialog = true;
            if(data.id != null){
                this.formdata = data
            }
        }
        },
        deep: true,
      },
    },
    methods: {
     closeDialog() {
        this.dialog = false;
        this.eventHub.$emit('closeCancelDialog', false);
      },
       cancelTask(){
          if(this.$refs.Formref.validate()){
            let data = {
              wd_ID: parseInt(this.formdata.id),
              statusID: 5,
              remarks: this.formdata.remarks
            }
              this.axiosCall("/work-details/update-status", "POST", data).then((res) => {
                if(res.data.status == 200){ 
                  this.fadeAwayMessage.show = true
                  this.fadeAwayMessage.type = 'success'
                  this.fadeAwayMessage.header = "System Message"
                  this.fadeAwayMessage.message = "Work successfully cancelled."
                  this.closeDialog();
                }
                else{
                  this.fadeAwayMessage.show = true
                  this.fadeAwayMessage.type = 'error'
                  this.fadeAwayMessage.header = "System Message"
                  this.fadeAwayMessage.message = "Something went wrong."
                }
            });
          }
       },
    },
}
</script>

