// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import ElementUI, { Message } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import echarts from 'echarts'
import world from 'echarts/map/json/world.json'
/* 引入echarts工具 */
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.prototype.$echarts = echarts;

echarts.registerMap('world',world);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  data: function(){
    return {
      // 定义全局可读写变量
      isDetailView: true, // 默认视图为详细视图，切换视图为二级菜单视图
    }
},

  components: { App },
  template: '<App/>'
})
