'use strict'

require('./env')

const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const { EnvironmentPlugin } = require('webpack')
const getConfig = require('./scripts/utils/config')
const { env, isDevelopment } = require('./scripts/utils/env')
const { dependencies, version } = require('./package.json')

const browserlistTargets = {
  legacy: '> 0.5%',
  modern: 'since 2020',
  node: 'current node'
}
const externals = Object.keys(dependencies)
const cacheDirectory = path.join(__dirname, '.cache/webpack')
const baseConfig = {
  bail: true,
  cache: {
    cacheDirectory,
    type: 'filesystem',
    version
  },
  devtool: 'source-map',
  mode: isDevelopment ? 'development' : 'production',
  optimization: {
    minimizer: [new TerserPlugin({
      cache: path.join(cacheDirectory, 'terser'),
      extractComments: false,
      sourceMap: true
    })],
    nodeEnv: isDevelopment ? 'development' : 'production',
    noEmitOnErrors: true
  },
  resolve: {
    extensions: ['.wasm', '.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
  }
}

const clientAppConfig = JSON.stringify(getConfig())
const serverAppConfig = JSON.stringify(getConfig(true))

function getPlugins (bundle) {
  const isServer = bundle === 'server'
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

function externalizeModules ({ context, request }, cb) {
  if (externals.includes(request)) {
    return cb(null, 'commonjs ' + request)
  }

  cb()
}

function getBundleFilename (bundle) {
  const isServer = bundle === 'server'

  if (isServer) {
    return 'index.js'
  }

  if (isDevelopment) {
    return `${bundle}.js`
  }

  return `${bundle}-[contenthash].js`
}

function getBundleConfig (bundle) {
  const isServer = bundle === 'server'

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
              cacheCompression: false,
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
    node: {
      __dirname: false,
      __filename: false,
      global: false
    },
    output: {
      filename: getBundleFilename(bundle),
      hashDigestLength: 8,
      path: path.join(__dirname, `build${isServer ? '' : '/static/scripts'}`)
    },
    plugins: getPlugins(bundle),
    target: isServer ? 'node' : 'web'
  }
}

module.exports = ['server', 'modern', 'legacy'].map(getBundleConfig)
