import type Koa from 'koa'
import config from '../../common/config'
import { getAvailableLanguages } from '../utils/i18n'

const namespace = 'lang'

declare module 'koa' {
  interface Context {
    [namespace]: string
  }
}

const defaultLang: string = config('localization.defaultLang')
const langMapping: object = config('localization.langMapping', {})

/**
 * Get the preferred language from the route parameters.
 * This relies on the route having a `lang` parameter set up.
 *
 * @param ctx - The context of the request.
 * @param availableLangs - The list of available languages.
 */
function fromParams (ctx: Koa.Context, availableLangs: string[]): string | undefined {
  const { params: { lang = null } = {} } = ctx

  if (!availableLangs.includes(lang)) {
    return
  }

  return lang
}

/**
 * Get the preferred language from the `Accept-Language` request header.
 *
 * @param ctx - The context of the request.
 * @param availableLangs - The list of available languages.
 */
function fromHeader (ctx: Koa.Context, availableLangs: string[]): string | undefined {
  const langCode = ctx.acceptsLanguages(availableLangs)

  if (typeof langCode === 'string') {
    return langCode
  }
}

/**
 * Get the preferred language for the request.
 * If no preferred language is detected, the default will be returned.
 */
function getLang (): string {
  const availableLangs = getAvailableLanguages()
  let preferredLang

  preferredLang = fromParams(this, availableLangs)
  preferredLang = preferredLang ?? fromHeader(this, availableLangs)
  preferredLang = langMapping[preferredLang] ?? preferredLang ?? defaultLang

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
