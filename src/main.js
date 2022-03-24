import Vue from 'vue'
import App from './App.vue'
import router from './router/index.js'
import './plugins/element.js'
import Cookies from 'js-cookie'
Vue.prototype.$cookie = Cookies;

// 添加全局样式
import './assets/css/global.css'
// 引入iconfont
import './assets/icon/iconfont.css'
// 引入axios
import axios from 'axios'
// 挂载axios
Vue.prototype.$http = axios
// 设置访问根路径
// axios.defaults.baseURL = "http://localhost:9000/"
//axios.defaults.baseURL = 'http://218.199.191.216:9000'
axios.defaults.baseURL = '/api/'


Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
