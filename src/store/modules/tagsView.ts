import {
  RouteRecordName,
  RouteRecordRaw,
  RouteLocationNormalizedLoaded
} from 'vue-router'
import {
  config,
  Action,
  getModule,
  Module,
  Mutation,
  VuexModule
} from 'vuex-module-decorators'
config.rawError = true
import store from '..'

@Module({ name: 'tagsView', namespaced: true, store, dynamic: true })
class TagsView extends VuexModule {
  visitedViews: RouteRecordRaw[] = []
  cachedViews: RouteRecordName[] = []

  @Mutation
  ADD_VISITED_VIEW(view: RouteRecordRaw) {
    if (this.visitedViews.some(v => v.path === view.path)) return
    this.visitedViews.push(
      Object.assign({}, view, {
        title: view.meta?.title || 'no-name'
      })
    )
  }
  @Mutation
  ADD_CACHED_VIEW(view: RouteRecordRaw) {
    if (this.cachedViews.includes(view.name!)) return
    if (!view.meta?.noCache) {
      this.cachedViews.push(view.name!)
    }
  }

  @Mutation
  DEL_VISITED_VIEW(view: RouteRecordRaw) {
    for (const [i, v] of this.visitedViews.entries()) {
      if (v.path === view.path) {
        this.visitedViews.splice(i, 1)
        break
      }
    }
  }

  @Mutation
  DEL_CACHED_VIEW(view: RouteRecordRaw) {
    const index = this.cachedViews.indexOf(view.name!)
    index > -1 && this.cachedViews.splice(index, 1)
  }

  @Mutation
  DEL_OTHERS_VISITED_VIEWS(view: RouteRecordRaw) {
    this.visitedViews = this.visitedViews.filter(v => {
      return v.meta?.affix || v.path === view.path
    })
  }

  @Mutation
  DEL_OTHERS_CACHED_VIEWS(view: RouteRecordRaw) {
    const index = this.cachedViews.indexOf(view.name!)
    if (index > -1) {
      this.cachedViews = this.cachedViews.slice(index, index + 1)
    } else {
      // if index = -1, there is no cached tags
      this.cachedViews = []
    }
  }

  @Mutation
  DEL_ALL_VISITED_VIEWS() {
    // keep affix tags
    const affixTags = this.visitedViews.filter(tag => tag.meta?.affix)
    this.visitedViews = affixTags
  }

  @Mutation
  DEL_ALL_CACHED_VIEWS() {
    this.cachedViews = []
  }

  @Mutation
  UPDATE_VISITED_VIEW(view: RouteRecordRaw) {
    for (let v of this.visitedViews) {
      if (v.path === view.path) {
        v = Object.assign(v, view)
        break
      }
    }
  }

  @Action
  addView(view: RouteRecordRaw | RouteLocationNormalizedLoaded) {
    this.context.dispatch('addVisitedView', view)
    this.context.dispatch('addCachedView', view)
  }

  @Action
  addVisitedView(view: RouteRecordRaw | RouteLocationNormalizedLoaded) {
    this.context.commit('ADD_VISITED_VIEW', view)
  }
  @Action
  addCachedView(view: RouteRecordRaw | RouteLocationNormalizedLoaded) {
    this.context.commit('ADD_CACHED_VIEW', view)
  }
  @Action
  async delView(view: RouteRecordRaw | RouteLocationNormalizedLoaded) {
    this.context.dispatch('delVisitedView', view)
    this.context.dispatch('delCachedView', view)

    return {
      visitedViews: [...this.visitedViews],
      cachedViews: [...this.cachedViews]
    }
  }

  @Action
  delVisitedView(view: RouteRecordRaw | RouteLocationNormalizedLoaded) {
    return new Promise(resolve => {
      this.context.commit('DEL_VISITED_VIEW', view)
      resolve([...this.visitedViews])
    })
  }

  @Action
  async delCachedView(view: RouteRecordRaw | RouteLocationNormalizedLoaded) {
    this.context.commit('DEL_CACHED_VIEW', view)
    return [...this.cachedViews]
  }

  @Action
  async delOthersViews(view: RouteRecordRaw | RouteLocationNormalizedLoaded) {
    this.context.dispatch('delOthersVisitedViews', view)
    this.context.dispatch('delOthersCachedViews', view)

    return {
      visitedViews: [...this.visitedViews],
      cachedViews: [...this.cachedViews]
    }
  }

  @Action
  delOthersVisitedViews(view: RouteRecordRaw | RouteLocationNormalizedLoaded) {
    return new Promise(resolve => {
      this.context.commit('DEL_OTHERS_VISITED_VIEWS', view)
      resolve([...this.visitedViews])
    })
  }

  @Action
  delOthersCachedViews(view: RouteRecordRaw | RouteLocationNormalizedLoaded) {
    return new Promise(resolve => {
      this.context.commit('DEL_OTHERS_CACHED_VIEWS', view)
      resolve([...this.cachedViews])
    })
  }

  @Action
  async delAllViews() {
    this.context.dispatch('delAllVisitedViews')
    this.context.dispatch('delAllCachedViews')
    return {
      visitedViews: [...this.visitedViews],
      cachedViews: [...this.cachedViews]
    }
  }

  @Action
  async delAllVisitedViews() {
    this.context.commit('DEL_ALL_VISITED_VIEWS')
    return [...this.visitedViews]
  }

  @Action
  async delAllCachedViews() {
    this.context.commit('DEL_ALL_CACHED_VIEWS')
    return [...this.cachedViews]
  }

  @Action
  updateVisitedView(view: RouteRecordRaw | RouteLocationNormalizedLoaded) {
    this.context.commit('UPDATE_VISITED_VIEW', view)
  }
}

export const TagsViewModule = getModule(TagsView)
