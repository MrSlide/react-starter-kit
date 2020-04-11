import { nonce } from '../utils/csp'
import type Koa from 'koa'

function getNonce (): string {
  return nonce(this.res)
}

declare module 'koa' {
  interface Context {
    nonce: string
  }
}

export default function setup (app: Koa): void {
  Object.defineProperty(app.context, 'nonce', {
    enumerable: true,
    get: getNonce
  })
}
