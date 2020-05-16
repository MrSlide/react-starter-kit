import Polyglot from 'node-polyglot'

/**
 * Flag missing translations by throwing an error.
 * This is used to prevent missing translations going unnoticed.
 *
 * @param key - The missing translation key.
 * @param opts - Interpolation options.
 * @param langCode - The current language code.
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
 */
export default function getT (langCode: string, phrases: object): Polyglot['t'] {
  const polyglot = new Polyglot({
    locale: langCode,
    onMissingKey,
    phrases
  })

  return polyglot.t.bind(polyglot)
}
