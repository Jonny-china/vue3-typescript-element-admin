import {
  config,
  getModule,
  Module,
  MutationAction,
  VuexModule
} from 'vuex-module-decorators'
import store from '..'

config.rawError = true

@Module({ namespaced: true, dynamic: true, store, name: 'errorLog' })
class ErrorLog extends VuexModule {
  logs: any[] = []

  @MutationAction
  async addErrorLog(log: any) {
    return { logs: [...this.logs, log] }
  }

  @MutationAction
  async clearErrorLog() {
    return { logs: [] as any[] }
  }
}

export const ErrorLogModule = getModule(ErrorLog)
