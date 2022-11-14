import '../static/sdk/ald-stat'
import Vue from 'vue'
import App from './App'
import './theme/theme.scss'
import config from './config'

Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue(App)
app.$mount()

const WX_ENV_ID = 'note-1888d4'
wx.cloud.init({
  env: WX_ENV_ID,
  traceUser: true,
})

Vue.prototype.$config = config
Vue.prototype.$db = wx.cloud.database({
  env: WX_ENV_ID
}) 
Vue.prototype.$cloud = wx.cloud

export default {
  // 这个字段走 app.json
  config: {
    // 页面前带有 ^ 符号的，会被编译成首页，其他页面可以选填，我们会自动把 webpack entry 里面的入口页面加进去
    pages: ['^pages/index/main', 'pages/maker/main', 'pages/feedback/main', 'pages/myFav/main'],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#333',
      navigationBarTitleText: '666斗图',
      navigationBarTextStyle: 'white'
    }
  }
}
