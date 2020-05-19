import loadPhrases from './load-phrases'
import config from '../../common/config'
import { createT } from '../../common/utils/i18n'
import type { t } from '../../common/utils/i18n'

const enabledLangs: string[] = config('localization.enabledLangs', [])

const tFns = {}
let phrases = {}

/**
 * Get the list of languages available to use.
 */
export function getAvailableLanguages (): string[] {
  return Object.keys(phrases)
}

/**
 * Get a phrase bundle for a language.
 *
 * @param langCode - The language to get phrases for.
 */
export function getPhrases (langCode: string): object | undefined {
  return phrases[langCode]
}

/**
 * Get a translation function for a language.
 *
 * @param langCode - The language to get a translation function for.
 */
export function getT (langCode: string): t {
  let tFn = tFns[langCode]

  if (typeof tFn === 'undefined') {
    const phrasesBundle = getPhrases(langCode)

    if (typeof phrasesBundle === 'undefined') {
      throw new ReferenceError(`The language '${langCode}' is not available.`)
    }

    tFn = createT(langCode, phrasesBundle)

    tFns[langCode] = tFn
  }

  return tFn
}

/**
 * Initiliaze the localization data and functions.
 */
export async function init (): Promise<void> {
  phrases = await loadPhrases(enabledLangs)
}
