import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import './plugins/element.js'
//  导入全局样式表
import './assets/css/global.css'
//  导入字体图标
import './assets/fonts/iconfont.css'
//  导入treeTable
import treeTable from 'vue-table-with-tree-grid'

Vue.config.productionTip = false

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  //  必须return config
  return config
})
Vue.prototype.$http = axios
Vue.component('tree-table', treeTable)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
