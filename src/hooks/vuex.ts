import store, { StoreRootState } from '@/store'
import getters from '@/store/getters'
import { readonly, ToRefs, toRefs } from 'vue'

/** state */
export function useSelector<
  TSelected extends Record<string, any> = Record<string, unknown>
>(selector: (state: StoreRootState) => TSelected) {
  return toRefs<TSelected>(
    selector(readonly(store.state) as StoreRootState)
  ) as ToRefs<TSelected>
}

type Getters<T extends { [i in keyof T]: (...args: any) => any }> = {
  [key in keyof T]: ReturnType<T[key]>
}

/** geeters */
export function useGetters() {
  return toRefs(readonly(store.getters)) as ToRefs<Getters<typeof getters>>
}

/** dispatch */
export function useDispatch() {
  return <T = any>(action: string, ...arg: any[]): Promise<T> =>
    store.dispatch(action, ...arg)
}

/** actions */
export function useAction(action: string) {
  return (...arg: any) => store.dispatch(action, ...arg)
}

/** commit */
export function useCommit() {
  return (mutation: string, ...arg: any[]) => store.commit(mutation, ...arg)
}
