import type Koa from 'koa'
import log from '../../common/utils/log'

const namespace = 'log'

declare module 'koa' {
  interface Context {
    [namespace]: typeof log
  }
}

function getLogger (): typeof log {
  const logger = log.extend({
    headers: this.headers,
    ip: this.ip,
    method: this.method,
    origin: this.origin,
    path: this.path,
    query: this.query,
    traceId: this.traceId
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
