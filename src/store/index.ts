import { createStore } from 'vuex'
import getters from './getters'
import { AppState } from './modules/app'
import { ErrorLogState } from './modules/errorLog'
import { PermissionState } from './modules/permission'
import { SettingsState } from './modules/settings'
import { TagsViewState } from './modules/tagsView'
import { UserState } from './modules/user'

// 加载所有模块。
function loadModules() {
  const context = require.context('./modules', false, /([a-z_]+)\.ts$/i)

  const modules = context
    .keys()
    .map(key => ({ key, name: key.match(/([a-z_]+)\.ts$/i)?.[1] }))
    .reduce(
      (modules, { key, name }) => ({
        ...modules,
        [name as string]: context(key).default
      }),
      {}
    )

  return { context, modules }
}

const { context, modules } = loadModules()

const store = createStore<StoreRootState>({
  getters,
  modules
})

export default store

if (module.hot) {
  // 在任何模块发生改变时进行热重载。
  module.hot.accept(context.id, () => {
    const { modules } = loadModules()

    store.hotUpdate({
      modules
    })
  })
}

export interface StoreRootState {
  app: AppState
  errorLog: ErrorLogState
  permission: PermissionState
  settings: SettingsState
  tagsView: TagsViewState
  user: UserState
}
