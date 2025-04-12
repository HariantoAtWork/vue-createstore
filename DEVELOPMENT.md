# Development Guide

This document provides guidelines and instructions for developing the Vue CreateStore package.
Test

## Prerequisites

- Node.js >= 20.18.3 (as specified in .nvmrc)
- PNPM >= 8.0.0 (Tested with v8.15.4)
- Git

## Dependencies

### Core Dependencies
- Vue.js: ^3.0.0 (peer dependency)

### Development Dependencies
- @rollup/plugin-commonjs: ^28.0.3
- @rollup/plugin-node-resolve: ^16.0.1
- @rollup/plugin-terser: ^0.4.4
- rollup: ^4.39.0
- rollup-plugin-vue: ^6.0.0

## Getting Started

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/HariantoAtWork/vue-createstore.git
   cd vue-createstore
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Build the package:
   ```bash
   pnpm run build
   ```

## Project Structure

```
vue-createstore/
├── src/                  # Source code
│   └── index.js          # Main entry point with createStore and createStorePersist
├── dist/                 # Built files (generated, not committed)
│   ├── index.esm.js      # ES Module build
│   └── index.umd.js      # UMD build
├── rollup.config.js      # Rollup configuration
├── package.json          # Package configuration
├── .nvmrc                # Node.js version specification
└── .github/              # GitHub configuration
    └── workflows/        # GitHub Actions workflows
```

## Development Workflow

### Building

The package uses Rollup for building. The build process generates:

- UMD build: `dist/index.umd.js`
- ESM build: `dist/index.esm.js`

To build the package:
```bash
pnpm run build
```

### Testing Locally

To test the package locally in another project:

1. Build the package:
   ```bash
   pnpm run build
   ```

2. Link the package:
   ```bash
   pnpm link --global
   ```

3. In your test project:
   ```bash
   pnpm link --global @harianto/vue-createstore
   ```

### Version Management

The project uses GitHub Actions for version management. To create a new version:

1. Go to the "Actions" tab in your GitHub repository
2. Select the "Version Management" workflow
3. Click "Run workflow"
4. Choose the version type (major, minor, or patch)
5. Click "Run workflow"

This will:
- Update the version in package.json
- Create a git tag
- Create a GitHub release
- Trigger the release workflow to publish to npm

## API Reference

### createStore

Creates a reactive store with state, methods, and computed properties.

```javascript
import createStore from '@harianto/vue-createstore'

const store = createStore({
  data: {
    count: 0
  },
  methods: {
    increment() {
      this.count++
    }
  },
  computed: {
    doubleCount() {
      return this.count * 2
    }
  }
})
```

### createStorePersist

Creates a reactive store with persistence.

```javascript
import { createStorePersist } from '@harianto/vue-createstore'

const store = createStorePersist({
  data: {
    todos: []
  },
  methods: {
    addTodo(text) {
      this.todos.push({ id: Date.now(), text, completed: false })
    }
  },
  persist: {
    key: 'my-app-store',
    storage: localStorage,
    paths: ['todos']
  }
})
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Commit your changes: `git commit -m 'Add some feature'`
5. Push to the branch: `git push origin feature/my-feature`
6. Submit a pull request

## License

ISC 