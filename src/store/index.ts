import { createStore } from 'vuex'

const store = createStore({})

export default store
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

if (module.hot) {
  const { context } = loadModules()
  // 在任何模块发生改变时进行热重载。
  module.hot.accept(context.id, () => {
    const { modules } = loadModules()

    store.hotUpdate({
      modules
    })
  })
}
