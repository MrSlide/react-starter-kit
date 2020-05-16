import getLangCodeAttributes from './get-lang-code-attributes'

/**
 * Normalize a language code string to a standard format.
 *
 * @param langCode - The language code string to be normalized.
 */
export default function normalizeLangCode (langCode: string): string {
  const { lang, region } = getLangCodeAttributes(langCode)
  let output = lang

  if (typeof region === 'string') {
    output += `-${region}`
  }

  return output
}
