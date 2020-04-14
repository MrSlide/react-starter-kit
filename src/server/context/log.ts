import type Koa from 'koa'
import log from '../utils/log'
import type winston from 'winston'

const namespace = 'log'

declare module 'koa' {
  interface Context {
    [namespace]: winston.Logger
  }
}

function getLogger (): winston.Logger {
  const logger = log.child({
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
