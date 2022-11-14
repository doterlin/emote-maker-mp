import Vue from 'vue'
import App from './index'

const app = new Vue(App)
app.$mount()
export default {
  config: {
    'usingComponents': {
      'i-panel': '../../static/iview/panel/index',
      'i-input': '../../static/iview/input/index',
      'i-button': '../../static/iview/button/index'
    }
  }
}
