import variables from '@/styles/element-variables.scss'
const defaultSettings = require('@/settings')
import { Module } from 'vuex'
import { StoreRootState } from '..'

export interface SettingsState {
  theme: string
  showSettings: boolean
  tagsView: boolean
  fixedHeader: boolean
  sidebarLogo: boolean
}

type ChangeSettin = { key: keyof SettingsState; value: string | boolean }

const { showSettings, tagsView, fixedHeader, sidebarLogo } = defaultSettings

export default {
  namespaced: true,
  state: {
    theme: variables.theme,
    showSettings: showSettings,
    tagsView: tagsView,
    fixedHeader: fixedHeader,
    sidebarLogo: sidebarLogo
  },
  mutations: {
    CHANGE_SETTING: (state, { key, value }: ChangeSettin) => {
      if (Reflect.has(state, key)) {
        ;(state[key] as string | boolean) = value
      }
    }
  },
  actions: {
    changeSetting({ commit }, data: ChangeSettin) {
      commit('CHANGE_SETTING', data)
    }
  }
} as Module<SettingsState, StoreRootState>
