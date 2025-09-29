<template>
  <div>
    <!-- Doctor Dashboard -->
    <div v-if="assignModule == 5">
      <DoctorDashboard />
    </div>
    <!-- Receptionist Dashboard -->
    <div v-else-if="assignModule == 3">
      <Dashboard />
    </div>

    <!-- Medtech Dashboard -->
    <div v-else-if="assignModule == 2">
      <MedtechDashboard />
    </div>
  </div>
</template>

<script>
export default {
  components: {
    DoctorDashboard: () => import("../Pages/DoctorDashboard.vue"),
    MedtechDashboard: () => import("../Pages/MedtechDashboard.vue"),
    // ReceptionistDashboard: () => import("../Pages/ReceptionistDashboard.vue"),
    Dashboard: () => import("../Pages/Dashboard.vue"),
  },
  data: () => ({
    assignModule: null,
  }),
  mounted() {
    this.assignModule = this.$store.state.user.user.assignedModuleID;
    console.log(this.assignModule);
  },
};
</script>

<style scoped>
.v-calendar {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}
</style>
