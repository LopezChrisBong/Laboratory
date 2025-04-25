import Vue from "vue";
import Vuex from "vuex";

import createPersistedState from "vuex-persistedstate";
import SecureLS from "secure-ls";
const ls = new SecureLS({ isCompression: false });

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    thisVue: {},
    user: null,
    isAuthenticated: 0,
    email: null,
    emp: null,
    expiryDate: null,
    filterSelected: null,
  },
  getters: {
    getIsAuthenticated(state) {
      return state.isAuthenticated;
    },
    getEmail(state) {
      return state.email;
    },
    // return true if token expiry date is less than curr_date
    isExpired(state) {
      return state.expiryDate < Date.now();
    },

    getUserData(state) {
      return state.user;
    },
    getFilterSelected(state) {
      return state.filterSelected;
    },
    getEmp(state) {
      return state.emp;
    },
  },
  mutations: {
    setExpiryDate(state) {
      // expiry time set to 1day
      const date = new Date();
      date.setDate(date.getDate() + 1);

      state.expiryDate = Date.parse(date);
    },
    setThisVue(state, payload) {
      state.thisVue = payload;
    },
    setEmail(state, payload) {
      state.email = payload;
    },
    setIsAuthenticated(state, payload) {
      state.isAuthenticated = payload;
    },
    setUserData(state, data) {
      state.user = data;
    },
    setFilterSelected(state, data) {
      state.filterSelected = data;
    },
    setEmp(state, data) {
      state.emp = data;
    },
  },
  actions: {
    setThisVue(context, payload) {
      context.commit("setThisVue", payload);
    },
    setEmail(context, payload) {
      context.commit("setEmail", payload);
    },
    setUser(context, data) {
      // let _this = context.state.thisVue;
      context.commit("setUserData", data);
    },
    setIsAuthenticated(context, data) {
      // let _this = context.state.thisVue;
      context.commit("setIsAuthenticated", data);
    },
    setEmp(context, data) {
      context.commit("setEmp", data);
    },
  },

  plugins: [
    createPersistedState({
      storage: {
        getItem: (key) => ls.get(key),
        setItem: (key, state) => ls.set(key, state),
        removeItem: (key) => ls.remove(key),
      },
    }),
  ],
});
