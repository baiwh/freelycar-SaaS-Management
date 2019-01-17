import Vue from 'vue'
import Router from 'vue-router'

import login from '@/login'
import home from '@/view/home'
import navApp from '@/router/navApp'
import StatisticalReportForms from '@/router/StatisticalReportForms'

// 门店管理
import StoreManagement from '@/view/StoreManagement'
// 账号管理
import AccountManagement from '@/view/AccountManagement'

// 统计报表
import IncomeInquiry from '@/view/IncomeInquiry'
import FlowDetails from '@/view/FlowDetails'

// 智能柜
import IntelligentCabinet from '@/view/IntelligentCabinet'
// 活动宣传
import ActivityPropaganda from '@/view/ActivityPropaganda'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: '登录',
      component: login
    },
    {
      path: '/',
      name: '首页',
      component: navApp,
      children: [
        {
          path: 'home',
          name: '',
          component: home
        },
        {
          path: 'StoreManagement',
          name: '门店管理',
          component: StoreManagement
        },
        {
          path: 'AccountManagement',
          name: '账号管理',
          component: AccountManagement
        },
        {
          path: 'StatisticalReportForms',
          name: '统计报表',
          component: StatisticalReportForms,
          children: [
            {
              path: 'IncomeInquiry',
              name: '营业汇总',
              component:IncomeInquiry
            },
            {
              path: 'FlowDetails',
              name: '流水报表',
              component:FlowDetails
            }
          ]
        },
        {
          path: 'IntelligentCabinet',
          name: '智能柜管理',
          component: IntelligentCabinet
        },
        {
          path: 'ActivityPropaganda',
          name: '活动宣传管理',
          component: ActivityPropaganda
        },
      ]
    },

  ],
  mode: 'history',
})
