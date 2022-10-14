import Vue from "vue";
import Vuex from "vuex";
import getters from "./getters";
import app from "./modules/app";
import settings from "./modules/settings";
import user from "./modules/user";
import option from "./modules/option";
import VuexPersistence from "vuex-persist";

const vuexLocal = new VuexPersistence({
  storage: window.sessionStorage
});

Vue.use(Vuex);

const store = new Vuex.Store({
  plugins: [vuexLocal.plugin],
  modules: {
    app,
    settings,
    user,
    option
  },
  getters
});

export default store;
