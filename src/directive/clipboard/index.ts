import { App } from 'vue'
import Clipboard from './clipboard'

const install = function (app: App) {
  app.directive('clipboard', Clipboard)
}

;(Clipboard as any).install = install

export default Clipboard
