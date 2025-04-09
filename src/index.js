import { reactive, watch } from 'vue'

// stores/createStore.js
import { reactive, watch } from 'vue'

const createStorePersist = function ({
  data = {},
  methods = {},
  computed = {},
  persist,
}) {
  // Initialize state from storage if available
  let initialState = { ...data }
  if (
    persist &&
    typeof persist === 'object' &&
    persist !== null &&
    'key' in persist
  ) {
    const storage = persist.storage || localStorage
    const stored = storage.getItem(persist.key)
    if (stored) {
      const parsed = JSON.parse(stored)
      // Only restore specified paths if provided
      if (persist.paths) {
        persist.paths.forEach((path) => {
          const value = path.split('.').reduce((obj, key) => obj?.[key], parsed)
          if (value !== undefined) {
            path.split('.').reduce((obj, key, i, arr) => {
              if (i === arr.length - 1) {
                obj[key] = value
              } else {
                obj[key] = obj[key] || {}
                return obj[key]
              }
            }, initialState)
          }
        })
      } else {
        initialState = parsed
      }
    }
  }

  const store = reactive({
    ...initialState,
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

  // Save to storage on changes
  if (
    persist &&
    typeof persist === 'object' &&
    persist !== null &&
    'key' in persist
  ) {
    const storage = persist.storage || localStorage
    watch(
      () =>
        persist.paths
          ? persist.paths.map((path) =>
              path.split('.').reduce((obj, key) => obj?.[key], store)
            )
          : store,
      (newValue) => {
        const toStore = persist.paths
          ? persist.paths.reduce((acc, path) => {
              path.split('.').reduce((obj, key, i, arr) => {
                if (i === arr.length - 1) {
                  obj[key] = path.split('.').reduce((o, k) => o?.[k], store)
                } else {
                  obj[key] = obj[key] || {}
                  return obj[key]
                }
              }, acc)
              return acc
            }, {})
          : newValue
        storage.setItem(persist.key, JSON.stringify(toStore))
      },
      { deep: true }
    )
  }

  if (import.meta.hot) {
    const savedState = { ...initialState }

    import.meta.hot.dispose(() => {
      Object.assign(savedState, store)
    })

    import.meta.hot.accept(() => {
      Object.assign(store, savedState)
    })
  }

  return store
}

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

export { createStore as default, createStorePersist }
