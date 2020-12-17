import {
  createRouter,
  createWebHistory,
  RouteMeta,
  RouteRecordRaw
} from 'vue-router'

import Layout from '@/layout/index.vue'

/**
 * 自定义 路由参数
 */
export type RouteConfig = RouteRecordRaw & {
  /**
   * if set true, item will not show in the sidebar(default is false)
   */
  hidden?: boolean

  /**
   * if set true, will always show the root menu
   * if not set alwaysShow, when item has more than one children route,
   * it will becomes nested mode, otherwise not show the root menu
   */
  alwaysShow?: boolean

  meta?: RouteMeta & {
    /** control the page roles (you can set multiple roles) */
    roles?: string[]
    /** the name show in sidebar and breadcrumb (recommend set) */
    title?: string
    /** the icon show in the sidebar */
    icon?: string
    /** if set true, the page will no be cached(default is false) */
    noCache?: boolean
    /** if set true, the tag will affix in the tags-view */
    affix?: boolean
    /** if set false, the item will hidden in breadcrumb(default is true) */
    breadcrumb?: boolean
    /** if set path, the sidebar will highlight the path you set */
    activeMenu?: string
  }
}

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes: RouteConfig[] = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/Redirect')
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/Dashboard/index.vue'),
        name: 'Dashboard',
        meta: { title: 'Dashboard', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login/index.vue'),
    hidden: true
  }
]

export const asyncRoutes: RouteConfig[] = [
  {
    path: '/login2',
    name: 'Login2',
    component: () => import('@/views/Login/index.vue'),
    hidden: true
  },
  {
    path: '/clipboard',
    component: Layout,
    redirect: '/clipboard/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/Clipboard/index.vue'),
        name: 'ClipboardDemo',
        meta: { title: 'Clipboard', icon: 'clipboard' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  scrollBehavior: (to, from, savedPosition) => {
    return savedPosition ?? { left: 0, top: 0 }
  },
  routes: constantRoutes
})

export function resetRouter() {
  asyncRoutes.forEach(route => {
    router.removeRoute(route.name as string)
  })
}

export default router
