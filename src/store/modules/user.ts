import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import { RouteRecordRaw } from 'vue-router'
import {
  config,
  getModule,
  Module,
  MutationAction,
  VuexModule
} from 'vuex-module-decorators'
config.rawError = true

import store from '..'

export interface UserState {
  token: string
  name: string
  avatar: string
  introduction: string
  roles: string[]
}

@Module({ name: 'user', namespaced: true, store, dynamic: true })
class User extends VuexModule implements UserState {
  token: string = getToken()!
  name: string = ''
  avatar = ''
  introduction: string = ''
  roles: string[] = []

  @MutationAction({ mutate: ['token'] })
  async login(userInfo: { username: string; password: string }) {
    try {
      const { username, password } = userInfo
      const { data } = await login({ username: username.trim(), password })
      setToken(data.token)
      return { token: data.token }
    } catch (error) {
      return Promise.reject(error)
    }
  }

  @MutationAction({ mutate: ['name', 'avatar', 'introduction', 'roles'] })
  async getInfo() {
    try {
      const { data } = await getInfo((this.state as UserState).token)
      if (!data) {
        return Promise.reject('Verification failed, please Login again.')
      }

      const { roles, name, avatar, introduction } = data

      if (!roles || roles.length <= 0) {
        return Promise.reject('getInfo: roles must be a non-null array!')
      }

      return {
        roles,
        name,
        avatar,
        introduction
      }
    } catch (error) {
      return Promise.reject(error)
    }
  }

  @MutationAction({ mutate: ['token', 'roles'] })
  async logout() {
    try {
      await logout()
      removeToken()
      resetRouter()

      // reset visited views and cached views
      // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
      this.context.dispatch('TagsView/delAllViews', null, { root: true })

      return {
        token: '',
        roles: []
      }
    } catch (error) {
      return Promise.reject(error)
    }
  }

  @MutationAction({ mutate: ['token', 'roles'] })
  async resetToken() {
    try {
      removeToken()
      return {
        token: '',
        roles: []
      }
    } catch (error) {
      return Promise.reject(error)
    }
  }

  @MutationAction({ mutate: ['token'] })
  async changeRoles(role: string) {
    try {
      const token = role + '-token'

      setToken(token)

      const { roles } = await this.context.dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = (await this.context.dispatch(
        'permission/generateRoutes',
        roles,
        {
          root: true
        }
      )) as RouteRecordRaw[]
      // dynamically add accessible routes
      accessRoutes.forEach(route => {
        router.addRoute(route)
      })

      // reset visited views and cached views
      this.context.dispatch('tagsView/delAllViews', null, { root: true })

      return {
        token
      }
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

export const UserModule = getModule(User)
