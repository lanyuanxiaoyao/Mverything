import Vue from "vue";
import Finder from "./Finder.vue";
import VXETable from "vxe-table";
import "vxe-table/lib/index.css";
import ElementUI from "element-ui";
import "../theme/index.css";

import store from "./store";

Vue.use(VXETable);
Vue.use(ElementUI);

Vue.config.productionTip = false;

Vue.directive("focus", {
  update: (el, { value }) => {
    if (value) {
      el.focus();
    }
  }
});

new Vue({
  store,
  render: h => h(Finder)
}).$mount("#app");
