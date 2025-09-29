<template>
  <div>
    <v-row class="mx-2">
      <v-col cols="12" md="6" class="pa-0">
        <v-tabs v-model="activeTab" color="#2196F3" align-tabs="left">
          <v-tab v-for="tab in tabList" :key="tab.id" @click="changeTab(tab)">{{
            tab.name
          }}</v-tab>
        </v-tabs>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="12" md="6" class="d-flex justify-space-between">
        <v-text-field
          v-model="search"
          outlined
          prepend-inner-icon="search"
          label="Search"
          single-line
          hide-details
          class="rounded-lg"
          color="#239FAB"
          dense
        ></v-text-field>
        <v-btn
          class="white--text ml-2 rounded-lg"
          color="#2196F3"
          @click="add()"
        >
          <v-icon left> mdi-plus-box-outline </v-icon>
          Service
        </v-btn>
        <v-btn
          v-if="tab != 3"
          class="white--text ml-2 rounded-lg"
          color="#2196F3"
          @click="addCategory()"
        >
          <v-icon left> mdi-eye-outline </v-icon>
          Category
        </v-btn>
      </v-col>
    </v-row>
    <v-card class="ma-5 dt-container" elevation="0" outlined>
      <v-data-table
        :headers="tab != 3 ? headers : headers1"
        :items="data"
        :items-per-page="10"
        :search="search"
        :options.sync="options"
        :loading="loading"
        @pagination="pagination"
        hide-default-footer
      >
        <template v-slot:[`item.service_price`]="{ item }">
          &#8369;{{ item.service_price }}
        </template>

        <template v-slot:[`item.price`]="{ item }">
          &#8369;{{ item.price }}
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <div class="">
            <v-btn
              class="ma-1 d-flex justify-start"
              x-small
              color="green"
              outlined
              @click="tab != 3 ? view(item) : update(item)"
              block
            >
              <v-icon size="14" class="mr-1">mdi-eye</v-icon>Update
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>
    <v-row class="mb-2 mx-5" align="center">
      <v-col cols="auto" class="mr-auto text-truncate flex-items" no-gutters>
        <span class="px-2">Show</span>
        <span>
          <v-select
            dense
            outlined
            color="#2196F3"
            hide-details
            :value="options.itemsPerPage"
            style="max-width: 90px"
            class="rounded-lg"
            @change="options.itemsPerPage = parseInt($event, 10)"
            :items="perPageChoices"
          >
          </v-select>
        </span>
        <span class="px-2"> Entries </span>
      </v-col>

      <v-col cols="auto" class="mr-auto text-truncate" no-gutters>
        Showing {{ paginationData.pageStart + 1 }} to
        {{ paginationData.pageStop }} of
        {{ paginationData.itemsLength }} entries
      </v-col>
      <v-col cols="auto">
        <v-pagination
          v-model="options.page"
          class="rounded-lg"
          :total-visible="7"
          :color="$vuetify.theme.themes.light.submitBtns"
          :length="paginationData.pageCount"
        >
        </v-pagination>
      </v-col>
    </v-row>

    <v-dialog scrollable persistent v-model="ServiceDialog" max-width="500">
      <v-card>
        <v-card-title dark class="dialog-header">
          <span
            >{{ action }}
            {{ tab == 1 ? "Laboratory" : tab == 2 ? "Imaging" : "Packages" }}
            Service</span
          >
          <v-spacer></v-spacer>
          <v-btn icon dark @click="closeD()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-form ref="AddServicesForm">
            <v-row class="mt-4">
              <v-col cols="12">
                <v-autocomplete
                  v-model="service_category"
                  small-chips
                  deletable-chips
                  dense
                  outlined
                  label="Category"
                  :items="categoryData"
                  item-text="category_description"
                  item-value="id"
                  class="rounded-lg"
                  color="#6DB249"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Description"
                  v-model="service_description"
                  :rules="[formRules.required]"
                  dense
                  class="rounded-lg"
                  item-text="type"
                  item-value="id"
                  color="#93CB5B"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Service Price"
                  v-model="service_price"
                  dense
                  class="rounded-lg"
                  item-text="type"
                  item-value="id"
                  color="#93CB5B"
                  type="number"
                >
                </v-text-field>
              </v-col>
            </v-row>
            <v-card-title> </v-card-title>
          </v-form>
        </v-card-text>

        <v-card-actions class="pa-5">
          <v-spacer></v-spacer>
          <v-btn color="red" outlined @click="closeD()">
            <v-icon>mdi-close-circle-outline</v-icon>
          </v-btn>
          <v-btn v-if="action == 'Add'" color="blue" @click="addServiceData()">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
          <v-btn
            v-if="action == 'Update'"
            color="blue"
            @click="updateServiceData()"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!--Category Data-->
    <v-dialog
      fullscreen
      v-model="CategoryDialog"
      persistent
      eager
      scrollable
      max-width="900px"
    >
      <v-form ref="ServicesCategories" @submit.prevent>
        <v-card>
          <v-card-title dark class="dialog-header pt-5 pb-5 pl-6">
            <span>Categories</span>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="closeD()">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text style="max-height: 700px" class="my-4">
            <v-container>
              <v-row>
                <v-col cols="12" class="elevation-1">
                  <div class="d-flex flex-row-reverse">
                    <v-btn
                      color="#147452"
                      medium
                      class="mb-2 ma-2 pa-2 "
                      outlined
                      @click="AddCategoryDialog = true"
                    >
                      <v-icon size="14">mdi-plus</v-icon>Add
                    </v-btn>
                  </div>
                  <v-data-table
                    :headers="headers2"
                    :items="categoryData"
                    :items-per-page="10"
                    hide-default-footer
                  >
                    <template v-slot:[`item.actions`]="{ item, index }">
                      <div class="text-no-wrap">
                        <v-btn
                          x-small
                          color="red"
                          class="mx-1"
                          outlined
                          @click="deleteItem(item, index)"
                        >
                          <v-icon size="14">mdi-trash-can</v-icon>Delete
                        </v-btn>
                      </div>
                    </template>
                  </v-data-table>
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

            <v-btn color="#147452" class="white--text" @click="save()">
              <v-icon>mdi-check-circle</v-icon>
              Save
            </v-btn>
            <v-btn
              color="#519043"
              class="white--text"
              v-if="action == 'Update'"
              @click="update()"
            >
              <v-icon>mdi-check-circle</v-icon>
              Delete
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
    <!--Add Category Dialog-->
    <v-dialog
      v-model="AddCategoryDialog"
      persistent
      eager
      scrollable
      max-width="700px"
    >
      <v-form ref="AddCategoryForm" @submit.prevent>
        <v-card>
          <v-card-title dark class="dialog-header pt-5 pb-5 pl-6">
            <span>Category</span>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="closeD1()">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text style="max-height: 700px" class="my-4">
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="category"
                    dense
                    outlined
                    label="Description"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-divider></v-divider>

          <v-card-actions class="pa-5">
            <v-spacer></v-spacer>

            <v-btn color="red" outlined @click="closeD1()">
              <v-icon>mdi-close-circle-outline</v-icon>
              Cancel
            </v-btn>

            <v-btn
              color="#147452"
              class="white--text"
              @click="saveCategories()"
            >
              <v-icon>mdi-check-circle</v-icon>
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>

    <ServicesPakageDialog :data="addPackages" :action="action" />
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
    ServicesPakageDialog: () =>
      import("../../components/Dialogs/Forms/ServicesPakageDialog.vue"),
  },

  data: () => ({
    updateID: null,
    search: "",
    AddCategoryDialog: false,
    action: null,
    service_category: null,
    dialog: false,
    CategoryDialog: false,
    categoryData: [],
    ServiceDialog: false,
    service_description: null,
    service_price: null,
    category: null,
    addPackages: null,
    headers: [
      {
        text: "Service Description",
        value: "service_description",
        align: "start",
      },
      {
        text: "Service Price",
        value: "service_price",
        align: "center",
      },

      {
        text: "Action",
        value: "actions",
        align: "end",
        sortable: false,
        width: 60,
      },
    ],
    headers1: [
      {
        text: "Package Description",
        value: "description",
        align: "start",
      },
      {
        text: "Service Price",
        value: "price",
        align: "center",
      },

      {
        text: "Action",
        value: "actions",
        align: "end",
        sortable: false,
        width: 60,
      },
    ],

    headers2: [
      {
        text: "Description",
        value: "category_description",
        align: "start",
      },

      {
        text: "Action",
        value: "actions",
        align: "end",
        sortable: false,
        width: 60,
      },
    ],

    data: [],
    categoryList: [],
    addPatient: null,
    perPageChoices: [
      { text: "5", value: 5 },
      { text: "10", value: 10 },
      { text: "20", value: 20 },
      { text: "50", value: 50 },
      { text: "100", value: 100 },
      { text: "250", value: 250 },
      { text: "500", value: 500 },
    ],
    activeTab: { id: 1, name: "Laboratory" },
    tab: 1,
    tabList: [
      { id: 1, name: "Laboratory" },
      { id: 2, name: "Imaging" },
      { id: 3, name: "Packages" },
    ],
    totalCount: 0,
    deleteData: null,
    updateData: null,
    viewData: null,
    loading: false,
    options: {},
    tar_toID: null,
    paginationData: {},
    dialogConfirmDelete: false,
    remove_item: [],
    fadeAwayMessage: {
      show: false,
      type: "success",
      header: "Successfully Deleted!",
      message: "",
      top: 10,
    },
  }),

  mounted() {
    this.eventHub.$on("closeServicePackages", () => {
      this.initialize();
    });
  },
  beforeDestroy() {
    this.eventHub.$off("closeServicePackages");
  },

  watch: {
    options: {
      handler() {
        this.initialize();
      },
      deep: true,
    },
  },

  methods: {
    pagination(data) {
      this.paginationData = data;
    },

    changeTab(tab) {
      this.activeTab = tab;
      this.tab = tab.id;
      this.categoryData = [];
      this.remove_item = [];
      this.initialize();
    },

    initialize() {
      this.getAllServices();
      this.getAllCategoryByType();
    },

    getAllCategoryByType() {
      this.axiosCall(
        "/services/getCategoryServiceType/" + this.tab,
        "GET"
      ).then((res) => {
        if (res.data) {
          let data = res.data;
          //   for (let i = 0; i < data.length; i++) {
          //     data[i].name = this.toTitleCase(data[i].name);
          //     this.employee.push(data[i].userID);
          //   }
          this.categoryData = data;
          // console.log("Category", this.categoryData);
        }
      });
    },
    getAllServices() {
      this.loading = true;
      if (this.tab != 3) {
        this.axiosCall(
          "/services/getAllServicesByType/" + this.tab,
          "GET"
        ).then((res) => {
          if (res) {
            this.data = res.data;
            this.loading = false;
          }
        });
      } else {
        this.axiosCall("/services", "GET").then((res) => {
          if (res) {
            // console.log(res.data);
            this.data = res.data;
            this.loading = false;
          }
        });
      }
    },
    addServiceData() {
      let data = {
        service_category: this.service_category,
        service_description: this.service_description,
        service_price: this.service_price,
        service_type: this.tab,
      };
      // console.log(data);
      this.axiosCall("/services", "POST", data).then((res) => {
        if (res.data.status == 200) {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "success";
          this.fadeAwayMessage.header = "Successfully Updated";
          this.ServiceDialog = false;
          this.initialize();
          this.closeD();
        } else if (res.data.status == 400) {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = res.data.msg;
        }
      });
    },
    updateServiceData() {
      let data = {
        service_category: this.service_category,
        service_description: this.service_description,
        service_price: this.service_price,
      };
      this.axiosCall("/services/" + this.updateID, "PATCH", data).then(
        (res) => {
          if (res) {
            if (res.data.status == 201) {
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = "success";
              this.fadeAwayMessage.header = "System Message";
              this.fadeAwayMessage.message = res.data.msg;
              this.ServiceDialog = false;
              this.initialize();
              this.closeD();
            } else {
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = "error";
              this.fadeAwayMessage.header = "System Message";
              this.fadeAwayMessage.message = res.data.msg;
            }
          }
        }
      );
    },

    saveCategories() {
      let arr = Array.isArray(this.category) ? this.category : [this.category];
      let transformed = arr.map((item) => ({ category_description: item }));
      this.categoryData.push(...transformed);
      this.category = null;

      // console.log("Category Data", this.categoryData);
      //   for (let i = 0; i < this.employee_list.length; i++) {
      //     for (let j = 0; j < this.employee.length; j++) {
      //       if (this.employee_list[i].userID == this.employee[j]) {
      //         if (
      //           this.employee1.filter((e) => e.userID == this.employee[j])
      //             .length == 0
      //         ) {
      //           this.employee1.push(this.employee_list[i]);
      //         }
      //       }
      //     }
      //   }
      this.AddCategoryDialog = false;
    },
    deleteItem(item, index) {
      // console.log(item.id, index);
      if (item.id) {
        this.remove_item.push(this.categoryData[index]);
        this.categoryData.splice(index, 1);
        this.categoryList.splice(index, 1);
      } else {
        this.categoryData.splice(index, 1);
        this.categoryList.splice(index, 1);
      }
    },

    save() {
      // if (this.employee1.length > 0) {
      let data = {
        service_type: this.tab,
        category_description: JSON.stringify(this.categoryData),
        removed_category: JSON.stringify(this.remove_item),
      };
      // console.log(data);
      this.axiosCall("/services/addServiceCategory", "POST", data).then(
        (res) => {
          // console.log(res);
          if (res.data.status == 200) {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "success";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
            this.ServiceDialog = false;
            this.closeD();
            this.closeD1();
          } else {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
          }
        }
      );
    },

    editItem(item) {
      this.updateData = item;
      this.action = "View";
    },
    updateItem(item) {
      this.viewData = item;
      this.action = "Update";
    },
    add() {
      this.action = "Add";
      if (this.tab != 3) {
        this.ServiceDialog = true;
      } else {
        this.addPackages = { id: null };
        this.dialog = true;
      }
    },
    addCategory() {
      this.CategoryDialog = true;
    },
    view(item) {
      // console.log(item);
      this.service_category =
        item.service_category == "" ? "" : JSON.parse(item.service_category);
      this.updateID = item.id;
      this.service_description = item.service_description;
      this.service_price = item.service_price;
      this.ServiceDialog = true;
      this.action = "Update";
    },
    update(item) {
      this.addPackages = item;
      this.action = "Update";
    },
    closeD() {
      this.ServiceDialog = false;
      this.CategoryDialog = false;
      this.service_price = null;
      this.service_description = null;
      this.service_category = null;
      this.categoryData = [];
      this.initialize();
    },
    closeD1() {
      this.AddCategoryDialog = false;
    },

    // confirmDelete() {
    //   this.axiosCall("/request-type/" + this.deleteData.id, "DELETE").then(
    //     () => {
    //       this.fadeAwayMessage.show = true;
    //       this.itemData = null;
    //       this.initialize();
    //     }
    //   );
    // },
  },
};
</script>
