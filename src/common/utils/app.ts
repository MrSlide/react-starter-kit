const env = process.env.NODE_ENV

export function isDev (): boolean {
  return env !== 'production'
}
