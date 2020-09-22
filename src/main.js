// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router/index'
import axios from 'axios'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import {get, post, getExcel, postExcel} from "./components/axiosHttp";
import addNewButton from './components/addNewButton'
import pagingDevice from './components/pagingDevice'
import Vuex from 'vuex'

//引用地图
import BaiduMap from 'vue-baidu-map'
Vue.use(BaiduMap, {
  ak: 'aOYxcgNT3v3I7UGrZcRpGqnFgnU0xZdN'
});

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
Vue.prototype.$getExcel = getExcel
Vue.prototype.$postExcel = postExcel

Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  console.log('to.path:', to.path)
  if (to.path === '/login') {
    next()
    return
  }
  let cookie = document.cookie
  // 先判定cookie是否有值。是，继续。否，跳转登录页
  if (cookie) {
    let cookieArr = cookie.split('; ')
    let cookieObj = {}
    cookieArr.forEach(value => {
      let newValue = value.split('=')
      cookieObj[newValue[0]] = newValue[1]
    })
    // 判断jwt是否存在。是，继续。否，跳转到登录页
    if (cookieObj.jwtSuperAdmin) {
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
