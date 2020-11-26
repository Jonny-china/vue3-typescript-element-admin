import store, { StoreRootState } from '@/store'
import getters from '@/store/getters'
import { computed, ToRefs, toRefs } from 'vue'

/** state */
export function useSelector<
  TSelected extends Record<string, any> = Record<string, unknown>
>(selector: (state: StoreRootState) => TSelected) {
  const r = selector(store.state as StoreRootState)

  return toRefs<TSelected>(r) as ToRefs<TSelected>
}

export function useStoreState() {
  return computed(() => store.state)
}

type Getters<T extends { [i in keyof T]: (...args: any) => any }> = {
  [key in keyof T]: ReturnType<T[key]>
}

/** geeters */
export function useGetters() {
  return store.getters as Getters<typeof getters>
}

/** dispatch */
export function useDispatch() {
  return <T = any>(action: string, ...arg: any[]): Promise<T> =>
    store.dispatch(action, ...arg)
}

/** actions */
export function useActions(action: string) {
  return (...arg: any) => store.dispatch(action, ...arg)
}

/** commit */
export function useCommit() {
  return (mutation: string, ...arg: any[]) => store.commit(mutation, ...arg)
}
