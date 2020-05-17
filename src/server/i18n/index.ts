import loadPhrases from './load-phrases'
import config from '../../common/config'
import { unique } from '../../common/utils/array'
import { createT } from '../../common/utils/i18n'
import type { t } from '../../common/utils/i18n'

const defaultLang: string = config('localization.defaultLang')
const langMapping: object = config('localization.langMapping', {})

const tFns = {}
let phrases = {}

/**
 * Get the list of languages available to use.
 */
export function getAvailableLanguages (): string[] {
  const loadedLangs = Object.keys(phrases)
  const mappedLangs = Object.keys(langMapping).filter(function (langCode) {
    return loadedLangs.includes(langMapping[langCode])
  })

  return unique([...loadedLangs, ...mappedLangs])
}

/**
 * Get a phrase bundle for a language.
 *
 * @param langCode - The language to get phrases for.
 */
export function getPhrases (langCode: string): object {
  const bundle = phrases[langCode]

  if (typeof bundle === 'undefined') {
    throw new ReferenceError(`The language '${langCode}' is not available.`)
  }

  return bundle
}

/**
 * Get a translation function for a language.
 *
 * @param langCode - The language to get a translation function for.
 */
export function getT (langCode: string): t {
  let tFn = tFns[langCode]

  if (typeof tFn === 'undefined') {
    tFn = createT(langCode, getPhrases(langCode))

    tFns[langCode] = tFn
  }

  return tFn
}

/**
 * Initiliaze the localization data and functions.
 */
export async function init (): Promise<void> {
  if (typeof defaultLang !== 'string') {
    throw new Error('No default language is set in the configuration.')
  }

  phrases = await loadPhrases()
}
