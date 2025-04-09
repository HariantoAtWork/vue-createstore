import { reactive } from 'vue'

const createStore = function ({ data = {}, methods = {}, computed = {} }) {
  const store = reactive({
    ...data,
    ...methods,
    ...Object.entries(computed).reduce(
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
    const savedState = { ...data }

    import.meta.hot.dispose(() => {
      Object.assign(savedState, store)
    })

    import.meta.hot.accept(() => {
      Object.assign(store, savedState)
    })
  }

  return store
}

export { createStore as default }
