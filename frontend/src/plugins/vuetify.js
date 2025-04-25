import "material-design-icons-iconfont/dist/material-design-icons.css";
import Vue from "vue";
import Vuetify from "vuetify/lib";
import colors from "vuetify/lib/util/colors";

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: "md",
  },
  theme: {
    themes: {
      light: {
        primary1: colors.grey.lighten2,
        primary2: colors.grey.lighten5,
        secondary1: colors.grey.lighten2,
        secondary2: colors.grey.darken2,
        success: colors.grey.darken4,
        error4: colors.green.lighten5,
        white: colors.white,
        DarkWhite: colors.grey.lighten3,
        header: colors.green.darken2,
        notifUnOpen: "#dff2bf",
        notifUnOpenBorder: "#d3eda7",
        submitBtns: "#0e2b62",
      },
      dark: {
        primary1: colors.grey.darken4,
        primary2: colors.grey.darken4,
        secondary1: colors.grey.darken3,
        secondary2: colors.grey.lighten2,
        success: colors.grey.lighten2,
        error4: colors.grey.darken4,
        white: colors.white,
        DarkWhite: colors.grey.darken4,
        header: colors.white,
        submitBtns: "#147452",
      },
    },
  },
});
