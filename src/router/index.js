import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import home from '@/common/home'
import test from '@/views/test'
import user from '@/views/user'

import runList from '@/views/OldPages/RunList'
import countHome from '@/views/CountHome'
import weekCount from '@/views/WeekCountChart'

const routerSet = {
  routes: [{
      path: '/',
      name: 'home',
      component: home
    },
    {
      path: '/test',
      name: 'test',
      component: test
    },
    {
      path: '/user',
      name: 'user',
      component: user
    },
    {
      path: '/runList',
      name: 'runList',
      component: runList
    },
    {
      path: '/countHome',
      name: 'countHome',
      component: countHome
    },
    {
      path: '/weekCount',
      name: 'weekCount',
      component: weekCount
    }
  ]
}

/* let boot = window.location.origin
if (boot.indexOf('localhost') != -1) {
  routerSet.routes.push({
    path: '/',
    component: testHomePage
  })
} */



Vue.use(Router)
export default new Router(routerSet);
/* export default new Router({
  routes: [{
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/test',
      name: 'test',
      component: test
    }
  ]
}) */
