<template>
  <div class="not-found">
    <v-container fluid class="h-100">
      <v-row class="h-100" align="center" justify="center">
        <v-col cols="12">
          <!-- CENTER WRAPPER -->
          <div class="content-center">
            <!-- Lamp -->
            <div class="lamp"></div>

            <!-- Laptop -->
            <div class="laptop-wrapper">
              <div class="laptop">
                <div class="screen">
                  <div class="code">404</div>
                </div>
                <div class="base"></div>
              </div>
            </div>

            <!-- Text -->
            <h2
              class="mt-8 white--text font-weight-medium"
              style="color: white"
            >
              SORRY, PAGE NOT FOUND
            </h2>

            <!-- Icon -->
            <v-icon large color="white" class="mt-4"> mdi-tools </v-icon>

            <!-- Button -->
            <v-btn
              outlined
              color="white"
              class="mt-6"
              style="color: white"
              @click="$router.push('/')"
            >
              GO HOME
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "NotFound",
  methods: {
    redirectTo() {
      this.$router.push("/");
    },
  },
};
</script>
<style scoped>
/* FULL SCREEN FIX */
.not-found {
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #1976d2, #3992eb);
}

.h-100 {
  height: 100%;
}

/* Lamp */
.lamp {
  width: 120px;
  height: 10px;
  background: #fff;
  margin: 0 auto 12px;
  border-radius: 4px;
  position: relative;
}

.lamp::after {
  content: "";
  position: absolute;
  top: -40px;
  left: 50%;
  width: 4px;
  height: 40px;
  background: #fff;
  transform: translateX(-50%);
}

/* Laptop */
.laptop-wrapper {
  display: flex;
  justify-content: center;
}

.laptop {
  width: 360px;
}

.screen {
  background: #1976d2;
  border: 8px solid #4a4a4a;
  border-radius: 8px;
  height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.code {
  background: #fff;
  color: #7a7a7a;
  font-size: 48px;
  font-weight: bold;
  width: 110px;
  height: 110px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.base {
  height: 16px;
  background: #cfcfcf;
  border-radius: 0 0 12px 12px;
  margin-top: 6px;
}
.content-center {
  display: flex;
  flex-direction: column;
  align-items: center; /* horizontal center */
  text-align: center; /* text center */
}
</style>
