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
      console.log("setting getter");
      var settings = state.settings;
      if (settings._rev === "") {
        console.log("rev is empty");
        var result = utools.db.get(settings._id);
        console.log("db result:", result);
        if (result._rev) {
          settings = result;
          store.commit("updateSettings", settings);
        }
      }
      return settings;
    }
  },
  mutations: {
    updateSettings(state, settings) {
      console.log("update settings", settings);
      state.settings = settings;
    },
    updateSettingsRev(state, rev) {
      console.log("update rev:", rev);
      state.settings._rev = rev;
    },
    updateSettingsKeyList(state, keyList) {
      console.log("update keyList:", keyList);
      state.settings.data.keyList = keyList;
    }
  }
});

export default store;
