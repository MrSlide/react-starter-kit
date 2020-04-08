import { deepFreeze } from '../utils/object'

const config = deepFreeze(JSON.parse(process.env.CONFIG))

function tokenizeKey (key: string): string[] {
  return key.split('.')
}

export function getValue (key: string): any {
  const tokens = tokenizeKey(key)

  return tokens.reduce(function (acc, token): any {
    const value = acc[token]

    if (typeof value === 'undefined') {
      throw new Error(`The key '${key}' does not exist in the configuration.`)
    }

    return value
  }, config)
}

export default function get (key?: string): any {
  if (typeof key === 'undefined') {
    return config
  }

  return getValue(key)
}
