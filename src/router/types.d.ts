import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
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

  interface _RouteRecordBase {
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
  }
}
