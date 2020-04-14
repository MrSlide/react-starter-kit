import { matchesUA } from 'browserslist-useragent'
import { LEGACY_TARGET, MODERN_TARGET } from '../../common/constants/browser-targets'
import type Koa from 'koa'

const namespace = 'browserTarget'

declare module 'koa' {
  interface Context {
    [namespace]: string
  }
}

const modernTargets = {
  browsers: ['since 2020']
}

function getBrowserTarget (): string {
  const ua = this.get('user-agent')
  const isModern = typeof ua === 'string' && matchesUA(ua, modernTargets) as boolean
  const browserTarget = isModern ? MODERN_TARGET : LEGACY_TARGET

  Object.defineProperty(this, namespace, {
    enumerable: true,
    value: browserTarget
  })

  return browserTarget
}

export default function setup (app: Koa): void {
  Object.defineProperty(app.context, namespace, {
    enumerable: true,
    get: getBrowserTarget
  })
}
