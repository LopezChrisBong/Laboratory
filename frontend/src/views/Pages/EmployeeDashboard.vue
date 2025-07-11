<template>
  <v-app>
    <v-container fluid>
      <!-- Top Cards -->
      <v-row>
        <v-col cols="12" sm="6" md="3" v-for="(card, i) in cards" :key="i">
          <v-card class="pa-3 text-center elevation-2">
            <v-icon size="36" color="primary">{{ card.icon }}</v-icon>
            <div class="text-h6 font-weight-medium mt-2">{{ card.value }}</div>
            <div class="caption grey--text">{{ card.label }}</div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Charts and Stats -->
      <v-row>
        <!-- Out vs In Patients -->
        <v-col cols="12" md="6">
          <v-card class="pa-4">
            <div class="title font-weight-bold mb-2">
              Out Patients vs. In Patients
            </div>
            <BarChart :data="data" />
          </v-card>
        </v-col>

        <!-- Bed Availability + Gender -->
        <v-col cols="12" md="6">
          <v-row>
            <v-col cols="4">
              <v-card class="text-center pa-4">
                <div class="subtitle-2">Bed Availability</div>
                <v-progress-circular
                  :value="70"
                  size="80"
                  width="8"
                  color="purple"
                  rotate="-90"
                  >{{ 117 }}</v-progress-circular
                >
              </v-card>
            </v-col>
            <v-col cols="4">
              <v-card class="text-center pa-4">
                <div class="subtitle-2">Male</div>
                <v-progress-circular
                  :value="55"
                  size="80"
                  width="8"
                  color="red"
                  rotate="-90"
                  >{{ 86 }}</v-progress-circular
                >
              </v-card>
            </v-col>
            <v-col cols="4">
              <v-card class="text-center pa-4">
                <div class="subtitle-2">Female</div>
                <v-progress-circular
                  :value="45"
                  size="80"
                  width="8"
                  color="orange"
                  rotate="-90"
                  >{{ 70 }}</v-progress-circular
                >
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <!-- Time Admitted + Patients By Division -->
      <v-row>
        <v-col cols="12" md="6">
          <v-card class="pa-4">
            <div class="title font-weight-bold mb-2">Time Admitted</div>
            <LineChart :data="data" />
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card class="pa-4">
            <div class="title font-weight-bold mb-2">Patients by Division</div>
            <v-list two-line>
              <v-list-item v-for="item in divisions" :key="item.name">
                <v-list-item-icon
                  ><v-icon>{{ item.icon }}</v-icon></v-list-item-icon
                >
                <v-list-item-content>
                  <v-list-item-title>{{ item.name }}</v-list-item-title>
                  <v-list-item-subtitle
                    >{{ item.patients }} patients</v-list-item-subtitle
                  >
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
// import BarChart from "../../components/Charts/BarChart.vue";
// import LineChart from "../../components/Charts/LineChart.vue";

export default {
  // components: { BarChart, LineChart },
  data() {
    return {
      cards: [
        { icon: "mdi-heart-pulse", label: "Total Patients", value: "4,235" },
        {
          icon: "mdi-account-multiple",
          label: "Available Staff",
          value: "394",
        },
        { icon: "mdi-cash", label: "Avg Treat. Costs", value: "$2,526" },
        { icon: "mdi-ambulance", label: "Available Cars", value: "35" },
      ],
      divisions: [
        { name: "Cardiology", icon: "mdi-heart", patients: 74 },
        { name: "Neurology", icon: "mdi-brain", patients: 32 },
        { name: "Surgery", icon: "mdi-heart-pulse", patients: 15 },
        { name: "Covid", icon: "mdi-virus", patients: 35 },
        { name: "General", icon: "mdi-hospital", patients: 158 },
        { name: "Oncology", icon: "mdi-dna", patients: 85 },
      ],
    };
  },
  mounted() {},
  methods: {},
};
</script>

<style>
.v-card {
  border-radius: 12px;
}
</style>
