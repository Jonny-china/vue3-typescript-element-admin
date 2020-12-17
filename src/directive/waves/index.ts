import { App } from 'vue'
import waves from './waves'

const install = function (app: App) {
  app.directive('waves', waves)
}

;(waves as any).install = install
export default waves
