import { ComponentSize } from '@/types/common'
import Cookies from 'js-cookie'
import {
  Action,
  config,
  getModule,
  Module,
  Mutation,
  MutationAction,
  VuexModule
} from 'vuex-module-decorators'
import store from '..'

config.rawError = true

export interface AppState {
  sidebar: {
    opened: boolean
    withoutAnimation: boolean
  }
  device: 'desktop' | 'mobile'

  size: ComponentSize
}
@Module({
  dynamic: true,
  store,
  name: 'app',
  namespaced: true
})
class App extends VuexModule implements AppState {
  sidebar = {
    opened: Cookies.get('sidebarStatus') !== 'closed',
    withoutAnimation: false
  }

  device: AppState['device'] = 'desktop'

  size: AppState['size'] = (Cookies.get('size') as ComponentSize) || 'medium'

  @Mutation
  TOGGLE_SIDEBAR() {
    this.sidebar.opened = !this.sidebar.opened
    this.sidebar.withoutAnimation = false
    if (this.sidebar.opened) {
      Cookies.set('sidebarStatus', '1')
    } else {
      Cookies.set('sidebarStatus', '0')
    }
  }

  @Mutation
  CLOSE_SIDEBAR(withoutAnimation: boolean) {
    Cookies.set('sidebarStatus', '0')
    this.sidebar.opened = false
    this.sidebar.withoutAnimation = withoutAnimation
  }

  @Mutation
  TOGGLE_DEVICE(device: AppState['device']) {
    this.device = device
  }

  @Mutation
  SET_SIZE(size: AppState['size']) {
    this.size = size
    Cookies.set('size', size)
  }

  @Action
  toggleSideBar() {
    this.TOGGLE_SIDEBAR()
  }

  @Action
  closeSideBar({ withoutAnimation }: { withoutAnimation: boolean }) {
    this.CLOSE_SIDEBAR(withoutAnimation)
  }

  @MutationAction
  async toggleDevice(device: string) {
    return { device }
  }

  @MutationAction
  async setSize(size: ComponentSize) {
    console.log(this)
    Cookies.set('size', size)
    return { size }
  }
}

export const AppModule = getModule(App)
