import Vue from "vue";
import Finder from "./Finder.vue";
import VXETable from "vxe-table";
import "vxe-table/lib/index.css";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

Vue.use(VXETable);
Vue.use(ElementUI);

Vue.config.productionTip = false;

new Vue({
  render: h => h(Finder)
}).$mount("#app");
