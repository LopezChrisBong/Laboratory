<template>
  <div
    v-if="display"
    class="fade-away-message-container rounded-lg elevation-1"
    :class="{
      show: showClass,
      hide: !showClass,
      variation1: showVariation1Class,
      variation2: showVariation2Class,
      variation3: showVariation3Class,
      variation4: showVariation4Class,
      variation5: showVariation5Class,
    }"
    :style="{
      top: '50%',
      'min-height': header && message ? '500px' : '500px',
      width: width + 'px',
    }"
  >
    <v-row>
      <v-col
        cols="12"
        v-if="displayType == 'variation2'"
        class="d-flex justify-center"
        :class="background"
        style="min-height: 90px;"
      >
        <div :class="background"></div>
        <v-icon :class="background" class="icon" large>{{ mdiIcon }}</v-icon>
      </v-col>
      <v-col cols="12" class="pa-2" :class="background" v-else>
        <v-icon class="icon mx-0" large>{{ mdiIcon }}</v-icon>
      </v-col>
      <v-col cols="12" class="d-flex justify-center align-center">
        <div
          style="min-height: 300px;"
          class="d-flex justify-center align-center"
        >
          <div
            style="border: 1px black solid; border-radius: 30px; padding: 20px;"
            width="400px"
          >
            <div class="d-flex justify-center align-center">
              <v-icon class="icon mx-0" size="100"
                >mdi-information-slab-circle-outline</v-icon
              >
            </div>
            <div>
              <div class="d-flex justify-center align-center">
                <div v-if="header">{{ header }}</div>
              </div>
              <div class="d-flex justify-center align-center">
                <div v-if="message">
                  {{ message }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </v-col>
      <v-col
        cols="12"
        class="d-flex justify-center"
        style="border-top: 1px gray solid;"
      >
        <v-btn
          id="fadeawayclose"
          fab
          large
          text
          @click="clickClose"
          class="pa-5"
        >
          <v-icon dark>mdi-close</v-icon> Close
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "FadeAwayMessage",
  props: {
    value: {
      type: Boolean,
      default: true,
    },
    header: {
      type: String,
      default: "SERVER ERROR",
    },
    message: {
      type: String,
      default: "Something went wrong!",
    },
    timeout: {
      type: [Number, String],
      default: 10000,
    },
    type: {
      type: String,
      default: "success",
    },
    // top: {
    //   type: [Number, String],
    //   default: 20,
    // },
    backgroundClass: {
      type: String,
      default: "primary",
    },
    textColorClass: {
      type: String,
      default: "white--text",
    },
    displayType: {
      type: String,
      default: "default",
    },
    width: {
      type: [Number, String],
      default: 600,
    },
  },

  watch: {
    type: function(val) {
      this.setType(val);
    },

    value: function(val) {
      this.display = val;
    },

    display: function(val) {
      if (val) {
        this.showBox();
      } else {
        this.clickClose();
      }
    },
  },

  mounted: function() {
    this.display = this.value;
  },

  data: () => ({
    display: false,
    mdiIcon: "mdi-check",
    background: "teal darken-3",
    headerClasses: "title",
    mainContainerClasses: {},

    showClass: false,
    showVariation1Class: false,
    showVariation2Class: false,
    showVariation3Class: false,
    showVariation4Class: false,
    showVariation5Class: false,
  }),

  methods: {
    showBox: function() {
      this.$emit("input", true);
      this.headerClasses = "title";
      if (this.message && this.header) {
        this.headerClasses += " mb-4";
      }

      this.setType();
      this.setMainContainerClass();

      setTimeout(() => {
        this.showClass = true;
        setTimeout(() => {
          this.clickClose();
        }, this.timeout);
      }, 10);
    },

    clickClose: function() {
      this.showClass = false;

      setTimeout(() => {
        this.display = false;
        this.$emit("input", false);
      }, 1000);
    },

    setMainContainerClass: function() {
      this.showVariation1Class = false;
      this.showVariation2Class = false;
      this.showVariation3Class = false;
      this.showVariation4Class = false;
      this.showVariation5Class = false;

      switch (this.displayType) {
        case "variation1":
          this.showVariation1Class = true;
          break;
        case "variation2":
          this.showVariation2Class = true;
          break;
        case "variation3":
          this.showVariation3Class = true;
          break;
        case "variation4":
          this.showVariation4Class = true;
          break;
        case "variation5":
          this.showVariation5Class = true;
          break;
      }
    },

    setType: function(type) {
      switch (type) {
        case "success":
        case "primary":
          this.background = "primary";
          this.mdiIcon = "mdi-check";
          break;
        case "warning":
          this.background = "amber";
          this.mdiIcon = "mdi-alert-circle-outline";
          break;
        case "danger":
        case "error":
          this.background = "error";
          this.mdiIcon = "mdi-alert-octagon-outline";
          break;
      }
    },
  },
};
</script>

<style scoped>
.fade-away-message-container {
  position: fixed;
  top: 20%;
  min-width: 530px;
  background-color: #fefefe;
  right: 50%;
  transform: translate(-50%, -50%);
  left: 50%;
  border-radius: 5px;
  z-index: 9999;
  height: 40px;
  overflow: hidden;
  transition: all 0.4s ease;
  opacity: 0;
}

.fade-away-message-container.show {
  opacity: 1;
}

.fade-away-message-container.hide {
  opacity: 0;
}
</style>
