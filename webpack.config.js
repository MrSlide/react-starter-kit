'use strict'

require('./env')

const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const { EnvironmentPlugin } = require('webpack')
const LoadablePlugin = require('@loadable/webpack-plugin')
const nodeExternals = require('webpack-node-externals')
const getConfig = require('./scripts/utils/config')
const { env, isDevelopment } = require('./scripts/utils/env')

const browserlistTargets = {
  legacy: '> 0.5%',
  modern: 'since 2020',
  node: 'current node'
}
const cacheDirectory = path.join(__dirname, '.cache')
const baseConfig = {
  bail: true,
  devtool: 'source-map',
  mode: isDevelopment ? 'development' : 'production',
  node: {
    __dirname: false,
    __filename: false
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          automaticNameDelimiter: '-',
          chunks: 'all',
          name: 'vendor',
          test: /[\\/]node_modules[\\/]/
        }
      }
    }
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
 */
function getIsServer (bundle) {
  return bundle === 'server'
}

/**
 * Get the chunk output file name format.
 *
 * @param {string} bundle - The type of bundle being built.
 */
function getChunkFilename (bundle) {
  const isServer = getIsServer(bundle)

  if (isDevelopment || isServer) {
    return '[name].js'
  }

  return '[name]-[contenthash:8].js'
}

/**
 * Get the bundle output file name format.
 *
 * @param {string} bundle - The type of bundle being built.
 */
function getBundleFilename (bundle) {
  const isServer = getIsServer(bundle)

  if (isServer || isDevelopment) {
    return 'index.js'
  }

  return 'index-[contenthash:8].js'
}

/**
 * Get the Webpack plugins to be used to build the bundle.
 *
 * @param {string} bundle - The type of bundle being built.
 */
function getPlugins (bundle) {
  const isServer = getIsServer(bundle)
  const output = [
    new EnvironmentPlugin({
      CONFIG: isServer ? serverAppConfig : clientAppConfig,
      NODE_ENV: env,
      RUNTIME_ENV: isServer ? 'node' : 'browser'
    }),
    new LoadablePlugin()
  ]

  if (isServer) {
    output.push(new CopyPlugin([
      { from: './src/common/translations', to: 'translations' },
      { from: './src/server/views', to: 'views' }
    ]))
  }

  return output
}

/**
 * Get the Webpack configuration for the bundle.
 *
 * @param {string} bundle - The type of bundle being built.
 */
function getBundleConfig (bundle) {
  const isServer = getIsServer(bundle)

  return {
    ...baseConfig,
    entry: {
      [bundle]: `./src/${isServer ? 'server' : 'client'}/index.ts`
    },
    externals: isServer ? nodeExternals() : {},
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
      chunkFilename: getChunkFilename(bundle),
      filename: getBundleFilename(bundle),
      path: path.join(__dirname, `build${isServer ? '' : `/static/scripts/${bundle}`}`)
    },
    plugins: getPlugins(bundle),
    target: isServer ? 'node' : 'web'
  }
}

module.exports = ['server', 'legacy', 'modern'].map(getBundleConfig)
