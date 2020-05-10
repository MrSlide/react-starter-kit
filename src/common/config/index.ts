import { deepFreeze } from '../utils/object'

const config = deepFreeze(JSON.parse(process.env.CONFIG))

/**
 * Break down a configuration key string into its parts.
 * Each part corresponds to a property in an object or
 * index in an array.
 *
 * @param key - The string to tokenize.
 */
function tokenizeKey (key: string): string[] {
  return key.split('.')
}

/**
 * Gets a configuration value associated with the given key.
 * If no value is available, either `null` or `undefined`,
 * it is possible to provide a value to default to.
 *
 * @param key - The key of the configuration value to get,
 * @param defaultValue - A value to return if no value is available.
 */
export default function get (key: string, defaultValue?: any): any {
  const tokens = tokenizeKey(key)
  let output: any = config

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]

    output = output[token]

    if (typeof output === 'undefined' || output === null) {
      break
    }
  }

  return output ?? defaultValue
}
