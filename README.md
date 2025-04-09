# @harianto/vue-createstore

A lightweight utility for creating reactive stores in Vue 3 applications. This package provides a simple way to create stores with reactive state, methods, and computed properties.

## Features

- Create reactive stores with a simple API
- Support for reactive state, methods, and computed properties
- Persistent storage with customizable options
- Hot Module Replacement (HMR) support for development
- Lightweight and zero dependencies (except Vue 3)
- TypeScript friendly

## Installation

```bash
# Using npm
npm install @harianto/vue-createstore

# Using yarn
yarn add @harianto/vue-createstore

# Using pnpm
pnpm add @harianto/vue-createstore
```

## Usage

### Basic Store

```javascript
import createStore from '@harianto/vue-createstore'

// Create a store
const store = createStore({
  // Reactive state
  data: {
    count: 0,
    todos: []
  },
  
  // Methods
  methods: {
    increment() {
      this.count++
    },
    addTodo(text) {
      this.todos.push({ id: Date.now(), text, completed: false })
    }
  },
  
  // Computed properties
  computed: {
    completedTodos() {
      return this.todos.filter(todo => todo.completed)
    },
    pendingTodos() {
      return this.todos.filter(todo => !todo.completed)
    }
  }
})

// Use the store in your components
console.log(store.count) // 0
store.increment()
console.log(store.count) // 1

store.addTodo('Learn Vue')
console.log(store.todos) // [{ id: 1234567890, text: 'Learn Vue', completed: false }]
console.log(store.pendingTodos) // [{ id: 1234567890, text: 'Learn Vue', completed: false }]
```

### Persistent Store

```javascript
import { createStorePersist } from '@harianto/vue-createstore'

// Create a persistent store
const store = createStorePersist({
  // Reactive state
  data: {
    count: 0,
    todos: []
  },
  
  // Methods
  methods: {
    increment() {
      this.count++
    },
    addTodo(text) {
      this.todos.push({ id: Date.now(), text, completed: false })
    }
  },
  
  // Computed properties
  computed: {
    completedTodos() {
      return this.todos.filter(todo => todo.completed)
    }
  },
  
  // Persistence options
  persist: {
    key: 'my-app-store', // Storage key
    storage: localStorage, // Storage mechanism (defaults to localStorage)
    paths: ['todos'] // Only persist specific paths (optional)
  }
})

// The store will automatically load saved state on initialization
// and save changes to storage
```

## API

### createStore(options)

Creates a new reactive store.

#### Parameters

- `options` (Object): Configuration object
  - `data` (Object): Initial reactive state
  - `methods` (Object): Methods that can modify the state
  - `computed` (Object): Computed properties that depend on the state

#### Returns

- A reactive store object that combines the state, methods, and computed properties

### createStorePersist(options)

Creates a new reactive store with persistence.

#### Parameters

- `options` (Object): Configuration object
  - `data` (Object): Initial reactive state
  - `methods` (Object): Methods that can modify the state
  - `computed` (Object): Computed properties that depend on the state
  - `persist` (Object): Persistence configuration
    - `key` (String): Storage key for saving state
    - `storage` (Object): Storage mechanism (defaults to localStorage)
    - `paths` (Array): Only persist specific paths (optional)

#### Returns

- A reactive store object that combines the state, methods, and computed properties, with automatic persistence

## Hot Module Replacement

The store automatically supports Hot Module Replacement (HMR) in development environments. When you make changes to your store configuration, the state will be preserved.

## License

ISC

## Author

Harianto van Insulinde 