import { App } from 'vue'
import permission from './permission'

const install = function (app: App) {
  app.directive('permission', permission)
}

;(permission as any).install = install

export default permission
