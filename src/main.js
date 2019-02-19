// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router/index'
import axios from 'axios'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import {get, post} from "./components/axiosHttp";
import addNewButton from './components/addNewButton'
import pagingDevice from './components/pagingDevice'
import Vuex from 'vuex'

Vue.use(Vuex)

// 引入elementUI
Vue.use(ElementUI);

// 加号按钮组件
Vue.component('addNewButton', addNewButton)

// 分页器组件
Vue.component('pagingDevice', pagingDevice)

// 引入axios
Vue.prototype.axios = axios
// import Qs from 'qs'
// Vue.prototype.qs = Qs;

// 引入两个封装接口
Vue.prototype.$get = get
Vue.prototype.$post = post

Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  let jwt = document.cookie
  if (to.path === '/login') {
    next()
    return
  }
  if (jwt!=='') {
    if (to.path === '/') {
      next({
        path: '/home'
      })
    } else {
      next()
    }
  } else {
    next({
      path: '/login'
    })
  }
})

const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>'
})
