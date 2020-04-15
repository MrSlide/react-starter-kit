import { v4 as uuidv4 } from 'uuid'
import type Koa from 'koa'

const namespace = 'traceId'

declare module 'koa' {
  interface Context {
    [namespace]: string
  }
}

function getTraceId (): string {
  const traceId = uuidv4()

  Object.defineProperty(this, 'traceId', {
    enumerable: true,
    value: traceId
  })

  return traceId
}

export default function setup (app: Koa): void {
  Object.defineProperty(app.context, namespace, {
    enumerable: true,
    get: getTraceId
  })
}
