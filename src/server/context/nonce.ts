import { nonce } from '../utils/csp'
import type Koa from 'koa'

const namespace = 'nonce'

declare module 'koa' {
  interface Context {
    [namespace]: string
  }
}

function getNonce (): string {
  return nonce(this.res)
}

export default function setup (app: Koa): void {
  Object.defineProperty(app.context, namespace, {
    enumerable: true,
    get: getNonce
  })
}
