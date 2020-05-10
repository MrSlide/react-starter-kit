import type Koa from 'koa'
import log from '../logger'

const namespace = 'log'

declare module 'koa' {
  interface Context {
    [namespace]: typeof log
  }
}

function getLogger (): typeof log {
  const logger = log.extend({
    payload: {
      headers: this.headers,
      ip: this.ip,
      method: this.method,
      origin: this.origin,
      path: this.path,
      query: this.query,
      traceId: this.traceId
    }
  })

  Object.defineProperty(this, namespace, {
    value: logger
  })

  return logger
}

export default function setup (app: Koa): void {
  Object.defineProperty(app.context, namespace, {
    get: getLogger
  })
}
