import { matchesUA } from 'browserslist-useragent'
import { LEGACY_TARGET, MODERN_TARGET } from '../../common/constants/browser-targets'
import type Koa from 'koa'

const modernTargets = {
  browsers: ['since 2020']
}

function getBrowserTarget (): string {
  const req = this.req
  const existingBrowserTarget = req.browserTarget

  if (typeof existingBrowserTarget === 'string') {
    return existingBrowserTarget
  }

  const ua = this.get('user-agent')
  const isModern = typeof ua === 'string' && matchesUA(ua, modernTargets) as boolean
  const browserTarget = isModern ? MODERN_TARGET : LEGACY_TARGET

  req.browserTarget = browserTarget

  return browserTarget
}

declare module 'koa' {
  interface Context {
    browserTarget: string
  }
}

export default function setup (app: Koa): void {
  Object.defineProperty(app.context, 'browserTarget', {
    enumerable: true,
    get: getBrowserTarget
  })
}
