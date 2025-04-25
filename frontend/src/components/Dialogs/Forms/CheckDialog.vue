<template>
    <v-dialog
      v-model="dialog"
      scrollable
      persistent
      max-width="1000px"
    >
      <v-card class="overflow-x-hidden">
        <v-card-title dark class="dialog-header">{{tab.description || tabs[tab].description}} - Umai Desai
        <v-spacer></v-spacer>
       <v-btn
            icon
            dark
            @click="closeDialog()"
        >
            <v-icon>mdi-close</v-icon>
        </v-btn>
          </v-card-title>
        <v-tabs
        color="#239FAB"
        background-color="transparent"
        show-arrows
      >
        <v-tabs-slider color="#239FAB"></v-tabs-slider>
  
        <v-tab
          v-for="tab in tabs"
          :key="tab.id"
          @click="changeTab(tab)"
        >
        <v-icon class="mr-2">{{tab.icon}}</v-icon>
          {{ tab.description }}
        </v-tab>
      </v-tabs>
        <v-card-text style="max-height: 800px;" class="my-4">
    <v-row>
      <v-col cols="12">
        <h2 class="mb-2 mt-5">{{tab.description}}</h2>
        <v-divider></v-divider>
      </v-col>
      <v-col cols="12">
      <v-form ref="work_detail_form">
        <v-row v-if="tab.id == 1">
          <v-col cols="12" md="6">
            <v-text-field
            v-model="formdata.wticket_order"
            dense
            outlined
            disabled
            class="rounded-lg"
            label="Work Ticket Order"
            color="#239FAB">
            </v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-autocomplete
            v-model="formdata.requestTypeId"
            :rules="[formRules.required]"
            dense
            outlined
            class="rounded-lg"
            item-text="description"
            item-value="id"
            label="Type of Request"
            color="#239FAB"
            :items="request_types">
            </v-autocomplete>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
            v-model="formdata.work_desc"
            :rules="[formRules.required]"
            dense
            outlined
            class="rounded-lg"
            label="Work Description"
            color="#239FAB">
            </v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
            v-model="formdata.ticket_no"
            :rules="[formRules.required]"
            dense
            outlined
            class="rounded-lg"
            label="Ticket No. (optional)"
            color="#239FAB">
            </v-text-field>
          </v-col>
          <v-col cols="12">
            <h4>Client Details</h4>
            <v-divider></v-divider>
          </v-col>
          <v-col cols="12" md="6">
            <v-autocomplete
            v-model="formdata.clientId"
            :rules="[formRules.required]"
            dense
            outlined
            class="rounded-lg"
            item-text="name"
            item-value="id"
            label="Client"
            color="#239FAB"
            :items="clients">
            </v-autocomplete>
          </v-col>
          <v-col cols="12" md="6">
            <v-autocomplete
            v-model="formdata.endClientId"
            :rules="[formRules.required]"
            dense
            outlined
            class="rounded-lg"
            item-text="name"
            item-value="id"
            label="End Client/Customer"
            color="#239FAB"
            :items="end_clients">
            </v-autocomplete>
          </v-col>
          <!-- <v-col cols="12" md="6">
            <v-autocomplete
            v-model="formdata.requestTypeId"
            dense
            outlined
            class="rounded-lg"
            item-text="description"
            label="Location"
            item-value="id"
            color="#239FAB"
            :items="tabs">
            </v-autocomplete>
          </v-col>
          <v-col cols="12" md="6">
            <v-autocomplete
            dense
            outlined
            class="rounded-lg"
            item-text="description"
            label="Country"
            item-value="id"
            color="#239FAB"
            :items="tabs">
            </v-autocomplete>
          </v-col> -->
          <v-col cols="12">
            <h4>Technician</h4>
            <v-divider></v-divider>
          </v-col>
          <v-col cols="12" md="6">
            <v-autocomplete
            v-model="formdata.techId"
            :rules="[formRules.required]"
            dense
            outlined
            class="rounded-lg"
            item-text="lname"
            label="Tech Name"
            item-value="id"
            color="#239FAB"
            :items="technicians">
            </v-autocomplete>
          </v-col>
          <v-col cols="12" md="6">
            <v-autocomplete
            v-model="formdata.statusId"
            :rules="[formRules.required]"
            dense
            outlined
            class="rounded-lg"
            item-text="description"
            label="Status"
            item-value="id"
            color="#239FAB"
            :items="status">
            </v-autocomplete>
          </v-col>
          <v-col cols="12">
            <h4>Schedule</h4>
            <v-divider></v-divider>
          </v-col>
          <v-col cols="12" md="6">
            <v-menu
            ref="work_date_menu"
            :close-on-content-click="false"
            :return-value.sync="formdata.wdate"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="auto"
            >
            <template v-slot:activator="{ on, attrs }">
                <v-combobox
                outlined
                v-model="formdata.wdate"
                :rules="[formRules.required]"
                 prepend-inner-icon="mdi-calendar"
                label="Work Date"
                readonly
                v-bind="attrs"
                v-on="on"
                color="#239FAB"
                hide-details
                class="rounded-lg"
                dense
                ></v-combobox>
            </template>
            <v-date-picker
                v-model="formdata.wdate"
                no-title
                color="#239FAB"
            >
                <v-spacer></v-spacer>
                <v-btn outlined color="#239FAB" @click="work_date_menu =false">
                Cancel
                </v-btn>
                <v-btn
                color="#239FAB"
                class="white--text"
                @click="$refs.work_date_menu.save(formdata.wdate)"
                >
                OK
                </v-btn>
            </v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="12" md="6">
            <v-autocomplete
            v-model="formdata.requestSchedId"
            :rules="[formRules.required]"
            dense
            outlined
            class="rounded-lg"
            item-text="description"
            label="Schedule of Request"
            item-value="id"
            color="#239FAB"
            :items="request_schedules">
            </v-autocomplete>
          </v-col>
          <v-col cols="12" md="4">
          <v-menu
            ref="menu2"
            v-model="menu2"
            :close-on-content-click="false"
            :nudge-right="40"
            :return-value.sync="formdata.start_time"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="formdata.start_time"
                :rules="[formRules.required]"
                label="Start Time"
                append-icon="mdi-clock-time-four-outline"
                readonly
                color="#239FAB"
                v-bind="attrs"
                outlined
                dense
                class="rounded-lg"
                v-on="on"
              ></v-text-field>
            </template>
            <v-time-picker
              v-if="menu2"
              v-model="time"
              full-width
              format="24hr"
              color="#239FAB"
              @click:minute="$refs.menu2.save(time)"
            ></v-time-picker>
          </v-menu>
          </v-col>
        <v-col cols="12" md="4">
          <v-menu
            ref="menu3"
            v-model="menu3"
            :close-on-content-click="false"
            :nudge-right="40"
            :return-value.sync="formdata.end_time"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="formdata.end_time"
                :rules="[formRules.required]"
                label="End Time"
                append-icon="mdi-clock-time-four-outline"
                readonly
                v-bind="attrs"
                color="#239FAB"
                outlined
                dense
                class="rounded-lg"
                v-on="on"
              ></v-text-field>
            </template>
            <v-time-picker
              v-if="menu3"
              v-model="time"
              full-width
              format="24hr"
              color="#239FAB"
              @click:minute="$refs.menu3.save(time)"
            ></v-time-picker>
          </v-menu>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
            v-model="formdata.break_time"
            :rules="[formRules.required]"
            dense
            outlined
            class="rounded-lg"
            label="Break Time"
            color="#239FAB">
            </v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
            v-model="formdata.total_work_time"
            :rules="[formRules.required]"
            dense
            outlined
            class="rounded-lg"
            label="Total Work Hours"
            color="#239FAB">
            </v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
            v-model="formdata.actual_work_hour"
            :rules="[formRules.required]"
            dense
            outlined
            class="rounded-lg"
            label="Actual Work Hours"
            color="#239FAB">
            </v-text-field>
          </v-col>
        </v-row>
        <v-row v-if="tab.id == 2">
          <v-col cols="12" md="6">
            <v-autocomplete
            v-model="formdata.workbefore.GC_created"
            dense
            outlined
            class="rounded-lg"
            item-text="description"
            label="Whatsapp GC Created?"
            item-value="id"
            color="#239FAB"
            :items="task_status">
            </v-autocomplete>
          </v-col>
          <v-col cols="12" md="6">
            <v-autocomplete
            v-model="formdata.workbefore.WOTicketProvided"
            dense
            outlined
            class="rounded-lg"
            item-text="description"
            label="WO Ticket Provided?"
            item-value="id"
            color="#239FAB"
            :items="task_status">
            </v-autocomplete>
          </v-col>
          <v-col cols="12" md="6">
            <v-autocomplete
            v-model="formdata.workbefore.SiteandPOConfirmed"
            dense
            outlined
            class="rounded-lg"
            item-text="description"
            label="Site Location and POC Confirmed?"
            item-value="id"
            color="#239FAB"
            :items="task_status">
            </v-autocomplete>
          </v-col>
          <v-col cols="12" md="6">
            <v-autocomplete
            v-model="formdata.workbefore.TechReminded"
            dense
            outlined
            class="rounded-lg"
            item-text="description"
            label="Reminded Tech a Day Before?"
            item-value="id"
            color="#239FAB"
            :items="task_status">
            </v-autocomplete>
          </v-col>
        </v-row>
        <v-row v-if="tab.id == 3">
          <v-col cols="12" md="3">
            <v-autocomplete
            v-model="formdata.workafter.WorkCompleted"
            dense
            outlined
            class="rounded-lg"
            item-text="description"
            label="Work Completed?"
            item-value="id"
            color="#239FAB"
            :items="task_status">
            </v-autocomplete>
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
            v-model="formdata.workafter.ReleasedByRE"
            dense
            outlined
            class="rounded-lg"
            item-text="description"
            label="Released by RE?"
            item-value="id"
            color="#239FAB"
            :items="task_status">
            </v-autocomplete>
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
            v-model="formdata.workafter.SWRSigned"
            dense
            outlined
            class="rounded-lg"
            item-text="description"
            label="Service Work Report Signed?"
            item-value="id"
            color="#239FAB"
            :items="task_status">
            </v-autocomplete>
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
            v-model="formdata.workafter.FERepCreated"
            dense
            outlined
            class="rounded-lg"
            item-text="description"
            label="FE Report Created?"
            item-value="id"
            color="#239FAB"
            :items="task_status">
            </v-autocomplete>
          </v-col>
          <v-col cols="12" md="4">
            <v-autocomplete
            v-model="formdata.workafter.SWRSent"
            dense
            outlined
            class="rounded-lg"
            item-text="description"
            label="Service Work Report Sent?"
            item-value="id"
            color="#239FAB"
            :items="task_status">
            </v-autocomplete>
          </v-col>
          <v-col cols="12" md="4">
            <v-autocomplete
            v-model="formdata.workafter.FERepSent"
            dense
            outlined
            class="rounded-lg"
            item-text="description"
            label="FE Report Sent?"
            item-value="id"
            color="#239FAB"
            :items="task_status">
            </v-autocomplete>
          </v-col>
          <v-col cols="12" md="4">
            <v-autocomplete
            v-model="formdata.workafter.SupportPhotoSent"
            dense
            outlined
            class="rounded-lg"
            item-text="description"
            label="Supportive Photo Sent?"
            item-value="id"
            color="#239FAB"
            :items="task_status">
            </v-autocomplete>
          </v-col>
          <v-col cols="12" md="6">
            <v-autocomplete
            v-model="formdata.workafter.SavedReportToGDrive"
            dense
            outlined
            class="rounded-lg"
            item-text="description"
            label="Save Report on GDrive?"
            item-value="id"
            color="#239FAB"
            :items="task_status">
            </v-autocomplete>
          </v-col>
          <v-col cols="12" md="6">
            <v-autocomplete
            v-model="formdata.workafter.SavedPhotoToGDrive"
            dense
            outlined
            class="rounded-lg"
            item-text="description"
            label="Saved Photos on GDrive?"
            item-value="id"
            color="#239FAB"
            :items="task_status">
            </v-autocomplete>
          </v-col>
          <v-col cols="12" md="12">
            <v-autocomplete
            v-model="formdata.workafter.GDriveLink"
            dense
            outlined
            class="rounded-lg"
            item-text="description"
            label="GDrive Link"
            item-value="id"
            color="#239FAB"
            :items="task_status">
            </v-autocomplete>
          </v-col>
          <!-- <v-col cols="12" md="6">
            <v-autocomplete
            v-model="formdata.WorkCompleted"
            dense
            outlined
            class="rounded-lg"
            item-text="description"
            label="Updated By"
            item-value="id"
            color="#239FAB"
            :items="task_status">
            </v-autocomplete>
          </v-col>
          <v-col cols="12" md="6">
            <v-autocomplete
            v-model="formdata.WorkCompleted"
            dense
            outlined
            class="rounded-lg"
            item-text="description"
            label="Checked by"
            item-value="id"
            color="#239FAB"
            :items="task_status">
            </v-autocomplete>
          </v-col> -->
        </v-row>
        <v-row v-if="tab.id == 4">
          <v-col cols="12" md="12">
            <v-textarea
              v-model="formdata.worknote.note"
              outlined
              dense
              color="#239FAB"
              label="Comments"
              class="rounded-lg"
            ></v-textarea>
          </v-col>
        </v-row>
        <v-row v-if="tab.id == 5">
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formdata.workaccount.rates"
              outlined
              dense
              color="#239FAB"
              label="Rates"
              class="rounded-lg"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formdata.workaccount.travel_time"
              outlined
              dense
              color="#239FAB"
              label="Travel Time"
              class="rounded-lg"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formdata.workaccount.travel_cost"
              outlined
              dense
              color="#239FAB"
              label="Travel Cost"
              class="rounded-lg"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formdata.workaccount.other"
              outlined
              dense
              color="#239FAB"
              label="Other Expense"
              class="rounded-lg"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-form>
      </v-col>
    </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="pa-5">
            <v-spacer></v-spacer>
          <v-btn
            color="#239FAB"
            outlined
            @click="closeDialog()"
          >
          <v-icon>mdi-close-circle-outline</v-icon>
            Cancel
          </v-btn>
          <v-btn
            color="#239FAB"
            class="white--text"
            @click="saveWorkDetails('checked')"
            v-if="data.id"
          >
          <v-icon>mdi-check-circle</v-icon>
            Check Details
          </v-btn>
        </v-card-actions>
      </v-card>
      <fade-away-message-component
      displayType="variation2"
      v-model="fadeAwayMessage.show"
      :message="fadeAwayMessage.message"
      :header="fadeAwayMessage.header"
      :top="fadeAwayMessage.top"
      :type="fadeAwayMessage.type"
    ></fade-away-message-component>
    </v-dialog>
</template>
<script>
  export default {
    props: {
        data: null
    },
    data () {
      return {
        dialog: false,
        tabs: [
           { id: 1, description: 'Work Details', icon: 'mdi-file-account-outline' },
           { id: 2, description: 'Before Task', icon: 'mdi-format-list-checks' },
           { id: 3, description: 'After Task', icon: 'mdi-list-status' },
           { id: 4, description: 'Notes', icon: 'mdi-note-edit-outline' },
           { id: 5, description: 'Accounts', icon: 'mdi-account-circle-outline' },
        ],
        tab: { id: 1, description: 'Work Details', icon: 'mdi-file-account-outline' },
        formdata: {
          wticket_order: null,
          wdate: null,
          start_time: null,
          end_time: null,
          break_time: null,
          total_work_time: null,
          actual_work_hour: null,
          ticket_no: null,
          work_desc: null,
          techId: null,
          clientId: null,
          statusId: null,
          requestTypeId: null,
          requestSchedId: null,
          cityLocId: null,
          workbefore: {},
          workafter: {},
          worknote: {},
          workaccount: {},
        },
        fadeAwayMessage: {
          show: false,
          type: "success",
          header: "Successfully Added!",
          message: "",
          top: 10,
        },
        technicians: [],
        clients: [],
        end_clients: [],
        status: [],
        task_status: [],
        request_types: [],
        request_schedules: [],
        time: null,
        menu2: false,
        menu3: false,
        work_date_menu: false,
      }
    },
    watch: {
      data: {
        handler (data) {
        if(data){
            this.initialize();
            if(data.id){
              this.formdata.wticket_order = data.wticket_order
              this.formdata.wdate = data.wdate
              this.formdata.start_time = data.start_time
              this.formdata.end_time = data.end_time
              this.formdata.break_time = data.break_time
              this.formdata.total_work_time = data.total_work_time
              this.formdata.actual_work_hour = data.actual_work_hour
              this.formdata.ticket_no = data.ticket_no
              this.formdata.work_desc = data.work_desc
              this.formdata.techId = data.technicianID.toString()
              this.formdata.clientId = data.clientID.toString()
              this.formdata.endClientId = data.end_clientID.toString()
              this.formdata.statusId = data.statusID.toString()
              this.formdata.requestTypeId = data.request_typeID.toString()
              this.formdata.requestSchedId = data.request_schedID.toString()
              this.formdata.cityLocId = data.cityID.toString()
              this.getOtherWorkDetails(data.id);
            }
            this.dialog = true;
        }
        },
        deep: true,
      },
    },
    methods: {
      closeDialog() {
        this.dialog = false;
        this.eventHub.$emit('closeCheckDialog', false);
      },
      initialize(){
        this.getTechnicians();
        this.getClients();
        this.getEndClients();
        this.getStatus();
        this.getTaskStatus();
        this.getRequestTypes();
        this.getRequestSchedules();
      },
      changeTab(data){
        this.tab = data;
      },
      getTechnicians(){
        this.axiosCall("/user-details", "GET").then((res) => {
                if(res){ 
                  this.technicians = res.data;
                }
            });
      },
      getClients(){
        this.axiosCall("/client", "GET").then((res) => {
                if(res){ 
                  this.clients = res.data;
                }
            });
      },
      getEndClients(){
        this.axiosCall("/end-client", "GET").then((res) => {
                if(res){ 
                  this.end_clients = res.data;
                }
            });
      },
      getStatus(){
        this.axiosCall("/status", "GET").then((res) => {
                if(res){ 
                  this.status = res.data;
                }
            });
      },
      getRequestTypes(){
        this.axiosCall("/request-type", "GET").then((res) => {
                if(res){ 
                  this.request_types = res.data;
                }
            });
      },
      getRequestSchedules(){
        this.axiosCall("/request-sched", "GET").then((res) => {
                if(res){ 
                  this.request_schedules = res.data;
                }
            });
      },
      getTaskStatus(){
        this.axiosCall("/status/status-type/2", "GET").then((res) => {
                if(res){ 
                  this.task_status = res.data;
                }
            });
      },
      getOtherWorkDetails(id){
        this.axiosCall("/work-details/"+id, "GET").then((res) => {
            if(res){ 
              const data = JSON.parse(JSON.stringify(res.data), (key, val) => (
                typeof val !== 'object' && val !== null ? String(val) : val
              ));
              this.formdata.workbefore = data.workbefore || {};
              this.formdata.workafter = data.workafter || {};
              this.formdata.worknote = data.worknote || {};
              this.formdata.workaccount = data.workaccount || {};
            }
        });
      },
      saveWorkDetails(action){
        if (this.$refs.work_detail_form.validate()) {
          this.formdata.workafter.action = action;
          this.formdata.workafter.UserID = this.$store.state.user.id;
          let data = {
            workDetailID: this.data.id,
            wticket_order: this.formdata.wticket_order,
            wdate: this.formdata.wdate,
            start_time: this.formdata.start_time,
            end_time: this.formdata.end_time,
            break_time: this.formdata.break_time,
            total_work_time: this.formdata.total_work_time,
            actual_work_hour: this.formdata.actual_work_hour,
            ticket_no: this.formdata.ticket_no,
            work_desc: this.formdata.work_desc,
            technicianID: parseInt(this.formdata.techId),
            clientID: parseInt(this.formdata.clientId),
            end_clientID: parseInt(this.formdata.endClientId),
            statusID: parseInt(this.formdata.statusId),
            request_typeID: parseInt(this.formdata.requestTypeId),
            request_schedID: parseInt(this.formdata.requestSchedId),
            cityID: 1,
            workbefore: this.formdata.workbefore,
            workafter: this.formdata.workafter,
            worknote: this.formdata.worknote,
            workaccount: this.formdata.workaccount,
            createdBy_userID: parseInt(this.$store.state.user.id)
          };
          this.axiosCall("/work-details/dispatch", "POST", data).then((res) => {
                if(res){
                  this.fadeAwayMessage.show = true
                  this.fadeAwayMessage.type = 'success'
                  this.fadeAwayMessage.header = "System Message"
                  this.fadeAwayMessage.message = "Work Successfully saved!"
                  if(!this.data.id){
                    this.$refs.work_detail_form.reset();
                  }
                }
          });
        }
      },
    },
  }
</script>