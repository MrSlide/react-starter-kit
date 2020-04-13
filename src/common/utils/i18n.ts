import Polyglot from 'node-polyglot'

export interface LangCodeAttributes {
  lang: string
  region?: string
}

export type t = Polyglot['t']

/**
 * Flag missing translations by throwing an error.
 * This is used to prevent missing translations going unnoticed.
 *
 * @param key - The missing translation key.
 * @param opts - Interpolation options.
 * @param langCode - The current language code.
 * @private
 */
function onMissingKey (key: string, opts: Polyglot.InterpolationOptions, langCode: string): never {
  throw new ReferenceError(`The translation key '${key}' is missing for '${langCode}'`)
}

/**
 * Create a translation function for a specific language
 * with the given set of phrases.
 *
 * @param langCode - The language code of the phrases.
 * @param phrases - Phrases to use for translations.
 * @public
 */
export function getT (langCode: string, phrases: object): t {
  const polyglot = new Polyglot({
    locale: langCode,
    onMissingKey,
    phrases
  })

  return polyglot.t.bind(polyglot)
}

/**
 * Extract the language and region attributes of a language code.
 *
 * @param langCode - The language code to be parsed.
 * @public
 */
export function getLangCodeAttributes (langCode: string): LangCodeAttributes {
  const [lang, region] = langCode.split('-')

  return {
    lang,
    region
  }
}

/**
 * Normalize a language code string to a standard format.
 *
 * @param langCode - The language code string to be normalized.
 * @public
 */
export function normalizeLangCode (langCode: string): string {
  const { lang, region } = getLangCodeAttributes(langCode)
  let output = lang.toLowerCase()

  if (typeof region === 'string') {
    output += `-${region.toUpperCase()}`
  }

  return output
}
