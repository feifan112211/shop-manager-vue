import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import './plugins/element.js'
//  导入全局样式表
import './assets/css/global.css'
//  导入字体图标
import './assets/fonts/iconfont.css'

Vue.config.productionTip = false
Vue.prototype.$http = axios
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
