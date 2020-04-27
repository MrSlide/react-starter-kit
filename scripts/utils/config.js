const path = require('path')
const deepMerge = require('deepmerge')
const { env } = require('./env')
const { CONFIG_PATH } = require('../constants/paths')

/**
 * Creates a deep clone of a given object.
 *
 * @param {object} obj - An object to close.
 * @private
 */
function clone (obj) {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * Load the configuration object for a given namespace.
 *
 * @param {string} namespace - The namespace of the configuration to load.
 * @private
 */
function loadConfig (namespace) {
  const filePath = path.join(CONFIG_PATH, namespace)

  try {
    return clone(require(filePath))
  } catch {
    return {}
  }
}

/**
 * Clean up a configuration object or value so it's ready for consumption.
 * Private configuration keys will either be removed or have the underscore prefix removed.
 *
 * @param {*} config - A raw configuration object or value to build from.
 * @param {boolean} [isServer] - Set to `true` to include private configuration keys prefixed with underscore.
 * @private
 */
function cleanConfig (config, isServer = false) {
  if (config && typeof config === 'object') {
    const keys = Object.keys(config)

    keys.forEach(function (key) {
      const value = config[key]

      if (key.startsWith('_')) {
        delete config[key]

        if (!isServer) {
          return
        }

        key = key.substring(1)
      }

      config[key] = cleanConfig(value, isServer)
    })
  }

  return config
}

/**
 * Get a configuration for the current environment including default values.
 *
 * @param {boolean} isServer - Set to `true` to include private configuration keys prefixed with underscore.
 */
function getConfig (isServer) {
  const defaultConf = loadConfig('default')
  const envConf = loadConfig(env)
  const config = deepMerge(defaultConf, envConf)

  return cleanConfig(config, isServer)
}

module.exports = getConfig
