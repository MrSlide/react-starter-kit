export interface LangCodeAttributes {
  lang: string
  region?: string
}

/**
 * Extract the language and region attributes of a language code.
 *
 * @param langCode - The language code to be parsed.
 */
export default function getLangCodeAttributes (langCode: string): LangCodeAttributes {
  let [lang, region] = langCode.split('-')

  lang = lang.toLowerCase()

  if (typeof region !== 'undefined') {
    region = region.toUpperCase()
  } else {
    region = null
  }

  return {
    lang,
    region
  }
}
