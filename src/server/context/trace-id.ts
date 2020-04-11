import { v4 as uuidv4 } from 'uuid'
import type Koa from 'koa'

function getTraceId (): string {
  const req = this.req
  const existingTraceId = req.traceId

  if (typeof existingTraceId === 'string') {
    return existingTraceId
  }

  const traceId = uuidv4()

  req.traceId = traceId

  return traceId
}

declare module 'koa' {
  interface Context {
    traceId: string
  }
}

export default function setup (app: Koa): void {
  Object.defineProperty(app.context, 'traceId', {
    enumerable: true,
    get: getTraceId
  })
}
