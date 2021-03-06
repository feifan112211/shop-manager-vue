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
//  导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
//  导入对应的样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

Vue.config.productionTip = false

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  //  必须return config
  return config
})
Vue.prototype.$http = axios
//  注册树形表格
Vue.component('tree-table', treeTable)
//  注册富文本编辑器
Vue.use(VueQuillEditor)

//  全局过滤时间戳
Vue.filter('dateFormat', function(originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
