// stores/createStore.js
import { reactive } from 'vue'

export function createStore({ state = {}, methods = {}, getters = {} }) {
  const store = reactive({
    ...state,
    ...methods,
    ...Object.entries(getters).reduce(
      (acc, [key, fn]) => ({
        ...acc,
        get [key]() {
          return fn(store)
        },
      }),
      {}
    ),
  })

  if (import.meta.hot) {
    const savedState = { ...state }

    import.meta.hot.dispose(() => {
      Object.assign(savedState, store)
    })

    import.meta.hot.accept(() => {
      Object.assign(store, savedState)
    })
  }

  return store
}
