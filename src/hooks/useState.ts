import { ref, UnwrapRef } from 'vue'

export default function useState<T = unknown>(defaultState: T) {
  const state = ref<T>(defaultState)

  function setState(val: T) {
    state.value = val as UnwrapRef<T>
  }
  return [state, setState]
}
