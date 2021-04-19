import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import * as VueGoogleMaps from 'vue2-google-maps';
import Toasted from 'vue-toasted';
import VCalendar from 'v-calendar';
import VueApexCharts from 'vue-apexcharts';
import * as echarts from 'echarts';
import 'element-ui/lib/theme-chalk/index.css';

import store from './store';
Vue.prototype.$echart = echarts;
import ElementUI from 'element-ui';
import router from './Routes';
import App from './App';
import layoutMixin from './mixins/layout';
import axios from "axios";
import VueWechatTitle from 'vue-wechat-title'

Vue.use(VueWechatTitle);
Vue.prototype.axios = axios
Vue.use(BootstrapVue);
Vue.use(VCalendar, {
  firstDayOfWeek: 2
});
Vue.use(ElementUI);
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyB7OXmzfQYua_1LEhRdqsoYzyJOPh9hGLg',
  },
});

Vue.component('apexchart', VueApexCharts);
Vue.mixin(layoutMixin);
Vue.use(Toasted, {duration: 10000});

Vue.config.productionTip = false;


/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App),
});
