import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import './permission'
import store from './store'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import ElementPlus from 'element-plus'
import './styles/element-variables.scss'
import enLang from 'element-plus/lib/locale/lang/en' // 如果使用中文语言包请默认支持，无需额外引入，请删除该依赖

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
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

export const app = createApp(App).use(store).use(router).use(ElementPlus, {
  size: 'medium', // set element-plus default size
  locale: enLang // 如果使用中文，无需设置，请删除
})

app.component('svg-icon', SvgIcon)

app.mount('#app')
