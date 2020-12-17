import { ComponentSize } from '@/types/common'
import Cookies from 'js-cookie'
import { Module } from 'vuex'
import { StoreRootState } from '..'

export interface AppState {
  sidebar: {
    opened: boolean
    withoutAnimation: boolean
  }
  device: 'desktop' | 'mobile'

  size: ComponentSize
}

export default {
  namespaced: true,
  state: {
    sidebar: {
      opened: Cookies.get('sidebarStatus')
        ? !!Cookies.get('sidebarStatus')
        : true,
      withoutAnimation: false
    },
    device: 'desktop',
    size: (Cookies.get('size') as ComponentSize) || 'medium'
  },
  mutations: {
    TOGGLE_SIDEBAR: state => {
      state.sidebar.opened = !state.sidebar.opened
      state.sidebar.withoutAnimation = false
      if (state.sidebar.opened) {
        Cookies.set('sidebarStatus', '1')
      } else {
        Cookies.set('sidebarStatus', '0')
      }
    },
    CLOSE_SIDEBAR: (state, withoutAnimation) => {
      Cookies.set('sidebarStatus', '0')
      state.sidebar.opened = false
      state.sidebar.withoutAnimation = withoutAnimation
    },
    TOGGLE_DEVICE: (state, device) => {
      state.device = device
    },
    SET_SIZE: (state, size) => {
      state.size = size
      Cookies.set('size', size)
    }
  },
  actions: {
    toggleSideBar({ commit }) {
      commit('TOGGLE_SIDEBAR')
    },
    closeSideBar({ commit }, { withoutAnimation }) {
      commit('CLOSE_SIDEBAR', withoutAnimation)
    },
    toggleDevice({ commit }, device: string) {
      commit('TOGGLE_DEVICE', device)
    },
    setSize({ commit }, size: ComponentSize) {
      commit('SET_SIZE', size)
    }
  }
} as Module<AppState, StoreRootState>
