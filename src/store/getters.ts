import { StoreRootState } from '.'

const getters = {
  sidebar: (state: StoreRootState) => state.app.sidebar,
  size: (state: StoreRootState) => state.app.size,
  device: (state: StoreRootState) => state.app.device,
  visitedViews: (state: StoreRootState) => state.tagsView.visitedViews,
  cachedViews: (state: StoreRootState) => state.tagsView.cachedViews,
  token: (state: StoreRootState) => state.user.token,
  avatar: (state: StoreRootState) => state.user.avatar,
  name: (state: StoreRootState) => state.user.name,
  introduction: (state: StoreRootState) => state.user.introduction,
  roles: (state: StoreRootState) => state.user.roles,
  permission_routes: (state: StoreRootState) => state.permission.routes,
  errorLogs: (state: StoreRootState) => state.errorLog.logs
}

export default getters
