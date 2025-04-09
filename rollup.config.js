// Import required Rollup plugins
import resolve from '@rollup/plugin-node-resolve' // Resolves node modules in node_modules
import commonjs from '@rollup/plugin-commonjs' // Converts CommonJS modules to ES6 for Rollup
import terser from '@rollup/plugin-terser' // Minifies the output bundle
import vuePlugin from 'rollup-plugin-vue' // Processes Vue single-file components
import replace from '@rollup/plugin-replace' // Replaces strings in the bundle
import postcss from 'rollup-plugin-postcss' // Processes CSS/SCSS files
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve as resolvePath } from 'path'

// Set up file paths for ESM compatibility
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Read package.json for version and other metadata
const pkg = JSON.parse(
  readFileSync(resolvePath(__dirname, './package.json'), 'utf8')
)

// Create a banner comment for the output files
const banner = `/*!
  * ${pkg.name} v${pkg.version}
  * (c) ${new Date().getFullYear()} ${pkg.author}
  * Released under the ${pkg.license} License
  */`

// List of external dependencies that should not be bundled
const external = ['vue', 'vue/dist/vue.esm-bundler', /^vue\/.*/, /^@vue\/.*/]

// Main Rollup configuration
export default {
  // Entry point for the bundle
  input: 'src/index.js',

  // Dependencies that should not be included in the bundle
  external,

  // Output configurations for different formats
  output: [
    {
      // UMD (Universal Module Definition) format for browser and Node.js
      file: pkg.main, // Output file path from package.json
      format: 'umd', // Output format
      name: 'VueNotificationCenter', // Global variable name for UMD
      exports: 'named', // Export named exports
      globals: {
        // Map external dependencies to global variables
        vue: 'Vue',
        'vue/dist/vue.esm-bundler': 'Vue',
      },
      banner, // Add banner comment to the output
      sourcemap: true, // Generate source maps for debugging
    },
    {
      // ES Module format for modern environments
      file: pkg.module, // Output file path from package.json
      format: 'es', // Output format
      exports: 'named', // Export named exports
      banner, // Add banner comment to the output
      sourcemap: true, // Generate source maps for debugging
    },
  ],

  // Plugins to transform the code
  plugins: [
    // Replace environment variables and other strings
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
      preventAssignment: true,
      values: {
        'vue/dist/vue.esm-bundler': 'vue', // Replace ESM bundler import with standard Vue import
      },
    }),

    // Process Vue single-file components
    vuePlugin({
      css: true, // Extract CSS from Vue components
      template: {
        isProduction: true, // Optimize templates for production
      },
    }),

    // Process CSS/SCSS files
    postcss({
      extract: true, // Extract CSS to a separate file
      modules: false, // Don't use CSS modules
      use: ['sass'], // Use SASS for processing
      minimize: true, // Minify the CSS
      sourceMap: true, // Generate source maps for CSS
    }),

    // Resolve node modules
    resolve({
      browser: true, // Prefer browser versions of modules
      preferBuiltins: false, // Don't prefer Node.js built-in modules
      extensions: ['.js', '.vue'], // File extensions to resolve
      mainFields: ['module', 'main'], // Fields to check in package.json
    }),

    // Convert CommonJS modules to ES6
    commonjs({
      include: /node_modules/, // Only process node_modules
      extensions: ['.js', '.vue'], // File extensions to process
    }),

    // Minify the output
    terser({
      format: {
        comments: false, // Remove comments from the output
      },
    }),
  ],
}
