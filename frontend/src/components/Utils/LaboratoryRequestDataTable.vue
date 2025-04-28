<template>
  <v-container>
    <!-- Header -->
    <v-row>
      <v-col class="text-center">
        <h2>PARAGON DIAGNOSTICS AND MULTI-SPECIALTY CLINIC</h2>
        <p>1F Blue Building 2, Nabeco Road, Brgy. San Francisco, Panabo City</p>
        <p>Email: paragondiagnostics.lab@gmail.com | Contact: 0946-300-3260</p>
        <p>Monday to Saturday, 7:00 AM to 5:00 PM</p>
      </v-col>
    </v-row>

    <v-divider class="my-4"></v-divider>

    <!-- Patient Info -->
    <v-row>
      <v-col cols="6">
        <v-text-field label="Name" dense outlined></v-text-field>
      </v-col>
      <v-col cols="6">
        <v-text-field label="Address" dense outlined></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="4">
        <v-text-field label="Age/Sex" dense outlined></v-text-field>
      </v-col>
      <v-col cols="4">
        <v-text-field label="Date" dense outlined type="date"></v-text-field>
      </v-col>
      <v-col cols="4">
        <v-text-field label="Status" dense outlined></v-text-field>
      </v-col>
    </v-row>

    <v-divider class="my-4"></v-divider>

    <!-- Laboratory Requests -->
    <v-row>
      <v-col cols="12">
        <h4>LABORATORY AND IMAGING REQUEST</h4>
      </v-col>
    </v-row>

    <!-- Checklist Sections -->
    <v-row>
      <v-col cols="6">
        <h5>HEMATOLOGY</h5>
        <v-checkbox label="CBC w/ Platelet Count" dense></v-checkbox>
        <v-checkbox label="PT" dense></v-checkbox>
        <v-checkbox label="APTT" dense></v-checkbox>
        <v-checkbox label="BT" dense></v-checkbox>
        <v-checkbox label="CT" dense></v-checkbox>
        <v-checkbox label="ABO / Rh Typing" dense></v-checkbox>
        <v-checkbox label="PBS" dense></v-checkbox>

        <h5>CLINICAL MICROSCOPY</h5>
        <v-checkbox label="Urinalysis" dense></v-checkbox>
        <v-checkbox label="Stool Exam" dense></v-checkbox>
        <v-checkbox label="Routine Urinalysis" dense></v-checkbox>

        <h5>MICROBIOLOGY</h5>
        <v-checkbox label="Gram Stain (Urine)" dense></v-checkbox>
      </v-col>

      <v-col cols="6">
        <h5>CLINICAL CHEMISTRY</h5>
        <v-checkbox label="FBS" dense></v-checkbox>
        <v-checkbox label="SGPT" dense></v-checkbox>
        <v-checkbox label="SGOT" dense></v-checkbox>
        <v-checkbox label="HbA1c" dense></v-checkbox>
        <v-checkbox label="OGTT 75gms" dense></v-checkbox>
        <v-checkbox label="Serum Uric Acid" dense></v-checkbox>
        <v-checkbox label="Total Cholesterol" dense></v-checkbox>
        <v-checkbox label="LDL / HDL / Triglycerides" dense></v-checkbox>
        <v-checkbox label="Electrolytes: Na, K, Ca, Cl" dense></v-checkbox>

        <h5>SEROLOGY</h5>
        <v-checkbox label="HBsAg" dense></v-checkbox>
        <v-checkbox label="HIV Ag/Ab" dense></v-checkbox>
        <v-checkbox label="TPHA (Syphilis)" dense></v-checkbox>
        <v-checkbox label="B-HCG" dense></v-checkbox>

        <h5>RADIOLOGY</h5>
        <v-checkbox label="X-ray" dense></v-checkbox>
        <v-checkbox label="Ultrasound" dense></v-checkbox>
        <v-checkbox label="CT Scan" dense></v-checkbox>
        <v-checkbox label="MRI" dense></v-checkbox>

        <h5>OTHERS</h5>
        <v-checkbox label="Pregnancy Test (Serum)" dense></v-checkbox>
        <v-checkbox label="Urine Pregnancy Test" dense></v-checkbox>
        <v-checkbox label="KOH Smear" dense></v-checkbox>
        <v-checkbox label="Pap Smear" dense></v-checkbox>
      </v-col>
    </v-row>

    <v-divider class="my-4"></v-divider>

    <!-- Footer -->
    <v-row>
      <v-col cols="6">
        <v-text-field label="License No." dense outlined></v-text-field>
      </v-col>
      <v-col cols="6">
        <v-text-field label="PTR No." dense outlined></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-text-field
          label="Your Next Visit Is On:"
          dense
          outlined
          type="date"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-btn fab color="primary" dark fixed bottom right @click="handleClick">
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </v-container>
</template>

<script>
export default {
  name: "LabRequestForm",
  data() {
    return {};
  },
  methods: {
    handleClick() {
      alert("Added successfully");
      // You can open a form, navigate, etc.
    },
  },
};
</script>

<style scoped>
h2,
h4,
h5 {
  font-weight: bold;
}
</style>
