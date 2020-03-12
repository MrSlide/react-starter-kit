import { nonce } from '../utils/csp'
import type Koa from 'koa'

export function getNonce (): string {
  return nonce(this.res)
}

export default function setup (app: Koa): void {
  Object.defineProperty(app.context, 'nonce', {
    enumerable: true,
    get: getNonce
  })
}
