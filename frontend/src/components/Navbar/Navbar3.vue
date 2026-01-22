<template>
  <v-app>
    <!-- Top App Bar -->
    <v-app-bar flat color="white" elevation="2">
      <!-- Mobile menu button -->
      <v-app-bar-nav-icon v-if="isMobile" @click="drawer = !drawer" />

      <div class="pa-4 d-flex align-center">
        <v-img
          src="../../assets/img/paragon logo website.png"
          max-width="42"
          contain
        />
        <div class="ml-3">
          <strong class="text-h6">PARAGON</strong>
          <div class="caption grey--text">Receptionist Dashboard</div>
        </div>
      </div>

      <v-spacer />

      <!-- Hide search on mobile -->
      <v-text-field
        v-if="!isMobile"
        outlined
        dense
        prepend-inner-icon="mdi-magnify"
        placeholder="Search patients..."
        density="compact"
        variant="outlined"
        hide-details
        class="mr-4"
        style="max-width: 260px"
      />

      <v-btn icon>
        <v-badge dot color="red">
          <v-icon>mdi-bell-outline</v-icon>
        </v-badge>
      </v-btn>

      <v-menu>
        <template #activator="{ props }">
          <v-btn v-bind="props" class="ml-3" rounded>
            <v-avatar size="32" color="primary">
              <span class="white--text">J</span>
            </v-avatar>
            <span v-if="!isMobile" class="ml-2 text-body-2"> Jane Smith </span>
          </v-btn>
        </template>
      </v-menu>
    </v-app-bar>

    <!-- Navigation Drawer -->
    <v-navigation-drawer
      v-model="drawer"
      :temporary="isMobile"
      :permanent="!isMobile"
      width="260"
      class="sidebar"
    >
      <!-- Logo -->

      <v-divider class="mb-2" />

      <!-- Navigation -->
      <v-list nav dense>
        <v-list-item
          to="/reception/dashboard"
          class="nav-item"
          active-class="active-link"
        >
          <v-icon start>mdi-view-dashboard</v-icon>
          Dashboard
        </v-list-item>

        <v-list-item
          to="/reception/patients"
          class="nav-item"
          active-class="active-link"
        >
          <v-icon start>mdi-account-group</v-icon>
          Patients
        </v-list-item>

        <v-list-item
          to="/reception/appointments"
          class="nav-item"
          active-class="active-link"
        >
          <v-icon start>mdi-calendar</v-icon>
          Appointments
          <v-spacer />
          <v-badge content="8" color="primary" />
        </v-list-item>

        <v-list-item
          to="/reception/settings"
          class="nav-item"
          active-class="active-link"
        >
          <v-icon start>mdi-cog</v-icon>
          Profile & Settings
        </v-list-item>
      </v-list>

      <v-spacer />

      <v-divider />

      <!-- Logout -->
      <v-list-item class="nav-item logout" @click="logout">
        <v-icon start color="red">mdi-logout</v-icon>
        <span class="red--text">Logout</span>
      </v-list-item>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main class="bg-grey-lighten-4 pa-4">
      <!-- <router-view /> -->
    </v-main>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      drawer: false,
    };
  },
  methods: {
    closeOnMobile() {
      if (this.$vuetify.breakpoint.smAndDown) {
        this.drawer = false;
      }
    },
    logout() {
      console.log("logout");
    },
  },
};
</script>

<style scoped>
.sidebar {
  background: #ffffff;
  border-right: 1px solid #e5e7eb;
}

.nav-item {
  margin: 4px 12px;
  border-radius: 8px;
}

.active-link {
  background-color: #e8f1ff !important;
  color: #1d4ed8 !important;
}

.active-link .v-icon {
  color: #1d4ed8 !important;
}

.logout:hover {
  background-color: #fee2e2 !important;
}
</style>
