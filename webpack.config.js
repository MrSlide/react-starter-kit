'use strict'

require('./env')

const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const { EnvironmentPlugin } = require('webpack')
const getConfig = require('./scripts/utils/config')
const { env, isDevelopment } = require('./scripts/utils/env')
const { dependencies } = require('./package.json')

const browserlistTargets = {
  legacy: '> 0.5%',
  modern: 'since 2020',
  node: 'current node'
}
const externals = Object.keys(dependencies)
const cacheDirectory = path.join(__dirname, '.cache')
const baseConfig = {
  bail: true,
  devtool: 'source-map',
  mode: isDevelopment ? 'development' : 'production',
  node: {
    __dirname: false,
    __filename: false
  },
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.json']
  }
}

const clientAppConfig = JSON.stringify(getConfig())
const serverAppConfig = JSON.stringify(getConfig(true))

/**
 * Verify if the bundle being built is for a server environment.
 *
 * @param {string} bundle - The type of bundle being built.
 * @private
 */
function getIsServer (bundle) {
  return bundle === 'server'
}

/**
 * Verify if a module should be loaded externally.
 *
 * @param {object} context
 * @param {string} request
 * @param {function} cb
 * @private
 */
function externalizeModules (context, request, cb) {
  if (externals.includes(request)) {
    return cb(null, 'commonjs ' + request)
  }

  cb()
}

/**
 * Get the bundle output file name.
 *
 * @param {string} bundle - The type of bundle being built.
 * @private
 */
function getBundleFilename (bundle) {
  const isServer = getIsServer(bundle)

  if (isServer) {
    return 'index.js'
  }

  if (isDevelopment) {
    return `${bundle}.js`
  }

  return `${bundle}-[contenthash:8].js`
}

/**
 * Get the Webpack plugins to be used to build the bundle.
 *
 * @param {string} bundle - The type of bundle being built.
 * @private
 */
function getPlugins (bundle) {
  const isServer = getIsServer(bundle)
  const output = [
    new EnvironmentPlugin({
      CONFIG: isServer ? serverAppConfig : clientAppConfig,
      NODE_ENV: env
    })
  ]

  if (isServer) {
    output.push(new CopyPlugin([
      { from: './src/server/views', to: 'views' }
    ]))
  }

  return output
}

/**
 * Get the Webpack configuration for the bundle.
 *
 * @param {string} bundle - The type of bundle being built.
 * @private
 */
function getBundleConfig (bundle) {
  const isServer = getIsServer(bundle)

  return {
    ...baseConfig,
    entry: {
      [bundle]: `./src/${isServer ? 'server' : 'client'}/index.ts`
    },
    externals: isServer ? externalizeModules : [],
    module: {
      rules: [
        {
          exclude: /node_modules/,
          test: /\.(j|t)sx?$/,
          use: {
            loader: 'babel-loader',
            options: {
              cacheDirectory: path.join(cacheDirectory, 'babel-loader'),
              caller: {
                targets: browserlistTargets[bundle]
              }
            }
          }
        }
      ]
    },
    name: bundle,
    output: {
      filename: getBundleFilename(bundle),
      path: path.join(__dirname, `build${isServer ? '' : '/static/scripts'}`)
    },
    plugins: getPlugins(bundle),
    target: isServer ? 'node' : 'web'
  }
}

module.exports = ['server', 'modern', 'legacy'].map(getBundleConfig)
