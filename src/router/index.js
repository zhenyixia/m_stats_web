import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import layout from '@/views/Layout/Layout'
import home from '@/common/home'
import test from '@/views/test'
import user from '@/views/user/user'

import overview from '@/views/Overview'
import statsHome from '@/views/Stats/Home'

const routerSet = {
  routes: [{
      path: '/',
      name: 'home',
      component: layout,
      redirect: '/overview',
      meta: {
        title: "首页",
        // icon: "home"
      },
      children: [{
          path: '/overview',
          name: '概览',
          component: overview,
          meta: {
            title: '概览',
            // icon: 'product-add'
          }
        },
        {
          path: '/user',
          name: '用户信息',
          component: user,
          meta: {
            title: '用户信息',
            // icon: 'product-add'
          }
        }, {
          path: '/statsHome/:menuId',
          name: '统计首页',
          component: () => import('@/views/Stats/Home'),
          meta: {
            title: '统计首页',
            keepAlive: true,
            // icon: 'product-add'
          }
        }, {
          path: '/runHome',
          name: '跑步',
          component: () => import('@/views/RunCount/CountRunHome'),
          meta: {
            title: '跑步',
            // icon: 'product-add'
          }
        }
      ]

    },
    {
      path: '/test',
      name: 'test',
      component: test
    },
    // {
    //   path: '/user',
    //   name: 'user',
    //   component: user
    // },
    // {
    //   path: '/runList',
    //   name: 'runList',
    //   component: () => import('@/views/OldPages/RunList'）
    // },
    // {
    //   path: '/overview',
    //   name: 'overview',
    //   component: overview
    // },
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
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
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



// WEBPACK FOOTER //
// ./src/router/index.js