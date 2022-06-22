import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app'

import uView from "uview-ui";
Vue.use(uView);

import Request from '@/common/http/request.js'
Vue.use(Request);

import Utils from '@/common/utils/utils.js'
Vue.use(Utils);

const app = new Vue({
  ...App
})
app.$mount()
