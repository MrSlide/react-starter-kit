import type Koa from 'koa'
import fromParams from './from-params'
import fromAcceptHeader from './from-accept-header'
import config from '../../../common/config'
import { getAvailableLanguages } from '../../i18n'

const namespace = 'lang'

declare module 'koa' {
  interface Context {
    [namespace]: string
  }
}

const defaultLang: string = config('localization.defaultLang')

if (typeof defaultLang !== 'string') {
  throw new Error('Missing default language in configuration.')
}

/**
 * Get the preferred language for the request.
 * If no preferred language is detected, the default will be returned.
 */
function getLang (): string {
  const availableLangs = getAvailableLanguages()
  let preferredLang

  preferredLang = fromParams(this, availableLangs)
  preferredLang = preferredLang ?? fromAcceptHeader(this, availableLangs)
  preferredLang = preferredLang ?? defaultLang

  Object.defineProperty(this, namespace, {
    enumerable: true,
    value: preferredLang
  })

  return preferredLang
}

/**
 * Set up a base context property on an application instance.
 *
 * @param app - The application instance to update.
 */
export default function setup (app: Koa): void {
  Object.defineProperty(app.context, namespace, {
    enumerable: true,
    get: getLang
  })
}
