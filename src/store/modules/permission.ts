import { asyncRoutes, constantRoutes } from '@/router'
import store from '..'
import { RouteRecordRaw } from 'vue-router'
import {
  config,
  Action,
  getModule,
  Module,
  Mutation,
  VuexModule
} from 'vuex-module-decorators'
config.rawError = true

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles: string[], route: RouteRecordRaw) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta?.roles?.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes: RouteRecordRaw[], roles: string[]) {
  const res: RouteRecordRaw[] = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

@Module({ namespaced: true, name: 'permission', store, dynamic: true })
class Permission extends VuexModule {
  routes: RouteRecordRaw[] = []
  addRoutes: RouteRecordRaw[] = []

  @Mutation
  SET_ROUTES(routes: RouteRecordRaw[]) {
    this.addRoutes = routes
    this.routes = constantRoutes.concat(routes)
  }

  @Action
  async generateRoutes(roles?: string[]) {
    let accessedRoutes
    if (roles?.includes('admin')) {
      accessedRoutes = asyncRoutes || []
    } else {
      accessedRoutes = filterAsyncRoutes(asyncRoutes, roles ?? [])
    }
    this.SET_ROUTES(accessedRoutes)
    return accessedRoutes
  }
}

export const PermissionModule = getModule(Permission)
