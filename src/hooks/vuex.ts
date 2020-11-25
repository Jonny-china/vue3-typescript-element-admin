import store, { StoreRootState } from '@/store'
import getters from '@/store/getters'

/** state */
export function useSelector<TSelected = unknown>(
  selector: (state: StoreRootState) => TSelected
) {
  return selector(store.state) as TSelected
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
