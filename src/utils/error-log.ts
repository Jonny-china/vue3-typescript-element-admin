import { nextTick, AppConfig, ComponentPublicInstance } from 'vue'
import store from '@/store'
import { isString, isArray } from '@/utils/validate'
const settings = require('@/settings')
import { app } from '@/main'

// you can set in settings.js
// errorLog:'production' | ['production', 'development']
const { errorLog: needErrorLog }: { errorLog: string | string[] } = settings

function checkNeed() {
  const env = process.env.NODE_ENV
  if (isString(needErrorLog)) {
    return env === needErrorLog
  }
  if (isArray(needErrorLog)) {
    return needErrorLog.includes(env)
  }
  return false
}

if (checkNeed()) {
  const errorHandler: AppConfig['errorHandler'] = (
    err: unknown,
    instance: ComponentPublicInstance | null,
    info: string
  ) => {
    // Don't ask me why I use Vue.nextTick, it just a hack.
    // detail see https://forum.vuejs.org/t/dispatch-in-vue-config-errorhandler-has-some-problem/23500
    nextTick(() => {
      store.dispatch('errorLog/addErrorLog', {
        err,
        instance,
        info,
        url: window.location.href
      })
      console.error(err, info)
    })
  }
  app.config.errorHandler = errorHandler
}
