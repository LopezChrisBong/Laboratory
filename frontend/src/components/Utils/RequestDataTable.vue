<template>
  <v-container>
    <v-card>
      <v-card-title>
        <!-- Employee List -->
        <v-spacer></v-spacer>
        <!-- <v-btn color="primary" @click="addEmployee">Add Employee</v-btn> -->
      </v-card-title>

      <v-data-table
        :headers="headers"
        :items="employees"
        :items-per-page="5"
        class="elevation-1"
      >
        <template v-slot:item.action="{ item }">
          <v-btn color="red" icon @click="deleteEmployee(item)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      headers: [
        { text: "Name", value: "name" },
        { text: "Action", value: "action", sortable: false },
      ],
      employees: [
        { name: "John Doe" },
        { name: "Jane Smith" },
        { name: "Paul Johnson" },
      ],
    };
  },
  methods: {
    addEmployee() {
      this.employees.push({
        name: "New Employee",
        position: "Intern",
        office: "Remote",
      });
    },
    deleteEmployee(item) {
      this.employees = this.employees.filter((emp) => emp !== item);
    },
  },
};
</script>

<style scoped></style>
