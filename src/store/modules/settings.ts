import variables from '@/styles/element-variables.scss'
import {
  config,
  getModule,
  Module,
  MutationAction,
  VuexModule
} from 'vuex-module-decorators'
config.rawError = true
const defaultSettings = require('@/settings')
import store from '..'

export interface SettingsState {
  theme: string
  showSettings: boolean
  tagsView: boolean
  fixedHeader: boolean
  sidebarLogo: boolean
}

type ChangeSettin = {
  key: keyof SettingsState
  value: SettingsState[ChangeSettin['key']]
}

const { showSettings, tagsView, fixedHeader, sidebarLogo } = defaultSettings
@Module({
  name: 'settings',
  store,
  namespaced: true,
  dynamic: true
})
class Settings extends VuexModule implements SettingsState {
  theme: string = variables.theme
  showSettings: boolean = showSettings
  tagsView: boolean = tagsView
  fixedHeader: boolean = fixedHeader
  sidebarLogo: boolean = sidebarLogo

  @MutationAction
  async changeSetting(data: ChangeSettin) {
    const state = { ...this.state } as SettingsState

    ;(state[data.key] as ChangeSettin['value']) = data.value
    return state
  }
}

export const SettingsModule = getModule(Settings)
