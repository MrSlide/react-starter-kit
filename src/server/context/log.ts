import type Koa from 'koa'
import log from '../utils/log'
import type winston from 'winston'

function getLogger (): winston.Logger {
  const req = this.req
  const existingLogger = req.log

  if (typeof existingLogger === 'function') {
    return existingLogger
  }

  const logger = log.child({
    traceId: this.traceId
  })

  req.log = logger

  return logger
}

declare module 'koa' {
  interface Context {
    log: winston.Logger
  }
}

export default function setup (app: Koa): void {
  Object.defineProperty(app.context, 'log', {
    get: getLogger
  })
}
