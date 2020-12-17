import { createApp } from 'vue'
import Cookies from 'js-cookie'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import './permission'
import store from './store'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import ElementPlus from 'element-plus'
import './styles/element-variables.scss'
import locale from 'element-plus/lib/locale/lang/zh-cn' // 中文语言

import '@/styles/index.scss' // global css

import SvgIcon from '@/icons'

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'development') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

export const app = createApp(App)
  .use(store)
  .use(router)
  .use(ElementPlus, {
    size: Cookies.get('size') ?? 'medium', // set element-plus default size
    locale
  })

app.component('svg-icon', SvgIcon)

app.mount('#app')
