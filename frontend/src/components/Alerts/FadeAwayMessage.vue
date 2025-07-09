<template>
  <div
    v-if="display"
    class="fade-away-message-container rounded-lg elevation-2"
    :class="{ show: showClass, hide: !showClass }"
    :style="{ width: width + 'px' }"
  >
    <v-row
      class="pa-6 d-flex flex-column align-center justify-center text-center"
    >
      <v-icon :color="type == 'success' ? 'green' : 'red'" size="56">{{
        type == "success"
          ? "mdi-emoticon-happy-outline"
          : "mdi-emoticon-sad-outline"
      }}</v-icon>

      <div
        class="text-uppercase font-weight-bold text-h6 mt-4 "
        :style="type == 'success' ? 'color:green' : 'color:red'"
      >
        {{ type }}!
      </div>

      <div class="mt-2">
        <p class="mb-0">{{ header }}</p>
        <p class="mb-0">
          {{ message }}
        </p>
        <!-- <p>Soon, you will find a confirmation in your email.</p> -->
      </div>

      <v-btn
        color="success"
        class="mt-4 px-6"
        @click="clickClose"
        elevation="1"
      >
        Close
      </v-btn>
    </v-row>
  </div>
</template>
<script>
export default {
  name: "FadeAwayMessage",
  props: {
    value: Boolean,
    timeout: { type: [Number, String], default: 10000 },
    type: { type: String, default: "success" },
    width: { type: [Number, String], default: 500 },
    message: {
      type: String,
      default: "Something went wrong!",
    },
    header: {
      type: String,
      default: "SERVER ERROR",
    },
  },
  data: () => ({
    display: false,
    showClass: false,
  }),
  watch: {
    value(val) {
      this.display = val;
    },
    display(val) {
      if (val) {
        this.showBox();
      } else {
        this.clickClose();
      }
    },
  },
  mounted() {
    this.display = this.value;
  },
  methods: {
    showBox() {
      this.$emit("input", true);
      setTimeout(() => {
        this.showClass = true;
        setTimeout(() => this.clickClose(), this.timeout);
      }, 10);
    },
    clickClose() {
      this.showClass = false;
      setTimeout(() => {
        this.display = false;
        this.$emit("input", false);
      }, 400);
    },
  },
};
</script>

<style scoped>
.fade-away-message-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #ffffff;
  border-radius: 12px;
  z-index: 9999;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.fade-away-message-container.show {
  opacity: 1;
}

.fade-away-message-container.hide {
  opacity: 0;
}
</style>
