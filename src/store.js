/* eslint-disable no-console */
/* eslint-disable no-undef */
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    settings: {
      _id: "Mverything-setting",
      data: {
        isFindFileContent: false,
        searchRoot: "user",
        searchKey: ":",
        keyList: []
      },
      _rev: ""
    }
  },
  getters: {
    settings: state => {
      var result = utools.db.get(state.settings._id);
      if (result.error) {
        return state.settings;
      }
      return result;
    }
  },
  mutations: {
    updateSettingsRev(state, rev) {
      state.settings._rev = rev;
    }
  }
});

export default store;